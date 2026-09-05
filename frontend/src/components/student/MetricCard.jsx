import React from 'react';
import { Card } from '../common/Card';
import * as Icons from 'lucide-react';

export const MetricCard = ({ title, value, iconName, bgColor = 'bg-pastel-blue' }) => {
  const Icon = Icons[iconName] || Icons.HelpCircle;

  return (
    <Card className={`flex flex-col items-center justify-center p-6 ${bgColor} border-none`}>
      <div className="bg-white/50 p-3 rounded-full mb-3">
        <Icon className="w-6 h-6 text-primary-dark" />
      </div>
      <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </Card>
  );
};
