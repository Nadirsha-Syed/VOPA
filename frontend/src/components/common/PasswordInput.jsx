import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordInput = forwardRef(({ label, error, className = '', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-gray-900 focus:outline-none focus:ring-2 transition-all
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
              : 'border-gray-300 focus:border-primary focus:ring-primary/20 hover:border-gray-400'
            }`}
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
