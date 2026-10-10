import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight
} from 'lucide-react';
import { Workshop, WorkshopStatus } from '../types';

interface WorkshopsSectionProps {
  workshops: Workshop[];
  onRegisterClick: (workshop: Workshop) => void;
  isFullPage?: boolean;
}

export const WorkshopsSection: React.FC<WorkshopsSectionProps> = ({
  workshops,
  onRegisterClick,
  isFullPage = false,
}) => {
  const [activeTab, setActiveTab] = useState<WorkshopStatus | 'All'>('Upcoming');

  const filtered = workshops.filter((w) => {
    if (activeTab === 'All') return true;
    return w.status === activeTab;
  });

  const displayList = isFullPage ? filtered : filtered.slice(0, 6);

  return (
    <section id="workshops" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
              <Wrench className="w-3.5 h-3.5 text-purple-400" />
              Technical Training
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Hands-On <span className="text-purple-400">Workshops</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              Led by core researchers and industry practitioners. Practical deep learning code, CUDA optimizations, and stateful agent swarms.
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-dark-card rounded-xl border border-white/10 self-start md:self-auto">
            {(['Upcoming', 'Ongoing', 'Past', 'All'] as (WorkshopStatus | 'All')[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab} {tab !== 'All' && 'Workshops'}
              </button>
            ))}
          </div>
        </div>

        {/* Workshops Grid */}
        {displayList.length === 0 ? (
          <div className="text-center py-16 rounded-2xl glass-panel border border-white/10 text-slate-400">
            No workshops currently categorized under {activeTab}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayList.map((workshop) => {
              const seatsLeft = Math.max(0, workshop.max_participants - workshop.registered_count);
              const isFull = seatsLeft === 0;

              return (
                <div
                  key={workshop.id}
                  className="group rounded-2xl glass-panel border border-white/10 hover:border-purple-400/50 transition-all duration-200 overflow-hidden flex flex-col justify-between hover:shadow-card hover:-translate-y-1 bg-dark-card"
                >
                  {/* Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-dark-bg">
                    <img
                      src={workshop.banner_image}
                      alt={workshop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-90" />

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-dark-bg/90 text-slate-200 border border-white/10 backdrop-blur-md">
                        {workshop.topic}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          workshop.status === 'Upcoming'
                            ? 'bg-purple-950/80 text-purple-400 border border-purple-800'
                            : workshop.status === 'Ongoing'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : 'bg-dark-bg text-slate-400 border border-white/10'
                        }`}
                      >
                        {workshop.status}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                        {workshop.name}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                        {workshop.description}
                      </p>

                      {/* Instructor Info */}
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-surface border border-white/5 mb-4">
                        {workshop.speaker_avatar ? (
                          <img
                            src={workshop.speaker_avatar}
                            alt={workshop.speaker}
                            className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center font-bold text-purple-400 text-xs shrink-0">
                            {workshop.speaker.charAt(0)}
                          </div>
                        )}
                        <div className="truncate">
                          <div className="text-xs font-semibold text-white truncate">
                            {workshop.speaker}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate font-mono">
                            {workshop.speaker_bio || 'Instructor'}
                          </div>
                        </div>
                      </div>

                      {/* Schedule & Venue */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{workshop.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{workshop.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{workshop.venue}</span>
                        </div>
                      </div>

                      {/* Seat Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            Registered Seats:
                          </span>
                          <span className={isFull ? 'text-red-400 font-bold' : 'text-slate-300 font-medium'}>
                            {workshop.registered_count} / {workshop.max_participants}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-dark-surface rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isFull ? 'bg-red-500' : 'bg-purple-600'
                            }`}
                            style={{
                              width: `${Math.min(100, (workshop.registered_count / workshop.max_participants) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {workshop.status === 'Past' ? (
                        <div className="w-full py-2.5 rounded-xl bg-dark-surface border border-white/5 text-slate-400 text-center font-mono text-xs">
                          Archived in Resources
                        </div>
                      ) : (
                        <button
                          onClick={() => onRegisterClick(workshop)}
                          disabled={!workshop.registration_open || isFull}
                          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed group/btn"
                        >
                          {isFull ? (
                            <span>Registration Full</span>
                          ) : !workshop.registration_open ? (
                            <span>Registration Closed</span>
                          ) : (
                            <>
                              <span>Register for Workshop</span>
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
