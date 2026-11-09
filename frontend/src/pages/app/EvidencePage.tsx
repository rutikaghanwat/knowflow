import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Search,
  Check,
  XCircle,
  MessageSquare,
  Edit3,
  Flag,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EvidenceBadge } from '../../components/ui/EvidenceBadge';
import { SearchInput } from '../../components/ui/SearchInput';
import { Modal } from '../../components/ui/Modal';
import { mockKnowledgeFindings } from '../../data/mockData';
import { KnowledgeFinding, EvidenceType } from '../../types';

export const EvidencePage: React.FC = () => {
  const [findings, setFindings] = useState<KnowledgeFinding[]>(mockKnowledgeFindings);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingFinding, setEditingFinding] = useState<KnowledgeFinding | null>(null);
  const [editComment, setEditComment] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredFindings = findings.filter(f => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.quote.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || f.classification === filterType;
    return matchesSearch && matchesType;
  });

  const handleVerifyFinding = (id: string) => {
    setFindings(prev =>
      prev.map(f =>
        f.id === id ? { ...f, verificationStatus: 'verified' } : f
      )
    );
    setToastMessage('Finding verified by Project Manager.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFlagFinding = (id: string) => {
    setFindings(prev =>
      prev.map(f =>
        f.id === id ? { ...f, verificationStatus: 'flagged' } : f
      )
    );
    setToastMessage('Finding flagged as unverified / requiring manual investigation.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveComment = () => {
    if (!editingFinding) return;
    setFindings(prev =>
      prev.map(f =>
        f.id === editingFinding.id ? { ...f, managerComment: editComment } : f
      )
    );
    setEditingFinding(null);
    setToastMessage('Manager annotation updated successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence and Reliability Management"
        description="Module 05 — Full traceability matrix linking extracted claims to exact repository lines and document pages. The Project Manager audits confidence scores and validates findings before final sign-off."
      />

      {toastMessage && (
        <div className="p-3.5 bg-[#EBF7F0] border border-[#C3E7D3] rounded-card text-xs text-[#26734D] font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Audit Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-card border border-[#E5EAE6] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8E9B96] tracking-wider block">Audited Facts</span>
            <span className="text-2xl font-extrabold text-[#183B35] font-heading mt-0.5 block">
              {findings.filter(f => f.verificationStatus === 'verified').length} / {findings.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#EBF7F0] text-[#26734D] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-card border border-[#E5EAE6] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8E9B96] tracking-wider block">Flagged Uncertainties</span>
            <span className="text-2xl font-extrabold text-[#B54747] font-heading mt-0.5 block">
              {findings.filter(f => f.verificationStatus === 'flagged').length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FDF2F2] text-[#B54747] flex items-center justify-center">
            <Flag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-card border border-[#E5EAE6] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8E9B96] tracking-wider block">Average Evidence Confidence</span>
            <span className="text-2xl font-extrabold text-[#2F6B5D] font-heading mt-0.5 block">
              {(
                findings.reduce((acc, f) => acc + f.confidenceScore, 0) / (findings.length || 1) * 100
              ).toFixed(0)}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E8F2ED] text-[#183B35] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-card border border-[#E5EAE6] shadow-subtle">
        <SearchInput
          placeholder="Search claims, quotes, or references..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          className="sm:w-80"
        />

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Evidence' },
            { id: 'verified_fact', label: 'Verified Facts' },
            { id: 'ai_inference', label: 'AI Inferences' },
            { id: 'recommendation', label: 'Recommendations' },
            { id: 'unknown_missing', label: 'Unknown / Missing' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilterType(opt.id)}
              className={`px-3 py-1.5 rounded-control text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === opt.id
                  ? 'bg-[#183B35] text-white'
                  : 'bg-[#F7F8F6] text-[#687570] hover:text-[#202B28] hover:bg-[#E8F2ED]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-white rounded-card border border-[#E5EAE6] overflow-x-auto shadow-subtle">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F8F6] border-b border-[#E5EAE6] text-[#687570] uppercase font-semibold">
            <tr>
              <th className="py-3.5 px-4">Classification & Finding</th>
              <th className="py-3.5 px-4">Verbatim Evidence Quote</th>
              <th className="py-3.5 px-4">Source Reference</th>
              <th className="py-3.5 px-4 text-center">Confidence</th>
              <th className="py-3.5 px-4">Audit Status</th>
              <th className="py-3.5 px-4 text-right">Manager Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EAE6]">
            {filteredFindings.map(finding => (
              <tr key={finding.id} className="hover:bg-[#F7F8F6] transition-colors">
                <td className="py-4 px-4 max-w-xs space-y-1">
                  <EvidenceBadge type={finding.classification} size="sm" />
                  <div className="font-bold text-sm text-[#183B35] font-heading">{finding.title}</div>
                  <p className="text-[11px] text-[#687570] line-clamp-2">{finding.description}</p>
                  {finding.managerComment && (
                    <p className="text-[10px] text-[#B7791F] bg-[#FEF7EB] p-1.5 rounded border border-[#F6DEB5]">
                      <strong>Note:</strong> {finding.managerComment}
                    </p>
                  )}
                </td>

                <td className="py-4 px-4 max-w-sm">
                  <blockquote className="p-2.5 bg-[#F7F8F6] rounded border-l-2 border-[#2F6B5D] font-mono text-[11px] text-[#202B28] leading-relaxed">
                    {finding.quote}
                  </blockquote>
                </td>

                <td className="py-4 px-4 font-mono text-[11px]">
                  <div className="font-semibold text-[#183B35]">{finding.sourceName}</div>
                  <div className="text-[#8E9B96]">{finding.sourceRef}</div>
                </td>

                <td className="py-4 px-4 text-center font-bold font-mono text-[#26734D]">
                  {(finding.confidenceScore * 100).toFixed(0)}%
                </td>

                <td className="py-4 px-4">
                  <Badge
                    status={finding.verificationStatus === 'verified' ? 'approved' : 'rejected'}
                  >
                    {finding.verificationStatus === 'verified' ? 'Verified' : 'Flagged'}
                  </Badge>
                </td>

                <td className="py-4 px-4 text-right space-x-1 whitespace-nowrap">
                  {finding.verificationStatus !== 'verified' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyFinding(finding.id)}
                      leftIcon={<Check className="w-3 h-3 text-[#26734D]" />}
                      title="Verify finding as accurate"
                    >
                      Verify
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFlagFinding(finding.id)}
                      leftIcon={<Flag className="w-3 h-3 text-[#B54747]" />}
                      title="Flag finding for correction"
                    >
                      Flag
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingFinding(finding);
                      setEditComment(finding.managerComment || '');
                    }}
                    leftIcon={<Edit3 className="w-3 h-3 text-[#687570]" />}
                  >
                    Annotate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Annotate / Comment Modal */}
      <Modal
        isOpen={!!editingFinding}
        onClose={() => setEditingFinding(null)}
        title="Manager Annotation & Reliability Assessment"
        subtitle={editingFinding?.title}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setEditingFinding(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveComment}>
              Save Annotation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-[#F7F8F6] rounded-control border border-[#E5EAE6] text-xs space-y-1">
            <span className="font-bold text-[#183B35]">Extracted Claim: </span>
            <p className="text-[#687570]">{editingFinding?.description}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Manager Note / Corrective Instruction *
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Confirmed with Rutika: The dispute settlement batch was deprecated. Exclude from Marcus's on-call handover."
              value={editComment}
              onChange={e => setEditComment(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
