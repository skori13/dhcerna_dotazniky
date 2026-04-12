import type { FormConfig } from '../config/formTypes';
import { FormFieldComponent } from './FormField';
import { ProgressBar } from './ProgressBar';
import { isFieldVisible } from '../utils/validation';
import { getStrings } from '../i18n/ui-strings';

interface FormWizardProps {
  formConfig: FormConfig;
  formData: Record<string, unknown>;
  currentSection: number;
  errors: Record<string, string>;
  onUpdateField: (fieldId: string, value: unknown) => void;
  onNext: () => void;
  onPrev: () => void;
  onReview: () => void;
  onBack: () => void;
}

export function FormWizard({
  formConfig,
  formData,
  currentSection,
  errors,
  onUpdateField,
  onNext,
  onPrev,
  onReview,
  onBack,
}: FormWizardProps) {
  const t = getStrings(formConfig.language);
  const section = formConfig.sections[currentSection];
  const isLastSection = currentSection === formConfig.sections.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-teal-600 text-sm font-medium"
            >
              &larr; {formConfig.title || formConfig.id}
            </button>
          </div>
          <ProgressBar
            current={currentSection}
            total={formConfig.sections.length}
            lang={formConfig.language}
          />
        </div>
      </div>

      {/* Section content */}
      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        {section.title && (
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{section.title}</h2>
        )}
        {section.description && (
          <p className="text-gray-500 mb-6">{section.description}</p>
        )}

        <div className="space-y-6">
          {section.fields
            .filter((field) => isFieldVisible(field, formData))
            .map((field) => (
              <FormFieldComponent
                key={field.id}
                field={field}
                value={formData[field.id]}
                error={errors[field.id] || null}
                onChange={(val) => onUpdateField(field.id, val)}
                lang={formConfig.language}
              />
            ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur border-t border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between gap-4">
          <button
            onClick={onPrev}
            disabled={currentSection === 0}
            className="px-6 py-3 text-lg font-medium rounded-xl border-2 border-gray-200 text-gray-600
              disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-300 transition-colors"
          >
            {t.back}
          </button>
          {isLastSection ? (
            <button
              onClick={onReview}
              className="px-8 py-3 text-lg font-semibold rounded-xl bg-teal-600 text-white
                hover:bg-teal-700 active:scale-[0.98] transition-all"
            >
              {t.review}
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-8 py-3 text-lg font-semibold rounded-xl bg-teal-600 text-white
                hover:bg-teal-700 active:scale-[0.98] transition-all"
            >
              {t.next}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
