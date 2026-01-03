import React from 'react';
import { useToastStore, ToastType } from '../../store/useToastStore';

const ToastItem: React.FC<{ id: string; message: string; type: ToastType; onClose: () => void }> = ({
  id,
  message,
  type,
  onClose,
}) => {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-lg mb-2 flex items-center justify-between min-w-[300px] animate-fade-in-up`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-75">✕</button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
