import React from 'react';

export interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'heritage';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  active = false,
  onClick,
  onRemove,
  variant = 'default',
}) => {
  const variantStyles = {
    default: active
      ? 'bg-[#1F1B18] text-[#FFFFFF] border-[#1F1B18]'
      : 'bg-[#FFFFFF] text-[#736960] border-[#E6DCCD] hover:border-[#D8CCBA] hover:text-[#1F1B18]',
    success: 'bg-[#E5EDE2] text-[#4F7350] border-[#CDE0C9]',
    warning: 'bg-[#F6ECDA] text-[#8A5E17] border-[#ECDABF]',
    heritage: 'bg-[#FBF0EE] text-[#8B1E2B] border-[#F2D7D3]',
  }[variant];

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition select-none shadow-2xs ${
        onClick ? 'cursor-pointer press' : ''
      } ${variantStyles}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-75 p-0.5 ml-0.5"
          aria-label={`Xóa ${label}`}
        >
          ✕
        </button>
      )}
    </span>
  );
};
