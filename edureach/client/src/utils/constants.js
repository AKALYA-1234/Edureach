export const APP_NAME = 'EduReach';
export const APP_TAGLINE = 'Education for Every Indian Student';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000';

export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ta', label: 'தமிழ்', short: 'TA' },
  { code: 'hi', label: 'हिन्दी', short: 'HI' },
  { code: 'te', label: 'తెలుగు', short: 'TE' },
  { code: 'kn', label: 'ಕನ್ನಡ', short: 'KN' },
  { code: 'ml', label: 'മലയാളം', short: 'ML' },
];

export const NAV_LINKS = [
  { path: '/', label: 'nav_home' },
  { path: '/learning', label: 'nav_learning' },
  { path: '/scholarships', label: 'nav_scholarships' },
  { path: '/mentoring', label: 'nav_mentoring' },
  { path: '/speech-therapy', label: 'nav_speech' },
  { path: '/mental-health', label: 'nav_mental_health' },
  { path: '/study-plan', label: 'nav_study_plan' },
];

export const ROLES = {
  STUDENT: 'student',
  MENTOR: 'mentor',
  ADMIN: 'admin',
};
