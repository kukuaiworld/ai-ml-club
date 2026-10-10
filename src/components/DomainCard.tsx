import React, { useState } from 'react';
import { 
  Binary, 
  Brain, 
  Sparkles, 
  MessageSquareCode, 
  Scan, 
  Network, 
  BarChart3, 
  Bot, 
  Cpu, 
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { AIDomain } from '../types';

interface DomainCardProps {
  domain: AIDomain;
  description: string;
  tagline: string;
  technologies: string[];
  activeProjectsCount: number;
  onSelect?: (domain: AIDomain) => void;
}

export const DomainCard: React.FC<DomainCardProps> = ({
  domain,
  description,
  tagline,
  technologies,
  activeProjectsCount,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDomainConfig = () => {
    switch (domain) {
      case 'Machine Learning':
        return { icon: Binary, badgeText: 'Statistical Learning', accent: '#3b82f6' };
      case 'Deep Learning':
        return { icon: Brain, badgeText: 'Neural Tensors', accent: '#2563eb' };
      case 'Generative AI':
        return { icon: Sparkles, badgeText: 'Foundation Models', accent: '#6366f1' };
      case 'Natural Language Processing':
        return { icon: MessageSquareCode, badgeText: 'Semantic Embeddings', accent: '#0284c7' };
      case 'Computer Vision':
        return { icon: Scan, badgeText: 'Spatial Perception', accent: '#0d9488' };
      case 'Neural Networks':
        return { icon: Network, badgeText: 'Synaptic Graphs', accent: '#4f46e5' };
      case 'Data Science':
        return { icon: BarChart3, badgeText: 'Statistical Inference', accent: '#d97706' };
      case 'AI Agents':
        return { icon: Bot, badgeText: 'Autonomous Systems', accent: '#0284c7' };
      case 'Robotics':
        return { icon: Cpu, badgeText: 'Embodied Systems', accent: '#10b981' };
      case 'Responsible AI':
        return { icon: ShieldCheck, badgeText: 'Ethics & Safety', accent: '#059669' };
    }
  };

  const config = getDomainConfig();
  const Icon = config.icon;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(domain)}
      className="group relative rounded-2xl p-6 glass-panel border border-white/10 hover:border-blue-500/40 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between hover:shadow-card hover:-translate-y-1 bg-dark-card"
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="p-3 rounded-xl bg-dark-surface border border-white/5 group-hover:border-blue-500/30 transition-colors">
            <Icon className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-surface border border-white/5 text-slate-400">
              {config.badgeText}
            </span>
            <div className="w-6 h-6 rounded flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-1 tracking-tight">
          {domain}
        </h3>
        <p className="text-xs font-mono text-slate-400 mb-3">
          {tagline}
        </p>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      {/* Clean Technical Micro-Visualization */}
      <div className="my-2 h-12 rounded-lg bg-dark-bg border border-white/5 p-2 relative overflow-hidden flex items-center justify-center">
        {domain === 'Generative AI' && (
          <div className="flex items-center gap-1.5 w-full justify-center">
            {[30, 60, 25, 80, 50, 75, 40, 90, 45, 65].map((h, i) => (
              <span
                key={i}
                style={{
                  height: isHovered ? `${h}%` : '20%',
                  transition: `height 0.25s ease ${i * 0.03}s`,
                }}
                className="w-1 bg-blue-500/70 rounded-full"
              />
            ))}
          </div>
        )}

        {domain === 'Computer Vision' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className={`w-7 h-7 border border-dashed border-teal-500 rounded transition-transform ${isHovered ? 'scale-110' : 'scale-90'}`} />
            <div className="absolute w-1.5 h-1.5 bg-teal-400 rounded-full" />
            <span className="absolute right-2 bottom-1 text-[9px] font-mono text-slate-400">
              {isHovered ? 'INSPECT' : 'IDLE'}
            </span>
          </div>
        )}

        {domain === 'Neural Networks' && (
          <div className="flex items-center justify-between w-3/4">
            <div className="flex flex-col gap-1">
              <span className={`w-1.5 h-1.5 rounded-full bg-blue-400 ${isHovered ? 'opacity-100' : 'opacity-50'}`} />
              <span className={`w-1.5 h-1.5 rounded-full bg-blue-400 ${isHovered ? 'opacity-100' : 'opacity-50'}`} />
            </div>
            <div className="h-px flex-1 mx-2 bg-slate-700" />
            <div className="flex flex-col gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            </div>
            <div className="h-px flex-1 mx-2 bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
        )}

        {domain === 'AI Agents' && (
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-300">
            <span className="px-1.5 py-0.5 rounded bg-dark-surface border border-white/10">
              PLAN
            </span>
            <span>→</span>
            <span className={`px-1.5 py-0.5 rounded bg-dark-surface border ${isHovered ? 'border-blue-500 text-blue-300' : 'border-white/10'}`}>
              EXECUTE
            </span>
            <span>→</span>
            <span className="px-1.5 py-0.5 rounded bg-dark-surface border border-white/10">
              EVAL
            </span>
          </div>
        )}

        {!['Generative AI', 'Computer Vision', 'Neural Networks', 'AI Agents'].includes(domain) && (
          <div className="w-full flex items-center justify-between px-2 font-mono text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-blue-400' : 'bg-slate-600'}`} />
              RESPONSE TIME: {isHovered ? '14ms' : '22ms'}
            </span>
            <span className="text-slate-300">
              {isHovered ? 'ACTIVE' : 'READY'}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-1">
          {technologies.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-surface text-slate-400 border border-white/5"
            >
              {tech}
            </span>
          ))}
        </div>
        <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap ml-2">
          {activeProjectsCount} Projects
        </span>
      </div>
    </div>
  );
};
