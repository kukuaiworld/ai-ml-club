import React from 'react';
import { Camera } from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { GallerySection } from '../../sections/GallerySection';
import { GalleryItem, ClubEvent } from '../../types';

interface GalleryPageProps {
  gallery: GalleryItem[];
  events?: ClubEvent[];
  onSelectEvent?: (event: ClubEvent) => void;
  onOpenLightbox: (item: GalleryItem) => void;
  onNavigateTab: (tabId: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  gallery,
  events = [],
  onSelectEvent,
  onOpenLightbox,
  onNavigateTab,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-transparent relative z-0">
      <PublicPageHeader
        badge="Event Timeline"
        badgeIcon={<Camera className="w-3.5 h-3.5 text-purple-400" />}
        title="Event "
        highlightedTitle="Gallery"
        subtitle="Explore our journey, achievements, and memorable experiences alongside upcoming opportunities."
        breadcrumbs={[{ label: 'Gallery' }]}
        onNavigate={onNavigateTab}
      />

      <div className="w-full">
        <GallerySection
          gallery={gallery}
          events={events}
          onSelectEvent={onSelectEvent}
          onOpenLightbox={onOpenLightbox}
          isFullPage={true}
          mode="grid"
        />
      </div>
    </div>
  );
};
