import React from 'react';

export interface KeepChipsProps {
  characteristics: string[];
}

export const KeepChips: React.FC<KeepChipsProps> = ({ characteristics }) => {
  if (!characteristics || characteristics.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {characteristics.map((c, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E5EDE2] text-[#4F7350] border border-[#CDE0C9] text-[11px] font-medium"
        >
          <span className="text-xs">✓</span>
          <span>{c}</span>
        </span>
      ))}
    </div>
  );
};
