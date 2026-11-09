import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FolderGit2,
  Users,
  Database,
  ArrowRightLeft,
  Calendar,
  ExternalLink,
  LayoutGrid,
  List,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SearchInput } from '../components/ui/SearchInput';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { mockProjects, mockTeamMembers } from '../data/mockData';
import { Project } from '../types';
import { formatTimeAgo } from '../utils';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State for Create Project
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    objectives: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedCompletionDate: '2026-12-31',
    status: 'active' as 'active' | 'in_progress' | 'on_hold',
    owner: mockTeamMembers[0].name,
    repoUrl: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Project name is required';
    if (!formData.code.trim()) errors.code = 'Project key / code is required';
    if (!formData.description.trim()) errors.description = 'Description is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim(),
      objectives: formData.objectives.trim(),
      startDate: formData.startDate,
      expectedCompletionDate: formData.expectedCompletionDate,
      status: formData.status,
      owner: formData.owner,
      ownerAvatar: mockTeamMembers.find(m => m.name === formData.owner)?.avatar,
      membersCount: 1,
      sourcesCount: 0,
      handoversCount: 0,
      lastUpdated: new Date().toISOString(),
      repoUrl: formData.repoUrl.trim() || undefined,
    };

    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      code: '',
      description: '',
      objectives: '',
      startDate: new Date().toISOString().split('T')[0],
      expectedCompletionDate: '2026-12-31',
      status: 'active',
      owner: mockTeamMembers[0].name,
      repoUrl: '',
    });
    setFormErrors({});
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Monitor software repositories, operational systems, and transition readiness across your team."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Create Project
          </Button>
        }
      />

      {/* Filter and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-card border border-[#E5EAE6] shadow-subtle">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <SearchInput
            placeholder="Search by project name, code or scope..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            className="sm:w-80"
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'active', 'in_progress', 'on_hold'].map(st => (
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
                  ? 'All Statuses'
                  : st === 'in_progress'
                  ? 'In Progress'
                  : st === 'on_hold'
                  ? 'On Hold'
                  : 'Active'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E5EAE6]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-control transition-colors ${
              viewMode === 'grid'
                ? 'bg-[#E8F2ED] text-[#183B35]'
                : 'text-[#687570] hover:bg-[#F7F8F6]'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-control transition-colors ${
              viewMode === 'table'
                ? 'bg-[#E8F2ED] text-[#183B35]'
                : 'text-[#687570] hover:bg-[#F7F8F6]'
            }`}
            aria-label="Table view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Project Content */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="w-6 h-6" />}
          title="No projects match your filter"
          description="Try adjusting your search criteria or create a new project to start tracking handovers."
          actionLabel="Create Project"
          onAction={() => setIsModalOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(project => (
            <Card
              key={project.id}
              onClick={() => navigate(`/app/projects/${project.id}`)}
              className="p-5 flex flex-col justify-between hover:border-[#2F6B5D] cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#2F6B5D] bg-[#E8F2ED] px-2.5 py-0.5 rounded border border-[#D0E3D9]">
                    {project.code}
                  </span>
                  <Badge status={project.status} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#183B35] font-heading leading-snug">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#687570] mt-1.5 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {project.repoUrl && (
                  <div className="flex items-center gap-1.5 text-xs text-[#2F6B5D] font-mono truncate">
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{project.repoUrl}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5EAE6] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#687570]">
                  <div className="flex items-center gap-2">
                    {project.ownerAvatar ? (
                      <img
                        src={project.ownerAvatar}
                        alt={project.owner}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-[#E8F2ED] text-[#183B35] text-[10px] flex items-center justify-center font-bold">
                        {project.owner.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium text-[#202B28]">{project.owner}</span>
                  </div>
                  <span className="text-[11px] flex items-center gap-1 text-[#8E9B96]">
                    <Calendar className="w-3 h-3" />
                    {formatTimeAgo(project.lastUpdated)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs bg-[#F7F8F6] p-2 rounded-control">
                  <div>
                    <span className="block font-bold text-[#183B35]">{project.membersCount}</span>
                    <span className="text-[10px] text-[#687570]">Members</span>
                  </div>
                  <div className="border-x border-[#E5EAE6]">
                    <span className="block font-bold text-[#183B35]">{project.sourcesCount}</span>
                    <span className="text-[10px] text-[#687570]">Sources</span>
                  </div>
                  <div>
                    <span className="block font-bold text-[#183B35]">{project.handoversCount}</span>
                    <span className="text-[10px] text-[#687570]">Handovers</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-card border border-[#E5EAE6] overflow-x-auto shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F6] border-b border-[#E5EAE6] text-[#687570] uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4 text-center">Members</th>
                <th className="py-3.5 px-4 text-center">Sources</th>
                <th className="py-3.5 px-4 text-center">Handovers</th>
                <th className="py-3.5 px-4 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE6]">
              {filteredProjects.map(project => (
                <tr
                  key={project.id}
                  onClick={() => navigate(`/app/projects/${project.id}`)}
                  className="hover:bg-[#F7F8F6] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-[#183B35] font-heading">{project.name}</div>
                    <span className="font-mono text-[11px] text-[#2F6B5D]">{project.code}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge status={project.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#202B28]">{project.owner}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-[#183B35]">{project.membersCount}</td>
                  <td className="py-3.5 px-4 text-center font-medium text-[#183B35]">{project.sourcesCount}</td>
                  <td className="py-3.5 px-4 text-center font-medium text-[#183B35]">{project.handoversCount}</td>
                  <td className="py-3.5 px-4 text-right text-[#687570]">{formatTimeAgo(project.lastUpdated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        subtitle="Set up a monitored repository for automated knowledge extraction."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateProject}>
              Create Project
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Project Name <span className="text-[#B54747]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Core Payments Service"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 text-sm bg-white border rounded-control focus:ring-1 focus:ring-[#2F6B5D] ${
                formErrors.name ? 'border-[#B54747]' : 'border-[#E5EAE6]'
              }`}
            />
            {formErrors.name && (
              <p className="text-[11px] text-[#B54747] mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Project Code <span className="text-[#B54747]">*</span>
            </label>
            <input
              type="text"
              placeholder="PROJ-PAY"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className={`w-full px-3 py-2 text-sm bg-white border rounded-control font-mono uppercase ${
                formErrors.code ? 'border-[#B54747]' : 'border-[#E5EAE6]'
              }`}
            />
            {formErrors.code && (
              <p className="text-[11px] text-[#B54747] mt-1">{formErrors.code}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Project Lead / Manager
              </label>
              <select
                value={formData.owner}
                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control focus:ring-1 focus:ring-[#2F6B5D]"
              >
                {mockTeamMembers.map(m => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Project Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
              >
                <option value="active">Active</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Expected Completion Date
              </label>
              <input
                type="date"
                value={formData.expectedCompletionDate}
                onChange={e => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Project Objectives
            </label>
            <input
              type="text"
              placeholder="e.g. Decouple ledger, eliminate duplicate billing, 99.999% SLA"
              value={formData.objectives}
              onChange={e => setFormData({ ...formData, objectives: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Description <span className="text-[#B54747]">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Primary responsibilities, architectural scope, and service boundaries..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 text-sm bg-white border rounded-control focus:ring-1 focus:ring-[#2F6B5D] ${
                formErrors.description ? 'border-[#B54747]' : 'border-[#E5EAE6]'
              }`}
            />
            {formErrors.description && (
              <p className="text-[11px] text-[#B54747] mt-1">{formErrors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Connected GitHub Repository (Optional)
            </label>
            <input
              type="text"
              placeholder="github.com/organization/repo-name"
              value={formData.repoUrl}
              onChange={e => setFormData({ ...formData, repoUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control font-mono"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
