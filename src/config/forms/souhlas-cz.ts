/**
 * Informovaný souhlas — česká verze
 *
 * Struktura:
 * 1. Osobní údaje pacienta
 * 2. Text informovaného souhlasu (statický)
 * 3. Potvrzení a podpis
 *
 * TODO: Doplnit všechny texty (labels, staticText, options)
 */

import type { FormConfig } from '../formTypes';

export const souhlasCz: FormConfig = {
  id: 'souhlas-cz',
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
      ],
    },
    {
      title: '',       // TODO: sekce 2 — informovaný souhlas
      fields: [
        { id: 'consentText', type: 'staticText', label: '', content: '' }, // TODO: text informovaného souhlasu
        { id: 'divider1', type: 'divider', label: '' },
        { id: 'procedureDescription', type: 'staticText', label: '', content: '' }, // TODO: popis výkonu
      ],
    },
    {
      title: '',       // TODO: sekce 3 — potvrzení a podpis
      fields: [
        { id: 'consentGiven', type: 'checkbox', label: '', required: true }, // TODO: potvrzení souhlasu
        { id: 'date', type: 'date', label: '', required: true },           // TODO: datum
        { id: 'signature', type: 'signature', label: '', required: true }, // TODO: podpis pacienta
      ],
    },
  ],
};
