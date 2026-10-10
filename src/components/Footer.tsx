import React from 'react';
import { 
  Terminal, 
  Mail, 
  MapPin, 
  Cpu,
  ArrowUp
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons';
import { ClubLogo } from './ClubLogo';

interface FooterProps {
  onNavigate: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-dark-surface border-t border-white/10 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Club Info */}
          <div className="lg:col-span-2">
            <div 
              onClick={() => onNavigate('home')}
              className="cursor-pointer group mb-4 hover:opacity-90 transition-opacity"
            >
              <ClubLogo size="md" />
            </div>

            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              Official student AI research and engineering community at Engineering College, Ajmer. Empowering students in deep learning, neural architectures, and intelligent robotic systems.
            </p>

            <div className="flex items-center gap-2.5 text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-card border border-white/10 hover:border-white/20 hover:text-white flex items-center justify-center transition"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-card border border-white/10 hover:border-white/20 hover:text-white flex items-center justify-center transition"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-card border border-white/10 hover:border-white/20 hover:text-white flex items-center justify-center transition"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@aimlclub.edu"
                className="w-8 h-8 rounded-lg bg-dark-card border border-white/10 hover:border-white/20 hover:text-white flex items-center justify-center transition"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-4 font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {['Home', 'About', 'Notices', 'Activities', 'Workshops', 'Projects', 'Team'].map((item) => (
                <li key={item}>
                  <button
                    data-allow-visitor={item === 'Notices' || item === 'Home' ? 'true' : undefined}
                    onClick={() => onNavigate(item.toLowerCase())}
                    className="hover:text-white transition"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Research Divisions */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-4 font-semibold">
              Divisions
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {['Generative AI & LLMs', 'Computer Vision', 'Deep Learning', 'Autonomous Agents', 'Robotics & Control', 'Responsible AI'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onNavigate('domains')}
                    className="hover:text-white transition"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Campus & Lab Contact */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-4 font-semibold">
              Laboratory
            </h4>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed font-mono">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  Department of Computer Science & Engg.<br />
                  Engineering College, Ajmer<br />
                  NH-8, Barliya Circle, Ajmer, Rajasthan 305025
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a href="mailto:aimlclub@ecajmer.ac.in" className="hover:text-white underline">
                  aimlclub@ecajmer.ac.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400">Cluster: 8x RTX 4090 Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} AI/ML Club, Engineering College, Ajmer. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Governance</span>
            <span className="hover:text-slate-300 cursor-pointer">Ethics Code</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-dark-card text-slate-400 hover:text-white border border-white/10 transition"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
