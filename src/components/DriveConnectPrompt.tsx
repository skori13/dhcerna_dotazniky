import { getStrings } from '../i18n/ui-strings';
import type { Lang } from '../i18n/ui-strings';

interface DriveConnectPromptProps {
  lang: Lang;
  onConnect: () => void;
  onContinue: () => void;
  onCancel: () => void;
}

export function DriveConnectPrompt({ lang, onConnect, onContinue, onCancel }: DriveConnectPromptProps) {
  const t = getStrings(lang);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="text-3xl">{'\u26A0\uFE0F'}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{t.drivePromptTitle}</h3>
            <p className="text-gray-600 mt-2 leading-relaxed">{t.drivePromptBody}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={onConnect}
            className="w-full px-5 py-3 text-lg font-semibold rounded-xl bg-teal-600 text-white
              hover:bg-teal-700 active:scale-[0.98] transition-all"
          >
            {t.drivePromptConnect}
          </button>
          <button
            onClick={onContinue}
            className="w-full px-5 py-3 text-base font-medium rounded-xl border-2 border-gray-200
              text-gray-700 hover:border-gray-300 transition-colors"
          >
            {t.drivePromptContinue}
          </button>
          <button
            onClick={onCancel}
            className="w-full px-5 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {t.drivePromptCancel}
          </button>
        </div>
      </div>
    </div>
  );
}
