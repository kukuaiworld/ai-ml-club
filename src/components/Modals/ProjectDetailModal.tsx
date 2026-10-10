import React from 'react';
import { X, ExternalLink, Cpu, Users, Layers } from 'lucide-react';
import { GithubIcon } from '../SocialIcons';
import { Project } from '../../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel border border-white/15 bg-dark-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Image & Overlay */}
        <div className="relative h-60 w-full overflow-hidden bg-dark-bg">
          <img
            src={project.cover_image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-90" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-dark-bg/80 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-dark-bg/90 text-slate-200 border border-white/10 backdrop-blur-md inline-block mb-1.5">
              {project.domain}
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {project.name}
            </h3>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-mono uppercase text-blue-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              Project Architecture & Overview
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Technologies & Frameworks
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-dark-surface border border-white/5 text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              Project Authors
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.team_members.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-surface border border-white/5"
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-dark-bg border border-white/10 flex items-center justify-center font-bold text-slate-300 text-xs">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {member.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links & CTA */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-surface border border-white/10 hover:border-white/20 text-slate-200 text-xs font-mono transition"
                >
                  <GithubIcon className="w-4 h-4 text-slate-300" />
                  <span>GitHub Repository</span>
                </a>
              )}

              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
