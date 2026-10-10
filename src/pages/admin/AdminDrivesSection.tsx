import React, { useState } from 'react';
import {
  Database,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Link,
  Tag,
  Search,
  X,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { EventDrive } from '../../types';
import { dataStore } from '../../services/dataStore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminDrivesSectionProps {
  drives: EventDrive[];
}

export const AdminDrivesSection: React.FC<AdminDrivesSectionProps> = ({ drives }) => {
  const { user } = useAuth();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState<EventDrive | null>(null);

  const filteredDrives = drives.filter((d) => {
    return (
      d.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  });

  const publishedCount = drives.filter((d) => d.is_published).length;

  const handleOpenAdd = () => {
    setEditingDrive(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (drive: EventDrive) => {
    setEditingDrive(drive);
    setIsModalOpen(true);
  };

  const handleSaveDrive = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload: Omit<EventDrive, 'id' | 'created_at'> = {
      event_name: (fd.get('event_name') as string).trim(),
      drive_url: (fd.get('drive_url') as string).trim(),
      event_date: (fd.get('event_date') as string) || undefined,
      category: (fd.get('category') as string).trim() || undefined,
      description: (fd.get('description') as string).trim() || undefined,
      cover_image_url: (fd.get('cover_image_url') as string).trim() || undefined,
      is_published: fd.get('is_published') === 'true',
      created_by: user?.name || 'Admin',
    };

    if (editingDrive) {
      dataStore.updateDrive(editingDrive.id, payload);
      success('Drive updated successfully!');
    } else {
      dataStore.addDrive(payload);
      success('New Drive added successfully!');
    }

    setIsModalOpen(false);
    setEditingDrive(null);
  };

  const handleTogglePublish = (drive: EventDrive) => {
    dataStore.toggleDrivePublished(drive.id);
    success(
      !drive.is_published
        ? `"${drive.event_name}" is now published.`
        : `"${drive.event_name}" moved to draft.`
    );
  };

  const handleDelete = (drive: EventDrive) => {
    if (window.confirm('Are you sure you want to delete this drive entry? The actual Google Drive files will not be deleted.')) {
      dataStore.deleteDrive(drive.id);
      success(`Removed drive entry "${drive.event_name}".`);
    }
  };

  return (
    <div className="space-y-6 animate-page-reveal">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Database className="w-6 h-6 text-purple-400" />
            <span>Manage Drives</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Publish Google Drive links for event photos and resources.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Add Drive Link
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-card border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-white">{drives.length}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Drives</div>
        </div>
        <div className="bg-dark-card border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-emerald-400">{publishedCount}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Published</div>
        </div>
        <div className="bg-dark-card border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-amber-400">{drives.length - publishedCount}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Drafts</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-dark-card border border-white/10 p-4 rounded-2xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search drives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-bg border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-dark-card border border-white/10 rounded-2xl overflow-hidden">
        {filteredDrives.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No drives found. Click "Add Drive Link" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 bg-dark-bg/50 uppercase font-mono">
                <tr>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDrives.map((drive) => (
                  <tr key={drive.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{drive.event_name}</div>
                      <a href={drive.drive_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-1 truncate max-w-[200px]">
                        <Link className="w-3 h-3" /> {drive.drive_url}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {drive.category ? (
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-[10px] uppercase font-bold tracking-wider border border-purple-500/20">
                          {drive.category}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {drive.event_date ? new Date(drive.event_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {drive.is_published ? (
                        <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="text-amber-400 text-xs font-medium flex items-center gap-1">
                          <EyeOff className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleTogglePublish(drive)}
                          className="p-1.5 bg-dark-bg border border-white/10 rounded-lg hover:text-white"
                          title={drive.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {drive.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(drive)}
                          className="p-1.5 bg-dark-bg border border-white/10 rounded-lg hover:text-white hover:border-purple-500/30"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(drive)}
                          className="p-1.5 bg-dark-bg border border-white/10 rounded-lg hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-24 pb-8 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-dark-card border border-white/10 rounded-2xl w-full max-w-2xl max-h-[100%] flex flex-col shadow-2xl overflow-hidden">
            {/* Header - Fixed */}
            <div className="flex-none flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {editingDrive ? <Edit3 className="w-5 h-5 text-purple-400" /> : <Plus className="w-5 h-5 text-purple-400" />}
                {editingDrive ? 'Edit Drive Link' : 'Add Drive Link'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveDrive} className="flex flex-col min-h-0">
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Event Name <span className="text-red-400">*</span></label>
                  <input
                    name="event_name"
                    required
                    defaultValue={editingDrive?.event_name}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500/50"
                    placeholder="e.g. NeurAI Hackathon 2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Google Drive URL <span className="text-red-400">*</span></label>
                  <input
                    name="drive_url"
                    type="url"
                    required
                    defaultValue={editingDrive?.drive_url}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500/50"
                    placeholder="https://drive.google.com/drive/folders/..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Event Date
                    </label>
                    <input
                      name="event_date"
                      type="date"
                      defaultValue={editingDrive?.event_date}
                      className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Category
                    </label>
                    <input
                      name="category"
                      defaultValue={editingDrive?.category}
                      className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500/50"
                      placeholder="e.g. Hackathon, Workshop"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={editingDrive?.description}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500/50 resize-none"
                    placeholder="Briefly describe what files are included..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" /> Cover Image URL
                  </label>
                  <input
                    name="cover_image_url"
                    type="url"
                    defaultValue={editingDrive?.cover_image_url}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500/50"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Publication Status</label>
                  <select
                    name="is_published"
                    defaultValue={editingDrive ? (editingDrive.is_published ? 'true' : 'false') : 'false'}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500/50 cursor-pointer"
                  >
                    <option value="true">Published (Visible to everyone)</option>
                    <option value="false">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="flex-none flex items-center justify-end gap-3 p-5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-dark-bg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Drive Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
