import React from 'react';
import { MapPin, Calendar, Users, ExternalLink, ArrowRight, PlayCircle } from 'lucide-react';
import { ClubEvent } from '../../types';
import { LiveCountdown } from './LiveCountdown';

interface EventCardProps {
  event: ClubEvent;
  onViewDetails: (event: ClubEvent) => void;
  onRegister?: (event: ClubEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails, onRegister }) => {
  const isLive = event.eventStatus === 'Live';
  const isCompleted = event.eventStatus === 'Completed';

  const startDate = new Date(event.startDateTime);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="group relative bg-[#0c0a15] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative h-56 md:h-64 overflow-hidden bg-[#110f1a]">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a15] via-[#0c0a15]/50 to-transparent" />
        
        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {isLive ? (
            <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Live Now</span>
            </div>
          ) : (
            <div className="bg-purple-500/20 border border-purple-500/30 backdrop-blur-md px-3 py-1 rounded-full text-purple-300 text-xs font-medium">
              {event.category}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative">
        <div className="flex items-center space-x-4 mb-4 text-sm text-white/50">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-white/60 text-sm mb-6 line-clamp-2">
          {event.description}
        </p>

        <div className="flex flex-col space-y-3 mt-auto">
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <MapPin className="w-4 h-4 text-white/40" />
            <span className="truncate">{event.venue}</span>
          </div>
          {event.organizer && (
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <Users className="w-4 h-4 text-white/40" />
              <span className="truncate">Organized by {event.organizer}</span>
            </div>
          )}
        </div>

        {/* Live Countdown */}
        {event.eventStatus === 'Upcoming' && (
          <div className="mt-6 pt-6 border-t border-white/5">
            <LiveCountdown 
              targetDate={event.startDateTime} 
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => onViewDetails(event)}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 ml-2 text-white/40 group-hover/btn:text-purple-400 transition-colors group-hover/btn:translate-x-1" />
          </button>
          
          {event.eventStatus === 'Upcoming' && event.registrationStatus === 'Open' && (
            <button
              onClick={() => onRegister?.(event)}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center"
            >
              Register Now
            </button>
          )}

          {event.eventStatus === 'Upcoming' && event.registrationStatus === 'Closed' && (
            <button
              disabled
              className="flex-1 bg-white/5 border border-white/5 text-white/40 px-4 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed flex items-center justify-center"
            >
              Registration Closed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
