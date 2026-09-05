import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';
import { MetricCard } from '../../components/student/MetricCard';
import { LanguageCard } from '../../components/student/LanguageCard';
import { ExerciseCard } from '../../components/student/ExerciseCard';
import { Button } from '../../components/common/Button';

import { Loader } from '../../components/common/Loader';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboardData = await studentService.getDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (isLoading) {
    return <Loader message="Loading your dashboard..." />;
  }

  if (!data) {
    return <div className="text-center py-10 text-gray-500">Unable to load dashboard data.</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Hi, {user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Ready to read something amazing today?</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title={data.metrics.continueLearning.title}
          value={data.metrics.continueLearning.value}
          iconName={data.metrics.continueLearning.icon}
          bgColor="bg-pastel-blue"
          onClick={() => navigate('/student/exercises/ex1')}
        />
        <MetricCard 
          title={data.metrics.progress.title}
          value={data.metrics.progress.value}
          iconName={data.metrics.progress.icon}
          bgColor="bg-pastel-green"
          onClick={() => navigate('/student/progress')}
        />
        <MetricCard 
          title={data.metrics.badges.title}
          value={data.metrics.badges.value}
          iconName={data.metrics.badges.icon}
          bgColor="bg-pastel-purple"
        />
      </div>

      {/* Language Selection Quick Action */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Choose a Language</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.languages.map(lang => (
            <LanguageCard 
              key={lang.id}
              name={lang.name}
              native={lang.native}
              icon={lang.icon}
              isSelected={selectedLanguage === lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => navigate('/student/exercises/ex1', { state: { language: selectedLanguage } })}>
            Continue Practice {selectedLanguage ? `(${data.languages.find(l => l.id === selectedLanguage)?.name || ''})` : ''} →
          </Button>
        </div>
      </section>

      {/* Recommended Exercises */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.recommendedExercises.map(ex => (
            <ExerciseCard 
              key={ex.id}
              id={ex.id}
              title={ex.title}
              language={ex.language}
              difficulty={ex.difficulty}
              progress={ex.progress}
              iconName={ex.icon}
            />
          ))}
        </div>
      </section>
      
    </div>
  );
};
