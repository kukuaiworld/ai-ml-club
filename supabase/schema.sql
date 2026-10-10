-- ============================================================
-- AI/ML CLUB DATABASE SCHEMA & ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Member' CHECK (role IN ('Admin', 'Core Member', 'Member')),
  avatar_url TEXT,
  specialization TEXT,
  bio TEXT,
  github TEXT,
  linkedin TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. ACTIVITIES
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Technical Session', 'Competition', 'Hackathon', 'Project Showcase', 'Club Meeting', 'AI Challenge')),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  organizer TEXT NOT NULL,
  banner_image TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Live', 'Completed')),
  registration_link TEXT,
  published BOOLEAN DEFAULT true NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published activities" 
  ON public.activities FOR SELECT USING (published = true);

CREATE POLICY "Core members and Admins can view all activities" 
  ON public.activities FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Core Member')
    )
  );

CREATE POLICY "Core members and Admins can manage activities" 
  ON public.activities FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Core Member')
    )
  );

-- 3. WORKSHOPS
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT NOT NULL,
  speaker TEXT NOT NULL,
  speaker_bio TEXT,
  speaker_avatar TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  max_participants INTEGER DEFAULT 100 NOT NULL,
  registered_count INTEGER DEFAULT 0 NOT NULL,
  status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Past')),
  banner_image TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}'::TEXT[],
  workshop_resources TEXT,
  registration_link TEXT,
  registration_open BOOLEAN DEFAULT true NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published workshops" 
  ON public.workshops FOR SELECT USING (published = true);

CREATE POLICY "Authorized members can manage workshops" 
  ON public.workshops FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Core Member')
    )
  );

-- 4. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,
  team_members JSONB DEFAULT '[]'::JSONB NOT NULL,
  tech_stack TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  github_url TEXT NOT NULL,
  demo_url TEXT,
  cover_image TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Approved' CHECK (status IN ('Approved', 'Pending Review', 'Draft')),
  submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved projects" 
  ON public.projects FOR SELECT USING (status = 'Approved');

CREATE POLICY "Members can submit projects" 
  ON public.projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Members can view their own pending projects" 
  ON public.projects FOR SELECT USING (submitted_by = auth.uid());

CREATE POLICY "Admins and Core Members can manage all projects" 
  ON public.projects FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Core Member')
    )
  );

-- 5. RESOURCES
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  external_link TEXT NOT NULL,
  file_type TEXT DEFAULT 'Link',
  difficulty TEXT DEFAULT 'Beginner',
  added_by TEXT NOT NULL,
  stars INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are visible to all authenticated users"
  ON public.resources FOR SELECT
  USING (true);

CREATE POLICY "Members can insert resources" 
  ON public.resources FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage resources" 
  ON public.resources FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Core Member')
    )
  );

-- 6. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date DATE NOT NULL,
  event_name TEXT,
  description TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery" 
  ON public.gallery FOR SELECT USING (true);

CREATE POLICY "Authorized members can manage gallery" 
  ON public.gallery FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Core Member')
    )
  );

-- 7. WORKSHOP REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
  workshop_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  student_id TEXT NOT NULL,
  department TEXT NOT NULL,
  semester TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can register" 
  ON public.registrations FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view registrations" 
  ON public.registrations FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Core Member')
    )
  );

-- 8. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY DEFAULT 'primary_stats',
  members_count INTEGER DEFAULT 520,
  workshops_count INTEGER DEFAULT 48,
  projects_count INTEGER DEFAULT 64,
  hackathons_count INTEGER DEFAULT 32,
  competitions_won_count INTEGER DEFAULT 19,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements" 
  ON public.achievements FOR SELECT USING (true);

CREATE POLICY "Admins can update achievements" 
  ON public.achievements FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'
    )
  );

-- 9. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'Unread' CHECK (status IN ('Unread', 'Read', 'Replied')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact message" 
  ON public.contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage contact messages" 
  ON public.contact_messages FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'
    )
  );

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view notifications" 
  ON public.notifications FOR SELECT USING (auth.uid() IS NOT NULL);


-- 11. EVENT DRIVES
CREATE TABLE IF NOT EXISTS public.event_drives (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_name TEXT NOT NULL,
  drive_url TEXT NOT NULL,
  event_date DATE,
  category TEXT,
  description TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT true NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.event_drives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published event drives" 
  ON public.event_drives FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all event drives" 
  ON public.event_drives FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Core Member')
    )
  );

CREATE POLICY "Admins can manage event drives" 
  ON public.event_drives FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Core Member')
    )
  );



-- 12. MEMBERSHIP APPLICATIONS
CREATE TABLE IF NOT EXISTS public.membership_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  college_email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  college_id TEXT NOT NULL,
  branch TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  section TEXT,
  skills TEXT NOT NULL,
  interests TEXT NOT NULL,
  motivation TEXT NOT NULL,
  portfolio_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected')),
  submitted_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rejection_message TEXT
);

ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own application" 
  ON public.membership_applications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own application" 
  ON public.membership_applications FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all applications" 
  ON public.membership_applications FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Core Member')
    )
  );

CREATE POLICY "Admins can update applications" 
  ON public.membership_applications FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Core Member')
    )
  );

