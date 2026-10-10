import React from 'react';
import { Bell } from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { VisitorNoticeSection } from '../../sections/VisitorNoticeSection';
import { CourseNotice } from '../../types';

interface NoticesPageProps {
  notices: CourseNotice[];
  onNavigateTab: (tabId: string) => void;
}

export const NoticesPage: React.FC<NoticesPageProps> = ({
  notices,
  onNavigateTab,
}) => {
  return (
    <div className="flex flex-col">
      <PublicPageHeader
        badge="Visitor Notice Board"
        badgeIcon={<Bell className="w-3.5 h-3.5 text-purple-400" />}
        title="Upcoming AI/ML"
        highlightedTitle="Courses & Notices"
        subtitle="Official announcements, training cohorts, and upcoming AI/ML course schedules published by the club administration for visitors and students."
        breadcrumbs={[{ label: 'Notices' }]}
        onNavigate={onNavigateTab}
      />

      <div className="py-6">
        <VisitorNoticeSection
          notices={notices}
          onActionClick={(notice) => {
            if (notice.registration_link?.startsWith('http')) {
              window.open(notice.registration_link, '_blank', 'noopener,noreferrer');
            } else {
              onNavigateTab('workshops');
            }
          }}
        />
      </div>
    </div>
  );
};
