// Mock delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const studentService = {
  getDashboard: async () => {
    await delay(600);
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
        { id: 'en', name: 'English', native: 'English', icon: 'US' },
        { id: 'hi', name: 'Hindi', native: 'हिंदी', icon: 'IN' },
        { id: 'es', name: 'Spanish', native: 'Español', icon: 'ES' },
        { id: 'ta', name: 'Tamil', native: 'தமிழ்', icon: 'IN' }
      ],
      recommendedExercises: [
        { id: 'ex1', title: 'Animals', language: 'English', difficulty: 'Easy', progress: 0, icon: 'Dog' },
        { id: 'ex2', title: 'Colors', language: 'English', difficulty: 'Easy', progress: 100, icon: 'Palette' },
        { id: 'ex3', title: 'My Family', language: 'Spanish', difficulty: 'Medium', progress: 50, icon: 'Users' }
      ]
    };
  },
  getExercise: async (id) => {
    await delay(500);
    // Mock exercise data
    return {
      id,
      title: 'Animals',
      language: 'English',
      content: 'The quick brown fox jumps over the lazy dog.',
      words: ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog.']
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
