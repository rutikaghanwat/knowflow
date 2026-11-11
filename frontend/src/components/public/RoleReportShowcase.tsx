import React, { useState } from 'react';
import {
  Server,
  Layout,
  Briefcase,
  Terminal,
  CheckCircle2,
  FileCode2,
  ArrowRight,
  ShieldAlert,
  GitBranch,
} from 'lucide-react';

interface RoleDossier {
  role: string;
  roleIcon: React.ElementType;
  headline: string;
  focusArea: string;
  summary: string;
  tailoredSections: {
    title: string;
    items: string[];
    highlightTag: string;
  }[];
}

const roleDossiers: RoleDossier[] = [
  {
    role: 'Backend Developer',
    roleIcon: Server,
    headline: 'Zero-Downtime APIs & Ledger Integrity Handover',
    focusArea: 'Data Models, Distributed Locks & Database Migrations',
    summary: 'Tailored specifically for incoming backend engineers. Omits front-end UI tasks and focuses strictly on database schema changes, Redis caching invalidation, and external API webhook contracts.',
    tailoredSections: [
      {
        title: 'Core Architecture & APIs',
        items: [
          'Two-phase commit validation on Stripe idempotency keys in Redis (PR #182)',
          'PgBouncer connection pooling guidelines for peak throughput events',
          'Alembic migration sequence 94c_ledger requiring backward-compatible column locks',
        ],
        highlightTag: 'System Contracts',
      },
      {
        title: 'Pending Risks & Technical Debt',
        items: [
          'Secondary region Redis failover dry-run pending (scheduled Sprint 28)',
          'Query optimization needed on user billing history aggregation query (>220ms)',
        ],
        highlightTag: 'Critical Blockers',
      },
    ],
  },
  {
    role: 'Frontend Developer',
    roleIcon: Layout,
    headline: 'Component Architecture & State Continuity Handover',
    focusArea: 'Design System Tokens, Client State & Bundle Optimization',
    summary: 'Tailored for incoming frontend developers. Filters out raw server infrastructure and highlights component token contracts, React query cache hydration, and responsive CSS token guidelines.',
    tailoredSections: [
      {
        title: 'Design System & Component Library',
        items: [
          'Design tokens synced from Figma: Forest green (#32164C) and active emerald (#704B91)',
          'Custom table virtualizer implementation for 1,000+ transaction rows',
          'Accessible keyboard trap handlers on all modal and slide-over components',
        ],
        highlightTag: 'UI Architecture',
      },
      {
        title: 'Client State & Hydration',
        items: [
          'Optimistic UI mutations implemented for task status updates',
          'Code-splitting vendor chunks in Vite to keep first-contentful paint under 400ms',
        ],
        highlightTag: 'Performance Standards',
      },
    ],
  },
  {
    role: 'Project Manager',
    roleIcon: Briefcase,
    headline: 'Project Status, Ownership & Milestone Governance Handover',
    focusArea: 'SLA Milestones, Ownership Matrix & Compliance Sign-Offs',
    summary: 'Tailored for project managers and tech leads. Filters out low-level code diffs and delivers milestone burndown, risk heatmaps, team responsibility mapping, and compliance checklists.',
    tailoredSections: [
      {
        title: 'Executive Milestone Status',
        items: [
          'Payments v2 rollout currently at 75% completion; Q4 deadline on schedule',
          'Departing lead Rutika Ghanwat responsibilities mapped to Marcus Vance',
          'Formal security audit scheduled with compliance board for Nov 20',
        ],
        highlightTag: 'Executive Tracking',
      },
      {
        title: 'Operational Risks & Blockers',
        items: [
          '1 unassigned dependency on third-party fraud gateway API credentials',
          '3 pending stakeholder approvals required from Infrastructure review board',
        ],
        highlightTag: 'Risk Governance',
      },
    ],
  },
  {
    role: 'DevOps Engineer',
    roleIcon: Terminal,
    headline: 'Infrastructure As Code & CI/CD Pipeline Handover',
    focusArea: 'Terraform Modules, Secrets Management & Kubernetes Rollouts',
    summary: 'Tailored for DevOps and site reliability engineers. Focuses on cluster auto-scaling thresholds, GitHub Actions workflows, Prometheus alerts, and zero-downtime rollback procedures.',
    tailoredSections: [
      {
        title: 'Cloud Infrastructure & Deployments',
        items: [
          'Kubernetes blue-green deployment pipeline configured via GitHub Actions',
          'Secret injection handled via HashiCorp Vault agent with short-lived tokens',
          'EKS cluster autoscaler tuned for minimum 4 nodes, maximum 20 during bursts',
        ],
        highlightTag: 'Infrastructure State',
      },
      {
        title: 'Observability & Runbooks',
        items: [
          'Disaster recovery runbook updated with 4-step database snapshot recovery drill',
          'Prometheus alert rule: trigger PagerDuty if payment 5xx error rate exceeds 0.2%',
        ],
        highlightTag: 'SRE Reliability',
      },
    ],
  },
];

export const RoleReportShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Backend Developer');
  const currentDossier = roleDossiers.find(d => d.role === activeTab) || roleDossiers[0];
  const Icon = currentDossier.roleIcon;

  return (
    <div className="space-y-6">
      {/* Role Pill Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {roleDossiers.map(dossier => {
          const isSelected = activeTab === dossier.role;
          const DossierIcon = dossier.roleIcon;
          return (
            <button
              key={dossier.role}
              onClick={() => setActiveTab(dossier.role)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                isSelected
                  ? 'bg-[#32164C] text-white border-[#32164C] shadow-resting scale-105'
                  : 'bg-white text-[#697586] border-[#E8E0EF] hover:border-slate-300 hover:text-[#32164C]'
              }`}
            >
              <DossierIcon
                className={`w-3.5 h-3.5 ${isSelected ? 'text-[#BDA4D2]' : 'text-[#697586]'}`}
              />
              <span>{dossier.role}</span>
            </button>
          );
        })}
      </div>

      {/* Role Handover Dossier Preview Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E0EF] p-6 sm:p-8 shadow-resting space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E0EF]">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F2EDF8] text-[#704B91] flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-[#704B91] bg-[#F2EDF8] px-2.5 py-0.5 rounded-full border border-[#E4D9EF]">
                  {currentDossier.role} Handover Dossier
                </span>
                <span className="text-[11px] font-medium text-[#697586]">
                  Filtered by Role Relevance
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#32164C] font-heading tracking-tight">
                {currentDossier.headline}
              </h3>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="text-[#89919D] uppercase text-[10px] font-bold tracking-wider block">
              Core Focus
            </span>
            <span className="font-semibold text-[#32164C]">{currentDossier.focusArea}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#697586] leading-relaxed">
          {currentDossier.summary}
        </p>

        {/* Tailored Findings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentDossier.tailoredSections.map((sec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#FAF8FC] border border-[#E8E0EF] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#32164C] font-heading">
                  {sec.title}
                </h4>
                <span className="text-[10px] font-bold text-[#704B91] bg-white px-2 py-0.5 rounded-full border border-[#E8E0EF]">
                  {sec.highlightTag}
                </span>
              </div>

              <ul className="space-y-2">
                {sec.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-xs text-[#202B28]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#704B91] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
