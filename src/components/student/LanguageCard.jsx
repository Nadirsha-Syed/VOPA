import React from 'react';
import { Card } from '../common/Card';

export const LanguageCard = ({ name, native, icon, isSelected, onClick }) => {
  return (
    <Card 
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 text-center hover:-translate-y-1 ${
        isSelected 
          ? 'border-2 border-primary bg-pastel-green/20 shadow-md' 
          : 'border-2 border-transparent hover:border-gray-200 hover:shadow-md'
      }`}
      padding="p-4 sm:p-6"
    >
      <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gray-50 rounded-full text-2xl shadow-sm border border-gray-100">
        {icon === 'US' ? '🇺🇸' : icon === 'IN' ? '🇮🇳' : icon === 'ES' ? '🇪🇸' : '🌍'}
      </div>
      <h3 className="font-bold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">{native}</p>
    </Card>
  );
};
