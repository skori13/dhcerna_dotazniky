import { getStrings } from '../i18n/ui-strings';
import type { Lang } from '../i18n/ui-strings';

interface GoogleDriveStatusProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  lang: Lang;
}

export function GoogleDriveStatus({ isConnected, onConnect, onDisconnect, lang }: GoogleDriveStatusProps) {
  const t = getStrings(lang);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}
      />
      {isConnected ? (
        <button
          onClick={onDisconnect}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t.driveConnected}
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="text-sm text-teal-600 hover:text-teal-800 font-medium"
        >
          {t.connectDrive}
        </button>
      )}
    </div>
  );
}
