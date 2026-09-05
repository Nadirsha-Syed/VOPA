import React from 'react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        {/* Mock VOPA Logo */}
        <div className="text-4xl font-extrabold text-primary mb-2 flex items-center gap-2 tracking-tight">
          <span className="text-blue-600">V</span>
          <span className="text-orange-500">O</span>
          <span className="text-primary">P</span>
          <span className="text-yellow-500">A</span>
        </div>
        <p className="text-sm text-gray-500 mb-8 italic">Vowels of the People Association</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {children}
      </div>
    </div>
  );
};
