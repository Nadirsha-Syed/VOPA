import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import * as Icons from 'lucide-react';
import studentService from '../../services/studentService';
import { Card } from '../../components/common/Card';

import { Loader } from '../../components/common/Loader';

export const Progress = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progressData = await studentService.getProgress();
        setData(progressData);
      } catch (error) {
        console.error("Failed to load progress:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgress();
  }, []);

  if (isLoading) {
    return <Loader message="Loading your progress..." />;
  }

  if (!data) {
    return <div className="text-center py-10 text-gray-500">Unable to load progress data.</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Your Progress 🚀
        </h1>
        <p className="text-gray-500 mt-1">See how much you've learned this week!</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card padding="p-6" className="flex items-center space-x-4 bg-pastel-blue/30 border-none shadow-sm">
          <div className="p-4 bg-white rounded-xl shadow-sm text-blue-500">
            <Icons.Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Time Reading</p>
            <p className="text-2xl font-bold text-gray-900">{data.totalReadingTime} mins</p>
          </div>
        </Card>
        
        <Card padding="p-6" className="flex items-center space-x-4 bg-pastel-green/30 border-none shadow-sm">
          <div className="p-4 bg-white rounded-xl shadow-sm text-primary">
            <Icons.Target className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Score</p>
            <p className="text-2xl font-bold text-gray-900">{data.averageScore}%</p>
          </div>
        </Card>
      </div>

      {/* Chart Section */}
      <Card padding="p-6 sm:p-8" className="shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Accuracy</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.weeklyStats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 14 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 14 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#2E8C5C', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#2E8C5C" 
                strokeWidth={4} 
                dot={{ fill: '#2E8C5C', strokeWidth: 2, r: 6, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#2E8C5C', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Achievements */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.recentAchievements && data.recentAchievements.length > 0 ? (
            data.recentAchievements.map(achievement => {
              const Icon = Icons[achievement.icon] || Icons.Award;
              return (
                <Card key={achievement.id} padding="p-4" className="flex items-center space-x-4 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                  <div className={`p-3 rounded-full ${achievement.bg} ${achievement.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-gray-800">{achievement.title}</p>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-8 px-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <Icons.Award className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="font-bold text-gray-700">No badges earned yet</p>
              <p className="text-xs text-gray-400 mt-1">Complete your first reading practice to unlock achievement badges!</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
