import { useState, useEffect, useCallback } from 'react';
import { getAllSubmissions, getSubmissionPdf } from '../utils/submissionStore';

type SubmissionMeta = Awaited<ReturnType<typeof getAllSubmissions>>[number];

interface HistoryScreenProps {
  onClose: () => void;
}

export function HistoryScreen({ onClose }: HistoryScreenProps) {
  const [items, setItems] = useState<SubmissionMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSubmissions()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = useCallback(async (id: string, patientName: string, formType: string) => {
    const blob = await getSubmissionPdf(id);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${patientName}_${formType}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-800">Historie formulářů</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-gray-200 text-gray-600
            hover:border-gray-300 transition-colors"
        >
          Zavřít
        </button>
      </div>

      {/* List */}
      <div className="max-w-2xl mx-auto w-full flex-1">
        {loading && (
          <p className="text-gray-400 text-center py-10">Načítání...</p>
        )}

        {!loading && items.length === 0 && (
          <p className="text-gray-400 text-center py-10">Žádné záznamy</p>
        )}

        {!loading && items.length > 0 && (
          <div className="space-y-2">
            {items.map((item) => {
              const date = new Date(item.submittedAt);
              const dateStr = date.toLocaleDateString('cs-CZ', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
              const timeStr = date.toLocaleTimeString('cs-CZ', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-800 truncate">
                      {item.patientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.formType} &middot; {dateStr} {timeStr}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(item.id, item.patientName, item.formType)}
                    className="shrink-0 px-4 py-2 text-sm font-medium rounded-xl bg-teal-600 text-white
                      hover:bg-teal-700 active:scale-[0.98] transition-all"
                  >
                    Stáhnout
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
