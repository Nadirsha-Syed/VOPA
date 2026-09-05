import api from './api';

// Mock delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const LANGUAGE_EXERCISES = {
  hi: [
    {
      id: 'ex_hi_1',
      title: 'बिल्ली और दूध',
      language: 'Hindi',
      langCode: 'hi-IN',
      content: 'बिल्ली मेज़ पर बैठकर दूध पी रही है। बच्चे मैदान में गेंद से खेल रहे हैं।',
      words: ['बिल्ली', 'मेज़', 'पर', 'बैठकर', 'दूध', 'पी', 'रही', 'है।', 'बच्चे', 'मैदान', 'में', 'गेंद', 'से', 'खेल', 'रहे', 'हैं।']
    },
    {
      id: 'ex_hi_2',
      title: 'सुबह का सूरज',
      language: 'Hindi',
      langCode: 'hi-IN',
      content: 'सूरज की पहली किरणें पहाड़ों के पीछे से चमकती हुई निकलती हैं।',
      words: ['सूरज', 'की', 'पहली', 'किरणें', 'पहाड़ों', 'के', 'पीछे', 'से', 'चमकती', 'हुई', 'निकलती', 'हैं।']
    },
    {
      id: 'ex_hi_3',
      title: 'पेड़ और चिड़ियाँ',
      language: 'Hindi',
      langCode: 'hi-IN',
      content: 'पेड़ की हरी डालियों पर सुंदर चिड़ियाँ मधुर गीत गा रही हैं।',
      words: ['पेड़', 'की', 'हरी', 'डालियों', 'पर', 'सुंदर', 'चिड़ियाँ', 'मधुर', 'गीत', 'गा', 'रही', 'हैं।']
    },
    {
      id: 'ex_hi_4',
      title: 'किताबों की दुनिया',
      language: 'Hindi',
      langCode: 'hi-IN',
      content: 'रोहन और रीता अपनी रंग-बिरंगी किताबों से नई कहानियाँ पढ़ते हैं।',
      words: ['रोहन', 'और', 'रीता', 'अपनी', 'रंग-बिरंगी', 'किताबों', 'से', 'नई', 'कहानियाँ', 'पढ़ते', 'हैं।']
    },
    {
      id: 'ex_hi_5',
      title: 'नदी का किनारा',
      language: 'Hindi',
      langCode: 'hi-IN',
      content: 'नदी के किनारे सुंदर फूल खिले हैं और तितलियाँ मंडरा रही हैं।',
      words: ['नदी', 'के', 'किनारे', 'सुंदर', 'फूल', 'खिले', 'हैं', 'और', 'तितलियाँ', 'मंडरा', 'रही', 'हैं।']
    }
  ],
  ta: [
    {
      id: 'ex_ta_1',
      title: 'பூனையும் பாலும்',
      language: 'Tamil',
      langCode: 'ta-IN',
      content: 'பூனை மேசையின் மேல் அமர்ந்து பால் குடிக்கிறது. குழந்தைகள் மைதானத்தில் பந்து விளையாடுகிறார்கள்.',
      words: ['பூனை', 'மேசையின்', 'மேல்', 'அமர்ந்து', 'பால்', 'குடிக்கிறது.', 'குழந்தைகள்', 'மைதானத்தில்', 'பந்து', 'விளையாடுகிறார்கள்.']
    },
    {
      id: 'ex_ta_2',
      title: 'காலைச் சூரியன்',
      language: 'Tamil',
      langCode: 'ta-IN',
      content: 'காலையில் அழகிய சூரியன் மலைகளுக்குப் பின்னால் பிரகாசமாக உதிக்கிறது.',
      words: ['காலையில்', 'அழகிய', 'சூரியன்', 'மலைகளுக்குப்', 'பின்னால்', 'பிரகாசமாக', 'உதிக்கிறது.']
    },
    {
      id: 'ex_ta_3',
      title: 'பாடும் பறவைகள்',
      language: 'Tamil',
      langCode: 'ta-IN',
      content: 'மரத்தின் கிளைகளில் அழகான பறவைகள் இனிமையான பாடல்களைப் பாடுகின்றன.',
      words: ['மரத்தின்', 'கிளைகளில்', 'அழகான', 'பறவைகள்', 'இனிமையான', 'பாடல்களைப்', 'பாடுகின்றன.']
    },
    {
      id: 'ex_ta_4',
      title: 'கதைப் புத்தகங்கள்',
      language: 'Tamil',
      langCode: 'ta-IN',
      content: 'சிறுவர்கள் பள்ளி நூலகத்தில் பல வண்ணக் கதைப் புத்தகங்களை விரும்பிப் படிக்கிறார்கள்.',
      words: ['சிறுவர்கள்', 'பள்ளி', 'நூலகத்தில்', 'பல', 'வண்ணக்', 'கதைப்', 'புத்தகங்களை', 'விரும்பிப்', 'படிக்கிறார்கள்.']
    },
    {
      id: 'ex_ta_5',
      title: 'நதிக்கரை மலர்கள்',
      language: 'Tamil',
      langCode: 'ta-IN',
      content: 'அழகிய நதிக்கரையில் வண்ண மலர்கள் மலர்ந்து வண்டுகள் ரீங்காரமிடுகின்றன.',
      words: ['அழகிய', 'நதிக்கரையில்', 'வண்ண', 'மலர்கள்', 'மலர்ந்து', 'வண்டுகள்', 'ரீங்காரமிடுகின்றன.']
    }
  ],
  te: [
    {
      id: 'ex_te_1',
      title: 'పిల్లి మరియు పాలు',
      language: 'Telugu',
      langCode: 'te-IN',
      content: 'పిల్లి బల్లపై కూర్చుని పాలు తాగుతోంది. పిల్లలు ఆటస్థలంలో బంతితో ఆడుకుంటున్నారు.',
      words: ['పిల్లి', 'బల్లపై', 'కూర్చుని', 'పాలు', 'తాగుతోంది.', 'పిల్లలు', 'ఆటస్థలంలో', 'బంతితో', 'ఆడుకుంటున్నారు.']
    },
    {
      id: 'ex_te_2',
      title: 'ఉదయపు సూర్యుడు',
      language: 'Telugu',
      langCode: 'te-IN',
      content: 'ఉదయాన్నే కొండల వెనుక నుండి ప్రకాశవంతమైన సూర్యుడు ఉదయిస్తాడు.',
      words: ['ఉదయాన్నే', 'కొండల', 'వెనుక', 'నుండి', 'ప్రకాశవంతమైన', 'సూర్యుడు', 'ఉదయిస్తాడు.']
    },
    {
      id: 'ex_te_3',
      title: 'పాడుతున్న పక్షులు',
      language: 'Telugu',
      langCode: 'te-IN',
      content: 'చెట్ల కొమ్మలపై అందమైన పక్షులు మధురమైన పాటలు పాడుతున్నాయి.',
      words: ['చెట్ల', 'కొమ్మలపై', 'అందమైన', 'పక్షులు', 'మధురమైన', 'పాటలు', 'పాడుతున్నాయి.']
    },
    {
      id: 'ex_te_4',
      title: 'పుస్తకాల ప్రపంచం',
      language: 'Telugu',
      langCode: 'te-IN',
      content: 'పిల్లలు పాఠశాల గ్రంథాలయంలో ఆసక్తికరమైన కథల పుస్తకాలు చదువుతారు.',
      words: ['పిల్లలు', 'పాఠశాల', 'గ్రంథాలయంలో', 'ఆసక్తికరమైన', 'కథల', 'పుస్తకాలు', 'చదువుతారు.']
    },
    {
      id: 'ex_te_5',
      title: 'తోటలో పువ్వులు',
      language: 'Telugu',
      langCode: 'te-IN',
      content: 'అందమైన పూల తోటలో రంగురంగుల సీతాకోకచిలుకలు ఎగురుతున్నాయి.',
      words: ['అందమైన', 'పూల', 'తోటలో', 'రంగురంగుల', 'సీతాకోకచిలుకలు', 'ఎగురుతున్నాయి.']
    }
  ],
  es: [
    {
      id: 'ex_es_1',
      title: 'El Gato Curioso',
      language: 'Spanish',
      langCode: 'es-ES',
      content: 'El gato curioso duerme tranquilamente bajo el sol mientras los niños juegan en el parque.',
      words: ['El', 'gato', 'curioso', 'duerme', 'tranquilamente', 'bajo', 'el', 'sol', 'mientras', 'los', 'niños', 'juegan', 'en', 'el', 'parque.']
    },
    {
      id: 'ex_es_2',
      title: 'El Sol de la Mañana',
      language: 'Spanish',
      langCode: 'es-ES',
      content: 'El sol brillante ilumina las montañas verdes cada hermosa mañana.',
      words: ['El', 'sol', 'brillante', 'ilumina', 'las', 'montañas', 'verdes', 'cada', 'hermosa', 'mañana.']
    },
    {
      id: 'ex_es_3',
      title: 'Los Pájaros Cantores',
      language: 'Spanish',
      langCode: 'es-ES',
      content: 'Los pajaritos cantan canciones alegres en las ramas de los grandes árboles.',
      words: ['Los', 'pajaritos', 'cantan', 'canciones', 'alegres', 'en', 'las', 'ramas', 'de', 'los', 'grandes', 'árboles.']
    },
    {
      id: 'ex_es_4',
      title: 'El Jardín de Flores',
      language: 'Spanish',
      langCode: 'es-ES',
      content: 'Las mariposas coloridas vuelan alegremente entre las flores del jardín.',
      words: ['Las', 'mariposas', 'coloridas', 'vuelan', 'alegremente', 'entre', 'las', 'flores', 'del', 'jardín.']
    },
    {
      id: 'ex_es_5',
      title: 'Historias en la Biblioteca',
      language: 'Spanish',
      langCode: 'es-ES',
      content: 'A los niños les encanta leer libros de aventuras en la biblioteca escolar.',
      words: ['A', 'los', 'niños', 'les', 'encanta', 'leer', 'libros', 'de', 'aventuras', 'en', 'la', 'biblioteca', 'escolar.']
    }
  ],
  mr: [
    {
      id: 'ex_mr_1',
      title: 'मांजर आणि दूध',
      language: 'Marathi',
      langCode: 'mr-IN',
      content: 'मांजर टेबलावर बसून वाटीतील दूध पीत आहे. मुले बागेत आनंदाने खेळत आहेत.',
      words: ['मांजर', 'टेबलावर', 'बसून', 'वाटीतील', 'दूध', 'पीत', 'आहे.', 'मुले', 'बागेत', 'आनंदाने', 'खेळत', 'आहेत.']
    },
    {
      id: 'ex_mr_2',
      title: 'सोनेरी सकाळ',
      language: 'Marathi',
      langCode: 'mr-IN',
      content: 'सकाळी डोंगरांच्या पाठीमागून सोनेरी सूर्य तेजस्वीपणे उगवतो.',
      words: ['सकाळी', 'डोंगरांच्या', 'पाठीमागून', 'सोनेरी', 'सूर्य', 'तेजस्वीपणे', 'उगवतो.']
    },
    {
      id: 'ex_mr_3',
      title: 'किलबिलणारे पक्षी',
      language: 'Marathi',
      langCode: 'mr-IN',
      content: 'झाडांच्या हिरव्या फांद्यांवर सुंदर पक्षी गोड गाणी गात आहेत.',
      words: ['झाडांच्या', 'हिरव्या', 'फांद्यांवर', 'सुंदर', 'पक्षी', 'गोड', 'गाणी', 'गात', 'आहेत.']
    },
    {
      id: 'ex_mr_4',
      title: 'गोष्टींची पुस्तके',
      language: 'Marathi',
      langCode: 'mr-IN',
      content: 'मुलं शाळेच्या ग्रंथालयात रंगीबेरंगी गोष्टींची पुस्तके आनंदाने वाचतात.',
      words: ['मुलं', 'शाळेच्या', 'ग्रंथालयात', 'रंगीबेरंगी', 'गोष्टींची', 'पुस्तके', 'आनंदाने', 'वाचतात.']
    },
    {
      id: 'ex_mr_5',
      title: 'फुलांची बाग',
      language: 'Marathi',
      langCode: 'mr-IN',
      content: 'सुंदर बागेमध्ये रंगीबेरंगी फुले उमलली आहेत आणि फुलपाखरे उडत आहेत.',
      words: ['सुंदर', 'बागेमध्ये', 'रंगीबेरंगी', 'फुले', 'उमलली', 'आहेत', 'आणि', 'फुलपाखरे', 'उडत', 'आहेत.']
    }
  ],
  en: [
    {
      id: 'ex1',
      title: 'Animals in the Wild',
      language: 'English',
      langCode: 'en-US',
      content: 'The quick brown fox jumps over the lazy dog near the riverbank.',
      words: ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog', 'near', 'the', 'riverbank.']
    },
    {
      id: 'ex_en_2',
      title: 'The Bright Morning Sun',
      language: 'English',
      langCode: 'en-US',
      content: 'The bright yellow sun rises above the green hills every morning.',
      words: ['The', 'bright', 'yellow', 'sun', 'rises', 'above', 'the', 'green', 'hills', 'every', 'morning.']
    },
    {
      id: 'ex_en_3',
      title: 'Birds in the Trees',
      language: 'English',
      langCode: 'en-US',
      content: 'Little birds sing cheerful songs high up in the mango trees.',
      words: ['Little', 'birds', 'sing', 'cheerful', 'songs', 'high', 'up', 'in', 'the', 'mango', 'trees.']
    },
    {
      id: 'ex_en_4',
      title: 'The Garden Adventure',
      language: 'English',
      langCode: 'en-US',
      content: 'A brave little rabbit hopped happily across the colorful flower garden.',
      words: ['A', 'brave', 'little', 'rabbit', 'hopped', 'happily', 'across', 'the', 'colorful', 'flower', 'garden.']
    },
    {
      id: 'ex_en_5',
      title: 'Reading Storybooks',
      language: 'English',
      langCode: 'en-US',
      content: 'Children love to read exciting adventure storybooks in the school library.',
      words: ['Children', 'love', 'to', 'read', 'exciting', 'adventure', 'storybooks', 'in', 'the', 'school', 'library.']
    }
  ]
};

