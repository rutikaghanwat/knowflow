import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  FileCheck2,
  ShieldCheck,
  Database,
  ArrowRightLeft,
  Settings,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  GitPullRequest,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const ProductPreviewMockup: React.FC = () => {
  return (
    <div className="relative mx-auto max-w-6xl w-full">
      {/* Outer Glow & Floating Shadow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#218653]/15 via-[#142640]/10 to-[#2F6B5D]/15 rounded-3xl blur-xl -z-10" />

      {/* Main Software Window Container */}
      <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl border border-[#E5EAE6] shadow-modal overflow-hidden text-left">
        {/* Window Chrome Title Bar */}
        <div className="h-11 bg-[#F5F7F6] border-b border-[#E5EAE6] px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#E2E8F0] border border-[#CBD5E1]" />
            <span className="w-3 h-3 rounded-full bg-[#E2E8F0] border border-[#CBD5E1]" />
            <span className="w-3 h-3 rounded-full bg-[#E2E8F0] border border-[#CBD5E1]" />
            <span className="hidden sm:inline-block text-[11px] font-medium text-[#687570] ml-3">
              KNOWFLOW Handover Engine • Interactive Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-[11px] font-mono text-[#2F6B5D] bg-white px-3 py-1 rounded-full border border-[#D0E3D9] flex items-center gap-1.5 shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-[#218653] animate-pulse" />
              <span>app.knowflow.io/workspace</span>
            </div>
            <Link
              to="/app/overview"
              className="text-[11px] font-semibold text-[#142640] hover:text-[#218653] flex items-center gap-1 px-2.5 py-1 rounded hover:bg-white transition-colors"
            >
              <span>Live Workspace</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Window Body: Reference Split Layout */}
        <div className="flex flex-col lg:flex-row min-h-[580px] bg-[#F5F7F6]">
          {/* 1. Left Navy Sidebar (Matching media reference) */}
          <div className="w-full lg:w-60 bg-[#142640] text-slate-300 p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-4">
              {/* Active Item: Emerald Pill */}
              <div className="bg-[#218653] text-white px-3.5 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2.5 shadow-pill">
                <LayoutDashboard className="w-4 h-4 text-white" />
                <span>Knowledge Workspace</span>
              </div>

              {/* Inactive Nav Links */}
              <div className="space-y-1 text-xs">
                <div className="px-3 py-2 rounded-lg flex items-center gap-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <FolderGit2 className="w-4 h-4 text-slate-400" />
                  <span>Projects</span>
                </div>
                <div className="px-3 py-2 rounded-lg flex items-center gap-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <Database className="w-4 h-4 text-slate-400" />
                  <span>Knowledge Sources</span>
                </div>
                <div className="px-3 py-2 rounded-lg flex items-center gap-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <span>AI Analysis</span>
                </div>
                <div className="px-3 py-2 rounded-lg flex items-center gap-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <FileCheck2 className="w-4 h-4 text-slate-400" />
                  <span>Handover Reports</span>
                </div>
                <div className="px-3 py-2 rounded-lg flex items-center gap-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Manager Approvals</span>
                  <span className="ml-auto bg-[#B7791F] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    2
                  </span>
                </div>
                <div className="px-3 py-2 rounded-lg flex items-center gap-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </div>
              </div>

              {/* Recent Active Handovers (Sub-block from screenshot) */}
              <div className="pt-2 border-t border-slate-700/60">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 pb-2">
                  Active Handovers
                </div>
                <div className="space-y-1 text-xs">
                  <div className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-slate-200 bg-white/5">
                    <span className="w-2 h-2 rounded-full bg-[#218653]" />
                    <span className="truncate">Core Payments & Ledger</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-slate-400 hover:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#28A766]" />
                    <span className="truncate">Mobile iOS & Android</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-slate-400 hover:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#B7791F]" />
                    <span className="truncate">Event Streaming v2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom New Handover Action */}
            <div className="pt-4 border-t border-slate-700/60">
              <button className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                <Plus className="w-3.5 h-3.5 text-[#28A766]" />
                <span>+ New Handover</span>
              </button>
            </div>
          </div>

          {/* 2. Main Content Canvas */}
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-x-auto">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-[#142640] tracking-tight">
                  Knowledge Continuity Overview
                </h3>
                <p className="text-xs text-[#687570]">
                  Welcome back, Sarah Lin (Project Manager) • 3 active handovers in progress
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8E9B96] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    readOnly
                    value="Search facts, ADRs, PRs..."
                    className="pl-8 pr-3 py-1.5 bg-white border border-[#E5EAE6] rounded-xl text-xs text-[#687570] w-48 shadow-subtle cursor-default"
                  />
                </div>
                <button className="p-2 bg-white border border-[#E5EAE6] rounded-xl text-[#687570] hover:text-[#142640] shadow-subtle">
                  <Filter className="w-3.5 h-3.5" />
                </button>
                <button className="bg-[#218653] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-pill flex items-center gap-1.5 hover:bg-[#1B6E44] transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Scope</span>
                </button>
              </div>
            </div>

            {/* Top Row Cards: 3 Cards directly reflecting reference visual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Active Projects / Handover Progress */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5EAE6] shadow-resting space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#142640]">Active Transitions</span>
                  <span className="text-[11px] font-medium text-[#2F6B5D] hover:underline cursor-pointer">
                    View all
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#142640]">Payments Architecture</span>
                      <span className="text-[11px] font-bold text-[#218653]">75%</span>
                    </div>
                    <div className="w-full bg-[#EBF7F0] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#218653] h-full rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#142640]">Mobile App iOS/Android</span>
                      <span className="text-[11px] font-bold text-[#218653]">60%</span>
                    </div>
                    <div className="w-full bg-[#EBF7F0] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#218653] h-full rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#142640]">Event Streaming Pipeline</span>
                      <span className="text-[11px] font-bold text-[#218653]">40%</span>
                    </div>
                    <div className="w-full bg-[#EBF7F0] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#218653] h-full rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Tasks Due & Evidence Classification */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5EAE6] shadow-resting space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#142640]">Evidence Verification</span>
                  <span className="text-[11px] font-medium text-[#2F6B5D] hover:underline cursor-pointer">
                    Audit log
                  </span>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="p-2 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#26734D]" />
                      <span className="font-medium text-[#142640]">Stripe Webhook Idempotency</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#26734D] bg-[#EBF7F0] px-2 py-0.5 rounded-full">
                      Verified Fact
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B7791F]" />
                      <span className="font-medium text-[#142640]">PgBouncer Pool Allocation</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#B7791F] bg-[#FEF7EB] px-2 py-0.5 rounded-full">
                      Recommendation
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B54747]" />
                      <span className="font-medium text-[#142640]">Legacy Auth Token Rotation</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#B54747] bg-[#FDF2F2] px-2 py-0.5 rounded-full">
                      Question
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Team Knowledge Coverage */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5EAE6] shadow-resting space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#142640]">Role Coverage</span>
                  <span className="text-[10px] text-[#687570] bg-[#F5F7F6] px-2 py-0.5 rounded-md border border-[#E5EAE6]">
                    This Week
                  </span>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#687570]">Backend Engineers</span>
                      <span className="font-bold text-[#218653]">94%</span>
                    </div>
                    <div className="w-full bg-[#EBF7F0] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#218653] h-full rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#687570]">Frontend Engineers</span>
                      <span className="font-bold text-[#218653]">85%</span>
                    </div>
                    <div className="w-full bg-[#EBF7F0] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#218653] h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#687570]">DevOps & Infrastructure</span>
                      <span className="font-bold text-[#218653]">65%</span>
                    </div>
                    <div className="w-full bg-[#EBF7F0] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#218653] h-full rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#687570]">Project Leadership</span>
                      <span className="font-bold text-[#218653]">100%</span>
                    </div>
                    <div className="w-full bg-[#EBF7F0] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#218653] h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row Cards: Handover Progress Donut + Activity Stream */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Handover Progress Metric (2 cols on md) */}
              <div className="md:col-span-1 bg-white p-4 rounded-2xl border border-[#E5EAE6] shadow-resting flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#142640]">Handover Completion</span>
                    <span className="text-[10px] font-mono font-semibold text-[#218653] bg-[#EBF7F0] px-2 py-0.5 rounded-full">
                      Step 7 of 10
                    </span>
                  </div>

                  <div className="flex items-center gap-4 my-2">
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#EBF7F0]"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#218653]"
                          strokeDasharray="75, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-base font-extrabold text-[#142640]">75%</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#218653]" />
                        <span className="text-[#687570]">42 Verified Facts</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2F6B5D]" />
                        <span className="text-[#687570]">16 AI Inferences</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#B7791F]" />
                        <span className="text-[#687570]">3 Flags to Resolve</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5EAE6] text-[11px] text-[#687570]">
                  Manager Status: <strong className="text-[#142640]">In Review by Sarah Lin</strong>
                </div>
              </div>

              {/* Recent Activity Stream (2 cols on md) */}
              <div className="md:col-span-2 bg-white p-4 rounded-2xl border border-[#E5EAE6] shadow-resting space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#142640]">Live Transition Log</span>
                  <span className="text-[11px] font-medium text-[#2F6B5D] hover:underline cursor-pointer">
                    Full history
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#EBF7F0] flex items-center justify-center text-[#218653]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#142640]">
                          Verified: Zero-downtime database migration strategy
                        </span>
                        <p className="text-[10px] text-[#8E9B96]">
                          Cited from <code>alembic/versions/94c_ledger.py</code> (Commit #4b92)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8E9B96] shrink-0">4m ago</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#E8F2ED] flex items-center justify-center text-[#2F6B5D]">
                        <GitPullRequest className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#142640]">
                          Indexed: 14 pull requests from departing lead
                        </span>
                        <p className="text-[10px] text-[#8E9B96]">
                          Extracted 19 decisions and 8 unresolved questions
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8E9B96] shrink-0">18m ago</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#FEF7EB] flex items-center justify-center text-[#B7791F]">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#142640]">
                          Document Parsed: Disaster-Recovery-Runbook-v4.docx
                        </span>
                        <p className="text-[10px] text-[#8E9B96]">
                          Extracted operational runbook for holiday traffic peak
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8E9B96] shrink-0">1h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
