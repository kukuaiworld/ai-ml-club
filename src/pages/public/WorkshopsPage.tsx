import React from 'react';
import { Wrench } from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { CountdownBanner } from '../../components/CountdownBanner';
import { WorkshopsSection } from '../../sections/WorkshopsSection';
import { Workshop } from '../../types';

interface WorkshopsPageProps {
  workshops: Workshop[];
  onRegisterClick: (workshop: Workshop) => void;
  onNavigateTab: (tabId: string) => void;
}

export const WorkshopsPage: React.FC<WorkshopsPageProps> = ({
  workshops,
  onRegisterClick,
  onNavigateTab,
}) => {
  const nextUpcomingWorkshop = workshops.find((w) => w.status === 'Upcoming') || null;

  return (
    <div className="flex flex-col">
      <PublicPageHeader
        badge="Hands-on Learning"
        badgeIcon={<Wrench className="w-3.5 h-3.5 text-purple-400" />}
        title="Technical AI Bootcamps &"
        highlightedTitle="Expert Workshops"
        subtitle="Master real-world machine learning frameworks from foundational PyTorch mechanics to multi-agent orchestration and low-bit model quantization."
        breadcrumbs={[{ label: 'Workshops' }]}
        onNavigate={onNavigateTab}
      />

      {/* Live Event Countdown */}
      <CountdownBanner
        workshop={nextUpcomingWorkshop}
        onRegisterClick={onRegisterClick}
      />

      <div className="py-6">
        <WorkshopsSection
          workshops={workshops}
          onRegisterClick={onRegisterClick}
          isFullPage={true}
        />
      </div>
    </div>
  );
};
