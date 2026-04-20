import jsPDF from 'jspdf';
import type { FormConfig, FormField } from '../config/formTypes';
import { clinicConfig } from '../config/clinic';
import { isFieldVisible } from './validation';

// Cache fonts as base64 once loaded
let fontCache: { regular: string; bold: string } | null = null;
let logoCache: { dataUrl: string; width: number; height: number } | null = null;

async function loadLogo(): Promise<{ dataUrl: string; width: number; height: number } | null> {
  if (logoCache) return logoCache;
  try {
    const res = await fetch(clinicConfig.logoPath);
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });
    logoCache = { dataUrl, width: dims.width, height: dims.height };
    return logoCache;
  } catch {
    return null;
  }
}

async function loadFonts(): Promise<{ regular: string; bold: string }> {
  if (fontCache) return fontCache;

  const fetchAsBase64 = async (url: string): Promise<string> => {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
    }
    return btoa(binary);
  };

  const [regular, bold] = await Promise.all([
    fetchAsBase64('/fonts/Roboto-Regular.ttf'),
    fetchAsBase64('/fonts/Roboto-Bold.ttf'),
  ]);

  fontCache = { regular, bold };
  return fontCache;
}

// Colors
const TEAL = [13, 148, 136] as const;
const DARK = [30, 30, 30] as const;
const GRAY = [100, 100, 100] as const;
const LIGHT_GRAY = [160, 160, 160] as const;
const SECTION_BG = [240, 253, 250] as const; // teal-50
const DIVIDER = [220, 220, 220] as const;

function formatFieldValue(field: FormField, value: unknown): string {
  if (value === undefined || value === null || value === '') return '—';
  if (field.type === 'checkbox') return value ? 'Ano / Yes' : 'Ne / No';
  if (field.type === 'checkboxGroup' && Array.isArray(value)) {
    return value
      .map((v) => {
        const opt = field.options?.find((o) => o.value === v);
        return opt?.label || v;
      })
      .join(', ') || '—';
  }
  if (field.type === 'radio' || field.type === 'select') {
    const opt = field.options?.find((o) => o.value === value);
    return opt?.label || String(value);
  }
  return String(value);
}

