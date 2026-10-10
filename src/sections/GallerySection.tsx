import React, { useState } from 'react';
import { Camera, Calendar, Maximize2, Sparkles, ChevronDown } from 'lucide-react';
import { GalleryItem, ClubEvent } from '../types';
import { TimelineEventCard } from '../components/events/TimelineEventCard';
import { LiveCountdown } from '../components/events/LiveCountdown';

interface GallerySectionProps {
  gallery: GalleryItem[];
  events?: ClubEvent[];
  onSelectEvent?: (event: ClubEvent) => void;
  onOpenLightbox: (item: GalleryItem) => void;
  isFullPage?: boolean;
  mode?: 'grid' | 'timeline';
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  gallery,
  events = [],
  onSelectEvent,
  onOpenLightbox,
  isFullPage = false,
  mode = 'grid',
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  // --- GRID RENDERING ---
  if (mode === 'grid') {
    const uniqueEvents = ['All', ...Array.from(new Set(gallery.map(g => g.event_name || g.title)))].filter(Boolean);
    
    const uniqueMonths = ['All', ...Array.from(new Set(gallery.map(g => {
      if (!g.date) return '';
      const d = new Date(g.date);
      if (isNaN(d.getTime())) return '';
      return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d);
    })))].filter(Boolean);

    const filtered = gallery.filter((item) => {
      const eventName = item.event_name || item.title;
      const matchesEvent = selectedFilter === 'All' || eventName === selectedFilter;
      
      let matchesMonth = true;
      if (selectedMonth !== 'All') {
        if (!item.date) {
          matchesMonth = false;
        } else {
          const d = new Date(item.date);
          if (!isNaN(d.getTime())) {
            const itemMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d);
            matchesMonth = itemMonth === selectedMonth;
          } else {
            matchesMonth = false;
          }
        }
      }
      return matchesEvent && matchesMonth;
    });

    const displayList = isFullPage ? filtered : filtered.slice(0, 6);

    return (
      <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/40">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
                <Camera className="w-3.5 h-3.5 text-purple-400" />
                Visual Archive
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Moments & <span className="text-purple-400">Milestones</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
                Capturing hackathons, robotics flight trials, guest keynotes, and hardware rack assemblies.
              </p>
              <div className="mt-3 text-xs font-mono text-purple-400/80 bg-purple-900/10 inline-block px-3 py-1.5 rounded-lg border border-purple-500/10">
                Note: Gallery content is curated and updated exclusively by the Admin.
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-dark-card rounded-xl border border-white/10">
                <span className="text-xs font-mono text-slate-400 px-2">Event:</span>
                <select 
                  value={selectedFilter} 
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-transparent text-sm text-slate-300 border-none focus:ring-0 outline-none cursor-pointer max-w-[200px] truncate"
                >
                  {uniqueEvents.map((ev) => (
                    <option key={ev} value={ev} className="bg-dark-card text-white">{ev}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-dark-card rounded-xl border border-white/10">
                <span className="text-xs font-mono text-slate-400 px-2">Month:</span>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-sm text-slate-300 border-none focus:ring-0 outline-none cursor-pointer"
                >
                  {uniqueMonths.map((m) => (
                    <option key={m} value={m} className="bg-dark-card text-white">{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Masonry / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(item)}
                className="group relative h-72 rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-purple-400/50 transition-all duration-200 cursor-pointer hover:shadow-card hover:-translate-y-1 bg-dark-card"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-85" />

                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-dark-bg/90 text-slate-200 border border-white/10 backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-dark-bg/80 border border-white/10 text-slate-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-300 line-clamp-1 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- TIMELINE RENDERING (Zig Zag) ---
  
  // Sort and filter events
  const upcomingEvents = events
    .filter(e => e.eventStatus === 'Upcoming' || e.eventStatus === 'Live')
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());

  const pastEvents = events
    .filter(e => e.eventStatus === 'Completed')
    .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime());

  // Past events first, then upcoming events
  const allEvents = [...pastEvents, ...upcomingEvents];

  // Helper to format date
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr));
  };

  const formatTime = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(dateStr));
  };

  return (
    <section className="relative py-12 md:py-24 px-6 max-w-7xl mx-auto w-full">
      {/* THE CENTRAL VERTICAL TIMELINE SPINE */}
      <div className="absolute top-12 md:top-24 bottom-12 left-10 md:left-1/2 w-[2px] bg-gradient-to-b from-purple-600/0 via-white/10 to-purple-600/0 -translate-x-1/2 z-0" />

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="mb-16 w-full text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            OUR JOURNEY & UPCOMING EVENTS
            <Camera className="w-6 h-6 text-purple-400" />
          </h2>
          <p className="text-white/60">Explore our past milestones and get ready for what's next.</p>
        </div>

        {allEvents.length > 0 ? (
          <div className="w-full relative">
            {allEvents.map((event, index) => {
              const isPast = event.eventStatus === 'Completed';
              const isUpcoming = !isPast;
              const side = index % 2 === 0 ? "left" : "right";
              const galleryImage = event.galleryImages?.[0];
              const displayImage = galleryImage?.image_url || event.coverImage;

              return (
                <TimelineEventCard 
                  key={event.id} 
                  side={side}
                  isActive={activeEventId === event.id}
                  onBecomeActive={() => setActiveEventId(event.id)}
                >
                  <div className={`flex flex-col bg-dark-card border border-white/5 rounded-2xl overflow-hidden glass-panel-hover group max-w-sm ${side === 'left' ? 'ml-auto' : ''} ${activeEventId === event.id ? 'ring-1 ring-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]' : ''}`}>
                    {displayImage && (
                      <div className={`h-${isPast ? '28' : '32'} w-full overflow-hidden relative`}>
                        <img src={displayImage} alt={event.title} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 ${isPast ? 'grayscale-[30%] group-hover:grayscale-0' : ''}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${isPast ? 'bg-dark-bg/80 text-slate-300' : 'bg-purple-500/20 text-purple-300'} border border-white/10 backdrop-blur-md`}>
                            {event.category}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 md:p-5 flex flex-col gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-purple-300 font-mono mb-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(event.startDateTime)}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">{event.title}</h3>
                        <p className="text-slate-400 text-xs line-clamp-3 mb-3">{event.description}</p>
                        
                        {event.venue && isUpcoming && (
                          <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-2">
                            Location: <span className="text-slate-300">{event.venue}</span>
                          </div>
                        )}
                      </div>

                      {isUpcoming && (
                        <div className="w-full py-3 border-y border-white/5 bg-white/[0.02] rounded-lg scale-95">
                          <LiveCountdown targetDate={event.startDateTime} />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-1">
                        {isPast ? (
                          <button 
                            onClick={() => {
                              if (galleryImage) {
                                onOpenLightbox({
                                  ...galleryImage,
                                  title: event.title,
                                  description: event.description,
                                });
                              } else {
                                onSelectEvent?.(event);
                              }
                            }}
                            className="px-4 py-2 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 text-[11px] font-semibold transition-colors border border-purple-500/20 flex items-center gap-1.5"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            See Detail
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => onSelectEvent?.(event)}
                              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-semibold transition-colors border border-white/10"
                            >
                              Details
                            </button>
                            <button 
                              onClick={() => onSelectEvent?.(event)}
                              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
                            >
                              Register
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TimelineEventCard>
              );
            })}
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="bg-[#0c0a15] border border-white/5 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
              <Calendar className="w-8 h-8 text-white/20 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Our journey starts here.</h3>
              <p className="text-sm text-white/50">Stay tuned for upcoming AI/ML Club events.</p>
            </div>
          </div>
        )}
      </div>

    </section>
  );
};
