import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, CheckCircle } from 'lucide-react';
import studentService from '../../services/studentService';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

import { Loader } from '../../components/common/Loader';

export const Exercise = () => {
  // In a real app, we'd get the ID from URL, but in our router it's just /student/exercises 
  // Wait, our route in App.jsx is path="exercises" (no ID) and path="exercises/:id/result". 
  // Let's assume it's just a generic exercise page for now based on state, or we should update the route.
  // We'll use a hardcoded id 'ex1' for the mock if none is provided.
  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { isListening, transcript, error, startListening, stopListening } = useSpeechRecognition({
    lang: 'en-US',
    continuous: true,
    interimResults: true
  });

  useEffect(() => {
    const loadExercise = async () => {
      try {
        const data = await studentService.getExercise('ex1');
        setExercise(data);
      } catch (err) {
        console.error('Failed to load exercise:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadExercise();
  }, []);

  const handleFinish = () => {
    stopListening();
    navigate(`/student/exercises/${exercise?.id || 'ex1'}/result`, { 
      state: { transcript, originalText: exercise?.content }
    });
  };

  if (isLoading) {
    return <Loader message="Loading exercise..." />;
  }

  if (!exercise) {
    return <div className="text-center py-10 text-gray-500">Exercise not found.</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">{exercise.title}</h1>
        <p className="text-gray-500 text-lg">Read the text below out loud.</p>
      </div>

      {/* Reading Card */}
      <Card padding="p-8 sm:p-12" className="text-center relative overflow-hidden bg-white shadow-xl border-t-4 border-primary">
        <p className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-800 leading-relaxed tracking-wide">
          {exercise.content}
        </p>
      </Card>

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
