import React, { useState, useEffect } from 'react';
import { Trophy, Users, Wrench, FolderGit2, Flag, Award } from 'lucide-react';
import { AchievementStats } from '../types';
import { MemberAchievementsSection } from '../components/MemberAchievementsSection';

interface AchievementsSectionProps {
  stats: AchievementStats;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ stats }) => {
  const [counts, setCounts] = useState({
    members: 0,
    workshops: 0,
    projects: 0,
    hackathons: 0,
    competitions: 0,
  });

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts({
        members: Math.floor(ease * stats.members_count),
        workshops: Math.floor(ease * stats.workshops_count),
        projects: Math.floor(ease * stats.projects_count),
        hackathons: Math.floor(ease * stats.hackathons_count),
        competitions: Math.floor(ease * stats.competitions_won_count),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [stats]);

  const items = [
    {
      label: 'Club Members',
      val: counts.members,
      suffix: '+',
      icon: Users,
      description: 'Active student researchers & engineers',
    },
    {
      label: 'Workshops Conducted',
      val: counts.workshops,
      suffix: '+',
      icon: Wrench,
      description: 'Hands-on technical curriculum sessions',
    },
    {
      label: 'AI Projects Built',
      val: counts.projects,
      suffix: '+',
      icon: FolderGit2,
      description: 'Open-source research & deployed models',
    },
    {
      label: 'Hackathons Participated',
      val: counts.hackathons,
      suffix: '+',
      icon: Flag,
      description: 'National & collegiate AI challenges',
    },
    {
      label: 'Competitions Won',
      val: counts.competitions,
      suffix: '+',
      icon: Trophy,
      description: 'Championship finishes & awards',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/40">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-2xl glass-panel border border-white/10 p-8 sm:p-12 relative overflow-hidden bg-dark-card">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              Impact Metrics
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Our <span className="text-purple-400">Achievements</span>
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Measurable milestones representing student dedication, compute hours, and technical deployments.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className={`text-center p-5 rounded-xl bg-dark-surface border border-white/5 hover:border-purple-400/50 transition-all ${
                    i === 4 ? 'col-span-2 md:col-span-1' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-dark-bg border border-white/10 mx-auto mb-3 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>

                  <div className="text-3xl sm:text-4xl font-bold font-mono text-white mb-1 tracking-tight">
                    {item.val}
                    <span className="text-purple-400">{item.suffix}</span>
                  </div>

                  <div className="text-xs font-semibold text-slate-200 mb-1">
                    {item.label}
                  </div>

                  <div className="text-[11px] text-slate-400 leading-tight">
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Members-Only Achievements Section (Renders only when authenticated) */}
        <MemberAchievementsSection />
      </div>
    </section>
  );
};
