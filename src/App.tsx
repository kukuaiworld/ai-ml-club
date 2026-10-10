import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { dataStore } from './services/dataStore';

// Public Layout & Shell
import { PublicLayout } from './components/public/PublicLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { NoticesPage } from './pages/public/NoticesPage';
import { EventsPage } from './pages/public/EventsPage';
import { WorkshopsPage } from './pages/public/WorkshopsPage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { TeamPage } from './pages/public/TeamPage';
import { ResourcesPage } from './pages/public/ResourcesPage';
import { DrivesPage } from './pages/public/DrivesPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { LabPage } from './pages/public/LabPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { MemberDashboardPage } from './pages/public/MemberDashboardPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { JoinUsPage } from './pages/JoinUsPage';

// Admin Dashboard & Layout
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Modals
import { WorkshopRegisterModal } from './components/Modals/WorkshopRegisterModal';
import { ProjectDetailModal } from './components/Modals/ProjectDetailModal';
import { ActivityDetailModal } from './components/Modals/ActivityDetailModal';
import { GalleryLightbox } from './components/Modals/GalleryLightbox';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Types & Data
import { 
  Activity, 
  Workshop, 
  Project, 
  Resource, 
  GalleryItem, 
  TeamMember, 
  AchievementStats, 
  TimelineEvent,
  CourseNotice,
  AdminTabType,
  UserProfile
} from './types';
import { INITIAL_TIMELINE } from './services/initialData';

