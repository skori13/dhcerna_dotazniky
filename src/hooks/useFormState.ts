import { useState, useCallback } from 'react';
import type { FormConfig } from '../config/formTypes';
import { validateSection } from '../utils/validation';

export interface FormState {
  formConfig: FormConfig | null;
  formData: Record<string, unknown>;
  currentSection: number;
  errors: Record<string, string>;
  isComplete: boolean;
}

export function useFormState() {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const selectForm = useCallback((config: FormConfig) => {
    setFormConfig(config);
    setFormData({});
    setCurrentSection(0);
    setErrors({});
    setIsComplete(false);
  }, []);

  const updateField = useCallback((fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }, []);

  const validateCurrentSection = useCallback((): boolean => {
    if (!formConfig) return false;
    const section = formConfig.sections[currentSection];
    const sectionErrors = validateSection(section, formData);
    setErrors(sectionErrors);
    return Object.keys(sectionErrors).length === 0;
  }, [formConfig, currentSection, formData]);

  const nextSection = useCallback(() => {
    if (!validateCurrentSection()) return false;
    if (formConfig && currentSection < formConfig.sections.length - 1) {
      setCurrentSection((s) => s + 1);
      setErrors({});
      return true;
    }
    return false;
  }, [validateCurrentSection, formConfig, currentSection]);

  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection((s) => s - 1);
      setErrors({});
    }
  }, [currentSection]);

  const goToReview = useCallback(() => {
    if (validateCurrentSection()) {
      setIsComplete(true);
    }
  }, [validateCurrentSection]);

  const backFromReview = useCallback(() => {
    setIsComplete(false);
  }, []);

  const reset = useCallback(() => {
    setFormConfig(null);
    setFormData({});
    setCurrentSection(0);
    setErrors({});
    setIsComplete(false);
  }, []);

  return {
    formConfig,
    formData,
    currentSection,
    errors,
    isComplete,
    selectForm,
    updateField,
    nextSection,
    prevSection,
    goToReview,
    backFromReview,
    reset,
    validateCurrentSection,
  };
}
