import type { FormConfig } from '../config/formTypes';
import { isFieldVisible } from '../utils/validation';
import { getStrings } from '../i18n/ui-strings';

interface ReviewScreenProps {
  formConfig: FormConfig;
  formData: Record<string, unknown>;
  onSubmit: () => void;
  onBack: () => void;
}

function formatValue(value: unknown, field: { type: string; options?: { value: string; label: string }[] }): string {
  if (value === undefined || value === null || value === '') return '—';
  if (field.type === 'checkbox') return value ? 'Yes' : 'No';
  if (field.type === 'signature') return '[Signature]';
  if (Array.isArray(value)) {
    return value
      .map((v) => field.options?.find((o) => o.value === v)?.label || v)
      .join(', ') || '—';
  }
  if (field.type === 'radio' || field.type === 'select') {
    return field.options?.find((o) => o.value === value)?.label || String(value);
  }
  return String(value);
}

export function ReviewScreen({ formConfig, formData, onSubmit, onBack }: ReviewScreenProps) {
  const t = getStrings(formConfig.language);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col">
      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.reviewTitle}</h2>

        {formConfig.sections.map((section, si) => (
          <div key={si} className="mb-6">
            {section.title && (
              <h3 className="text-lg font-semibold text-teal-700 mb-3 border-b border-teal-100 pb-1">
                {section.title}
              </h3>
            )}
            <div className="space-y-2">
              {section.fields
                .filter((f) => f.type !== 'divider' && f.type !== 'staticText' && isFieldVisible(f, formData))
                .map((field) => (
                  <div key={field.id} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{field.label || field.id}</span>
                    <span className="font-medium text-gray-800 text-right max-w-[60%]">
                      {formatValue(formData[field.id], field)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white/90 backdrop-blur border-t border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 text-lg font-medium rounded-xl border-2 border-gray-200 text-gray-600
              hover:border-gray-300 transition-colors"
          >
            {t.back}
          </button>
          <button
            onClick={onSubmit}
            className="px-8 py-3 text-lg font-semibold rounded-xl bg-teal-600 text-white
              hover:bg-teal-700 active:scale-[0.98] transition-all"
          >
            {t.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
