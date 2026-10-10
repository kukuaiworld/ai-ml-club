import React from 'react';
import { Mail } from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { ContactSection } from '../../sections/ContactSection';

interface ContactPageProps {
  onNavigateTab: (tabId: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateTab }) => {
  return (
    <div className="flex flex-col">
      <PublicPageHeader
        badge="Connect & Collaborate"
        badgeIcon={<Mail className="w-3.5 h-3.5 text-purple-400" />}
        title="Get in Touch with The"
        highlightedTitle="Executive Board"
        subtitle="Have questions about inductions, workshop sponsorships, GPU compute allocations, or joint research projects? Send our team a message."
        breadcrumbs={[{ label: 'Contact' }]}
        onNavigate={onNavigateTab}
      />

      <div className="py-6">
        <ContactSection />
      </div>
    </div>
  );
};
