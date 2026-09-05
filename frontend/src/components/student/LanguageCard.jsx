import React from 'react';
import { Card } from '../common/Card';

const LanguageIcon = ({ icon }) => {
  if (icon === 'EN_FLAG') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full rounded-full overflow-hidden shadow-sm">
        <clipPath id="leftHalf">
          <rect x="0" y="0" width="50" height="100" />
        </clipPath>
        <g clipPath="url(#leftHalf)">
          <rect width="100" height="100" fill="#fff" />
          <rect y="10" width="100" height="10" fill="#cc0000" />
          <rect y="30" width="100" height="10" fill="#cc0000" />
          <rect y="50" width="100" height="10" fill="#cc0000" />
          <rect y="70" width="100" height="10" fill="#cc0000" />
          <rect y="90" width="100" height="10" fill="#cc0000" />
          <rect width="50" height="50" fill="#000066" />
        </g>
        <clipPath id="rightHalf">
          <rect x="50" y="0" width="50" height="100" />
        </clipPath>
        <g clipPath="url(#rightHalf)">
          <rect width="100" height="100" fill="#012169" />
          <path d="M0,0 L100,100 M100,0 L0,100" stroke="#fff" strokeWidth="15" />
          <path d="M0,0 L100,100 M100,0 L0,100" stroke="#C8102E" strokeWidth="5" />
          <path d="M50,0 L50,100 M0,50 L100,50" stroke="#fff" strokeWidth="20" />
          <path d="M50,0 L50,100 M0,50 L100,50" stroke="#C8102E" strokeWidth="12" />
        </g>
        <path d="M50,0 L50,100" stroke="#fff" strokeWidth="2" />
      </svg>
    );
  }
  
  if (icon === 'ES_FLAG') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full rounded-full overflow-hidden shadow-sm">
        <rect width="100" height="33.3" fill="#AA151B" />
        <rect y="33.3" width="100" height="33.4" fill="#F1BF00" />
        <rect y="66.7" width="100" height="33.3" fill="#AA151B" />
        <circle cx="30" cy="50" r="10" fill="#AA151B" opacity="0.8" />
      </svg>
    );
  }
  
  if (icon === 'HI_TEXT') {
    return <div className="text-red-500 font-bold text-2xl">हिंदी</div>;
  }
  
  if (icon === 'TA_TEXT') {
    return <div className="text-blue-600 font-bold text-2xl">தமிழ்</div>;
  }

  return <span className="text-2xl">🌍</span>;
};

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
      <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gray-50 rounded-full shadow-sm border border-gray-100">
        <LanguageIcon icon={icon} />
      </div>
      <h3 className="font-bold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">{native}</p>
    </Card>
  );
};
