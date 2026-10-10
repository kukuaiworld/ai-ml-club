import React from 'react';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import { ClubEvent } from '../../types';

interface PastEventGalleryCardProps {
  event: ClubEvent;
  onOpenGallery: (event: ClubEvent) => void;
}

export const PastEventGalleryCard: React.FC<PastEventGalleryCardProps> = ({ event, onOpenGallery }) => {
  const startDate = new Date(event.startDateTime);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const imageCount = event.galleryImages.length;

  return (
    <div 
      className="group relative cursor-pointer rounded-xl overflow-hidden bg-[#0c0a15] border border-white/5 hover:border-purple-500/30 transition-all duration-300"
      onClick={() => onOpenGallery(event)}
    >
      {/* Aspect ratio container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#110f1a]">
        <img
          src={event.coverImage}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a15] via-[#0c0a15]/60 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-purple-500/20 backdrop-blur-md border border-purple-500/50 text-white px-4 py-2 rounded-full flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <ImageIcon className="w-4 h-4" />
            <span className="text-sm font-medium">View Gallery</span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-xs px-2.5 py-1 rounded-md">
            {event.category}
          </span>
        </div>

        {/* Photo Count Badge (if any) */}
        {imageCount > 0 && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-white/90">
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{imageCount} Photos</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center space-x-2 text-sm text-white/50 mb-2">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>{formattedDate}</span>
        </div>
        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
          {event.title}
        </h3>
        <p className="text-white/60 text-sm line-clamp-2">
          {event.description}
        </p>
      </div>
    </div>
  );
};
