import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Calendar, 
  Wrench, 
  FolderGit2, 
  BookOpen, 
  Camera, 
  MessageSquare, 
  Trophy, 
  Award,
  Bell, 
  BarChart3, 
  User, 
  UserPlus,
  LogOut, 
  X, 
  ExternalLink,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { ClubLogo } from '../ClubLogo';
import { useAuth } from '../../context/AuthContext';
import { AdminTabType } from '../../types';
import { dataStore } from '../../services/dataStore';

interface AdminSidebarProps {
  activeTab: AdminTabType;
  onSelectTab: (tab: AdminTabType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onReturnToSite: () => void;
  unreadMessagesCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onReturnToSite,
  unreadMessagesCount,
}) => {
  const { user, role, logout } = useAuth();
  const pendingJoinCount = dataStore
    .getApplications()
    .filter((a) => a.status === 'Pending').length;
  const pendingAchievementCount = dataStore
    .getMemberAchievements(true)
    .filter((a) => a.status === 'Pending').length;

  const navGroups = [
    {
      title: 'Core',
      items: [
        { id: 'overview' as AdminTabType, label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'analytics' as AdminTabType, label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Administration',
      items: [
        { 
          id: 'applications' as AdminTabType, 
          label: 'Applications', 
          icon: <UserPlus className="w-4 h-4" />,
          badge: pendingJoinCount > 0 ? pendingJoinCount : undefined
        },
        { 
          id: 'achievement-requests' as AdminTabType, 
          label: 'Achievement Requests', 
          icon: <Award className="w-4 h-4" />,
          badge: pendingAchievementCount > 0 ? pendingAchievementCount : undefined
        },
        { id: 'users' as AdminTabType, label: 'Users & Roles', icon: <Users className="w-4 h-4" /> },
        { id: 'settings' as AdminTabType, label: 'Settings', icon: <Settings className="w-4 h-4" /> },
        { id: 'achievements' as AdminTabType, label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Programs & Events',
      items: [
        { id: 'course-notices' as AdminTabType, label: 'Course Notices', icon: <Bell className="w-4 h-4" /> },
        { id: 'activities' as AdminTabType, label: 'Activities', icon: <Calendar className="w-4 h-4" /> },
        { id: 'workshops' as AdminTabType, label: 'Workshops', icon: <Wrench className="w-4 h-4" /> },
        { id: 'projects' as AdminTabType, label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Content & Comms',
      items: [
        { id: 'resources' as AdminTabType, label: 'Resources', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'gallery' as AdminTabType, label: 'Media Gallery', icon: <Camera className="w-4 h-4" /> },
        { id: 'drives' as AdminTabType, label: 'Drives', icon: <FolderGit2 className="w-4 h-4" /> },
        { 
          id: 'messages' as AdminTabType, 
          label: 'Inquiries', 
          icon: <MessageSquare className="w-4 h-4" />,
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
        },
        { id: 'notifications' as AdminTabType, label: 'Alerts & Broadcast', icon: <Bell className="w-4 h-4" /> },
        { id: 'profile' as AdminTabType, label: 'My Profile', icon: <User className="w-4 h-4" /> },
      ]
    }
  ];

  const handleItemClick = (id: AdminTabType) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Branding */}
          <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClubLogo size="sm" showSubtitle={false} />
              <div>
                <div className="text-xs font-bold text-white tracking-wide">ADMIN PORTAL</div>
                <div className="text-[10px] font-mono text-purple-400">Control Center</div>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx}>
                <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-purple-600 text-white font-semibold shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isActive ? 'bg-white text-purple-700' : 'bg-purple-600 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom User Controls */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs mb-2">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                {user?.name.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <div className="font-semibold text-white truncate text-xs">{user?.name}</div>
                <div className="text-[10px] font-mono text-purple-400">{role}</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onReturnToSite}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Website</span>
          </button>
        </div>
      </aside>
    </>
  );
};
