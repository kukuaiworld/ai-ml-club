import React, { useState, useEffect } from 'react';

interface LiveCountdownProps {
  targetDate: string;
}

export const LiveCountdown: React.FC<LiveCountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="flex justify-center items-center h-16 w-full rounded-xl bg-purple-500/10 border border-purple-500/30">
        <span className="text-purple-300 font-bold tracking-widest animate-pulse">LIVE NOW</span>
      </div>
    );
  }

  const pad = (num: number) => num.toString().padStart(2, '0');

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center p-2 min-w-[3rem] bg-dark-bg/60 rounded-lg border border-white/5 shadow-inner">
      <span className="text-xl md:text-2xl font-mono font-bold text-white">{pad(value)}</span>
      <span className="text-[9px] md:text-[10px] uppercase text-purple-300 font-semibold tracking-wider mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-3">Event Starts In</p>
      <div className="flex items-center gap-2">
        <Unit value={timeLeft.days} label="Days" />
        <span className="text-purple-500/50 font-bold">:</span>
        <Unit value={timeLeft.hours} label="Hours" />
        <span className="text-purple-500/50 font-bold">:</span>
        <Unit value={timeLeft.minutes} label="Mins" />
        <span className="text-purple-500/50 font-bold">:</span>
        <Unit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};
