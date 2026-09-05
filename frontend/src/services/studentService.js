import api from './api';

// Mock delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const LANGUAGE_EXERCISES = {
  hi: {
    id: 'ex_hi_1',
    title: 'बिल्ली और दूध',
    language: 'Hindi',
    langCode: 'hi-IN',
    content: 'बिल्ली मेज़ पर बैठकर दूध पी रही है। बच्चे मैदान में गेंद से खेल रहे हैं।',
    words: ['बिल्ली', 'मेज़', 'पर', 'बैठकर', 'दूध', 'पी', 'रही', 'है।', 'बच्चे', 'मैदान', 'में', 'गेंद', 'से', 'खेल', 'रहे', 'हैं।']
  },
  ta: {
    id: 'ex_ta_1',
    title: 'பூனையும் பாலும்',
    language: 'Tamil',
    langCode: 'ta-IN',
    content: 'பூனை மேசையின் மேல் அமர்ந்து பால் குடிக்கிறது. குழந்தைகள் மைதானத்தில் பந்து விளையாடுகிறார்கள்.',
    words: ['பூனை', 'மேசையின்', 'மேல்', 'அமர்ந்து', 'பால்', 'குடிக்கிறது.', 'குழந்தைகள்', 'மைதானத்தில்', 'பந்து', 'விளையாடுகிறார்கள்.']
  },
  te: {
    id: 'ex_te_1',
    title: 'పిల్లి మరియు పాలు',
    language: 'Telugu',
    langCode: 'te-IN',
    content: 'పిల్లి బల్లపై కూర్చుని పాలు తాగుతోంది. పిల్లలు ఆటస్థలంలో బంతితో ఆడుకుంటున్నారు.',
    words: ['పిల్లి', 'బల్లపై', 'కూర్చుని', 'పాలు', 'తాగుతోంది.', 'పిల్లలు', 'ఆటస్థలంలో', 'బంతితో', 'ఆడుకుంటున్నారు.']
  },
  es: {
    id: 'ex_es_1',
    title: 'El Gato Curioso',
    language: 'Spanish',
    langCode: 'es-ES',
    content: 'El gato curioso duerme tranquilamente bajo el sol mientras los niños juegan en el parque.',
    words: ['El', 'gato', 'curioso', 'duerme', 'tranquilamente', 'bajo', 'el', 'sol', 'mientras', 'los', 'niños', 'juegan', 'en', 'el', 'parque.']
  },
  mr: {
    id: 'ex_mr_1',
    title: 'मांजर आणि दूध',
    language: 'Marathi',
    langCode: 'mr-IN',
    content: 'मांजर टेबलावर बसून वाटीतील दूध पीत आहे. मुले बागेत आनंदाने खेळत आहेत.',
    words: ['मांजर', 'टेबलावर', 'बसून', 'वाटीतील', 'दूध', 'पीत', 'आहे.', 'मुले', 'बागेत', 'आनंदाने', 'खेळत', 'आहेत.']
  },
  en: {
    id: 'ex1',
    title: 'Animals in the Wild',
    language: 'English',
    langCode: 'en-US',
    content: 'The quick brown fox jumps over the lazy dog near the riverbank.',
    words: ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog', 'near', 'the', 'riverbank.']
  }
};

const LANG_NORMALIZE = {
  hindi: 'hi',
  hi: 'hi',
  tamil: 'ta',
  ta: 'ta',
  telugu: 'te',
  te: 'te',
  spanish: 'es',
  es: 'es',
  marathi: 'mr',
  mr: 'mr',
  english: 'en',
  en: 'en'
};

