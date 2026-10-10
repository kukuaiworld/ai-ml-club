import React from 'react';
import { Brain } from 'lucide-react';
import { DomainCard } from '../components/DomainCard';
import { AIDomain } from '../types';

interface DomainsSectionProps {
  onSelectDomain: (domain: AIDomain) => void;
}

const DOMAINS_DATA: {
  domain: AIDomain;
  tagline: string;
  description: string;
  technologies: string[];
  activeProjectsCount: number;
}[] = [
  {
    domain: 'Machine Learning',
    tagline: 'Predictive Inference & Ensembles',
    description: 'Master supervised, unsupervised algorithms, gradient boosted trees, feature engineering, and statistical modeling.',
    technologies: ['Scikit-Learn', 'XGBoost', 'LightGBM', 'Pandas'],
    activeProjectsCount: 14,
  },
  {
    domain: 'Deep Learning',
    tagline: 'Multi-Layer Neural Architectures',
    description: 'Training and scaling deep networks, backprop calculus, residual networks, and hardware acceleration on modern GPU nodes.',
    technologies: ['PyTorch', 'CUDA', 'TensorRT', 'Triton'],
    activeProjectsCount: 22,
  },
  {
    domain: 'Generative AI',
    tagline: 'Latent Diffusion & Large Models',
    description: 'Diffusion pipelines, multimodal synthesis, parameter-efficient fine-tuning (LoRA), and speculative decoding.',
    technologies: ['Diffusers', 'vLLM', 'Ollama', 'HuggingFace'],
    activeProjectsCount: 18,
  },
  {
    domain: 'Natural Language Processing',
    tagline: 'Semantic Understanding & RAG',
    description: 'Building dense vector retrieval, sequence-to-sequence transformers, token classification, and reasoning engines.',
    technologies: ['Transformers', 'LangChain', 'ChromaDB', 'NLTK'],
    activeProjectsCount: 12,
  },
  {
    domain: 'Computer Vision',
    tagline: 'Visual Perception & Edge Tracking',
    description: 'Real-time object detection, zero-shot spatial segmentation, 3D point cloud reconstruction, and drone tracking.',
    technologies: ['OpenCV', 'YOLOv10', 'Segment Anything', 'TorchVision'],
    activeProjectsCount: 15,
  },
  {
    domain: 'Neural Networks',
    tagline: 'Mathematical Foundations',
    description: 'Exploring spiking neural networks, graph neural networks (GNNs), energy-based models, and state space systems.',
    technologies: ['PyG', 'NetworkX', 'JAX', 'Flax'],
    activeProjectsCount: 9,
  },
  {
    domain: 'Data Science',
    tagline: 'Large-scale Telemetry & Insights',
    description: 'Analyzing high-dimensional tabular datasets, automated exploratory analysis, and causal inference dashboards.',
    technologies: ['Polars', 'DuckDB', 'Plotly', 'Seaborn'],
    activeProjectsCount: 11,
  },
  {
    domain: 'AI Agents',
    tagline: 'Autonomous Action & Tool Calling',
    description: 'Constructing multi-agent orchestrations, ReAct loops, episodic memory retrieval, and self-healing task swarms.',
    technologies: ['LangGraph', 'AutoGPT', 'CrewAI', 'Docker'],
    activeProjectsCount: 16,
  },
  {
    domain: 'Robotics',
    tagline: 'Embodied Perception & Motion',
    description: 'Sim-to-real policy learning, robotic rover kinematics, sensor fusion, LiDAR SLAM, and ROS2 microcontrollers.',
    technologies: ['ROS2', 'Isaac Gym', 'Gazebo', 'Jetson Orin'],
    activeProjectsCount: 8,
  },
  {
    domain: 'Responsible AI',
    tagline: 'Alignment, Safety & Governance',
    description: 'Investigating adversarial robustness, model explainability (SHAP/LIME), bias mitigation, and red-teaming guardrails.',
    technologies: ['Captum', 'Guardrails AI', 'Fairlearn', 'SHAP'],
    activeProjectsCount: 6,
  },
];

export const DomainsSection: React.FC<DomainsSectionProps> = ({ onSelectDomain }) => {
  return (
    <section id="domains" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/40">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            Specialized Disciplines
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Explore <span className="text-purple-400">AI Domains</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            From foundational linear algebra to trillion-parameter foundation models and embodied robotics, our divisions specialize in key AI disciplines.
          </p>
        </div>

        {/* 10 Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOMAINS_DATA.map((item) => (
            <DomainCard
              key={item.domain}
              domain={item.domain}
              tagline={item.tagline}
              description={item.description}
              technologies={item.technologies}
              activeProjectsCount={item.activeProjectsCount}
              onSelect={onSelectDomain}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
