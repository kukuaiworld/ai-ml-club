import React from 'react';
import { X, Calendar, Clock, MapPin, User } from 'lucide-react';
import { Activity } from '../../types';

interface ActivityDetailModalProps {
  activity: Activity | null;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  onClose,
}) => {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-xl rounded-2xl glass-panel border border-white/15 bg-dark-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 w-full bg-dark-bg">
          <img
            src={activity.banner_image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-90" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-dark-bg/80 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-5 right-5">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-dark-bg/90 text-slate-200 border border-white/10">
              {activity.category}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              {activity.title}
            </h3>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs font-mono text-slate-300 bg-dark-surface p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{activity.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{activity.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{activity.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>{activity.organizer}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">
              About This Session
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {activity.description}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Status: <strong className="text-white">{activity.status}</strong>
            </span>
            {activity.registration_link && (
              <a
                href={activity.registration_link}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition"
              >
                Register
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
