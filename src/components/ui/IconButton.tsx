import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'ghost' | 'solid';
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  size = 'md',
  variant = 'outline',
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const sizeClasses = {
    sm: 'size-9 text-xs',
    md: 'size-11 text-sm',
    lg: 'size-12 text-base',
  }[size];

  const variantClasses = {
    outline: 'border border-[#E6DCCD] bg-[#FFFFFF] text-[#736960] hover:text-[#1F1B18] hover:border-[#D8CCBA] shadow-2xs',
    ghost: 'text-[#736960] hover:text-[#1F1B18] hover:bg-[#F1EADF]',
    solid: 'bg-[#1F1B18] text-[#FFFFFF] hover:bg-[#38322D] shadow-xs',
  }[variant];

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`press grid place-items-center rounded-2xl transition cursor-pointer disabled:opacity-40 min-h-[44px] min-w-[44px] ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
