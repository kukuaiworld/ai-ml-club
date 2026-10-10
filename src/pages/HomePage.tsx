import React from 'react';
import { HeroSection } from '../sections/HeroSection';
import { CountdownBanner } from '../components/CountdownBanner';
import { AboutSection } from '../sections/AboutSection';
import { DomainsSection } from '../sections/DomainsSection';
import { ActivitiesSection } from '../sections/ActivitiesSection';
import { WorkshopsSection } from '../sections/WorkshopsSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { AchievementsSection } from '../sections/AchievementsSection';
import { TimelineSection } from '../sections/TimelineSection';
import { TeamSection } from '../sections/TeamSection';
import { ResourcesSection } from '../sections/ResourcesSection';
import { GallerySection } from '../sections/GallerySection';
import { ContactSection } from '../sections/ContactSection';
import { 
  Activity, 
  Workshop, 
  Project, 
  Resource, 
  GalleryItem, 
  TeamMember, 
  AchievementStats, 
  TimelineEvent, 
  AIDomain 
} from '../types';

interface HomePageProps {
  activities: Activity[];
  workshops: Workshop[];
  projects: Project[];
  resources: Resource[];
  gallery: GalleryItem[];
  team: TeamMember[];
  achievements: AchievementStats;
  timeline: TimelineEvent[];
  onSelectActivity: (activity: Activity) => void;
  onSelectWorkshop: (workshop: Workshop) => void;
  onSelectProject: (project: Project) => void;
  onOpenLightbox: (item: GalleryItem) => void;
  onNavigateTab: (tabId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  activities,
  workshops,
  projects,
  resources,
  gallery,
  team,
  achievements,
  timeline,
  onSelectActivity,
  onSelectWorkshop,
  onSelectProject,
  onOpenLightbox,
  onNavigateTab,
}) => {
  const nextUpcomingWorkshop = workshops.find((w) => w.status === 'Upcoming') || null;

  return (
    <div className="flex flex-col">
      {/* 3D Hero Section */}
      <HeroSection
        onExploreClick={() => onNavigateTab('about')}
        onWorkshopsClick={() => onNavigateTab('workshops')}
      />

      {/* Live Event Countdown Ticker */}
      <CountdownBanner
        workshop={nextUpcomingWorkshop}
        onRegisterClick={onSelectWorkshop}
      />

      {/* About The Club */}
      <AboutSection
        onLearnClick={() => onNavigateTab('workshops')}
        onBuildClick={() => onNavigateTab('projects')}
        onInnovateClick={() => onNavigateTab('lab')}
      />

      {/* Explore AI Domains */}
      <DomainsSection
        onSelectDomain={(_dom: AIDomain) => onNavigateTab('projects')}
      />

      {/* Activities Preview */}
      <ActivitiesSection
        activities={activities}
        onSelectActivity={onSelectActivity}
        isFullPage={false}
      />

      {/* Workshops Preview */}
      <WorkshopsSection
        workshops={workshops}
        onRegisterClick={onSelectWorkshop}
        isFullPage={false}
      />

      {/* Project Showcase Preview */}
      <ProjectsSection
        projects={projects}
        onSelectProject={onSelectProject}
        isFullPage={false}
      />

      {/* Dynamic Achievements Counters */}
      <AchievementsSection stats={achievements} />

      {/* Academic Year Timeline */}
      <TimelineSection timeline={timeline} />

      {/* Club Leadership & Team */}
      <TeamSection team={team} isFullPage={false} />

      {/* Resource Hub */}
      <ResourcesSection resources={resources} isFullPage={false} />

      {/* Modern Masonry Gallery */}
      <GallerySection gallery={gallery} onOpenLightbox={onOpenLightbox} isFullPage={false} />

      {/* Contact & Dispatch Section */}
      <ContactSection />
    </div>
  );
};
