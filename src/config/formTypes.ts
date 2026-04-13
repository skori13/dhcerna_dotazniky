export type FieldType =
  | 'text'
  | 'textarea'
  | 'tel'
  | 'email'
  | 'date'
  | 'number'
  | 'checkbox'
  | 'checkboxGroup'
  | 'radio'
  | 'select'
  | 'signature'
  | 'staticText'
  | 'divider';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  conditionalOn?: {
    fieldId: string;
    value: unknown;
  };
  content?: string;
  maxLength?: number;
  inputMode?: string;
  defaultValue?: string | 'today';
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormConfig {
  id: string;
  title: string;
  description: string;
  language: 'cs' | 'en';
  version: string;
  sections: FormSection[];
}
