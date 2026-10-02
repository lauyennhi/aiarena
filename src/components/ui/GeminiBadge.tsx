import React from 'react';

export interface GeminiBadgeProps {
  label?: string;
  size?: 'sm' | 'md';
}

export const GeminiBadge: React.FC<GeminiBadgeProps> = ({
  label = 'Gemini AI',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#ECDABF] bg-[#F6ECDA] font-semibold text-[#8A5E17] shadow-2xs ${sizeClasses}`}
    >
      <span className="text-xs">✨</span>
      <span>{label}</span>
    </span>
  );
};
