import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Mic, MicOff, CheckCircle, RotateCcw } from 'lucide-react';
import studentService from '../../services/studentService';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

import { Loader } from '../../components/common/Loader';

const BCP47_MAP = {
  english: 'en-US',
  en: 'en-US',
  hindi: 'hi-IN',
  hi: 'hi-IN',
  tamil: 'ta-IN',
  ta: 'ta-IN',
  telugu: 'te-IN',
  te: 'te-IN',
  spanish: 'es-ES',
  es: 'es-ES',
  marathi: 'mr-IN',
  mr: 'mr-IN',
};

export const Exercise = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Detect requested language from location.state or query params or localStorage
  const targetLang =
    location.state?.language ||
    location.state?.languageId ||
    searchParams.get('lang') ||
    localStorage.getItem('vopa_selected_language') ||
    'English';

  const speechLang =
    BCP47_MAP[exercise?.language?.toLowerCase()] ||
    BCP47_MAP[targetLang?.toLowerCase()] ||
    'en-US';

  const { isListening, transcript, error, startListening, stopListening } = useSpeechRecognition({
    lang: speechLang,
    continuous: true,
    interimResults: true,
  });

  useEffect(() => {
    const loadExercise = async () => {
      setIsLoading(true);
      try {
        const data = await studentService.getExercise(id, targetLang);
        setExercise(data);
      } catch (err) {
        console.error('Failed to load exercise:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadExercise();
  }, [id, targetLang]);

  const handleNextSentence = async () => {
    if (isListening) {
      stopListening();
    }
    setIsLoading(true);
    try {
      const data = await studentService.getExercise(null, targetLang, exercise?.content);
      setExercise(data);
    } catch (err) {
      console.error('Failed to change exercise:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    stopListening();
    navigate(`/student/exercises/${exercise?.id || 'ex1'}/result`, { 
      state: {
        transcript,
        originalText: exercise?.content,
        language: exercise?.language,
        title: exercise?.title,
      }
    });
  };

  if (isLoading) {
    return <Loader message="Loading exercise..." />;
  }

  if (!exercise) {
    return <div className="text-center py-10 text-gray-500">Exercise not found.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-block px-3 py-1 bg-pastel-blue text-primary-dark font-semibold text-xs rounded-full uppercase tracking-wider mb-1">
          {exercise.language} Practice
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">{exercise.title}</h1>
        <p className="text-gray-500 text-lg">Read the text below out loud.</p>
      </div>

      {/* Reading Card */}
      <Card padding="p-8 sm:p-12" className="text-center relative overflow-hidden bg-white shadow-xl border-t-4 border-primary">
        <p className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-800 leading-relaxed tracking-wide">
          {exercise.content}
        </p>
      </Card>

      {/* Next Sentence Switcher */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleNextSentence}
          className="flex items-center gap-2 px-4 py-2 bg-pastel-purple text-primary-dark hover:bg-purple-100 font-semibold rounded-xl text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Next Sentence
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center space-y-6">
        
        {error && (
          <div className="text-red-500 bg-red-50 px-4 py-2 rounded-lg text-sm font-medium">
            Error: {error}
          </div>
        )}

        <div className="relative">
          {isListening && (
            <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping"></div>
          )}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative z-10 p-6 rounded-full text-white shadow-lg transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 scale-110' 
                : 'bg-primary hover:bg-primary-dark hover:-translate-y-1'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>
        </div>
        
        <p className="text-gray-500 font-medium">
          {isListening ? 'Listening... Tap to stop' : 'Tap microphone to start'}
        </p>

        {/* Live Transcript (optional visual feedback) */}
        {isListening && transcript && (
          <div className="w-full max-w-xl p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-600 italic text-center">
            "{transcript}..."
          </div>
        )}

      </div>

      {/* Finish Action */}
      <div className="flex justify-end pt-8 border-t border-gray-200">
        <Button 
          onClick={handleFinish}
          disabled={isListening && !transcript}
          className="w-full sm:w-auto px-8"
        >
          <span className="flex items-center gap-2">
            Finish Reading
            <CheckCircle className="w-5 h-5" />
          </span>
        </Button>
      </div>

    </div>
  );
};
