import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  GitCommit,
  FileCode2,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface EvidenceBadgeInfo {
  id: 'verified_fact' | 'ai_inference' | 'recommendation' | 'unknown_missing';
  label: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  confidence: string;
  description: string;
  sampleClaim: string;
  citationType: 'GitHub Commit' | 'Architecture Decision' | 'Runbook Document' | 'Unresolved Gap';
  sourceRef: string;
  rawQuote: string;
  codeSnippet?: string;
  managerAction: string;
}

const badgeData: EvidenceBadgeInfo[] = [
  {
    id: 'verified_fact',
    label: 'Verified Fact',
    colorClass: 'text-[#704B91]',
    borderClass: 'border-[#E4D9EF]',
    bgClass: 'bg-[#F2EDF8]',
    confidence: '100% Traceable',
    description: 'Explicit statements directly verified in merged code, repository commits, or approved technical documents.',
    sampleClaim: 'Distributed transaction idempotency uses two-phase lockless validation on Stripe checkout webhooks to eliminate duplicate charges.',
    citationType: 'GitHub Commit',
    sourceRef: 'PR #182 • commit f49c12b • src/payments/stripe/webhook.ts:L45-88',
    rawQuote: 'export const processIdempotentCharge = async (eventId: string, payload: WebhookPayload) => { const lock = await redis.set(`lock:evt:${eventId}`, "1", "NX", "EX", 300); ... }',
    managerAction: 'Automatically validated. No managerial intervention required.',
  },
  {
    id: 'ai_inference',
    label: 'AI Inference',
    colorClass: 'text-[#704B91]',
    borderClass: 'border-[#E4D9EF]',
    bgClass: 'bg-[#F2EDF8]',
    confidence: 'High Confidence (88%)',
    description: 'Synthesized insights derived by analyzing commit timing, dependency graphs, and pull request review patterns.',
    sampleClaim: 'The team migrated billing queue workers from SQS to Redis Streams during Sprint 24 to reduce latency, but cross-region failover tests remain incomplete.',
    citationType: 'Architecture Decision',
    sourceRef: 'ADR-041: Redis Streams for Event Ingestion (Draft state in repo docs/decisions)',
    rawQuote: 'Status: Accepted for Primary Region (us-east-1). Secondary region failover dry-run scheduled post-holiday release window.',
    managerAction: 'Manager can confirm accuracy or adjust confidence score before report sign-off.',
  },
  {
    id: 'recommendation',
    label: 'Recommendation',
    colorClass: 'text-[#B7791F]',
    borderClass: 'border-[#F6DEB5]',
    bgClass: 'bg-[#FEF7EB]',
    confidence: 'Actionable Guidance',
    description: 'Strategic action items and hygiene recommendations formulated to prevent operational pitfalls during ownership transfer.',
    sampleClaim: 'Scale PgBouncer pool limits from 120 to 300 connections prior to Cyber Week traffic spike; monitor replica lag via Prometheus.',
    citationType: 'Runbook Document',
    sourceRef: 'Disaster-Recovery-Runbook-v4.docx (Page 12, Section 3.2: Traffic Surges)',
    rawQuote: 'Under >5,000 req/sec sustained burst, database connection exhaustion occurred in staging. Production PgBouncer max_client_conn must be set to 300.',
    managerAction: 'Manager assigns as an explicit onboarding milestone to the incoming engineer.',
  },
  {
    id: 'unknown_missing',
    label: 'Unknown / Missing',
    colorClass: 'text-[#B54747]',
    borderClass: 'border-[#F8C8C8]',
    bgClass: 'bg-[#FDF2F2]',
    confidence: 'Critical Gap Flag',
    description: 'Identifies missing documentation, unassigned secrets, or unmerged feature branches that require human clarification before exit.',
    sampleClaim: 'Third-party fraud scoring API key rotation schedule and secondary webhook signing secret are not documented in any committed runbook.',
    citationType: 'Unresolved Gap',
    sourceRef: 'Code reference found in env.example (FRAUD_GATEWAY_SECRET), missing in 1Password vault',
    rawQuote: 'TODO(rutika): Transfer ownership of FraudGateway dashboard admin credentials to Marcus before Nov 15.',
    managerAction: 'Blocks handover completion until departing engineer resolves or explains the gap.',
  },
];

export const EvidenceBadgeShowcase: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<EvidenceBadgeInfo['id']>('verified_fact');
  const activeBadge = badgeData.find(b => b.id === selectedBadge) || badgeData[0];

  return (
    <div className="space-y-6">
      {/* 4 Clickable Badge Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {badgeData.map(badge => {
          const isSelected = selectedBadge === badge.id;
          return (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#704B91] shadow-resting ring-2 ring-[#704B91]/20 scale-[1.02]'
                  : 'bg-white/80 hover:bg-white border-[#E8E0EF] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.bgClass} ${badge.colorClass} ${badge.borderClass}`}
                >
                  {badge.id === 'verified_fact' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {badge.id === 'ai_inference' && <Sparkles className="w-3.5 h-3.5" />}
                  {badge.id === 'recommendation' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {badge.id === 'unknown_missing' && <HelpCircle className="w-3.5 h-3.5" />}
                  <span>{badge.label}</span>
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#697586] block">
                {badge.confidence}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Citation Inspector Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E0EF] p-6 sm:p-8 shadow-resting space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E0EF]">
          <div className="flex items-center gap-2.5">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${activeBadge.bgClass} ${activeBadge.colorClass} ${activeBadge.borderClass}`}
            >
              Classification: {activeBadge.label}
            </span>
            <span className="text-xs text-[#697586] font-medium">
              Citation Source: <strong>{activeBadge.citationType}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#704B91] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#704B91]" />
            <span>Verifiable Evidence Link</span>
          </div>
        </div>

        {/* Claim Text */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#89919D]">
            Extracted Project Claim
          </span>
          <p className="text-base sm:text-lg font-bold text-[#32164C] leading-snug">
            &ldquo;{activeBadge.sampleClaim}&rdquo;
          </p>
          <p className="text-xs text-[#697586]">
            {activeBadge.description}
          </p>
        </div>

        {/* Traceable Citation Box */}
        <div className="p-4 rounded-xl bg-[#FAF8FC] border border-[#E8E0EF] space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[#704B91] font-bold">
            <div className="flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5" />
              <span>{activeBadge.sourceRef}</span>
            </div>
            <span className="text-[10px] text-[#89919D] font-sans font-normal">
              Immutable Anchor
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-[#E8E0EF] text-slate-800 text-[11px] overflow-x-auto">
            <code>{activeBadge.rawQuote}</code>
          </div>
        </div>

        {/* Manager Action Strip */}
        <div className="pt-2 flex items-center justify-between text-xs text-[#697586]">
          <div>
            Governance Protocol:{' '}
            <strong className="text-[#32164C] font-semibold">{activeBadge.managerAction}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
