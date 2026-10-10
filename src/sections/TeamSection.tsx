import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { TeamMember } from '../types';

interface TeamSectionProps {
  team: TeamMember[];
  isFullPage?: boolean;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team, isFullPage = false }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const hierarchyGroups = ['All', 'Leadership', 'Leads', 'Core Members'];

  const filtered = team.filter((m) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Leadership') {
      return m.position === 'President' || m.position === 'Vice President' || m.position === 'Secretary';
    }
    if (selectedFilter === 'Leads') {
      return m.position.includes('Lead') || m.position === 'Web Master' || m.position === 'Treasurer';
    }
    if (selectedFilter === 'Core Members') {
      return m.position === 'Core Member' || m.position === 'Member';
    }
    return true;
  });

  const displayList = filtered;

  return (
    <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/40">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Users className="w-3.5 h-3.5" />
              People & Governance
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Club <span className="gradient-text-purple">Leadership & Team</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              Meet the student executives, technical leads, and members driving technical excellence in the club at Engineering College, Ajmer.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-dark-card rounded-xl border border-white/10">
            {hierarchyGroups.map((grp) => (
              <button
                key={grp}
                onClick={() => setSelectedFilter(grp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedFilter === grp
                    ? 'bg-purple-600/25 text-purple-300 border border-purple-500/50 shadow-subtle-purple'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayList.map((member) => (
            <div
              key={member.id}
              className="group rounded-2xl glass-panel border border-white/10 hover:border-purple-400/50 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-subtle-purple hover:-translate-y-2 p-6 bg-dark-card"
            >
              <div>
                {/* Photo with Glowing Ring */}
                <div className="relative w-28 h-28 mx-auto mb-5 rounded-2xl overflow-hidden p-[2px] bg-gradient-to-tr from-purple-500 via-violet-500 to-indigo-500 group-hover:scale-105 transition-transform duration-300 shadow-md">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>

                {/* Name & Position */}
                <div className="text-center mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-xs font-mono text-purple-400 font-semibold tracking-wide mt-0.5">
                    {member.position}
                  </div>
                </div>

                {/* Specialization Pill */}
                <div className="mb-4 text-center">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono bg-dark-surface border border-white/10 text-slate-300">
                    {member.specialization}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-400 text-center leading-relaxed mb-6 line-clamp-3">
                  {member.bio}
                </p>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-3 text-slate-400">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-dark-surface border border-white/10 hover:border-purple-400 hover:text-purple-300 flex items-center justify-center transition"
                    title="LinkedIn"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-dark-surface border border-white/10 hover:border-purple-400 hover:text-purple-300 flex items-center justify-center transition"
                    title="GitHub"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
