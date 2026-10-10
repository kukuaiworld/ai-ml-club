import React from 'react';
import { AlertTriangle, ArrowLeft, BrainCircuit, RefreshCw } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden bg-cyber-black text-center">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto p-8 rounded-3xl glass-panel border border-rose-500/30 bg-cyber-darker/90 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
          <BrainCircuit className="w-8 h-8 animate-pulse" />
        </div>

        <div className="text-5xl font-black font-mono text-white mb-2 tracking-wider">
          404<span className="text-rose-400">_ERR</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          Neural Connection Terminated
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed font-mono mb-6">
          The requested coordinate or tensor address could not be resolved in the club neural topology.
        </p>

        <button
          onClick={onGoHome}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-neon-cyan flex items-center justify-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Re-route to Central AI Core</span>
        </button>
      </div>
    </div>
  );
};
