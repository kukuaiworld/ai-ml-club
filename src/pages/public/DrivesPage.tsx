import React, { useState, useMemo } from 'react';
import { Database, Search, Filter, ExternalLink, Calendar, FolderHeart } from 'lucide-react';
import { EventDrive } from '../../types';

interface DrivesPageProps {
  drives: EventDrive[];
}

export const DrivesPage: React.FC<DrivesPageProps> = ({ drives }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(drives.map(d => d.category).filter(Boolean) as string[]);
    return ['All', ...Array.from(cats)];
  }, [drives]);

  const years = useMemo(() => {
    const yrs = new Set(drives.map(d => {
      if (!d.event_date) return '';
      return new Date(d.event_date).getFullYear().toString();
    }).filter(Boolean));
    return ['All', ...Array.from(yrs).sort().reverse()];
  }, [drives]);

  const filteredDrives = useMemo(() => {
    return drives.filter(drive => {
      const matchesSearch = drive.event_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (drive.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      const matchesCategory = selectedCategory === 'All' || drive.category === selectedCategory;
      const matchesYear = selectedYear === 'All' || (drive.event_date && new Date(drive.event_date).getFullYear().toString() === selectedYear);
      return matchesSearch && matchesCategory && matchesYear;
    }).sort((a, b) => {
      const dateA = a.event_date ? new Date(a.event_date).getTime() : 0;
      const dateB = b.event_date ? new Date(b.event_date).getTime() : 0;
      return dateB - dateA;
    });
  }, [drives, searchQuery, selectedCategory, selectedYear]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            Event Archives
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Event Gallery & <span className="text-purple-400">Drives</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            Access high-quality photos, presentation materials, and resources from our past events. All materials are securely hosted on Google Drive.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-dark-card border border-white/10 p-4 rounded-2xl">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search drives by event name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
            >
              {years.map(yr => <option key={yr} value={yr}>{yr === 'All' ? 'All Years' : yr}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredDrives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrives.map(drive => (
              <div key={drive.id} className="bg-dark-card border border-white/10 rounded-2xl overflow-hidden glass-panel-hover flex flex-col group transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1">
                {drive.cover_image_url ? (
                  <div className="h-48 overflow-hidden relative border-b border-white/10">
                    <img 
                      src={drive.cover_image_url} 
                      alt={drive.event_name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                  </div>
                ) : (
                  <div className="h-32 bg-dark-bg/50 border-b border-white/10 flex items-center justify-center relative overflow-hidden">
                     <FolderHeart className="w-12 h-12 text-white/5" />
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
                  </div>
                )}
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono text-purple-400">
                    {drive.category && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                        {drive.category}
                      </span>
                    )}
                    {drive.event_date && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(drive.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {drive.event_name}
                  </h3>
                  
                  {drive.description && (
                    <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-1">
                      {drive.description}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-4">
                    <a 
                      href={drive.drive_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
                    >
                      Open Google Drive
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-dark-card border border-white/5 rounded-3xl">
            <Database className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No drives found</h3>
            <p className="text-slate-400 max-w-sm text-sm">
              We couldn't find any drive archives matching your current filters. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
