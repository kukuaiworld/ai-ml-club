import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  GraduationCap,
  Pin,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { CourseNotice } from '../types';

interface VisitorNoticeSectionProps {
  notices: CourseNotice[];
  onActionClick?: (notice: CourseNotice) => void;
}

export const VisitorNoticeSection: React.FC<VisitorNoticeSectionProps> = ({
  notices,
  onActionClick,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  const domains = ['All', ...Array.from(new Set(notices.map((n) => n.domain)))];

  const filteredNotices =
    selectedDomain === 'All'
      ? notices
      : notices.filter((n) => n.domain === selectedDomain);

  const getStatusBadgeStyle = (status: CourseNotice['status']) => {
    switch (status) {
      case 'Registrations Open':
        return 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300';
      case 'Starting Soon':
        return 'bg-amber-950/70 border-amber-500/40 text-amber-300';
      case 'Ongoing':
        return 'bg-blue-950/70 border-blue-500/40 text-blue-300';
      default:
        return 'bg-purple-950/70 border-purple-500/40 text-purple-300';
    }
  };

  return (
    <section
      id="visitor-notices"
      className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative"
    >
      {/* Section Header & Domain Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Bell className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Visitor Notice Board • Upcoming Courses</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Scheduled <span className="gradient-text-purple">AI/ML Course Cohorts</span>
          </h2>
          <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
            Filter by AI/ML domain to explore upcoming instructor-led courses, bootcamps, and study tracks open to visitors and students.
          </p>
        </div>

        {/* Domain Filter Pills */}
        {domains.length > 2 && (
          <div className="flex flex-wrap items-center gap-2">
            {domains.map((dom) => {
              const active = selectedDomain === dom;
              return (
                <button
                  key={dom}
                  data-allow-visitor="true"
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    active
                      ? 'bg-purple-600 text-white shadow-[0_0_16px_rgba(168,85,247,0.35)] border border-purple-400/50'
                      : 'bg-dark-card border border-white/10 text-slate-300 hover:text-white hover:border-purple-400/40'
                  }`}
                >
                  {dom}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Notices Grid */}
      {filteredNotices.length === 0 ? (
        <div className="rounded-2xl glass-panel border border-white/10 p-12 text-center">
          <BookOpen className="w-10 h-10 text-purple-400 mx-auto mb-3 opacity-80" />
          <h3 className="text-lg font-bold text-white mb-1">
            No Upcoming Course Notices Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Check back soon for new AI/ML course announcements and training cohorts from the club administration.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => onActionClick && onActionClick(notice)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onActionClick) onActionClick(notice);
              }}
              className={`group cursor-pointer rounded-2xl glass-panel border transition-all duration-200 hover:-translate-y-1 active:scale-[0.99] p-6 flex flex-col justify-between relative overflow-hidden ${
                notice.pinned
                  ? 'border-purple-400/45 shadow-[0_8px_30px_rgba(168,85,247,0.16)]'
                  : 'border-white/10 hover:border-purple-400/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]'
              }`}
            >
              <div>
                {/* Top Badges Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.pinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-fuchsia-950/80 border border-fuchsia-500/40 text-fuchsia-300 font-semibold">
                        <Pin className="w-2.5 h-2.5" />
                        Pinned Notice
                      </span>
                    )}
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300">
                      {notice.domain}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-dark-card border border-white/10 text-slate-300">
                      <GraduationCap className="w-3 h-3 text-purple-400" />
                      {notice.level}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-semibold ${getStatusBadgeStyle(
                      notice.status
                    )}`}
                  >
                    {notice.status}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-2 leading-snug">
                  {notice.title}
                </h3>

                {/* Course Notice Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                  {notice.description}
                </p>

                {/* Course Schedule & Telemetry Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-dark-card/70 border border-white/5 text-xs mb-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="font-mono text-[11px] text-slate-400">Starts:</span>
                    <span className="font-semibold text-white truncate">{notice.start_date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="font-mono text-[11px] text-slate-400">Duration:</span>
                    <span className="font-semibold text-white truncate">{notice.duration}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="font-mono text-[11px] text-slate-400">Mentor:</span>
                    <span className="text-slate-200 truncate" title={notice.instructor}>
                      {notice.instructor}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="font-mono text-[11px] text-slate-400">Mode:</span>
                    <span className="text-slate-200 truncate" title={notice.mode}>
                      {notice.mode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Open for Visitors & Students</span>
                </span>

                <span className="text-purple-400 group-hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors">
                  <span>Enroll / Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
