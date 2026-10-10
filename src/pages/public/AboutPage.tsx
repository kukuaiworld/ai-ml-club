import React from 'react';
import { Compass } from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { AboutSection } from '../../sections/AboutSection';
import { LabSection } from '../../sections/LabSection';
import { TeamSection } from '../../sections/TeamSection';
import { TimelineSection } from '../../sections/TimelineSection';
import { AchievementsSection } from '../../sections/AchievementsSection';
import { TeamMember, AchievementStats, TimelineEvent } from '../../types';

interface AboutPageProps {
  team: TeamMember[];
  achievements: AchievementStats;
  timeline: TimelineEvent[];
  onNavigateTab: (tabId: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  team,
  achievements,
  timeline,
  onNavigateTab,
}) => {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <PublicPageHeader
        badge="About The Club"
        badgeIcon={<Compass className="w-3.5 h-3.5 text-purple-400" />}
        title="Engineering Intelligent Systems with"
        highlightedTitle="Academic Rigor"
        subtitle="The AI/ML Club at Engineering College, Ajmer is a student-led research community dedicated to deep learning breakthroughs, state-of-the-art architectures, and open science."
        breadcrumbs={[{ label: 'About' }]}
        onNavigate={onNavigateTab}
      />

      {/* About The Club Pillars */}
      <AboutSection
        onLearnClick={() => onNavigateTab('workshops')}
        onBuildClick={() => onNavigateTab('projects')}
        onInnovateClick={() => onNavigateTab('lab')}
      />

      {/* Lab Simulation Highlight */}
      <LabSection />

      {/* Full Leadership & Team */}
      <TeamSection team={team} isFullPage={true} />

      {/* Club Milestones Timeline */}
      <TimelineSection timeline={timeline} />

      {/* Key Metrics */}
      <AchievementsSection stats={achievements} />
    </div>
  );
};
