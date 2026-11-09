import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRightLeft,
  Plus,
  Calendar,
  FileCheck2,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SearchInput } from '../components/ui/SearchInput';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { mockHandovers, mockProjects, mockTeamMembers, defaultHandoverSteps } from '../data/mockData';
import { Handover, HandoverRole } from '../types';
import { formatDate, formatTimeAgo } from '../utils';

export const HandoversPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [handovers, setHandovers] = useState<Handover[]>(mockHandovers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedHandover, setSelectedHandover] = useState<Handover | null>(mockHandovers[0]);
  const [activeStepTab, setActiveStepTab] = useState<number>(7);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    project: mockProjects[0].name,
    targetRole: 'Backend Developer' as HandoverRole,
    departingMember: mockTeamMembers[1].name,
    incomingMember: mockTeamMembers[2].name,
    reviewer: mockTeamMembers[0].name,
    targetDate: '2026-11-30',
    summary: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setIsModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filteredHandovers = handovers.filter(h => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.departingMember.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.incomingMember.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateHandover = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Handover title is required';
    if (!formData.summary.trim()) newErrors.summary = 'Scope summary is required';
    if (formData.departingMember === formData.incomingMember) {
      newErrors.incomingMember = 'Departing and incoming engineers cannot be the same person';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const departing = mockTeamMembers.find(m => m.name === formData.departingMember) || mockTeamMembers[1];
    const incoming = mockTeamMembers.find(m => m.name === formData.incomingMember) || mockTeamMembers[2];
    const reviewer = mockTeamMembers.find(m => m.name === formData.reviewer) || mockTeamMembers[0];
    const project = mockProjects.find(p => p.name === formData.project) || mockProjects[0];

    const newHandover: Handover = {
      id: `ho-${Date.now()}`,
      title: formData.title.trim(),
      projectId: project.id,
      projectName: project.name,
      targetRole: formData.targetRole,
      departingMemberId: departing.id,
      departingMember: departing,
      incomingMemberId: incoming.id,
      incomingMember: incoming,
      reviewerId: reviewer.id,
      reviewer: reviewer,
      status: 'draft',
      currentStep: 1,
      progressPercentage: 10,
      createdAt: new Date().toISOString(),
      targetDate: formData.targetDate,
      sourcesIncluded: project.sourcesCount || 2,
      factsExtracted: 12,
      summary: formData.summary.trim(),
      reportId: 'rep-01',
      steps: defaultHandoverSteps.map(s => ({
        ...s,
        status: s.stepNumber === 1 ? 'in_progress' : 'pending',
      })),
      transferAcknowledged: false,
    };

    setHandovers([newHandover, ...handovers]);
    setSelectedHandover(newHandover);
    setIsModalOpen(false);
    setFormData({
      title: '',
      project: mockProjects[0].name,
      targetRole: 'Backend Developer',
      departingMember: mockTeamMembers[1].name,
      incomingMember: mockTeamMembers[2].name,
      reviewer: mockTeamMembers[0].name,
      targetDate: '2026-11-30',
      summary: '',
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Handover Pipeline"
        description="The 10-Step Handover Workflow — Guided, role-specific transition management from source ingestion to digital recipient acknowledgment."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Initiate Handover
          </Button>
        }
      />

      {/* 10-Step Handover Workflow Master Tracker */}
      {selectedHandover && (
        <Card className="p-6 bg-white border-[#E5EAE6] shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAE6]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#2F6B5D] bg-[#E8F2ED] px-2.5 py-0.5 rounded border border-[#D0E3D9]">
                  {selectedHandover.projectName}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F0F4F2] text-[#183B35]">
                  Role: {selectedHandover.targetRole}
                </span>
                <Badge status={selectedHandover.status} />
              </div>
              <h2 className="text-lg font-bold text-[#183B35] font-heading mt-1">
                {selectedHandover.title}
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/app/reports?id=${selectedHandover.reportId || 'rep-01'}`)}
              >
                Inspect Report
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/app/approvals')}
              >
                Manager Sign-Off
              </Button>
            </div>
          </div>

          {/* 10-Step Horizontal Stepper */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#687570]">
              <span className="font-semibold text-[#183B35]">
                10-Step Handover Progress: Step {selectedHandover.currentStep} of 10
              </span>
              <span>{selectedHandover.progressPercentage}% Completed</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 pt-1">
              {defaultHandoverSteps.map(step => {
                const isCurrent = selectedHandover.currentStep === step.stepNumber;
                const isPassed = selectedHandover.currentStep > step.stepNumber;
                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => setActiveStepTab(step.stepNumber)}
                    className={`p-2 rounded-control text-left border transition-all text-xs flex flex-col justify-between h-20 ${
                      isCurrent
                        ? 'border-[#183B35] bg-[#E8F2ED] ring-1 ring-[#183B35]'
                        : isPassed
                        ? 'border-[#C3E7D3] bg-[#EBF7F0]/60'
                        : 'border-[#E5EAE6] bg-[#F7F8F6]/80 text-[#8E9B96]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[10px]">0{step.stepNumber}</span>
                      {isPassed ? (
                        <CheckCircle2 className="w-3 h-3 text-[#26734D]" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-[#183B35] animate-pulse" />
                      ) : null}
                    </div>
                    <span className="text-[10px] font-semibold text-[#183B35] line-clamp-2 leading-tight">
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Context Box */}
          {activeStepTab && (
            <div className="p-4 bg-[#F7F8F6] rounded-card border border-[#E5EAE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F6B5D] block">
                  Step 0{activeStepTab}: {defaultHandoverSteps[activeStepTab - 1].title}
                </span>
                <p className="text-[#202B28] leading-relaxed">
                  {defaultHandoverSteps[activeStepTab - 1].description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeStepTab <= 3 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/app/sources')}
                  >
                    Inspect Sources
                  </Button>
                ) : activeStepTab === 4 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/app/project-state')}
                  >
                    View Project State
                  </Button>
                ) : activeStepTab === 5 || activeStepTab === 6 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/app/evidence')}
                  >
                    Audit Evidence
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/app/reports?id=${selectedHandover.reportId || 'rep-01'}`)}
                  >
                    Open Handover Report
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-card border border-[#E5EAE6] shadow-subtle">
        <SearchInput
          placeholder="Search by title, project, or contributor..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          className="sm:w-80"
        />

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'in_review', 'approved', 'draft'].map(st => (
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
                ? 'All Handovers'
                : st === 'in_review'
                ? 'In Review'
                : st.replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Handovers List */}
      <div className="space-y-4">
        {filteredHandovers.map(ho => {
          const isSelected = selectedHandover?.id === ho.id;
          return (
            <Card
              key={ho.id}
              className={`p-5 sm:p-6 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                isSelected ? 'border-[#183B35] ring-1 ring-[#183B35]' : 'hover:border-[#2F6B5D]'
              }`}
              onClick={() => {
                setSelectedHandover(ho);
                setActiveStepTab(ho.currentStep);
              }}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold text-[#2F6B5D] bg-[#E8F2ED] px-2.5 py-0.5 rounded-full border border-[#D0E3D9]">
                    {ho.projectName}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F0F4F2] text-[#183B35]">
                    Target: {ho.targetRole}
                  </span>
                  <Badge status={ho.status} />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#183B35] font-heading hover:text-[#2F6B5D] transition-colors">
                  {ho.title}
                </h3>

                <p className="text-xs text-[#687570] line-clamp-2 max-w-2xl leading-relaxed">
                  {ho.summary}
                </p>

                <div className="flex items-center gap-4 text-xs text-[#687570] pt-2 flex-wrap">
                  <span>
                    Departing: <strong className="text-[#202B28]">{ho.departingMember.name}</strong>
                  </span>
                  <span className="text-[#8E9B96]">&rarr;</span>
                  <span>
                    Incoming: <strong className="text-[#202B28]">{ho.incomingMember.name}</strong>
                  </span>
                  <span className="text-[#8E9B96]">&bull;</span>
                  <span>
                    Reviewer: <strong className="text-[#202B28]">{ho.reviewer.name}</strong>
                  </span>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-0 border-[#E5EAE6]">
                <div className="text-right">
                  <div className="text-xs font-semibold text-[#183B35]">
                    Step {ho.currentStep}/10 &bull; {ho.progressPercentage}%
                  </div>
                  <div className="w-32 bg-[#E5EAE6] h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-[#26734D] h-full rounded-full transition-all"
                      style={{ width: `${ho.progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#8E9B96] mt-1 block">
                    Target: {formatDate(ho.targetDate)}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/app/reports?id=${ho.reportId || 'rep-01'}`);
                  }}
                >
                  View Report
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Initiate Handover Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Initiate Project Handover"
        subtitle="Step 01 — Project Manager configures transition scope and role requirements."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateHandover}>
              Start 10-Step Workflow
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateHandover} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Handover Title <span className="text-[#B54747]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Lead Architect Handover: Payments Platform"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 text-sm bg-white border rounded-control ${
                errors.title ? 'border-[#B54747]' : 'border-[#E5EAE6]'
              }`}
            />
            {errors.title && <p className="text-[11px] text-[#B54747] mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Associated Project
              </label>
              <select
                value={formData.project}
                onChange={e => setFormData({ ...formData, project: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
              >
                {mockProjects.map(p => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Target Role for Report Filtering <span className="text-[#B54747]">*</span>
              </label>
              <select
                value={formData.targetRole}
                onChange={e => setFormData({ ...formData, targetRole: e.target.value as HandoverRole })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control font-semibold"
              >
                <option value="Backend Developer">Backend Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="QA Engineer">QA Engineer</option>
                <option value="Project Manager">Project Manager</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Departing Engineer <span className="text-[#B54747]">*</span>
              </label>
              <select
                value={formData.departingMember}
                onChange={e => setFormData({ ...formData, departingMember: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
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
                Incoming Owner <span className="text-[#B54747]">*</span>
              </label>
              <select
                value={formData.incomingMember}
                onChange={e => setFormData({ ...formData, incomingMember: e.target.value })}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-control ${
                  errors.incomingMember ? 'border-[#B54747]' : 'border-[#E5EAE6]'
                }`}
              >
                {mockTeamMembers.map(m => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
              {errors.incomingMember && (
                <p className="text-[11px] text-[#B54747] mt-1">{errors.incomingMember}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Approving Manager
              </label>
              <select
                value={formData.reviewer}
                onChange={e => setFormData({ ...formData, reviewer: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
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
                Target Sign-Off Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Transition Scope Summary <span className="text-[#B54747]">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Outline primary systems, critical repositories, and dependencies included..."
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              className={`w-full px-3 py-2 text-sm bg-white border rounded-control ${
                errors.summary ? 'border-[#B54747]' : 'border-[#E5EAE6]'
              }`}
            />
            {errors.summary && <p className="text-[11px] text-[#B54747] mt-1">{errors.summary}</p>}
          </div>

          {/* Manager Authorization Toggles per Section H */}
          <div className="pt-2 border-t border-[#E5EAE6] space-y-2.5 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E9B96] block">
              Authorization & Permissions
            </span>
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] cursor-pointer">
              <span className="font-semibold text-[#142640]">
                Allow {formData.departingMember} to upload sources (PDF/DOCX)
              </span>
              <input type="checkbox" defaultChecked className="rounded text-[#218653] focus:ring-[#218653]" />
            </label>
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] cursor-pointer">
              <span className="font-semibold text-[#142640]">
                Authorise GitHub repository ingestion sync
              </span>
              <input type="checkbox" defaultChecked className="rounded text-[#218653] focus:ring-[#218653]" />
            </label>
            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#218653] focus:ring-[#218653]" />
              <span className="text-[#687570]">
                Notify {formData.departingMember} and {formData.incomingMember} via automated email
              </span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
};
