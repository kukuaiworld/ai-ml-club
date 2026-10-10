import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Navbar } from '../Navbar';
import { dataStore } from '../../services/dataStore';

interface PublicHeaderProps {
  currentTab: string;
  onNavigate: (tabId: string) => void;
  onOpenSearch: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
}) => {
  const settings = dataStore.getSettings();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200 ${
        isScrolled 
          ? 'bg-gradient-to-r from-[#1a062d]/95 via-[#120420]/95 to-[#23073a]/95 backdrop-blur-md border-b border-purple-400/15 shadow-lg shadow-black/50' 
          : 'bg-gradient-to-r from-[#1a062d]/55 via-[#120420]/50 to-[#23073a]/55 backdrop-blur-sm border-b border-purple-400/10'
      }`}
    >
      {/* Top Telemetry / Announcement Bar */}
      {settings.announcementActive && (
        <div className="bg-gradient-to-r from-purple-950/95 via-[#1c0f2e]/95 to-purple-950/95 border-b border-purple-500/20 text-slate-200 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-[10px] font-mono text-purple-300 uppercase tracking-wider shrink-0">
                <Sparkles className="w-2.5 h-2.5" />
                Notice
              </span>
              <span className="truncate text-slate-300 text-xs font-sans">
                {settings.announcementText || 'Fall 2026 Induction & NeurAI Hackathon Registrations Open!'}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-4 shrink-0 text-[11px] font-mono">
              <span className="text-purple-400/90 hidden md:inline">
                {settings.institution}
              </span>
              <button
                onClick={() => onNavigate('workshops')}
                className="flex items-center gap-1 text-purple-300 hover:text-white transition font-medium group active:scale-95"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar integrated inside the Public Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={onNavigate}
        onOpenSearch={onOpenSearch}
      />
    </header>
  );
};
