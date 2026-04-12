/**
 * Souhlas s rentgenem — česká verze
 *
 * Struktura:
 * 1. Osobní údaje pacienta
 * 2. Informace o RTG vyšetření (statický text)
 * 3. Potvrzení a podpis
 *
 * TODO: Doplnit všechny texty (labels, staticText, options)
 */

import type { FormConfig } from '../formTypes';

export const rtgCz: FormConfig = {
  id: 'rtg-cz',
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
      title: '',       // TODO: sekce 2 — informace o RTG
      fields: [
        { id: 'rtgInfoText', type: 'staticText', label: '', content: '' }, // TODO: informace o rentgenovém vyšetření
        { id: 'divider1', type: 'divider', label: '' },
        { id: 'pregnancyWarning', type: 'staticText', label: '', content: '' }, // TODO: upozornění pro těhotné
        { id: 'pregnant', type: 'radio', label: '', required: true, options: [
          { value: 'yes', label: '' },             // TODO: ano
          { value: 'no', label: '' },              // TODO: ne
          { value: 'na', label: '' },              // TODO: netýká se
        ] },
      ],
    },
    {
      title: '',       // TODO: sekce 3 — souhlas a podpis
      fields: [
        { id: 'consentRtg', type: 'checkbox', label: '', required: true }, // TODO: souhlas s RTG vyšetřením
        { id: 'date', type: 'date', label: '', required: true },          // TODO: datum
        { id: 'signature', type: 'signature', label: '', required: true }, // TODO: podpis pacienta
      ],
    },
  ],
};
