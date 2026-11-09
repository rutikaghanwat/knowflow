import React, { useState } from 'react';
import { Plus, Users, Mail, Building, ArrowRightLeft, UserCheck, Shield } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SearchInput } from '../components/ui/SearchInput';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { mockTeamMembers, mockProjects } from '../data/mockData';
import { TeamMember, HandoverRole } from '../types';
import { formatDate } from '../utils';

export const TeamMembersPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const [invitations, setInvitations] = useState([
    {
      id: 'inv-1',
      name: 'Rutika Ghanwat',
      email: 'rutika.ghanwat@knowflow.io',
      role: 'Departing Member',
      project: 'Core Payments & Ledger Migration',
      status: 'Accepted',
      sentAt: '3 days ago',
      token: 'inv-rutika',
    },
    {
      id: 'inv-2',
      name: 'Marcus Vance',
      email: 'marcus.vance@knowflow.io',
      role: 'Incoming Member',
      project: 'Core Payments & Ledger Migration',
      status: 'Accepted',
      sentAt: '2 days ago',
      token: 'inv-marcus',
    },
    {
      id: 'inv-3',
      name: 'Elena Rostova',
      email: 'elena.rostova@knowflow.io',
      role: 'QA Engineer',
      project: 'Distributed Event Streaming v2',
      status: 'Pending',
      sentAt: 'Yesterday',
      token: 'inv-elena',
    },
    {
      id: 'inv-4',
      name: 'David Miller',
      email: 'david.miller@knowflow.io',
      role: 'DevOps Engineer',
      project: 'Internal Tooling & Automation',
      status: 'Expired',
      sentAt: '12 days ago',
      token: 'inv-david',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Backend Developer' as HandoverRole,
    department: 'Engineering',
    project: mockProjects[0].name,
    responsibilities: 'API Development, Database Schema, Unit Tests',
    permissions: ['Repo:Read', 'Docs:ReadWrite'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Valid work email is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      department: formData.department.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      projects: [formData.project],
      responsibilities: formData.responsibilities.split(',').map(r => r.trim()).filter(Boolean),
      accessPermissions: formData.permissions,
      status: 'active',
      handoversCount: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    };

    setMembers([...members, newMember]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      role: 'Backend Developer',
      department: 'Engineering',
      project: mockProjects[0].name,
      responsibilities: 'API Development, Database Schema, Unit Tests',
      permissions: ['Repo:Read', 'Docs:ReadWrite'],
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Directory"
        description="Manage organization contributors, departing engineers, and ownership transition roles."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Invite Member
            </Button>
          </div>
        }
      />

      {/* Primary Tab Navigation: Team Members vs Invitations */}
      <div className="flex items-center gap-2 border-b border-[#E5EAE6] pb-1">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 ${
            activeTab === 'members'
              ? 'border-[#218653] text-[#142640] bg-white'
              : 'border-transparent text-[#687570] hover:text-[#142640]'
          }`}
        >
          Active Team Members ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('invitations')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'invitations'
              ? 'border-[#218653] text-[#142640] bg-white'
              : 'border-transparent text-[#687570] hover:text-[#142640]'
          }`}
        >
          <span>Invitations & Onboarding</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#EBF7F0] text-[#218653] text-[10px]">
            {invitations.length}
          </span>
        </button>
      </div>

      {activeTab === 'invitations' ? (
        <div className="bg-white rounded-3xl border border-[#E5EAE6] shadow-resting overflow-hidden">
          <div className="p-5 border-b border-[#E5EAE6] bg-[#F5F7F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#142640] font-heading">
                Handover Invitation Tracker
              </h3>
              <p className="text-xs text-[#687570] mt-0.5">
                Employees join via secure single-use invitation tokens created by project managers.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              + Create Invitation
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7F6] border-b border-[#E5EAE6] text-[#687570] uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Invited Contributor</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Sent</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE6]">
                {invitations.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#142640]">{inv.name}</div>
                      <div className="text-[11px] text-[#687570]">{inv.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#2F6B5D]">
                      {inv.role}
                    </td>
                    <td className="py-3.5 px-4 text-[#142640]">
                      {inv.project}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          inv.status === 'Accepted'
                            ? 'text-[#218653] bg-[#EBF7F0] border-[#C3E7D3]'
                            : inv.status === 'Pending'
                            ? 'text-[#B7791F] bg-[#FEF7EB] border-[#F6DEB5]'
                            : 'text-[#B54747] bg-[#FDF2F2] border-[#F8C8C8]'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#8E9B96]">{inv.sentAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${window.location.origin}/invite/${inv.token}`
                                );
                                alert(`Copied invite link: ${window.location.origin}/invite/${inv.token}`);
                              }}
                              className="text-[11px] font-bold text-[#218653] hover:underline"
                            >
                              Copy Link
                            </button>
                            <button
                              onClick={() => alert(`Resent invitation email to ${inv.email}`)}
                              className="text-[11px] font-semibold text-[#687570] hover:text-[#142640]"
                            >
                              Resend
                            </button>
                            <button
                              onClick={() => {
                                setInvitations(prev => prev.filter(i => i.id !== inv.id));
                              }}
                              className="text-[11px] font-semibold text-[#B54747] hover:underline"
                            >
                              Revoke
                            </button>
                          </>
                        )}
                        {inv.status === 'Accepted' && (
                          <span className="text-[11px] text-[#218653] font-semibold">Active Member</span>
                        )}
                        {inv.status === 'Expired' && (
                          <button
                            onClick={() => {
                              setInvitations(prev =>
                                prev.map(i => (i.id === inv.id ? { ...i, status: 'Pending', sentAt: 'Just now' } : i))
                              );
                              alert(`Renewed invitation for ${inv.email}`);
                            }}
                            className="text-[11px] font-bold text-[#218653] hover:underline"
                          >
                            Renew Invite
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Filter and Search Bar (Active for members tab) */}
      {activeTab === 'members' && (
        <>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-card border border-[#E5EAE6] shadow-subtle">
        <SearchInput
          placeholder="Search by name, email, department or role..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          className="sm:w-80"
        />

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'active', 'departing', 'onboarding'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-control text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#183B35] text-white'
                  : 'bg-[#F7F8F6] text-[#687570] hover:text-[#202B28] hover:bg-[#E8F2ED]'
              }`}
            >
              {st === 'all'
                ? 'All Contributors'
                : st === 'departing'
                ? 'Departing (Handovers Active)'
                : st.replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No team members found"
          description="Adjust your search criteria or add new members to your organization."
          actionLabel="Add Member"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map(member => (
            <Card
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="p-5 flex flex-col justify-between hover:border-[#2F6B5D] cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#D0E3D9]"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[#183B35] font-heading">{member.name}</h3>
                      <p className="text-xs text-[#2F6B5D] font-medium">{member.role}</p>
                      <p className="text-[11px] text-[#8E9B96] flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3" />
                        {member.department}
                      </p>
                    </div>
                  </div>

                  <Badge
                    status={member.status === 'departing' ? 'in_review' : member.status}
                    className="shrink-0"
                  >
                    {member.status === 'departing' ? 'Departing' : member.status}
                  </Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5EAE6] space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#687570]">
                    <Mail className="w-3.5 h-3.5 text-[#8E9B96] shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#8E9B96] tracking-wider block">
                      Assigned Projects
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.projects.map((proj, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[11px] rounded bg-[#E8F2ED] text-[#183B35] border border-[#D0E3D9]"
                        >
                          {proj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#E5EAE6] flex items-center justify-between text-xs text-[#8E9B96]">
                <span>Joined {formatDate(member.joinedAt)}</span>
                <span className="font-medium text-[#183B35]">
                  {member.handoversCount} Handover{member.handoversCount !== 1 ? 's' : ''}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
      </>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Contributor"
        subtitle="Invite a team member to participate in knowledge handovers."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddMember}>
              Send Invite
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Full Name <span className="text-[#B54747]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 text-sm bg-white border rounded-control ${
                errors.name ? 'border-[#B54747]' : 'border-[#E5EAE6]'
              }`}
            />
            {errors.name && <p className="text-[11px] text-[#B54747] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Work Email <span className="text-[#B54747]">*</span>
            </label>
            <input
              type="email"
              placeholder="alex.m@organization.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 py-2 text-sm bg-white border rounded-control ${
                errors.email ? 'border-[#B54747]' : 'border-[#E5EAE6]'
              }`}
            />
            {errors.email && <p className="text-[11px] text-[#B54747] mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Assigned Role (Predefined System Role) <span className="text-[#B54747]">*</span>
              </label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as HandoverRole })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control font-semibold text-[#183B35]"
              >
                <option value="Project Manager">Project Manager (Platform Administrator)</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="QA Engineer">QA Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">Department</label>
              <input
                type="text"
                placeholder="Core Platform"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Key Responsibilities (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Ledger Engine, Webhook Mutex, On-Call Escalation"
              value={formData.responsibilities}
              onChange={e => setFormData({ ...formData, responsibilities: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">Primary Project</label>
            <select
              value={formData.project}
              onChange={e => setFormData({ ...formData, project: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
            >
              {mockProjects.map(p => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      {/* Member Details Modal */}
      <Modal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name || 'Member Details'}
        subtitle={`${selectedMember?.role} • ${selectedMember?.department}`}
        footer={
          <Button variant="outline" size="sm" onClick={() => setSelectedMember(null)}>
            Close
          </Button>
        }
      >
        {selectedMember && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-[#E5EAE6]">
              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                className="w-16 h-16 rounded-full object-cover border border-[#D0E3D9]"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#183B35]">{selectedMember.name}</h3>
                  <Badge status={selectedMember.status} />
                </div>
                <p className="text-xs text-[#687570]">{selectedMember.email}</p>
                <p className="text-[11px] text-[#8E9B96]">
                  Member since {formatDate(selectedMember.joinedAt)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#183B35] uppercase tracking-wider mb-2">
                Assigned Projects ({selectedMember.projects.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedMember.projects.map((proj, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-medium rounded-control bg-[#E8F2ED] text-[#183B35] border border-[#D0E3D9]"
                  >
                    {proj}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-[#F7F8F6] rounded-card border border-[#E5EAE6] space-y-1.5">
              <span className="text-xs font-bold text-[#183B35] block">
                Handover Responsibilities
              </span>
              <p className="text-xs text-[#687570] leading-relaxed">
                {selectedMember.status === 'departing'
                  ? `${selectedMember.name} has ${selectedMember.handoversCount} active handover reports currently in review before offboarding completion.`
                  : `${selectedMember.name} is an active contributor on ${selectedMember.projects.length} repositories with verified commit histories.`}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
