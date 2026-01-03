import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className="glass-card bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-100/50 dark:border-gray-700/50 flex justify-between items-center bg-white/50 dark:bg-black/20 backdrop-blur-md">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-500">{title}</h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};