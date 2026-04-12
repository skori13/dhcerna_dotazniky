import type { FormField, FormSection } from '../config/formTypes';

export function validateField(field: FormField, value: unknown): string | null {
  if (field.required) {
    if (field.type === 'checkbox' && value !== true) {
      return 'required';
    }
    if (field.type === 'signature' && (!value || value === '')) {
      return 'required';
    }
    if (
      field.type !== 'checkbox' &&
      field.type !== 'signature' &&
      (value === undefined || value === null || value === '')
    ) {
      return 'required';
    }
  }
  if (field.type === 'email' && value && typeof value === 'string') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'invalid_email';
    }
  }
  if (field.type === 'tel' && value && typeof value === 'string') {
    if (!/^[+\d\s()-]{6,}$/.test(value)) {
      return 'invalid_phone';
    }
  }
  return null;
}

export function isFieldVisible(
  field: FormField,
  formData: Record<string, unknown>,
): boolean {
  if (!field.conditionalOn) return true;
  const { fieldId, value } = field.conditionalOn;
  const currentValue = formData[fieldId];
  if (Array.isArray(currentValue)) {
    return currentValue.includes(value as string);
  }
  return currentValue === value;
}

export function validateSection(
  section: FormSection,
  formData: Record<string, unknown>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of section.fields) {
    if (!isFieldVisible(field, formData)) continue;
    if (field.type === 'staticText' || field.type === 'divider') continue;
    const error = validateField(field, formData[field.id]);
    if (error) {
      errors[field.id] = error;
    }
  }
  return errors;
}
