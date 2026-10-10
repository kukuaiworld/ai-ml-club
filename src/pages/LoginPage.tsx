import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ArrowLeft, 
  KeyRound, 
  AlertCircle,
  User,
  UserPlus,
  Mail,
  Cpu,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { dataStore } from '../services/dataStore';
import { ClubLogo } from '../components/ClubLogo';

interface LoginPageProps {
  onNavigateHome: () => void;
  onLoginSuccess: (targetRoute?: string) => void;
  defaultMode?: 'member' | 'signup' | 'admin';
  pendingActionLabel?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateHome,
  onLoginSuccess,
  defaultMode = 'member',
  pendingActionLabel = null,
}) => {
  const { login, signup, switchDemoRole } = useAuth();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState<'member' | 'signup' | 'admin'>(defaultMode);

  // Sync tab if defaultMode prop changes
  useEffect(() => {
    setActiveTab(defaultMode);
  }, [defaultMode]);

  // Sign In state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);

  // Sign Up state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupSpecialization, setSignupSpecialization] = useState('Deep Learning & LLMs');
  const [signupPassword, setSignupPassword] = useState('123456');
  const [pendingSubmittedUser, setPendingSubmittedUser] = useState<{ name: string; username: string; email: string } | null>(null);

  // Auto-suggest #username123 when user types their name in Sign Up
  const previewUsername = signupUsername.trim()
    ? dataStore.formatUsername(signupUsername)
    : signupName.trim()
    ? dataStore.formatUsername(signupName)
    : '#yourname123';

  // Available profiles from store for quick testing (only approved members)
  const allProfiles = dataStore.getProfiles();
  const memberProfiles = allProfiles.filter(
    p => p.role === 'Member' || p.role === 'Vice President' || p.role === 'Core Member'
  );
  const pendingRequestsCount = dataStore.getApplications().filter(a => a.status === 'Pending').length;

  const isDirectLoginAction =
    !pendingActionLabel ||
    pendingActionLabel.toLowerCase().includes('member login') ||
    pendingActionLabel.toLowerCase().includes('admin portal') ||
    pendingActionLabel.toLowerCase().includes('admin console');

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      error('Please enter both your username/email and password.');
      return;
    }

    setLoading(true);
    const res = await login(identifier.trim(), password);
    setLoading(false);

    if (res.success && res.user) {
      if (
        activeTab === 'admin' &&
        (res.user.role === 'Admin' ||
          res.user.role === 'Vice President' ||
          res.user.role === 'Core Member')
      ) {
        const target = pendingRequestsCount > 0 ? 'admin/join-requests' : 'admin';
        success(`Welcome, ${res.user.name}! Opening Admin Console.`);
        onLoginSuccess(target);
      } else if (!isDirectLoginAction && pendingActionLabel) {
        success(`Welcome back, ${res.user.name}! Continuing to ${pendingActionLabel}...`);
        onLoginSuccess();
      } else if (res.user.role === 'Member') {
        success(`Welcome back, ${res.user.name}! Opening Member Dashboard.`);
        onLoginSuccess('member-dashboard');
      } else {
        success(`Welcome, ${res.user.name}! Opening Admin Console.`);
        onLoginSuccess('admin');
      }
    } else {
      error(res.error || 'Invalid credentials.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      error('Please fill in your name, email, and password to sign up.');
      return;
    }

    setLoading(true);
    const res = await signup({
      name: signupName.trim(),
      email: signupEmail.trim(),
      username: signupUsername.trim() || undefined,
      password: signupPassword,
      specialization: signupSpecialization,
    });
    setLoading(false);

    if (res.success && res.user) {
      const assignedUsername = res.user.username || previewUsername;
      setPendingSubmittedUser({
        name: res.user.name,
        username: assignedUsername,
        email: res.user.email,
      });
      setIdentifier(assignedUsername);
      setPassword(signupPassword);
      setSignupName('');
      setSignupEmail('');
      setSignupUsername('');
      info(
        `Join Request submitted for ${res.user.name} (${assignedUsername})! Your account is Pending Admin Approval.`
      );
    } else {
      error(res.error || 'Failed to submit Join Request.');
    }
  };

  const handleQuickMemberFill = (uname: string) => {
    setIdentifier(uname);
    setPassword('123456');
    info(`Filled username ${uname} with default password 123456`);
  };

  const handleQuickDemoOfficer = (role: UserRole) => {
    switchDemoRole(role);
    const target = pendingRequestsCount > 0 ? 'admin/join-requests' : 'admin';
    success(`Signed in as ${role}! Opening Admin Console.`);
    onLoginSuccess(target);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#120520]/95 backdrop-blur-2xl relative overflow-hidden text-slate-100">
      {/* Background Subtle Grid & Multi-Shade Purple Glow */}
      <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[380px] bg-purple-800/25 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[350px] bg-fuchsia-900/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Back to Home Page Link */}
      <button
        type="button"
        onClick={onNavigateHome}
        className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-purple-400/25 text-xs font-mono text-purple-200 hover:text-white hover:bg-purple-900/40 transition z-20"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home Page</span>
      </button>

      {/* Sign In / Sign Up Card */}
      <div className="w-full max-w-md rounded-3xl glass-panel border border-purple-400/25 p-6 sm:p-8 shadow-2xl bg-[#19072c]/90 backdrop-blur-xl relative z-10 animate-fade-in my-10">
        
        {/* Pending Action Context Notice */}
        {pendingActionLabel && (
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-violet-950/70 to-fuchsia-950/80 border border-purple-400/35 flex items-start gap-3 shadow-inner">
            <div className="p-2 rounded-xl bg-purple-600/30 border border-purple-400/40 text-purple-200 shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-semibold">
                Sign In or Sign Up Required
              </div>
              <div className="text-xs text-white font-medium mt-0.5">
                Authenticate to continue to:{' '}
                <span className="text-purple-200 font-bold underline decoration-purple-400/60 underline-offset-2">
                  {pendingActionLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Logo & Header */}
        <div className="text-center mb-5 flex flex-col items-center">
          <ClubLogo size="md" showSubtitle={false} className="mb-2.5" />
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {activeTab === 'signup' ? 'Create Member Account' : 'Sign In / Sign Up'}
          </h2>
          <p className="text-xs text-purple-300/80 mt-1 font-mono">
            AI/ML Club • Engineering College, Ajmer
          </p>
        </div>

        {/* 3-Way Selector Tabs: Sign In | Sign Up | Admin */}
        <div className="grid grid-cols-3 p-1 rounded-xl bg-[#0e0419] border border-purple-400/20 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('member')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'member'
                ? 'bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* TAB 1 & TAB 3: SIGN IN (Member or Admin) */}
        {activeTab !== 'signup' ? (
          <>
            {/* Quick Access Badges */}
            {activeTab === 'member' ? (
              <div className="mb-5 p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs">
                <div className="text-[11px] font-mono text-purple-300 font-semibold mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Quick Test Member Credentials (Click to fill):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {memberProfiles.slice(0, 6).map((p) => {
                    const u = p.username || `#${p.name.toLowerCase().replace(/[^a-z0-9]/g, '')}123`;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleQuickMemberFill(u)}
                        className="px-2.5 py-1 rounded-lg bg-[#0e0419] border border-purple-700/60 hover:border-purple-400 text-purple-200 font-mono text-[11px] transition flex items-center gap-1"
                        title={`Click to fill ${u} (Password: 123456)`}
                      >
                        <span>{u}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="text-[10px] text-slate-400 mt-1.5 font-mono">
                  Default password for all members: <strong className="text-white">123456</strong>
                </div>
              </div>
            ) : (
              <div className="mb-5 p-3 rounded-xl bg-[#0e0419] border border-purple-400/20 text-xs">
                <div className="text-[11px] font-mono text-purple-200 font-medium mb-1.5">
                  One-Click Executive Demo Access:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoOfficer('Admin')}
                    className="py-1.5 px-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-mono font-medium transition text-center"
                  >
                    Admin (#shreyansh123)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoOfficer('Vice President')}
                    className="py-1.5 px-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 text-xs font-mono font-medium transition text-center"
                  >
                    Vice President (#sahil123)
                  </button>
                </div>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  {activeTab === 'member' ? 'Member Username (#name123) or Email' : 'Officer Username (#shreyansh123) or Email'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={activeTab === 'member' ? 'e.g. #kuldeep123 or #dharmesh123' : 'e.g. #shreyansh123 or admin@aimlclub.edu'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e0419] border border-white/10 focus:border-purple-500 text-white text-xs font-mono focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Password {activeTab === 'member' && <span className="text-purple-400 text-[10px]">(Default: 123456)</span>}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e0419] border border-white/10 focus:border-purple-500 text-white text-xs font-mono focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#0e0419] border-white/10 text-purple-600 focus:ring-0"
                  />
                  <span>Remember Session</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotPasswordMsg(!forgotPasswordMsg)}
                  className="text-purple-400 hover:text-purple-300 transition text-[11px]"
                >
                  Credentials Help?
                </button>
              </div>

              {forgotPasswordMsg && (
                <div className="p-3 rounded-xl bg-[#0e0419] border border-white/10 text-xs text-slate-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    Default password is <strong className="text-white font-mono">123456</strong> and usernames follow <strong className="text-purple-300 font-mono">#&lt;name&gt;123</strong>. Or click the <strong className="text-purple-300">Sign Up</strong> tab above to register a new account immediately.
                  </span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:via-purple-500 hover:to-fuchsia-500 text-white font-medium text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-600/25"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>
                        {pendingActionLabel && !isDirectLoginAction
                          ? 'Sign In & Continue'
                          : activeTab === 'member'
                          ? 'Sign In to Member Portal'
                          : 'Authenticate Admin Access'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400">
                New to the AI/ML Club?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-purple-300 hover:text-white font-semibold underline underline-offset-2 transition"
                >
                  Create an account (Sign Up)
                </button>
              </p>
            </div>
          </>
        ) : (
          /* TAB 2: SIGN UP (Create New Member Account - Pending Approval) */
          <>
            {pendingSubmittedUser && (
              <div className="mb-5 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    Status: Pending Approval
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-200 border border-amber-400/30">
                    {pendingSubmittedUser.username}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  Join request for <strong className="text-white">{pendingSubmittedUser.name}</strong> (<span className="font-mono text-purple-300">{pendingSubmittedUser.username}</span>) has been submitted! Your account remains <strong className="text-amber-300">Pending Approval</strong> until an administrator approves it in the <strong className="text-purple-300">Admin Panel → Join Requests</strong> section.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('member')}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 font-mono text-[11px] transition"
                  >
                    Go to Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin')}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-300 font-mono text-[11px] transition"
                  >
                    Admin Portal (Approve)
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e0419] border border-white/10 focus:border-purple-500 text-white text-xs focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  College / Personal Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. rohan@ecajmer.ac.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e0419] border border-white/10 focus:border-purple-500 text-white text-xs font-mono focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    Club Username <span className="text-purple-400 text-[10px]">({previewUsername})</span>
                  </label>
                  <input
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder={previewUsername}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0419] border border-white/10 focus:border-purple-500 text-purple-200 text-xs font-mono focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    AI Specialization
                  </label>
                  <div className="relative">
                    <Cpu className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={signupSpecialization}
                      onChange={(e) => setSignupSpecialization(e.target.value)}
                      placeholder="Deep Learning & LLMs"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#0e0419] border border-white/10 focus:border-purple-500 text-white text-xs focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Password * <span className="text-purple-400 text-[10px]">(Default: 123456)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e0419] border border-white/10 focus:border-purple-500 text-white text-xs font-mono focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:via-purple-500 hover:to-fuchsia-500 text-white font-medium text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-600/25"
                >
                  {loading ? (
                    <span>Submitting Join Request...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Submit Join Request (Sign Up)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400">
                Already have an approved account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('member')}
                  className="text-purple-300 hover:text-white font-semibold underline underline-offset-2 transition"
                >
                  Sign In here
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
