import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  FolderGit2, 
  Cpu, 
  ExternalLink, 
  Copy, 
  Check, 
  Edit3, 
  X, 
  Calendar,
  Lock,
  Compass,
  Award,
  Terminal,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dataStore } from '../services/dataStore';
import { ClubLogo } from '../components/ClubLogo';
import { MemberAchievementsSection } from '../components/MemberAchievementsSection';
import { Workshop, Project } from '../types';

interface MemberDashboardPageProps {
  onNavigateTab: (tab: string) => void;
}

export const MemberDashboardPage: React.FC<MemberDashboardPageProps> = ({ onNavigateTab }) => {
  const { user, isAdmin, isCoreMember, logout, updateProfile } = useAuth();
  const { success, info, error } = useToast();

  const [copied, setCopied] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Edit profile form state
  const [editName, setEditName] = useState(user?.name || '');
  const [editSpecialization, setEditSpecialization] = useState(user?.specialization || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editGithub, setEditGithub] = useState(user?.github || '');
  const [editLinkedin, setEditLinkedin] = useState(user?.linkedin || '');

  useEffect(() => {
    setWorkshops(dataStore.getWorkshops());
    setProjects(dataStore.getProjects());

    if (user) {
      setEditName(user.name);
      setEditSpecialization(user.specialization || '');
      setEditBio(user.bio || '');
      setEditGithub(user.github || '');
      setEditLinkedin(user.linkedin || '');
    }
  }, [user]);

  const handleCopyUsername = () => {
    if (user?.username) {
      navigator.clipboard.writeText(user.username);
      setCopied(true);
      info(`Copied username "${user.username}" to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      error('Name cannot be empty.');
      return;
    }

    updateProfile({
      name: editName.trim(),
      specialization: editSpecialization.trim(),
      bio: editBio.trim(),
      github: editGithub.trim(),
      linkedin: editLinkedin.trim(),
    });

    success('Profile updated successfully!');
    setIsEditProfileOpen(false);
  };

  const username = user?.username || `#${user?.name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'member'}123`;

  return (
    <div className="min-h-screen bg-[#0d0814] text-slate-100 relative selection:bg-purple-600/30">
      {/* Background Subtle Ambience */}
      <div className="fixed inset-0 bg-subtle-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Member Portal Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0d0814]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div onClick={() => onNavigateTab('home')} className="cursor-pointer">
            <ClubLogo size="sm" />
          </div>
          <span className="hidden sm:inline-block w-px h-5 bg-white/15" />
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Member Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(isAdmin || isCoreMember) && (
            <button
              onClick={() => onNavigateTab('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Return to</span> Public Site
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/50 hover:bg-red-900/40 text-red-300 text-xs font-medium transition"
            title="Log out of member account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Welcome Hero Banner */}
        <div className="rounded-3xl glass-panel border border-white/10 p-6 sm:p-8 bg-gradient-to-r from-purple-950/30 via-slate-900/40 to-slate-950 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/50 text-purple-300 text-xs font-mono mb-3">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                {user?.role === 'Admin'
                  ? 'Club Administrator'
                  : user?.role === 'Vice President'
                  ? 'Club Vice President'
                  : 'Active Club Member'}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome, {user?.name || 'Club Member'}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                You are authenticated as an official {user?.role || 'Member'} of the AI/ML Club, Engineering College, Ajmer. Access club workshops, research repositories, and student projects.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  document.getElementById('member-achievements')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-600/20 transition flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Members&apos; Achievements</span>
              </button>
              <button
                onClick={() => onNavigateTab('workshops')}
                className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Join Workshops</span>
              </button>
              <button
                onClick={() => onNavigateTab('lab')}
                className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>AI Virtual Lab</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Member Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl glass-panel border border-white/10 p-6 bg-slate-900/60 shadow-xl space-y-6">
              
              {/* Header & Avatar */}
              <div className="flex flex-col items-center text-center pb-6 border-b border-white/10">
                <div className="relative mb-3">
                  <img
                    src={user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'}
                    alt={user?.name || 'Member'}
                    className="w-24 h-24 rounded-full object-cover border-2 border-purple-500/40 shadow-lg shadow-purple-500/10"
                  />
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0d0814]" title="Active" />
                </div>

                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                
                {/* Username Pill */}
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800 text-purple-300 font-mono text-xs">
                  <span>{username}</span>
                  <button
                    onClick={handleCopyUsername}
                    className="hover:text-white transition"
                    title="Copy unique username"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                </div>

                {/* Role Badge */}
                <div className="mt-2.5">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Role: {user?.role || 'Member'}
                  </span>
                </div>
              </div>

              {/* Profile Details List */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                    Institutional Email
                  </div>
                  <div className="text-slate-200 font-mono flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{user?.email || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                    Specialization / Track
                  </div>
                  <div className="text-slate-200 font-medium">
                    {user?.specialization || 'AI & Machine Learning Enthusiast'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                    Bio & Interests
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {user?.bio || 'Undergraduate student researcher engaged in deep learning and autonomous systems development.'}
                  </p>
                </div>

                {user?.github && (
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                      GitHub
                    </div>
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:text-purple-300 font-mono text-xs inline-flex items-center gap-1"
                    >
                      <span>{user.github.replace('https://', '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Edit Profile Action */}
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition flex items-center justify-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                <span>Edit Profile Info</span>
              </button>
            </div>

            {/* Access Level Notice Box */}
            <div className="rounded-2xl border border-purple-900/40 bg-purple-950/20 p-4 text-xs">
              <div className="flex items-center gap-2 font-mono text-purple-300 font-semibold mb-1">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Access Privileges ({user?.role || 'Member'})</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isAdmin ? (
                  <>
                    Your account has full <strong className="text-white">Admin</strong> permissions, including user role management, approvals, and platform configuration.
                  </>
                ) : isCoreMember ? (
                  <>
                    Your account is provisioned as <strong className="text-white">{user?.role}</strong> with access to the Admin Console for managing events, workshops, and content.
                  </>
                ) : (
                  <>
                    Your account is provisioned as an authenticated <strong className="text-white">Member</strong>. Administrative console functions (managing roles, publishing workshops, editing rosters) are restricted to club executives.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Right Column: Member Activities & Club Opportunities */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Club Status</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-1">Active</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Workshops Open</div>
                <div className="text-base font-bold text-white font-mono mt-1">{workshops.length}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Club Projects</div>
                <div className="text-base font-bold text-purple-300 font-mono mt-1">{projects.length}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Credentials</div>
                <div className="text-base font-bold text-purple-400 font-mono mt-1">Verified</div>
              </div>
            </div>

            {/* Members' Achievements Section (Members Only • Approved Only + Submit New Achievement) */}
            <MemberAchievementsSection />

            {/* Upcoming Workshops for Members */}
            <div className="rounded-2xl glass-panel border border-white/10 p-6 bg-slate-900/60">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Upcoming Club Workshops</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hands-on masterclasses designed for AI/ML club members.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('workshops')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-mono"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {workshops.slice(0, 3).map((ws) => (
                  <div
                    key={ws.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-white/5 hover:border-purple-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{ws.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>{ws.date} • {ws.venue}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateTab('workshops')}
                      className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-medium self-start sm:self-auto transition"
                    >
                      Register Seat
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Club Research Projects */}
            <div className="rounded-2xl glass-panel border border-white/10 p-6 bg-slate-900/60">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-purple-400" />
                    <span>Club Open Research Repositories</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Collaborate on open-source machine learning codebases with peers.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('projects')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-mono"
                >
                  Explore All →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.slice(0, 4).map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-white/5 hover:border-purple-500/30 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{proj.name}</div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-purple-400">
                      <span>{proj.tech_stack?.slice(0, 2).join(' • ')}</span>
                      <button onClick={() => onNavigateTab('projects')} className="hover:underline">
                        Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links Footer Bar */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>AI Lab simulation engine available for all verified members.</span>
              </div>
              <button
                onClick={() => onNavigateTab('lab')}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition"
              >
                Launch Neural Simulation
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" />
                <span>Update Member Profile</span>
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Unique Username</label>
                <input
                  type="text"
                  disabled
                  value={username}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-500 font-mono cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                  Usernames can only be altered by system administrators.
                </span>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Specialization / Domain</label>
                <input
                  type="text"
                  value={editSpecialization}
                  onChange={(e) => setEditSpecialization(e.target.value)}
                  placeholder="e.g. Deep Learning & Computer Vision"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Bio / Research Interests</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">GitHub Profile</label>
                  <input
                    type="text"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
