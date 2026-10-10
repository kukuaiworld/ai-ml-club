import React from 'react';
import { Calendar } from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { ActivitiesSection } from '../../sections/ActivitiesSection';
import { Activity } from '../../types';

interface ActivitiesPageProps {
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  onNavigateTab: (tabId: string) => void;
}

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({
  activities,
  onSelectActivity,
  onNavigateTab,
}) => {
  return (
    <div className="flex flex-col">
      <PublicPageHeader
        badge="Club Calendar"
        badgeIcon={<Calendar className="w-3.5 h-3.5 text-purple-400" />}
        title="Explore Scheduled AI"
        highlightedTitle="Activities & Challenges"
        subtitle="Stay updated with flagship hackathons, weekly reading circles, algorithm design derbies, and campus AI demo days."
        breadcrumbs={[{ label: 'Activities' }]}
        onNavigate={onNavigateTab}
      />

      <div className="py-6">
        <ActivitiesSection
          activities={activities}
          onSelectActivity={onSelectActivity}
          isFullPage={true}
        />
      </div>
    </div>
  );
};
