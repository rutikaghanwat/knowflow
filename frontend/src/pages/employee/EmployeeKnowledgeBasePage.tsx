import React, { useState } from 'react';
import {
  Database,
  Search,
  ExternalLink,
  FileText,
  GitBranch,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { EvidenceTypeBadge } from '../../components/ui/EvidenceTypeBadge';
import { mockKnowledgeFindings } from '../../data/mockData';

export const EmployeeKnowledgeBasePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredFindings = mockKnowledgeFindings.filter((finding) => {
    const matchesSearch =
      finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.sourceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || finding.classification === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <PageHeader
        title="Permitted Knowledge Base"
        description="Search verified facts, architecture decisions, and operational findings permitted for your project role."
        badge="Evidence Vault"
      />

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search findings, code citations, runbooks..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {['all', 'verified_fact', 'ai_inference', 'recommendation', 'unknown_missing'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                typeFilter === t
                  ? 'bg-[#142640] text-white shadow-subtle'
                  : 'bg-white text-[#687570] border border-[#E5EAE6] hover:bg-[#F5F7F6]'
              }`}
            >
              {t === 'all' ? 'All Evidence' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredFindings.map((finding) => (
          <div
            key={finding.id}
            className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle hover:border-[#218653] transition-all space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <EvidenceTypeBadge type={finding.classification} />
              <span className="text-[11px] font-mono text-[#8E9B96]">
                Confidence: {Math.round(finding.confidenceScore * 100)}%
              </span>
            </div>

            <div>
              <h4 className="text-sm text-[#142640] font-bold">
                {finding.title}
              </h4>
              <p className="text-xs text-[#687570] leading-relaxed mt-1">
                {finding.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E5EAE6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#687570]">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#218653]" />
                <span>
                  Cited in: <strong>{finding.sourceName}</strong>
                </span>
                {finding.sourceRef && (
                  <span className="font-mono text-[11px] text-[#218653]">
                    ({finding.sourceRef})
                  </span>
                )}
              </div>

              <span className="text-[11px] font-mono text-[#8E9B96]">
                {finding.lastUpdated}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
