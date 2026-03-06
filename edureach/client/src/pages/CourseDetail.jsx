import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Globe,
  GraduationCap,
  CheckCircle,
  StickyNote,
  Play,
  Save,
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import Loader from '../components/common/Loader';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data.data);

      // Fetch enrollment if authenticated
      if (isAuthenticated) {
        try {
          const enrollRes = await api.get('/courses/enrolled');
          const found = enrollRes.data.data.find((e) => e.course?._id === id);
          if (found) {
            setEnrollment(found);
            setProgress(found.progress);
          }
        } catch {
          // not enrolled
        }
      }

      // Fetch related courses (same subject)
      try {
        const relRes = await api.get('/courses', {
          params: { subject: res.data.data.subject, limit: 4 },
        });
        setRelated(relRes.data.data.filter((c) => c._id !== id).slice(0, 3));
      } catch {
        setRelated([]);
      }

      // Restore notes from localStorage
      const savedNotes = localStorage.getItem(`course-notes-${id}`);
      if (savedNotes) setNotes(savedNotes);
    } catch {
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      const enrollRes = await api.get('/courses/enrolled');
      const found = enrollRes.data.data.find((e) => e.course?._id === id);
      if (found) {
        setEnrollment(found);
        setProgress(found.progress);
      }
    } catch {
      // error
    }
  };

  const handleProgressUpdate = async (value) => {
    setProgress(value);
    setSaving(true);
    try {
      const res = await api.put(`/courses/${id}/progress`, { progress: value });
      setEnrollment(res.data.data);
    } catch {
      // error
    } finally {
      setSaving(false);
    }
  };

  const handleMarkComplete = async () => {
    await handleProgressUpdate(100);
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`course-notes-${id}`, notes);
  };

  const langLabel = (codes) => {
    const map = { en: 'English', ta: 'Tamil', hi: 'Hindi', te: 'Telugu', kn: 'Kannada', ml: 'Malayalam' };
    return (codes || []).map((c) => map[c] || c).join(', ');
  };

  if (loading) return <Loader />;

  if (!course) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-border mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary">Course not found</h2>
          <Link to="/learning" className="mt-4 inline-block text-primary hover:underline text-sm">
            ← Back to Learning Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/learning"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learning Hub
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Embed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black rounded-2xl overflow-hidden shadow-2xl"
            >
              {course.videoUrl ? (
                <div className="aspect-video">
                  <iframe
                    src={course.videoUrl}
                    title={course.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No video available</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-border p-6"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
                  {course.subject}
                </span>
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-lg">
                  {course.gradeLevel}
                </span>
                <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-lg flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {langLabel(course.language)}
                </span>
                {course.isFree && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                    Free
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold font-heading text-text-primary mb-3">
                {course.title}
              </h1>
              <p className="text-text-secondary leading-relaxed">{course.description}</p>

              {course.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-100 text-text-secondary text-xs rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Progress Section (enrolled only) */}
            {enrollment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-border p-6"
              >
                <h2 className="text-lg font-bold font-heading text-text-primary mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Your Progress
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Completion</span>
                      <span className="font-medium text-text-primary">{progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(parseInt(e.target.value))}
                      onMouseUp={(e) => handleProgressUpdate(parseInt(e.target.value))}
                      onTouchEnd={(e) => handleProgressUpdate(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          enrollment.completed
                            ? 'bg-secondary'
                            : 'bg-gradient-to-r from-primary to-primary-light'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {!enrollment.completed ? (
                    <button
                      onClick={handleMarkComplete}
                      className="px-6 py-2.5 bg-secondary text-white rounded-xl text-sm font-medium hover:bg-secondary-dark transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Complete
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-secondary font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Course Completed!
                    </div>
                  )}

                  {saving && (
                    <p className="text-xs text-text-secondary animate-pulse">Saving progress...</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Notes Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-border p-6"
            >
              <h2 className="text-lg font-bold font-heading text-text-primary mb-4 flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-accent" />
                My Notes
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes here... They'll be saved locally in your browser."
                rows={6}
                className="w-full p-4 bg-background rounded-xl border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                onClick={handleSaveNotes}
                className="mt-3 px-5 py-2 bg-accent/10 text-accent rounded-xl text-sm font-medium hover:bg-accent/20 transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Save Notes
              </button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enroll Card */}
            {!enrollment && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-border p-6 sticky top-24"
              >
                <h3 className="font-bold text-text-primary font-heading mb-2">
                  Ready to learn?
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Enroll in this free course and start learning at your own pace.
                </p>
                {isAuthenticated ? (
                  <button
                    onClick={handleEnroll}
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                  >
                    Enroll for Free
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block text-center w-full px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                  >
                    Login to Enroll
                  </Link>
                )}
              </motion.div>
            )}

            {/* Related Courses */}
            {related.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-border p-6"
              >
                <h3 className="font-bold text-text-primary font-heading mb-4">Related Courses</h3>
                <div className="space-y-3">
                  {related.map((rc) => (
                    <Link
                      key={rc._id}
                      to={`/learning/${rc._id}`}
                      className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={rc.thumbnailUrl}
                          alt={rc.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQ0IiBmaWxsPSIjRjFGNUY5Ii8+PC9zdmc+';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                          {rc.title}
                        </h4>
                        <p className="text-xs text-text-secondary mt-0.5">{rc.gradeLevel}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
