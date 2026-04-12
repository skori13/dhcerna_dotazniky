interface ProgressBarProps {
  current: number;
  total: number;
  lang: 'cs' | 'en';
}

export function ProgressBar({ current, total, lang }: ProgressBarProps) {
  const pct = ((current + 1) / total) * 100;
  const label = lang === 'cs' ? 'Sekce' : 'Section';

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>
          {label} {current + 1} / {total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-teal-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
