import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Filter,
  ChevronDown,
  X,
  Play,
  Globe,
  GraduationCap,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useLanguageStore from '../store/languageStore';
import Loader from '../components/common/Loader';

const SUBJECTS = [
  'All',
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Social Science',
  'Computer Science',
];

const GRADES = [
  'All',
  'Class 1-2',
  'Class 3-5',
  'Class 6-8',
  'Class 9-10',
  'Class 11-12',
];

const LANGUAGES = [
  { code: '', label: 'All Languages' },
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'Tamil' },
  { code: 'hi', label: 'Hindi' },
  { code: 'te', label: 'Telugu' },
  { code: 'kn', label: 'Kannada' },
  { code: 'ml', label: 'Malayalam' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05 },
  }),
};

const Learning = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledLoading, setEnrolledLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({});

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [subject, setSubject] = useState(searchParams.get('subject') || 'All');
  const [grade, setGrade] = useState(searchParams.get('grade') || 'All');
  const [language, setLanguage] = useState(searchParams.get('language') || '');

  const { isAuthenticated } = useAuthStore();
  const { t } = useLanguageStore();

  // Fetch courses
  useEffect(() => {
    fetchCourses();
  }, [subject, grade, language]);

  useEffect(() => {
    if (isAuthenticated) fetchEnrolled();
  }, [isAuthenticated]);

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (subject && subject !== 'All') params.subject = subject;
      if (grade && grade !== 'All') params.gradeLevel = grade;
      if (language) params.language = language;

      const res = await api.get('/courses', { params });
      setCourses(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolled = async () => {
    setEnrolledLoading(true);
    try {
      const res = await api.get('/courses/enrolled');
      setEnrolled(res.data.data);
    } catch {
      setEnrolled([]);
    } finally {
      setEnrolledLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      fetchEnrolled();
      setCourses((prev) =>
        prev.map((c) => (c._id === courseId ? { ...c, _enrolled: true } : c))
      );
    } catch {
      // already enrolled or error
    }
  };

  const enrolledIds = new Set(enrolled.map((e) => e.course?._id));

  const clearFilters = () => {
    setSearch('');
    setSubject('All');
    setGrade('All');
    setLanguage('');
    setSearchParams({});
  };

  const langLabel = (codes) => {
    const map = { en: 'EN', ta: 'TA', hi: 'HI', te: 'TE', kn: 'KN', ml: 'ML' };
    return (codes || []).map((c) => map[c] || c.toUpperCase()).join(', ');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-text-primary flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            {t('nav_learning')} Hub
          </h1>
          <p className="mt-2 text-text-secondary">
            Explore free courses in your language — powered by NCERT & Diksha content.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-border w-fit">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'browse'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Browse Courses
          </button>
          {isAuthenticated && (
            <button
              onClick={() => {
                setActiveTab('enrolled');
                fetchEnrolled();
              }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'enrolled'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              My Courses ({enrolled.length})
            </button>
          )}
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <>
            {/* Search + Filter bar */}
            <div className="bg-white rounded-2xl border border-border p-4 mb-6 shadow-sm">
              <form onSubmit={handleSearch} className="flex gap-3 flex-col sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2.5 bg-background rounded-xl text-sm font-medium text-text-secondary border border-border hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  />
                </button>
              </form>

              {/* Filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-4 border-t border-border">
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                          Subject
                        </label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                          Grade
                        </label>
                        <select
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {GRADES.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                          Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {LANGUAGES.map((l) => (
                            <option key={l.code} value={l.code}>{l.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={clearFilters}
                        className="text-xs text-text-secondary hover:text-danger flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3 h-3" /> Clear Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Course Grid */}
            {loading ? (
              <Loader />
            ) : courses.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-border mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-1">No courses found</h3>
                <p className="text-sm text-text-secondary">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  {courses.map((course, i) => {
                    const isEnrolled = enrolledIds.has(course._id) || course._enrolled;
                    return (
                      <motion.div
                        key={course._id}
                        variants={fadeIn}
                        custom={i}
                        className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
                      >
                        <Link to={`/learning/${course._id}`} className="block relative">
                          <div className="aspect-video bg-gray-100 overflow-hidden">
                            <img
                              src={course.thumbnailUrl || '/placeholder.jpg'}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src =
                                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iI0YxRjVGOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTRBM0I4IiBmb250LXNpemU9IjE0Ij5ObyBUaHVtYm5haWw8L3RleHQ+PC9zdmc+';
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Play className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                          </div>
                        </Link>
                        <div className="p-4">
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md">
                              {course.subject}
                            </span>
                            <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs font-medium rounded-md">
                              {course.gradeLevel}
                            </span>
                            <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-md flex items-center gap-0.5">
                              <Globe className="w-3 h-3" />
                              {langLabel(course.language)}
                            </span>
                          </div>
                          <Link to={`/learning/${course._id}`}>
                            <h3 className="font-semibold text-text-primary text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
                              {course.title}
                            </h3>
                          </Link>
                          <div className="mt-3">
                            {isEnrolled ? (
                              <Link
                                to={`/learning/${course._id}`}
                                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-secondary/10 text-secondary text-sm font-medium rounded-xl hover:bg-secondary/20 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Continue Learning
                              </Link>
                            ) : (
                              <button
                                onClick={() => handleEnroll(course._id)}
                                disabled={!isAuthenticated}
                                className="w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isAuthenticated ? 'Enroll Free' : 'Login to Enroll'}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => fetchCourses(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                          p === pagination.page
                            ? 'bg-primary text-white'
                            : 'bg-white text-text-secondary border border-border hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Enrolled Tab */}
        {activeTab === 'enrolled' && (
          <>
            {enrolledLoading ? (
              <Loader />
            ) : enrolled.length === 0 ? (
              <div className="text-center py-20">
                <GraduationCap className="w-16 h-16 text-border mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  No courses enrolled yet
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Start browsing and enroll in courses to begin learning.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {enrolled.map((enrollment, i) => {
                  const course = enrollment.course;
                  if (!course) return null;
                  return (
                    <motion.div
                      key={enrollment._id}
                      variants={fadeIn}
                      custom={i}
                      className="bg-white rounded-2xl border border-border p-5 hover:shadow-lg transition-all duration-300"
                    >
                      <Link to={`/learning/${course._id}`} className="flex items-start gap-4">
                        <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjU2IiBmaWxsPSIjRjFGNUY5Ii8+PC9zdmc+';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-text-primary text-sm line-clamp-2 hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs text-text-secondary">{course.subject}</span>
                            <span className="text-xs text-text-secondary">•</span>
                            <span className="text-xs text-text-secondary">{course.gradeLevel}</span>
                          </div>
                        </div>
                      </Link>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-text-secondary">Progress</span>
                          <span className="font-medium text-text-primary">
                            {enrollment.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              enrollment.completed
                                ? 'bg-secondary'
                                : 'bg-gradient-to-r from-primary to-primary-light'
                            }`}
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        {enrollment.completed && (
                          <p className="mt-2 text-xs text-secondary font-medium flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Completed
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Learning;
