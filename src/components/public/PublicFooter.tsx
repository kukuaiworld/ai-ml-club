import React from 'react';
import { 
  Mail, 
  MapPin, 
  Cpu,
  ArrowUp
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '../SocialIcons';
import { ClubLogo } from '../ClubLogo';
import { dataStore } from '../../services/dataStore';

interface PublicFooterProps {
  onNavigate: (tabId: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  const settings = dataStore.getSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#1b072e] via-[#130521] to-[#0e0318] border-t border-purple-400/15 pt-16 pb-12 overflow-hidden mt-auto select-none">
      {/* Subtle Multi-Shade Purple Footer Glow */}
      <div className="absolute -top-24 left-1/4 w-96 h-48 bg-purple-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-fuchsia-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Club Info */}
          <div className="lg:col-span-2">
            <div 
              onClick={() => onNavigate('home')}
              className="cursor-pointer group mb-4 hover:opacity-90 active:scale-95 transition-all duration-150 inline-block"
              title="AI/ML Club Home"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('home'); }}
            >
              <ClubLogo size="md" />
            </div>

            <p className="text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">
              Official student AI research and engineering community at Engineering College, Ajmer. Empowering students in deep learning, neural architectures, and intelligent robotic systems.
            </p>

            <div className="flex items-center gap-2.5 text-slate-400">
              <a
                href={settings.githubUrl || 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-card border border-white/10 hover:border-purple-400/60 hover:text-white hover:bg-purple-950/50 hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(168,85,247,0.3)] active:scale-90 transition-all duration-200 flex items-center justify-center"
                title="Official GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={settings.linkedinUrl || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-card border border-white/10 hover:border-purple-400/60 hover:text-white hover:bg-purple-950/50 hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(168,85,247,0.3)] active:scale-90 transition-all duration-200 flex items-center justify-center"
                title="LinkedIn Page"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={settings.instagramUrl || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-card border border-white/10 hover:border-purple-400/60 hover:text-white hover:bg-purple-950/50 hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(168,85,247,0.3)] active:scale-90 transition-all duration-200 flex items-center justify-center"
                title="Instagram Handle"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.contactEmail || 'aimlclub@ecajmer.ac.in'}`}
                className="w-9 h-9 rounded-xl bg-dark-card border border-white/10 hover:border-purple-400/60 hover:text-white hover:bg-purple-950/50 hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(168,85,247,0.3)] active:scale-90 transition-all duration-200 flex items-center justify-center"
                title="Contact Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-4 font-semibold">
              Explore Pages
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              {[
                { label: 'Home', id: 'home' },
                { label: 'About Club', id: 'about' },
                { label: 'Activities', id: 'activities' },
                { label: 'Workshops', id: 'workshops' },
                { label: 'Projects', id: 'projects' },
                { label: 'Team Leadership', id: 'team' },
                { label: 'Resources & Docs', id: 'resources' },
                { label: 'Event Gallery', id: 'gallery' },
                { label: 'AI Virtual Lab', id: 'lab' },
                { label: 'Contact Us', id: 'contact' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-purple-300 hover:translate-x-1 active:scale-95 transition-all duration-150 flex items-center gap-1 text-left"
                  >
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Research Divisions */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-4 font-semibold">
              AI Divisions
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              {[
                'Generative AI & LLMs',
                'Computer Vision',
                'Deep Learning',
                'Autonomous Agents',
                'Robotics & Control',
                'Responsible AI'
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onNavigate('projects')}
                    className="hover:text-purple-300 hover:translate-x-1 active:scale-95 transition-all duration-150 text-left flex items-center gap-1.5"
                  >
                    <span>{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Campus & Lab Contact */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-4 font-semibold">
              Laboratory & Campus
            </h4>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed font-mono">
              <a
                href="https://maps.google.com/?q=Engineering+College+Ajmer+NH-8+Barliya+Circle+Ajmer"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 hover:text-purple-300 transition-colors group"
                title="View on Google Maps"
              >
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>
                  Department of Computer Science & Engg.<br />
                  Engineering College, Ajmer<br />
                  NH-8, Barliya Circle, Ajmer, Rajasthan 305025
                </span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a 
                  href={`mailto:${settings.contactEmail || 'aimlclub@ecajmer.ac.in'}`} 
                  className="hover:text-purple-300 hover:underline transition-colors"
                >
                  {settings.contactEmail || 'aimlclub@ecajmer.ac.in'}
                </a>
              </div>
              <button
                onClick={() => onNavigate('lab')}
                className="flex items-center gap-2 text-left hover:text-purple-200 transition-colors group active:scale-95"
                title="Open AI Virtual Lab"
              >
                <Cpu className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-purple-300 font-semibold">{settings.clusterStatusText || 'Cluster: 8x RTX 4090 Online'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            © {new Date().getFullYear()} AI/ML Club, {settings.institution}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('admin')} 
              className="text-purple-400 hover:text-purple-300 hover:underline active:scale-95 transition-all"
            >
              Admin Portal
            </button>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-950/50 text-slate-300 hover:text-white border border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-900/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-sm"
              title="Smooth Scroll to Top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-purple-400 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
