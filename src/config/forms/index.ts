import type { FormConfig } from '../formTypes';
import { anamnezaCz } from './anamneza-cz';
import { anamnezaEn } from './anamneza-en';
import { souhlasCz } from './souhlas-cz';
import { souhlasEn } from './souhlas-en';
import { gdprCz } from './gdpr-cz';
import { gdprEn } from './gdpr-en';
import { rtgCz } from './rtg-cz';
import { rtgEn } from './rtg-en';

export const allForms: FormConfig[] = [
  anamnezaCz,
  anamnezaEn,
  souhlasCz,
  souhlasEn,
  gdprCz,
  gdprEn,
  rtgCz,
  rtgEn,
];

export const formsByLanguage = {
  cs: allForms.filter((f) => f.language === 'cs'),
  en: allForms.filter((f) => f.language === 'en'),
};

export function getFormById(id: string): FormConfig | undefined {
  return allForms.find((f) => f.id === id);
}
