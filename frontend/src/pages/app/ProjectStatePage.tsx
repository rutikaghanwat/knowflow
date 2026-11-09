import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Clock,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  FileText,
  UserCheck,
  Check,
  MessageSquare,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { mockProjectStateItems, mockInformationConflicts, mockProjects } from '../../data/mockData';
import { ProjectStateItem, InformationConflict } from '../../types';

export const ProjectStatePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'work_status' | 'decisions' | 'responsibilities' | 'dependencies' | 'conflicts'>('all');
  const [conflicts, setConflicts] = useState<InformationConflict[]>(mockInformationConflicts);
  const [stateItems, setStateItems] = useState<ProjectStateItem[]>(mockProjectStateItems);
  const [selectedConflict, setSelectedConflict] = useState<InformationConflict | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const tabs = [
    { id: 'all', label: 'Consolidated Overview' },
    { id: 'work_status', label: 'Work Status' },
    { id: 'decisions', label: 'Decision History' },
    { id: 'responsibilities', label: 'Responsibility Mapping' },
    { id: 'dependencies', label: 'Dependencies' },
    { id: 'conflicts', label: `Information Conflicts (${conflicts.filter(c => c.status === 'unresolved').length})` },
  ];

  const handleResolveConflict = (conflict: InformationConflict) => {
    setSelectedConflict(conflict);
    setResolutionNote(conflict.managerResolution || '');
  };

  const handleConfirmResolution = () => {
    if (!selectedConflict) return;
    setConflicts(prev =>
      prev.map(c =>
        c.id === selectedConflict.id
          ? { ...c, status: 'resolved', managerResolution: resolutionNote || 'Resolved by Project Manager' }
          : c
      )
    );
    setSelectedConflict(null);
    setToastMessage(`Conflict "${selectedConflict.title}" recorded as resolved with managerial justification.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredItems = stateItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'work_status') return item.category === 'work_status';
    if (activeTab === 'decisions') return item.category === 'decision';
    if (activeTab === 'responsibilities') return item.category === 'responsibility';
    if (activeTab === 'dependencies') return item.category === 'dependency' || item.category === 'knowledge_gap';
    return false;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project-State Reconstruction"
        description="Module 04 — Synthesizes tasks, technical decisions, component ownership, and dependency graphs into an authoritative operational baseline while highlighting information contradictions."
      />

      {toastMessage && (
        <div className="p-3.5 bg-[#EBF7F0] border border-[#C3E7D3] rounded-card text-xs text-[#26734D] font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Critical Information Conflicts Callout */}
      {conflicts.some(c => c.status === 'unresolved') && (
        <div className="p-5 rounded-card-lg bg-[#FEF7EB] border border-[#F6DEB5] space-y-3 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-control bg-[#FBEED7] text-[#B7791F]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#183B35]">
                  Active Information Conflicts Detected ({conflicts.filter(c => c.status === 'unresolved').length})
                </h3>
                <p className="text-xs text-[#687570]">
                  The system detected contradictory technical documentation that must not be silently resolved.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveTab('conflicts')}
            >
              Inspect Conflicts
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#E5EAE6] pb-px overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-control border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#183B35] text-[#183B35] bg-white'
                : 'border-transparent text-[#687570] hover:text-[#202B28] hover:bg-[#F7F8F6]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on tab */}
      {activeTab === 'conflicts' ? (
        <div className="space-y-4">
          {conflicts.map(conflict => (
            <Card key={conflict.id} className="p-5 sm:p-6 space-y-4 border-[#F6DEB5]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B7791F] bg-[#FEF7EB] px-2 py-0.5 rounded border border-[#F6DEB5]">
                      {conflict.category}
                    </span>
                    <Badge status={conflict.status === 'resolved' ? 'approved' : 'rejected'}>
                      {conflict.status === 'resolved' ? 'Resolved by Manager' : 'Contradiction Pending'}
                    </Badge>
                  </div>
                  <h4 className="text-base font-bold text-[#183B35] font-heading">{conflict.title}</h4>
                </div>

                {conflict.status === 'unresolved' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleResolveConflict(conflict)}
                  >
                    Resolve Conflict
                  </Button>
                ) : (
                  <span className="text-xs font-semibold text-[#26734D] flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Resolved
                  </span>
                )}
              </div>

              {/* Side-by-Side Contradictory Records */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#FDF2F2] rounded-card border border-[#F8C8C8] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B54747] block">
                    Record A &bull; {conflict.recordA.source}
                  </span>
                  <p className="font-semibold text-[#202B28]">{conflict.recordA.claim}</p>
                  <span className="text-[10px] text-[#8E9B96] block">Dated: {conflict.recordA.date}</span>
                </div>

                <div className="p-3.5 bg-[#FEF7EB] rounded-card border border-[#F6DEB5] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B7791F] block">
                    Record B &bull; {conflict.recordB.source}
                  </span>
                  <p className="font-semibold text-[#202B28]">{conflict.recordB.claim}</p>
                  <span className="text-[10px] text-[#8E9B96] block">Dated: {conflict.recordB.date}</span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F8F6] rounded-control border border-[#E5EAE6] text-xs">
                <span className="font-bold text-[#183B35]">Operational Impact: </span>
                <span className="text-[#687570]">{conflict.impact}</span>
              </div>

              {conflict.managerResolution && (
                <div className="p-3 bg-[#E8F2ED] rounded-control border border-[#D0E3D9] text-xs text-[#183B35]">
                  <strong>Manager Resolution Note:</strong> {conflict.managerResolution}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(item => (
            <Card key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge status={item.status} />
                  {item.flagType && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FDF2F2] text-[#B54747] border border-[#F8C8C8]">
                      {item.flagType.toUpperCase()}
                    </span>
                  )}
                  <span className="text-xs text-[#8E9B96] font-mono">Source: {item.sourceReference}</span>
                </div>

                <h4 className="text-sm font-bold text-[#183B35] font-heading">{item.title}</h4>
                {item.reasoning && (
                  <p className="text-xs text-[#687570]">{item.reasoning}</p>
                )}
                {item.conflictDescription && (
                  <p className="text-xs text-[#B54747] bg-[#FDF2F2] p-2 rounded-control border border-[#F8C8C8]">
                    <strong>Flag Details:</strong> {item.conflictDescription}
                  </p>
                )}

                {item.dependencies && (
                  <div className="flex items-center gap-1.5 pt-1 text-xs text-[#2F6B5D]">
                    <span className="font-semibold text-[#687570]">Dependencies:</span>
                    {item.dependencies.map((dep, i) => (
                      <span key={i} className="bg-[#E8F2ED] px-2 py-0.5 rounded text-[11px] font-mono">
                        {dep}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E5EAE6]">
                <span className="text-[11px] text-[#8E9B96] block">Owner</span>
                <span className="text-xs font-semibold text-[#183B35]">{item.owner}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Conflict Resolution Modal */}
      <Modal
        isOpen={!!selectedConflict}
        onClose={() => setSelectedConflict(null)}
        title="Resolve Information Contradiction"
        subtitle={selectedConflict?.title}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setSelectedConflict(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmResolution}>
              Authorize Resolution
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-[#687570] leading-relaxed">
            As the Project Manager, specify which record is authoritative and detail the technical rationale. This decision is preserved in the audit history.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Manager Justification & Target Source of Truth *
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Confirmed with DevOps: AWS ElastiCache cluster migration was completed in PR #194. Disaster Recovery runbook is marked for update."
              value={resolutionNote}
              onChange={e => setResolutionNote(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
