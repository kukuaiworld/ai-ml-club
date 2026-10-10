import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Layers, 
  Users, 
  Sparkles, 
  Search,
  Filter
} from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';
import { Project, AIDomain } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  isFullPage?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onSelectProject,
  isFullPage = false,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const domains = [
    'All',
    'Robotics',
    'Natural Language Processing',
    'Generative AI',
    'Data Science',
    'AI Agents',
  ];

  const filtered = projects.filter((p) => {
    const matchesDomain = selectedDomain === 'All' || p.domain === selectedDomain;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech_stack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  const displayList = isFullPage ? filtered : filtered.slice(0, 6);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
              <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
              Applied AI Engineering
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Project <span className="text-purple-400">Showcase</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              Research prototypes and production systems conceived, trained, and deployed by our student researchers.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech stack, models..."
              className="w-full pl-9 pr-4 py-2 bg-dark-card border border-white/10 focus:border-purple-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Domain Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-6 mb-8 border-b border-slate-800">
          <span className="text-xs font-mono text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Domain:
          </span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedDomain === dom
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-400/50 shadow-neon-violet'
                  : 'bg-cyber-surface/40 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Grid */}
        {displayList.length === 0 ? (
          <div className="text-center py-16 rounded-2xl glass-panel border border-slate-800 text-slate-400">
            No projects found matching criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayList.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group rounded-2xl glass-panel border border-slate-800/80 hover:border-violet-400/50 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-neon-violet hover:-translate-y-2 cursor-pointer"
              >
                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={project.cover_image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-darker via-cyber-darker/25 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyber-black/85 text-violet-300 border border-violet-500/30 backdrop-blur-md">
                      {project.domain}
                    </span>
                  </div>

                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors mb-2">
                      {project.name}
                    </h3>

                    <p className="text-xs text-slate-300/80 line-clamp-3 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech_stack.map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-surface border border-slate-800 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Team Avatars & Links */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {project.team_members.slice(0, 3).map((m, i) => (
                          <div
                            key={i}
                            title={m.name}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-dark-bg bg-dark-surface border border-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-300"
                          >
                            {m.name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 truncate max-w-[100px]">
                        {project.team_members[0]?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-cyber-surface border border-slate-800 hover:border-violet-400 text-slate-400 hover:text-white transition"
                          title="Source Code"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-violet-500/20 border border-violet-400/40 text-violet-300 hover:text-white hover:bg-violet-500/30 transition"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
