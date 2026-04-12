/**
 * GDPR souhlas — česká verze
 *
 * Struktura:
 * 1. Osobní údaje pacienta
 * 2. Text GDPR souhlasu (statický)
 * 3. Volby souhlasu + podpis
 *
 * TODO: Doplnit všechny texty (labels, staticText, options)
 */

import type { FormConfig } from '../formTypes';

export const gdprCz: FormConfig = {
  id: 'gdpr-cz',
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
        { id: 'email', type: 'email', label: '', required: false },        // TODO: email
      ],
    },
    {
      title: '',       // TODO: sekce 2 — GDPR informace
      fields: [
        { id: 'gdprText', type: 'staticText', label: '', content: '' },   // TODO: text o zpracování osobních údajů
        { id: 'divider1', type: 'divider', label: '' },
        { id: 'dataProcessing', type: 'staticText', label: '', content: '' }, // TODO: účel zpracování
      ],
    },
    {
      title: '',       // TODO: sekce 3 — souhlasy a podpis
      fields: [
        { id: 'consentRequired', type: 'checkbox', label: '', required: true }, // TODO: povinný souhlas se zpracováním
        { id: 'consentMarketing', type: 'checkbox', label: '', required: false }, // TODO: volitelný souhlas s marketingem
        { id: 'consentPhotos', type: 'checkbox', label: '', required: false }, // TODO: volitelný souhlas s fotodokumentací
        { id: 'date', type: 'date', label: '', required: true },           // TODO: datum
        { id: 'signature', type: 'signature', label: '', required: true }, // TODO: podpis pacienta
      ],
    },
  ],
};
