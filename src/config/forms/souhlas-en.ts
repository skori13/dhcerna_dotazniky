/**
 * Informed consent — English version
 *
 * Structure:
 * 1. Patient personal information
 * 2. Informed consent text (static)
 * 3. Confirmation and signature
 *
 * TODO: Fill in all texts (labels, staticText, options)
 */

import type { FormConfig } from '../formTypes';

export const souhlasEn: FormConfig = {
  id: 'souhlas-en',
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
      ],
    },
    {
      title: '',       // TODO: section 2 — informed consent
      fields: [
        { id: 'consentText', type: 'staticText', label: '', content: '' }, // TODO: informed consent text
        { id: 'divider1', type: 'divider', label: '' },
        { id: 'procedureDescription', type: 'staticText', label: '', content: '' }, // TODO: procedure description
      ],
    },
    {
      title: '',       // TODO: section 3 — confirmation and signature
      fields: [
        { id: 'consentGiven', type: 'checkbox', label: '', required: true }, // TODO: consent confirmation
        { id: 'date', type: 'date', label: '', required: true },           // TODO: date
        { id: 'signature', type: 'signature', label: '', required: true }, // TODO: patient signature
      ],
    },
  ],
};
