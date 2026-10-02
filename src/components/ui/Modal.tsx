import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${sizeClasses} rounded-[30px] border border-[#E6DCCD] bg-[#FFFFFF] shadow-2xl p-6 sm:p-8 animate-rise overflow-hidden`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-[#E6DCCD] pb-4 mb-5">
            <div>
              {title && <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1B18]">{title}</h3>}
              {description && <p className="text-xs text-[#736960] mt-1">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="press grid size-10 place-items-center rounded-2xl border border-[#E6DCCD] bg-[#FFFFFF] text-[#736960] hover:text-[#1F1B18] hover:bg-[#F1EADF] transition"
              aria-label="Đóng hộp thoại"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};
