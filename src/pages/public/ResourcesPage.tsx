import React from 'react';
import { BookOpen } from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { ResourcesSection } from '../../sections/ResourcesSection';
import { Resource } from '../../types';

interface ResourcesPageProps {
  resources: Resource[];
  onNavigateTab: (tabId: string) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ resources, onNavigateTab }) => {
  return (
    <div className="flex flex-col">
      <PublicPageHeader
        badge="Curated Knowledge"
        badgeIcon={<BookOpen className="w-3.5 h-3.5 text-purple-400" />}
        title="AI/ML Developer Library &"
        highlightedTitle="Research Compendium"
        subtitle="Comprehensive practitioner roadmaps, foundational arXiv research breakdowns, curated Hugging Face datasets, and production starter templates."
        breadcrumbs={[{ label: 'Resources' }]}
        onNavigate={onNavigateTab}
      />

      <div className="py-6">
        <ResourcesSection resources={resources} isFullPage={true} />
      </div>
    </div>
  );
};
