import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Award, RotateCcw, Home, Star } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Get data passed from the Exercise screen
  const { transcript = '', originalText = '' } = location.state || {};

  // Simple accuracy calculation (mock logic for MVP)
  // In a real app, this would be a complex NLP matching algorithm
  const { score, matchedWords, totalWords } = useMemo(() => {
    if (!originalText) return { score: 0, matchedWords: 0, totalWords: 0 };
    
    const cleanStr = (str) => str.toLowerCase().replace(/[.,!?;:()[\]]/g, '').trim().split(/\s+/);
    
    const originalWords = cleanStr(originalText);
    const spokenWords = cleanStr(transcript);
    
    let matches = 0;
    
    // Very naive matching logic: count words that exist in both arrays
    // A real app would use levenshtein distance or sequence matching
    const spokenSet = new Set(spokenWords);
    originalWords.forEach(word => {
      if (spokenSet.has(word)) {
        matches++;
      }
    });

    const accuracy = originalWords.length > 0 
      ? Math.round((matches / originalWords.length) * 100) 
      : 0;

    return {
      score: accuracy > 100 ? 100 : accuracy, // cap at 100
      matchedWords: matches,
      totalWords: originalWords.length
    };
  }, [transcript, originalText]);

  const getFeedbackMessage = (score) => {
    if (score >= 90) return "Outstanding! You're a reading star! 🌟";
    if (score >= 70) return "Great job! Keep practicing! 👏";
    return "Good effort! Let's try again! 💪";
  };

  const getStars = (score) => {
    if (score >= 90) return 3;
    if (score >= 70) return 2;
    if (score > 0) return 1;
    return 0;
  };

  const stars = getStars(score);

  if (!originalText) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Oops! No results found.</h2>
        <Button onClick={() => navigate('/student/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto pb-10">
      
      <div className="text-center space-y-4 pt-8">
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((starIndex) => (
            <Star 
              key={starIndex}
              className={`w-16 h-16 ${
                starIndex <= stars 
                  ? 'text-yellow-400 fill-yellow-400 animate-bounce' 
                  : 'text-gray-200'
              }`}
              style={{ animationDelay: `${starIndex * 150}ms` }}
            />
          ))}
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900">
          {getFeedbackMessage(score)}
        </h1>
      </div>

      <Card padding="p-8" className="bg-white text-center shadow-lg border-2 border-primary/20">
        <Award className="w-16 h-16 mx-auto text-primary mb-4" />
        <div className="text-6xl font-black text-primary mb-2">
          {score}%
        </div>
        <p className="text-gray-500 font-medium">Accuracy Score</p>
        
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
          <div>
            <div className="text-3xl font-bold text-gray-800">{matchedWords}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">Words Correct</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">{totalWords}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">Total Words</div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Button 
          variant="secondary" 
          onClick={() => navigate(`/student/exercises`)}
          className="flex-1 sm:flex-none justify-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Try Again
        </Button>
        <Button 
          onClick={() => navigate('/student/dashboard')}
          className="flex-1 sm:flex-none justify-center"
        >
          <Home className="w-5 h-5 mr-2" />
          Dashboard
        </Button>
      </div>

    </div>
  );
};
