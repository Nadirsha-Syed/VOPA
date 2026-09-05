import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechRecognition = (options = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Browser does not support Speech Recognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = options.continuous || true;
    recognition.interimResults = options.interimResults || true;
    recognition.lang = options.lang || 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(prev => prev + currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [options.lang, options.continuous, options.interimResults]);

  const startListening = useCallback(() => {
    setError(null);
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript(''); // Clear previous transcript
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start listening', err);
        setError('Failed to start microphone');
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  };
};
