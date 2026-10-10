import React from 'react';
import { X, Calendar } from 'lucide-react';
import { GalleryItem } from '../../types';

interface GalleryLightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full rounded-2xl glass-panel border border-white/15 bg-dark-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-dark-bg/80 text-white border border-white/10 hover:border-white/30 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative max-h-[70vh] bg-dark-bg flex items-center justify-center overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-contain max-h-[70vh]"
          />
        </div>

        <div className="p-5 border-t border-white/10 bg-dark-surface">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-dark-card text-slate-300 border border-white/10">
              {item.category}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {item.date}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            {item.title}
          </h3>

          {item.description && (
            <p className="text-sm text-slate-300">
              {item.description}
            </p>
          )}

          {item.event_name && (
            <div className="mt-2 text-xs font-mono text-blue-400">
              Event: {item.event_name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
