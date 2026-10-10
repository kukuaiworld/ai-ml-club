import React, { useState } from 'react';
import { 
  UserPlus, 
  ShieldCheck, 
  Search, 
  Trash2, 
  Mail, 
  X,
  Edit3,
  Copy,
  Check,
  Lock,
  KeyRound,
  UserCheck,
  UserX,
  AlertCircle
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { dataStore } from '../../services/dataStore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminUsersSectionProps {
  profiles: UserProfile[];
  onRefresh: () => void;
}

export const AdminUsersSection: React.FC<AdminUsersSectionProps> = ({ profiles, onRefresh }) => {
  const { user: currentUser, isAdmin } = useAuth();
  const { success, error, info } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  
  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Add User Form state for real-time username generation
  const [addName, setAddName] = useState('');
  const [addUsername, setAddUsername] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState<UserRole>('Member');
  const [addSpecialization, setAddSpecialization] = useState('');
  const [addBio, setAddBio] = useState('');
  const [isCustomUsername, setIsCustomUsername] = useState(false);

  // Edit User Form state
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('Member');
  const [editAccountStatus, setEditAccountStatus] = useState<'Active' | 'Deactivated'>('Active');
  const [editSpecialization, setEditSpecialization] = useState('');
  const [editBio, setEditBio] = useState('');

  const [copiedUsername, setCopiedUsername] = useState<string | null>(null);

  // Auto-generate username as name changes if not manually edited
  const handleNameChange = (nameValue: string) => {
    setAddName(nameValue);
    if (!isCustomUsername) {
      const generated = dataStore.formatUsername(nameValue);
      setAddUsername(generated);
    }
  };

  const handleUsernameManualChange = (val: string) => {
    setIsCustomUsername(true);
    let formatted = val.trim().toLowerCase();
    if (formatted && !formatted.startsWith('#')) {
      formatted = '#' + formatted;
    }
    setAddUsername(formatted);
  };

  // Check if target user is the currently logged-in Admin or Root Admin
  const isSelfOrRootAdmin = (target: UserProfile) => {
    return Boolean((currentUser && target.id === currentUser.id) || target.id === 'user-admin-1');
  };

  // Filter profiles based on search and role
  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.username && p.username.toLowerCase().includes(q)) ||
      (p.specialization && p.specialization.toLowerCase().includes(q));
    
    if (selectedRoleFilter === 'All') return matchesSearch;
    if (selectedRoleFilter === 'Vice President') {
      return matchesSearch && (p.role === 'Vice President' || p.role === 'Core Member');
    }
    return matchesSearch && p.role === selectedRoleFilter;
  });

  const handleRoleChange = (target: UserProfile, newRole: UserRole) => {
    if (!isAdmin) {
      error('Only Admins can manage roles and permissions.');
      return;
    }

    if (isSelfOrRootAdmin(target) && newRole !== 'Admin') {
      error('The currently logged-in/root Admin cannot demote themselves.');
      return;
    }

    const res = dataStore.updateMemberRole(target.id, newRole, currentUser?.id);
    if (res.success) {
      if (newRole === 'Admin') {
        success(`Promoted "${target.name}" to Admin with full administrative permissions!`);
      } else {
        success(`Updated role for "${target.name}" to ${newRole}.`);
      }
      onRefresh();
    } else {
      error(res.error || 'Failed to update role.');
    }
  };

  const handlePromoteToAdmin = (target: UserProfile) => {
    if (!isAdmin) {
      error('Only Admins can promote members to Admin.');
      return;
    }
    handleRoleChange(target, 'Admin');
  };

  const handleToggleDeactivate = (target: UserProfile) => {
    if (!isAdmin) {
      error('Only Admins can deactivate or reactivate user accounts.');
      return;
    }

    if (isSelfOrRootAdmin(target)) {
      error('The currently logged-in/root Admin cannot deactivate themselves.');
      return;
    }

    const res = dataStore.toggleMemberActiveStatus(target.id, currentUser?.id);
    if (res.success) {
      if (res.accountStatus === 'Deactivated') {
        info(`Deactivated account for "${target.name}". Their access permissions have been revoked.`);
      } else {
        success(`Reactivated account for "${target.name}".`);
      }
      onRefresh();
    } else {
      error(res.error || 'Failed to change account status.');
    }
  };

  const handleDeleteUser = (target: UserProfile) => {
    if (!isAdmin) {
      error('Only Admins can remove users.');
      return;
    }

    if (isSelfOrRootAdmin(target)) {
      error('The currently logged-in/root Admin cannot remove themselves.');
      return;
    }

    if (confirm(`Are you sure you want to remove "${target.name}" (${target.role})?`)) {
      const res = dataStore.deleteMember(target.id, currentUser?.id);
      if (res.success) {
        success(`User "${target.name}" removed from roster.`);
        onRefresh();
      } else {
        error(res.error || 'Failed to delete user.');
      }
    }
  };

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      error('Only Admins can add new members and assign roles.');
      return;
    }
    setAddName('');
    setAddUsername('#member123');
    setAddEmail('');
    setAddRole('Member');
    setAddSpecialization('');
    setAddBio('');
    setIsCustomUsername(false);
    setIsAddUserOpen(true);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      error('Only Admins can manage roles and permissions.');
      return;
    }

    if (!addName.trim() || !addEmail.trim()) {
      error('Full Name and Institutional Email are required.');
      return;
    }

    // Ensure username is formatted properly #<name>123
    let cleanUsername = addUsername.trim().toLowerCase();
    if (!cleanUsername || cleanUsername === '#') {
      cleanUsername = dataStore.formatUsername(addName);
    } else {
      cleanUsername = dataStore.formatUsername(cleanUsername);
    }

    // Check uniqueness
    if (dataStore.isUsernameTaken(cleanUsername)) {
      error(`Username "${cleanUsername}" already exists! Please choose a unique username.`);
      return;
    }

    const res = dataStore.addMember({
      name: addName.trim(),
      email: addEmail.trim().toLowerCase(),
      username: cleanUsername,
      password: '123456',
      role: addRole,
      accountStatus: 'Active',
      specialization: addSpecialization.trim() || 'AI & Machine Learning Enthusiast',
      bio: addBio.trim() || `Active member of AI/ML Club at GEC Ajmer. Specializing in ${addSpecialization || 'AI'}.`,
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300`,
    });

    if (res.success) {
      success(`Account "${addName}" provisioned with role ${addRole}! Username: ${cleanUsername} | Password: 123456`);
      setIsAddUserOpen(false);
      onRefresh();
    } else {
      error(res.error || 'Failed to add member.');
    }
  };

  const handleOpenEditModal = (user: UserProfile) => {
    if (!isAdmin) {
      error('Only Admins can edit user roles and permissions.');
      return;
    }
    setEditingUser(user);
    setEditName(user.name);
    setEditUsername(user.username || dataStore.formatUsername(user.name));
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditAccountStatus(user.accountStatus || 'Active');
    setEditSpecialization(user.specialization || '');
    setEditBio(user.bio || '');
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !isAdmin) return;

    if (!editName.trim() || !editEmail.trim()) {
      error('Full Name and Institutional Email are required.');
      return;
    }

    if (isSelfOrRootAdmin(editingUser)) {
      if (editRole !== 'Admin') {
        error('The currently logged-in/root Admin cannot demote themselves.');
        return;
      }
      if (editAccountStatus === 'Deactivated') {
        error('The currently logged-in/root Admin cannot deactivate themselves.');
        return;
      }
    }

    const formattedUsername = dataStore.formatUsername(editUsername);
    if (dataStore.isUsernameTaken(formattedUsername, editingUser.id)) {
      error(`Username "${formattedUsername}" is already used by another member.`);
      return;
    }

    const res = dataStore.updateMember(
      editingUser.id,
      {
        name: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        username: formattedUsername,
        role: editRole,
        accountStatus: editAccountStatus,
        specialization: editSpecialization.trim(),
        bio: editBio.trim(),
      },
      currentUser?.id
    );

    if (res.success) {
      success(`Profile & permissions for "${editName}" (${editRole}) updated immediately.`);
      setEditingUser(null);
      onRefresh();
    } else {
      error(res.error || 'Failed to update member.');
    }
  };

  const copyUsernameToClipboard = (uname: string) => {
    navigator.clipboard.writeText(uname);
    setCopiedUsername(uname);
    info(`Copied ${uname} to clipboard`);
    setTimeout(() => setCopiedUsername(null), 2000);
  };

  const roleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Admin': return 'bg-purple-900/60 text-purple-300 border-purple-700';
      case 'Vice President':
      case 'Core Member': return 'bg-blue-900/60 text-blue-300 border-blue-700';
      case 'Member': return 'bg-emerald-900/60 text-emerald-300 border-emerald-700';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const totalAdmins = profiles.filter(p => p.role === 'Admin').length;
  const totalVicePresidents = profiles.filter(p => p.role === 'Vice President' || p.role === 'Core Member').length;
  const totalMembers = profiles.filter(p => p.role === 'Member').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800 text-purple-300 text-xs font-mono uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Role &amp; Permission Management
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            User &amp; Member Management
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Assign Visitor, Member, Vice President, or Admin roles, promote members to Admin, or deactivate/remove accounts.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition shadow-md shrink-0 self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Member</span>
          </button>
        )}
      </div>

      {/* Non-Admin Notice */}
      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Admin Permission Required:</strong> Only users with the <strong>Admin</strong> role can assign roles, promote members to Admin, or remove/deactivate users.
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-mono text-slate-400 uppercase">Total Roster</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{profiles.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-mono text-purple-400 uppercase">Admins</div>
          <div className="text-2xl font-bold text-purple-300 mt-1 font-mono">{totalAdmins}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-mono text-blue-400 uppercase">Vice President / Leads</div>
          <div className="text-2xl font-bold text-blue-300 mt-1 font-mono">{totalVicePresidents}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 uppercase">Members</div>
          <div className="text-2xl font-bold text-emerald-300 mt-1 font-mono">{totalMembers}</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, #username, email, domain..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Admin', 'Vice President', 'Member', 'Visitor'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                selectedRoleFilter === r
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assign Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-mono">
                    No matching members found.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((p) => {
                  const uname = p.username || `#${p.name.toLowerCase().replace(/[^a-z0-9]/g, '')}123`;
                  const isSelfOrRoot = isSelfOrRootAdmin(p);
                  const isDeactivated = p.accountStatus === 'Deactivated';

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-800/40 transition ${
                        isDeactivated ? 'opacity-60 bg-slate-950/40' : ''
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                            alt={p.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-white flex flex-wrap items-center gap-1.5">
                              <span>{p.name}</span>
                              {currentUser?.id === p.id && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-950/90 text-purple-300 border border-purple-700/80">
                                  You
                                </span>
                              )}
                              {p.id === 'user-admin-1' && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-950/80 text-amber-300 border border-amber-700/60">
                                  Root Admin
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {p.specialization || 'AI & Machine Learning'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Username Pill with Copy button */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/50 border border-purple-800/60 text-purple-300 font-mono text-xs">
                          <span className="font-semibold">{uname}</span>
                          <button
                            onClick={() => copyUsernameToClipboard(uname)}
                            className="p-1 hover:text-white transition rounded"
                            title="Copy username"
                          >
                            {copiedUsername === uname ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400 hover:text-purple-300" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-mono text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{p.email}</span>
                        </div>
                      </td>

                      {/* Account Status */}
                      <td className="py-3 px-4">
                        {isDeactivated ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-950/80 text-rose-300 border border-rose-700/60">
                            <UserX className="w-3 h-3 text-rose-400" />
                            <span>Deactivated</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                            <UserCheck className="w-3 h-3 text-emerald-400" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      {/* Role Selector */}
                      <td className="py-3 px-4">
                        <select
                          value={p.role}
                          disabled={!isAdmin || isSelfOrRoot}
                          onChange={(e) => handleRoleChange(p, e.target.value as UserRole)}
                          title={
                            isSelfOrRoot
                              ? 'Currently logged-in/root Admin cannot demote themselves'
                              : !isAdmin
                              ? 'Only Admins can change roles'
                              : 'Assign role (Visitor, Member, Vice President, or Admin)'
                          }
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${roleBadgeColor(p.role)} bg-slate-950 focus:outline-none focus:border-purple-400 ${
                            !isAdmin || isSelfOrRoot ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Vice President">Vice President</option>
                          {p.role === 'Core Member' && (
                            <option value="Core Member">Core Member</option>
                          )}
                          <option value="Member">Member</option>
                          <option value="Visitor">Visitor</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Promote to Admin button for non-Admin users */}
                          {isAdmin && p.role !== 'Admin' && (
                            <button
                              onClick={() => handlePromoteToAdmin(p)}
                              className="px-2 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-semibold transition flex items-center gap-1"
                              title={`Promote ${p.name} to Admin with full permissions`}
                            >
                              <ShieldCheck className="w-3 h-3 text-purple-400" />
                              <span className="hidden xl:inline">Make Admin</span>
                            </button>
                          )}

                          {/* Edit Details */}
                          {isAdmin && (
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 text-slate-400 hover:text-purple-300 hover:bg-slate-800 rounded-lg transition"
                              title="Edit Member Profile & Role"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Deactivate / Reactivate & Remove */}
                          {isSelfOrRoot ? (
                            <span
                              className="p-1.5 text-slate-600 cursor-not-allowed rounded-lg"
                              title="The currently logged-in/root Admin cannot remove, demote, or deactivate themselves"
                            >
                              <Lock className="w-4 h-4" />
                            </span>
                          ) : isAdmin ? (
                            <>
                              <button
                                onClick={() => handleToggleDeactivate(p)}
                                className={`p-1.5 rounded-lg transition ${
                                  isDeactivated
                                    ? 'text-emerald-400 hover:bg-emerald-950/60'
                                    : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                                }`}
                                title={
                                  isDeactivated
                                    ? `Reactivate ${p.name}`
                                    : `Deactivate ${p.name}`
                                }
                              >
                                {isDeactivated ? (
                                  <UserCheck className="w-4 h-4" />
                                ) : (
                                  <UserX className="w-4 h-4" />
                                )}
                              </button>

                              <button
                                onClick={() => handleDeleteUser(p)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                                title={`Remove ${p.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {isAddUserOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" />
                <span>Add Member to Roster</span>
              </h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Username (Format: #<name>123) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-400 font-mono">
                    Member Username * <span className="text-purple-400 text-[10px]">(#name123)</span>
                  </label>
                  {addUsername && dataStore.isUsernameTaken(dataStore.formatUsername(addUsername)) && (
                    <span className="text-[10px] text-red-400 font-mono">Already taken!</span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={addUsername}
                    onChange={(e) => handleUsernameManualChange(e.target.value)}
                    onBlur={() => setAddUsername(dataStore.formatUsername(addUsername))}
                    placeholder="#rahul123"
                    className={`w-full px-3 py-2 rounded-lg bg-slate-950 border text-white font-mono focus:outline-none ${
                      addUsername && dataStore.isUsernameTaken(dataStore.formatUsername(addUsername))
                        ? 'border-red-500/80 focus:border-red-500'
                        : 'border-slate-800 focus:border-purple-500'
                    }`}
                  />
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-1">
                  Unique member login handle. Auto-formats to <code className="text-purple-400 font-bold">#&lt;name&gt;123</code> (e.g. #rahul123).
                </p>
              </div>

              {/* Default Password Notice */}
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-semibold text-purple-200">Default Login Password: <span className="font-mono text-white bg-purple-900/60 px-1.5 py-0.5 rounded">123456</span></div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    The user will use their unique username (<span className="text-purple-300 font-mono">{addUsername || '#username123'}</span>) and password <span className="text-white font-mono font-bold">123456</span> to sign in.
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="rahul@ecajmer.ac.in"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              {/* Role Permission */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">Role Permission *</label>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Member">Member (Member Dashboard &amp; Projects)</option>
                  <option value="Vice President">Vice President (Executive Content &amp; Operations)</option>
                  <option value="Admin">Admin (Full Administrative &amp; Role Management)</option>
                  <option value="Visitor">Visitor (Public Read-Only)</option>
                </select>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">Specialization / Division</label>
                <input
                  type="text"
                  value={addSpecialization}
                  onChange={(e) => setAddSpecialization(e.target.value)}
                  placeholder="e.g. Computer Vision & Edge AI"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">Bio / Role Description</label>
                <textarea
                  rows={2}
                  value={addBio}
                  onChange={(e) => setAddBio(e.target.value)}
                  placeholder="Brief summary of member research interests..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-md flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingUser && isAdmin && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" />
                <span>Edit Member &amp; Permissions</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Username */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-400 font-mono">
                    Member Username * <span className="text-purple-400 text-[10px]">(#name123)</span>
                  </label>
                  {editUsername && dataStore.isUsernameTaken(dataStore.formatUsername(editUsername), editingUser.id) && (
                    <span className="text-[10px] text-red-400 font-mono">Already taken!</span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  onBlur={() => setEditUsername(dataStore.formatUsername(editUsername))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              {/* Role Permission & Account Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Role Permission *</label>
                  <select
                    value={editRole}
                    disabled={isSelfOrRootAdmin(editingUser)}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500 disabled:opacity-60"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Vice President">Vice President</option>
                    {editingUser.role === 'Core Member' && (
                      <option value="Core Member">Core Member</option>
                    )}
                    <option value="Member">Member</option>
                    <option value="Visitor">Visitor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Account Status *</label>
                  <select
                    value={editAccountStatus}
                    disabled={isSelfOrRootAdmin(editingUser)}
                    onChange={(e) => setEditAccountStatus(e.target.value as 'Active' | 'Deactivated')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500 disabled:opacity-60"
                  >
                    <option value="Active">Active</option>
                    <option value="Deactivated">Deactivated</option>
                  </select>
                </div>
              </div>

              {isSelfOrRootAdmin(editingUser) && (
                <div className="text-[10px] font-mono text-amber-300 bg-amber-950/40 border border-amber-700/40 rounded-lg px-3 py-1.5">
                  The currently logged-in/root Admin cannot demote or deactivate themselves.
                </div>
              )}

              {/* Specialization */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">Specialization / Division</label>
                <input
                  type="text"
                  value={editSpecialization}
                  onChange={(e) => setEditSpecialization(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">Bio / Role Description</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
