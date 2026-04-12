/**
 * Medical history questionnaire — English version
 *
 * Structure:
 * 1. Personal information
 * 2. Medical history (allergies, medications, conditions)
 * 3. Dental history (habits, issues)
 * 4. Notes + signature
 *
 * TODO: Fill in all texts (labels, placeholders, options, staticText)
 */

import type { FormConfig } from '../formTypes';

export const anamnezaEn: FormConfig = {
  id: 'anamneza-en',
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
        { id: 'phone', type: 'tel', label: '', required: false },          // TODO: phone
        { id: 'email', type: 'email', label: '', required: false },        // TODO: email
        { id: 'address', type: 'text', label: '', required: false },       // TODO: address
        { id: 'insuranceCompany', type: 'text', label: '', required: false }, // TODO: insurance
      ],
    },
    {
      title: '',       // TODO: section 2 — medical history
      fields: [
        { id: 'allergies', type: 'radio', label: '', required: true, options: [{ value: 'yes', label: '' }, { value: 'no', label: '' }] }, // TODO: allergies yes/no
        { id: 'allergiesDetail', type: 'textarea', label: '', conditionalOn: { fieldId: 'allergies', value: 'yes' } }, // TODO: allergy details
        { id: 'medications', type: 'radio', label: '', required: true, options: [{ value: 'yes', label: '' }, { value: 'no', label: '' }] }, // TODO: medications yes/no
        { id: 'medicationsDetail', type: 'textarea', label: '', conditionalOn: { fieldId: 'medications', value: 'yes' } }, // TODO: medication details
        { id: 'diseases', type: 'checkboxGroup', label: '', options: [
          { value: 'diabetes', label: '' },        // TODO: diabetes
          { value: 'hypertension', label: '' },     // TODO: hypertension
          { value: 'heart', label: '' },            // TODO: heart disease
          { value: 'hepatitis', label: '' },        // TODO: hepatitis
          { value: 'hiv', label: '' },              // TODO: HIV
          { value: 'epilepsy', label: '' },         // TODO: epilepsy
          { value: 'asthma', label: '' },           // TODO: asthma
          { value: 'bleeding', label: '' },         // TODO: bleeding disorders
          { value: 'other', label: '' },            // TODO: other
        ] },
        { id: 'diseasesOther', type: 'textarea', label: '', conditionalOn: { fieldId: 'diseases', value: 'other' } }, // TODO: other conditions detail
        { id: 'pregnant', type: 'radio', label: '', options: [{ value: 'yes', label: '' }, { value: 'no', label: '' }, { value: 'na', label: '' }] }, // TODO: pregnancy
        { id: 'smoking', type: 'radio', label: '', options: [{ value: 'yes', label: '' }, { value: 'no', label: '' }] }, // TODO: smoking
      ],
    },
    {
      title: '',       // TODO: section 3 — dental history
      fields: [
        { id: 'lastVisit', type: 'text', label: '', required: false },     // TODO: last dental visit
        { id: 'brushingFrequency', type: 'radio', label: '', options: [
          { value: '1x', label: '' },              // TODO: once daily
          { value: '2x', label: '' },              // TODO: twice daily
          { value: '3x', label: '' },              // TODO: 3+ daily
          { value: 'less', label: '' },             // TODO: less
        ] },
        { id: 'flossing', type: 'radio', label: '', options: [{ value: 'yes', label: '' }, { value: 'no', label: '' }] }, // TODO: flossing
        { id: 'complaints', type: 'textarea', label: '' },                 // TODO: current complaints
      ],
    },
    {
      title: '',       // TODO: section 4 — notes and signature
      fields: [
        { id: 'notes', type: 'textarea', label: '' },                     // TODO: notes
        { id: 'signature', type: 'signature', label: '', required: true }, // TODO: patient signature
      ],
    },
  ],
};
