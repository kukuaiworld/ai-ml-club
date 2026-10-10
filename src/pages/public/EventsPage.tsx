import React from 'react';
import { Calendar } from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { ClubEvent } from '../../types';
import { GallerySection } from '../../sections/GallerySection';

interface EventsPageProps {
  events: ClubEvent[];
  onSelectEvent: (event: ClubEvent) => void;
  onOpenGallery: (event: ClubEvent) => void;
  onNavigateTab: (tabId: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  onSelectEvent,
  onOpenGallery,
  onNavigateTab,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicPageHeader
        badge="Club Events"
        badgeIcon={<Calendar className="w-3.5 h-3.5 text-purple-400" />}
        title="Events & "
        highlightedTitle="Experiences"
        subtitle="Discover upcoming opportunities, explore our past events, and be part of the future of AI."
        breadcrumbs={[{ label: 'Events' }]}
        onNavigate={onNavigateTab}
      />

      <div className="w-full">
        <GallerySection
          gallery={[]}
          events={events}
          onSelectEvent={onSelectEvent}
          onOpenLightbox={(item) => {
            onNavigateTab('gallery');
            onOpenGallery({ 
              id: item.id || 'temp', 
              title: item.title, 
              originalType: 'activity', 
              galleryImages: [item] 
            } as any);
          }}
          mode="timeline"
        />
      </div>
    </div>
  );
};
