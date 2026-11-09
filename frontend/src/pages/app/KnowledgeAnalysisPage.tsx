import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Filter,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Shield,
  Layers,
  Search,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EvidenceBadge } from '../../components/ui/EvidenceBadge';
import { SearchInput } from '../../components/ui/SearchInput';
import { mockKnowledgeFindings } from '../../data/mockData';
import { KnowledgeFinding, EvidenceType } from '../../types';
import { formatTimeAgo } from '../../utils';

export const KnowledgeAnalysisPage: React.FC = () => {
  const [findings, setFindings] = useState<KnowledgeFinding[]>(mockKnowledgeFindings);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeClassification, setActiveClassification] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('kf-1');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'completed_task', label: 'Completed Tasks' },
    { id: 'pending_task', label: 'Pending Tasks' },
    { id: 'decision', label: 'Documented Decisions' },
    { id: 'risk', label: 'Risks & Blockers' },
    { id: 'unresolved_question', label: 'Unresolved Questions' },
  ];

  const classifications: { id: string; label: string; type?: EvidenceType }[] = [
    { id: 'all', label: 'All Types' },
    { id: 'verified_fact', label: 'Verified Facts' },
    { id: 'ai_inference', label: 'AI Inferences' },
    { id: 'recommendation', label: 'Recommendations' },
    { id: 'unknown_missing', label: 'Unknown / Missing' },
  ];

  const filteredFindings = findings.filter(f => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.sourceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
    const matchesClassification =
      activeClassification === 'all' || f.classification === activeClassification;
    return matchesSearch && matchesCategory && matchesClassification;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI-Powered Knowledge Extraction"
        description="Module 03 — Ingested documents and GitHub commit histories are tokenized into structured tasks, architectural decisions, and risk assessments with source attribution."
      />

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-card border border-[#E5EAE6] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#183B35] block">
            Verified Facts
          </span>
          <span className="text-2xl font-extrabold text-[#183B35] font-heading mt-1 block">
            {findings.filter(f => f.classification === 'verified_fact').length}
          </span>
          <span className="text-[11px] text-[#687570]">Direct source attribution</span>
        </div>

        <div className="p-4 bg-white rounded-card border border-[#E5EAE6] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C5282] block">
            AI Inferences
          </span>
          <span className="text-2xl font-extrabold text-[#2C5282] font-heading mt-1 block">
            {findings.filter(f => f.classification === 'ai_inference').length}
          </span>
          <span className="text-[11px] text-[#687570]">Synthesized from PR & branch trails</span>
        </div>

        <div className="p-4 bg-white rounded-card border border-[#E5EAE6] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B7791F] block">
            Recommendations
          </span>
          <span className="text-2xl font-extrabold text-[#B7791F] font-heading mt-1 block">
            {findings.filter(f => f.classification === 'recommendation').length}
          </span>
          <span className="text-[11px] text-[#687570]">Actionable next steps</span>
        </div>

        <div className="p-4 bg-white rounded-card border border-[#E5EAE6] shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B54747] block">
            Unknown / Missing
          </span>
          <span className="text-2xl font-extrabold text-[#B54747] font-heading mt-1 block">
            {findings.filter(f => f.classification === 'unknown_missing').length}
          </span>
          <span className="text-[11px] text-[#687570]">Gaps requiring manager interview</span>
        </div>
      </div>

      {/* Filter and Category Tabs */}
      <div className="bg-white p-4 rounded-card border border-[#E5EAE6] shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <SearchInput
            placeholder="Search findings, decisions, or source documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            className="sm:w-80"
          />

          {/* Classification Pill Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {classifications.map(cl => (
              <button
                key={cl.id}
                onClick={() => setActiveClassification(cl.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeClassification === cl.id
                    ? 'bg-[#183B35] text-white font-semibold'
                    : 'bg-[#F0F4F2] text-[#687570] hover:text-[#202B28] hover:bg-[#E8F2ED]'
                }`}
              >
                {cl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E5EAE6] overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-control transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#E8F2ED] text-[#183B35]'
                  : 'text-[#687570] hover:text-[#202B28] hover:bg-[#F7F8F6]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map(finding => {
          const isExpanded = expandedId === finding.id;
          return (
            <Card
              key={finding.id}
              className="p-5 sm:p-6 transition-all hover:border-[#2F6B5D]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <EvidenceBadge type={finding.classification} />
                    <span className="text-[11px] font-mono font-medium text-[#2F6B5D] bg-[#E8F2ED] px-2 py-0.5 rounded border border-[#D0E3D9]">
                      {finding.projectName}
                    </span>
                    {finding.targetRole && (
                      <span className="text-[11px] text-[#687570] bg-[#F0F4F2] px-2 py-0.5 rounded">
                        Target Role: <strong>{finding.targetRole}</strong>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#183B35] font-heading mt-1">
                    {finding.title}
                  </h3>

                  <p className="text-xs text-[#202B28] leading-relaxed max-w-3xl">
                    {finding.description}
                  </p>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                  className="p-1.5 text-[#8E9B96] hover:text-[#183B35] hover:bg-[#F0F4F2] rounded-control transition-colors shrink-0"
                  aria-label="Toggle evidence details"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>

              {/* Expandable Evidence Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[#E5EAE6] space-y-3 bg-[#F7F8F6] p-4 rounded-card">
                  <div className="flex items-center justify-between text-xs text-[#687570] flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 font-semibold text-[#183B35]">
                      <FileText className="w-3.5 h-3.5 text-[#2F6B5D]" />
                      <span>{finding.sourceName}</span>
                      <span className="text-[#8E9B96] font-mono text-[11px]">({finding.sourceRef})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#E5EAE6] text-[#26734D] font-bold">
                        Confidence: {(finding.confidenceScore * 100).toFixed(0)}%
                      </span>
                      <Badge
                        status={finding.verificationStatus === 'verified' ? 'approved' : 'failed'}
                      >
                        {finding.verificationStatus === 'verified' ? 'Manager Verified' : 'Flagged for Review'}
                      </Badge>
                    </div>
                  </div>

                  <blockquote className="p-3 bg-white rounded border-l-2 border-[#2F6B5D] text-[#202B28] font-mono text-xs leading-relaxed">
                    {finding.quote}
                  </blockquote>

                  {finding.managerComment && (
                    <div className="p-2.5 bg-[#FEF7EB] rounded-control border border-[#F6DEB5] text-xs text-[#B7791F]">
                      <strong>Manager Annotation:</strong> {finding.managerComment}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
