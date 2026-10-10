import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface PublicPageHeaderProps {
  badge: string;
  badgeIcon?: React.ReactNode;
  title: string;
  highlightedTitle?: string;
  subtitle: string;
  breadcrumbs?: { label: string; id?: string }[];
  onNavigate?: (id: string) => void;
}

export const PublicPageHeader: React.FC<PublicPageHeaderProps> = ({
  badge,
  badgeIcon,
  title,
  highlightedTitle,
  subtitle,
  breadcrumbs = [],
  onNavigate,
}) => {
  return (
    <section className="pt-36 sm:pt-40 pb-12 px-4 sm:px-6 lg:px-8 border-b border-purple-400/15 relative overflow-hidden bg-gradient-to-b from-[#25083d]/75 via-[#170629]/55 to-transparent">
      {/* Multi-Shade Purple Ambient Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-fuchsia-600/12 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
          <button
            data-allow-visitor="true"
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-1 hover:text-white active:scale-95 transition-all duration-150"
          >
            <Home className="w-3.5 h-3.5 text-purple-400" />
            <span>Home</span>
          </button>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              {b.id && onNavigate ? (
                <button
                  onClick={() => onNavigate(b.id!)}
                  className="hover:text-white active:scale-95 transition-all duration-150"
                >
                  {b.label}
                </button>
              ) : (
                <span className="text-purple-300 font-medium">{b.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest mb-4 shadow-sm">
          {badgeIcon}
          <span>{badge}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl">
          {title}{' '}
          {highlightedTitle && (
            <span className="gradient-text-purple">{highlightedTitle}</span>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
};
