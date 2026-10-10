import React from 'react';
import { Users } from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { TeamSection } from '../../sections/TeamSection';
import { TeamMember } from '../../types';

interface TeamPageProps {
  team: TeamMember[];
  onNavigateTab: (tabId: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ team, onNavigateTab }) => {
  return (
    <div className="flex flex-col">
      <PublicPageHeader
        badge="Club Governance"
        badgeIcon={<Users className="w-3.5 h-3.5 text-purple-400" />}
        title="Meet The AI/ML Club"
        highlightedTitle="Leadership & Leads"
        subtitle="The dedicated executive officers, division leads, and student researchers orchestrating hackathons, workshops, and lab operations at Engineering College, Ajmer."
        breadcrumbs={[{ label: 'Team' }]}
        onNavigate={onNavigateTab}
      />

      <div className="py-6">
        <TeamSection team={team} isFullPage={true} />
      </div>
    </div>
  );
};
