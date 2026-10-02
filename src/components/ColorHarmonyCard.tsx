import React from 'react';
import type { HarmonyResult } from '../lib/color/harmony';

interface ColorHarmonyCardProps {
  result: HarmonyResult;
  swatches: Array<{ label: string; hex: string }>;
  compact?: boolean;
}

const NOTE_STYLE = {
  good: { icon: '●', className: 'text-[#4F7350]' },
  info: { icon: '◆', className: 'text-[#8A5E17]' },
  warn: { icon: '▲', className: 'text-[#8B1E2B]' },
} as const;

export const ColorHarmonyCard: React.FC<ColorHarmonyCardProps> = ({ result, swatches, compact = false }) => {
  const barTone = result.score >= 85 ? 'bg-[#4F7350]' : result.score >= 70 ? 'bg-[#8A5E17]' : 'bg-[#8B1E2B]';

  return (
    <section aria-labelledby="harmony-heading" className="rounded-[28px] border border-[#E6DCCD] bg-[#FFFFFF] p-6 shadow-[0_4px_20px_-2px_rgba(31,27,24,0.03)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="harmony-heading" className="font-serif text-lg font-bold text-[#1F1B18]">Hài hòa màu sắc</h3>
          <p className="mt-1 text-xs text-[#736960]">{result.relationLabel} · độ tương phản {result.contrast}:1</p>
        </div>
        <div className="text-right">
          <p className="font-serif text-2xl font-bold text-[#1F1B18] tabular">{result.score}<span className="text-sm font-normal text-[#736960]">/100</span></p>
          <p className="text-xs font-semibold text-[#4F7350]">{result.label}</p>
        </div>
      </div>

      <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-[#F1EADF]" aria-hidden="true">
        <div className={`h-full rounded-full transition-all duration-300 ${barTone}`} style={{ width: `${result.score}%` }} />
      </div>

      <ul aria-label="Các màu trong bản phối" className="mt-4 flex flex-wrap gap-2.5">
        {swatches.map((swatch) => (
          <li key={`${swatch.label}-${swatch.hex}`} className="flex items-center gap-2 text-xs bg-[#FBF8F3] px-3 py-1.5 rounded-xl border border-[#E6DCCD] text-[#1F1B18]">
            <span aria-hidden="true" className="size-4.5 rounded-md border border-[#E6DCCD] shadow-2xs shrink-0" style={{ backgroundColor: swatch.hex }} />
            <span className="font-medium">{swatch.label}</span>
          </li>
        ))}
      </ul>

      {!compact && result.notes.length > 0 && (
        <ul className="mt-4 space-y-2 pt-3 border-t border-[#E6DCCD]">
          {result.notes.map((note) => (
            <li key={note.text} className="flex gap-2 text-xs leading-relaxed text-[#736960]">
              <span aria-hidden="true" className={`mt-0.5 text-[10px] ${NOTE_STYLE[note.tone].className}`}>{NOTE_STYLE[note.tone].icon}</span>
              <span>{note.text}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
