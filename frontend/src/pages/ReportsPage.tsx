import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Share2,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  GitCommit,
  Clock,
  Layers,
  Copy,
  Check,
  ShieldCheck,
  Filter,
  UserCheck,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import { mockHandoverReport } from '../data/mockData';
import { HandoverReport, HandoverRole, EvidenceType } from '../types';
import { formatDate } from '../utils';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<HandoverReport>(mockHandoverReport);
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-1');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<HandoverRole>('Backend Developer');
  const [expandedFindings, setExpandedFindings] = useState<Record<string, boolean>>({
    'f-1': true,
    'f-5': true,
    'f-11': true,
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [ackChecklist, setAckChecklist] = useState(
    mockHandoverReport.acknowledgment?.checklistAnswers || []
  );
  const [digitalSignature, setDigitalSignature] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [showAccessFilterAudit, setShowAccessFilterAudit] = useState(false);

  const toggleFinding = (id: string) => {
    setExpandedFindings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleCheck = (id: string) => {
    setAckChecklist(prev =>
      prev.map(c => (c.id === id ? { ...c, confirmed: !c.confirmed } : c))
    );
  };

  const handleSignAcknowledgment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!digitalSignature.trim()) return;
    setIsSigned(true);
  };

  // Filter findings across all sections based on evidence type and selected role
  const filteredSections = report.sections.map(sec => ({
    ...sec,
    findings: sec.findings.filter(f => {
      const matchesEvidence = filterType === 'all' || f.type === filterType;
      const matchesRole =
        !f.targetRoles ||
        f.targetRoles.includes(selectedRole) ||
        selectedRole === 'Project Manager';
      return matchesEvidence && matchesRole;
    }),
  }));

  const allConfirmed = ackChecklist.every(c => c.confirmed);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Handover Report"
        description="Module 06 — Role-filtered, evidence-backed knowledge handover generated from authorized repositories and validated documentation."
        badge={<Badge status={report.status} />}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-[#26734D]" /> : <Share2 className="w-3.5 h-3.5" />}
              onClick={handleShare}
            >
              {copiedLink ? 'Link Copied' : 'Share'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={handlePrint}
            >
              Export
            </Button>
          </div>
        }
      />

      {/* Pre-Report Verification Checks (Check 1 & Check 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Check 1: Access Permission Filtering */}
        <div className="p-4 bg-white rounded-card border border-[#E5EAE6] shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F6B5D] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#26734D]" />
              Check 1: Access Permission Filtering
            </span>
            <span className="text-xs font-bold text-[#26734D] bg-[#EBF7F0] px-2 py-0.5 rounded border border-[#C3E7D3]">
              Enforced &bull; Passed
            </span>
          </div>
          <p className="text-xs text-[#687570] leading-relaxed">
            Scanning excluded 2 unpermitted internal repositories and redacted AWS KMS root credentials. Incoming employee <strong className="text-[#202B28]">{report.incomingMember.name}</strong> only views authorized scope.
          </p>
          <button
            onClick={() => setShowAccessFilterAudit(!showAccessFilterAudit)}
            className="text-[11px] font-semibold text-[#2F6B5D] hover:underline"
          >
            {showAccessFilterAudit ? 'Hide Filter Audit Details' : 'View Excluded Items Log (2)'}
          </button>

          {showAccessFilterAudit && (
            <div className="mt-2 p-2.5 bg-[#F7F8F6] rounded text-[11px] space-y-1 border border-[#E5EAE6]">
              <p className="text-[#B54747]">&bull; Excluded: `billing-internal-secrets.env` (Admin-only ACL)</p>
              <p className="text-[#B54747]">&bull; Excluded: `acme-corp/executive-salaries` (Private repo)</p>
            </div>
          )}
        </div>

        {/* Check 2: Role Relevance Filtering */}
        <div className="p-4 bg-white rounded-card border border-[#E5EAE6] shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F6B5D] flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#2F6B5D]" />
              Check 2: Role Relevance Filtering
            </span>
            <span className="text-xs font-bold text-[#183B35] bg-[#E8F2ED] px-2 py-0.5 rounded border border-[#D0E3D9]">
              Relevance: {report.roleRelevanceScore}%
            </span>
          </div>
          <p className="text-xs text-[#687570] leading-relaxed">
            Content dynamically targeted for incoming role. Switch target role below to preview how knowledge is filtered for different engineering disciplines.
          </p>
          <div className="pt-1 flex items-center gap-2">
            <label className="text-[11px] font-semibold text-[#183B35]">Active Role Focus:</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as HandoverRole)}
              className="text-xs font-semibold bg-[#F7F8F6] border border-[#E5EAE6] rounded-control px-2.5 py-1 text-[#183B35] focus:ring-1 focus:ring-[#2F6B5D]"
            >
              <option value="Backend Developer">Backend Developer (Current)</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Project Manager">Project Manager (All Sections)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Meta Card */}
      <Card className="p-6 bg-white border-[#E5EAE6] shadow-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E5EAE6]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#2F6B5D] bg-[#E8F2ED] px-2.5 py-0.5 rounded border border-[#D0E3D9]">
                {report.projectName}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F0F4F2] text-[#183B35] border border-[#D0E3D9]">
                Target: {selectedRole}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#183B35] font-heading">
              {report.title}
            </h2>
            <p className="text-xs text-[#687570] max-w-3xl leading-relaxed">
              {report.summary}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-[#F7F8F6] p-4 rounded-card border border-[#E5EAE6]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8E9B96] tracking-wider block">
                Confidence
              </span>
              <span className="text-2xl font-extrabold text-[#183B35] font-heading">
                {report.completionScore}%
              </span>
            </div>
            <div className="border-l border-[#E5EAE6] pl-6 space-y-1 text-xs">
              <div>
                <span className="text-[#8E9B96]">Departing:</span>{' '}
                <strong className="text-[#202B28]">{report.departingMember.name}</strong> ({report.departingMember.role})
              </div>
              <div>
                <span className="text-[#8E9B96]">Incoming:</span>{' '}
                <strong className="text-[#202B28]">{report.incomingMember.name}</strong> ({report.incomingMember.role})
              </div>
              <div>
                <span className="text-[#8E9B96]">Reviewer:</span>{' '}
                <strong className="text-[#202B28]">{report.manager.name}</strong> ({report.manager.role})
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Verification Legend Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#687570] font-medium mr-1">Filter Evidence:</span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-[#183B35] text-white'
                  : 'bg-[#F0F4F2] text-[#687570] hover:bg-[#E8F2ED]'
              }`}
            >
              All Sections
            </button>
            <button
              onClick={() => setFilterType('verified_fact')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                filterType === 'verified_fact'
                  ? 'bg-[#E8F2ED] text-[#183B35] border-[#183B35] font-bold'
                  : 'bg-white text-[#183B35] border-[#B9D7C8]'
              }`}
            >
              {report.verifiedFactsCount} Verified Facts
            </button>
            <button
              onClick={() => setFilterType('ai_inference')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                filterType === 'ai_inference'
                  ? 'bg-[#EAF1F8] text-[#2C5282] border-[#2C5282] font-bold'
                  : 'bg-white text-[#2C5282] border-[#C3D9ED]'
              }`}
            >
              {report.aiInferencesCount} AI Inferences
            </button>
            <button
              onClick={() => setFilterType('recommendation')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                filterType === 'recommendation'
                  ? 'bg-[#FEF7EB] text-[#B7791F] border-[#B7791F] font-bold'
                  : 'bg-white text-[#B7791F] border-[#F6DEB5]'
              }`}
            >
              {report.recommendationsCount} Recommendations
            </button>
            <button
              onClick={() => setFilterType('unknown_missing')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                filterType === 'unknown_missing'
                  ? 'bg-[#FDF2F2] text-[#B54747] border-[#B54747] font-bold'
                  : 'bg-white text-[#B54747] border-[#F8C8C8]'
              }`}
            >
              {report.unresolvedCount} Missing Items
            </button>
          </div>

          <span className="text-[#8E9B96] text-[11px]">
            Generated {formatDate(report.generatedAt)} &bull; Version {report.version}
          </span>
        </div>
      </Card>

      {/* Main Report Body: Left Table of Contents + Right Section Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Table of Contents (Sticky) */}
        <div className="lg:col-span-1 bg-white p-3.5 rounded-card border border-[#E5EAE6] shadow-subtle sticky top-20 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] px-2.5 py-1 block">
            Report Sections
          </span>
          {report.sections.map((sec, idx) => {
            const isActive = activeSectionId === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => setActiveSectionId(sec.id)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-control text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E8F2ED] text-[#183B35] font-bold'
                    : 'text-[#687570] hover:text-[#202B28] hover:bg-[#F7F8F6]'
                }`}
              >
                <span className="truncate">
                  {idx + 1}. {sec.title}
                </span>
                <span className="text-[10px] font-mono text-[#8E9B96]">
                  {sec.findings.length}
                </span>
              </a>
            );
          })}

          <div className="pt-3 border-t border-[#E5EAE6] px-2">
            <a
              href="#acknowledgment-section"
              className="text-xs font-bold text-[#2F6B5D] hover:underline flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Digital Acknowledgment</span>
            </a>
          </div>
        </div>

        {/* Report Content Column */}
        <div className="lg:col-span-3 space-y-6">
          {filteredSections.map((sec, idx) => {
            if (sec.findings.length === 0) return null;

            return (
              <div
                key={sec.id}
                id={sec.id}
                className="bg-white rounded-card border border-[#E5EAE6] shadow-card overflow-hidden scroll-mt-24"
              >
                {/* Section Header */}
                <div className="px-6 py-4 bg-[#F7F8F6] border-b border-[#E5EAE6] flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#183B35] font-heading">
                      {idx + 1}. {sec.title}
                    </h3>
                    <p className="text-xs text-[#687570] mt-0.5">{sec.description}</p>
                  </div>
                  <span className="text-xs font-mono font-medium text-[#8E9B96] bg-white px-2 py-0.5 rounded border border-[#E5EAE6]">
                    {sec.findings.length} finding{sec.findings.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Section Findings */}
                <div className="divide-y divide-[#E5EAE6]">
                  {sec.findings.map(finding => {
                    const isExpanded = !!expandedFindings[finding.id];

                    return (
                      <div key={finding.id} className="p-5 sm:p-6 space-y-3">
                        {/* Finding Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <EvidenceBadge type={finding.type} />
                              {finding.actionRequired && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEF7EB] text-[#B7791F] border border-[#F6DEB5]">
                                  Action Required
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-[#183B35] font-heading leading-snug">
                              {finding.title}
                            </h4>
                          </div>

                          <button
                            onClick={() => toggleFinding(finding.id)}
                            className="p-1 text-[#8E9B96] hover:text-[#183B35] hover:bg-[#F0F4F2] rounded-control transition-colors"
                            aria-label="Toggle evidence citations"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Finding Description */}
                        <p className="text-xs text-[#202B28] leading-relaxed">
                          {finding.description}
                        </p>

                        {/* Action Callout if present */}
                        {finding.actionRequired && (
                          <div className="p-3 bg-[#FEF7EB] rounded-control border border-[#F6DEB5] text-xs text-[#B7791F] space-y-1">
                            <span className="font-bold block">Next Step for Incoming Maintainer:</span>
                            <p className="text-[#202B28]">{finding.actionRequired}</p>
                          </div>
                        )}

                        {/* Supporting Evidence Drawer (Expandable) */}
                        {finding.evidence.length > 0 && isExpanded && (
                          <div className="mt-3 pt-3 border-t border-dashed border-[#E5EAE6] space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#687570] flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-[#2F6B5D]" />
                              Supporting Evidence & Source Reference
                            </span>

                            {finding.evidence.map(ev => (
                              <div
                                key={ev.id}
                                className="p-3.5 bg-[#F7F8F6] rounded-control border border-[#E5EAE6] text-xs space-y-2"
                              >
                                <div className="flex items-center justify-between text-[#687570] flex-wrap gap-2">
                                  <div className="flex items-center gap-1.5 font-semibold text-[#183B35]">
                                    <FileText className="w-3.5 h-3.5 text-[#2F6B5D]" />
                                    <span>{ev.sourceName}</span>
                                    <span className="text-[#8E9B96] font-mono text-[11px]">
                                      ({ev.sourceRef})
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5EAE6] text-[#26734D]">
                                      Match: {(ev.confidenceScore * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </div>

                                <blockquote className="p-2.5 bg-white rounded border-l-2 border-[#2F6B5D] text-[#202B28] font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                                  {ev.quote}
                                </blockquote>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Module 08: Secure Knowledge Transfer & Digital Acknowledgment */}
          <div
            id="acknowledgment-section"
            className="bg-white rounded-card-lg border border-[#E5EAE6] p-6 shadow-card space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5EAE6]">
              <div className="p-2 rounded-control bg-[#E8F2ED] text-[#183B35]">
                <UserCheck className="w-5 h-5 text-[#2F6B5D]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#183B35] font-heading">
                  Module 08 — Secure Knowledge Transfer & Digital Acknowledgment
                </h3>
                <p className="text-xs text-[#687570]">
                  Recipient confirmation: {report.incomingMember.name} ({selectedRole})
                </p>
              </div>
            </div>

            {isSigned ? (
              <div className="p-5 bg-[#EBF7F0] rounded-card border border-[#C3E7D3] text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#C3E7D3] text-[#26734D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#26734D]">
                  Handover Receipt Formally Acknowledged
                </h4>
                <p className="text-xs text-[#202B28] max-w-md mx-auto">
                  Digital signature <strong>"{digitalSignature}"</strong> confirmed on {new Date().toLocaleDateString()}. This report is archived for organizational continuity.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignAcknowledgment} className="space-y-4">
                <p className="text-xs text-[#687570]">
                  Before final completion, the incoming engineer confirms they have reviewed all evidence-backed findings and assumed operational maintainership:
                </p>

                <div className="space-y-2.5">
                  {ackChecklist.map(item => (
                    <label
                      key={item.id}
                      className="flex items-start gap-2.5 p-3 rounded-control bg-[#F7F8F6] border border-[#E5EAE6] cursor-pointer hover:bg-[#F0F4F2] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.confirmed}
                        onChange={() => handleToggleCheck(item.id)}
                        className="mt-0.5 rounded text-[#2F6B5D] focus:ring-[#2F6B5D]"
                      />
                      <span className="text-xs text-[#202B28] font-medium leading-relaxed">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#183B35] mb-1">
                      Digital Signature (Full Legal Name) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Marcus Vance"
                      value={digitalSignature}
                      onChange={e => setDigitalSignature(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!allConfirmed || !digitalSignature.trim()}
                    leftIcon={<Check className="w-4 h-4" />}
                  >
                    Confirm & Acknowledge
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
