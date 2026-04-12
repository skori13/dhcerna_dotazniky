/**
 * Anamnestický dotazník — česká verze
 *
 * Struktura:
 * 1. Osobní údaje pacienta
 * 2. Zdravotní anamnéza (alergie, léky, onemocnění)
 * 3. Dentální anamnéza (návyky, problémy)
 * 4. Poznámky + podpis
 *
 * TODO: Doplnit všechny texty (labels, placeholders, options, staticText)
 */

import type { FormConfig } from '../formTypes';

export const anamnezaCz: FormConfig = {
  id: 'anamneza-cz',
  title: '',           // TODO: doplnit název formuláře
  description: '',     // TODO: doplnit popis
  language: 'cs',
  version: '1.0',
  sections: [
    {
      title: '',       // TODO: sekce 1 — osobní údaje
      fields: [
        { id: 'firstName', type: 'text', label: '', required: true },      // TODO: jméno
        { id: 'lastName', type: 'text', label: '', required: true },       // TODO: příjmení
        { id: 'birthDate', type: 'date', label: '', required: true },      // TODO: datum narození
        { id: 'phone', type: 'tel', label: '', required: false },          // TODO: telefon
        { id: 'email', type: 'email', label: '', required: false },        // TODO: email
        { id: 'address', type: 'text', label: '', required: false },       // TODO: adresa
        { id: 'insuranceCompany', type: 'text', label: '', required: false }, // TODO: pojišťovna
      ],
    },
    {
      title: '',       // TODO: sekce 2 — zdravotní anamnéza
      fields: [
        { id: 'allergies', type: 'radio', label: '', required: true, options: [{ value: 'yes', label: '' }, { value: 'no', label: '' }] }, // TODO: alergie ano/ne
        { id: 'allergiesDetail', type: 'textarea', label: '', conditionalOn: { fieldId: 'allergies', value: 'yes' } }, // TODO: detail alergií
        { id: 'medications', type: 'radio', label: '', required: true, options: [{ value: 'yes', label: '' }, { value: 'no', label: '' }] }, // TODO: léky ano/ne
        { id: 'medicationsDetail', type: 'textarea', label: '', conditionalOn: { fieldId: 'medications', value: 'yes' } }, // TODO: detail léků
        { id: 'diseases', type: 'checkboxGroup', label: '', options: [
          { value: 'diabetes', label: '' },       // TODO: diabetes
          { value: 'hypertension', label: '' },    // TODO: hypertenze
          { value: 'heart', label: '' },           // TODO: srdeční onemocnění
          { value: 'hepatitis', label: '' },       // TODO: hepatitida
          { value: 'hiv', label: '' },             // TODO: HIV
          { value: 'epilepsy', label: '' },        // TODO: epilepsie
          { value: 'asthma', label: '' },          // TODO: astma
          { value: 'bleeding', label: '' },        // TODO: poruchy krvácení
          { value: 'other', label: '' },           // TODO: jiné
        ] },
        { id: 'diseasesOther', type: 'textarea', label: '', conditionalOn: { fieldId: 'diseases', value: 'other' } }, // TODO: jiné onemocnění detail
        { id: 'pregnant', type: 'radio', label: '', options: [{ value: 'yes', label: '' }, { value: 'no', label: '' }, { value: 'na', label: '' }] }, // TODO: těhotenství
        { id: 'smoking', type: 'radio', label: '', options: [{ value: 'yes', label: '' }, { value: 'no', label: '' }] }, // TODO: kouření
      ],
    },
    {
      title: '',       // TODO: sekce 3 — dentální anamnéza
      fields: [
        { id: 'lastVisit', type: 'text', label: '', required: false },     // TODO: poslední návštěva zubaře
        { id: 'brushingFrequency', type: 'radio', label: '', options: [
          { value: '1x', label: '' },             // TODO: 1x denně
          { value: '2x', label: '' },             // TODO: 2x denně
          { value: '3x', label: '' },             // TODO: 3x+ denně
          { value: 'less', label: '' },            // TODO: méně
        ] },
        { id: 'flossing', type: 'radio', label: '', options: [{ value: 'yes', label: '' }, { value: 'no', label: '' }] }, // TODO: používá nit
        { id: 'complaints', type: 'textarea', label: '' },                 // TODO: aktuální obtíže
      ],
    },
    {
      title: '',       // TODO: sekce 4 — poznámky a podpis
      fields: [
        { id: 'notes', type: 'textarea', label: '' },                     // TODO: poznámky
        { id: 'signature', type: 'signature', label: '', required: true }, // TODO: podpis pacienta
      ],
    },
  ],
};
