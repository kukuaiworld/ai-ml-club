import React, { useState, useEffect } from 'react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { ScrollProgress } from '../ScrollProgress';

import { NeuralNetworkBackground } from '../NeuralNetworkBackground';
import { FiberStructureBackground } from '../FiberStructureBackground';
import { PageTransitionOverlay } from '../PageTransitionOverlay';
import { AnimatedLogoLoader } from '../AnimatedLogoLoader';

interface PublicLayoutProps {
  currentTab: string;
  onNavigate: (tabId: string) => void;
  onOpenSearch: () => void;
  onClickCapture?: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
  onClickCapture,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(currentTab === 'home');
  const [showOverlay, setShowOverlay] = useState(currentTab === 'home');

  useEffect(() => {
    if (currentTab === 'home' && isLoading) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 5500); // Wait for the 5.5s boot sequence
      
      const overlayTimer = setTimeout(() => {
        setShowOverlay(false);
      }, 6500); // Wait for the fade out to finish

      return () => {
        clearTimeout(timer);
        clearTimeout(overlayTimer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [currentTab, isLoading]);

  return (
    <div
      onClickCapture={onClickCapture}
      className="min-h-screen bg-gradient-to-br from-[#1b062d] via-[#120520] to-[#23083a] text-slate-100 flex flex-col selection:bg-purple-600/30 selection:text-purple-200 relative overflow-x-hidden"
    >
      {/* Multi-Shade Purple Color Grading Ambient Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Royal Plum & Aubergine Base Glow (Top Left) */}
        <div className="absolute -top-32 -left-32 w-[38rem] h-[38rem] rounded-full bg-purple-900/30 blur-[130px]" />
        {/* Electric Violet & Amethyst Mid-Tone Glow (Top Right) */}
        <div className="absolute top-1/4 -right-28 w-[34rem] h-[34rem] rounded-full bg-violet-700/20 blur-[140px]" />
        {/* Warm Orchid-Magenta Purple Accent Glow (Center-Bottom) */}
        <div className="absolute bottom-12 left-1/3 w-[40rem] h-[30rem] rounded-full bg-fuchsia-900/20 blur-[150px]" />
        {/* Deep Lavender Core Ambient (Center) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[32rem] rounded-full bg-purple-700/15 blur-[160px]" />
      </div>

      {/* 3D Background: Neural Network on Home, Fiber Structure on Inner Pages */}
      {currentTab === 'home' ? (
        <NeuralNetworkBackground key="neural-network-bg" isInitializing={showOverlay} />
      ) : (
        <FiberStructureBackground key="fiber-structure-bg" />
      )}

      {/* Subtle Technical Grid Overlay */}
      <div className="fixed inset-0 bg-subtle-grid pointer-events-none z-0 opacity-30" />

      {/* Multi-Shade Plum Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(27,6,45,0.45)_55%,rgba(14,4,25,0.82)_100%)]" />

      {/* Animated SVG Logo Loading Overlay */}
      <AnimatedLogoLoader isLoading={isLoading} />

      {/* Main Content Container (Hidden during load) */}
      <div className={`relative z-10 flex flex-col flex-1 w-full transition-opacity duration-1000 ease-in-out ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Scroll Progress Bar */}
        <ScrollProgress />

        {/* Custom Cursor */}

        {/* Quantum Page Transition Overlay */}
        <PageTransitionOverlay currentTab={currentTab} />

        {/* Common Header with Integrated Navigation */}
        <PublicHeader
          currentTab={currentTab}
          onNavigate={onNavigate}
          onOpenSearch={onOpenSearch}
        />

        {/* Semantic Main Container for Page Sections */}
        <main className="flex-1 relative w-full animate-page-reveal" key={currentTab}>
          {children}
        </main>

        {/* Common Public Footer */}
        <PublicFooter onNavigate={onNavigate} />
      </div>
    </div>
  );
};
