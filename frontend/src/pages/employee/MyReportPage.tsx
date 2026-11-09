import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Download,
  ExternalLink,
  GitCommit,
  FileText,
  Lock,
  ChevronRight,
  X,
  Printer,
  Calendar,
  User,
  AlertOctagon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockHandoverReport } from '../../data/mockData';
import { HandoverReport, EvidenceItem } from '../../types';

export const MyReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const report: HandoverReport = mockHandoverReport; // Core payments report for Marcus Vance

  const [activeTab, setActiveTab] = useState<
    'summary' | 'tasks' | 'decisions' | 'responsibilities' | 'risks' | 'questions' | 'actions'
  >('summary');
  const [selectedEvidence, setSelectedEvidence] = useState<{
    claim: string;
    sourceRef: string;
    quote: string;
    confidence: number;
    type: string;
  } | null>(null);

  const [isAccessRevoked, setIsAccessRevoked] = useState(false);

  // Access revoked state per Section 4
  if (isAccessRevoked) {
    return (
      <div className="bg-white rounded-3xl border border-[#E5EAE6] p-12 text-center max-w-md mx-auto shadow-resting my-12 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] text-[#B54747] flex items-center justify-center mx-auto border border-[#F8C8C8]">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#142640] font-heading">
          Handover Report Access Unavailable
        </h2>
        <p className="text-xs text-[#687570] leading-relaxed">
          Access to this handover dossier has concluded or been revoked by your project administrator.
          No report contents are accessible.
        </p>
        <button
          onClick={() => navigate('/app/overview')}
          className="px-5 py-2 rounded-full bg-[#142640] text-white text-xs font-bold"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Report Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAE6]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                {report.version}
              </span>
              <span className="text-xs font-bold text-[#142640] bg-slate-100 px-2.5 py-0.5 rounded-full">
                Target Role: {report.targetRole}
              </span>
              <span className="text-xs font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                Manager Approved
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
              {report.title}
            </h1>
            <p className="text-xs text-[#687570] mt-1">
              Departing Lead: <strong>{report.departingMember.name}</strong> &rarr; Incoming Engineer:{' '}
              <strong>{report.incomingMember.name}</strong> &bull; Reviewed by: <strong>{report.manager.name}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-full border border-[#E5EAE6] text-xs font-bold text-[#142640] hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-subtle"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
            <button
              onClick={() => navigate('/app/acknowledgement')}
              className="px-5 py-2 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Acknowledge</span>
            </button>
          </div>
        </div>

        {/* Verification Summary Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Verified Facts
            </span>
            <strong className="text-lg font-extrabold text-[#26734D] font-heading">
              {report.verifiedFactsCount}
            </strong>
          </div>

          <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              AI Inferences
            </span>
            <strong className="text-lg font-extrabold text-[#2F6B5D] font-heading">
              {report.aiInferencesCount}
            </strong>
          </div>

          <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Recommendations
            </span>
            <strong className="text-lg font-extrabold text-[#B7791F] font-heading">
              {report.recommendationsCount}
            </strong>
          </div>

          <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Confidence Score
            </span>
            <strong className="text-lg font-extrabold text-[#142640] font-heading">
              {report.roleRelevanceScore}%
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Seven Tabbed Sections per spec */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'summary', label: 'Summary' },
          { key: 'tasks', label: 'Tasks' },
          { key: 'decisions', label: 'Decisions' },
          { key: 'responsibilities', label: 'Responsibilities' },
          { key: 'risks', label: 'Risks & Blockers' },
          { key: 'questions', label: 'Unresolved Questions' },
          { key: 'actions', label: 'Next Actions' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeTab === tab.key
                ? 'bg-[#142640] text-white shadow-resting'
                : 'bg-white text-[#687570] border border-[#E5EAE6] hover:text-[#142640] hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Tab Content Presentation */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-6">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#142640] font-heading">
              Executive Architecture Summary
            </h3>
            <p className="text-xs sm:text-sm text-[#202B28] leading-relaxed">
              {report.summary}
            </p>
            <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-2 text-xs">
              <span className="font-bold text-[#142640] block">Access Boundary Clearance</span>
              <p className="text-[#687570] leading-relaxed">
                This report contains only items cleared for your technical scope as a Backend Engineer on the Payments team.
                Production credentials and unapproved executive roadmaps have been filtered out by the permission engine.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#142640] font-heading">
              Completed & Pending Engineering Work
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#26734D] bg-[#EBF7F0] px-2 py-0.5 rounded-full border border-[#C3E7D3]">
                      Verified Fact
                    </span>
                    <strong className="text-xs text-[#142640]">
                      Stripe Idempotent Webhook Consumer (PR #182)
                    </strong>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedEvidence({
                        claim: 'Two-phase lockless validation on Stripe checkout webhooks to eliminate duplicate charges.',
                        sourceRef: 'PR #182 • commit f49c12b',
                        quote: 'export const processIdempotentCharge = async (eventId: string, payload: WebhookPayload) => ...',
                        confidence: 1.0,
                        type: 'Verified Fact',
                      })
                    }
                    className="text-[11px] font-bold text-[#218653] hover:underline flex items-center gap-1"
                  >
                    <span>View Evidence</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-[#687570] leading-relaxed">
                  Status: Completed and deployed to production. Redis TTL lock set to 300 seconds to prevent race conditions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#B7791F] bg-[#FEF7EB] px-2 py-0.5 rounded-full border border-[#F6DEB5]">
                      Pending Task
                    </span>
                    <strong className="text-xs text-[#142640]">
                      Alembic Migration 94c_ledger Zero-Downtime Rollout
                    </strong>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedEvidence({
                        claim: 'Database migration script requiring lock timeouts to prevent PostgreSQL table deadlocks during deployment.',
                        sourceRef: 'alembic/versions/94c_ledger.py',
                        quote: 'op.execute("SET LOCAL lock_timeout = \'2s\';")',
                        confidence: 0.95,
                        type: 'Recommendation',
                      })
                    }
                    className="text-[11px] font-bold text-[#218653] hover:underline flex items-center gap-1"
                  >
                    <span>View Evidence</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-[#687570] leading-relaxed">
                  Status: Staging verified. Scheduled for off-peak production execution during Sprint 28 window.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#142640] font-heading">
              Key Technical Decisions & Reasoning
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#142640]">
                    ADR-041: Redis Streams Chosen Over AWS SQS
                  </span>
                  <button
                    onClick={() =>
                      setSelectedEvidence({
                        claim: 'Sub-millisecond ledger event ordering and deduplication required Redis Streams.',
                        sourceRef: 'Core-Payments-Idempotency-ADR-041.pdf (p. 3)',
                        quote: 'Benchmarked SQS latency: 45ms avg. Redis Streams in VPC: 1.2ms with guaranteed sequence offset.',
                        confidence: 0.94,
                        type: 'Verified Fact',
                      })
                    }
                    className="text-[11px] font-bold text-[#218653] hover:underline flex items-center gap-1"
                  >
                    <span>View Evidence</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-[#687570]">
                  <strong>Reasoning:</strong> SQS FIFO queue latency exceeded the 50ms SLA requirement for instant checkout confirmations.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'responsibilities' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#142640] font-heading">
              Service Ownership & Operational Access
            </h3>
            <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#142640]">Transferred Services:</span>
                <span className="font-mono text-[#218653] font-bold">payments-worker, ledger-sync, stripe-listener</span>
              </div>
              <p className="text-[#687570]">
                Marcus Vance has been provisioned as CODEOWNER on GitHub and assigned PagerDuty secondary escalation rotation.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#142640] font-heading">
              Risks, Blockers & Technical Debt
            </h3>
            <div className="p-4 rounded-2xl bg-[#FEF7EB] border border-[#F6DEB5] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#B7791F]">
                <strong className="font-bold">PgBouncer Connection Exhaustion Risk</strong>
                <span className="font-bold text-[10px] bg-white px-2 py-0.5 rounded-full">High Priority</span>
              </div>
              <p className="text-[#687570]">
                Holiday shopping traffic burst may saturate the default 120 client connections.
                Recommended action: scale limit to 300 connections prior to Cyber Week.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#142640] font-heading">
              Unresolved Questions & Clarifications
            </h3>
            <div className="p-4 rounded-2xl bg-[#FDF2F2] border border-[#F8C8C8] space-y-2 text-xs">
              <strong className="text-[#B54747] font-bold block">
                Fraud API Webhook HMAC Signing Secret
              </strong>
              <p className="text-[#687570]">
                Rutika's clarification note: HMAC signing keys rotate quarterly via 1Password vault "Payments-Infra".
                Marcus Vance's vault invitation is pending acceptance.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#142640] font-heading">
              Recommended Next Actions for Marcus Vance
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F7F6]">
                <CheckCircle2 className="w-4 h-4 text-[#218653]" />
                <span>Accept 1Password "Payments-Infra" vault invitation from Sarah Lin</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F7F6]">
                <CheckCircle2 className="w-4 h-4 text-[#218653]" />
                <span>Run dry-run migration test for Alembic 94c_ledger on staging database</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F7F6]">
                <CheckCircle2 className="w-4 h-4 text-[#218653]" />
                <span>Sign digital acknowledgment to formalize transfer ownership</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/app/acknowledgement')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill"
              >
                Proceed to Transfer Acknowledgment &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Evidence Slide-Over Drawer */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-[#142640]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedEvidence(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-modal flex flex-col justify-between p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE6]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                    {selectedEvidence.type}
                  </span>
                  <button
                    onClick={() => setSelectedEvidence(null)}
                    className="p-1 rounded-lg text-[#687570] hover:text-[#142640]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96]">
                    Handover Claim
                  </span>
                  <h3 className="text-base font-bold text-[#142640]">
                    &ldquo;{selectedEvidence.claim}&rdquo;
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-[#2F6B5D] font-bold">
                    <div className="flex items-center gap-1.5">
                      <GitCommit className="w-3.5 h-3.5" />
                      <span>{selectedEvidence.sourceRef}</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#E5EAE6] text-slate-800 text-[11px] overflow-x-auto">
                    <code>{selectedEvidence.quote}</code>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvidence(null)}
                className="w-full py-2 rounded-full border border-[#E5EAE6] text-xs font-bold text-[#687570] hover:bg-slate-50"
              >
                Close Evidence Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
