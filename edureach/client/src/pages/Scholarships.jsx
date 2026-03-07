import { useState, useEffect } from "react";
import { Search, ChevronDown, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import Loader from "../components/common/Loader";

const CATEGORIES = [
  "All Categories",
  "Merit", "Need-based", "Merit-cum-Means",
  "Technical", "State", "Minority", "Corporate",
  "Foundation", "Defence", "Pre-Matric",
  "Post-Matric", "Higher Education", "Research Fellowship",
];

const STATES = [
  "State",
  "Tamil Nadu", "Karnataka", "Uttar Pradesh", "Maharashtra",
  "Andhra Pradesh", "Telangana", "Kerala", "Rajasthan", "Bihar",
];

const JUNK_RE = /whatsapp|^buddy4study|channel|messaging|telegram|newsletter/i;

const isValid = (s) => {
  if (!s.title || s.title.length < 8) return false;
  if (JUNK_RE.test(s.title)) return false;
  if (!s.applicationUrl || !s.applicationUrl.startsWith("http")) return false;
  if (s.amount && !/\d/.test(s.amount)) return false;
  return true;
};

const formatAmount = (raw) => {
  if (!raw) return null;
  return raw.replace(/\s*per\s+(year|annum|month)/i, "").trim();
};

const DeadlineBadge = ({ deadline }) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (days < 0)
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
        Closed
      </span>
    );
  const color = days <= 30 ? "text-red-500" : "text-emerald-500";
  return (
    <span className={`flex items-center gap-1 text-[11px] font-semibold ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${days <= 30 ? "bg-red-500" : "bg-emerald-500"} inline-block`} />
      {days}D LEFT
    </span>
  );
};

const tagStyle = (label) => {
  const l = (label || "").toLowerCase();
  if (l.includes("female"))                   return "bg-pink-100 text-pink-700";
  if (l.includes("male"))                     return "bg-blue-100 text-blue-700";
  if (l.includes("lakh"))                     return "bg-indigo-900 text-white";
  if (l.includes("class"))                    return "bg-gray-100 text-gray-600";
  if (["sc","st","obc","minority","general","ebc"].includes(l))
                                              return "bg-violet-100 text-violet-700";
  if (l.includes("engineer") || l.includes("science") || l.includes("medic") || l.includes("tech"))
                                              return "bg-sky-100 text-sky-700";
  // State names
  const stateWords = ["tamil","karnataka","maharashtra","uttar","andhra","telangana","kerala","rajasthan","bihar","west","gujarat","punjab"];
  if (stateWords.some((w) => l.startsWith(w))) return "bg-teal-100 text-teal-700";
  return "bg-gray-100 text-gray-600";
};

