import React from 'react';
import { AiLabVisualizer } from '../components/AiLabVisualizer';

export const LabSection: React.FC = () => {
  return (
    <section id="lab" className="py-20 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/50">
      <div className="max-w-7xl mx-auto">
        <AiLabVisualizer />
      </div>
    </section>
  );
};
