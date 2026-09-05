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
  }
};

export default studentService;
