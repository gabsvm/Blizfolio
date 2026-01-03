import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full group">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border rounded-xl outline-none transition-all duration-300
            placeholder-gray-400 dark:placeholder-gray-500
            ${error 
              ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
              : 'border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 hover:border-gray-300 dark:hover:border-gray-600'}
            ${props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 ml-1 text-sm text-red-500 font-medium flex items-center gap-1">⚠️ {error}</p>}
        {helperText && !error && <p className="mt-1.5 ml-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';