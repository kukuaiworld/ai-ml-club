import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  ArrowLeft, 
  Cpu, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ClubNotification } from '../../types';
import { dataStore } from '../../services/dataStore';

interface AdminHeaderProps {
  activeTab: string;
  onSelectTab: (tab: any) => void;
  onReturnToSite: () => void;
  onToggleMobileSidebar: () => void;
  notifications: ClubNotification[];
  onMarkNotificationRead: (id: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onSelectTab,
  onReturnToSite,
  onToggleMobileSidebar,
  notifications,
  onMarkNotificationRead,
}) => {
  const { user, role } = useAuth();
  const settings = dataStore.getSettings();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const unreadNotifs = notifications.filter(n => !n.read);

  const formatTabName = (tab: string) => {
    switch(tab) {
      case 'overview': return 'Executive Overview';
      case 'join-requests': return 'Member Join Requests';
      case 'achievement-requests': return 'Achievement Requests';
      case 'users': return 'Users & Governance';
      case 'settings': return 'Platform Settings';
      case 'activities': return 'Activities & Events';
      case 'workshops': return 'Workshops & Bootcamps';
      case 'projects': return 'Project Incubation';
      case 'resources': return 'Knowledge Resources';
      case 'gallery': return 'Media Gallery';
      case 'messages': return 'Contact Inquiries';
      case 'achievements': return 'Club Achievements';
      case 'notifications': return 'Broadcast Alerts';
      case 'analytics': return 'Telemetry & Analytics';
      case 'profile': return 'Admin Profile';
      default: return tab.charAt(0).toUpperCase() + tab.slice(1);
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 hidden sm:inline">Admin Console</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="text-purple-400 font-semibold bg-purple-950/60 border border-purple-800/60 px-2.5 py-1 rounded-md">
            {formatTabName(activeTab)}
          </span>
        </div>
      </div>

      {/* Center: System Status Pill */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
        <Cpu className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-slate-300">{settings.clusterStatusText || '8x RTX 4090 Online'}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500" />
            )}
          </button>

          {notifDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs"
              onMouseLeave={() => setNotifDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between font-mono">
                <span className="font-semibold text-white">System Alerts</span>
                <span className="text-[10px] text-purple-400">{unreadNotifs.length} Unread</span>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 font-mono">No notifications</div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3 cursor-pointer hover:bg-slate-800/60 transition ${
                        !n.read ? 'bg-purple-950/20' : ''
                      }`}
                    >
                      <div className="font-semibold text-slate-200 flex items-center justify-between">
                        <span>{n.title}</span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            {user?.name.charAt(0) || 'A'}
          </div>
          <div className="text-left hidden lg:block">
            <div className="text-xs font-semibold text-white truncate max-w-[120px]">{user?.name}</div>
            <div className="text-[10px] font-mono text-purple-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{role}</span>
            </div>
          </div>
        </div>

        {/* Return to Public Website */}
        <button
          onClick={onReturnToSite}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition border border-slate-700 shadow-sm"
          title="Exit Admin Panel and view live site"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Live Website</span>
        </button>
      </div>
    </header>
  );
};
