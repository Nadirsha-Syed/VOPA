import React from 'react';

export const Loader = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="text-gray-500 font-medium animate-pulse">{message}</p>
  </div>
);
