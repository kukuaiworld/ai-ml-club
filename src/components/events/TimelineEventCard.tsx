import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface TimelineEventCardProps {
  side: 'left' | 'right';
  isActive: boolean;
  onBecomeActive: () => void;
  children: React.ReactNode;
}

export const TimelineEventCard: React.FC<TimelineEventCardProps> = ({ side, isActive, onBecomeActive, children }) => {
  const [ref, inView] = useIntersectionObserver({
    threshold: 0.6,
    rootMargin: '-15% 0px -15% 0px',
  });

  React.useEffect(() => {
    if (inView) {
      onBecomeActive();
    }
  }, [inView, onBecomeActive]);

  const isLeft = side === 'left';
  
  // Container positioning
  const containerFlex = isLeft ? 'md:flex-row-reverse' : 'md:flex-row';
  const marginOffset = isLeft ? 'md:mr-auto md:pr-24' : 'md:ml-auto md:pl-24';
  
  // Animation translations for the card
  const translateInactive = isLeft 
    ? 'translate-x-[10%] md:translate-x-[60px] opacity-0' 
    : '-translate-x-[10%] md:-translate-x-[60px] opacity-0';
  
  // When active: fully visible. When inactive but inView (i.e. another card is active), blurred and smaller.
  const translateActive = isActive 
    ? 'translate-x-0 opacity-100 scale-100 blur-0' 
    : 'translate-x-0 opacity-40 scale-95 blur-[2px]';

  // Branch (Connecting Line) animations
  const branchOrigin = isLeft ? 'md:origin-right origin-left' : 'origin-left';
  const branchScale = inView ? 'scale-x-100' : 'scale-x-0';
  
  // Line positioning
  const linePos = isLeft 
    ? 'left-6 md:left-auto md:-right-24 md:w-24' 
    : 'left-6 md:-left-24 md:w-24';

  // Node styles
  const nodeGlow = isActive ? 'bg-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.8)]' : 'bg-white/20';
  const nodeBorder = isActive ? 'border-purple-300' : 'border-white/10';

  return (
    <div ref={ref} className={`relative flex w-full md:w-1/2 my-6 md:my-10 ${marginOffset} ${containerFlex} items-center group`}>
      
      {/* Desktop Node */}
      <div 
        className={`absolute z-10 w-4 h-4 rounded-full border-2 transition-all duration-700 ease-out 
          left-[20px] md:left-auto ${isLeft ? 'md:-right-[8px]' : 'md:-left-[8px]'}
          ${nodeBorder} ${nodeGlow}
          hidden md:block
        `}
      />
      
      {/* Mobile Node */}
      <div 
        className={`absolute z-10 w-4 h-4 rounded-full border-2 transition-all duration-700 ease-out 
          left-[20px] md:hidden
          ${nodeBorder} ${nodeGlow}
        `}
      />

      {/* The Connecting Line (Branch) */}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-purple-500/50 to-purple-400/10 
          transition-transform duration-700 ease-out delay-100
          w-[calc(100%-2rem)] md:w-12
          ${linePos} ${branchOrigin} ${branchScale}
        `}
      />

      {/* Traveling Light Pulse */}
      {isActive && (
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-8 h-[2px] bg-purple-300 blur-[2px] 
            ${isLeft ? 'md:animate-pulse-left animate-pulse-right' : 'animate-pulse-right'}
            ${linePos}
          `}
        />
      )}

      {/* The Event Card Container */}
      <div 
        className={`relative w-full pl-14 md:pl-0 transition-all duration-700 ease-out delay-75
          ${inView ? translateActive : translateInactive}
        `}
      >
        {children}
      </div>
    </div>
  );
};
