import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  RefreshCw,
  Clock,
  PhoneCall,
  Code2,
  Award,
  XCircle,
  HelpCircle,
  X,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Layers,
  Sparkles,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  job_url: string | null;
  location: string;
  salary: string | null;
  status: "applied" | "screening" | "assessment" | "interviewing" | "offered" | "rejected" | "ghosted";
  source: string;
  applied_date: string;
  notes: string | null;
  contact_person: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; border: string; bg: string; icon: any }
> = {
  applied: {
    label: "Applied",
    color: "text-blue-700",
    border: "border-blue-200",
    bg: "bg-blue-50",
    icon: Clock,
  },
  screening: {
    label: "Screening",
    color: "text-purple-700",
    border: "border-purple-200",
    bg: "bg-purple-50",
    icon: PhoneCall,
  },
  assessment: {
    label: "Assessment",
    color: "text-amber-800",
    border: "border-amber-200",
    bg: "bg-amber-50",
    icon: Code2,
  },
  interviewing: {
    label: "Interviewing",
    color: "text-orange-700",
    border: "border-orange-200",
    bg: "bg-orange-50",
    icon: Briefcase,
  },
  offered: {
    label: "Offer",
    color: "text-emerald-700",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    icon: Award,
  },
  rejected: {
    label: "Rejected",
    color: "text-slate-600",
    border: "border-slate-200",
    bg: "bg-slate-100",
    icon: XCircle,
  },
  ghosted: {
    label: "Archived",
    color: "text-slate-500",
    border: "border-slate-200",
    bg: "bg-slate-100",
    icon: HelpCircle,
  },
};

const SOURCE_CONFIG: Record<string, { label: string; icon?: any; color?: string }> = {
  linkedin_easy_apply: {
    label: "LinkedIn Easy Apply",
    icon: FaLinkedin,
    color: "text-[#0a66c2] border-blue-200 bg-blue-50",
  },
  company_website: {
    label: "Company Career Site",
    icon: Building2,
    color: "text-slate-700 border-slate-200 bg-slate-100",
  },
  referral: {
    label: "Referral / Network",
    icon: Award,
    color: "text-emerald-700 border-emerald-200 bg-emerald-50",
  },
  indeed: {
    label: "Indeed",
    icon: Building2,
    color: "text-indigo-700 border-indigo-200 bg-indigo-50",
  },
  wellfound: {
    label: "Wellfound",
    icon: Building2,
    color: "text-rose-700 border-rose-200 bg-rose-50",
  },
  other: {
    label: "Direct Portal",
    icon: Building2,
    color: "text-slate-600 border-slate-200 bg-slate-100",
  },
};

