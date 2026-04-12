import jsPDF from 'jspdf';
import type { FormConfig, FormField } from '../config/formTypes';
import { clinicConfig } from '../config/clinic';
import { isFieldVisible } from './validation';

function sanitize(text: string): string {
  return text || '—';
}

function formatFieldValue(field: FormField, value: unknown): string {
  if (value === undefined || value === null || value === '') return '—';
  if (field.type === 'checkbox') return value ? 'Yes' : 'No';
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

export function generatePDF(
  formConfig: FormConfig,
  formData: Record<string, unknown>,
): Blob {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const checkPageBreak = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Header — clinic info
  doc.setFontSize(10);
  doc.setTextColor(100);
  const clinicLine = [clinicConfig.name, clinicConfig.address, clinicConfig.phone, clinicConfig.email]
    .filter(Boolean)
    .join('  |  ');
  if (clinicLine) {
    doc.text(clinicLine, pageWidth / 2, y, { align: 'center' });
    y += 8;
  }

  // Form title
  doc.setFontSize(18);
  doc.setTextColor(13, 148, 136); // teal-600
  doc.text(sanitize(formConfig.title), pageWidth / 2, y, { align: 'center' });
  y += 8;

  // Date + version
  doc.setFontSize(9);
  doc.setTextColor(120);
  const dateStr = new Date().toLocaleDateString(formConfig.language === 'cs' ? 'cs-CZ' : 'en-US');
  doc.text(`${dateStr}  |  v${formConfig.version}`, pageWidth / 2, y, { align: 'center' });
  y += 10;

  // Divider
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Sections
  for (const section of formConfig.sections) {
    checkPageBreak(20);

    // Section title
    if (section.title) {
      doc.setFontSize(13);
      doc.setTextColor(30);
      doc.text(section.title, margin, y);
      y += 7;
    }

    for (const field of section.fields) {
      if (!isFieldVisible(field, formData)) continue;
      if (field.type === 'divider') {
        checkPageBreak(6);
        doc.setDrawColor(220);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
        continue;
      }
      if (field.type === 'staticText') {
        if (field.content) {
          checkPageBreak(10);
          doc.setFontSize(9);
          doc.setTextColor(80);
          const lines = doc.splitTextToSize(field.content, contentWidth);
          doc.text(lines, margin, y);
          y += lines.length * 4 + 4;
        }
        continue;
      }
      if (field.type === 'signature') {
        const sigData = formData[field.id];
        if (sigData && typeof sigData === 'string') {
          checkPageBreak(40);
          doc.setFontSize(10);
          doc.setTextColor(60);
          doc.text(field.label || 'Signature:', margin, y);
          y += 4;
          try {
            doc.addImage(sigData, 'PNG', margin, y, 60, 25);
          } catch {
            // ignore image errors
          }
          y += 30;
        }
        continue;
      }

      checkPageBreak(12);
      doc.setFontSize(10);
      doc.setTextColor(60);
      const label = field.label || field.id;
      doc.text(label + ':', margin, y);
      doc.setTextColor(20);
      const valueStr = formatFieldValue(field, formData[field.id]);
      const valueLines = doc.splitTextToSize(valueStr, contentWidth - 2);
      doc.text(valueLines, margin + 2, y + 5);
      y += 5 + valueLines.length * 5 + 3;
    }

    y += 4;
  }

  return doc.output('blob');
}

export function buildFileName(
  formConfig: FormConfig,
  formData: Record<string, unknown>,
): string {
  const lastName = (formData.lastName as string) || 'unknown';
  const firstName = (formData.firstName as string) || 'unknown';
  const date = new Date().toISOString().slice(0, 10);
  const cleanLast = lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
  const cleanFirst = firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
  return `${cleanLast}_${cleanFirst}_${formConfig.id}_${date}.pdf`;
}

export function buildFolderName(formData: Record<string, unknown>): string {
  const lastName = (formData.lastName as string) || 'Unknown';
  const firstName = (formData.firstName as string) || 'Unknown';
  return `${lastName}_${firstName}`;
}
