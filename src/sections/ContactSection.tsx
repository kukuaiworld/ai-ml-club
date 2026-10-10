import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Send, 
  MessageSquare, 
  CheckCircle2
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '../components/SocialIcons';
import { dataStore } from '../services/dataStore';
import { useToast } from '../context/ToastContext';

export const ContactSection: React.FC = () => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      error('Please complete all fields in the contact form.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      dataStore.submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setIsSubmitting(false);
      setSubmitted(true);
      success('Your message has been transmitted to club leads!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                Connect With Us
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Get in <span className="text-purple-400">Touch</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                Have a collaboration proposal, guest speaker inquiry, or project sponsorship? Drop our executive team a message.
              </p>
            </div>

            {/* Institution & Lab Location Card */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-5 bg-dark-card">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-0.5">
                    Campus Location
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Engineering College, Ajmer
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Department of Computer Science & Engineering<br />
                    NH-8, Barliya Circle, Ajmer, Rajasthan 305025
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-0.5">
                    Official Inquiries
                  </div>
                  <a
                    href="mailto:aimlclub@ecajmer.ac.in"
                    className="text-sm font-semibold text-white hover:text-purple-300 transition"
                  >
                    aimlclub@ecajmer.ac.in
                  </a>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Replies dispatched within 24-48 hours.
                  </div>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3">
                Club Social Channels
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-surface/60 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white transition text-xs font-mono"
                >
                  <GithubIcon className="w-4 h-4 text-cyan-400" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-surface/60 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white transition text-xs font-mono"
                >
                  <LinkedinIcon className="w-4 h-4 text-cyan-400" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-surface/60 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white transition text-xs font-mono"
                >
                  <InstagramIcon className="w-4 h-4 text-cyan-400" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-cyan-500/20 shadow-2xl relative overflow-hidden bg-cyber-darker/90">
              <h3 className="text-2xl font-bold text-white mb-2">
                Send an Encrypted Dispatch
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                All communications are routed directly to the club executive database for triage.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-neon-cyan">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Transmission Successful</h4>
                  <p className="text-sm text-slate-300 max-w-sm mx-auto">
                    Thank you! Your dispatch has been recorded into the club database and will be reviewed shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-cyber-surface border border-slate-700 text-xs font-mono text-cyan-400 hover:text-white transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ada Lovelace"
                        className="w-full px-4 py-2.5 rounded-xl bg-cyber-black/70 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ada@computing.edu"
                        className="w-full px-4 py-2.5 rounded-xl bg-cyber-black/70 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Workshop Collaboration / Speaker Invite"
                      className="w-full px-4 py-2.5 rounded-xl bg-cyber-black/70 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detail your inquiry or initiative..."
                      className="w-full px-4 py-2.5 rounded-xl bg-cyber-black/70 border border-slate-800 focus:border-cyan-400 text-white text-sm focus:outline-none transition resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-subtle-purple flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Encrypting & Sending...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Transmit Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
