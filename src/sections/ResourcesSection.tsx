import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Star, 
  Search, 
  Filter
} from 'lucide-react';
import { Resource } from '../types';
import { dataStore } from '../services/dataStore';
import { useToast } from '../context/ToastContext';

interface ResourcesSectionProps {
  resources: Resource[];
  isFullPage?: boolean;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  resources,
  isFullPage = false,
}) => {
  const { success } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Deep Learning',
    'Research Papers',
    'Tools',
    'Datasets',
    'AI Agents',
    'Python',
  ];

  const handleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dataStore.starResource(id);
    success('Starred resource!');
  };

  const filtered = resources.filter((res) => {
    const matchesCategory =
      selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.added_by.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayList = isFullPage ? filtered : filtered.slice(0, 6);

  return (
    <section id="resources" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-dark-surface/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              Open Knowledge Base
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Resource <span className="text-purple-400">Hub</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              Curated roadmaps, arXiv paper breakdowns, starter repos, datasets, and GPU deployment guides compiled for club members.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers, roadmaps..."
              className="w-full pl-9 pr-4 py-2 bg-dark-card border border-white/10 focus:border-purple-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pb-6 mb-8 border-b border-white/10">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
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

        {/* Resources Grid */}
        {displayList.length === 0 ? (
          <div className="text-center py-16 rounded-2xl glass-panel border border-white/10 text-slate-400">
            No resources match your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map((res) => (
              <div
                key={res.id}
                className="group rounded-2xl glass-panel border border-white/10 hover:border-purple-400/50 transition-all duration-200 p-6 flex flex-col justify-between hover:shadow-card hover:-translate-y-1 bg-dark-card"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-dark-surface text-slate-300 border border-white/10">
                      {res.category}
                    </span>

                    {res.difficulty && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          res.difficulty === 'Beginner'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : res.difficulty === 'Intermediate'
                            ? 'bg-purple-950/80 text-purple-400 border border-purple-800'
                            : 'bg-indigo-950/80 text-indigo-400 border border-indigo-800'
                        }`}
                      >
                        {res.difficulty}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6 line-clamp-3">
                    {res.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleStar(res.id, e)}
                      className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-amber-400 transition"
                      title="Star Resource"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{res.stars || 0}</span>
                    </button>
                    <span className="text-[11px] font-mono text-slate-500">
                      • {res.file_type}
                    </span>
                  </div>

                  <a
                    href={res.external_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition"
                  >
                    <span>Access Resource</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
