export type UserRole = 'Registered User' | 'Member' | 'Core Member' | 'Vice President' | 'Admin';

export type ApplicationStatus = 'Pending' | 'Accepted' | 'Rejected';

export type AccountStatus = 'Active' | 'Deactivated';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username?: string;
  password?: string;
  role: UserRole;
  accountStatus?: AccountStatus;
  avatar_url?: string;
  specialization?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  created_at: string;
}

export interface MembershipApplication {
  id: string;
  user_id: string;
  full_name?: string;
  college_email?: string;
  contact_number?: string;
  college_id?: string;
  branch?: string;
  academic_year?: string;
  section?: string;
  skills?: string;
  interests?: string;
  why_join: string;
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
  status: ApplicationStatus;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_message?: string;
}

export type ActivityCategory = 
  | 'Technical Session' 
  | 'Competition' 
  | 'Hackathon' 
  | 'Project Showcase' 
  | 'Club Meeting' 
  | 'AI Challenge';

export type ActivityStatus = 'Upcoming' | 'Live' | 'Completed';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  banner_image: string;
  status: ActivityStatus;
  registration_link?: string;
  published: boolean;
  created_by?: string;
  created_at: string;
}

export type WorkshopStatus = 'Upcoming' | 'Ongoing' | 'Past' | 'Live' | 'Completed';

export interface Workshop {
  id: string;
  name: string;
  topic: string;
  description: string;
  speaker: string;
  speaker_bio?: string;
  speaker_avatar?: string;
  date: string;
  time: string;
  venue: string;
  max_participants: number;
  registered_count: number;
  status: WorkshopStatus;
  banner_image: string;
  required_skills: string[];
  workshop_resources?: string;
  registration_link?: string;
  registration_open: boolean;
  published: boolean;
  created_at: string;
}

export type AIDomain = 
  | 'Machine Learning'
  | 'Deep Learning'
  | 'Generative AI'
  | 'Natural Language Processing'
  | 'Computer Vision'
  | 'Neural Networks'
  | 'Data Science'
  | 'AI Agents'
  | 'Robotics'
  | 'Responsible AI';

export interface Project {
  id: string;
  name: string;
  description: string;
  domain: AIDomain;
  team_members: { name: string; role: string; avatar?: string }[];
  tech_stack: string[];
  github_url: string;
  demo_url?: string;
  cover_image: string;
  status: 'Approved' | 'Pending Review' | 'Draft';
  submitted_by: string;
  featured: boolean;
  created_at: string;
}

export type ResourceCategory = 
  | 'Python'
  | 'Machine Learning'
  | 'Deep Learning'
  | 'Generative AI'
  | 'NLP'
  | 'Computer Vision'
  | 'Data Science'
  | 'Research Papers'
  | 'Datasets'
  | 'Tools'
  | 'AI Agents';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  external_link: string;
  file_type?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  added_by: string;
  stars?: number;
  created_at: string;
}

export type GalleryCategory = 
  | 'Workshops'
  | 'Hackathons'
  | 'Events'
  | 'Project Demonstrations'
  | 'Club Activities';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image_url: string;
  date: string;
  event_name?: string;
  description?: string;
  uploaded_by?: string;
  created_at?: string;
}

export type TeamHierarchy = 
  | 'Faculty Coordinator'
  | 'Club Lead'
  | 'Co-Lead'
  | 'President'
  | 'Vice President'
  | 'Secretary'
  | 'Project Lead'
  | 'Technical Lead'
  | 'Content Lead'
  | 'Treasurer'
  | 'Web Master'
  | 'Core Member'
  | 'Member';

export interface TeamMember {
  id: string;
  name: string;
  position: TeamHierarchy;
  specialization: string;
  bio: string;
  photo: string;
  linkedin: string;
  github: string;
  email?: string;
  featured?: boolean;
}

export type AchievementCategory =
  | 'Hackathon Win'
  | 'Research Publication'
  | 'Competition Award'
  | 'Certification'
  | 'Open Source Contribution'
  | 'Internship / Placement';

export interface MemberAchievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  date: string;
  member_id: string;
  member_name: string;
  member_username?: string;
  proof_url?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export interface AchievementStats {
  id: string;
  members_count: number;
  workshops_count: number;
  projects_count: number;
  hackathons_count: number;
  competitions_won_count: number;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  event: string;
  category: string;
  description: string;
  term?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  created_at: string;
}

export interface WorkshopRegistration {
  id: string;
  workshop_id: string;
  workshop_name: string;
  full_name: string;
  email: string;
  student_id: string;
  department: string;
  semester: string;
  experience_level: string;
  created_at: string;
}

export interface ClubNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'event';
  read: boolean;
  link?: string;
  created_at: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  startDateTime: string; // ISO 8601
  endDateTime?: string; // ISO 8601
  timeZone: string;
  venue: string;
  registrationUrl?: string;
  registrationStatus: 'Open' | 'Closed' | 'N/A';
  eventStatus: 'Upcoming' | 'Live' | 'Completed';
  organizer?: string;
  featured: boolean;
  galleryImages: GalleryItem[];
  originalType: 'activity' | 'workshop';
}

export interface ClubSettings {
  clubName: string;
  tagline: string;
  institution: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  githubUrl: string;
  linkedinUrl: string;
  discordUrl?: string;
  instagramUrl?: string;
  allowPublicRegistration: boolean;
  requireProjectApproval: boolean;
  enableCountdownBanner: boolean;
  clusterStatusText: string;
  clusterGpuCount: number;
  announcementText?: string;
  announcementActive?: boolean;
}

export type CourseNoticeStatus = 'Upcoming' | 'Registrations Open' | 'Starting Soon' | 'Ongoing';

export interface CourseNotice {
  id: string;
  title: string;
  domain: AIDomain | 'Python for AI';
  description: string;
  instructor: string;
  start_date: string;
  duration: string;
  mode: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  status: CourseNoticeStatus;
  registration_link?: string;
  pinned?: boolean;
  published: boolean;
  created_by?: string;
  created_at: string;
}

export interface EventDrive {
  id: string;
  event_name: string;
  drive_url: string;
  event_date?: string;
  category?: string;
  description?: string;
  cover_image_url?: string;
  is_published: boolean;
  created_by?: string;
  created_at: string;
}

export type AdminTabType = 
  | 'overview' 
  | 'course-notices'
  | 'applications'
  | 'achievement-requests'
  | 'users' 
  | 'settings' 
  | 'activities' 
  | 'workshops' 
  | 'projects' 
  | 'resources' 
  | 'gallery' 
  | 'drives'
  | 'messages' 
  | 'achievements' 
  | 'notifications' 
  | 'analytics' 
  | 'profile';