export default function CareerManager() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // New Job Form State
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [location, setLocation] = useState("Remote");
  const [salary, setSalary] = useState("");
  const [status, setStatus] = useState<JobApplication["status"]>("applied");
  const [source, setSource] = useState("company_website");
  const [appliedDate, setAppliedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "Bearer";

      const res = await fetch("/api/jobs", {
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Handle status update
  const handleStatusChange = async (id: string, newStatus: JobApplication["status"]) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "Bearer";

      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `${tokenType} ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setJobs((prev) =>
          prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle delete
  const handleDelete = async (id: string, companyName: string) => {
    if (!confirm(`Delete application for ${companyName}?`)) return;

    try {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "Bearer";

      const res = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      });

      if (res.ok) {
        setJobs((prev) => prev.filter((job) => job.id !== id));
      }
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  // Handle Add Job Submit
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      alert("Company and Role are required.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "Bearer";

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          Authorization: `${tokenType} ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: company.trim(),
          role: role.trim(),
          job_url: jobUrl.trim() || null,
          location: location.trim() || "Remote",
          salary: salary.trim() || null,
          status,
          source,
          applied_date: appliedDate ? new Date(appliedDate).toISOString() : new Date().toISOString(),
          notes: notes.trim() || null,
        }),
      });

      if (res.ok) {
        const createdJob = await res.json();
        setJobs((prev) => [createdJob, ...prev]);
        setIsAddModalOpen(false);
        setCompany("");
        setRole("");
        setJobUrl("");
        setLocation("Remote");
        setSalary("");
        setStatus("applied");
        setSource("company_website");
        setNotes("");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to create application");
      }
    } catch (err) {
      console.error("Error creating job:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        search === "" ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.role.toLowerCase().includes(search.toLowerCase()) ||
        (job.notes && job.notes.toLowerCase().includes(search.toLowerCase())) ||
        (job.location && job.location.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      const matchesSource = sourceFilter === "all" || job.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [jobs, search, statusFilter, sourceFilter]);

  // Analytics Metrics
  const stats = useMemo(() => {
    const total = jobs.length;
    const applied = jobs.filter((j) => j.status === "applied").length;
    const screening = jobs.filter((j) => j.status === "screening").length;
    const assessment = jobs.filter((j) => j.status === "assessment").length;
    const interviewing = jobs.filter((j) => j.status === "interviewing").length;
    const offered = jobs.filter((j) => j.status === "offered").length;
    const rejected = jobs.filter((j) => j.status === "rejected").length;
    const ghosted = jobs.filter((j) => j.status === "ghosted").length;

    const activePipeline = applied + screening + assessment + interviewing;
    const positiveReplies = screening + assessment + interviewing + offered;
    const responseRate = total > 0 ? Math.round((positiveReplies / total) * 100) : 0;

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const needsFollowUp = jobs.filter(
      (j) => j.status === "applied" && new Date(j.applied_date) < fiveDaysAgo
    );

    const sources: Record<string, number> = {};
    jobs.forEach((j) => {
      sources[j.source] = (sources[j.source] || 0) + 1;
    });

    return {
      total,
      applied,
      screening,
      assessment,
      interviewing,
      offered,
      rejected,
      ghosted,
      activePipeline,
      responseRate,
      needsFollowUp,
      sources,
    };
  }, [jobs]);

  const copyApiKey = () => {
    navigator.clipboard.writeText("param_career_tracker_secret_key_98234");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Metric Cards Row - Large, High-Impact Modern Enterprise KPI Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Card 1: Total */}
        <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Total Applications
            </span>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Briefcase size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              {stats.total}
            </div>
            <p className="text-sm font-medium text-slate-500 mt-2">
              All logged submissions
            </p>
          </div>
        </div>

        {/* Card 2: Active Pipeline */}
        <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Active Pipeline
            </span>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Zap size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-600 tracking-tight">
              {stats.activePipeline}
            </div>
            <p className="text-sm font-medium text-slate-500 mt-2">
              In review, test & rounds
            </p>
          </div>
        </div>

        {/* Card 3: Interviews & Screens */}
        <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Interviews & Calls
            </span>
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <PhoneCall size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl sm:text-5xl font-extrabold text-orange-600 tracking-tight">
              {stats.screening + stats.assessment + stats.interviewing}
            </div>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Active discussions
            </p>
          </div>
        </div>

        {/* Card 4: Offers */}
        <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Offers In Hand
            </span>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Award size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl sm:text-5xl font-extrabold text-emerald-600 tracking-tight">
              {stats.offered}
            </div>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Secured offers
            </p>
          </div>
        </div>

        {/* Card 5: Response Rate */}
        <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Response Rate
            </span>
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl sm:text-5xl font-extrabold text-purple-700 tracking-tight">
              {stats.responseRate}%
            </div>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Interview conversion
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout (8 / 4 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Work Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Action Toolbar - Generous Height & Crisp Padding */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-sm">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company, job role, location, or notes..."
                className="w-full bg-slate-50 hover:bg-slate-100/70 border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 pl-13 pr-11 text-base sm:text-lg h-14 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 outline-none transition-all font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Source select */}
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="bg-slate-50 border-2 border-slate-300 text-slate-800 text-base py-3.5 px-5 h-14 rounded-xl cursor-pointer outline-none focus:border-blue-600 font-bold shrink-0 shadow-xs"
              >
                <option value="all">All Sources</option>
                <option value="linkedin_easy_apply">LinkedIn Easy Apply</option>
                <option value="company_website">Company Career Site</option>
                <option value="referral">Referral</option>
                <option value="indeed">Indeed</option>
                <option value="wellfound">Wellfound</option>
              </select>

              {/* Refresh */}
              <button
                onClick={fetchJobs}
                disabled={loading}
                className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100 h-14 w-14 rounded-xl flex items-center justify-center shadow-xs transition-colors shrink-0"
                title="Refresh data"
              >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              </button>

              {/* Add Application Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-base h-14 px-7 rounded-xl flex items-center justify-center gap-2.5 font-bold shadow-md shadow-blue-500/25 transition-all shrink-0 hover:scale-[1.01]"
              >
                <Plus size={22} strokeWidth={2.5} />
                <span>Add Application</span>
              </button>
            </div>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-5 py-3 rounded-xl text-base font-bold transition-all shrink-0 flex items-center gap-2 ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-white border-2 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span>All Applications</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                  statusFilter === "all"
                    ? "bg-slate-800 text-slate-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {jobs.length}
              </span>
            </button>

            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const count = jobs.filter((j) => j.status === key).length;
              const isActive = statusFilter === key;

              return (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-5 py-3 rounded-xl text-base font-bold transition-all shrink-0 flex items-center gap-2 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>{cfg.label}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      isActive
                        ? "bg-slate-800 text-slate-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Job Applications List */}
          <div className="space-y-4">
            {loading && jobs.length === 0 ? (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-16 text-center text-slate-500 space-y-4 shadow-sm">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-lg font-bold text-slate-700">Loading career records...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-8">
                <div className="max-w-xl mx-auto space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600 shadow-xs">
                    <Briefcase size={32} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {search || statusFilter !== "all" || sourceFilter !== "all"
                      ? "No matching applications found"
                      : "Career Pipeline Ready"}
                  </h3>
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                    {search || statusFilter !== "all" || sourceFilter !== "all"
                      ? "No records matched your search query or filters. Clear filters to see all entries."
                      : "Track your job hunt end-to-end. Sync applications automatically from LinkedIn Easy Apply or log company career portals manually."}
                  </p>
                </div>

                {/* Quick Action Guide Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left max-w-3xl mx-auto">
                  {/* Card 1: LinkedIn Easy Apply Auto Sync */}
                  <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border-2 border-blue-200 rounded-2xl p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-[#0a66c2] font-bold text-lg">
                        <FaLinkedin size={22} />
                        <span>LinkedIn Auto-Sync</span>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                        Active Listener
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      Apply to any role on LinkedIn with <strong>Easy Apply</strong>. The Chrome extension detects the submission and saves it here in real time.
                    </p>
                    <button
                      onClick={copyApiKey}
                      className="w-full py-3 px-4 rounded-xl bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      {copiedKey ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                      <span>{copiedKey ? "Extension API Key Copied!" : "Copy Extension API Key"}</span>
                    </button>
                  </div>

                  {/* Card 2: Manual Portal Entry */}
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
                        <Building2 size={22} className="text-slate-700" />
                        <span>Direct Career Portals</span>
                      </div>
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                        Applied on a company website (Google, Stripe, Microsoft)? Log it manually with salary, status, and recruiter notes.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
                    >
                      <Plus size={20} strokeWidth={2.5} />
                      <span>Add Application Manually</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const statusInfo = STATUS_CONFIG[job.status] || STATUS_CONFIG.applied;
                const sourceInfo = SOURCE_CONFIG[job.source] || SOURCE_CONFIG.other;

                return (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 hover:shadow-lg transition-all shadow-sm"
                  >
                    {/* Left info */}
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Source Tag */}
                        <span
                          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold border ${
                            sourceInfo.color || "border-slate-200 text-slate-700 bg-slate-50"
                          }`}
                        >
                          {sourceInfo.icon && <sourceInfo.icon size={16} />}
                          {sourceInfo.label}
                        </span>

                        {/* Date */}
                        <span className="text-sm sm:text-base font-semibold text-slate-600 flex items-center gap-1.5">
                          <Calendar size={16} className="text-slate-400" />
                          {new Date(job.applied_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>

                        {/* Location */}
                        {job.location && (
                          <span className="text-sm sm:text-base font-semibold text-slate-600 flex items-center gap-1.5">
                            <MapPin size={16} className="text-slate-400" />
                            {job.location}
                          </span>
                        )}

                        {/* Salary */}
                        {job.salary && (
                          <span className="text-sm sm:text-base font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1">
                            <DollarSign size={15} />
                            {job.salary}
                          </span>
                        )}
                      </div>

                      {/* Title & Company */}
                      <div className="flex flex-wrap items-baseline gap-3 pt-1">
                        <h3 className="font-extrabold text-slate-900 text-2xl sm:text-3xl tracking-tight truncate">
                          {job.role}
                        </h3>
                        <span className="text-slate-600 text-lg sm:text-xl font-bold">
                          — {job.company}
                        </span>
                      </div>

                      {/* Notes */}
                      {job.notes && (
                        <p className="text-base text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 italic leading-relaxed">
                          "{job.notes}"
                        </p>
                      )}
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      {/* Status Selector */}
                      <div className="relative">
                        <select
                          value={job.status}
                          disabled={updatingId === job.id}
                          onChange={(e) =>
                            handleStatusChange(job.id, e.target.value as JobApplication["status"])
                          }
                          className={`appearance-none text-base font-bold py-3 pl-5 pr-11 rounded-xl border-2 outline-none cursor-pointer transition-all ${
                            statusInfo.bg
                          } ${statusInfo.color} ${statusInfo.border} shadow-sm hover:border-slate-400 focus:ring-4 focus:ring-blue-500/20`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                            <option
                              key={val}
                              value={val}
                              className="bg-white text-slate-900 py-2 font-semibold"
                            >
                              {cfg.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={18}
                          className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${statusInfo.color}`}
                        />
                      </div>

                      {/* Job Link */}
                      {job.job_url && (
                        <a
                          href={job.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-12 w-12 flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-xs"
                          title="Open job posting"
                        >
                          <ExternalLink size={19} />
                        </a>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(job.id, job.company)}
                        className="h-12 w-12 flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-xs"
                        title="Delete application"
                      >
                        <Trash2 size={19} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar Widgets (4 Cols) - Prominent, Bold Blocks */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget 1: Funnel */}
          <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 flex items-center gap-2">
                <Layers size={20} className="text-blue-600" /> Pipeline Stages
              </span>
              <span className="text-sm font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {stats.activePipeline} Active
              </span>
            </div>

            <div className="space-y-4">
              {[
                { label: "Applied Stage", count: stats.applied, color: "bg-blue-600" },
                { label: "Screening / HR Calls", count: stats.screening, color: "bg-purple-600" },
                { label: "Technical Assessments", count: stats.assessment, color: "bg-amber-600" },
                { label: "Interviews", count: stats.interviewing, color: "bg-orange-600" },
                { label: "Offers Received", count: stats.offered, color: "bg-emerald-600" },
              ].map((stage) => {
                const pct = stats.total > 0 ? Math.round((stage.count / stats.total) * 100) : 0;
                return (
                  <div key={stage.label} className="space-y-2">
                    <div className="flex justify-between items-center text-sm sm:text-base font-bold text-slate-800">
                      <span>{stage.label}</span>
                      <span className="font-mono text-slate-900">{stage.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                      <div
                        className={`${stage.color} h-3.5 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(pct, stage.count > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 2: Follow-up Radar */}
          <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 flex items-center gap-2">
                <Clock size={20} className="text-amber-600" /> Follow-Up Radar
              </span>
              <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {stats.needsFollowUp.length} Pending
              </span>
            </div>

            {stats.needsFollowUp.length === 0 ? (
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm sm:text-base font-semibold">
                <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                <span>All applications are fresh! No overdue follow-ups needed.</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {stats.needsFollowUp.slice(0, 4).map((job) => {
                  const daysAgo = Math.floor(
                    (new Date().getTime() - new Date(job.applied_date).getTime()) / (1000 * 3600 * 24)
                  );
                  return (
                    <div key={job.id} className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-sm space-y-1.5">
                      <div className="flex justify-between items-center font-bold text-slate-900 text-base">
                        <span className="truncate">{job.company}</span>
                        <span className="font-mono text-amber-800 text-xs px-2 py-0.5 rounded-md bg-amber-100 border border-amber-200 font-bold">
                          {daysAgo}d ago
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm truncate font-medium">{job.role}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Widget 3: LinkedIn Sync Assistant */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border-2 border-blue-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 flex items-center gap-2">
                <FaLinkedin className="text-[#0a66c2]" size={22} /> LinkedIn Auto-Capture
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Live
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              When you submit a <strong>LinkedIn Easy Apply</strong>, the Chrome extension captures and syncs the role here automatically.
            </p>

            <div className="p-4 bg-white/95 border border-blue-200 rounded-xl space-y-3 text-sm sm:text-base">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold">Backend Port:</span>
                <span className="font-mono font-bold text-blue-700">localhost:8000</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 pt-2 border-t border-slate-100">
                <span className="font-bold">Extension Key:</span>
                <button
                  onClick={copyApiKey}
                  className="font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copiedKey ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                  <span>{copiedKey ? "Copied" : "Copy Key"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Widget 4: Sources */}
          <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 block pb-4 border-b border-slate-200">
              Application Sources
            </span>

            <div className="space-y-3.5 text-sm sm:text-base font-bold">
              {Object.entries(stats.sources).length === 0 ? (
                <p className="text-slate-400 text-base italic font-normal">No applications recorded yet</p>
              ) : (
                Object.entries(stats.sources).map(([src, count]) => {
                  const cfg = SOURCE_CONFIG[src] || SOURCE_CONFIG.other;
                  return (
                    <div key={src} className="flex items-center justify-between text-slate-800">
                      <span className="flex items-center gap-2">
                        {cfg.icon && <cfg.icon size={16} className="text-slate-500" />}
                        {cfg.label}
                      </span>
                      <span className="font-mono font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                        {count}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Application */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-3xl p-8 sm:p-10 bg-white border-2 border-slate-300 shadow-2xl space-y-7 rounded-3xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b-2 border-slate-100">
                <div>
                  <h3 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    Track New Job Application
                  </h3>
                  <p className="text-base text-slate-500 mt-1 font-medium">
                    Record submissions from company career portals or direct outreach.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateJob} className="space-y-5 text-base">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 font-bold text-slate-800 text-base">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Stripe, Google, Microsoft"
                      className="w-full h-14 px-5 rounded-xl text-base font-medium border-2 border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-bold text-slate-800 text-base">Role / Title *</label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full h-14 px-5 rounded-xl text-base font-medium border-2 border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 font-bold text-slate-800 text-base">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as JobApplication["status"])}
                      className="w-full h-14 px-5 rounded-xl bg-white cursor-pointer text-base font-bold border-2 border-slate-300 focus:border-blue-600 outline-none"
                    >
                      {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                        <option key={k} value={k}>
                          {cfg.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-bold text-slate-800 text-base">Source</label>
                    <select
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-full h-14 px-5 rounded-xl bg-white cursor-pointer text-base font-bold border-2 border-slate-300 focus:border-blue-600 outline-none"
                    >
                      <option value="company_website">Company Career Site</option>
                      <option value="linkedin_easy_apply">LinkedIn Easy Apply</option>
                      <option value="referral">Referral / Network</option>
                      <option value="indeed">Indeed</option>
                      <option value="wellfound">Wellfound</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 font-bold text-slate-800 text-base">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Remote, Bengaluru, San Francisco"
                      className="w-full h-14 px-5 rounded-xl text-base font-medium border-2 border-slate-300 bg-white focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-bold text-slate-800 text-base">Salary / Compensation</label>
                    <input
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. $160,000 / 30-40 LPA"
                      className="w-full h-14 px-5 rounded-xl text-base font-medium border-2 border-slate-300 bg-white focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 font-bold text-slate-800 text-base">Job URL</label>
                    <input
                      type="url"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      placeholder="https://company.com/careers/role"
                      className="w-full h-14 px-5 rounded-xl text-base font-medium border-2 border-slate-300 bg-white focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-bold text-slate-800 text-base">Applied Date</label>
                    <input
                      type="date"
                      value={appliedDate}
                      onChange={(e) => setAppliedDate(e.target.value)}
                      className="w-full h-14 px-5 rounded-xl bg-white text-base font-medium border-2 border-slate-300 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-bold text-slate-800 text-base">Notes & Follow-Up</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Recruiter contact, interview rounds, prep points..."
                    className="w-full p-4 rounded-xl resize-none text-base font-medium border-2 border-slate-300 bg-white focus:border-blue-600 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3.5 pt-5 border-t-2 border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="h-14 px-7 rounded-xl text-base font-bold bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-14 px-9 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all"
                  >
                    {submitting ? "Saving..." : "Save Application"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
