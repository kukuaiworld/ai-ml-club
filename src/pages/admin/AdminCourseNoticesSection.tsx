import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Edit3,
  Trash2,
  Pin,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  GraduationCap,
  Search,
  X,
  CheckCircle2,
} from 'lucide-react';
import { CourseNotice, CourseNoticeStatus, AIDomain } from '../../types';
import { dataStore } from '../../services/dataStore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminCourseNoticesSectionProps {
  notices: CourseNotice[];
}

const DOMAIN_OPTIONS: (AIDomain | 'Python for AI')[] = [
  'Machine Learning',
  'Deep Learning',
  'Generative AI',
  'Natural Language Processing',
  'Computer Vision',
  'AI Agents',
  'Neural Networks',
  'Data Science',
  'Robotics',
  'Python for AI',
  'Responsible AI',
];

const STATUS_OPTIONS: CourseNoticeStatus[] = [
  'Registrations Open',
  'Upcoming',
  'Starting Soon',
  'Ongoing',
];

export const AdminCourseNoticesSection: React.FC<AdminCourseNoticesSectionProps> = ({
  notices,
}) => {
  const { user } = useAuth();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<CourseNotice | null>(null);

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = filterDomain === 'All' || n.domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  const publishedCount = notices.filter((n) => n.published).length;
  const pinnedCount = notices.filter((n) => n.pinned).length;
  const openRegCount = notices.filter((n) => n.status === 'Registrations Open').length;

  const handleOpenAdd = () => {
    setEditingNotice(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (notice: CourseNotice) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleSaveNotice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload: Omit<CourseNotice, 'id' | 'created_at'> = {
      title: (fd.get('title') as string).trim(),
      domain: fd.get('domain') as AIDomain | 'Python for AI',
      description: (fd.get('description') as string).trim(),
      instructor: (fd.get('instructor') as string).trim(),
      start_date: fd.get('start_date') as string,
      duration: (fd.get('duration') as string).trim(),
      mode: (fd.get('mode') as string).trim(),
      level: fd.get('level') as CourseNotice['level'],
      status: fd.get('status') as CourseNoticeStatus,
      registration_link: ((fd.get('registration_link') as string) || '#workshops').trim(),
      pinned: fd.get('pinned') === 'true',
      published: fd.get('published') === 'true',
      created_by: user?.name || 'Admin',
    };

    if (editingNotice) {
      dataStore.updateCourseNotice(editingNotice.id, payload);
      success('AI/ML Course Notice updated successfully!');
    } else {
      dataStore.addCourseNotice(payload);
      success('New AI/ML Course Notice published to Visitor Notice Board!');
    }

    setIsModalOpen(false);
    setEditingNotice(null);
  };

  const handleTogglePublish = (notice: CourseNotice) => {
    dataStore.updateCourseNotice(notice.id, { published: !notice.published });
    success(
      !notice.published
        ? `"${notice.title}" is now visible to visitors.`
        : `"${notice.title}" moved to draft.`
    );
  };

  const handleTogglePin = (notice: CourseNotice) => {
    dataStore.updateCourseNotice(notice.id, { pinned: !notice.pinned });
    success(
      !notice.pinned
        ? `"${notice.title}" pinned to top of Notice Board.`
        : `"${notice.title}" unpinned.`
    );
  };

  const handleDelete = (notice: CourseNotice) => {
    dataStore.deleteCourseNotice(notice.id);
    success(`Removed course notice "${notice.title}".`);
  };

  return (
    <div className="space-y-6 animate-page-reveal">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-purple-400" />
            <span>Visitor Notice Board — Upcoming AI/ML Courses</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Publish and manage AI/ML upcoming courses, bootcamps, and training notices visible to visitors on the website.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-2 self-start sm:self-auto shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Upcoming Course Notice</span>
        </button>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Notices</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{notices.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-mono uppercase text-emerald-400">Visible to Visitors</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{publishedCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-mono uppercase text-fuchsia-400">Pinned Notices</div>
          <div className="text-2xl font-black text-fuchsia-300 font-mono mt-1">{pinnedCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-mono uppercase text-purple-400">Registrations Open</div>
          <div className="text-2xl font-black text-purple-300 font-mono mt-1">{openRegCount}</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by title, AI/ML topic, or instructor..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={filterDomain}
          onChange={(e) => setFilterDomain(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
        >
          <option value="All">All AI/ML Domains</option>
          {DOMAIN_OPTIONS.map((dom) => (
            <option key={dom} value={dom}>
              {dom}
            </option>
          ))}
        </select>
      </div>

      {/* Course Notices Cards List */}
      {filteredNotices.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <Bell className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <div className="text-sm font-bold text-white">No Course Notices Found</div>
          <p className="text-xs text-slate-400 mt-1">
            Click &ldquo;Add Upcoming Course Notice&rdquo; to publish a new AI/ML course announcement for visitors.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`p-5 rounded-2xl bg-slate-900 border transition flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                notice.pinned ? 'border-purple-500/40' : 'border-slate-800'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {notice.pinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-700/50">
                      <Pin className="w-2.5 h-2.5" />
                      Pinned
                    </span>
                  )}
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                    {notice.domain}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {notice.level}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/40">
                    {notice.status}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      notice.published
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                    }`}
                  >
                    {notice.published ? 'Published (Visitor Visible)' : 'Draft (Hidden)'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{notice.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                  {notice.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300 font-mono">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Starts: {notice.start_date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    {notice.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    {notice.instructor}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    {notice.mode}
                  </span>
                </div>
              </div>

              {/* Admin Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                <button
                  onClick={() => handleTogglePin(notice)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition ${
                    notice.pinned
                      ? 'bg-fuchsia-950/60 border-fuchsia-700/50 text-fuchsia-300 hover:bg-fuchsia-900/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={notice.pinned ? 'Unpin Notice' : 'Pin Notice to Top'}
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>{notice.pinned ? 'Pinned' : 'Pin'}</span>
                </button>

                <button
                  onClick={() => handleTogglePublish(notice)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition ${
                    notice.published
                      ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={notice.published ? 'Unpublish' : 'Publish to Visitors'}
                >
                  {notice.published ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenEdit(notice)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  title="Edit Course Notice"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(notice)}
                  className="p-2 rounded-lg bg-red-950/50 hover:bg-red-900/70 text-red-400 border border-red-800/40 transition"
                  title="Delete Course Notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Course Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <span>
                  {editingNotice
                    ? 'Edit Upcoming AI/ML Course Notice'
                    : 'Publish New Upcoming AI/ML Course Notice'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingNotice(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Course Title *</label>
                <input
                  name="title"
                  required
                  defaultValue={editingNotice?.title}
                  placeholder="e.g. Deep Learning & Transformer Architectures Specialization"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">AI/ML Domain *</label>
                  <select
                    name="domain"
                    defaultValue={editingNotice?.domain || 'Deep Learning'}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    {DOMAIN_OPTIONS.map((dom) => (
                      <option key={dom} value={dom}>
                        {dom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Difficulty Level</label>
                  <select
                    name="level"
                    defaultValue={editingNotice?.level || 'All Levels'}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Start Date *</label>
                  <input
                    name="start_date"
                    type="date"
                    required
                    defaultValue={editingNotice?.start_date || '2026-10-25'}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Duration *</label>
                  <input
                    name="duration"
                    required
                    defaultValue={editingNotice?.duration || '6 Weeks (18 Hours)'}
                    placeholder="e.g. 6 Weeks (18 Hours)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Instructor / Mentor *</label>
                  <input
                    name="instructor"
                    required
                    defaultValue={editingNotice?.instructor || 'Shreyansh Sharma & Technical Team'}
                    placeholder="e.g. Shreyansh Sharma & Rajshree Khandelwal"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Mode / Venue *</label>
                  <input
                    name="mode"
                    required
                    defaultValue={editingNotice?.mode || 'Hybrid • AI Lab 3B & Live Stream'}
                    placeholder="e.g. Hybrid • AI Lab 3B & Online"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Course Notice & Syllabus Description *
                </label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  defaultValue={editingNotice?.description}
                  placeholder="Describe the upcoming AI/ML course topics, prerequisites, and key takeaways for visitors..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Notice Status</label>
                  <select
                    name="status"
                    defaultValue={editingNotice?.status || 'Registrations Open'}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Pin to Top</label>
                  <select
                    name="pinned"
                    defaultValue={String(editingNotice ? Boolean(editingNotice.pinned) : true)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="true">Pinned (Featured)</option>
                    <option value="false">Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Visibility</label>
                  <select
                    name="published"
                    defaultValue={String(editingNotice ? editingNotice.published : true)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="true">Published to Visitors</option>
                    <option value="false">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Enrollment / Registration Link (Optional)
                </label>
                <input
                  name="registration_link"
                  defaultValue={editingNotice?.registration_link || '#workshops'}
                  placeholder="#workshops or https://..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingNotice(null);
                  }}
                  className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium flex items-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingNotice ? 'Save Changes' : 'Publish Course Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
