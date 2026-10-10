import React from 'react';
import { ShieldCheck, HardDrive, Cpu, ExternalLink } from 'lucide-react';
import { dataStore } from '../../services/dataStore';

interface AdminFooterProps {
  onReturnToSite: () => void;
  onSelectTab: (tab: any) => void;
}

export const AdminFooter: React.FC<AdminFooterProps> = ({ onReturnToSite, onSelectTab }) => {
  const settings = dataStore.getSettings();

  return (
    <footer className="h-14 bg-slate-900 border-t border-slate-800 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2 shrink-0">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Club Control Panel v2.4</span>
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <span className="hidden md:flex items-center gap-1.5 text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Cluster: {settings.clusterGpuCount}x GPUs Active</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onSelectTab('settings')}
          className="hover:text-purple-300 transition"
        >
          Backup & Storage
        </button>
        <button
          onClick={() => onSelectTab('analytics')}
          className="hover:text-purple-300 transition"
        >
          Audit Telemetry
        </button>
        <button
          onClick={onReturnToSite}
          className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
        >
          <span>Exit to Public Site</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </footer>
  );
};
