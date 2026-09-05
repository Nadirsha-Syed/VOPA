import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`rounded-lg border px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 transition-all
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
            : 'border-gray-300 focus:border-primary focus:ring-primary/20 hover:border-gray-400'
          }`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
