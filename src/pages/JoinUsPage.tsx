import React, { useState } from 'react';
import { ShieldCheck, Send, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataStore } from '../services/dataStore';

interface JoinUsPageProps {
  onNavigateHome: () => void;
}

export const JoinUsPage: React.FC<JoinUsPageProps> = ({ onNavigateHome }) => {
  const { user } = useAuth();
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [whyJoin, setWhyJoin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const application = user ? dataStore.getApplicationByUserId(user.id) : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!githubUrl || !whyJoin) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);
    
    try {
      dataStore.submitApplication({
        user_id: user.id,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        why_join: whyJoin
      });
      // The component will re-render automatically since dataStore change triggers App.tsx to reload
      // But we can also force a state refresh if needed, though App.tsx's subscribe should catch it if we expose it
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center">
        <div className="text-center text-slate-400">Please log in to view this page.</div>
      </div>
    );
  }

  if (user.role !== 'Registered User') {
    return (
      <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">You're already a member!</h2>
          <p className="text-slate-400 mb-6">Your current role is {user.role}. You have full access to club features.</p>
          <button
            onClick={onNavigateHome}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-medium"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (application) {
    return (
      <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center">
        <div className="max-w-md w-full glass-panel border border-white/10 rounded-2xl p-8 text-center animate-fade-in">
          {application.status === 'Pending' ? (
            <>
              <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Application Under Review</h2>
              <p className="text-slate-400 mb-6">
                Your application to join the AI/ML Club has been received. Our team will review your details and get back to you soon.
              </p>
              <div className="bg-dark-bg/50 rounded-xl p-4 text-left border border-white/5">
                <div className="text-sm font-mono text-slate-500 mb-1">Status</div>
                <div className="text-blue-400 font-medium">Pending Review</div>
                <div className="text-sm font-mono text-slate-500 mt-3 mb-1">Submitted On</div>
                <div className="text-slate-300">{new Date(application.submitted_at).toLocaleDateString()}</div>
              </div>
            </>
          ) : application.status === 'Accepted' ? (
            <>
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to the Club!</h2>
              <p className="text-slate-400 mb-6">
                Your application has been accepted. Please refresh the page or log out and log back in to access member features.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Application Status Update</h2>
              <p className="text-slate-400 mb-6">
                Unfortunately, your application was not accepted at this time.
              </p>
              {application.rejection_message && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-left text-red-200 text-sm mb-6">
                  {application.rejection_message}
                </div>
              )}
            </>
          )}
          
          <button
            onClick={onNavigateHome}
            className="mt-6 w-full px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium border border-white/10 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">Join AI/ML Club</h1>
          <p className="text-slate-400 text-lg">
            Submit your application to become an official member of the club. Access exclusive resources, workshops, and community events.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GitHub Profile URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                LinkedIn Profile URL (Optional)
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Why do you want to join? <span className="text-red-400">*</span>
              </label>
              <textarea
                value={whyJoin}
                onChange={(e) => setWhyJoin(e.target.value)}
                placeholder="Tell us about your interest in AI/ML and what you hope to achieve..."
                rows={4}
                className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
