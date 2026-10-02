import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold transition rounded-2xl min-h-[44px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed press';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs sm:text-sm',
    lg: 'px-6 py-3 text-sm sm:text-base',
  }[size];

  const variantClasses = {
    primary: 'bg-[#1F1B18] text-[#FFFFFF] hover:bg-[#38322D] shadow-xs',
    secondary: 'bg-[#F1EADF] text-[#1F1B18] hover:bg-[#E6DCCD] border border-[#E6DCCD]',
    outline: 'border border-[#E6DCCD] bg-[#FFFFFF] text-[#1F1B18] hover:bg-[#F1EADF] shadow-2xs',
    ghost: 'text-[#736960] hover:text-[#1F1B18] hover:bg-[#F1EADF]',
    danger: 'bg-[#8B1E2B] text-[#FFFFFF] hover:bg-[#A82B3A]',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
