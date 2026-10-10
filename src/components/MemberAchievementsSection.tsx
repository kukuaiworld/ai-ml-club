import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  Calendar,
  User,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dataStore } from '../services/dataStore';
import { AchievementCategory, MemberAchievement } from '../types';

const CATEGORIES: AchievementCategory[] = [
  'Hackathon Win',
  'Research Publication',
  'Competition Award',
  'Certification',
  'Open Source Contribution',
  'Internship / Placement',
];

export const MemberAchievementsSection: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { info, error } = useToast();

  const [approvedAchievements, setApprovedAchievements] = useState<MemberAchievement[]>([]);
  const [myPendingAchievements, setMyPendingAchievements] = useState<MemberAchievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AchievementCategory>('Hackathon Win');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [proofUrl, setProofUrl] = useState('');

  const loadAchievements = () => {
    // Only approved achievements are visible in the Members' Achievements section
    const approved = dataStore.getMemberAchievements(false);
    setApprovedAchievements(approved);

    // Check if the current logged-in member has any pending submissions of their own
    if (user) {
      const all = dataStore.getMemberAchievements(true);
      const minePending = all.filter(
        (a) =>
          a.status === 'Pending' &&
          (a.member_id === user.id ||
            (user.username && a.member_username === user.username))
      );
      setMyPendingAchievements(minePending);
    } else {
      setMyPendingAchievements([]);
    }
  };

  useEffect(() => {
    loadAchievements();
    const unsub = dataStore.subscribe(loadAchievements);
    return () => unsub();
  }, [user]);

  if (!isAuthenticated) {
    return null;
  }

  const filteredApproved =
    selectedCategory === 'All'
      ? approvedAchievements
      : approvedAchievements.filter((a) => a.category === selectedCategory);

  const handleSubmitAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date) {
      error('Please fill in the achievement title, date, and description.');
      return;
    }

    const memberUsername =
      user?.username ||
      `#${user?.name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'member'}123`;

    dataStore.submitMemberAchievement({
      title: title.trim(),
      description: description.trim(),
      category,
      date,
      member_id: user?.id || 'member',
      member_name: user?.name || 'Club Member',
      member_username: memberUsername,
      proof_url: proofUrl.trim() || undefined,
    });

    info(
      'Achievement submitted! Your achievement is Pending Approval and will appear once an Admin approves it.'
    );
    setTitle('');
    setDescription('');
    setProofUrl('');
    setIsSubmitModalOpen(false);
    loadAchievements();
  };

  return (
    <div id="member-achievements" className="rounded-2xl glass-panel border border-white/10 p-6 sm:p-8 bg-slate-900/60 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-700/50 text-purple-300 text-[11px] font-mono mb-2">
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
            <span>Members Only • Verified Hall of Honor</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Members&apos; Achievements</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Official member accomplishments approved by club administrators. Submit your wins, papers, or awards for verification.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:via-purple-500 hover:to-fuchsia-500 text-white font-medium text-xs shadow-lg shadow-purple-600/25 transition flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* Notice if current member has pending achievements awaiting admin approval */}
      {myPendingAchievements.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/35 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="font-semibold text-amber-200">
                You have {myPendingAchievements.length} achievement submission{myPendingAchievements.length > 1 ? 's' : ''} Pending Admin Approval
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                {myPendingAchievements.map((p) => `"${p.title}"`).join(', ')} — will become visible in the Members&apos; Achievements showcase once approved by an Admin.
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-400/30 self-start sm:self-auto shrink-0">
            Pending Approval
          </span>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Approved Achievements Grid */}
      {filteredApproved.length === 0 ? (
        <div className="p-10 rounded-xl bg-slate-950/50 border border-white/5 text-center space-y-2">
          <Award className="w-8 h-8 text-purple-400 mx-auto" />
          <div className="text-sm font-semibold text-white">No Approved Achievements in This Category</div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click &ldquo;Add Achievement&rdquo; above to submit your milestone for admin review and approval.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApproved.map((ach) => (
            <div
              key={ach.id}
              className="p-5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-purple-500/40 transition flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-700/60">
                    {ach.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Approved</span>
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white leading-snug mb-2">
                  {ach.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-purple-300 font-semibold">
                    <User className="w-3 h-3 text-purple-400" />
                    {ach.member_name}
                  </span>
                  {ach.member_username && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/50 text-purple-300 text-[10px]">
                      {ach.member_username}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {ach.date}
                  </span>
                  {ach.proof_url && (
                    <a
                      href={ach.proof_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-200 transition"
                    >
                      <span>Proof</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBMIT ACHIEVEMENT MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span>Submit Member Achievement</span>
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 text-[11px] text-purple-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                Every new achievement remains <strong>Pending Approval</strong> until reviewed and approved by an Admin in the Admin Panel. Only approved achievements are displayed.
              </span>
            </div>

            <form onSubmit={handleSubmitAchievement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-mono mb-1">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 1st Runner Up — National AI Robotics Challenge"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-mono mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AchievementCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-mono mb-1">
                    Date Achieved *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">
                  Description & Technical Impact *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you built, the competition/journal, and key technical results..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">
                  Certificate / Repository / Proof URL (Optional)
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/... or certificate link"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Submit for Approval</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
