/**
 * GDPR souhlas — česká verze
 */

import type { FormConfig } from '../formTypes';

export const gdprCz: FormConfig = {
  id: 'gdpr-cz',
  title: 'GDPR souhlas',
  description: '',
  language: 'cs',
  version: '1.0',
  sections: [
    {
      title: 'Osobní údaje',
      fields: [
        { id: 'firstName', type: 'text', label: 'Jméno', required: true },
        { id: 'lastName', type: 'text', label: 'Příjmení', required: true },
        { id: 'birthDate', type: 'date', label: 'Datum narození', required: true },
        { id: 'email', type: 'email', label: 'Email', required: false },
      ],
    },
    {
      title: 'Udělené souhlasy',
      fields: [
        {
          id: 'gdprText',
          type: 'staticText',
          label: '',
          content:
            'Souhlasím se zpracováním svých osobních údajů (jméno, příjmení, datum narození, e-mail, zdravotní údaje) správcem Dentální Hygiena Nikola Černá za účelem poskytování dentální hygieny a vedení zdravotní dokumentace v souladu s Nařízením (EU) 2016/679 (GDPR) a zákonem č. 110/2019 Sb.',
        },
        {
          id: 'consentRequired',
          type: 'checkbox',
          label:
            'Souhlasím se zpracováním osobních údajů za účelem poskytování zdravotní péče a vedení dokumentace *',
          required: true,
        },
        {
          id: 'consentMarketing',
          type: 'checkbox',
          label: 'Souhlasím se zasíláním informačních a marketingových sdělení (SMS, e-mail)',
          required: false,
        },
        {
          id: 'consentPhotos',
          type: 'checkbox',
          label: 'Souhlasím s pořizováním a uchováváním fotografií pro účely dokumentace ošetření',
          required: false,
        },
        {
          id: 'gdprWithdrawalText',
          type: 'staticText',
          label: '',
          content:
            'Souhlas je dobrovolný a lze jej kdykoliv odvolat písemným sdělením na adresu ordinace nebo e-mailem. Odvolání souhlasu nemá vliv na zákonnost zpracování před jeho odvoláním. Povinný souhlas se zpracováním osobních údajů za účelem zdravotní péče nelze odvolat po dobu stanovenou legislativou pro uchovávání zdravotní dokumentace.',
        },
        { id: 'signature', type: 'signature', label: 'Podpis pacienta', required: true },
        { id: 'date', type: 'date', label: 'Datum', defaultValue: 'today' },
      ],
    },
  ],
};
