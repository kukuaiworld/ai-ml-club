import React, { useEffect, useState } from 'react';

interface AnimatedLogoLoaderProps {
  isLoading: boolean;
}

export const AnimatedLogoLoader: React.FC<AnimatedLogoLoaderProps> = ({ isLoading }) => {
  const [shouldRender, setShouldRender] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 1000); // Transition out timer
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
      <style>{`
        /* --------------------------------------------------
           STAGE 1: CONTINUOUS AI BACKGROUND
           -------------------------------------------------- */
        .cinematic-environment {
          position: absolute;
          inset: 0;
          background: #1a0b2e; /* Master background color */
          z-index: -2;
        }

        .ambient-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          box-shadow: 0 0 6px 2px rgba(168, 85, 247, 0.3);
          opacity: 0;
          animation: floatParticle 8s ease-in-out infinite alternate;
        }

        .bg-fade-in {
          animation: environmentFade 0.8s ease-out forwards;
        }

        /* --------------------------------------------------
           LOGO CONTAINER (1.75x Larger Scale)
           -------------------------------------------------- */
        .logo-cinematic-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 700px; /* Scaled up from 400px */
          padding: 0 2rem;
          /* STAGE 6: End of timeline transition out */
          animation: transitionExpand 0.6s ease-in 5.5s forwards;
        }

        /* --------------------------------------------------
           STAGE 2 (0.8s - 2.0s): NODE ENTRANCES
           -------------------------------------------------- */
        .node-square {
          animation: slideInSquare 1.2s cubic-bezier(0.25, 1, 0.5, 1) 0.8s both;
          transform-origin: 62px 57px;
        }

        .node-circle {
          animation: slideInCircle 1.2s cubic-bezier(0.25, 1, 0.5, 1) 0.8s both;
          transform-origin: 135px 45px;
        }

        /* --------------------------------------------------
           STAGE 3 (2.0s - 3.8s): NEURAL PATH DRAWING
           Only begins after square and circle arrive.
           -------------------------------------------------- */
        .neural-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawNeuralPath 1.0s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
        }
        
        .path-1 { animation-delay: 2.00s; }
        .path-2 { animation-delay: 2.08s; }
        .path-3 { animation-delay: 2.16s; }
        .path-4 { animation-delay: 2.24s; }
        .path-5 { animation-delay: 2.32s; }
        .path-6 { animation-delay: 2.40s; }
        .path-7 { animation-delay: 2.48s; }
        .path-8 { animation-delay: 2.56s; }
        .path-9 { animation-delay: 2.64s; }
        .path-10 { animation-delay: 2.72s; }
        .path-11 { animation-delay: 2.80s; } /* Completes drawing around 3.8s */

        /* --------------------------------------------------
           STAGE 4 (3.8s - 4.2s): BASELINE & MARKERS
           -------------------------------------------------- */
        .baseline-line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawNeuralPath 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) 3.8s forwards;
        }

        .baseline-tick {
          opacity: 0;
          animation: tickFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .tick-1 { animation-delay: 3.90s; }
        .tick-2 { animation-delay: 3.95s; }
        .tick-3 { animation-delay: 4.00s; }
        .tick-4 { animation-delay: 4.05s; }

        /* --------------------------------------------------
           STAGE 5 (4.2s - 4.9s): TYPOGRAPHY REVEAL
           -------------------------------------------------- */
        .title-reveal {
          opacity: 0;
          animation: textRevealUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) 4.2s forwards;
        }
        
        .slash-reveal {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: drawNeuralPath 0.4s cubic-bezier(0.25, 1, 0.5, 1) 4.4s forwards;
        }

        .subtitle-reveal {
          opacity: 0;
          animation: textRevealFade 0.5s cubic-bezier(0.25, 1, 0.5, 1) 4.6s forwards;
        }

        /* --------------------------------------------------
           KEYFRAMES
           -------------------------------------------------- */
        @keyframes environmentFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes floatParticle {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
        }

        @keyframes slideInSquare {
          0% { transform: translateX(-120px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInCircle {
          0% { transform: translateX(120px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes drawNeuralPath {
          0% { stroke-dashoffset: 200; opacity: 0; }
          10% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes tickFadeIn {
          0% { opacity: 0; transform: translateY(-3px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes textRevealUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes textRevealFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes transitionExpand {
          0% { transform: scale(1); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1.05); opacity: 0; filter: blur(8px); }
        }

        @keyframes pulseSlow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }

        .anim-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
        .anim-pulse-slower {
          animation: pulseSlow 6s ease-in-out infinite;
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .node-square, .node-circle, .neural-path, .baseline-line, .baseline-tick, .title-reveal, .slash-reveal, .subtitle-reveal, .logo-cinematic-container {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      {/* STAGE 1: Deep Purple Environment & Continuous AI Network */}
      <div className="cinematic-environment"></div>
      
      <div className="absolute inset-0 z-0 overflow-hidden bg-fade-in pointer-events-none">
        {/* Abstract Background Neural Connections */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <g stroke="rgba(192, 132, 252, 0.2)" strokeWidth="1">
            <line x1="15%" y1="20%" x2="35%" y2="40%" className="anim-pulse-slow" />
            <line x1="35%" y1="40%" x2="60%" y2="25%" />
            <line x1="60%" y1="25%" x2="85%" y2="35%" className="anim-pulse-slower" />
            <line x1="25%" y1="75%" x2="45%" y2="65%" />
            <line x1="45%" y1="65%" x2="75%" y2="85%" />
            <line x1="75%" y1="85%" x2="90%" y2="55%" className="anim-pulse-slow" />
            <line x1="35%" y1="40%" x2="45%" y2="65%" />
            <line x1="60%" y1="25%" x2="75%" y2="85%" className="anim-pulse-slower" />
          </g>
        </svg>

        {/* Floating Neural Nodes */}
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-purple-400/50 blur-[1px] anim-pulse-slow"></div>
        <div className="absolute top-[40%] left-[35%] w-2 h-2 rounded-full bg-fuchsia-300/40 blur-[1px]"></div>
        <div className="absolute top-[25%] left-[60%] w-1.5 h-1.5 rounded-full bg-white/40 anim-pulse-slower"></div>
        <div className="absolute top-[35%] left-[85%] w-2 h-2 rounded-full bg-purple-500/30"></div>
        <div className="absolute top-[75%] left-[25%] w-1.5 h-1.5 rounded-full bg-purple-300/40"></div>
        <div className="absolute top-[65%] left-[45%] w-2 h-2 rounded-full bg-white/30 blur-[1px] anim-pulse-slow"></div>
        <div className="absolute top-[85%] left-[75%] w-1.5 h-1.5 rounded-full bg-fuchsia-400/50"></div>
        <div className="absolute top-[55%] left-[90%] w-2 h-2 rounded-full bg-purple-400/40"></div>
        
        {/* Drifting Computational Particles */}
        <div className="ambient-particle" style={{ width: '3px', height: '3px', top: '90%', left: '20%', animationDelay: '0s' }}></div>
        <div className="ambient-particle" style={{ width: '2px', height: '2px', top: '95%', left: '55%', animationDelay: '2s' }}></div>
        <div className="ambient-particle" style={{ width: '4px', height: '4px', top: '85%', left: '80%', animationDelay: '4s' }}></div>
      </div>

      <div className="logo-cinematic-container z-10">
        {/* SVG Structure Strictly Based on club-logo.jpg (Scaled up natively via CSS) */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" className="w-full h-auto">
          <defs>
            {/* 3D Drop Shadow exactly like the image */}
            <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.4"/>
            </filter>
            
            <filter id="light-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5"/>
            </filter>
          </defs>

          {/* STAGE 3: 11 Meticulously Placed Neural Connections */}
          <g stroke="#f1f5f9" strokeWidth="1.25" strokeLinecap="round" fill="none" className="opacity-100">
            <path d="M 60 40 C 75 10, 110 5, 125 30" className="neural-path path-1" />
            <path d="M 75 40 C 90 20, 110 15, 121 35" className="neural-path path-2" />
            <path d="M 79 45 C 95 30, 110 25, 119 40" className="neural-path path-3" />
            <path d="M 79 50 C 95 40, 110 35, 118 45" className="neural-path path-4" />
            <path d="M 79 55 C 95 50, 110 45, 119 50" className="neural-path path-5" />
            <path d="M 79 60 C 95 60, 110 55, 121 55" className="neural-path path-6" />
            <path d="M 79 65 C 95 70, 110 65, 125 60" className="neural-path path-7" />
            <path d="M 79 70 C 95 80, 115 75, 135 62" className="neural-path path-8" />
            <path d="M 75 74 C 95 90, 125 85, 140 60" className="neural-path path-9" />
            <path d="M 65 74 C 95 100, 135 95, 148 53" className="neural-path path-10" />
            <path d="M 55 74 C 90 110, 145 105, 150 45" className="neural-path path-11" />
          </g>

          {/* STAGE 2: Core Elements - Square & Circle w/ 3D Effect */}
          <rect x="45" y="40" width="34" height="34" rx="6" fill="#ffffff" filter="url(#drop-shadow)" className="node-square" />
          <circle cx="135" cy="45" r="17" fill="#ffffff" filter="url(#drop-shadow)" className="node-circle" />

          {/* STAGE 4: Baseline & Ticks */}
          <line x1="50" y1="95" x2="145" y2="95" stroke="#a78bfa" strokeWidth="0.75" className="baseline-line opacity-80" />
          <line x1="60" y1="93" x2="60" y2="97" stroke="#a78bfa" strokeWidth="0.75" className="baseline-line opacity-40" />
          <line x1="72" y1="93" x2="72" y2="97" stroke="#a78bfa" strokeWidth="0.75" className="baseline-line opacity-40" />
          <line x1="102" y1="93" x2="102" y2="97" stroke="#a78bfa" strokeWidth="0.75" className="baseline-line opacity-40" />
          <line x1="112" y1="93" x2="112" y2="97" stroke="#a78bfa" strokeWidth="0.75" className="baseline-line opacity-40" />
          <line x1="125" y1="93" x2="125" y2="97" stroke="#a78bfa" strokeWidth="0.75" className="baseline-line opacity-40" />

          {/* 4 3D Purple Pill Markers */}
          <ellipse cx="66" cy="95" rx="1.5" ry="4.5" fill="#a855f7" filter="url(#light-shadow)" className="baseline-tick tick-1" />
          <ellipse cx="94" cy="95" rx="1.5" ry="4.5" fill="#a855f7" filter="url(#light-shadow)" className="baseline-tick tick-2" />
          <ellipse cx="108" cy="95" rx="1.5" ry="4.5" fill="#a855f7" filter="url(#light-shadow)" className="baseline-tick tick-3" />
          <ellipse cx="138" cy="95" rx="1.5" ry="4.5" fill="#a855f7" filter="url(#light-shadow)" className="baseline-tick tick-4" />

          {/* STAGE 5: Typography */}
          <g className="title-reveal" fill="#ffffff" fontFamily="sans-serif" fontWeight="900" fontSize="22" filter="url(#light-shadow)">
            <text x="75" y="125" textAnchor="end">AI</text>
            <text x="83" y="125" textAnchor="start">ML CLUB</text>
          </g>
          
          <path d="M 75 106 C 76 113, 78 120, 81 129" stroke="#b084fc" strokeWidth="2" fill="none" strokeLinecap="round" className="slash-reveal" filter="url(#light-shadow)"/>


        </svg>
      </div>
    </div>
  );
};
