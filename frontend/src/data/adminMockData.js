export const adminProfile = {
  name: 'VOPA Admin',
  email: 'admin@vopa.ai',
  role: 'Platform Administrator',
}

export const adminDashboardStats = [
  { label: 'Total Students', value: '500', change: '+28 this month' },
  { label: 'Total Teachers', value: '35', change: '+2 new' },
  { label: 'Total Reading Attempts', value: '12,450', change: '+1,280 this week' },
  { label: 'Average Platform Score', value: '81%', change: '+4% from last month' },
  { label: 'Active Languages', value: '4', change: 'English, Hindi, Tamil, Bengali' },
  { label: 'Students Needing Attention', value: '72', change: '14 flagged today' },
]

export const adminUsers = [
  { id: 'usr-1', name: 'Ananya Rao', email: 'ananya@vopa.edu', role: 'Student', preferredLanguage: 'English', status: 'Active', createdDate: '2026-08-10' },
  { id: 'usr-2', name: 'Vivek Nair', email: 'vivek@vopa.edu', role: 'Teacher', preferredLanguage: 'Hindi', status: 'Active', createdDate: '2026-08-14' },
  { id: 'usr-3', name: 'Priya Sen', email: 'priya@vopa.edu', role: 'Admin', preferredLanguage: 'English', status: 'Active', createdDate: '2026-07-21' },
  { id: 'usr-4', name: 'Sanjay Kumar', email: 'sanjay@vopa.edu', role: 'Student', preferredLanguage: 'Tamil', status: 'Inactive', createdDate: '2026-06-28' },
]

export const adminStudents = [
  { id: 'stud-201', name: 'Aarav Joshi', email: 'aarav@vopa.edu', teacher: 'Aisha Patel', language: 'English', score: 86, status: 'Active' },
  { id: 'stud-202', name: 'Diya Sharma', email: 'diya@vopa.edu', teacher: 'Aisha Patel', language: 'Hindi', score: 79, status: 'Active' },
  { id: 'stud-203', name: 'Rohit Iyer', email: 'rohit@vopa.edu', teacher: 'Nisha Reddy', language: 'Tamil', score: 72, status: 'Needs Attention' },
  { id: 'stud-204', name: 'Megha Das', email: 'megha@vopa.edu', teacher: 'Arun Singh', language: 'English', score: 91, status: 'Active' },
]

export const adminTeachers = [
  { id: 'teach-301', name: 'Aisha Patel', email: 'aisha@vopa.edu', assignedStudents: 25, classPerformance: '84%', status: 'Active' },
  { id: 'teach-302', name: 'Nisha Reddy', email: 'nisha@vopa.edu', assignedStudents: 18, classPerformance: '80%', status: 'Active' },
  { id: 'teach-303', name: 'Arun Singh', email: 'arun@vopa.edu', assignedStudents: 20, classPerformance: '77%', status: 'Inactive' },
]

export const adminExercises = [
  { id: 'ex-401', title: 'Daily Reading 05', language: 'English', difficulty: 'Medium', category: 'Fluency', status: 'Published', createdDate: '2026-08-12' },
  { id: 'ex-402', title: 'Hindi Story Practice', language: 'Hindi', difficulty: 'Easy', category: 'Comprehension', status: 'Draft', createdDate: '2026-08-16' },
  { id: 'ex-403', title: 'Tamil Phrase Builder', language: 'Tamil', difficulty: 'Hard', category: 'Pronunciation', status: 'Published', createdDate: '2026-08-20' },
]

export const adminLanguages = [
  { id: 'lang-1', language: 'English', code: 'en', exercises: 120, speechConfig: 'Configured', status: 'Enabled' },
  { id: 'lang-2', language: 'Hindi', code: 'hi', exercises: 80, speechConfig: 'Configured', status: 'Enabled' },
  { id: 'lang-3', language: 'Tamil', code: 'ta', exercises: 60, speechConfig: 'Configured', status: 'Disabled' },
]

export const adminAnalytics = {
  totalStudents: 500,
  totalTeachers: 35,
  totalAttempts: 12450,
  averageScore: 81,
  activeLanguages: 4,
  overallImprovement: 17,
  platformScoreTrend: [
    { name: 'Jan', score: 73 },
    { name: 'Feb', score: 75 },
    { name: 'Mar', score: 78 },
    { name: 'Apr', score: 80 },
    { name: 'May', score: 82 },
    { name: 'Jun', score: 81 },
  ],
  readingAttemptsTrend: [
    { name: 'Jan', attempts: 1800 },
    { name: 'Feb', attempts: 2000 },
    { name: 'Mar', attempts: 2150 },
    { name: 'Apr', attempts: 2300 },
    { name: 'May', attempts: 2500 },
    { name: 'Jun', attempts: 2700 },
  ],
  languageUsage: [
    { language: 'English', value: 55 },
    { language: 'Hindi', value: 25 },
    { language: 'Tamil', value: 15 },
    { language: 'Bengali', value: 5 },
  ],
  exerciseUsage: [
    { name: 'Daily Reading', count: 40 },
    { name: 'Comprehension', count: 32 },
    { name: 'Pronunciation', count: 18 },
    { name: 'Listening', count: 10 },
  ],
  studentImprovement: [
    { name: 'A', improvement: 10 },
    { name: 'B', improvement: 14 },
    { name: 'C', improvement: 17 },
    { name: 'D', improvement: 19 },
    { name: 'E', improvement: 22 },
  ],
  mistakeFrequency: [
    { name: 'Vocabulary', value: 32 },
    { name: 'Pronunciation', value: 28 },
    { name: 'Speed', value: 21 },
    { name: 'Punctuation', value: 18 },
  ],
}

export const recentPlatformActivity = [
  'New teacher added: Aisha Patel',
  '20 students completed exercises',
  'New Hindi exercise created',
  'Language configuration updated for Tamil',
  '2 students flagged for attention review',
]

export const adminStudentDetails = {
  'stud-201': {
    id: 'stud-201',
    name: 'Aarav Joshi',
    teacher: 'Aisha Patel',
    preferredLanguage: 'English',
    currentLevel: 'Level 3',
    status: 'Active',
    currentScore: 86,
    readingHistory: ['Story Time', 'Daily Reading', 'Comprehension Booster'],
    improvementPlans: ['Vocabulary review', 'Reading fluency focus'],
    progress: 72,
  },
  'stud-202': {
    id: 'stud-202',
    name: 'Diya Sharma',
    teacher: 'Aisha Patel',
    preferredLanguage: 'Hindi',
    currentLevel: 'Level 2',
    status: 'Active',
    currentScore: 79,
    readingHistory: ['Hindi Fluency', 'Sentence Builder', 'Story Recall'],
    improvementPlans: ['Pronunciation practice', 'Longer passage drills'],
    progress: 66,
  },
}

export const adminTeacherDetails = {
  'teach-301': {
    id: 'teach-301',
    name: 'Aisha Patel',
    email: 'aisha@vopa.edu',
    status: 'Active',
    assignedStudents: 25,
    classPerformance: '84%',
    activity: ['5 new student enrollments', '2 new reading benchmarks uploaded'],
  },
  'teach-302': {
    id: 'teach-302',
    name: 'Nisha Reddy',
    email: 'nisha@vopa.edu',
    status: 'Active',
    assignedStudents: 18,
    classPerformance: '80%',
    activity: ['7 students improved this month', 'Reading report exported'],
  },
}
