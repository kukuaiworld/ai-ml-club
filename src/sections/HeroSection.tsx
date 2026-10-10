import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onWorkshopsClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onWorkshopsClick,
}) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-36 sm:pt-44 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      {/* Multi-Shade Purple Hero Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[24rem] bg-gradient-to-tr from-purple-900/40 via-violet-700/25 to-fuchsia-800/30 rounded-full blur-[110px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Main Headline - Matches Logo Exact Typography & Multi-Shade Purple Styling */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 leading-none select-none flex items-center justify-center gap-0.5">
          <span>AI</span>
          <span className="bg-gradient-to-b from-purple-200 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent font-serif font-black px-1 text-5xl sm:text-6xl md:text-7xl drop-shadow-[0_0_16px_rgba(192,132,252,0.45)]">/</span>
          <span>ML</span>
          <span className="text-white ml-2.5">CLUB</span>
        </h1>

        {/* Subtitle */}
        <div className="text-lg sm:text-xl md:text-2xl font-mono font-medium tracking-wide text-slate-300 mb-6 flex items-center justify-center gap-3">
          <span>Learn.</span>
          <span className="text-purple-500/70">•</span>
          <span className="text-purple-200">Build.</span>
          <span className="text-purple-500/70">•</span>
          <span className="gradient-text-purple font-semibold">Innovate.</span>
        </div>

        {/* Supporting Text */}
        <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed mb-10 text-center font-normal">
          A community of students exploring Artificial Intelligence, Machine Learning and the technologies shaping the future. From neural foundations to autonomous agent architectures and robotics.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:via-purple-500 hover:to-fuchsia-500 text-white font-medium text-sm tracking-wide transition-all duration-200 shadow-[0_4px_24px_rgba(168,85,247,0.38)] hover:shadow-[0_6px_28px_rgba(192,38,211,0.45)] flex items-center justify-center gap-2 group active:scale-95 btn-tactile"
          >
            <span>Explore the Club</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onWorkshopsClick}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#240b38]/90 to-[#1a0729]/90 hover:from-[#31104b] hover:to-[#240b38] text-slate-200 hover:text-white border border-purple-400/25 hover:border-purple-400/50 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 btn-tactile"
          >
            <BookOpen className="w-4 h-4 text-purple-300 group-hover:text-purple-200" />
            <span>Upcoming Workshops</span>
          </button>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-center font-mono w-full">
          <div className="p-3 rounded-xl hover:bg-white/5 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              520+
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-sans">
              Active Members
            </div>
          </div>

          <div className="p-3 rounded-xl hover:bg-white/5 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold text-purple-400 tracking-tight">
              48+
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-sans">
              Workshops Held
            </div>
          </div>

          <div className="p-3 rounded-xl hover:bg-white/5 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold text-violet-300 tracking-tight">
              64+
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-sans">
              AI Projects Built
            </div>
          </div>

          <div className="p-3 rounded-xl hover:bg-white/5 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
              8x 4090
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-sans">
              GPU Cluster Pods
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
