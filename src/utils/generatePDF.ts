import jsPDF from 'jspdf';
import type { FormConfig, FormField } from '../config/formTypes';
import { clinicConfig } from '../config/clinic';
import { isFieldVisible } from './validation';

// Cache fonts as base64 once loaded
let fontCache: { regular: string; bold: string } | null = null;

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
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Register Roboto font (Unicode/Czech support)
  const fonts = await loadFonts();
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
  for (const section of formConfig.sections) {
    // Gather visible, renderable fields
    const visibleFields = section.fields.filter(
      (f) => f.type !== 'divider' && f.type !== 'staticText' && f.type !== 'signature' && isFieldVisible(f, formData),
    );
    const signatureField = section.fields.find((f) => f.type === 'signature');

    // Skip empty sections (except if it has a signature)
    if (visibleFields.length === 0 && !signatureField) continue;

    // Estimate section height for page break
    const estimatedHeight = 14 + visibleFields.length * 9 + (signatureField ? 40 : 0);
    checkPageBreak(Math.min(estimatedHeight, 60));

    // Section header — colored bar
    doc.setFillColor(...SECTION_BG);
    doc.roundedRect(margin, y, contentW, 9, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('Roboto', 'bold');
    doc.setTextColor(...TEAL);
    doc.text(section.title || '—', margin + 4, y + 6.5);
    y += 14;

    // Fields as a clean table-like layout
    if (visibleFields.length > 0) {
      const colLabelW = contentW * 0.42;
      const colValueW = contentW * 0.58;
      let rowIndex = 0;

      for (const field of visibleFields) {
        checkPageBreak(10);

        // Alternating row background
        if (rowIndex % 2 === 0) {
          doc.setFillColor(248, 248, 248);
          doc.rect(margin, y - 3.5, contentW, 8, 'F');
        }

        // Label
        doc.setFontSize(9);
        doc.setFont('Roboto', 'normal');
        doc.setTextColor(...GRAY);
        const label = field.label || field.id;
        doc.text(label, margin + 3, y);

        // Value
        doc.setFont('Roboto', 'bold');
        doc.setTextColor(...DARK);
        const valueStr = formatFieldValue(field, formData[field.id]);
        const valueLines = doc.splitTextToSize(valueStr, colValueW - 6);
        doc.text(valueLines, margin + colLabelW + 3, y);

        y += Math.max(valueLines.length * 4.5, 5) + 3;
        rowIndex++;
      }
    }

    // Static text blocks (consent texts etc.)
    const staticFields = section.fields.filter(
      (f) => f.type === 'staticText' && f.content && isFieldVisible(f, formData),
    );
    for (const sf of staticFields) {
      checkPageBreak(12);
      doc.setFontSize(8);
      doc.setFont('Roboto', 'normal');
      doc.setTextColor(...GRAY);
      const lines = doc.splitTextToSize(sf.content!, contentW - 8);
      doc.text(lines, margin + 4, y);
      y += lines.length * 3.5 + 4;
    }

    // Signature at end of section
    if (signatureField) {
      const sigData = formData[signatureField.id];
      if (sigData && typeof sigData === 'string') {
        checkPageBreak(42);
        // Signature label
        doc.setFontSize(9);
        doc.setFont('Roboto', 'normal');
        doc.setTextColor(...GRAY);
        doc.text(signatureField.label || 'Signature:', margin + 3, y);
        y += 3;
        // Signature box
        doc.setDrawColor(...DIVIDER);
        doc.setLineWidth(0.2);
        doc.roundedRect(margin + 2, y, 70, 28, 2, 2, 'S');
        try {
          doc.addImage(sigData, 'PNG', margin + 3, y + 1, 68, 26);
        } catch {
          // ignore image errors
        }
        y += 32;
        // Date under signature
        doc.setFontSize(8);
        doc.setTextColor(...LIGHT_GRAY);
        doc.text(`Datum / Date: ${dateStr}`, margin + 3, y);
        y += 6;
      }
    }

    y += 4;
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
