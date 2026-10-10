import React from 'react';
import { 
  Cpu, 
  Sparkles, 
  Terminal, 
  Layers, 
  Rocket, 
  Award, 
  Bot, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { DomainsSection } from '../../sections/DomainsSection';
import { AIDomain } from '../../types';

interface ServicesPageProps {
  onNavigateTab: (tabId: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigateTab }) => {
  const clubServices = [
    {
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      title: 'High-Performance GPU Cluster',
      tag: 'Compute Infrastructure',
      description: 'Access dedicated on-campus HPC nodes equipped with 8x NVIDIA RTX 4090 GPUs for training transformers, running vLLM inference, and fine-tuning diffusion pipelines.',
      features: ['Slurm batch job scheduling', 'Pre-installed CUDA 12.4 & PyTorch 2.4', 'Local HuggingFace & Ollama model cache']
    },
    {
      icon: <Rocket className="w-6 h-6 text-purple-400" />,
      title: 'AI Project Incubation & Acceleration',
      tag: 'Student Research',
      description: 'We turn student concepts into published research and deployed applications. Receive compute credits, faculty mentorship, code reviews, and hardware grants.',
      features: ['One-on-one architecture reviews', 'Dedicated club repository hosting', 'Demo day showcase to industry recruiters']
    },
    {
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      title: 'Hands-on Production MLOps Bootcamps',
      tag: 'Skill Training',
      description: 'Comprehensive technical workshops covering state-of-the-art frameworks: quantization (AWQ/GPTQ), LoRA adapters, TensorRT, LangGraph, and containerized serving.',
      features: ['Interactive Colab & Jupyter notebooks', 'Real-world datasets & code repositories', 'Certificate of technical competence']
    },
    {
      icon: <Award className="w-6 h-6 text-purple-400" />,
      title: 'Hackathon Mentorship & Travel Grants',
      tag: 'Competitions',
      description: 'Represent GEC Ajmer on national and international stages. We provide squad matching, design sprint bootcamps, and logistics funding for premier hackathons.',
      features: ['Dedicated hackathon war room', 'API credits for OpenAI, Anthropic, Gemini', 'Alumni jury pitch dry-runs']
    },
    {
      icon: <Bot className="w-6 h-6 text-purple-400" />,
      title: 'Robotics & Edge AI Hardware Testbed',
      tag: 'Physical Prototyping',
      description: 'Test embedded computer vision and reinforcement learning algorithms on real hardware including NVIDIA Jetson Orin Nano, Raspberry Pi 5, quadcopters, and rover chassis.',
      features: ['ROS2 & Isaac Sim simulation environments', 'Stereo depth cameras & LiDAR sensors', 'Oscilloscopes & solder stations']
    },
    {
      icon: <Terminal className="w-6 h-6 text-purple-400" />,
      title: 'Open Source AI Toolkits & Datasets',
      tag: 'Community',
      description: 'We curate regional datasets, publish production API starter boilerplates, and build open-source tools maintained by club engineers.',
      features: ['Curated Hugging Face datasets', 'Clean FastAPI + vLLM starters', 'Peer code reviews on GitHub']
    }
  ];

  const featuresMatrix = [
    {
      feature: 'On-demand GPU Slurm Queue',
      member: 'Available',
      visitor: 'On Request',
      details: 'Run deep neural network training scripts up to 24h per batch'
    },
    {
      feature: 'Hardware Lab & Sensor Checkout',
      member: 'Included',
      visitor: 'Guided Tour',
      details: 'Jetson Nano, cameras, quadcopter parts for approved projects'
    },
    {
      feature: 'Paper Reading Circle & ArXiv Seminars',
      member: 'Weekly',
      visitor: 'Open Stream',
      details: 'Discussions on reasoning models, SSMs, and multimodal architectures'
    },
    {
      feature: 'Mentorship for Hackathons',
      member: 'Full Support',
      visitor: 'Community Discord',
      details: 'Pitch coaching, team pairing, and sponsored cloud API credits'
    },
    {
      feature: 'Project Repository Sponsorship',
      member: 'Verified Club Project',
      visitor: 'Forkable Repos',
      details: 'Featured showcase on official club website and demo portal'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <PublicPageHeader
        badge="Services & Capabilities"
        badgeIcon={<Zap className="w-3.5 h-3.5 text-purple-400" />}
        title="Club Infrastructure, Services &"
        highlightedTitle="Technical Offerings"
        subtitle="Explore the dedicated resources, high-performance compute labs, mentorship programs, and research tools provided to members and collaborators."
        breadcrumbs={[{ label: 'Services & Features' }]}
        onNavigate={onNavigateTab}
      />

      {/* Services Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What We <span className="gradient-text-purple">Provide Our Members</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Everything you need to advance from fundamental machine learning theory to state-of-the-art engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubServices.map((service, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-purple-400/50 hover:shadow-subtle-purple transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {service.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-purple-950/70 border border-purple-800 text-purple-300">
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="text-xs font-mono text-purple-400 font-semibold mb-2">Key Highlights:</div>
                <ul className="space-y-1.5">
                  {service.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Domains & Specialties Section */}
      <DomainsSection onSelectDomain={(_d: AIDomain) => onNavigateTab('projects')} />

      {/* Hardware & Infrastructure Specs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#140b22]/70 via-[#0d0814] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs font-mono uppercase tracking-widest mb-4">
                  <Shield className="w-3.5 h-3.5" />
                  Campus Compute Cluster
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  High-Performance Computing <br />
                  <span className="gradient-text-purple">Dedicated to AI Exploration</span>
                </h3>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                  Located within the Department of Computer Science & Engineering at GEC Ajmer, our cluster provides low-latency local execution, so student researchers are never constrained by paid API costs.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                  <div className="p-4 rounded-xl bg-dark-card border border-white/10">
                    <div className="text-2xl font-black text-white font-mono">8x</div>
                    <div className="text-xs text-purple-400 mt-1 font-semibold">RTX 4090 GPUs</div>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-card border border-white/10">
                    <div className="text-2xl font-black text-white font-mono">192GB</div>
                    <div className="text-xs text-purple-400 mt-1 font-semibold">Total VRAM</div>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-card border border-white/10">
                    <div className="text-2xl font-black text-white font-mono">10 Gbps</div>
                    <div className="text-xs text-purple-400 mt-1 font-semibold">Cluster Interconnect</div>
                  </div>
                </div>
              </div>

              {/* Terminal Code / Slurm Preview */}
              <div className="rounded-2xl bg-[#09050d] border border-white/15 p-5 font-mono text-xs text-slate-300 shadow-xl overflow-x-auto">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span>cluster-login.aiml.gecajmer.internal</span>
                </div>
                <pre className="text-purple-300 font-mono leading-relaxed">
                  <code>{`# Sample Slurm Batch Allocation
$ sbatch --gpus=2 --partition=ai-research job.sh
Submitted batch job 892043 to GEC-AJMER-GPU-QUEUE

[Cluster Monitor]
Node 01: RTX 4090 | Temp: 58°C | VRAM: 18.2 / 24.0 GB | UTIL: 94%
Node 02: RTX 4090 | Temp: 61°C | VRAM: 21.0 / 24.0 GB | UTIL: 98%
Status: 8 Nodes Online | Ollama LLM Serving Active`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison Matrix */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Features & <span className="gradient-text-purple">Resource Access Matrix</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Compare access privileges between enrolled club members and general campus visitors.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 glass-panel">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#180e28] text-xs font-mono uppercase tracking-wider text-purple-300 border-b border-white/10">
              <tr>
                <th className="py-4 px-6">Capability / Feature</th>
                <th className="py-4 px-6">Enrolled Member</th>
                <th className="py-4 px-6">Campus Visitor</th>
                <th className="py-4 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {featuresMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">{item.feature}</td>
                  <td className="py-4 px-6 text-purple-300 font-medium">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                      {item.member}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{item.visitor}</td>
                  <td className="py-4 px-6 text-xs text-slate-400">{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Bar */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-900/40 via-[#1e1030] to-purple-900/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-white">Ready to Leverage Club Resources?</h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Join as a student member or submit your research project for GPU compute allocation.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('contact')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs sm:text-sm transition shadow-md flex items-center gap-2"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('workshops')}
              className="px-5 py-2.5 rounded-xl border border-white/15 bg-dark-card hover:bg-white/5 text-slate-200 font-medium text-xs sm:text-sm transition"
            >
              Browse Workshops
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