export async function generatePDF(
  formConfig: FormConfig,
  formData: Record<string, unknown>,
): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

  // Register Roboto font (Unicode/Czech support) + load logo
  const [fonts, logo] = await Promise.all([loadFonts(), loadLogo()]);
  doc.addFileToVFS('Roboto-Regular.ttf', fonts.regular);
  doc.addFileToVFS('Roboto-Bold.ttf', fonts.bold);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
  doc.setFont('Roboto', 'normal');

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 16;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = 16;
    }
  };

  // ── HEADER BAR ──
  // Teal top stripe
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pageW, 3, 'F');

  y = 12;

  // Clinic info line
  const clinicLine = [clinicConfig.name, clinicConfig.address, clinicConfig.phone, clinicConfig.email]
    .filter(Boolean)
    .join('   |   ');
  if (clinicLine) {
    doc.setFontSize(8);
    doc.setTextColor(...LIGHT_GRAY);
    doc.text(clinicLine, pageW / 2, y, { align: 'center' });
    y += 6;
  }

  // Form title
  doc.setFontSize(20);
  doc.setFont('Roboto', 'bold');
  doc.setTextColor(...TEAL);
  doc.text(formConfig.title || formConfig.id, pageW / 2, y + 6, { align: 'center' });
  y += 14;

  // Date & version subtitle
  doc.setFontSize(9);
  doc.setFont('Roboto', 'normal');
  doc.setTextColor(...GRAY);
  const dateStr = new Date().toLocaleDateString(formConfig.language === 'cs' ? 'cs-CZ' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  doc.text(`${dateStr}   |   v${formConfig.version}`, pageW / 2, y, { align: 'center' });
  y += 6;

  // Thin divider
  doc.setDrawColor(...DIVIDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // ── SECTIONS ──
  // Line height helpers (mm per line at given font size)
  const lineH = (fontSize: number) => fontSize * 0.4;

  for (const section of formConfig.sections) {
    const visibleFields = section.fields.filter((f) => isFieldVisible(f, formData));

    // Skip completely empty sections
    if (visibleFields.length === 0) continue;

    checkPageBreak(20);

    // Section header — colored bar
    doc.setFillColor(...SECTION_BG);
    doc.roundedRect(margin, y, contentW, 9, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('Roboto', 'bold');
    doc.setTextColor(...TEAL);
    doc.text(section.title || '—', margin + 4, y + 6.5);
    y += 14;

    // Render ALL fields in order (preserving config order)
    let rowIndex = 0;
    for (const field of visibleFields) {
      // ── Divider ──
      if (field.type === 'divider') {
        checkPageBreak(6);
        doc.setDrawColor(...DIVIDER);
        doc.setLineWidth(0.2);
        doc.line(margin, y, pageW - margin, y);
        y += 6;
        continue;
      }

      // ── Static text ──
      if (field.type === 'staticText') {
        if (!field.content) continue;
        doc.setFontSize(9);
        doc.setFont('Roboto', 'normal');
        doc.setTextColor(...GRAY);
        const lines: string[] = doc.splitTextToSize(field.content, contentW - 8);
        const blockH = lines.length * lineH(9) + 6;
        checkPageBreak(blockH);
        doc.text(lines, margin + 4, y);
        y += blockH;
        continue;
      }

      // ── Signature ──
      if (field.type === 'signature') {
        const sigData = formData[field.id];
        if (sigData && typeof sigData === 'string') {
          checkPageBreak(44);
          doc.setFontSize(9);
          doc.setFont('Roboto', 'normal');
          doc.setTextColor(...GRAY);
          doc.text(field.label || 'Signature:', margin + 3, y);
          y += 4;
          doc.setDrawColor(...DIVIDER);
          doc.setLineWidth(0.2);
          doc.roundedRect(margin + 2, y, 70, 28, 2, 2, 'S');
          try {
            doc.addImage(sigData, 'PNG', margin + 3, y + 1, 68, 26, undefined, 'FAST');
          } catch {
            // ignore image errors
          }
          y += 32;
          doc.setFontSize(8);
          doc.setTextColor(...LIGHT_GRAY);
          doc.text(`Datum / Date: ${dateStr}`, margin + 3, y);
          y += 8;
        }
        continue;
      }

      // ── Checkbox (single) ──
      if (field.type === 'checkbox') {
        doc.setFontSize(9);
        doc.setFont('Roboto', 'normal');
        // Wrap the label to compute real height
        const labelLines: string[] = doc.splitTextToSize(field.label || field.id, contentW - 20);
        const rowH = Math.max(labelLines.length * lineH(9), 5) + 4;
        checkPageBreak(rowH);

        // Alternating row bg
        if (rowIndex % 2 === 0) {
          doc.setFillColor(248, 248, 248);
          doc.rect(margin, y - 3.5, contentW, rowH, 'F');
        }

        // Checkbox indicator
        const checked = !!formData[field.id];
        doc.setFont('Roboto', 'bold');
        const cbColor = checked ? TEAL : GRAY;
        doc.setTextColor(cbColor[0], cbColor[1], cbColor[2]);
        doc.text(checked ? '[x]' : '[ ]', margin + 3, y);

        // Label text (wrapped)
        doc.setFont('Roboto', 'normal');
        doc.setTextColor(...DARK);
        doc.text(labelLines, margin + 14, y);

        y += rowH;
        rowIndex++;
        continue;
      }

      // ── All other data fields (text, date, email, tel, number, textarea, radio, select, checkboxGroup) ──
      const colLabelW = contentW * 0.42;
      const colValueW = contentW * 0.58;

      doc.setFontSize(9);

      // Compute wrapped sizes for both label and value
      doc.setFont('Roboto', 'normal');
      const labelText = field.label || field.id;
      const labelLines: string[] = doc.splitTextToSize(labelText, colLabelW - 6);

      doc.setFont('Roboto', 'bold');
      const valueStr = formatFieldValue(field, formData[field.id]);
      const valueLines: string[] = doc.splitTextToSize(valueStr, colValueW - 6);

      const maxLines = Math.max(labelLines.length, valueLines.length);
      const rowH = maxLines * lineH(9) + 4;
      checkPageBreak(rowH);

      // Alternating row bg
      if (rowIndex % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, y - 3.5, contentW, rowH, 'F');
      }

      // Label
      doc.setFont('Roboto', 'normal');
      doc.setTextColor(...GRAY);
      doc.text(labelLines, margin + 3, y);

      // Value
      doc.setFont('Roboto', 'bold');
      doc.setTextColor(...DARK);
      doc.text(valueLines, margin + colLabelW + 3, y);

      y += rowH;
      rowIndex++;
    }

    y += 6;
  }

  // ── FOOTER ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Bottom stripe
    doc.setFillColor(...TEAL);
    doc.rect(0, pageH - 2, pageW, 2, 'F');
    // Page number
    doc.setFontSize(7);
    doc.setTextColor(...LIGHT_GRAY);
    doc.text(`${i} / ${totalPages}`, pageW / 2, pageH - 4, { align: 'center' });

    // Logo in bottom-right (preserving aspect ratio, width ~40mm)
    if (logo) {
      const logoW = 40;
      const logoH = (logo.height / logo.width) * logoW;
      const logoX = pageW - margin - logoW;
      const logoY = pageH - 8 - logoH;
      try {
        doc.addImage(logo.dataUrl, 'JPEG', logoX, logoY, logoW, logoH, 'clinic-logo', 'FAST');
      } catch {
        // ignore image errors
      }
    }
  }

  return doc.output('blob');
}

function capitalize(s: string): string {
  const trimmed = s.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

function cleanForFilename(s: string): string {
  // Preserve diacritics, just clean unsafe characters and normalize spaces
  return s.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').replace(/\s+/g, '');
}

export function buildFileName(
  formConfig: FormConfig,
  formData: Record<string, unknown>,
): string {
  const lastName = capitalize((formData.lastName as string) || 'Unknown');
  const firstName = capitalize((formData.firstName as string) || 'Unknown');
  const formName = formConfig.title || formConfig.id;
  return `${cleanForFilename(lastName)}_${cleanForFilename(firstName)}_${cleanForFilename(formName)}.pdf`;
}

export function buildFolderName(formData: Record<string, unknown>): string {
  const lastName = (formData.lastName as string) || 'Unknown';
  const firstName = (formData.firstName as string) || 'Unknown';
  return `${lastName}_${firstName}`;
}
