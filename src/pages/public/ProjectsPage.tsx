import React from 'react';
import { FolderGit2 } from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { ProjectsSection } from '../../sections/ProjectsSection';
import { Project } from '../../types';

interface ProjectsPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigateTab: (tabId: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onSelectProject,
  onNavigateTab,
}) => {
  return (
    <div className="flex flex-col">
      <PublicPageHeader
        badge="Engineering Portfolio"
        badgeIcon={<FolderGit2 className="w-3.5 h-3.5 text-purple-400" />}
        title="Student AI Innovations &"
        highlightedTitle="Open Source Systems"
        subtitle="Explore open-source systems, deployed neural models, autonomous robotics architectures, and research prototypes engineered by our members."
        breadcrumbs={[{ label: 'Projects' }]}
        onNavigate={onNavigateTab}
      />

      <div className="py-6">
        <ProjectsSection
          projects={projects}
          onSelectProject={onSelectProject}
          isFullPage={true}
        />
      </div>
    </div>
  );
};
