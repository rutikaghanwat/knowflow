import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  GitCommit,
  Sparkles,
  AlertTriangle,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockKnowledgeFindings } from '../../data/mockData';
import { KnowledgeFinding } from '../../types';

export const PermittedEvidencePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');

  const filteredItems = mockKnowledgeFindings.filter((item: KnowledgeFinding) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.sourceName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7F0] text-[#218653] border border-[#C3E7D3] mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Access Cleared Evidence Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
          Permitted Evidence & Citations
        </h1>
        <p className="text-xs sm:text-sm text-[#687570] max-w-2xl leading-relaxed">
          Every statement in your handover report is anchored to a traceable commit hash or runbook page.
          All claims below have been verified by Sarah Lin (Project Manager).
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter by keyword, claim, or source file..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5EAE6] rounded-2xl text-xs text-[#142640] shadow-subtle focus:border-[#218653]"
        />
      </div>

      {/* Evidence Cards */}
      <div className="space-y-3">
        {filteredItems.map((item: KnowledgeFinding) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-resting space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    item.classification === 'verified_fact'
                      ? 'text-[#26734D] bg-[#EBF7F0] border-[#C3E7D3]'
                      : 'text-[#B7791F] bg-[#FEF7EB] border-[#F6DEB5]'
                  }`}
                >
                  {item.classification === 'verified_fact' ? 'Verified Fact' : 'Recommendation'}
                </span>
                <span className="text-xs font-bold text-[#142640] font-mono">
                  {item.sourceName}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#2F6B5D] bg-[#F5F7F6] px-2.5 py-0.5 rounded-lg border border-[#E5EAE6]">
                {item.sourceRef}
              </span>
            </div>

            <p className="text-xs font-semibold text-[#142640] leading-snug">
              &ldquo;{item.title}&rdquo; &bull; <span className="font-normal text-[#687570]">{item.description}</span>
            </p>

            <div className="p-3 bg-[#F5F7F6] rounded-xl border border-[#E5EAE6] font-mono text-[11px] text-slate-800">
              <code>{item.quote}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
