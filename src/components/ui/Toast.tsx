import React, { useEffect } from 'react';

export interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onDismiss,
  duration = 3000,
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#1F1B18] text-[#FFFFFF] text-xs font-semibold shadow-xl border border-[#38322D] animate-rise"
    >
      <span>✨</span>
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-[#D8CCBA] hover:text-[#FFFFFF] ml-1 p-0.5 text-sm"
        aria-label="Đóng thông báo"
      >
        ✕
      </button>
    </div>
  );
};
