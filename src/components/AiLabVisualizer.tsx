import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Eye, 
  BrainCircuit, 
  Sparkles, 
  Bot, 
  Zap, 
  ChevronRight,
  Activity,
  Terminal
} from 'lucide-react';

interface LabNodeData {
  id: string;
  name: string;
  category: string;
  color: string;
  glow: string;
  icon: React.ElementType;
  x: number;
  y: number;
  parameters: string;
  architecture: string;
  currentResearch: string;
  benchmarks: string;
  hardware: string;
  keyConcepts: string[];
}

const LAB_NODES: LabNodeData[] = [
  {
    id: 'ml',
    name: 'Machine Learning',
    category: 'Statistical Foundations',
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.25)',
    icon: Activity,
    x: 20,
    y: 35,
    parameters: 'Gradient Boosters & Ensembles',
    architecture: 'XGBoost, LightGBM, Random Forests, SVMs',
    currentResearch: 'High-throughput feature engineering & explainability pipelines for tabular telemetry datasets.',
    benchmarks: '98.4% ROC-AUC on tabular benchmarks',
    hardware: 'AMD EPYC Compute Nodes',
    keyConcepts: ['Regularization', 'Cross-Validation', 'SHAP Values', 'Hyperparameter Tuning']
  },
  {
    id: 'dl',
    name: 'Deep Learning',
    category: 'Neural Representations',
    color: '#2563eb',
    glow: 'rgba(37, 99, 235, 0.25)',
    icon: BrainCircuit,
    x: 45,
    y: 20,
    parameters: 'Dense & Convolutional Tensors',
    architecture: 'ResNet, ConvNeXt, DenseNets, Multi-Layer Perceptrons',
    currentResearch: 'Stochastic gradient dynamics, low-precision FP8 backpropagation, and weight pruning strategies.',
    benchmarks: '4.2x speedup via FlashAttention kernels',
    hardware: '8x NVIDIA RTX 4090 Pods',
    keyConcepts: ['Backpropagation', 'Activation Manifolds', 'Quantization (AWQ/GPTQ)', 'AdamW']
  },
  {
    id: 'genai',
    name: 'Generative AI',
    category: 'Latent Diffusion & Transformers',
    color: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.25)',
    icon: Sparkles,
    x: 75,
    y: 30,
    parameters: '7B - 70B Parameter Foundations',
    architecture: 'Decoder-Only Transformers, Latent Diffusion (LDM), DiT',
    currentResearch: 'Domain adaptation via QLoRA, multimodal latent space audio diffusion, and reasoning distillation.',
    benchmarks: '120 tokens/sec continuous batching',
    hardware: 'Dedicated VRAM Cluster Nodes',
    keyConcepts: ['Self-Attention', 'Classifier-Free Guidance', 'Direct Preference Opt (DPO)', 'LoRA Adapters']
  },
  {
    id: 'nlp',
    name: 'Natural Language Processing',
    category: 'Linguistic Representation',
    color: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.25)',
    icon: Terminal,
    x: 30,
    y: 75,
    parameters: 'Sub-word Token Embeddings',
    architecture: 'BERT, RoBERTa, T5, Llama 3, State Space Models (Mamba)',
    currentResearch: 'Long-context retrieval augmented generation (RAG), vector indexing, and medical paper reasoning.',
    benchmarks: '89.2 MMLU Domain Accuracy',
    hardware: 'Distributed Tensor Parallel Rig',
    keyConcepts: ['Tokenization', 'Vector Embeddings', 'RAG Pipelines', 'Context Window Packing']
  },
  {
    id: 'cv',
    name: 'Computer Vision',
    category: 'Spatial Perception & 3D Sensing',
    color: '#0d9488',
    glow: 'rgba(13, 148, 136, 0.25)',
    icon: Eye,
    x: 60,
    y: 78,
    parameters: 'Spatial Attention & Patches',
    architecture: 'YOLOv10, Vision Transformers (ViT), Segment Anything (SAM)',
    currentResearch: 'Sub-15ms edge inference for autonomous micro-drones, multi-object ByteTrack, and zero-shot segmentation.',
    benchmarks: '64 FPS on Jetson Orin Nano at 15W',
    hardware: 'Embedded Jetson & Edge TPU Units',
    keyConcepts: ['Anchor-Free Detection', 'Feature Pyramid Networks', 'Depth Estimation', 'Optical Flow']
  },
  {
    id: 'robotics',
    name: 'Robotics & Embodied AI',
    category: 'Kinematics & Policy Learning',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.25)',
    icon: Bot,
    x: 85,
    y: 65,
    parameters: 'Continuous State-Action Space Policies',
    architecture: 'PPO, SAC, Isaac Gym RL, ROS2 Navigation Stacks',
    currentResearch: 'Sim-to-real policy transfer, quadruped traversal across rough terrain, and tactile robotic gripper feedback.',
    benchmarks: '99.1% Traversal Stability in Isaac Sim',
    hardware: 'Rover Testbed & Isaac Simulation Server',
    keyConcepts: ['Reinforcement Learning', 'SLAM Navigation', 'ROS2 Microcontrollers', 'Sim-to-Real']
  }
];

