import type { FormConfig } from '../config/formTypes';
import { formsByLanguage } from '../config/forms';
import { clinicConfig } from '../config/clinic';

interface FormSelectorProps {
  onSelect: (form: FormConfig) => void;
}

const formIcons: Record<string, string> = {
  anamneza: '\u{1F4CB}',
  souhlas: '\u{2705}',
  gdpr: '\u{1F512}',
  rtg: '\u{2622}\u{FE0F}',
};

function getIcon(id: string): string {
  const key = id.split('-')[0];
  return formIcons[key] || '\u{1F4C4}';
}

export function FormSelector({ onSelect }: FormSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center px-6 py-10">
      {/* Logo & clinic name */}
      <div className="flex flex-col items-center mb-10">
        <img
          src={clinicConfig.logoPath}
          alt="Logo"
          className="w-48 h-48 object-contain mb-3"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {clinicConfig.name && (
          <h1 className="text-2xl font-bold text-gray-800">{clinicConfig.name}</h1>
        )}
      </div>

      {/* Language columns */}
      <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
        {/* CZ column */}
        <div>
          <h2 className="text-center text-lg font-semibold text-gray-600 mb-4 uppercase tracking-wide">
            Cestina
          </h2>
          <div className="space-y-3">
            {formsByLanguage.cs.map((form) => (
              <button
                key={form.id}
                onClick={() => onSelect(form)}
                className="w-full bg-white rounded-2xl border-2 border-gray-200 p-5 text-left
                  hover:border-teal-400 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getIcon(form.id)}</span>
                  <div>
                    <div className="font-semibold text-gray-800 text-lg">
                      {form.title || form.id}
                    </div>
                    {form.description && (
                      <div className="text-sm text-gray-500 mt-0.5">{form.description}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* EN column */}
        <div>
          <h2 className="text-center text-lg font-semibold text-gray-600 mb-4 uppercase tracking-wide">
            English
          </h2>
          <div className="space-y-3">
            {formsByLanguage.en.map((form) => (
              <button
                key={form.id}
                onClick={() => onSelect(form)}
                className="w-full bg-white rounded-2xl border-2 border-gray-200 p-5 text-left
                  hover:border-teal-400 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getIcon(form.id)}</span>
                  <div>
                    <div className="font-semibold text-gray-800 text-lg">
                      {form.title || form.id}
                    </div>
                    {form.description && (
                      <div className="text-sm text-gray-500 mt-0.5">{form.description}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
