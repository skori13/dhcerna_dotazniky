import { getStrings } from '../i18n/ui-strings';
import type { Lang } from '../i18n/ui-strings';

interface SuccessScreenProps {
  lang: Lang;
  driveUrl: string | null;
  pdfBlob: Blob | null;
  fileName: string;
  isUploading: boolean;
  uploadError: string | null;
  onNewPatient: () => void;
}

export function SuccessScreen({
  lang,
  driveUrl,
  pdfBlob,
  fileName,
  isUploading,
  uploadError,
  onNewPatient,
}: SuccessScreenProps) {
  const t = getStrings(lang);

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!pdfBlob) return;
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: fileName });
    }
  };

  const canShare = typeof navigator.share === 'function';

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center justify-center px-6 py-10">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
        {/* Status icon */}
        <div className="text-6xl">
          {isUploading ? '\u{23F3}' : uploadError ? '\u{26A0}\u{FE0F}' : '\u{2705}'}
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          {isUploading
            ? t.uploading
            : driveUrl
              ? t.formCompleted
              : uploadError
                ? t.uploadFailed
                : t.formCompleted}
        </h2>

        {/* Drive status */}
        {driveUrl && (
          <div className="flex items-center justify-center gap-2 text-teal-600 font-medium">
            <span>{t.uploadSuccess}</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {driveUrl && (
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-6 py-3 text-lg font-medium rounded-xl border-2 border-teal-500 text-teal-600 hover:bg-teal-50 transition-colors"
            >
              {t.openInDrive}
            </a>
          )}

          <button
            onClick={handleDownload}
            className="w-full px-6 py-3 text-lg font-medium rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
          >
            {t.downloadPdf}
          </button>

          {canShare && (
            <button
              onClick={handleShare}
              className="w-full px-6 py-3 text-lg font-medium rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
            >
              {t.share}
            </button>
          )}

          <button
            onClick={onNewPatient}
            className="w-full px-8 py-3 text-lg font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98] transition-all"
          >
            {t.newPatient}
          </button>
        </div>
      </div>
    </div>
  );
}
