import { 
  Activity, 
  Workshop, 
  Project, 
  Resource, 
  GalleryItem, 
  TeamMember, 
  AchievementStats, 
  MemberAchievement,
  ContactMessage, 
  WorkshopRegistration, 
  ClubNotification,
  UserProfile,
  UserRole,
  ClubSettings,
  CourseNotice,
  ClubEvent,
  EventDrive,
  MembershipApplication
} from '../types';
import { 
  INITIAL_ACTIVITIES, 
  INITIAL_WORKSHOPS, 
  INITIAL_PROJECTS, 
  INITIAL_RESOURCES, 
  INITIAL_GALLERY, 
  INITIAL_TEAM, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_MEMBER_ACHIEVEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILES,
  INITIAL_SETTINGS,
  INITIAL_COURSE_NOTICES,
  INITIAL_DRIVES
} from './initialData';
import { supabase, isSupabaseConfigured } from './supabase';

type Listener = () => void;

class DataStore {
  private courseNotices: CourseNotice[] = [];
  private activities: Activity[] = [];
  private workshops: Workshop[] = [];
  private projects: Project[] = [];
  private resources: Resource[] = [];
  private gallery: GalleryItem[] = [];
  private drives: EventDrive[] = [];
  private team: TeamMember[] = [];
  private achievements: AchievementStats = INITIAL_ACHIEVEMENTS;
  private memberAchievements: MemberAchievement[] = [];
  private messages: ContactMessage[] = [];
  private registrations: WorkshopRegistration[] = [];
  private notifications: ClubNotification[] = [];
  private profiles: UserProfile[] = [];
  private applications: MembershipApplication[] = [];
  private settings: ClubSettings = INITIAL_SETTINGS;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadFromStorage();
    if (isSupabaseConfigured) {
      this.syncWithSupabase();
    }
  }

  private loadFromStorage() {
    try {
      this.courseNotices = JSON.parse(localStorage.getItem('aiml_course_notices') || 'null') || INITIAL_COURSE_NOTICES;
      this.activities = JSON.parse(localStorage.getItem('aiml_activities') || 'null') || INITIAL_ACTIVITIES;
      this.workshops = JSON.parse(localStorage.getItem('aiml_workshops') || 'null') || INITIAL_WORKSHOPS;
      this.projects = JSON.parse(localStorage.getItem('aiml_projects') || 'null') || INITIAL_PROJECTS;
      this.resources = JSON.parse(localStorage.getItem('aiml_resources') || 'null') || INITIAL_RESOURCES;
      this.gallery = JSON.parse(localStorage.getItem('aiml_gallery') || 'null') || INITIAL_GALLERY;
      this.drives = JSON.parse(localStorage.getItem('aiml_drives') || 'null') || INITIAL_DRIVES;
      const storedTeam = JSON.parse(localStorage.getItem('aiml_team') || 'null');
      if (storedTeam && Array.isArray(storedTeam) && storedTeam.length >= 10 && storedTeam[0]?.name === 'Shreyansh Sharma') {
        let deduplicatedTeam = storedTeam.filter(t => !t.name.toLowerCase().includes('dharmesh kumar chhipi'));
        let foundTeamDharmesh = false;
        deduplicatedTeam = deduplicatedTeam.filter(t => {
          if (t.name.toLowerCase().includes('dharmesh')) {
            if (foundTeamDharmesh) return false;
            foundTeamDharmesh = true;
            t.name = 'Dharmesh';
            return true;
          }
          return true;
        });
        if (!foundTeamDharmesh) {
          const initDharmesh = INITIAL_TEAM.find(t => t.name.toLowerCase().includes('dharmesh'));
          if (initDharmesh) deduplicatedTeam.push(initDharmesh);
        }
        this.team = deduplicatedTeam;
        localStorage.setItem('aiml_team', JSON.stringify(this.team));
      } else {
        this.team = INITIAL_TEAM;
        localStorage.setItem('aiml_team', JSON.stringify(INITIAL_TEAM));
      }

      this.achievements = JSON.parse(localStorage.getItem('aiml_achievements') || 'null') || INITIAL_ACHIEVEMENTS;
      this.memberAchievements = JSON.parse(localStorage.getItem('aiml_member_achievements') || 'null') || INITIAL_MEMBER_ACHIEVEMENTS;
      this.messages = JSON.parse(localStorage.getItem('aiml_messages') || 'null') || [
        {
          id: 'msg-1',
          name: 'Sarah Connor',
          email: 'sconnor@cyberdyne.org',
          subject: 'Keynote Speaker inquiry for AI Hackathon',
          message: 'Hello AI/ML Club leads! I would love to explore delivering an invited talk on neural robotics and human safety alignment.',
          status: 'Unread',
          created_at: '2026-09-24T12:00:00Z'
        }
      ];
      this.registrations = JSON.parse(localStorage.getItem('aiml_registrations') || 'null') || [];
      this.notifications = JSON.parse(localStorage.getItem('aiml_notifications') || 'null') || INITIAL_NOTIFICATIONS;

      const storedProfiles = JSON.parse(localStorage.getItem('aiml_profiles') || 'null');
      if (storedProfiles && Array.isArray(storedProfiles)) {
        // Filter out any "Dharmesh Kumar Chhipi" so only 1 clean "Dharmesh" remains
        const rawList = storedProfiles.filter((p: UserProfile) => {
          const lowerName = p.name.toLowerCase();
          return !lowerName.includes('dharmesh kumar chhipi');
        });

        // Deduplicate so there is at most 1 Dharmesh
        let foundDharmeshProfile = false;
        const strictlyOneDharmesh = rawList.filter((p: UserProfile) => {
          if (p.name.toLowerCase().includes('dharmesh') || p.username?.toLowerCase() === '#dharmesh123') {
            if (foundDharmeshProfile) return false;
            foundDharmeshProfile = true;
            p.name = 'Dharmesh';
            p.username = '#dharmesh123';
            return true;
          }
          return true;
        });

        this.profiles = strictlyOneDharmesh.map((p: UserProfile) => {
          let uName = p.username;
          if (!uName) {
            const base = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            uName = `#${base || 'user'}123`;
          }
          let normalizedRole = p.role;
          if (p.id === 'user-admin-1') {
            normalizedRole = 'Admin';
          } else if (p.id === 'user-sahil-1' && p.role === 'Core Member') {
            normalizedRole = 'Vice President';
          }
          return {
            ...p,
            role: normalizedRole,
            accountStatus: p.id === 'user-admin-1' ? 'Active' : (p.accountStatus || 'Active'),
            username: uName,
            password: p.password || '123456'
          };
        });
        localStorage.setItem('aiml_profiles', JSON.stringify(this.profiles));
      } else {
        this.profiles = INITIAL_PROFILES;
        localStorage.setItem('aiml_profiles', JSON.stringify(INITIAL_PROFILES));
      }

      this.settings = JSON.parse(localStorage.getItem('aiml_settings') || 'null') || INITIAL_SETTINGS;
      if (this.settings.clubName) {
        this.settings.clubName = this.settings.clubName.replace(/AI\s*\\+\s*ML/gi, 'AI/ML');
      }
      this.applications = JSON.parse(localStorage.getItem('aiml_applications') || 'null') || [];
    } catch {
      this.courseNotices = INITIAL_COURSE_NOTICES;
      this.activities = INITIAL_ACTIVITIES;
      this.workshops = INITIAL_WORKSHOPS;
      this.projects = INITIAL_PROJECTS;
      this.resources = INITIAL_RESOURCES;
      this.gallery = INITIAL_GALLERY;
      this.drives = INITIAL_DRIVES;
      this.team = INITIAL_TEAM;
      this.achievements = INITIAL_ACHIEVEMENTS;
      this.memberAchievements = INITIAL_MEMBER_ACHIEVEMENTS;
      this.notifications = INITIAL_NOTIFICATIONS;
      this.profiles = INITIAL_PROFILES;
      this.settings = INITIAL_SETTINGS;
    }
  }

  private persist() {
    try {
      localStorage.setItem('aiml_course_notices', JSON.stringify(this.courseNotices));
      localStorage.setItem('aiml_activities', JSON.stringify(this.activities));
      localStorage.setItem('aiml_workshops', JSON.stringify(this.workshops));
      localStorage.setItem('aiml_projects', JSON.stringify(this.projects));
      localStorage.setItem('aiml_resources', JSON.stringify(this.resources));
      localStorage.setItem('aiml_gallery', JSON.stringify(this.gallery));
      localStorage.setItem('aiml_drives', JSON.stringify(this.drives));
      localStorage.setItem('aiml_team', JSON.stringify(this.team));
      localStorage.setItem('aiml_achievements', JSON.stringify(this.achievements));
      localStorage.setItem('aiml_member_achievements', JSON.stringify(this.memberAchievements));
      localStorage.setItem('aiml_messages', JSON.stringify(this.messages));
      localStorage.setItem('aiml_registrations', JSON.stringify(this.registrations));
      localStorage.setItem('aiml_notifications', JSON.stringify(this.notifications));
      localStorage.setItem('aiml_profiles', JSON.stringify(this.profiles));
      localStorage.setItem('aiml_applications', JSON.stringify(this.applications));
      localStorage.setItem('aiml_settings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Storage persistence error', e);
    }
    this.notify();
  }

  private async syncWithSupabase() {
    try {
      const [acts, wrks, prjs, rscs, gals, drvs, achs, apps] = await Promise.all([
        supabase.from('activities').select('*'),
        supabase.from('workshops').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('resources').select('*'),
        supabase.from('gallery').select('*'),
        supabase.from('event_drives').select('*'),
        supabase.from('achievements').select('*').single(),
        supabase.from('membership_applications').select('*')
      ]);

      if (acts.data && acts.data.length > 0) this.activities = acts.data;
      if (wrks.data && wrks.data.length > 0) this.workshops = wrks.data;
      if (prjs.data && prjs.data.length > 0) this.projects = prjs.data;
      if (rscs.data && rscs.data.length > 0) this.resources = rscs.data;
      if (gals.data && gals.data.length > 0) this.gallery = gals.data;
      if (drvs.data && drvs.data.length > 0) this.drives = drvs.data;
      if (achs.data) this.achievements = achs.data;
      if (apps.data && apps.data.length > 0) this.applications = apps.data;
      
      this.persist();
    } catch (err) {
      console.warn('Supabase sync warning (using cached data):', err);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- VISITOR COURSE NOTICES ---
  public getCourseNotices(includeUnpublished = false): CourseNotice[] {
    const list = includeUnpublished
      ? this.courseNotices
      : this.courseNotices.filter(n => n.published);
    return [...list].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  public addCourseNotice(notice: Omit<CourseNotice, 'id' | 'created_at'>): CourseNotice {
    const newNotice: CourseNotice = {
      ...notice,
      id: 'cnotice-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    this.courseNotices = [newNotice, ...this.courseNotices];
    this.persist();
    return newNotice;
  }

  public updateCourseNotice(id: string, updates: Partial<CourseNotice>) {
    this.courseNotices = this.courseNotices.map(n =>
      n.id === id ? { ...n, ...updates } : n
    );
    this.persist();
  }

  public deleteCourseNotice(id: string) {
    this.courseNotices = this.courseNotices.filter(n => n.id !== id);
    this.persist();
  }

  // --- UNIFIED EVENTS ---
  private parseEventDateTime(dateStr: string, timeStr: string, timeZone: string): { startDateTime: string, endDateTime?: string } {
    try {
      // timeStr might be "09:00 AM - 48 Hours", "02:00 PM - 06:00 PM", "14:00", etc.
      // Default to noon if parsing fails
      const fallbackStart = `${dateStr}T12:00:00.000Z`;
      
      const parts = timeStr.split('-').map(s => s.trim());
      const startTimeRaw = parts[0];
      
      // We will parse startTimeRaw like "09:00 AM" or "14:00"
      const match = startTimeRaw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (!match) return { startDateTime: fallbackStart };
      
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3]?.toUpperCase();
      
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      // Construct a valid ISO date for the timezone (using simple approach without external libs)
      // Note: JavaScript Date treats "YYYY-MM-DDTHH:mm:ss" as local time. 
      // To strictly use Asia/Kolkata without a huge library, we will create an ISO string assuming UTC offset 
      // or rely on the user's browser, but the prompt says "Use the event's configured time zone... Asia/Kolkata".
      // We'll format as an ISO string with +05:30 offset.
      const pad = (n: number) => n.toString().padStart(2, '0');
      const startDateTime = `${dateStr}T${pad(hours)}:${pad(minutes)}:00+05:30`;
      
      let endDateTime: string | undefined;
      
      if (parts.length > 1) {
        const endTimeRaw = parts[1];
        const endMatch = endTimeRaw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (endMatch) {
          let eHours = parseInt(endMatch[1], 10);
          const eMinutes = parseInt(endMatch[2], 10);
          const ePeriod = endMatch[3]?.toUpperCase();
          
          if (ePeriod === 'PM' && eHours < 12) eHours += 12;
          if (ePeriod === 'AM' && eHours === 12) eHours = 0;
          
          endDateTime = `${dateStr}T${pad(eHours)}:${pad(eMinutes)}:00+05:30`;
        } else if (endTimeRaw.toLowerCase().includes('hour')) {
          // e.g., "48 Hours"
          const hMatch = endTimeRaw.match(/(\d+)/);
          if (hMatch) {
            const addHours = parseInt(hMatch[1], 10);
            const d = new Date(startDateTime);
            d.setHours(d.getHours() + addHours);
            endDateTime = d.toISOString(); // converting to UTC is fine for endDateTime
          }
        }
      }
      
      return { startDateTime, endDateTime };
    } catch (err) {
      return { startDateTime: `${dateStr}T12:00:00.000Z` };
    }
  }

  public getUnifiedEvents(): ClubEvent[] {
    const events: ClubEvent[] = [];
    const timeZone = 'Asia/Kolkata';

    // Process Activities
    for (const act of this.activities) {
      if (!act.published) continue;
      const { startDateTime, endDateTime } = this.parseEventDateTime(act.date, act.time, timeZone);
      
      // Match gallery items
      const galleryImages = this.gallery.filter(g => g.event_name && (g.event_name === act.title || g.title === act.title));

      events.push({
        id: act.id,
        title: act.title,
        description: act.description,
        category: act.category,
        coverImage: act.banner_image,
        startDateTime,
        endDateTime,
        timeZone,
        venue: act.venue,
        registrationUrl: act.registration_link,
        registrationStatus: act.status === 'Completed' ? 'Closed' : 'Open',
        eventStatus: act.status,
        organizer: act.organizer,
        featured: false,
        galleryImages,
        originalType: 'activity'
      });
    }

    // Process Workshops
    for (const ws of this.workshops) {
      if (!ws.published) continue;
      const { startDateTime, endDateTime } = this.parseEventDateTime(ws.date, ws.time, timeZone);
      
      const galleryImages = this.gallery.filter(g => g.event_name && (g.event_name === ws.name || g.title === ws.name));

      events.push({
        id: ws.id,
        title: ws.name,
        description: ws.description,
        category: 'Workshop',
        coverImage: ws.banner_image,
        startDateTime,
        endDateTime,
        timeZone,
        venue: ws.venue,
        registrationUrl: ws.registration_link,
        registrationStatus: ws.registration_open ? 'Open' : 'Closed',
        eventStatus: ws.status === 'Past' ? 'Completed' : ws.status === 'Ongoing' ? 'Live' : 'Upcoming',
        organizer: ws.speaker,
        featured: false,
        galleryImages,
        originalType: 'workshop'
      });
    }

    return events;
  }

  // --- ACTIVITIES ---
  public getActivities(includeUnpublished = false): Activity[] {
    return includeUnpublished ? this.activities : this.activities.filter(a => a.published);
  }

  public addActivity(activity: Omit<Activity, 'id' | 'created_at'>): Activity {
    const newAct: Activity = {
      ...activity,
      id: 'act-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    this.activities = [newAct, ...this.activities];
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('activities').insert([newAct]).then();
    }
    return newAct;
  }

  public updateActivity(id: string, updates: Partial<Activity>) {
    this.activities = this.activities.map(a => a.id === id ? { ...a, ...updates } : a);
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('activities').update(updates).eq('id', id).then();
    }
  }

  public deleteActivity(id: string) {
    this.activities = this.activities.filter(a => a.id !== id);
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('activities').delete().eq('id', id).then();
    }
  }

  // --- WORKSHOPS ---
  public getWorkshops(includeUnpublished = false): Workshop[] {
    return includeUnpublished ? this.workshops : this.workshops.filter(w => w.published);
  }

  public addWorkshop(workshop: Omit<Workshop, 'id' | 'created_at' | 'registered_count'>): Workshop {
    const newWs: Workshop = {
      ...workshop,
      id: 'ws-' + Date.now(),
      registered_count: 0,
      created_at: new Date().toISOString(),
    };
    this.workshops = [newWs, ...this.workshops];
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('workshops').insert([newWs]).then();
    }
    return newWs;
  }

  public updateWorkshop(id: string, updates: Partial<Workshop>) {
    this.workshops = this.workshops.map(w => w.id === id ? { ...w, ...updates } : w);
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('workshops').update(updates).eq('id', id).then();
    }
  }

  public deleteWorkshop(id: string) {
    this.workshops = this.workshops.filter(w => w.id !== id);
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('workshops').delete().eq('id', id).then();
    }
  }

  public registerForWorkshop(registration: Omit<WorkshopRegistration, 'id' | 'created_at'>): boolean {
    const targetWs = this.workshops.find(w => w.id === registration.workshop_id);
    if (!targetWs || !targetWs.registration_open || targetWs.registered_count >= targetWs.max_participants) {
      return false;
    }

    const newReg: WorkshopRegistration = {
      ...registration,
      id: 'reg-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    this.registrations = [newReg, ...this.registrations];
    
    // Increment registered count
    this.updateWorkshop(registration.workshop_id, {
      registered_count: targetWs.registered_count + 1
    });

    if (isSupabaseConfigured) {
      supabase.from('registrations').insert([newReg]).then();
    }
    return true;
  }

  public getRegistrations(): WorkshopRegistration[] {
    return this.registrations;
  }

  // --- PROJECTS ---
  public getProjects(includeUnapproved = false): Project[] {
    return includeUnapproved ? this.projects : this.projects.filter(p => p.status === 'Approved');
  }

  public addProject(project: Omit<Project, 'id' | 'created_at'>): Project {
    const newProj: Project = {
      ...project,
      id: 'proj-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    this.projects = [newProj, ...this.projects];
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('projects').insert([newProj]).then();
    }
    return newProj;
  }

  public updateProject(id: string, updates: Partial<Project>) {
    this.projects = this.projects.map(p => p.id === id ? { ...p, ...updates } : p);
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('projects').update(updates).eq('id', id).then();
    }
  }

  public toggleActivityPublished(id: string) {
    const act = this.activities.find(a => a.id === id);
    if (act) {
      this.updateActivity(id, { published: !act.published });
    }
  }

  public toggleWorkshopPublished(id: string) {
    const ws = this.workshops.find(w => w.id === id);
    if (ws) {
      this.updateWorkshop(id, { published: !ws.published });
    }
  }

  public updateProjectStatus(id: string, status: 'Approved' | 'Pending Review' | 'Draft') {
    this.updateProject(id, { status });
  }

  public toggleProjectFeatured(id: string) {
    const proj = this.projects.find(p => p.id === id);
    if (proj) {
      this.updateProject(id, { featured: !proj.featured });
    }
  }

  public deleteProject(id: string) {
    this.projects = this.projects.filter(p => p.id !== id);
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('projects').delete().eq('id', id).then();
    }
  }

  // --- RESOURCES ---
  public getResources(): Resource[] {
    return this.resources;
  }

  public addResource(resource: Omit<Resource, 'id' | 'created_at' | 'stars'>): Resource {
    const newRes: Resource = {
      ...resource,
      id: 'res-' + Date.now(),
      stars: 0,
      created_at: new Date().toISOString(),
    };
    this.resources = [newRes, ...this.resources];
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('resources').insert([newRes]).then();
    }
    return newRes;
  }

  public deleteResource(id: string) {
    this.resources = this.resources.filter(r => r.id !== id);
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('resources').delete().eq('id', id).then();
    }
  }

  // --- DRIVES ---
  public getDrives(): EventDrive[] {
    return this.drives;
  }

  public getPublishedDrives(): EventDrive[] {
    return this.drives.filter(d => d.is_published);
  }

  public addDrive(drive: Omit<EventDrive, 'id' | 'created_at'>): EventDrive {
    const newDrive: EventDrive = {
      ...drive,
      id: 'drive-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    this.drives = [newDrive, ...this.drives];
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('event_drives').insert([newDrive]).then();
    }
    return newDrive;
  }

  public updateDrive(id: string, updates: Partial<EventDrive>) {
    this.drives = this.drives.map(d => d.id === id ? { ...d, ...updates } : d);
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('event_drives').update(updates).eq('id', id).then();
    }
  }

  public toggleDrivePublished(id: string) {
    const drive = this.drives.find(d => d.id === id);
    if (drive) {
      this.updateDrive(id, { is_published: !drive.is_published });
    }
  }

  public deleteDrive(id: string) {
    this.drives = this.drives.filter(d => d.id !== id);
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('event_drives').delete().eq('id', id).then();
    }
  }

  public starResource(id: string) {
    this.resources = this.resources.map(r => r.id === id ? { ...r, stars: (r.stars || 0) + 1 } : r);
    this.persist();
  }

  // --- GALLERY ---
  public getGallery(): GalleryItem[] {
    return this.gallery;
  }

  public addGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'>): GalleryItem {
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    this.gallery = [newItem, ...this.gallery];
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('gallery').insert([newItem]).then();
    }
    return newItem;
  }

  public deleteGalleryItem(id: string) {
    this.gallery = this.gallery.filter(g => g.id !== id);
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('gallery').delete().eq('id', id).then();
    }
  }

  // --- TEAM ---
  public getTeam(): TeamMember[] {
    return this.team;
  }

  public updateTeamMember(id: string, updates: Partial<TeamMember>) {
    this.team = this.team.map(m => m.id === id ? { ...m, ...updates } : m);
    this.persist();
  }

  // --- ACHIEVEMENTS ---
  public getAchievements(): AchievementStats {
    return this.achievements;
  }

  public updateAchievements(updates: Partial<AchievementStats>) {
    this.achievements = {
      ...this.achievements,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('achievements').upsert([this.achievements]).then();
    }
  }

  // --- MEMBER ACHIEVEMENTS (Pending Approval Workflow) ---
  public getMemberAchievements(includeAll = false): MemberAchievement[] {
    if (includeAll) return this.memberAchievements;
    return this.memberAchievements.filter((a) => a.status === 'Approved');
  }

  public submitMemberAchievement(
    ach: Omit<MemberAchievement, 'id' | 'created_at' | 'status'>
  ): MemberAchievement {
    const newAch: MemberAchievement = {
      ...ach,
      id: 'mach-' + Date.now(),
      status: 'Pending',
      created_at: new Date().toISOString(),
    };
    this.memberAchievements = [newAch, ...this.memberAchievements];

    this.notifications = [
      {
        id: 'notif-' + Date.now(),
        title: 'New Achievement Submission',
        message: `${newAch.member_name} submitted "${newAch.title}" for approval.`,
        type: 'info',
        read: false,
        link: 'admin/achievement-requests',
        created_at: new Date().toISOString(),
      },
      ...this.notifications,
    ];

    this.persist();
    return newAch;
  }

  public approveMemberAchievement(id: string): {
    success: boolean;
    achievement?: MemberAchievement;
    error?: string;
  } {
    const target = this.memberAchievements.find((a) => a.id === id);
    if (!target) {
      return { success: false, error: 'Achievement request not found.' };
    }
    const wasApproved = target.status === 'Approved';
    const updated: MemberAchievement = { ...target, status: 'Approved' };
    this.memberAchievements = this.memberAchievements.map((a) =>
      a.id === id ? updated : a
    );
    if (!wasApproved) {
      this.achievements.competitions_won_count += 1;
    }
    this.persist();
    return { success: true, achievement: updated };
  }

  public rejectMemberAchievement(id: string): {
    success: boolean;
    achievement?: MemberAchievement;
    error?: string;
  } {
    const target = this.memberAchievements.find((a) => a.id === id);
    if (!target) {
      return { success: false, error: 'Achievement request not found.' };
    }
    const wasApproved = target.status === 'Approved';
    const updated: MemberAchievement = { ...target, status: 'Rejected' };
    this.memberAchievements = this.memberAchievements.map((a) =>
      a.id === id ? updated : a
    );
    if (wasApproved && this.achievements.competitions_won_count > 0) {
      this.achievements.competitions_won_count -= 1;
    }
    this.persist();
    return { success: true, achievement: updated };
  }

  public deleteMemberAchievement(id: string): { success: boolean } {
    this.memberAchievements = this.memberAchievements.filter((a) => a.id !== id);
    this.persist();
    return { success: true };
  }

  // --- CONTACT MESSAGES ---
  public getMessages(): ContactMessage[] {
    return this.messages;
  }

  public submitContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      status: 'Unread',
      created_at: new Date().toISOString()
    };
    this.messages = [newMsg, ...this.messages];
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('contact_messages').insert([newMsg]).then();
    }
    return newMsg;
  }

  public updateMessageStatus(id: string, status: 'Unread' | 'Read' | 'Replied') {
    this.messages = this.messages.map(m => m.id === id ? { ...m, status } : m);
    this.persist();
  }

  // --- NOTIFICATIONS ---
  public getNotifications(): ClubNotification[] {
    return this.notifications;
  }

  public markNotificationAsRead(id: string) {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    this.persist();
  }

  public addNotification(notif: Omit<ClubNotification, 'id' | 'created_at'>) {
    const newNotif: ClubNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      created_at: new Date().toISOString()
    };
    this.notifications = [newNotif, ...this.notifications];
    this.persist();
  }

  // --- PROFILES / MEMBERS ---
  public getProfiles(): UserProfile[] {
    return this.profiles;
  }

  public isUsernameTaken(username: string, excludeId?: string): boolean {
    const clean = username.trim().toLowerCase();
    return this.profiles.some(p => p.id !== excludeId && p.username?.toLowerCase() === clean);
  }

  public formatUsername(input: string): string {
    let clean = input.trim().toLowerCase();
    if (clean.startsWith('#')) {
      clean = clean.slice(1);
    }
    if (clean.endsWith('123')) {
      clean = clean.slice(0, -3);
    }
    clean = clean.replace(/[^a-z0-9]/g, '');
    if (!clean) clean = 'member';
    return `#${clean}123`;
  }

  public updateMemberRole(
    id: string,
    role: UserRole,
    actorId?: string
  ): { success: boolean; error?: string } {
    if ((actorId && id === actorId) || id === 'user-admin-1') {
      if (role !== 'Admin') {
        return {
          success: false,
          error: 'The currently logged-in/root Admin cannot demote themselves.',
        };
      }
    }
    this.profiles = this.profiles.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        role,
        accountStatus:
          role === 'Admin' || role === 'Vice President'
            ? 'Active'
            : p.accountStatus || 'Active',
      };
    });
    this.persist();
    return { success: true };
  }

  public toggleMemberActiveStatus(
    id: string,
    actorId?: string
  ): { success: boolean; accountStatus?: 'Active' | 'Deactivated'; error?: string } {
    if ((actorId && id === actorId) || id === 'user-admin-1') {
      return {
        success: false,
        error: 'The currently logged-in/root Admin cannot deactivate themselves.',
      };
    }
    const target = this.profiles.find((p) => p.id === id);
    if (!target) {
      return { success: false, error: 'User not found.' };
    }
    const nextStatus: 'Active' | 'Deactivated' =
      target.accountStatus === 'Deactivated' ? 'Active' : 'Deactivated';
    this.profiles = this.profiles.map((p) =>
      p.id === id ? { ...p, accountStatus: nextStatus } : p
    );
    this.persist();
    return { success: true, accountStatus: nextStatus };
  }

  public addMember(member: Omit<UserProfile, 'id' | 'created_at'>): { success: boolean; member?: UserProfile; error?: string } {
    let cleanUsername = member.username?.trim().toLowerCase();
    if (!cleanUsername) {
      cleanUsername = this.formatUsername(member.name);
    } else {
      cleanUsername = this.formatUsername(cleanUsername);
    }

    if (this.isUsernameTaken(cleanUsername)) {
      return { 
        success: false, 
        error: `Username "${cleanUsername}" is already taken. Please choose another username.` 
      };
    }

    const newProf: UserProfile = {
      ...member,
      id: 'user-' + Date.now(),
      username: cleanUsername,
      password: member.password || '123456',
      role: 'Registered User',
      accountStatus: member.accountStatus || 'Active',
      specialization: member.specialization || 'AI & Machine Learning',
      bio: member.bio || 'Registered User of AI/ML Club, GEC Ajmer.',
      avatar_url: member.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300`,
      created_at: new Date().toISOString(),
    };
    this.profiles = [...this.profiles, newProf];

    this.persist();
    return { success: true, member: newProf };
  }

  public updateMember(
    id: string,
    updates: Partial<UserProfile>,
    actorId?: string
  ): { success: boolean; error?: string } {
    if ((actorId && id === actorId) || id === 'user-admin-1') {
      if (updates.role && updates.role !== 'Admin') {
        return {
          success: false,
          error: 'The currently logged-in/root Admin cannot demote themselves.',
        };
      }
      if (updates.accountStatus === 'Deactivated') {
        return {
          success: false,
          error: 'The currently logged-in/root Admin cannot deactivate themselves.',
        };
      }
    }

    if (updates.username) {
      const formatted = this.formatUsername(updates.username);
      if (this.isUsernameTaken(formatted, id)) {
        return { success: false, error: `Username "${formatted}" already exists.` };
      }
      updates.username = formatted;
    }

    this.profiles = this.profiles.map(p => p.id === id ? { ...p, ...updates } : p);
    this.persist();
    return { success: true };
  }

  public deleteMember(id: string, actorId?: string): { success: boolean; error?: string } {
    if ((actorId && id === actorId) || id === 'user-admin-1') {
      return {
        success: false,
        error: 'The currently logged-in/root Admin cannot remove themselves.',
      };
    }
    const target = this.profiles.find(p => p.id === id);
    const beforeCount = this.profiles.length;
    this.profiles = this.profiles.filter(p => p.id !== id);
    if (this.profiles.length < beforeCount) {
      if (target && target.role !== 'Registered User' && this.achievements.members_count > 0) {
        this.achievements.members_count -= 1;
      }
      this.persist();
      return { success: true };
    }
    return { success: false, error: 'Member not found.' };
  }

  public findMemberByUsername(username: string): UserProfile | undefined {
    const clean = username.trim().toLowerCase();
    return this.profiles.find(p => p.username?.toLowerCase() === clean);
  }

  public findMemberByIdentifier(identifier: string): UserProfile | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.profiles.find(p => 
      p.email.toLowerCase() === clean || 
      p.username?.toLowerCase() === clean ||
      (clean.startsWith('#') && p.username?.toLowerCase() === clean) ||
      (!clean.startsWith('#') && p.username?.toLowerCase() === `#${clean}`)
    );
  }

  // --- CLUB SETTINGS ---
  public getSettings(): ClubSettings {
    return this.settings;
  }

  public updateSettings(updates: Partial<ClubSettings>) {
    this.settings = { ...this.settings, ...updates };
    this.persist();
  }

  // --- SYSTEM UTILITIES ---
  public resetToDefaults() {
    this.courseNotices = [...INITIAL_COURSE_NOTICES];
    this.activities = [...INITIAL_ACTIVITIES];
    this.workshops = [...INITIAL_WORKSHOPS];
    this.projects = [...INITIAL_PROJECTS];
    this.resources = [...INITIAL_RESOURCES];
    this.gallery = [...INITIAL_GALLERY];
    this.team = [...INITIAL_TEAM];
    this.achievements = { ...INITIAL_ACHIEVEMENTS };
    this.messages = [];
    this.registrations = [];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.profiles = [...INITIAL_PROFILES];
    this.settings = { ...INITIAL_SETTINGS };
    this.persist();
  }

  public exportBackup(): string {
    return JSON.stringify({
      courseNotices: this.courseNotices,
      activities: this.activities,
      workshops: this.workshops,
      projects: this.projects,
      resources: this.resources,
      gallery: this.gallery,
      team: this.team,
      achievements: this.achievements,
      messages: this.messages,
      notifications: this.notifications,
      profiles: this.profiles,
      settings: this.settings,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  public importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.courseNotices) this.courseNotices = data.courseNotices;
      if (data.activities) this.activities = data.activities;
      if (data.workshops) this.workshops = data.workshops;
      if (data.projects) this.projects = data.projects;
      if (data.resources) this.resources = data.resources;
      if (data.gallery) this.gallery = data.gallery;
      if (data.team) this.team = data.team;
      if (data.achievements) this.achievements = data.achievements;
      if (data.messages) this.messages = data.messages;
      if (data.notifications) this.notifications = data.notifications;
      if (data.profiles) this.profiles = data.profiles;
      if (data.settings) this.settings = data.settings;
      this.persist();
      return true;
    } catch {
      return false;
    }
  }
  // --- MEMBERSHIP APPLICATIONS ---
  public getApplications(): MembershipApplication[] {
    return this.applications;
  }

  public getApplicationByUserId(userId: string): MembershipApplication | undefined {
    return this.applications.find(a => a.user_id === userId);
  }

  public submitApplication(app: Omit<MembershipApplication, 'id' | 'status' | 'submitted_at'>): MembershipApplication {
    const newApp: MembershipApplication = {
      ...app,
      id: 'app-' + Date.now(),
      status: 'Pending',
      submitted_at: new Date().toISOString()
    };
    this.applications = [newApp, ...this.applications];
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('membership_applications').insert([newApp]).then();
    }
    return newApp;
  }

  public approveApplication(id: string, reviewerId: string): { success: boolean; error?: string } {
    const app = this.applications.find(a => a.id === id);
    if (!app) return { success: false, error: 'Application not found' };
    
    app.status = 'Accepted';
    app.reviewed_at = new Date().toISOString();
    app.reviewed_by = reviewerId;
    
    const profile = this.profiles.find(p => p.id === app.user_id);
    if (profile) {
      profile.role = 'Member';
    }
    
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('membership_applications').update({
        status: 'Accepted',
        reviewed_at: app.reviewed_at,
        reviewed_by: reviewerId
      }).eq('id', id).then();
      
      if (profile) {
        supabase.from('profiles').update({ role: 'Member' }).eq('id', profile.id).then();
      }
    }
    
    return { success: true };
  }

  public rejectApplication(id: string, reviewerId: string, message?: string): { success: boolean; error?: string } {
    const app = this.applications.find(a => a.id === id);
    if (!app) return { success: false, error: 'Application not found' };
    
    app.status = 'Rejected';
    app.reviewed_at = new Date().toISOString();
    app.reviewed_by = reviewerId;
    app.rejection_message = message;
    
    this.persist();
    if (isSupabaseConfigured) {
      supabase.from('membership_applications').update({
        status: 'Rejected',
        reviewed_at: app.reviewed_at,
        reviewed_by: reviewerId,
        rejection_message: message
      }).eq('id', id).then();
    }
    
    return { success: true };
  }
}

export const dataStore = new DataStore();
