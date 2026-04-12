/**
 * X-ray consent — English version
 *
 * Structure:
 * 1. Patient personal information
 * 2. X-ray information (static text)
 * 3. Confirmation and signature
 *
 * TODO: Fill in all texts (labels, staticText, options)
 */

import type { FormConfig } from '../formTypes';

export const rtgEn: FormConfig = {
  id: 'rtg-en',
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
      title: '',       // TODO: section 2 — X-ray information
      fields: [
        { id: 'rtgInfoText', type: 'staticText', label: '', content: '' }, // TODO: X-ray examination information
        { id: 'divider1', type: 'divider', label: '' },
        { id: 'pregnancyWarning', type: 'staticText', label: '', content: '' }, // TODO: pregnancy warning
        { id: 'pregnant', type: 'radio', label: '', required: true, options: [
          { value: 'yes', label: '' },             // TODO: yes
          { value: 'no', label: '' },              // TODO: no
          { value: 'na', label: '' },              // TODO: not applicable
        ] },
      ],
    },
    {
      title: '',       // TODO: section 3 — consent and signature
      fields: [
        { id: 'consentRtg', type: 'checkbox', label: '', required: true }, // TODO: X-ray consent
        { id: 'date', type: 'date', label: '', required: true },          // TODO: date
        { id: 'signature', type: 'signature', label: '', required: true }, // TODO: patient signature
      ],
    },
  ],
};
