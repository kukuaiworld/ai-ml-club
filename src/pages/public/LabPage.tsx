import React from 'react';
import { Cpu } from 'lucide-react';
import { PublicPageHeader } from '../../components/public/PublicPageHeader';
import { LabSection } from '../../sections/LabSection';

interface LabPageProps {
  onNavigateTab: (tabId: string) => void;
}

export const LabPage: React.FC<LabPageProps> = ({ onNavigateTab }) => {
  return (
    <div className="flex flex-col">
      <PublicPageHeader
        badge="Neural Simulation"
        badgeIcon={<Cpu className="w-3.5 h-3.5 text-purple-400" />}
        title="Inside The Student AI"
        highlightedTitle="Virtual Laboratory"
        subtitle="Interact with live multi-layer perceptron simulations, adjust training epochs and learning rates, and visualize activations dynamically."
        breadcrumbs={[{ label: 'AI Lab' }]}
        onNavigate={onNavigateTab}
      />

      <div className="py-6 min-h-[70vh]">
        <LabSection />
      </div>
    </div>
  );
};
