import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  HardDrive, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';
import { ClubSettings } from '../../types';

interface AdminSettingsSectionProps {
  onRefresh: () => void;
}

export const AdminSettingsSection: React.FC<AdminSettingsSectionProps> = ({ onRefresh }) => {
  const { success, error, info } = useToast();
  const [settings, setSettings] = useState<ClubSettings>(() => dataStore.getSettings());
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const handleChange = (field: keyof ClubSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.updateSettings(settings);
    success('Platform settings saved and applied successfully!');
    onRefresh();
  };

  const handleExportBackup = () => {
    const backupStr = dataStore.exportBackup();
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aiml-club-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success('Backup downloaded successfully!');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) {
      error('Please provide valid JSON data');
      return;
    }
    const ok = dataStore.importBackup(importJsonText);
    if (ok) {
      success('Data successfully restored from backup!');
      setShowImportModal(false);
      setSettings(dataStore.getSettings());
      onRefresh();
    } else {
      error('Failed to parse backup JSON. Please check file format.');
    }
  };

  const handleResetDefaults = () => {
    if (confirm('CAUTION: This will reset all activities, workshops, projects, and settings to original factory defaults. Continue?')) {
      dataStore.resetToDefaults();
      setSettings(dataStore.getSettings());
      success('Platform data reset to defaults.');
      onRefresh();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800 text-purple-300 text-xs font-mono uppercase tracking-wider mb-2">
            <Settings className="w-3.5 h-3.5" />
            Configuration
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Platform & Club Settings
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Configure institutional details, governance policies, live telemetry, and data backups.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs sm:text-sm transition shadow-md self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Institutional & Identity */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Club Identity & Institutional Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Club Display Name</label>
              <input
                type="text"
                value={settings.clubName}
                onChange={(e) => handleChange('clubName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Affiliated Institution</label>
              <input
                type="text"
                value={settings.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 font-mono mb-1">Mission Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Official Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Campus Phone Contact</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 font-mono mb-1">Campus Physical Address</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Social Links */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
            <ExternalLink className="w-4 h-4 text-purple-400" />
            <span>Community & Repository Links</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1">GitHub Organization URL</label>
              <input
                type="url"
                value={settings.githubUrl}
                onChange={(e) => handleChange('githubUrl', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">LinkedIn Page URL</label>
              <input
                type="url"
                value={settings.linkedinUrl}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Discord Community Server</label>
              <input
                type="url"
                value={settings.discordUrl || ''}
                onChange={(e) => handleChange('discordUrl', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Instagram Handle URL</label>
              <input
                type="url"
                value={settings.instagramUrl || ''}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Telemetry & Announcement Banner */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Telemetry & Public Broadcast Banner</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Cluster Telemetry Text</label>
              <input
                type="text"
                value={settings.clusterStatusText}
                onChange={(e) => handleChange('clusterStatusText', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Online GPUs Count</label>
              <input
                type="number"
                value={settings.clusterGpuCount}
                onChange={(e) => handleChange('clusterGpuCount', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 font-mono mb-1">Header Top Alert Announcement</label>
              <input
                type="text"
                value={settings.announcementText || ''}
                onChange={(e) => handleChange('announcementText', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="announcementActive"
                checked={settings.announcementActive}
                onChange={(e) => handleChange('announcementActive', e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-950 border-slate-700"
              />
              <label htmlFor="announcementActive" className="text-slate-300 font-medium cursor-pointer">
                Display top announcement bar on public website
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="enableCountdownBanner"
                checked={settings.enableCountdownBanner}
                onChange={(e) => handleChange('enableCountdownBanner', e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-950 border-slate-700"
              />
              <label htmlFor="enableCountdownBanner" className="text-slate-300 font-medium cursor-pointer">
                Display live event countdown ticker on public homepage
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Governance & Policies */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span>Governance & Registration Policies</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="allowPublicRegistration"
                checked={settings.allowPublicRegistration}
                onChange={(e) => handleChange('allowPublicRegistration', e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-950 border-slate-700"
              />
              <label htmlFor="allowPublicRegistration" className="text-slate-300 font-medium cursor-pointer">
                Allow students to register for workshops publicly
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="requireProjectApproval"
                checked={settings.requireProjectApproval}
                onChange={(e) => handleChange('requireProjectApproval', e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-950 border-slate-700"
              />
              <label htmlFor="requireProjectApproval" className="text-slate-300 font-medium cursor-pointer">
                Require Admin / Lead approval before publishing student project submissions
              </label>
            </div>
          </div>
        </div>

        {/* Section 5: Data Storage, Backup & Factory Reset */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>Data Storage & System Operations</span>
          </h3>

          <p className="text-slate-400 text-xs">
            Export club data, restore state from a backup JSON file, or reset to original factory records.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition border border-slate-700 shadow-sm"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Download JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition border border-slate-700 shadow-sm"
            >
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Import JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 font-medium text-xs transition border border-red-800/50 shadow-sm"
            >
              <RotateCcw className="w-4 h-4 text-red-400" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Import Club Data from Backup</span>
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Paste the exported JSON text below to restore all club activities, projects, workshops, and settings.
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <textarea
                rows={8}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{"activities": [...], "workshops": [...], ...}'
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-200 focus:outline-none focus:border-purple-500"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md"
                >
                  Restore Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