const MainApp: React.FC = () => {
  const { user, isAuthenticated, role, isAdmin, isCoreMember } = useAuth();

  // Tab & Routing State: When website opens, always show the Home page normally
  const [currentTab, setCurrentTab] = useState<string>('home');

  const navigateTo = (tab: string) => {
    window.location.hash = tab;
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Data state from DataStore
  const [activities, setActivities] = useState<Activity[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [courseNotices, setCourseNotices] = useState<CourseNotice[]>([]);
  const [achievements, setAchievements] = useState<AchievementStats>(dataStore.getAchievements());
  const [timeline] = useState<TimelineEvent[]>(INITIAL_TIMELINE);

  // Modals state
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedWorkshopForReg, setSelectedWorkshopForReg] = useState<Workshop | null>(null);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);
  const [selectedActivityForDetail, setSelectedActivityForDetail] = useState<Activity | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  const loadData = () => {
    setActivities(dataStore.getActivities());
    setWorkshops(dataStore.getWorkshops());
    setProjects(dataStore.getProjects());
    setResources(dataStore.getResources());
    setGallery(dataStore.getGallery());
    setTeam(dataStore.getTeam());
    setCourseNotices(dataStore.getCourseNotices());
    setAchievements(dataStore.getAchievements());
  };

  useEffect(() => {
    loadData();
    const unsub = dataStore.subscribe(loadData);
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  // --- ROUTING / AUTH CHECKS ---

  // Check if current view is an Admin route
  const isAdminRoute = currentTab === 'admin' || currentTab === 'dashboard' || currentTab.startsWith('admin/');

  // Render Admin Dashboard (Strictly Admin & Core Member only)
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return (
        <LoginPage
          onNavigateHome={() => navigateTo('home')}
          onLoginSuccess={(target) => navigateTo(target || 'admin')}
          defaultMode="admin"
        />
      );
    }

    // Role Guard: Members attempting to access Admin routes are redirected to Member Dashboard
    if (role === 'Member' || (!isAdmin && !isCoreMember)) {
      if (currentTab !== 'member-dashboard') {
        window.location.hash = 'member-dashboard';
      }
      return (
        <MemberDashboardPage
          key="member-dashboard-page"
          onNavigateTab={navigateTo}
        />
      );
    }

    const adminInitialTab: AdminTabType = currentTab.startsWith('admin/') 
      ? (currentTab.replace('admin/', '') as AdminTabType)
      : 'overview';

    return (
      <AdminDashboardPage
        key="admin-dashboard-page"
        initialTab={adminInitialTab}
        onReturnToSite={() => navigateTo('home')}
      />
    );
  }

  // Render Member Dashboard (Authenticated Members & Leads)
  if (currentTab === 'member-dashboard') {
    if (!isAuthenticated) {
      return (
        <LoginPage
          onNavigateHome={() => navigateTo('home')}
          onLoginSuccess={(target) => navigateTo(target || 'member-dashboard')}
          defaultMode="member"
        />
      );
    }

    return (
      <MemberDashboardPage
        key="member-dashboard-page"
        onNavigateTab={navigateTo}
      />
    );
  }

  // Render Authentication Page
  if (currentTab === 'login') {
    if (isAuthenticated) {
      if (role === 'Member') {
        return <MemberDashboardPage key="member-dashboard-page" onNavigateTab={navigateTo} />;
      } else {
        return (
          <AdminDashboardPage
            key="admin-dashboard-page"
            initialTab="overview"
            onReturnToSite={() => navigateTo('home')}
          />
        );
      }
    }

    return (
      <LoginPage
        onNavigateHome={() => navigateTo('home')}
        onLoginSuccess={(target) => {
          if (target) {
            navigateTo(target);
          } else if (role === 'Member') {
            navigateTo('member-dashboard');
          } else {
            navigateTo('admin');
          }
        }}
      />
    );
  }

  const protectedTabs = [
    'activities', 'workshops', 'projects', 'resources', 'drives', 'gallery', 'lab', 'team', 'join-us'
  ];

  if (!isAuthenticated && protectedTabs.includes(currentTab)) {
    return (
      <LoginPage
        onNavigateHome={() => navigateTo('home')}
        onLoginSuccess={(target) => navigateTo(target || currentTab)}
        defaultMode="member"
      />
    );
  }

  // Render Public Website inside PublicLayout (Header -> Navigation -> Main -> Sections -> Footer)
  return (
    <>
      <PublicLayout
        currentTab={currentTab}
        onNavigate={navigateTo}
        onOpenSearch={() => setSearchOpen(true)}
      >
        {/* 1. Home / Index Page */}
        {currentTab === 'home' && (
          <HomePage
            activities={activities}
            workshops={workshops}
            projects={projects}
            resources={resources}
            gallery={gallery}
            team={team}
            achievements={achievements}
            timeline={timeline}
            onSelectActivity={(act) => setSelectedActivityForDetail(act)}
            onSelectWorkshop={(ws) => setSelectedWorkshopForReg(ws)}
            onSelectProject={(proj) => setSelectedProjectForDetail(proj)}
            onOpenLightbox={(item) => setSelectedGalleryItem(item)}
            onNavigateTab={navigateTo}
          />
        )}

      {/* 2. About Page */}
      {currentTab === 'about' && (
        <AboutPage
          team={team}
          achievements={achievements}
          timeline={timeline}
          onNavigateTab={navigateTo}
        />
      )}

      {/* 3. Notices Page (Visitor Notice Board for Upcoming AI/ML Courses) */}
      {currentTab === 'notices' && (
        <NoticesPage
          notices={courseNotices}
          onNavigateTab={navigateTo}
        />
      )}

      {/* 4. Events Page (Mapped to #activities route) */}
      {currentTab === 'activities' && (
        <EventsPage
          events={dataStore.getUnifiedEvents()}
          onSelectEvent={(event) => {
            if (event.originalType === 'activity') {
              const act = activities.find(a => a.id === event.id);
              if (act) setSelectedActivityForDetail(act);
            } else {
              const ws = workshops.find(w => w.id === event.id);
              if (ws) setSelectedWorkshopForReg(ws);
            }
          }}
          onOpenGallery={(event) => {
            if (event.galleryImages && event.galleryImages.length > 0) {
              setSelectedGalleryItem(event.galleryImages[0]);
            }
          }}
          onNavigateTab={navigateTo}
        />
      )}

      {/* 5. Workshops Page */}
      {currentTab === 'workshops' && (
        <WorkshopsPage
          workshops={workshops}
          onRegisterClick={(ws) => setSelectedWorkshopForReg(ws)}
          onNavigateTab={navigateTo}
        />
      )}

      {/* 6. Projects Page */}
      {currentTab === 'projects' && (
        <ProjectsPage
          projects={projects}
          onSelectProject={(proj) => setSelectedProjectForDetail(proj)}
          onNavigateTab={navigateTo}
        />
      )}

      {/* 7. Team Page */}
      {currentTab === 'team' && (
        <TeamPage team={team} onNavigateTab={navigateTo} />
      )}

      {/* 8. Resources Page */}
      {currentTab === 'resources' && (
        <ResourcesPage resources={resources} onNavigateTab={navigateTo} />
      )}
      {/* 8.5. Drives Page */}
      {currentTab === 'drives' && (
        <DrivesPage drives={dataStore.getPublishedDrives()} />
      )}

      {/* Join Us Page */}
      {currentTab === 'join-us' && (
        <JoinUsPage onNavigateHome={() => navigateTo('home')} />
      )}

      {/* 9. Gallery Page */}
      {currentTab === 'gallery' && (
        <GalleryPage
          gallery={gallery}
          events={dataStore.getUnifiedEvents()}
          onSelectEvent={(event) => {
            if (event.originalType === 'activity') {
              const act = activities.find(a => a.id === event.id);
              if (act) setSelectedActivityForDetail(act);
            } else {
              const ws = workshops.find(w => w.id === event.id);
              if (ws) setSelectedWorkshopForReg(ws);
            }
          }}
          onOpenLightbox={(item) => setSelectedGalleryItem(item)}
          onNavigateTab={navigateTo}
        />
      )}

      {/* 10. AI Lab Page */}
      {currentTab === 'lab' && (
        <LabPage onNavigateTab={navigateTo} />
      )}

      {/* 11. Contact Page */}
      {currentTab === 'contact' && (
        <ContactPage onNavigateTab={navigateTo} />
      )}

      {/* 404 Route */}
      {![
        'home',
        'about',
        'notices',
        'lab',
        'activities',
        'workshops',
        'projects',
        'team',
        'resources',
        'gallery',
        'contact',
        'login',
        'member-dashboard',
        'admin',
        'dashboard',
        'join-us'
      ].includes(currentTab) && !currentTab.startsWith('admin/') && (
        <NotFoundPage onGoHome={() => navigateTo('home')} />
      )}

      {/* Global Interactive Modals */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigateTo}
      />

      <WorkshopRegisterModal
        workshop={selectedWorkshopForReg}
        onClose={() => setSelectedWorkshopForReg(null)}
        onSuccess={() => loadData()}
      />

      <ProjectDetailModal
        project={selectedProjectForDetail}
        onClose={() => setSelectedProjectForDetail(null)}
      />

      <ActivityDetailModal
        activity={selectedActivityForDetail}
        onClose={() => setSelectedActivityForDetail(null)}
      />

        <GalleryLightbox
          item={selectedGalleryItem}
          onClose={() => setSelectedGalleryItem(null)}
        />
      </PublicLayout>


    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
