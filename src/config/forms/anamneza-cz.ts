/**
 * Anamnestický dotazník – dospělý — česká verze
 */

import type { FormConfig } from '../formTypes';

export const anamnezaCz: FormConfig = {
  id: 'anamneza-dospely-cz',
  title: 'Anamnestický dotazník – dospělý',
  description: '',
  language: 'cs',
  version: '1.0',
  sections: [
    // ── 1. Osobní údaje ──
    {
      title: 'Osobní údaje',
      fields: [
        { id: 'firstName', type: 'text', label: 'Jméno', required: true },
        { id: 'lastName', type: 'text', label: 'Příjmení', required: true },
        { id: 'birthNumber', type: 'text', label: 'Rodné číslo', required: true },
        { id: 'birthDate', type: 'date', label: 'Datum narození', required: true },
        {
          id: 'gender',
          type: 'radio',
          label: 'Pohlaví',
          required: true,
          options: [
            { value: 'male', label: 'Muž' },
            { value: 'female', label: 'Žena' },
            { value: 'other', label: 'Jiné' },
          ],
        },
        { id: 'insurance', type: 'text', label: 'Pojišťovna', required: true },
        { id: 'city', type: 'text', label: 'Město', required: true },
        { id: 'street', type: 'text', label: 'Ulice a číslo popisné', required: true },
        { id: 'zip', type: 'text', label: 'PSČ', required: true },
        { id: 'phone', type: 'tel', label: 'Telefon', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true },
      ],
    },
    // ── 2. Anamnéza ──
    {
      title: 'Anamnéza',
      fields: [
        {
          id: 'anamnezaInfo',
          type: 'staticText',
          label: '',
          content:
            'PROSÍM O PEČLIVÉ PŘEČTENÍ A VYPLNĚNÍ DOTAZNÍKU. KTERÉKOLIV ONEMOCNĚNÍ MŮŽE MÍT VLIV NA OŠETŘENÍ, V PŘÍPADĚ JAKÉKOLIV ZMĚNY ZDRAVOTNÍHO STAVU NEBO UŽÍVÁNÍ LÉKŮ O TOM INFORMUJTE SVOU DENTÁLNÍ HYGIENISTKU. VŠECHNY ÚDAJE JSOU SOUČÁSTÍ ZDRAVOTNÍ DOKUMENTACE, KTERÁ PODLÉHÁ LÉKAŘSKÉ MLČENLIVOSTI.',
        },
        {
          id: 'visitReason',
          type: 'checkboxGroup',
          label: 'Co je hlavním důvodem návštěvy dentální hygieny?',
          required: true,
          options: [
            { value: 'regular', label: 'Pravidelná dentální hygiena' },
            { value: 'dentist', label: 'Posílá mě zubní lékař' },
            { value: 'color', label: 'Nejsem spokojen/a s barvou zubů' },
            { value: 'sensitivity', label: 'Citlivost zubů' },
            { value: 'breath', label: 'Zápach z úst' },
            { value: 'bleeding', label: 'Krvácení dásní' },
            { value: 'pigmentation', label: 'Pigmentace' },
            { value: 'other', label: 'Jiné' },
          ],
        },
        {
          id: 'visitReasonOther',
          type: 'textarea',
          label: 'Jiné (upřesněte)',
          conditionalOn: { fieldId: 'visitReason', value: 'other' },
        },
        {
          id: 'hygieneFrequency',
          type: 'radio',
          label: 'Na dentální hygienu chodím',
          required: true,
          options: [
            { value: '2x', label: '2x ročně' },
            { value: '1x', label: '1x ročně' },
            { value: 'less', label: 'Méně často' },
            { value: 'never', label: 'Na dentální hygieně jsem nikdy nebyl/a' },
            { value: 'other', label: 'Jiné' },
          ],
        },
        {
          id: 'hygieneFrequencyOther',
          type: 'textarea',
          label: 'Jiné (upřesněte)',
          conditionalOn: { fieldId: 'hygieneFrequency', value: 'other' },
        },
        {
          id: 'lastHygieneDate',
          type: 'text',
          label: 'Přibližné datum poslední dentální hygieny (měsíc a rok)',
          required: true,
        },
        { id: 'dentistName', type: 'text', label: 'Váš zubní lékař', required: false },
        {
          id: 'orthodontics',
          type: 'radio',
          label: 'Podstoupil/a jste v minulosti ortodontickou léčbu (rovnátka)?',
          required: true,
          options: [
            { value: 'no', label: 'NE' },
            { value: 'yes', label: 'ANO' },
          ],
        },
        {
          id: 'allergies',
          type: 'checkboxGroup',
          label: 'Alergie',
          required: true,
          options: [
            { value: 'none', label: 'ŽÁDNÁ ALERGIE doposud nezjištěna' },
            { value: 'metals', label: 'Kovy' },
            { value: 'resins', label: 'Pryskyřice' },
            { value: 'latex', label: 'Latex' },
            { value: 'anesthesia', label: 'Lokální anestezie' },
            { value: 'analgesics', label: 'Analgetika' },
            { value: 'antibiotics', label: 'Antibiotika' },
            { value: 'menthol', label: 'Mentol' },
            { value: 'other', label: 'Jiné' },
          ],
        },
        {
          id: 'allergiesOther',
          type: 'textarea',
          label: 'Jiné alergie (upřesněte)',
          conditionalOn: { fieldId: 'allergies', value: 'other' },
        },
        {
          id: 'healthProblems',
          type: 'checkboxGroup',
          label: 'Zdravotní problémy',
          required: true,
          options: [
            { value: 'none', label: 'NETRPÍM ŽÁDNÝM CELKOVÝM ONEMOCNĚNÍM' },
            { value: 'heart', label: 'Srdeční onemocnění' },
            { value: 'vascular', label: 'Cévní onemocnění' },
            { value: 'diabetes', label: 'Cukrovka' },
            { value: 'hepatitis', label: 'Žloutenka' },
            { value: 'thyroid', label: 'Onemocnění štítné žlázy' },
            { value: 'epilepsy', label: 'Epilepsie' },
            { value: 'blood', label: 'Onemocnění krve' },
            { value: 'psychiatric', label: 'Psychiatrická diagnóza' },
            { value: 'heartAttack', label: 'Infarkt' },
            { value: 'pacemaker', label: 'Kardiostimulátor' },
            { value: 'asthma', label: 'Astma' },
            { value: 'hiv', label: 'HIV/AIDS' },
            { value: 'std', label: 'Pohlavní onemocnění' },
            { value: 'transplant', label: 'Transplantace orgánů' },
            { value: 'oncology', label: 'Onkologické onemocnění' },
            { value: 'stomach', label: 'Onemocnění žaludku/střev' },
            { value: 'skin', label: 'Kožní onemocnění' },
            { value: 'tuberculosis', label: 'Tuberkulóza' },
            { value: 'other', label: 'Jiné' },
          ],
        },
        {
          id: 'healthProblemsOther',
          type: 'textarea',
          label: 'Jiné onemocnění (upřesněte)',
          conditionalOn: { fieldId: 'healthProblems', value: 'other' },
        },
        {
          id: 'medications',
          type: 'textarea',
          label: 'Užívané léky',
          required: true,
          placeholder: 'Pokud žádné léky neužíváte, napište „NE"',
        },
        {
          id: 'smoking',
          type: 'radio',
          label: 'Kouříte?',
          required: true,
          options: [
            { value: 'no', label: 'NEKUŘÁK' },
            { value: 'light', label: 'Slabý kuřák' },
            { value: 'heavy', label: 'Silný kuřák' },
            { value: 'other', label: 'Jiné' },
          ],
        },
        {
          id: 'smokingOther',
          type: 'textarea',
          label: 'Jiné (upřesněte)',
          conditionalOn: { fieldId: 'smoking', value: 'other' },
        },
        {
          id: 'forWomen',
          type: 'checkboxGroup',
          label: 'Pro ženy',
          required: false,
          options: [
            { value: 'pregnancy', label: 'Těhotenství' },
            { value: 'breastfeeding', label: 'Kojení' },
            { value: 'contraception', label: 'Antikoncepce' },
            { value: 'other', label: 'Jiné' },
          ],
        },
        {
          id: 'forWomenOther',
          type: 'textarea',
          label: 'Jiné (upřesněte)',
          conditionalOn: { fieldId: 'forWomen', value: 'other' },
        },
        {
          id: 'jawProblems',
          type: 'checkboxGroup',
          label: 'Máte problém s čelistním kloubem?',
          required: true,
          options: [
            { value: 'none', label: 'NEMÁM' },
            { value: 'pain', label: 'Bolest při otevírání/zavírání' },
            { value: 'cracking', label: 'Praskání v čelistním kloubu' },
            { value: 'other', label: 'Jiné' },
          ],
        },
        {
          id: 'jawProblemsOther',
          type: 'textarea',
          label: 'Jiné (upřesněte)',
          conditionalOn: { fieldId: 'jawProblems', value: 'other' },
        },
      ],
    },
    // ── 3. Dentální hygiena ──
    {
      title: 'Dentální hygiena',
      fields: [
        {
          id: 'toothbrush',
          type: 'checkboxGroup',
          label: 'Jaký používáte zubní kartáček?',
          required: true,
          options: [
            { value: 'manual', label: 'Klasický manuální kartáček' },
            { value: 'electric', label: 'Elektrický kartáček' },
            { value: 'both', label: 'Střídám klasický i elektrický kartáček' },
            { value: 'other', label: 'Jiné' },
          ],
        },
        {
          id: 'toothbrushOther',
          type: 'textarea',
          label: 'Jiné (upřesněte)',
          conditionalOn: { fieldId: 'toothbrush', value: 'other' },
        },
        {
          id: 'dentalAids',
          type: 'checkboxGroup',
          label: 'Jaké používáte další dentální pomůcky?',
          required: true,
          options: [
            { value: 'none', label: 'NIC' },
            { value: 'interdental', label: 'Mezizubní kartáček' },
            { value: 'floss', label: 'Zubní nit' },
            { value: 'flosspick', label: 'Flosspick (nit na držáčku)' },
            { value: 'solo', label: 'Jednosvazkový (solo) kartáček' },
            { value: 'mouthwash', label: 'Ústní voda' },
            { value: 'tongueScraper', label: 'Škrabka na jazyk' },
            { value: 'other', label: 'Jiné' },
          ],
        },
        {
          id: 'dentalAidsOther',
          type: 'textarea',
          label: 'Jiné (upřesněte)',
          conditionalOn: { fieldId: 'dentalAids', value: 'other' },
        },
      ],
    },
    // ── 4. Souhlasy a podpis ──
    {
      title: 'Souhlasy a podpis',
      fields: [
        {
          id: 'consentTruthful',
          type: 'checkbox',
          label: 'Svým podpisem potvrzuji, že všechny mnou uvedené informace jsou pravdivé.',
          required: true,
        },
        {
          id: 'consentGdpr',
          type: 'checkbox',
          label:
            'Souhlasím se zpracováním osobních údajů podle zákona č. 110/2019 Sb., Zákon o ochraně osobních údajů a o změně některých zákonů, v platném znění pro účely vedení mé zdravotní dokumentace. Tento souhlas platí i pro zhotovení fotodokumentace.',
          required: true,
        },
        {
          id: 'consentInfection',
          type: 'checkbox',
          label:
            'Potvrzuji, že se v současné době neléčím s žádným infekčním onemocněním a nebyla mi nařízena karanténa.',
          required: true,
        },
        {
          id: 'consentCancellation',
          type: 'checkbox',
          label:
            'Souhlasím s tím, že pokud nebude předem domluvený termín zrušen minimálně 24 hodin předem či nedojde k dodržení domluveného termínu, bude mi účtován storno poplatek 500 Kč.',
          required: true,
        },
        { id: 'signature', type: 'signature', label: 'Podpis pacienta', required: true },
        { id: 'date', type: 'date', label: 'Datum', defaultValue: 'today' },
      ],
    },
  ],
};
