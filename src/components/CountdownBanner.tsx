import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Bell } from 'lucide-react';
import { Workshop } from '../types';

interface CountdownBannerProps {
  workshop: Workshop | null;
  onRegisterClick: (workshop: Workshop) => void;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  workshop,
  onRegisterClick,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 12, hours: 8, minutes: 45, seconds: 20 });

  useEffect(() => {
    if (!workshop) return;
    const targetDate = new Date(`${workshop.date}T15:00:00Z`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [workshop]);

  if (!workshop) return null;

  return (
    <div className="w-full bg-dark-surface/90 border-y border-white/10 py-3 px-4 relative overflow-hidden backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        {/* Left */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400 shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-800">
                Next Event
              </span>
              <span className="font-medium text-white truncate max-w-xs md:max-w-md">
                {workshop.name}
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {workshop.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {workshop.time}
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-center">
            <div className="bg-dark-card border border-white/10 px-2 py-1 rounded">
              <span className="text-xs font-semibold text-white">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] block text-slate-500">DAYS</span>
            </div>
            <span className="text-slate-500 font-bold">:</span>
            <div className="bg-dark-card border border-white/10 px-2 py-1 rounded">
              <span className="text-xs font-semibold text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] block text-slate-500">HRS</span>
            </div>
            <span className="text-slate-500 font-bold">:</span>
            <div className="bg-dark-card border border-white/10 px-2 py-1 rounded">
              <span className="text-xs font-semibold text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] block text-slate-500">MIN</span>
            </div>
            <span className="text-slate-500 font-bold">:</span>
            <div className="bg-dark-card border border-white/10 px-2 py-1 rounded">
              <span className="text-xs font-semibold text-purple-400">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] block text-slate-500">SEC</span>
            </div>
          </div>

          <button
            onClick={() => onRegisterClick(workshop)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-medium text-xs transition-all duration-150 shadow-sm whitespace-nowrap btn-tactile group"
          >
            <span>Register Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
