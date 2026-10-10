import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Rocket, 
  Layers, 
  Calendar, 
  FolderGit2
} from 'lucide-react';
import { GithubIcon } from '../../components/SocialIcons';
import { HeroSection } from '../../sections/HeroSection';
import { CountdownBanner } from '../../components/CountdownBanner';
import { 
  Activity, 
  Workshop, 
  Project, 
  Resource, 
  GalleryItem, 
  TeamMember, 
  AchievementStats, 
  TimelineEvent 
} from '../../types';

interface HomePageProps {
  activities: Activity[];
  workshops: Workshop[];
  projects: Project[];
  resources: Resource[];
  gallery: GalleryItem[];
  team: TeamMember[];
  achievements: AchievementStats;
  timeline: TimelineEvent[];
  onSelectActivity: (activity: Activity) => void;
  onSelectWorkshop: (workshop: Workshop) => void;
  onSelectProject: (project: Project) => void;
  onOpenLightbox: (item: GalleryItem) => void;
  onNavigateTab: (tabId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  activities,
  workshops,
  projects,
  team,
  achievements,
  onSelectActivity,
  onSelectWorkshop,
  onSelectProject,
  onNavigateTab,
}) => {
  const nextUpcomingWorkshop = workshops.find((w) => w.status === 'Upcoming') || null;
  const featuredActivities = activities.slice(0, 2);
  const featuredProjects = projects.slice(0, 2);

  return (
    <div className="flex flex-col">
      {/* 1. Full-Screen 3D Hero Section */}
      <HeroSection
        onExploreClick={() => onNavigateTab('about')}
        onWorkshopsClick={() => onNavigateTab('workshops')}
      />

      {/* 2. Key Metrics Strip */}
      <section className="border-y border-purple-400/15 bg-gradient-to-r from-[#210738]/75 via-[#160527]/75 to-[#280942]/75 backdrop-blur-md py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {achievements.members_count}+
            </div>
            <div className="text-xs font-mono text-purple-300 mt-1 uppercase tracking-wider">
              Student Members
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-purple-300">
              {achievements.workshops_count}+
            </div>
            <div className="text-xs font-mono text-purple-400 mt-1 uppercase tracking-wider">
              Technical Workshops
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-violet-300">
              8x RTX 4090
            </div>
            <div className="text-xs font-mono text-purple-300 mt-1 uppercase tracking-wider">
              HPC Compute Cluster
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-fuchsia-300">
              {achievements.competitions_won_count}+
            </div>
            <div className="text-xs font-mono text-purple-400 mt-1 uppercase tracking-wider">
              Hackathons Won
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Event Countdown Ticker */}
      <CountdownBanner
        workshop={nextUpcomingWorkshop}
        onRegisterClick={onSelectWorkshop}
      />

      {/* 4. About & Mission Overview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Who We Are
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Hub for <span className="gradient-text-purple">Artificial Intelligence</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
              Based at Engineering College, Ajmer, the AI/ML Club fosters hands-on experimentation, advanced research, and production software engineering.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('about')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-500/30 bg-purple-950/40 text-purple-300 hover:text-white hover:bg-purple-900/60 transition text-xs font-mono uppercase tracking-wider self-start md:self-auto"
          >
            <span>Our Full Mission & History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* The 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => onNavigateTab('workshops')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onNavigateTab('workshops'); }}
            className="cursor-pointer p-6 rounded-2xl glass-panel border border-white/10 hover:border-purple-400/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">LEARN</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Comprehensive bootcamps on transformer math, PyTorch internals, quantization, and fine-tuning open-weight models.
              </p>
            </div>
            <div className="text-xs font-mono text-purple-400 group-hover:text-purple-300 flex items-center gap-1.5 pt-2">
              <span>Explore Workshops</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab('projects')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onNavigateTab('projects'); }}
            className="cursor-pointer p-6 rounded-2xl glass-panel border border-white/10 hover:border-purple-400/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">BUILD</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Collaborative open-source systems, multi-agent frameworks, embedded computer vision, and robotics hardware prototypes.
              </p>
            </div>
            <div className="text-xs font-mono text-purple-400 group-hover:text-purple-300 flex items-center gap-1.5 pt-2">
              <span>View Projects</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab('lab')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onNavigateTab('lab'); }}
            className="cursor-pointer p-6 rounded-2xl glass-panel border border-white/10 hover:border-purple-400/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">INNOVATE</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Publishing arXiv preprints, conducting empirical benchmarks, and competing in premier nationwide AI hackathons.
              </p>
            </div>
            <div className="text-xs font-mono text-purple-400 group-hover:text-purple-300 flex items-center gap-1.5 pt-2">
              <span>Explore AI Lab</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Upcoming Events & Bootcamps Spotlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Calendar className="w-3.5 h-3.5" />
              Calendar Highlights
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured <span className="gradient-text-purple">Events & Workshops</span>
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-xl">
              Take part in intense coding competitions, paper discussions, and hands-on bootcamps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('activities')}
              className="px-4 py-2 rounded-xl border border-white/15 bg-dark-card text-slate-300 hover:text-white transition text-xs font-mono"
            >
              All Activities ({activities.length})
            </button>
            <button
              onClick={() => onNavigateTab('workshops')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition text-xs font-mono flex items-center gap-1.5"
            >
              <span>All Workshops ({workshops.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 2 Featured Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectActivity(act); }}
              className="group cursor-pointer rounded-2xl glass-panel border border-white/10 hover:border-purple-400/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 active:scale-[0.99]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300">
                    {act.category}
                  </span>
                  <span className="text-xs font-mono text-purple-400 font-semibold">{act.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                  {act.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                  {act.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-400 font-mono">
                <span>{act.venue}</span>
                <span className="text-purple-400 flex items-center gap-1 group-hover:text-purple-300 transition-colors">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Spotlight Student Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#24083c]/70 via-[#150625]/60 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-400 text-xs font-mono uppercase tracking-widest mb-3">
                <FolderGit2 className="w-3.5 h-3.5" />
                Open Source & Engineering
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Breakthrough <span className="gradient-text-purple">Student AI Projects</span>
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-xl">
                Explore real applications built and maintained by club members.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('projects')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:via-purple-500 hover:to-fuchsia-500 active:scale-95 text-white transition text-xs font-mono self-start md:self-auto shadow-md"
            >
              <span>Explore All {projects.length} Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onSelectProject(proj); }}
                className="cursor-pointer group rounded-2xl glass-panel border border-white/10 hover:border-purple-400/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300">
                      {proj.domain}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">Verified System</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                    {proj.name}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.tech_stack.slice(0, 4).map((tech, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-card border border-purple-400/15 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <a
                    href={proj.github_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-white transition font-mono active:scale-95"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(proj);
                    }}
                    className="text-xs text-slate-400 group-hover:text-purple-300 hover:text-white font-mono active:scale-95 transition-colors"
                  >
                    Full Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Leadership & Community Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#220738]/85 via-[#160526]/85 to-[#2b0945]/85 border-t border-purple-400/15">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start -space-x-2 mb-4">
              {team.slice(0, 5).map((m) => (
                <img
                  key={m.id}
                  src={m.photo}
                  alt={m.name}
                  className="w-10 h-10 rounded-full border-2 border-[#1b062d] object-cover"
                />
              ))}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-800 to-fuchsia-800 border-2 border-[#1b062d] flex items-center justify-center text-xs font-mono font-bold text-white">
                +{team.length - 5}
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to Shape the Future with Us?
            </h3>
            <p className="text-slate-300 text-sm mt-2 max-w-xl">
              Meet our 10 official student leads and executive officers, attend weekly research assemblies, or reach out to explore collaborative partnerships.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('team')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-purple-400/25 bg-dark-card hover:bg-purple-900/30 active:scale-95 text-slate-200 font-medium text-xs sm:text-sm transition"
            >
              Meet The Full Team
            </button>
            <button
              onClick={() => onNavigateTab('contact')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:via-purple-500 hover:to-fuchsia-500 active:scale-95 text-white font-medium text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
