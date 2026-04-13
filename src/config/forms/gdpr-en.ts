/**
 * GDPR consent — English version
 */

import type { FormConfig } from '../formTypes';

export const gdprEn: FormConfig = {
  id: 'gdpr-en',
  title: 'GDPR Consent',
  description: '',
  language: 'en',
  version: '1.0',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { id: 'firstName', type: 'text', label: 'First Name', required: true },
        { id: 'lastName', type: 'text', label: 'Last Name', required: true },
        { id: 'birthDate', type: 'date', label: 'Date of Birth', required: true },
        { id: 'email', type: 'email', label: 'Email', required: false },
      ],
    },
    {
      title: 'Consent',
      fields: [
        {
          id: 'gdprText',
          type: 'staticText',
          label: '',
          content:
            'I consent to the processing of my personal data (name, surname, date of birth, email, health-related data) by Dentální Hygiena Nikola Černá for the purpose of providing dental hygiene services and maintaining medical records in accordance with Regulation (EU) 2016/679 (GDPR).',
        },
        {
          id: 'consentRequired',
          type: 'checkbox',
          label:
            'I consent to the processing of my personal data for the purpose of healthcare and record keeping *',
          required: true,
        },
        {
          id: 'consentMarketing',
          type: 'checkbox',
          label: 'I consent to receiving informational and marketing communications (SMS, email)',
          required: false,
        },
        {
          id: 'consentPhotos',
          type: 'checkbox',
          label:
            'I consent to photographs being taken and stored for treatment documentation purposes',
          required: false,
        },
        {
          id: 'gdprWithdrawalText',
          type: 'staticText',
          label: '',
          content:
            'Consent is voluntary and may be withdrawn at any time by written notice to the clinic or by email. Withdrawal of consent does not affect the lawfulness of processing carried out prior to its withdrawal. Mandatory consent for personal data processing for healthcare purposes cannot be withdrawn for the period required by law for the retention of medical records.',
        },
        { id: 'signature', type: 'signature', label: 'Patient Signature', required: true },
        { id: 'date', type: 'date', label: 'Date', defaultValue: 'today' },
      ],
    },
  ],
};
