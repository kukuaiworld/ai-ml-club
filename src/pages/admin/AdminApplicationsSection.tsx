import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, XCircle, FileText, CheckCircle2 } from 'lucide-react';
import { dataStore } from '../../services/dataStore';
import { useAuth } from '../../context/AuthContext';
import { MembershipApplication, UserProfile } from '../../types';

export const AdminApplicationsSection: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Accepted' | 'Rejected'>('Pending');
  
  const [applications, setApplications] = useState<MembershipApplication[]>(dataStore.getApplications());
  const [profiles] = useState<UserProfile[]>(dataStore.getProfiles());

  const [selectedApp, setSelectedApp] = useState<MembershipApplication | null>(null);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const refreshData = () => {
    setApplications(dataStore.getApplications());
  };

  const handleApprove = (id: string) => {
    if (!user) return;
    const res = dataStore.approveApplication(id, user.id);
    if (res.success) {
      refreshData();
      setSelectedApp(null);
    } else {
      alert(res.error);
    }
  };

  const handleReject = () => {
    if (!user || !selectedApp) return;
    if (!rejectionMessage.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    const res = dataStore.rejectApplication(selectedApp.id, user.id, rejectionMessage);
    if (res.success) {
      refreshData();
      setShowRejectModal(false);
      setSelectedApp(null);
      setRejectionMessage('');
    } else {
      alert(res.error);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    
    if (!searchTerm) return matchesStatus;
    
    const prof = profiles.find(p => p.id === app.user_id);
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      prof?.name.toLowerCase().includes(searchLower) ||
      prof?.email.toLowerCase().includes(searchLower) ||
      prof?.username?.toLowerCase().includes(searchLower);
      
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Membership Applications</h2>
          <p className="text-sm text-slate-400">Review and manage join requests from registered users.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="flex gap-2">
          {(['All', 'Pending', 'Accepted', 'Rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
                statusFilter === status 
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300' 
                  : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-dark-surface border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono text-slate-500 uppercase">
                <th className="py-4 px-6 font-medium">User</th>
                <th className="py-4 px-6 font-medium">Applied Date</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                    No applications found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => {
                  const prof = profiles.find(p => p.id === app.user_id);
                  if (!prof) return null;
                  
                  return (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={prof.avatar_url} 
                            alt={prof.name}
                            className="w-8 h-8 rounded-full border border-white/10 object-cover"
                          />
                          <div>
                            <div className="text-sm font-medium text-white">{prof.name}</div>
                            <div className="text-[11px] text-slate-500">{prof.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="text-sm text-slate-300">
                          {new Date(app.submitted_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                          app.status === 'Accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          app.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-slate-300 transition-colors"
                        >
                          Review Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (() => {
        const prof = profiles.find(p => p.id === selectedApp.user_id);
        if (!prof) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1025] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Application Review
                </h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="flex items-center gap-4 bg-dark-bg/50 border border-white/5 p-4 rounded-xl">
                  <img src={prof.avatar_url} alt="" className="w-16 h-16 rounded-full border border-white/10" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">{prof.name}</h4>
                    <p className="text-sm text-slate-400">{prof.email}</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">@{prof.username || 'unknown'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-dark-bg/50 border border-white/5 p-4 rounded-xl">
                    <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">GitHub URL</div>
                    <a href={selectedApp.github_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-sm break-all">
                      {selectedApp.github_url}
                    </a>
                  </div>
                  {selectedApp.linkedin_url && (
                    <div className="bg-dark-bg/50 border border-white/5 p-4 rounded-xl">
                      <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">LinkedIn URL</div>
                      <a href={selectedApp.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-sm break-all">
                        {selectedApp.linkedin_url}
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-dark-bg/50 border border-white/5 p-4 rounded-xl">
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-2">Why they want to join</div>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{selectedApp.why_join}</p>
                </div>
              </div>

              {selectedApp.status === 'Pending' && (
                <div className="p-6 border-t border-white/10 bg-dark-bg/50 flex justify-end gap-3 shrink-0">
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 text-sm font-medium transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Make Member
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Reject Modal */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1025] border border-red-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-2 text-red-400">Reject Application</h3>
              <p className="text-sm text-slate-400 mb-4">
                Please provide a reason for rejecting this application. The user will see this message.
              </p>
              <textarea
                value={rejectionMessage}
                onChange={e => setRejectionMessage(e.target.value)}
                placeholder="e.g. Your GitHub profile is empty, please upload some projects first."
                className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[100px] mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