const studentService = {
  getDashboard: async () => {
    await delay(200);
    return {
      metrics: {
        continueLearning: {
          title: "Continue Learning",
          value: "6 Min",
          icon: "BookOpen"
        },
        progress: {
          title: "Your Progress",
          value: "5/10",
          icon: "TrendingUp"
        },
        badges: {
          title: "Badges",
          value: "3",
          icon: "Award"
        }
      },
      languages: [
        { id: 'en', name: 'English', native: 'English', icon: 'EN_FLAG' },
        { id: 'hi', name: 'Hindi', native: 'हिंदी', icon: 'HI_TEXT' },
        { id: 'ta', name: 'Tamil', native: 'தமிழ்', icon: 'TA_TEXT' },
        { id: 'te', name: 'Telugu', native: 'తెలుగు', icon: 'TE_TEXT' },
        { id: 'es', name: 'Spanish', native: 'Español', icon: 'ES_FLAG' },
        { id: 'mr', name: 'Marathi', native: 'मराठी', icon: 'MR_TEXT' }
      ],
      recommendedExercises: [
        { id: 'ex_hi_1', title: 'बिल्ली और दूध', language: 'Hindi', difficulty: 'Easy', progress: 0, icon: '🐱' },
        { id: 'ex_ta_1', title: 'பூனையும் பாலும்', language: 'Tamil', difficulty: 'Easy', progress: 0, icon: '🥛' },
        { id: 'ex_te_1', title: 'పిల్లి మరియు పాలు', language: 'Telugu', difficulty: 'Easy', progress: 0, icon: '🐾' },
        { id: 'ex_es_1', title: 'El Gato Curioso', language: 'Spanish', difficulty: 'Easy', progress: 50, icon: '☀️' },
        { id: 'ex1', title: 'Animals in the Wild', language: 'English', difficulty: 'Easy', progress: 100, icon: '🦊' }
      ]
    };
  },
  getExercise: async (id, language) => {
    // 1. Try to fetch from backend API first
    try {
      if (id && id.length === 24) {
        const res = await api.get(`/exercises/${id}`);
        if (res.data?.success && res.data?.data?.exercise) {
          const ex = res.data.data.exercise;
          return {
            id: ex._id,
            title: ex.title,
            language: ex.language,
            content: ex.text,
            words: ex.text.replace(/[.,!?;:()[\]]/g, '').trim().split(/\s+/),
            difficulty: ex.difficulty,
          };
        }
      }

      if (language) {
        const res = await api.get('/exercises', { params: { language } });
        if (res.data?.success && res.data?.data?.exercises?.length > 0) {
          const ex = res.data.data.exercises[0];
          return {
            id: ex._id,
            title: ex.title,
            language: ex.language,
            content: ex.text,
            words: ex.text.replace(/[.,!?;:()[\]]/g, '').trim().split(/\s+/),
            difficulty: ex.difficulty,
          };
        }
      }
    } catch (e) {
      console.warn("Could not fetch from backend exercises API, using native multilingual dictionary", e.message);
    }

    // 2. Resolve language key
    const rawKey = (language || (id && id.includes('_') ? id.split('_')[1] : 'en')).toLowerCase();
    const langKey = LANG_NORMALIZE[rawKey] || 'en';

    const exerciseData = LANGUAGE_EXERCISES[langKey] || LANGUAGE_EXERCISES.en;
    return {
      ...exerciseData,
      id: id || exerciseData.id
    };
  },
  getProgress: async () => {
    await delay(600);
    return {
      weeklyStats: [
        { day: 'Mon', score: 65, minutes: 15 },
        { day: 'Tue', score: 72, minutes: 20 },
        { day: 'Wed', score: 85, minutes: 10 },
        { day: 'Thu', score: 80, minutes: 25 },
        { day: 'Fri', score: 95, minutes: 30 },
        { day: 'Sat', score: 90, minutes: 15 },
        { day: 'Sun', score: 100, minutes: 20 }
      ],
      recentAchievements: [
        { id: 1, title: '7 Day Streak', icon: 'Flame', color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 2, title: 'Perfect Score', icon: 'Star', color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { id: 3, title: '100 Words Read', icon: 'BookOpen', color: 'text-blue-500', bg: 'bg-blue-50' }
      ],
      totalReadingTime: 135,
      averageScore: 84
    };
  }
};

export default studentService;
