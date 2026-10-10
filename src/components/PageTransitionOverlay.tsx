import React, { useEffect, useState, useRef } from 'react';
import { Cpu, Network, Sparkles, Activity, Layers } from 'lucide-react';

interface PageTransitionOverlayProps {
  currentTab: string;
}

const TAB_METADATA: Record<string, { label: string; sector: string; icon: React.ElementType }> = {
  home: { label: 'CENTRAL AI CORE', sector: 'NEURAL TOPOLOGY', icon: Network },
  about: { label: 'MISSION & DNA', sector: 'RESEARCH CHARTER', icon: Cpu },
  domains: { label: 'SPECIALIZED DIVISIONS', sector: 'FRONTIER DOMAINS', icon: Layers },
  lab: { label: 'INSIDE THE AI LAB', sector: 'NEURAL VISUALIZER', icon: Activity },
  activities: { label: 'CLUB ACTIVITIES', sector: 'CALENDAR & HACKATHONS', icon: Activity },
  workshops: { label: 'TECHNICAL WORKSHOPS', sector: 'HANDS-ON LABS', icon: Cpu },
  projects: { label: 'PROJECT SHOWCASE', sector: 'APPLIED AI REPOSITORIES', icon: Sparkles },
  resources: { label: 'CURATED ARCHIVE', sector: 'ARXIV & PAPERS', icon: Network },
  gallery: { label: 'VISUAL ARCHIVE', sector: 'MOMENTS & MILESTONES', icon: Layers },
  team: { label: 'RESEARCH LEADS', sector: 'EXECUTIVE COMMITTEE', icon: Network },
  contact: { label: 'COMMUNICATIONS GATEWAY', sector: 'OUTREACH & INQUIRY', icon: Cpu },
  login: { label: 'PORTAL AUTHENTICATION', sector: 'SECURITY GATEWAY', icon: Network },
  dashboard: { label: 'CLUBOS MANAGEMENT', sector: 'ADMIN CONSOLE', icon: Cpu },
};

export const PageTransitionOverlay: React.FC<PageTransitionOverlayProps> = ({ currentTab }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Avoid running transition on initial page mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsTransitioning(true);
    setTransitionKey((prev) => prev + 1);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 750);

    return () => clearTimeout(timer);
  }, [currentTab]);

  if (!isTransitioning) return null;

  const currentMeta = TAB_METADATA[currentTab] || {
    label: currentTab.toUpperCase(),
    sector: 'ROUTING COORDINATE',
    icon: Network,
  };
  const IconComponent = typeof currentMeta === 'object' && currentMeta.icon ? currentMeta.icon : Network;
  const labelText = typeof currentMeta === 'object' ? currentMeta.label : currentTab.toUpperCase();
  const sectorText = typeof currentMeta === 'object' ? currentMeta.sector : 'NEURAL BUS';

  return (
    <div 
      key={transitionKey} 
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Horizontal Fiber Optic Data Beam across Top Header */}
      <div className="absolute top-0 left-0 w-full h-[2.5px] overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-fiber-beam shadow-[0_0_12px_rgba(168,85,247,0.9)]" />
      </div>

      {/* 2. Neural Laser Scanline Sweeping Downwards */}
      <div className="absolute left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-neural-scan shadow-[0_0_15px_rgba(192,132,252,0.8)]" />

      {/* 3. Subtle Ambient Coordinate Flash */}
      <div className="absolute inset-0 bg-purple-500/[0.03] animate-pulse pointer-events-none" />

      {/* 4. Futuristic Neural Telemetry Pill (Top-Center) */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 animate-telemetry-pill">
        <div className="px-4 py-2 rounded-full bg-dark-card/95 border border-purple-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3">
          {/* Pulsing Status Core */}
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-purple-500 relative" />
          </div>

          <IconComponent className="w-4 h-4 text-purple-400 shrink-0" />

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">
              {sectorText}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-bold tracking-wide">
              {labelText}
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 pl-2 border-l border-white/10 text-[10px] font-mono text-emerald-400">
            <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
            <span>0.12ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
