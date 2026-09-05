import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import { LanguageCard } from '../../components/student/LanguageCard';
import { Button } from '../../components/common/Button';

export const Languages = () => {
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        // Reuse the dashboard data for now, or you could create a specific getLanguages method in the service
        const dashboardData = await studentService.getDashboard();
        setLanguages(dashboardData.languages);
      } catch (error) {
        console.error("Failed to load languages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLanguages();
  }, []);

  const handleContinue = () => {
    if (selectedLanguage) {
      // Typically you'd save this to context or local storage, or pass as state
      navigate('/student/exercises', { state: { languageId: selectedLanguage } });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          What do you want to read? 🌍
        </h1>
        <p className="text-gray-500 mt-1">Select a language to see available exercises.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {languages.map(lang => (
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

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Button 
          disabled={!selectedLanguage}
          onClick={handleContinue}
          className="w-full sm:w-auto"
        >
          See Exercises
        </Button>
      </div>
    </div>
  );
};
