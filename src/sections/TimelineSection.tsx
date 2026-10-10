import React from 'react';
import { Calendar, Milestone } from 'lucide-react';
import { TimelineEvent } from '../types';

interface TimelineSectionProps {
  timeline: TimelineEvent[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-dark-surface/30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
            <Milestone className="w-3.5 h-3.5 text-purple-400" />
            Academic Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Club <span className="text-purple-400">Timeline</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Key milestones, hackathons, and research residencies across the academic year.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l border-slate-700/60 ml-4 sm:ml-32 pl-6 sm:pl-10 space-y-10">
          {timeline.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-dark-bg border-2 border-purple-500 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              </div>

              {/* Term/Date Left Label */}
              <div className="hidden sm:block absolute -left-36 top-1 text-right w-24">
                <span className="text-xs font-mono font-medium text-slate-300 block">
                  {item.date}
                </span>
                {item.term && (
                  <span className="text-[10px] font-mono text-slate-500 block">
                    {item.term}
                  </span>
                )}
              </div>

              {/* Card */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-purple-400/50 transition-all duration-200 hover:-translate-y-1 bg-dark-card">
                <div className="sm:hidden flex items-center gap-2 text-xs font-mono text-purple-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-dark-surface text-slate-300 border border-white/10">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                  {item.event}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
