import React from 'react';
import { 
  GraduationCap, 
  Code2, 
  Lightbulb, 
  Cpu, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface AboutSectionProps {
  onLearnClick: () => void;
  onBuildClick: () => void;
  onInnovateClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onLearnClick,
  onBuildClick,
  onInnovateClick,
}) => {
  const cards = [
    {
      title: 'LEARN',
      subtitle: 'Knowledge & Fundamentals',
      description: 'Workshops, technical sessions, reading groups, and structured roadmaps covering deep learning math, PyTorch, and foundation models.',
      icon: GraduationCap,
      action: onLearnClick,
      points: [
        'Hands-on PyTorch & CUDA sessions',
        'Transformer & LLM architecture seminars',
        'Curated arXiv reading groups',
      ],
    },
    {
      title: 'BUILD',
      subtitle: 'Engineering & Hackathons',
      description: 'AI/ML projects, 48-hour hackathons, collaborative open-source engineering, and real-time edge hardware deployments.',
      icon: Code2,
      action: onBuildClick,
      points: [
        'Autonomous micro-drone navigation',
        'Domain-specific RAG & agent swarms',
        'Open-source benchmarking toolkits',
      ],
    },
    {
      title: 'INNOVATE',
      subtitle: 'Research & Discovery',
      description: 'Applied research, novel experimentation, academic conference papers, and real-world industrial problem solving.',
      icon: Lightbulb,
      action: onInnovateClick,
      points: [
        'NeurIPS & CVPR paper reproductions',
        'Sim-to-real robotic policy transfer',
        'Model quantization & safety alignment',
      ],
    },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-dark-surface/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            Our Mission & DNA
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Democratizing <span className="text-purple-400">Frontier AI</span> on Campus
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            We are a multidisciplinary student collective uniting engineers, researchers, and creators to bridge the gap between academic theory and cutting-edge artificial intelligence deployments.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={card.action}
                className="group relative rounded-2xl glass-panel p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-200 hover:-translate-y-1.5 cursor-pointer bg-dark-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3.5 rounded-xl bg-dark-surface border border-white/5 group-hover:border-purple-500/30 transition-colors">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-slate-600">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-wide mb-1">
                    {card.title}
                  </h3>
                  <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-4">
                    {card.subtitle}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {card.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {card.points.map((pt, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-purple-400 transition">
                  <span>Explore {card.title} Programs</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