const buildTags = (sch) => {
  const e = sch.eligibility || {};
  const tags = [];
  if (e.gender && e.gender !== "All")  tags.push(e.gender === "Female" ? "Female Only" : e.gender === "Male" ? "Male Only" : e.gender);
  if (e.income && e.income !== "All")  tags.push(e.income);
  if (e.grade  && e.grade  !== "All")  tags.push(e.grade);
  if (e.caste  && e.caste  !== "All")  tags.push(e.caste);
  if (e.state  && e.state  !== "All")  tags.push(e.state);
  if (e.course && e.course !== "All" && e.course) tags.push(e.course);
  return tags;
};

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [applied, setApplied]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [pagination, setPagination]     = useState({});
  const [currentPage, setCurrentPage]   = useState(1);
  const [applying, setApplying]         = useState(null);

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All Categories");
  const [state,    setState]    = useState("State");

  const { isAuthenticated } = useAuthStore();

  useEffect(() => { fetchScholarships(1); window.scrollTo(0, 0); }, []);
  useEffect(() => { if (isAuthenticated) fetchApplied(); }, [isAuthenticated]);

  const fetchScholarships = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    try {
      const params = { page, limit: 10 };
      if (search && search.trim())                params.search   = search.trim();
      if (state    !== "State")                   params.state    = state;
      if (category !== "All Categories")          params.category = category;
      const res = await api.get("/scholarships", { params });
      setScholarships((res.data.data || []).filter(isValid));
      setPagination(res.data.pagination || {});
    } catch {
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplied = async () => {
    try {
      const res = await api.get("/scholarships/applied");
      setApplied((res.data.data || []).filter(isValid));
    } catch { setApplied([]); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchScholarships(1); };

  const handleApply = async (sch) => {
    if (!isAuthenticated || applying) return;
    setApplying(sch._id);
    try {
      await api.post(`/scholarships/${sch._id}/apply`);
      await fetchApplied();
    } catch { /* already applied or other */ } finally {
      setApplying(null);
      if (sch.applicationUrl) window.open(sch.applicationUrl, "_blank", "noopener,noreferrer");
    }
  };

  const appliedIds  = new Set(applied.map((s) => s._id));
  const totalPages  = pagination.pages || 1;

  const pageNums = (() => {
    const total = totalPages;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  })();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page header ── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Scholarships</h1>
        <p className="text-sm text-gray-500 mt-1">Browse and apply for scholarships tailored to your profile</p>
      </div>

      {/* ── Sticky search bar ── */}
      <div className="sticky top-[68px] z-20 bg-gray-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <form onSubmit={handleSearch} className="flex gap-3 items-stretch h-11">
            <div className="flex-1 flex items-center gap-2.5 px-4 bg-white rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by name, category or state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-full appearance-none pl-4 pr-8 bg-white rounded-xl border border-gray-200 shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-full appearance-none pl-4 pr-8 bg-white rounded-xl border border-gray-200 shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-7 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-5 pb-12">

        {/* Count */}
        {!loading && pagination.total > 0 && (
          <p className="text-sm text-gray-500 mb-5">
            Showing <span className="font-semibold text-gray-800">{scholarships.length}</span> scholarships
            {pagination.total > scholarships.length ? ` of ${pagination.total}` : ""}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <Loader />
        ) : scholarships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-400 text-sm">No scholarships found. Try a different search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
              {scholarships.map((sch) => {
                const isApplied = appliedIds.has(sch._id);
                const amount    = formatAmount(sch.amount);
                const tags      = buildTags(sch);

                return (
                  <div
                    key={sch._id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden"
                  >
                    {/* Card body */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Provider row + deadline */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-tight line-clamp-1 flex-1">
                          {sch.provider || "Government of India"}
                        </p>
                        <DeadlineBadge deadline={sch.deadline} />
                      </div>

                      {/* Title */}
                      <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 mb-1.5">
                        {sch.title}
                      </h3>

                      {/* Amount */}
                      {amount && /\d/.test(amount) && (
                        <p className="text-sm font-bold text-emerald-600 mb-3">
                          {amount.startsWith("₹") ? amount : `₹ ${amount}`}
                          <span className="text-xs font-normal text-gray-400 ml-1">/ year</span>
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-3">
                        {sch.description || "No description available."}
                      </p>

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${tagStyle(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.length > 4 && (
                            <span className="text-[11px] text-gray-400 self-center">+{tags.length - 4}</span>
                          )}
                        </div>
                      )}

                      <div className="flex-1" />
                    </div>

                    {/* Buttons — pinned to bottom, full-width divider style */}
                    <div className="border-t border-gray-100 px-5 py-3 flex gap-2">
                      <a
                        href={sch.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-center"
                      >
                        Check Details
                      </a>
                      {isApplied ? (
                        <a
                          href={sch.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-xs font-semibold text-center hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Applied
                        </a>
                      ) : (
                        <button
                          onClick={() => handleApply(sch)}
                          disabled={!isAuthenticated || applying === sch._id}
                          className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {applying === sch._id ? "Opening…" : "Apply Now"}
                        </button>
                      )}
                    </div>

                    {!isAuthenticated && (
                      <p className="text-center text-[11px] text-gray-400 pb-2">Sign in to apply</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5">
                <button
                  onClick={() => fetchScholarships(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 px-3 h-9 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {pageNums.map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchScholarships(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                      p === currentPage
                        ? "bg-gray-900 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => fetchScholarships(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 px-3 h-9 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
