import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import * as Icons from 'lucide-react';

export const ExerciseCard = ({ id, title, language, difficulty, progress, iconName }) => {
  const navigate = useNavigate();
  const IconComponent = Icons[iconName];

  return (
    <Card 
      onClick={() => navigate(`/student/exercises/${id}`, { state: { language, languageId: language } })}
      className="cursor-pointer hover:shadow-md transition-shadow group flex flex-col items-center text-center"
      padding="p-5"
    >
      <div className="w-16 h-16 bg-pastel-yellow rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
        {IconComponent ? (
          <IconComponent className="w-8 h-8 text-orange-500" />
        ) : (
          <span className="text-3xl">{iconName}</span>
        )}
      </div>
      
      <h4 className="font-bold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{language}</p>
      
      <div className="mt-4 w-full">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium text-gray-500">{difficulty}</span>
          <span className="font-medium text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
