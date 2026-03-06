import { useState, useEffect } from 'react';
import {
  Search,
  GraduationCap,
  Filter,
  ChevronDown,
  X,
  Clock,
  IndianRupee,
  ExternalLink,
  CheckCircle,
  XCircle,
  Award,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useLanguageStore from '../store/languageStore';
import Loader from '../components/common/Loader';

const STATES = [
  'All',
  'Tamil Nadu',
  'Karnataka',
  'Uttar Pradesh',
  'Maharashtra',
  'Andhra Pradesh',
  'Telangana',
  'Kerala',
  'Rajasthan',
  'Bihar',
];
const CASTES = ['All', 'SC', 'ST', 'OBC', 'Minority', 'General'];
const INCOMES = ['All', 'Below 2 Lakh', 'Below 2.5 Lakh', 'Below 8 Lakh'];
const GENDERS = ['All', 'Male', 'Female'];
const GRADES = ['All', 'Class 9-10', 'Class 11-12'];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05 },
  }),
};

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [applied, setApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedLoading, setAppliedLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({});
  const [eligibilityResults, setEligibilityResults] = useState({});

  const [search, setSearch] = useState('');
  const [state, setState] = useState('All');
  const [caste, setCaste] = useState('All');
  const [income, setIncome] = useState('All');
  const [gender, setGender] = useState('All');
  const [grade, setGrade] = useState('All');

  const { isAuthenticated } = useAuthStore();
  const { t } = useLanguageStore();

  useEffect(() => {
    fetchScholarships();
  }, [state, caste, income, gender, grade]);

  useEffect(() => {
    if (isAuthenticated) fetchApplied();
  }, [isAuthenticated]);

  const fetchScholarships = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (state !== 'All') params.state = state;
      if (caste !== 'All') params.caste = caste;
      if (income !== 'All') params.income = income;
      if (gender !== 'All') params.gender = gender;
      if (grade !== 'All') params.grade = grade;

      const res = await api.get('/scholarships', { params });
      setScholarships(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplied = async () => {
    setAppliedLoading(true);
    try {
      const res = await api.get('/scholarships/applied');
      setApplied(res.data.data);
    } catch {
      setApplied([]);
    } finally {
      setAppliedLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchScholarships();
  };

  const handleCheckEligibility = async (scholarshipId) => {
    try {
      const res = await api.get(`/scholarships/${scholarshipId}/eligibility`);
      setEligibilityResults((prev) => ({ ...prev, [scholarshipId]: res.data.data }));
    } catch {
      setEligibilityResults((prev) => ({
        ...prev,
        [scholarshipId]: { eligible: false, reasons: ['Could not check eligibility'] },
      }));
    }
  };

  const handleApply = async (scholarshipId) => {
    try {
      const res = await api.post(`/scholarships/${scholarshipId}/apply`);
      fetchApplied();
      // Open official URL if available
      if (res.data.data?.applicationUrl) {
        window.open(res.data.data.applicationUrl, '_blank');
      }
    } catch {
      // already applied
    }
  };

  const appliedIds = new Set(applied.map((s) => s._id));

  const clearFilters = () => {
    setSearch('');
    setState('All');
    setCaste('All');
    setIncome('All');
    setGender('All');
    setGrade('All');
  };

  const daysUntil = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-text-primary flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" />
            {t('nav_scholarships')}
          </h1>
          <p className="mt-2 text-text-secondary">
            Find and apply for scholarships matched to your profile. Real Indian government schemes.
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
            Browse Scholarships
          </button>
          {isAuthenticated && (
            <button
              onClick={() => {
                setActiveTab('applied');
                fetchApplied();
              }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'applied'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              My Applications ({applied.length})
            </button>
          )}
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <>
            {/* Search + Filter */}
            <div className="bg-white rounded-2xl border border-border p-4 mb-6 shadow-sm">
              <form onSubmit={handleSearch} className="flex gap-3 flex-col sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search scholarships..."
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

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 mt-4 border-t border-border">
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1.5 block">State</label>
                        <select value={state} onChange={(e) => setState(e.target.value)} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                          {STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1.5 block">Category</label>
                        <select value={caste} onChange={(e) => setCaste(e.target.value)} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                          {CASTES.map((c) => (<option key={c} value={c}>{c}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1.5 block">Income</label>
                        <select value={income} onChange={(e) => setIncome(e.target.value)} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                          {INCOMES.map((i) => (<option key={i} value={i}>{i}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1.5 block">Gender</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                          {GENDERS.map((g) => (<option key={g} value={g}>{g}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-secondary mb-1.5 block">Grade</label>
                        <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                          {GRADES.map((g) => (<option key={g} value={g}>{g}</option>))}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button onClick={clearFilters} className="text-xs text-text-secondary hover:text-danger flex items-center gap-1 transition-colors">
                        <X className="w-3 h-3" /> Clear Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scholarships Grid */}
            {loading ? (
              <Loader />
            ) : scholarships.length === 0 ? (
              <div className="text-center py-20">
                <GraduationCap className="w-16 h-16 text-border mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-1">No scholarships found</h3>
                <p className="text-sm text-text-secondary">Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {scholarships.map((sch, i) => {
                    const days = daysUntil(sch.deadline);
                    const isApplied = appliedIds.has(sch._id);
                    const eligResult = eligibilityResults[sch._id];

                    return (
                      <motion.div
                        key={sch._id}
                        variants={fadeIn}
                        custom={i}
                        className="bg-white rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5 text-primary" />
                          </div>
                          {days !== null && (
                            <span
                              className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1 ${
                                days < 0
                                  ? 'bg-gray-100 text-gray-500'
                                  : days <= 30
                                  ? 'bg-red-50 text-danger'
                                  : days <= 90
                                  ? 'bg-amber-50 text-amber-600'
                                  : 'bg-green-50 text-secondary'
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              {days < 0 ? 'Expired' : `${days}d left`}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-text-primary font-heading text-sm leading-snug mb-1">
                          {sch.title}
                        </h3>
                        <p className="text-xs text-text-secondary mb-3">{sch.provider}</p>

                        {/* Amount */}
                        <div className="flex items-center gap-1.5 mb-3 px-3 py-2 bg-green-50 rounded-xl">
                          <IndianRupee className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-semibold text-secondary">{sch.amount}</span>
                        </div>

                        {/* Eligibility tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {sch.eligibility?.caste && sch.eligibility.caste !== 'All' && (
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-md">
                              {sch.eligibility.caste}
                            </span>
                          )}
                          {sch.eligibility?.gender && sch.eligibility.gender !== 'All' && (
                            <span className="px-2 py-0.5 bg-pink-50 text-pink-600 text-xs rounded-md">
                              {sch.eligibility.gender}
                            </span>
                          )}
                          {sch.eligibility?.state && sch.eligibility.state !== 'All' && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-md">
                              {sch.eligibility.state}
                            </span>
                          )}
                          {sch.eligibility?.grade && sch.eligibility.grade !== 'All' && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs rounded-md">
                              {sch.eligibility.grade}
                            </span>
                          )}
                          {sch.eligibility?.income && sch.eligibility.income !== 'All' && (
                            <span className="px-2 py-0.5 bg-teal-50 text-teal-600 text-xs rounded-md">
                              {sch.eligibility.income}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-text-secondary line-clamp-2 mb-4 flex-1">
                          {sch.description}
                        </p>

                        {/* Eligibility check result */}
                        {eligResult && (
                          <div
                            className={`p-3 rounded-xl text-xs mb-3 ${
                              eligResult.eligible
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-medium mb-1">
                              {eligResult.eligible ? (
                                <>
                                  <CheckCircle className="w-4 h-4" /> You are eligible!
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4" /> Not eligible
                                </>
                              )}
                            </div>
                            {eligResult.reasons?.length > 0 && (
                              <ul className="ml-5 list-disc space-y-0.5">
                                {eligResult.reasons.map((r, idx) => (
                                  <li key={idx}>{r}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto">
                          {isAuthenticated && !eligResult && (
                            <button
                              onClick={() => handleCheckEligibility(sch._id)}
                              className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-xs font-medium text-text-secondary hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              Check Eligibility
                            </button>
                          )}
                          {isApplied ? (
                            <div className="flex-1 px-3 py-2 bg-secondary/10 text-secondary rounded-xl text-xs font-medium flex items-center justify-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Applied
                            </div>
                          ) : (
                            <button
                              onClick={() => handleApply(sch._id)}
                              disabled={!isAuthenticated}
                              className="flex-1 px-3 py-2 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Apply Now
                            </button>
                          )}
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
                        onClick={() => fetchScholarships(p)}
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

        {/* Applied Tab */}
        {activeTab === 'applied' && (
          <>
            {appliedLoading ? (
              <Loader />
            ) : applied.length === 0 ? (
              <div className="text-center py-20">
                <Award className="w-16 h-16 text-border mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  No applications yet
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Browse scholarships and apply to start tracking your applications.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Browse Scholarships
                </button>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {applied.map((sch, i) => {
                  const days = daysUntil(sch.deadline);
                  return (
                    <motion.div
                      key={sch._id}
                      variants={fadeIn}
                      custom={i}
                      className="bg-white rounded-2xl border border-border p-5 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-secondary" />
                        </div>
                        <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">
                          Applied
                        </span>
                      </div>
                      <h3 className="font-bold text-text-primary text-sm mb-1">{sch.title}</h3>
                      <p className="text-xs text-text-secondary mb-2">{sch.provider}</p>
                      <div className="flex items-center gap-1.5 mb-2">
                        <IndianRupee className="w-3.5 h-3.5 text-secondary" />
                        <span className="text-sm font-semibold text-secondary">{sch.amount}</span>
                      </div>
                      {days !== null && (
                        <p className="text-xs text-text-secondary">
                          {days < 0 ? 'Deadline passed' : `${days} days remaining`}
                        </p>
                      )}
                      {sch.applicationUrl && (
                        <a
                          href={sch.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Visit Official Site <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
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

export default Scholarships;