export const LANG_NORMALIZE = {
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

export const EXERCISE_ICONS = {
  ex_hi_1: '🐱',
  ex_hi_2: '☀️',
  ex_hi_3: '🌳',
  ex_hi_4: '📚',
  ex_hi_5: '🌊',
  ex_ta_1: '🐱',
  ex_ta_2: '☀️',
  ex_ta_3: '🐦',
  ex_ta_4: '📚',
  ex_ta_5: '🌸',
  ex_te_1: '🐱',
  ex_te_2: '☀️',
  ex_te_3: '🐦',
  ex_te_4: '📚',
  ex_te_5: '🌸',
  ex_es_1: '🐱',
  ex_es_2: '☀️',
  ex_es_3: '🐦',
  ex_es_4: '🌸',
  ex_es_5: '📚',
  ex_mr_1: '🐱',
  ex_mr_2: '☀️',
  ex_mr_3: '🐦',
  ex_mr_4: '📚',
  ex_mr_5: '🌸',
  ex1: '🦊',
  ex_en_2: '☀️',
  ex_en_3: '🐦',
  ex_en_4: '🐰',
  ex_en_5: '📚',
};

const getStudentAttempts = async () => {
  let userId = 'default_student';
  try {
    const userStr = localStorage.getItem('vopa_user');
    if (userStr) {
      const u = JSON.parse(userStr);
      userId = u.id || u._id || u.email || 'default_student';
    }
  } catch (e) {}

  const key = `vopa_attempts_${userId}`;
  let localAttempts = [];
  try {
    localAttempts = JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {}

  if (userId && userId.length === 24) {
    try {
      const res = await api.get(`/readings/student/${userId}`);
      if (res.data?.success && Array.isArray(res.data?.data?.attempts)) {
        const backendAttempts = res.data.data.attempts.map(att => ({
          id: att._id,
          exerciseId: att.exerciseId?._id || att.exerciseId,
          language: att.exerciseId?.language || 'English',
          score: att.score || 0,
          date: att.createdAt,
          timestamp: new Date(att.createdAt).getTime()
        }));
        const existingIds = new Set(localAttempts.map(a => a.id));
        backendAttempts.forEach(ba => {
          if (!existingIds.has(ba.id)) {
            localAttempts.push(ba);
          }
        });
      }
    } catch (e) {
      // Backend not reachable or student has no attempts, fallback gracefully
    }
  }

  return localAttempts;
};

const studentService = {
  recordAttempt: (attemptData) => {
    try {
      let userId = 'default_student';
      const userStr = localStorage.getItem('vopa_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        userId = u.id || u._id || u.email || 'default_student';
      }
      const key = `vopa_attempts_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const newAttempt = {
        id: `att_${Date.now()}`,
        exerciseId: attemptData.exerciseId,
        language: attemptData.language || 'English',
        score: attemptData.score || 0,
        wordsCorrect: attemptData.wordsCorrect || 0,
        totalWords: attemptData.totalWords || 0,
        date: new Date().toISOString(),
        timestamp: Date.now()
      };
      existing.unshift(newAttempt);
      localStorage.setItem(key, JSON.stringify(existing));
      return newAttempt;
    } catch (e) {
      console.warn("Failed to record attempt:", e);
    }
  },

  getRecommendedExercises: (targetLanguage = 'en', attempts = []) => {
    const rawKey = (targetLanguage || 'en').toLowerCase().trim();
    const langKey = LANG_NORMALIZE[rawKey] || 'en';
    const pool = LANGUAGE_EXERCISES[langKey] || LANGUAGE_EXERCISES.en;

    const attemptMap = new Map();
    attempts.forEach(a => {
      if (a.exerciseId) {
        attemptMap.set(String(a.exerciseId), a.score);
      }
      if (a.id) {
        attemptMap.set(String(a.id), a.score);
      }
    });

    return pool.map((ex, idx) => {
      const score = attemptMap.get(ex.id) ?? (attemptMap.get(String(idx + 1)) ?? 0);
      return {
        id: ex.id,
        title: ex.title,
        language: ex.language,
        difficulty: 'Easy',
        progress: score > 0 ? (score >= 80 ? 100 : score) : 0,
        icon: EXERCISE_ICONS[ex.id] || '📖',
      };
    });
  },

  getDashboard: async (targetLanguage) => {
    await delay(100);
    const attempts = await getStudentAttempts();
    
    // Resolve language to recommend
    let resolvedLang = targetLanguage;
    if (!resolvedLang) {
      try {
        const stored = localStorage.getItem('vopa_selected_language');
        const userStr = localStorage.getItem('vopa_user');
        const u = userStr ? JSON.parse(userStr) : null;
        resolvedLang = stored || u?.preferredLanguage || 'en';
      } catch (e) {
        resolvedLang = 'en';
      }
    }

    // Dynamic calculations based on user's real attempts
    const readingTimeMins = attempts.length > 0 ? Math.max(1, Math.round(attempts.length * 1.5)) : 0;
    const progressCount = Math.min(10, attempts.length);

    // Compute badges earned dynamically
    const unlockedBadges = [];
    if (attempts.length >= 1) {
      unlockedBadges.push({ id: 'first_reader', title: 'First Reader', icon: 'BookOpen' });
    }
    if (attempts.some(a => a.score >= 80)) {
      unlockedBadges.push({ id: 'accurate_reader', title: 'Accurate Reader', icon: 'Target' });
    }
    if (attempts.some(a => a.score === 100)) {
      unlockedBadges.push({ id: 'perfect_star', title: '100% Mastery', icon: 'Star' });
    }
    const languagesAttempted = new Set(attempts.map(a => (a.language || '').toLowerCase()));
    if (languagesAttempted.size >= 2) {
      unlockedBadges.push({ id: 'multilingual', title: 'Polyglot Reader', icon: 'Award' });
    }
    if (attempts.length >= 5) {
      unlockedBadges.push({ id: 'reading_champion', title: 'Reading Champion', icon: 'Flame' });
    }

    const recommendedExercises = studentService.getRecommendedExercises(resolvedLang, attempts);

    return {
      metrics: {
        continueLearning: {
          title: "Continue Learning",
          value: `${readingTimeMins} Min`,
          icon: "BookOpen"
        },
        progress: {
          title: "Your Progress",
          value: `${progressCount}/10`,
          icon: "TrendingUp"
        },
        badges: {
          title: "Badges",
          value: `${unlockedBadges.length}`,
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
      recommendedExercises,
    };
  },
  getExercise: async (id, language, previousContent) => {
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
          const exercisesList = res.data.data.exercises;
          // Filter out previous sentence to always give a fresh new one
          const filtered = previousContent 
            ? exercisesList.filter(e => e.text.trim() !== previousContent.trim()) 
            : exercisesList;
          const candidates = filtered.length > 0 ? filtered : exercisesList;
          const randomIndex = Math.floor(Math.random() * candidates.length);
          const ex = candidates[randomIndex];
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

    const pool = LANGUAGE_EXERCISES[langKey] || LANGUAGE_EXERCISES.en;
    // Pick a sentence different from previousContent
    const filteredPool = previousContent
      ? pool.filter(e => e.content.trim() !== previousContent.trim())
      : pool;
    const candidates = filteredPool.length > 0 ? filteredPool : pool;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const exerciseData = candidates[randomIndex];

    return {
      ...exerciseData,
      id: exerciseData.id
    };
  },
  getProgress: async () => {
    await delay(100);
    const attempts = await getStudentAttempts();

    const totalReadingTime = attempts.length > 0 ? Math.max(1, Math.round(attempts.length * 1.5)) : 0;
    const averageScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length)
      : 0;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyStats = days.map((day, idx) => {
      const dayAttempts = attempts.filter(a => new Date(a.date || a.timestamp).getDay() === idx);
      const dayScore = dayAttempts.length > 0
        ? Math.round(dayAttempts.reduce((s, a) => s + a.score, 0) / dayAttempts.length)
        : 0;
      return {
        day,
        score: dayScore,
        minutes: dayAttempts.length * 2
      };
    });

    const recentAchievements = [];
    if (attempts.length >= 1) {
      recentAchievements.push({ id: 1, title: 'First Reader', icon: 'BookOpen', color: 'text-blue-500', bg: 'bg-blue-50' });
    }
    if (attempts.some(a => a.score >= 80)) {
      recentAchievements.push({ id: 2, title: 'High Accuracy (80%+)', icon: 'Target', color: 'text-green-500', bg: 'bg-green-50' });
    }
    if (attempts.some(a => a.score === 100)) {
      recentAchievements.push({ id: 3, title: 'Perfect Score 100%', icon: 'Star', color: 'text-yellow-500', bg: 'bg-yellow-50' });
    }
    const languages = new Set(attempts.map(a => (a.language || '').toLowerCase()));
    if (languages.size >= 2) {
      recentAchievements.push({ id: 4, title: 'Bilingual Reader', icon: 'Award', color: 'text-purple-500', bg: 'bg-purple-50' });
    }
    if (attempts.length >= 5) {
      recentAchievements.push({ id: 5, title: '5 Exercises Completed', icon: 'Flame', color: 'text-orange-500', bg: 'bg-orange-50' });
    }

    return {
      weeklyStats,
      recentAchievements,
      totalReadingTime,
      averageScore
    };
  }
};

export default studentService;
