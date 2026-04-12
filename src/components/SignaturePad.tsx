import { useRef, useEffect, useCallback } from 'react';
import SignaturePadLib from 'signature_pad';

interface SignaturePadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  clearLabel: string;
}

export function SignaturePad({ value, onChange, clearLabel }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLib | null>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext('2d');
    ctx?.scale(ratio, ratio);
    if (padRef.current && value) {
      padRef.current.fromDataURL(value);
    }
  }, [value]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    padRef.current = new SignaturePadLib(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(0, 0, 0)',
    });

    padRef.current.addEventListener('endStroke', () => {
      if (padRef.current) {
        onChange(padRef.current.toDataURL('image/png'));
      }
    });

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      padRef.current?.off();
    };
  }, [onChange, resizeCanvas]);

  const clear = () => {
    padRef.current?.clear();
    onChange('');
  };

  return (
    <div className="space-y-2">
      <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white touch-none">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: 180 }}
        />
      </div>
      <button
        type="button"
        onClick={clear}
        className="text-sm text-teal-600 hover:text-teal-800 underline"
      >
        {clearLabel}
      </button>
    </div>
  );
}
