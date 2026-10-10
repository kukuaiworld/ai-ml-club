import React from 'react';
import clubLogoImg from '../assets/club-logo.jpg';

interface ClubLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  useImage?: boolean;
}

/**
 * Pure SVG vector rendition of the GEC Ajmer AI/ML Club emblem
 * (Rounded square connected to circle via curved fiber cables with bottom axis ticks)
 */
export const ClubLogoIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-8 h-8", 
  size = 32 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AI/ML Club Logo"
    >
      <defs>
        <linearGradient id="fiberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e0e7ff" />
          <stop offset="100%" stopColor="#c7d2fe" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Curved Fiber Strands connecting the two nodes */}
      <g stroke="url(#fiberGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.95">
        {/* Upper arches */}
        <path d="M 32 38 C 30 14, 58 14, 66 22" />
        <path d="M 34 40 C 35 20, 60 20, 67 25" />
        <path d="M 36 43 C 40 27, 62 26, 68 29" />
        {/* Core center strands */}
        <path d="M 36 46 C 45 36, 62 34, 69 33" />
        <path d="M 36 49 C 48 45, 63 41, 69 36" />
        {/* Lower dip strands */}
        <path d="M 35 53 C 48 57, 64 50, 68 40" />
        <path d="M 33 56 C 48 68, 65 62, 67 43" />
        <path d="M 31 58 C 46 76, 64 71, 66 45" />
      </g>

      {/* Left Node: 3D Rounded Square */}
      <rect 
        x="18" 
        y="38" 
        width="22" 
        height="22" 
        rx="6" 
        fill="#ffffff" 
        filter="url(#softGlow)" 
      />

      {/* Right Node: 3D Circle */}
      <circle 
        cx="68" 
        cy="33" 
        r="11.5" 
        fill="#ffffff" 
        filter="url(#softGlow)" 
      />

      {/* Bottom Horizontal Axis Line with Marker Beads */}
      <line x1="22" y1="78" x2="78" y2="78" stroke="#a78bfa" strokeWidth="1.2" opacity="0.75" />
      
      {/* Axis Tick Marks & Beads */}
      <line x1="28" y1="75" x2="28" y2="81" stroke="#a78bfa" strokeWidth="1.5" />
      <ellipse cx="28" cy="78" rx="1.5" ry="3.5" fill="#ffffff" />

      <line x1="44" y1="75" x2="44" y2="81" stroke="#a78bfa" strokeWidth="1.5" />
      <ellipse cx="44" cy="78" rx="1.5" ry="3.5" fill="#ffffff" />
      <line x1="47" y1="76" x2="47" y2="80" stroke="#a78bfa" strokeWidth="1" />

      <line x1="54" y1="75" x2="54" y2="81" stroke="#a78bfa" strokeWidth="1.5" />
      <ellipse cx="54" cy="78" rx="1.5" ry="3.5" fill="#ffffff" />

      <line x1="71" y1="75" x2="71" y2="81" stroke="#a78bfa" strokeWidth="1.5" />
      <ellipse cx="71" cy="78" rx="1.5" ry="3.5" fill="#ffffff" />
    </svg>
  );
};

export const ClubLogo: React.FC<ClubLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  useImage = true,
}) => {
  const sizeMap = {
    sm: { img: 'w-7 h-7', text: 'text-sm', sub: 'text-[8px]', gap: 'gap-2.5' },
    md: { img: 'w-10 h-10', text: 'text-base', sub: 'text-[9px]', gap: 'gap-3' },
    lg: { img: 'w-14 h-14', text: 'text-2xl', sub: 'text-[11px]', gap: 'gap-4' },
    xl: { img: 'w-24 h-24 sm:w-28 sm:h-28', text: 'text-4xl sm:text-5xl', sub: 'text-xs sm:text-sm', gap: 'gap-5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      {/* Logo Emblem (Image or Vector) */}
      <div className={`relative ${currentSize.img} rounded-xl overflow-hidden shadow-md shrink-0 border border-white/15 bg-[#25103a] flex items-center justify-center`}>
        {useImage ? (
          <img 
            src={clubLogoImg} 
            alt="AI/ML Club Logo - Engineering College, Ajmer" 
            className="w-full h-full object-cover"
          />
        ) : (
          <ClubLogoIcon className="w-full h-full p-0.5" />
        )}
      </div>

      {/* Typography with Stylized Slash */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-bold tracking-tight text-white flex items-center gap-0.5 ${currentSize.text} leading-none`}>
            <span>AI</span>
            <span className="text-purple-400 font-serif font-black px-0.5 select-none">/</span>
            <span>ML</span>
            <span className="text-blue-500 font-bold ml-1">CLUB</span>
          </div>

          {showSubtitle && (
            <span className={`font-mono tracking-wider text-slate-400 block mt-1 uppercase ${currentSize.sub}`}>
              Engineering College, Ajmer
            </span>
          )}
        </div>
      )}
    </div>
  );
};
