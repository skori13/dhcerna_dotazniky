/**
 * GDPR consent — English version
 *
 * Structure:
 * 1. Patient personal information
 * 2. GDPR consent text (static)
 * 3. Consent options + signature
 *
 * TODO: Fill in all texts (labels, staticText, options)
 */

import type { FormConfig } from '../formTypes';

export const gdprEn: FormConfig = {
  id: 'gdpr-en',
  title: '',           // TODO: form title
  description: '',     // TODO: form description
  language: 'en',
  version: '1.0',
  sections: [
    {
      title: '',       // TODO: section 1 — personal info
      fields: [
        { id: 'firstName', type: 'text', label: '', required: true },      // TODO: first name
        { id: 'lastName', type: 'text', label: '', required: true },       // TODO: last name
        { id: 'birthDate', type: 'date', label: '', required: true },      // TODO: date of birth
        { id: 'email', type: 'email', label: '', required: false },        // TODO: email
      ],
    },
    {
      title: '',       // TODO: section 2 — GDPR information
      fields: [
        { id: 'gdprText', type: 'staticText', label: '', content: '' },   // TODO: data processing information text
        { id: 'divider1', type: 'divider', label: '' },
        { id: 'dataProcessing', type: 'staticText', label: '', content: '' }, // TODO: purpose of data processing
      ],
    },
    {
      title: '',       // TODO: section 3 — consents and signature
      fields: [
        { id: 'consentRequired', type: 'checkbox', label: '', required: true }, // TODO: required data processing consent
        { id: 'consentMarketing', type: 'checkbox', label: '', required: false }, // TODO: optional marketing consent
        { id: 'consentPhotos', type: 'checkbox', label: '', required: false }, // TODO: optional photo documentation consent
        { id: 'date', type: 'date', label: '', required: true },           // TODO: date
        { id: 'signature', type: 'signature', label: '', required: true }, // TODO: patient signature
      ],
    },
  ],
};
