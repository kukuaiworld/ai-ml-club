import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Wrench, 
  FolderGit2, 
  BookOpen, 
  Camera, 
  Users, 
  Trophy, 
  MessageSquare, 
  BarChart3, 
  Bell, 
  User, 
  UserPlus,
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Sparkles,
  Settings,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { dataStore } from '../../services/dataStore';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminUsersSection } from './AdminUsersSection';
import { AdminApplicationsSection } from './AdminApplicationsSection';
import { AdminAchievementRequestsSection } from './AdminAchievementRequestsSection';
import { AdminCourseNoticesSection } from './AdminCourseNoticesSection';
import { AdminSettingsSection } from './AdminSettingsSection';
import { AdminDrivesSection } from './AdminDrivesSection';
import { 
  Activity, 
  Workshop, 
  Project, 
  Resource, 
  GalleryItem, 
  AchievementStats, 
  MemberAchievement,
  CourseNotice,
  EventDrive,
  ContactMessage, 
  ClubNotification,
  UserProfile,
  AdminTabType,
  ActivityCategory
} from '../../types';

interface AdminDashboardPageProps {
  onReturnToSite: () => void;
  initialTab?: AdminTabType;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ 
  onReturnToSite,
  initialTab = 'overview' 
}) => {
  const { user, role, isAdmin, isCoreMember, updateProfile } = useAuth();
  const { success, error, info } = useToast();
  
  const [activeTab, setActiveTab] = useState<AdminTabType>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('admin/')) {
      const sub = hash.replace('admin/', '') as AdminTabType;
      return sub || initialTab;
    }
    return initialTab;
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [drives, setDrives] = useState<EventDrive[]>([]);
  const [achievements, setAchievements] = useState<AchievementStats>(dataStore.getAchievements());
  const [memberAchievements, setMemberAchievements] = useState<MemberAchievement[]>([]);
  const [courseNotices, setCourseNotices] = useState<CourseNotice[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [notifications, setNotifications] = useState<ClubNotification[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  // Modals state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const refreshData = () => {
    setActivities(dataStore.getActivities(true));
    setWorkshops(dataStore.getWorkshops(true));
    setProjects(dataStore.getProjects(true));
    setResources(dataStore.getResources());
    setGallery(dataStore.getGallery());
    setDrives(dataStore.getDrives());
    setAchievements(dataStore.getAchievements());
    setMemberAchievements(dataStore.getMemberAchievements(true));
    setCourseNotices(dataStore.getCourseNotices(true));
    setMessages(dataStore.getMessages());
    setNotifications(dataStore.getNotifications());
    setProfiles(dataStore.getProfiles());
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = dataStore.subscribe(refreshData);
    return () => unsubscribe();
  }, []);

  const handleTabChange = (tab: AdminTabType) => {
    setActiveTab(tab);
    window.location.hash = `admin/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for Activity
  const handleSaveActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const activityData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as ActivityCategory,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      venue: formData.get('venue') as string,
      organizer: formData.get('organizer') as string,
      banner_image: (formData.get('banner_image') as string) || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
      status: formData.get('status') as 'Upcoming' | 'Live' | 'Completed',
      registration_link: formData.get('registration_link') as string,
      published: formData.get('published') === 'true',
    };

    if (editingActivity) {
      dataStore.updateActivity(editingActivity.id, activityData);
      success('Activity updated successfully!');
    } else {
      dataStore.addActivity(activityData);
      success('New activity published!');
    }
    setIsActivityModalOpen(false);
    setEditingActivity(null);
  };

  // Handlers for Workshop
  const handleSaveWorkshop = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const skills = (formData.get('required_skills') as string)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const workshopData = {
      name: formData.get('name') as string,
      topic: formData.get('topic') as string,
      description: formData.get('description') as string,
      speaker: formData.get('speaker') as string,
      speaker_bio: formData.get('speaker_bio') as string,
      speaker_avatar: (formData.get('speaker_avatar') as string) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      venue: formData.get('venue') as string,
      max_participants: Number(formData.get('max_participants')) || 60,
      registered_count: editingWorkshop ? editingWorkshop.registered_count : 0,
      status: formData.get('status') as 'Upcoming' | 'Live' | 'Completed',
      banner_image: (formData.get('banner_image') as string) || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
      required_skills: skills,
      workshop_resources: formData.get('workshop_resources') as string,
      registration_open: formData.get('registration_open') === 'true',
      published: formData.get('published') === 'true',
    };

    if (editingWorkshop) {
      dataStore.updateWorkshop(editingWorkshop.id, workshopData);
      success('Workshop updated successfully!');
    } else {
      dataStore.addWorkshop(workshopData);
      success('New workshop created!');
    }
    setIsWorkshopModalOpen(false);
    setEditingWorkshop(null);
  };

  // Handlers for Project
  const handleSaveProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const stack = (formData.get('tech_stack') as string)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const projectData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      domain: formData.get('domain') as any,
      team_members: [{ name: user?.name || 'Lead', role: 'Architect' }],
      tech_stack: stack,
      github_url: formData.get('github_url') as string,
      demo_url: formData.get('demo_url') as string,
      cover_image: (formData.get('cover_image') as string) || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
      status: isCoreMember ? 'Approved' as const : 'Pending Review' as const,
      submitted_by: user?.name || 'Anonymous',
      featured: formData.get('featured') === 'true',
    };

    if (editingProject) {
      dataStore.updateProject(editingProject.id, projectData);
      success('Project updated!');
    } else {
      dataStore.addProject(projectData);
      success(isCoreMember ? 'Project published!' : 'Project submitted for admin review!');
    }
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleSaveResource = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    dataStore.addResource({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as any,
      external_link: formData.get('external_link') as string,
      file_type: formData.get('file_type') as string,
      difficulty: formData.get('difficulty') as any,
      added_by: user?.name || 'Club Member',
    });
    success('Resource added to library!');
    setIsResourceModalOpen(false);
  };

  const handleSaveGallery = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    dataStore.addGalleryItem({
      title: formData.get('title') as string,
      category: formData.get('category') as any,
      image_url: formData.get('image_url') as string,
      date: formData.get('date') as string,
      event_name: formData.get('event_name') as string,
      description: formData.get('description') as string,
      uploaded_by: user?.name,
    });
    success('Photo added to gallery!');
    setIsGalleryModalOpen(false);
  };

  const handleSaveAchievements = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    dataStore.updateAchievements({
      members_count: Number(formData.get('members_count')),
      workshops_count: Number(formData.get('workshops_count')),
      projects_count: Number(formData.get('projects_count')),
      hackathons_count: Number(formData.get('hackathons_count')),
      competitions_won_count: Number(formData.get('competitions_won_count')),
    });
    success('Achievement counters updated successfully!');
  };

  const unreadMessagesCount = messages.filter(m => m.status === 'Unread').length;

  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={handleTabChange}
      onReturnToSite={onReturnToSite}
      notifications={notifications}
      onMarkNotificationRead={(id) => dataStore.markNotificationAsRead(id)}
      unreadMessagesCount={unreadMessagesCount}
    >
      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-page-reveal">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Real-time operational overview, key telemetry, and recent submissions for the club.
            </p>
          </div>

          {/* KPI Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase">Enrolled Members</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">{achievements.members_count}</div>
              <div className="text-[11px] text-emerald-400 mt-2 font-mono flex items-center gap-1">
                <span>↑ 18%</span>
                <span className="text-slate-500">this semester</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase">Active Workshops</span>
                <Wrench className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">{workshops.length}</div>
              <div className="text-[11px] text-purple-400 mt-2 font-mono">
                {workshops.filter(w => w.status === 'Upcoming').length} Upcoming
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase">Projects Built</span>
                <FolderGit2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">{projects.length}</div>
              <div className="text-[11px] text-blue-400 mt-2 font-mono">
                {projects.filter(p => p.status === 'Approved').length} Approved
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase">Unread Messages</span>
                <MessageSquare className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">{unreadMessagesCount}</div>
              <div className="text-[11px] text-amber-400 mt-2 font-mono">
                {unreadMessagesCount > 0 ? 'Pending replies' : 'All responded'}
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-4">
              Quick Administrative Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setEditingActivity(null); setIsActivityModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>New Activity</span>
              </button>

              <button
                onClick={() => { setEditingWorkshop(null); setIsWorkshopModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition border border-slate-700"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                <span>Schedule Workshop</span>
              </button>

              <button
                onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition border border-slate-700"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                <span>Add Project</span>
              </button>

              <button
                onClick={() => handleTabChange('course-notices')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-medium text-xs transition border border-purple-500/40"
              >
                <Bell className="w-4 h-4 text-purple-400" />
                <span>Course Notices ({courseNotices.length})</span>
              </button>

              <button
                onClick={() => handleTabChange('applications')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-medium text-xs transition border border-amber-500/40"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>
                  Applications ({dataStore.getApplications().filter(a => a.status === 'Pending').length})
                </span>
              </button>

              <button
                onClick={() => handleTabChange('achievement-requests')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-medium text-xs transition border border-purple-500/40"
              >
                <Trophy className="w-4 h-4 text-purple-400" />
                <span>
                  Achievement Requests ({memberAchievements.filter(a => a.status === 'Pending').length})
                </span>
              </button>

              <button
                onClick={() => handleTabChange('users')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition border border-slate-700"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Manage Users</span>
              </button>

              <button
                onClick={() => handleTabChange('settings')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition border border-slate-700"
              >
                <Settings className="w-4 h-4 text-purple-400" />
                <span>Club Settings</span>
              </button>
            </div>
          </div>

          {/* Recent Inquiries & Activities Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Activities Preview */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Upcoming Activities</span>
                </h3>
                <button
                  onClick={() => handleTabChange('activities')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-mono"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {activities.slice(0, 3).map((act) => (
                  <div key={act.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">{act.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{act.date} • {act.venue}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Messages Preview */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>Recent Inquiries</span>
                </h3>
                <button
                  onClick={() => handleTabChange('messages')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-mono"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-xs text-slate-500 font-mono py-4 text-center">No messages yet.</div>
                ) : (
                  messages.slice(0, 3).map((msg) => (
                    <div key={msg.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">{msg.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{msg.subject}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        msg.status === 'Unread' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1B. APPLICATIONS SECTION */}
      {activeTab === 'applications' && (
        <div className="animate-page-reveal">
          <AdminApplicationsSection />
        </div>
      )}

      {/* 1C. ACHIEVEMENT REQUESTS SECTION */}
      {activeTab === 'achievement-requests' && (
        <div className="animate-page-reveal">
          <AdminAchievementRequestsSection
            memberAchievements={memberAchievements}
            onRefresh={refreshData}
          />
        </div>
      )}

      {/* 1D. COURSE NOTICES SECTION */}
      {activeTab === 'course-notices' && (
        <div className="animate-page-reveal">
          <AdminCourseNoticesSection notices={courseNotices} />
        </div>
      )}

      {/* 2. USERS & ROLES SECTION */}
      {activeTab === 'users' && (
        <div className="animate-page-reveal">
          <AdminUsersSection profiles={profiles} onRefresh={refreshData} />
        </div>
      )}

      {/* 3. SETTINGS SECTION */}
      {activeTab === 'settings' && (
        <div className="animate-page-reveal">
          <AdminSettingsSection onRefresh={refreshData} />
        </div>
      )}

      {/* 4. ACTIVITIES SECTION */}
      {activeTab === 'activities' && (
        <div className="space-y-6 animate-page-reveal">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Activities & Events Management</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage scheduled hackathons, paper readings, and showcases.</p>
            </div>
            <button
              onClick={() => { setEditingActivity(null); setIsActivityModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Activity</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => (
              <div key={act.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {act.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{act.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{act.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-3 mb-4">{act.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => dataStore.toggleActivityPublished(act.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title={act.published ? 'Unpublish' : 'Publish'}
                    >
                      {act.published ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                    </button>
                    <button
                      onClick={() => { setEditingActivity(act); setIsActivityModalOpen(true); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Delete activity?')) {
                        dataStore.deleteActivity(act.id);
                        success('Activity deleted');
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. WORKSHOPS SECTION */}
      {activeTab === 'workshops' && (
        <div className="space-y-6 animate-page-reveal">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Workshops & Bootcamps</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage technical workshops and attendee registrations.</p>
            </div>
            <button
              onClick={() => { setEditingWorkshop(null); setIsWorkshopModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Workshop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((ws) => (
              <div key={ws.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {ws.status}
                    </span>
                    <span className="text-xs font-mono text-purple-400">
                      {ws.registered_count} / {ws.max_participants} Reg.
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{ws.name}</h3>
                  <p className="text-slate-400 text-xs line-clamp-3 mb-4">{ws.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => dataStore.toggleWorkshopPublished(ws.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title={ws.published ? 'Unpublish' : 'Publish'}
                    >
                      {ws.published ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                    </button>
                    <button
                      onClick={() => { setEditingWorkshop(ws); setIsWorkshopModalOpen(true); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Delete workshop?')) {
                        dataStore.deleteWorkshop(ws.id);
                        success('Workshop deleted');
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. PROJECTS SECTION */}
      {activeTab === 'projects' && (
        <div className="space-y-6 animate-page-reveal">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Project Pipeline</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Review student submissions and manage open-source projects.</p>
            </div>
            <button
              onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {proj.domain}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      proj.status === 'Approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{proj.name}</h3>
                  <p className="text-slate-400 text-xs line-clamp-3 mb-4">{proj.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {proj.status !== 'Approved' && (
                      <button
                        onClick={() => { dataStore.updateProjectStatus(proj.id, 'Approved'); success('Project approved!'); }}
                        className="px-2 py-1 rounded bg-emerald-900/60 text-emerald-300 text-[10px] font-mono"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => dataStore.toggleProjectFeatured(proj.id)}
                      className={`px-2 py-1 rounded text-[10px] font-mono ${
                        proj.featured ? 'bg-purple-900/60 text-purple-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {proj.featured ? 'Featured' : 'Standard'}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Delete project?')) {
                        dataStore.deleteProject(proj.id);
                        success('Project deleted');
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. RESOURCES SECTION */}
      {activeTab === 'resources' && (
        <div className="space-y-6 animate-page-reveal">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Knowledge Library & Resources</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage roadmaps, datasets, and arXiv paper guides.</p>
            </div>
            <button
              onClick={() => setIsResourceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div key={res.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {res.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 mb-2">{res.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-3 mb-4">{res.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a href={res.external_link} target="_blank" rel="noreferrer" className="text-xs text-purple-400 flex items-center gap-1">
                    <span>Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => { dataStore.deleteResource(res.id); success('Resource removed'); }}
                    className="p-1.5 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. GALLERY SECTION */}
      {activeTab === 'gallery' && (
        <div className="space-y-6 animate-page-reveal">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Media Gallery Management</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Upload and organize photographs from club events and workshops.</p>
            </div>
            <button
              onClick={() => setIsGalleryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photograph</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((g) => (
              <div key={g.id} className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group relative">
                <img src={g.image_url} alt={g.title} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <div className="text-xs font-semibold text-white truncate">{g.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{g.category}</div>
                </div>
                <button
                  onClick={() => { dataStore.deleteGalleryItem(g.id); success('Photo deleted'); }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-red-400 hover:bg-black/90 transition"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. MESSAGES SECTION */}      {activeTab === 'drives' && (
        <AdminDrivesSection drives={drives} />
      )}

      {activeTab === 'messages' && (
        <div className="space-y-6 animate-page-reveal">
          <div>
            <h2 className="text-2xl font-bold text-white">Contact Inquiries & Communications</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Inquiries submitted through the public website contact form.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Sender</th>
                    <th className="py-3 px-4">Subject & Message</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {messages.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 font-mono">
                        No messages received yet.
                      </td>
                    </tr>
                  ) : (
                    messages.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{m.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{m.email}</div>
                        </td>
                        <td className="py-3 px-4 max-w-md">
                          <div className="font-semibold text-purple-300">{m.subject}</div>
                          <div className="text-slate-400 text-xs mt-0.5 line-clamp-2">{m.message}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            m.status === 'Unread' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              dataStore.updateMessageStatus(m.id, m.status === 'Unread' ? 'Read' : 'Replied');
                              success('Message marked updated');
                            }}
                            className="text-xs text-purple-400 hover:text-purple-300 font-mono"
                          >
                            Mark {m.status === 'Unread' ? 'Read' : 'Replied'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 10. ACHIEVEMENTS SECTION */}
      {activeTab === 'achievements' && (
        <div className="space-y-6 max-w-2xl animate-page-reveal">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Club Metric Counters</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Update aggregate statistics displayed across public pages.</p>
            </div>
            <button
              type="button"
              onClick={() => handleTabChange('achievement-requests')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-medium text-xs transition self-start sm:self-auto"
            >
              <Trophy className="w-4 h-4 text-purple-400" />
              <span>
                Review Member Achievement Requests ({memberAchievements.filter(a => a.status === 'Pending').length} Pending)
              </span>
            </button>
          </div>

          <form onSubmit={handleSaveAchievements} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Total Members Count</label>
              <input
                type="number"
                name="members_count"
                defaultValue={achievements.members_count}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Workshops Conducted</label>
              <input
                type="number"
                name="workshops_count"
                defaultValue={achievements.workshops_count}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Projects Built</label>
              <input
                type="number"
                name="projects_count"
                defaultValue={achievements.projects_count}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Hackathons Participated</label>
              <input
                type="number"
                name="hackathons_count"
                defaultValue={achievements.hackathons_count}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Competitions Won</label>
              <input
                type="number"
                name="competitions_won_count"
                defaultValue={achievements.competitions_won_count}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md"
            >
              Update Public Counters
            </button>
          </form>
        </div>
      )}

      {/* 11. NOTIFICATIONS SECTION */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 max-w-3xl animate-page-reveal">
          <div>
            <h2 className="text-2xl font-bold text-white">Alerts & System Broadcasts</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Broadcast high-priority alerts to authenticated members and visitors.</p>
          </div>

          {/* New Broadcast Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              dataStore.addNotification({
                title: fd.get('title') as string,
                message: fd.get('message') as string,
                type: fd.get('type') as any,
                read: false,
                link: fd.get('link') as string,
              });
              success('Broadcast dispatched!');
              e.currentTarget.reset();
            }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs"
          >
            <h3 className="text-sm font-bold text-white">Create New Broadcast Alert</h3>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Alert Title</label>
              <input name="title" required placeholder="e.g. GPU Cluster Maintenance" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Message Body</label>
              <textarea name="message" required rows={3} placeholder="Details of the announcement..." className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Alert Type</label>
                <select name="type" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white">
                  <option value="info">Information (Blue)</option>
                  <option value="success">Success (Green)</option>
                  <option value="warning">Warning (Yellow)</option>
                  <option value="event">Event Alert (Purple)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Optional Link</label>
                <input name="link" placeholder="#workshops" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
            </div>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md">
              Send Broadcast
            </button>
          </form>

          {/* Existing Notifications */}
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{n.title}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{n.message}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  {n.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. ANALYTICS SECTION */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-page-reveal">
          <div>
            <h2 className="text-2xl font-bold text-white">Platform Telemetry & Analytics</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Resource utilization, attendee trends, and domain engagement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-mono text-slate-400 uppercase">GPU Compute Hours</div>
              <div className="text-3xl font-black text-white font-mono mt-2">1,480 hrs</div>
              <div className="text-[11px] text-purple-400 mt-2">Slurm job queue 94% utilized</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-mono text-slate-400 uppercase">Active Registrations</div>
              <div className="text-3xl font-black text-white font-mono mt-2">125 users</div>
              <div className="text-[11px] text-emerald-400 mt-2">Workshop attendance capacity 88%</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-mono text-slate-400 uppercase">Code Commits</div>
              <div className="text-3xl font-black text-white font-mono mt-2">342 commits</div>
              <div className="text-[11px] text-blue-400 mt-2">Across 14 club repositories</div>
            </div>
          </div>
        </div>
      )}

      {/* 13. PROFILE SECTION */}
      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-2xl animate-page-reveal">
          <div>
            <h2 className="text-2xl font-bold text-white">Administrator Profile</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage your administrator details and public lead profile.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              updateProfile({
                name: fd.get('name') as string,
                specialization: fd.get('specialization') as string,
                bio: fd.get('bio') as string,
                github: fd.get('github') as string,
                linkedin: fd.get('linkedin') as string,
              });
              success('Profile updated successfully!');
            }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs"
          >
            <div>
              <label className="block text-slate-400 font-mono mb-1">Display Name</label>
              <input name="name" defaultValue={user?.name} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Email Address</label>
              <input value={user?.email} disabled className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Specialization</label>
              <input name="specialization" defaultValue={user?.specialization} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Biography</label>
              <textarea name="bio" rows={3} defaultValue={user?.bio} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-mono mb-1">GitHub Profile</label>
                <input name="github" defaultValue={user?.github} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">LinkedIn Profile</label>
                <input name="linkedin" defaultValue={user?.linkedin} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
            </div>

            <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md">
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* CRUD Modals for Activity, Workshop, Project, Resource, Gallery */}
      {/* Activity Modal */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-4">
              {editingActivity ? 'Edit Activity' : 'Publish New Activity'}
            </h3>
            <form onSubmit={handleSaveActivity} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Activity Title *</label>
                <input name="title" required defaultValue={editingActivity?.title} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Category</label>
                <select name="category" defaultValue={editingActivity?.category || 'Hackathon'} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white">
                  <option value="Hackathon">Hackathon</option>
                  <option value="Technical Session">Technical Session</option>
                  <option value="Project Showcase">Project Showcase</option>
                  <option value="AI Challenge">AI Challenge</option>
                  <option value="Club Meeting">Club Meeting</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Date</label>
                  <input name="date" type="date" required defaultValue={editingActivity?.date} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Time</label>
                  <input name="time" defaultValue={editingActivity?.time || '04:00 PM'} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Venue / Platform</label>
                <input name="venue" defaultValue={editingActivity?.venue || 'Computing Lab 3B'} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Description</label>
                <textarea name="description" rows={3} required defaultValue={editingActivity?.description} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Status</label>
                  <select name="status" defaultValue={editingActivity?.status || 'Upcoming'} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Published</label>
                  <select name="published" defaultValue={String(editingActivity ? editingActivity.published : true)} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white">
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsActivityModalOpen(false)} className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white font-medium">Save Activity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workshop Modal */}
      {isWorkshopModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-4">
              {editingWorkshop ? 'Edit Workshop' : 'Create Workshop'}
            </h3>
            <form onSubmit={handleSaveWorkshop} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Workshop Title *</label>
                <input name="name" required defaultValue={editingWorkshop?.name} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Topic / Domain</label>
                <input name="topic" required defaultValue={editingWorkshop?.topic} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Speaker Name</label>
                <input name="speaker" required defaultValue={editingWorkshop?.speaker} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Date</label>
                  <input name="date" type="date" required defaultValue={editingWorkshop?.date} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Max Capacity</label>
                  <input name="max_participants" type="number" defaultValue={editingWorkshop?.max_participants || 60} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Required Skills (comma separated)</label>
                <input name="required_skills" defaultValue={editingWorkshop?.required_skills?.join(', ') || 'Python, Git'} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Description</label>
                <textarea name="description" rows={3} required defaultValue={editingWorkshop?.description} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsWorkshopModalOpen(false)} className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white font-medium">Save Workshop</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-4">
              {editingProject ? 'Edit Project' : 'Add Project'}
            </h3>
            <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Project Name *</label>
                <input name="name" required defaultValue={editingProject?.name} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Domain</label>
                <select name="domain" defaultValue={editingProject?.domain || 'Computer Vision'} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white">
                  <option value="Generative AI">Generative AI</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="Natural Language Processing">Natural Language Processing</option>
                  <option value="Reinforcement Learning">Reinforcement Learning</option>
                  <option value="Robotics & Control">Robotics & Control</option>
                  <option value="Edge AI">Edge AI</option>
                  <option value="AI Agents">AI Agents</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Tech Stack (comma separated)</label>
                <input name="tech_stack" defaultValue={editingProject?.tech_stack?.join(', ') || 'PyTorch, Python'} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">GitHub Repo URL</label>
                <input name="github_url" required defaultValue={editingProject?.github_url} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Live Demo URL</label>
                <input name="demo_url" defaultValue={editingProject?.demo_url} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Description</label>
                <textarea name="description" rows={3} required defaultValue={editingProject?.description} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white font-medium">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resource Modal */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add Library Resource</h3>
            <form onSubmit={handleSaveResource} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Resource Title *</label>
                <input name="title" required className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Category</label>
                <select name="category" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white">
                  <option value="Deep Learning">Deep Learning</option>
                  <option value="Research Papers">Research Papers</option>
                  <option value="Datasets">Datasets</option>
                  <option value="Tools">Tools</option>
                  <option value="AI Agents">AI Agents</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Resource Link URL *</label>
                <input name="external_link" required type="url" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Description</label>
                <textarea name="description" rows={2} required className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsResourceModalOpen(false)} className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white font-medium">Add Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add Event Photograph</h3>
            <form onSubmit={handleSaveGallery} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Title / Caption *</label>
                <input name="title" required className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Image URL *</label>
                <input name="image_url" required type="url" placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Category</label>
                <select name="category" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white">
                  <option value="Workshops">Workshops</option>
                  <option value="Hackathons">Hackathons</option>
                  <option value="Events">Events</option>
                  <option value="Project Demonstrations">Project Demonstrations</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white font-medium">Add Photo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
