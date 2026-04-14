/**
 * Medical history questionnaire – adult — English version
 */

import type { FormConfig } from '../formTypes';

export const anamnezaEn: FormConfig = {
  id: 'anamneza-dospely-en',
  title: 'Medical History Questionnaire – Adult',
  description: '',
  language: 'en',
  version: '1.0',
  sections: [
    // ── 1. Personal Information ──
    {
      title: 'Personal Information',
      fields: [
        { id: 'firstName', type: 'text', label: 'First Name', required: true },
        { id: 'lastName', type: 'text', label: 'Last Name', required: true },
        { id: 'birthNumber', type: 'text', label: 'National ID Number', required: true },
        { id: 'birthDate', type: 'date', label: 'Date of Birth', required: true },
        {
          id: 'gender',
          type: 'radio',
          label: 'Gender',
          required: true,
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ],
        },
        { id: 'insurance', type: 'text', label: 'Insurance Company', required: true },
        { id: 'city', type: 'text', label: 'City', required: true },
        { id: 'street', type: 'text', label: 'Street and House Number', required: true },
        { id: 'zip', type: 'text', label: 'Postal Code', required: true },
        { id: 'phone', type: 'tel', label: 'Phone', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true },
      ],
    },
    // ── 2. Medical History ──
    {
      title: 'Medical History',
      fields: [
        {
          id: 'anamnezaInfo',
          type: 'staticText',
          label: '',
          content:
            'PLEASE READ AND FILL OUT THIS QUESTIONNAIRE CAREFULLY. ANY ILLNESS MAY AFFECT YOUR TREATMENT. IN CASE OF ANY CHANGE IN YOUR HEALTH CONDITION OR MEDICATION, PLEASE INFORM YOUR DENTAL HYGIENIST. ALL INFORMATION IS PART OF YOUR MEDICAL RECORDS AND IS SUBJECT TO MEDICAL CONFIDENTIALITY.',
        },
        {
          id: 'visitReason',
          type: 'checkboxGroup',
          label: 'What is the main reason for your dental hygiene visit?',
          required: true,
          options: [
            { value: 'regular', label: 'Regular dental hygiene' },
            { value: 'dentist', label: 'Referred by my dentist' },
            { value: 'color', label: 'Not satisfied with tooth color' },
            { value: 'sensitivity', label: 'Tooth sensitivity' },
            { value: 'breath', label: 'Bad breath' },
            { value: 'bleeding', label: 'Gum bleeding' },
            { value: 'pigmentation', label: 'Pigmentation' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'visitReasonOther',
          type: 'textarea',
          label: 'Other (please specify)',
          conditionalOn: { fieldId: 'visitReason', value: 'other' },
        },
        {
          id: 'hygieneFrequency',
          type: 'radio',
          label: 'How often do you visit a dental hygienist?',
          required: true,
          options: [
            { value: '2x', label: 'Twice a year' },
            { value: '1x', label: 'Once a year' },
            { value: 'less', label: 'Less often' },
            { value: 'never', label: 'I have never had dental hygiene' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'hygieneFrequencyOther',
          type: 'textarea',
          label: 'Other (please specify)',
          conditionalOn: { fieldId: 'hygieneFrequency', value: 'other' },
        },
        {
          id: 'lastHygieneDate',
          type: 'text',
          label: 'Approximate date of your last dental hygiene (month and year)',
          required: true,
        },
        { id: 'dentistName', type: 'text', label: 'Your dentist', required: false },
        {
          id: 'orthodontics',
          type: 'radio',
          label: 'Have you had orthodontic treatment (braces) in the past?',
          required: true,
          options: [
            { value: 'no', label: 'NO' },
            { value: 'yes', label: 'YES' },
          ],
        },
        {
          id: 'allergies',
          type: 'checkboxGroup',
          label: 'Allergies',
          required: true,
          options: [
            { value: 'none', label: 'NO KNOWN ALLERGIES' },
            { value: 'metals', label: 'Metals' },
            { value: 'resins', label: 'Resins' },
            { value: 'latex', label: 'Latex' },
            { value: 'anesthesia', label: 'Local anesthesia' },
            { value: 'analgesics', label: 'Analgesics' },
            { value: 'antibiotics', label: 'Antibiotics' },
            { value: 'menthol', label: 'Menthol' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'allergiesOther',
          type: 'textarea',
          label: 'Other allergies (please specify)',
          conditionalOn: { fieldId: 'allergies', value: 'other' },
        },
        {
          id: 'healthProblems',
          type: 'checkboxGroup',
          label: 'Health conditions',
          required: true,
          options: [
            { value: 'none', label: 'NO KNOWN HEALTH CONDITIONS' },
            { value: 'heart', label: 'Heart disease' },
            { value: 'vascular', label: 'Vascular disease' },
            { value: 'diabetes', label: 'Diabetes' },
            { value: 'hepatitis', label: 'Hepatitis' },
            { value: 'thyroid', label: 'Thyroid disease' },
            { value: 'epilepsy', label: 'Epilepsy' },
            { value: 'blood', label: 'Blood disorders' },
            { value: 'psychiatric', label: 'Psychiatric diagnosis' },
            { value: 'heartAttack', label: 'Heart attack' },
            { value: 'pacemaker', label: 'Pacemaker' },
            { value: 'asthma', label: 'Asthma' },
            { value: 'hiv', label: 'HIV/AIDS' },
            { value: 'std', label: 'Sexually transmitted disease' },
            { value: 'transplant', label: 'Organ transplant' },
            { value: 'oncology', label: 'Oncological disease' },
            { value: 'stomach', label: 'Stomach/intestinal disease' },
            { value: 'skin', label: 'Skin disease' },
            { value: 'tuberculosis', label: 'Tuberculosis' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'healthProblemsOther',
          type: 'textarea',
          label: 'Other conditions (please specify)',
          conditionalOn: { fieldId: 'healthProblems', value: 'other' },
        },
        {
          id: 'medications',
          type: 'textarea',
          label: 'Current medications',
          required: true,
          placeholder: 'If you are not taking any medication, write "NONE"',
        },
        {
          id: 'smoking',
          type: 'radio',
          label: 'Do you smoke?',
          required: true,
          options: [
            { value: 'no', label: 'NON-SMOKER' },
            { value: 'light', label: 'Light smoker' },
            { value: 'heavy', label: 'Heavy smoker' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'smokingOther',
          type: 'textarea',
          label: 'Other (please specify)',
          conditionalOn: { fieldId: 'smoking', value: 'other' },
        },
        {
          id: 'forWomen',
          type: 'checkboxGroup',
          label: 'For women',
          required: false,
          options: [
            { value: 'pregnancy', label: 'Pregnancy' },
            { value: 'breastfeeding', label: 'Breastfeeding' },
            { value: 'contraception', label: 'Contraception' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'forWomenOther',
          type: 'textarea',
          label: 'Other (please specify)',
          conditionalOn: { fieldId: 'forWomen', value: 'other' },
        },
        {
          id: 'jawProblems',
          type: 'checkboxGroup',
          label: 'Do you have any jaw joint problems?',
          required: true,
          options: [
            { value: 'none', label: 'NO PROBLEMS' },
            { value: 'pain', label: 'Pain when opening/closing' },
            { value: 'cracking', label: 'Clicking/cracking in the jaw joint' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'jawProblemsOther',
          type: 'textarea',
          label: 'Other (please specify)',
          conditionalOn: { fieldId: 'jawProblems', value: 'other' },
        },
      ],
    },
    // ── 3. Dental Hygiene ──
    {
      title: 'Dental Hygiene',
      fields: [
        {
          id: 'toothbrush',
          type: 'checkboxGroup',
          label: 'What type of toothbrush do you use?',
          required: true,
          options: [
            { value: 'manual', label: 'Manual toothbrush' },
            { value: 'electric', label: 'Electric toothbrush' },
            { value: 'both', label: 'I alternate between manual and electric' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'toothbrushOther',
          type: 'textarea',
          label: 'Other (please specify)',
          conditionalOn: { fieldId: 'toothbrush', value: 'other' },
        },
        {
          id: 'dentalAids',
          type: 'checkboxGroup',
          label: 'What other dental aids do you use?',
          required: true,
          options: [
            { value: 'none', label: 'NONE' },
            { value: 'interdental', label: 'Interdental brush' },
            { value: 'floss', label: 'Dental floss' },
            { value: 'flosspick', label: 'Floss pick' },
            { value: 'solo', label: 'Single-tuft (solo) brush' },
            { value: 'mouthwash', label: 'Mouthwash' },
            { value: 'tongueScraper', label: 'Tongue scraper' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'dentalAidsOther',
          type: 'textarea',
          label: 'Other (please specify)',
          conditionalOn: { fieldId: 'dentalAids', value: 'other' },
        },
      ],
    },
    // ── 4. Consent and Signature ──
    {
      title: 'Consent and Signature',
      fields: [
        {
          id: 'consentTruthful',
          type: 'checkbox',
          label: 'By signing, I confirm that all information provided by me is true and accurate.',
          required: true,
        },
        {
          id: 'consentGdpr',
          type: 'checkbox',
          label:
            'I consent to the processing of my personal data in accordance with Act No. 110/2019 Coll. on Personal Data Protection for the purpose of maintaining my medical records. This consent also applies to photographic documentation.',
          required: true,
        },
        {
          id: 'consentInfection',
          type: 'checkbox',
          label:
            'I confirm that I am not currently being treated for any infectious disease and no quarantine has been imposed on me.',
          required: true,
        },
        {
          id: 'consentCancellation',
          type: 'checkbox',
          label:
            'I agree that if a scheduled appointment is not cancelled at least 24 hours in advance or if I fail to attend, a cancellation fee of 500 CZK will be charged.',
          required: true,
        },
        { id: 'signature', type: 'signature', label: 'Patient Signature', required: true },
        { id: 'date', type: 'date', label: 'Date', defaultValue: 'today' },
      ],
    },
  ],
};
