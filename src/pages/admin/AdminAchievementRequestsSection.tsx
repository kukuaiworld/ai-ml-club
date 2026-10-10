import React, { useState } from 'react';
import {
  Trophy,
  Check,
  X,
  Clock,
  Search,
  User,
  Calendar,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Trash2,
} from 'lucide-react';
import { MemberAchievement } from '../../types';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';

interface AdminAchievementRequestsSectionProps {
  memberAchievements: MemberAchievement[];
  onRefresh: () => void;
}

export const AdminAchievementRequestsSection: React.FC<AdminAchievementRequestsSectionProps> = ({
  memberAchievements,
  onRefresh,
}) => {
  const { success, error, info } = useToast();
  const [statusFilter, setStatusFilter] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingAchievements = memberAchievements.filter((a) => a.status === 'Pending');
  const approvedAchievements = memberAchievements.filter((a) => a.status === 'Approved');
  const rejectedAchievements = memberAchievements.filter((a) => a.status === 'Rejected');

  const filteredAchievements = memberAchievements.filter((a) => {
    const matchesStatus = statusFilter === 'All' ? true : a.status === statusFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.member_name.toLowerCase().includes(q) ||
      (a.member_username && a.member_username.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleApprove = (ach: MemberAchievement) => {
    const res = dataStore.approveMemberAchievement(ach.id);
    if (res.success) {
      success(
        `Approved "${ach.title}" by ${ach.member_name}! It is now visible in the Members' Achievements section.`
      );
      onRefresh();
    } else {
      error(res.error || 'Failed to approve achievement.');
    }
  };

  const handleReject = (ach: MemberAchievement) => {
    const res = dataStore.rejectMemberAchievement(ach.id);
    if (res.success) {
      info(`Rejected achievement submission "${ach.title}" by ${ach.member_name}.`);
      onRefresh();
    } else {
      error(res.error || 'Failed to reject achievement.');
    }
  };

  const handleDelete = (ach: MemberAchievement) => {
    const res = dataStore.deleteMemberAchievement(ach.id);
    if (res.success) {
      info(`Deleted achievement "${ach.title}".`);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-purple-400" />
            <span>Achievement Requests &amp; Member Submissions</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Review member-submitted achievements. Every new achievement remains Pending Approval until approved here. Only approved achievements are visible in the Members&apos; Achievements section.
          </p>
        </div>

        {pendingAchievements.length > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              <strong>{pendingAchievements.length}</strong> Pending Achievement{pendingAchievements.length > 1 ? 's' : ''} Awaiting Review
            </span>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setStatusFilter('Pending')}
          className={`cursor-pointer p-5 rounded-2xl border transition ${
            statusFilter === 'Pending'
              ? 'bg-amber-950/30 border-amber-500/50 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Pending Approval</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300 font-mono">{pendingAchievements.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Awaiting admin review
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('Approved')}
          className={`cursor-pointer p-5 rounded-2xl border transition ${
            statusFilter === 'Approved'
              ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Approved Achievements</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-300 font-mono">{approvedAchievements.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Visible in Members&apos; Achievements
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('Rejected')}
          className={`cursor-pointer p-5 rounded-2xl border transition ${
            statusFilter === 'Rejected'
              ? 'bg-rose-950/30 border-rose-500/50 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Rejected Submissions</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-300 font-mono">{rejectedAchievements.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Hidden from showcase
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'Pending', label: `Pending (${pendingAchievements.length})` },
              { id: 'Approved', label: `Approved (${approvedAchievements.length})` },
              { id: 'Rejected', label: `Rejected (${rejectedAchievements.length})` },
              { id: 'All', label: `All (${memberAchievements.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition ${
                statusFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, member, #username..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Achievement Requests Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {filteredAchievements.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-white">
              {statusFilter === 'Pending'
                ? 'No Pending Achievement Requests'
                : `No ${statusFilter} Achievements Found`}
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {statusFilter === 'Pending'
                ? 'When a member submits a new achievement from the Members\' Achievements section, it will appear here for approval.'
                : 'Try adjusting your search query or switching status filter tabs above.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-mono uppercase text-slate-400">
                  <th className="py-3.5 px-4">Achievement Details</th>
                  <th className="py-3.5 px-4">Submitted By</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs">
                {filteredAchievements.map((ach) => (
                  <tr key={ach.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 max-w-md">
                      <div className="font-semibold text-white text-sm">{ach.title}</div>
                      <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                        {ach.description}
                      </p>
                      {ach.proof_url && (
                        <a
                          href={ach.proof_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-400 hover:text-purple-300 mt-1.5"
                        >
                          <span>View Proof / Certificate</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{ach.member_name}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-950 border border-purple-500/30 text-purple-300 font-mono text-[10px]">
                            {ach.member_username}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-700/50 text-purple-300 font-mono text-[11px]">
                        {ach.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{ach.date}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {ach.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-amber-950/80 text-amber-300 border border-amber-500/40">
                          <AlertCircle className="w-3 h-3 text-amber-400" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                      {ach.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Approved</span>
                        </span>
                      )}
                      {ach.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-rose-950/80 text-rose-300 border border-rose-500/40">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ach.status !== 'Approved' && (
                          <button
                            onClick={() => handleApprove(ach)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition shadow-sm"
                            title="Approve achievement and publish to Members' Achievements"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {ach.status !== 'Rejected' && (
                          <button
                            onClick={() => handleReject(ach)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-medium text-xs transition"
                            title="Reject achievement submission"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(ach)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete achievement"
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
    </div>
  );
};
