import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Filter, 
  ArrowUpRight, 
  Sparkles,
  Search
} from 'lucide-react';
import { Activity } from '../types';

interface ActivitiesSectionProps {
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  isFullPage?: boolean;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  activities,
  onSelectActivity,
  isFullPage = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Technical Session',
    'Competition',
    'Hackathon',
    'Project Showcase',
    'Club Meeting',
    'AI Challenge',
  ];

  const statuses = ['All', 'Upcoming', 'Live', 'Completed'];

  const filtered = activities.filter((act) => {
    const matchesCategory =
      selectedCategory === 'All' || act.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' || act.status === selectedStatus;
    const matchesQuery =
      !searchQuery ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesQuery;
  });

  const displayList = isFullPage ? filtered : filtered.slice(0, 6);

  return (
    <section id="activities" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-dark-surface/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Events & Sessions
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Club <span className="text-purple-400">Events</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              From our flagship 48-hour hackathons and edge AI challenges to bi-weekly deep tech reading assemblies.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-9 pr-4 py-2 bg-dark-card border border-white/10 focus:border-purple-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-dark-card text-slate-400 border border-white/5 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-mono text-slate-400">Status:</span>
            {statuses.map((stat) => (
              <button
                key={stat}
                onClick={() => setSelectedStatus(stat)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
                  selectedStatus === stat
                    ? 'bg-dark-card text-purple-400 border border-purple-500/40'
                    : 'bg-dark-bg text-slate-400 border border-white/5 hover:text-white'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>

        {/* Activities Cards Grid */}
        {displayList.length === 0 ? (
          <div className="text-center py-16 rounded-2xl glass-panel border border-white/10 text-slate-400">
            No events match your current filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map((activity) => {
              let statusBadge = (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-950/70 text-purple-400 border border-purple-800">
                  {activity.status}
                </span>
              );
              if (activity.status === 'Live') {
                statusBadge = (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/70 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live Now
                  </span>
                );
              } else if (activity.status === 'Completed') {
                statusBadge = (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-dark-bg text-slate-400 border border-white/10">
                    Completed
                  </span>
                );
              }

              return (
                <div
                  key={activity.id}
                  onClick={() => onSelectActivity(activity)}
                  className="group rounded-2xl glass-panel border border-white/10 hover:border-purple-400/50 transition-all duration-200 overflow-hidden flex flex-col justify-between hover:shadow-card hover:-translate-y-1 cursor-pointer bg-dark-card"
                >
                  {/* Card Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-dark-bg">
                    <img
                      src={activity.banner_image}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-dark-bg/90 text-slate-200 border border-white/10 backdrop-blur-md">
                        {activity.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {statusBadge}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {activity.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {activity.time}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2 line-clamp-1">
                        {activity.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                        {activity.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 truncate max-w-[170px]">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        {activity.organizer}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectActivity(activity);
                        }}
                        className="text-xs font-medium text-purple-400 group-hover:text-purple-300 flex items-center gap-1 transition"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
