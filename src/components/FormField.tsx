import type { FormField as FieldConfig } from '../config/formTypes';
import { SignaturePad } from './SignaturePad';
import { getStrings } from '../i18n/ui-strings';
import type { Lang } from '../i18n/ui-strings';

interface FormFieldProps {
  field: FieldConfig;
  value: unknown;
  error: string | null;
  onChange: (value: unknown) => void;
  lang: Lang;
}

export function FormFieldComponent({ field, value, error, onChange, lang }: FormFieldProps) {
  const t = getStrings(lang);

  const errorMsg = error === 'required' ? t.requiredField : error;
  const baseInputClass = `w-full px-4 py-3 text-lg rounded-xl border-2 transition-colors outline-none
    ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400 bg-white'}`;

  if (field.type === 'divider') {
    return <hr className="border-gray-200 my-4" />;
  }

  if (field.type === 'staticText') {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-gray-700 leading-relaxed">
        {field.content}
      </div>
    );
  }

  if (field.type === 'signature') {
    return (
      <div className="space-y-2">
        {field.label && (
          <label className="block text-lg font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <p className="text-sm text-gray-500">{t.signatureHint}</p>
        <SignaturePad
          value={(value as string) || ''}
          onChange={onChange}
          clearLabel={t.clearSignature}
        />
        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
      </div>
    );
  }

  const label = (
    <label className="block text-lg font-medium text-gray-700 mb-1">
      {field.label || field.id}
      {field.required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );

  if (field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number' || field.type === 'date') {
    return (
      <div className="space-y-1">
        {label}
        <input
          type={field.type}
          inputMode={field.inputMode as React.HTMLAttributes<HTMLInputElement>['inputMode']}
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          maxLength={field.maxLength}
          className={baseInputClass}
        />
        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-1">
        {label}
        <textarea
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          maxLength={field.maxLength}
          rows={3}
          className={baseInputClass + ' resize-none'}
        />
        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer py-2">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-6 h-6 rounded border-2 border-gray-300 text-teal-600 mt-0.5 shrink-0"
          />
          <span className="text-lg text-gray-700">
            {field.label || field.id}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </span>
        </label>
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      </div>
    );
  }

  if (field.type === 'radio') {
    return (
      <div className="space-y-2">
        {label}
        <div className="flex flex-wrap gap-3">
          {field.options?.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors min-w-[100px]
                ${value === opt.value ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'}`}
            >
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="w-5 h-5 text-teal-600"
              />
              <span className="text-base">{opt.label || opt.value}</span>
            </label>
          ))}
        </div>
        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
      </div>
    );
  }

  if (field.type === 'checkboxGroup') {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="space-y-2">
        {label}
        <div className="grid grid-cols-2 gap-2">
          {field.options?.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors
                ${selected.includes(opt.value) ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'}`}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selected, opt.value]);
                  } else {
                    onChange(selected.filter((v) => v !== opt.value));
                  }
                }}
                className="w-5 h-5 text-teal-600"
              />
              <span className="text-base">{opt.label || opt.value}</span>
            </label>
          ))}
        </div>
        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="space-y-1">
        {label}
        <select
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
        >
          <option value="">{field.placeholder || '—'}</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label || opt.value}
            </option>
          ))}
        </select>
        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
      </div>
    );
  }

  return null;
}
