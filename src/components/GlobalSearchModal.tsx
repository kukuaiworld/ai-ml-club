import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, Wrench, FolderGit2, BookOpen, User, ArrowRight } from 'lucide-react';
import { dataStore } from '../services/dataStore';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (targetId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activities = dataStore.getActivities();
  const workshops = dataStore.getWorkshops();
  const projects = dataStore.getProjects();
  const resources = dataStore.getResources();
  const team = dataStore.getTeam();

  const q = query.toLowerCase().trim();

  const filteredActivities = q
    ? activities.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      )
    : [];

  const filteredWorkshops = q
    ? workshops.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.topic.toLowerCase().includes(q) ||
          w.speaker.toLowerCase().includes(q)
      )
    : [];

  const filteredProjects = q
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q) ||
          p.tech_stack.some((t) => t.toLowerCase().includes(q))
      )
    : [];

  const filteredResources = q
    ? resources.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      )
    : [];

  const filteredTeam = q
    ? team.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.position.toLowerCase().includes(q) ||
          t.specialization.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    filteredActivities.length +
    filteredWorkshops.length +
    filteredProjects.length +
    filteredResources.length +
    filteredTeam.length;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl glass-panel border border-white/15 shadow-2xl overflow-hidden bg-dark-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI/ML workshops, projects, research, resources..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-dark-surface border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="text-center py-10 text-slate-500 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p>Search across workshops, projects, resources, and team members.</p>
              <div className="flex justify-center gap-2 mt-4 font-mono text-xs">
                <span className="px-2 py-1 rounded bg-dark-surface border border-white/5 text-slate-400">
                  "PyTorch"
                </span>
                <span className="px-2 py-1 rounded bg-dark-surface border border-white/5 text-slate-400">
                  "Agents"
                </span>
                <span className="px-2 py-1 rounded bg-dark-surface border border-white/5 text-slate-400">
                  "Hackathon"
                </span>
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">
              No matching records found for "{query}".
            </div>
          )}

          {/* Workshops */}
          {filteredWorkshops.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase text-blue-400 tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Workshops ({filteredWorkshops.length})
              </div>
              <div className="space-y-1.5">
                {filteredWorkshops.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => {
                      onNavigate('workshops');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface hover:bg-white/5 border border-white/5 hover:border-blue-500/30 transition cursor-pointer group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-blue-300">
                        {w.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        Topic: {w.topic} • By {w.speaker}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase text-indigo-400 tracking-wider mb-2 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" />
                Projects ({filteredProjects.length})
              </div>
              <div className="space-y-1.5">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onNavigate('projects');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface hover:bg-white/5 border border-white/5 hover:border-indigo-500/30 transition cursor-pointer group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-indigo-300">
                        {p.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        Domain: {p.domain} • Stack: {p.tech_stack.slice(0, 3).join(', ')}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {filteredActivities.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase text-emerald-400 tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Activities & Events ({filteredActivities.length})
              </div>
              <div className="space-y-1.5">
                {filteredActivities.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      onNavigate('activities');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface hover:bg-white/5 border border-white/5 hover:border-emerald-500/30 transition cursor-pointer group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-emerald-300">
                        {a.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {a.category} • {a.date} ({a.status})
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {filteredResources.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase text-amber-400 tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Resources ({filteredResources.length})
              </div>
              <div className="space-y-1.5">
                {filteredResources.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onNavigate('resources');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface hover:bg-white/5 border border-white/5 hover:border-amber-500/30 transition cursor-pointer group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-amber-300">
                        {r.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {r.category} • {r.file_type}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team */}
          {filteredTeam.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Team Members ({filteredTeam.length})
              </div>
              <div className="space-y-1.5">
                {filteredTeam.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onNavigate('team');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface hover:bg-white/5 border border-white/5 hover:border-white/20 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={t.photo}
                        alt={t.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {t.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {t.position} • {t.specialization}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-dark-surface border-t border-white/10 text-[11px] font-mono text-slate-500 flex justify-between items-center">
          <span>Search Repository</span>
          <span>Click result to navigate</span>
        </div>
      </div>
    </div>
  );
};