export const AiLabVisualizer: React.FC = () => {
  const [activeNode, setActiveNode] = useState<LabNodeData>(LAB_NODES[2]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    interface SynapsePulse {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
      color: string;
    }

    const connections: [number, number][] = [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [4, 5],
      [1, 5],
      [2, 4],
    ];

    const pulses: SynapsePulse[] = [];
    for (let i = 0; i < 8; i++) {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      pulses.push({
        fromIndex: conn[0],
        toIndex: conn[1],
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        color: '#60a5fa'
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const coords = LAB_NODES.map((node) => ({
        x: (node.x / 100) * width,
        y: (node.y / 100) * height,
        node,
      }));

      // Connections
      connections.forEach(([i, j]) => {
        const p1 = coords[i];
        const p2 = coords[j];
        const isActiveLine =
          p1.node.id === activeNode.id || p2.node.id === activeNode.id;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = isActiveLine
          ? 'rgba(59, 130, 246, 0.4)'
          : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = isActiveLine ? 1.5 : 1;
        ctx.stroke();
      });

      // Subtle pulses
      pulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulse.progress = 0;
          const conn = connections[Math.floor(Math.random() * connections.length)];
          pulse.fromIndex = conn[0];
          pulse.toIndex = conn[1];
        }

        const p1 = coords[pulse.fromIndex];
        const p2 = coords[pulse.toIndex];
        const px = p1.x + (p2.x - p1.x) * pulse.progress;
        const py = p1.y + (p2.y - p1.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.fill();
      });

      // Draw Nodes
      coords.forEach(({ x, y, node }) => {
        const isSelected = node.id === activeNode.id;
        const radius = isSelected ? 16 : 11;

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#11141e';
        ctx.fill();

        ctx.strokeStyle = isSelected ? node.color : '#334155';
        ctx.lineWidth = isSelected ? 2 : 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, isSelected ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeNode]);

  return (
    <div className="relative w-full rounded-2xl glass-panel border border-white/10 overflow-hidden p-6 md:p-8 bg-dark-card">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Neural Architecture Simulation
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Inside the AI Lab
          </h3>
          <p className="text-sm text-slate-400">
            Interactive topology of research divisions, compute pods, and model pipelines.
          </p>
        </div>

        {/* Division Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {LAB_NODES.map((node) => {
            const Icon = node.icon;
            const isSelected = node.id === activeNode.id;
            return (
              <button
                key={node.id}
                onClick={() => setActiveNode(node)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/50'
                    : 'bg-dark-surface text-slate-400 border-white/5 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: node.color }} />
                <span>{node.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Canvas + Telemetry HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Topology Canvas */}
        <div className="lg:col-span-7 relative h-[380px] md:h-[450px] w-full rounded-xl bg-dark-bg border border-white/5 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-subtle-grid pointer-events-none" />
          
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-pointer relative z-10"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = ((e.clientX - rect.left) / rect.width) * 100;
              const clickY = ((e.clientY - rect.top) / rect.height) * 100;

              let closest = activeNode;
              let minDistance = 999;
              LAB_NODES.forEach((n) => {
                const dist = Math.hypot(n.x - clickX, n.y - clickY);
                if (dist < minDistance && dist < 12) {
                  minDistance = dist;
                  closest = n;
                }
              });
              setActiveNode(closest);
            }}
          />

          {/* Interactive node labels */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {LAB_NODES.map((node) => {
              const isSelected = node.id === activeNode.id;
              return (
                <div
                  key={node.id}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                >
                  <button
                    onClick={() => setActiveNode(node)}
                    className="group relative flex items-center justify-center p-2 rounded-full"
                    title={node.name}
                  >
                    <span
                      className={`text-[11px] font-mono whitespace-nowrap absolute top-full mt-1.5 px-2.5 py-0.5 rounded border transition-all ${
                        isSelected
                          ? 'bg-dark-card text-blue-300 border-blue-500/50 font-semibold shadow-sm'
                          : 'bg-dark-bg/90 text-slate-400 border-white/10 group-hover:text-white'
                      }`}
                    >
                      {node.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-3 left-4 text-[11px] font-mono text-slate-500 pointer-events-none flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Interactive Neural Map • Click nodes to view technical specs</span>
          </div>
        </div>

        {/* Right: Technical Telemetry Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-xl border border-white/10 bg-dark-surface shadow-card relative overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2.5 rounded-lg border flex items-center justify-center bg-dark-bg"
                  style={{ borderColor: activeNode.color }}
                >
                  <activeNode.icon className="w-5 h-5" style={{ color: activeNode.color }} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    {activeNode.category}
                  </span>
                  <h4 className="text-xl font-bold text-white tracking-tight">
                    {activeNode.name}
                  </h4>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/60 text-blue-400 border border-blue-800">
                ACTIVE
              </span>
            </div>

            {/* Research Focus */}
            <div className="mb-5 bg-dark-bg p-3.5 rounded-lg border border-white/5">
              <div className="text-xs font-mono text-blue-400 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Current Focus Area
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeNode.currentResearch}
              </p>
            </div>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-5">
              <div className="bg-dark-card p-3 rounded-lg border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                  CORE ARCHITECTURES
                </span>
                <span className="font-medium text-slate-200 block truncate" title={activeNode.architecture}>
                  {activeNode.architecture}
                </span>
              </div>

              <div className="bg-dark-card p-3 rounded-lg border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                  HARDWARE ACCELERATION
                </span>
                <span className="font-medium text-blue-400 block truncate" title={activeNode.hardware}>
                  {activeNode.hardware}
                </span>
              </div>

              <div className="bg-dark-card p-3 rounded-lg border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                  CAPACITY
                </span>
                <span className="font-medium text-slate-200 block truncate" title={activeNode.parameters}>
                  {activeNode.parameters}
                </span>
              </div>

              <div className="bg-dark-card p-3 rounded-lg border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                  BENCHMARK
                </span>
                <span className="font-medium text-emerald-400 block truncate" title={activeNode.benchmarks}>
                  {activeNode.benchmarks}
                </span>
              </div>
            </div>

            {/* Competencies */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 block mb-2">
                CORE COMPETENCIES:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeNode.keyConcepts.map((concept, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-dark-bg border border-white/10 text-slate-300"
                  >
                    #{concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                Cluster Node: Online
              </span>
              <a
                href="#projects"
                className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 group transition"
              >
                View Division Projects
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
