import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockHandovers, mockProjects, mockApprovals } from '../data/mockData';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('This Week');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Toolbar: Headline, Search, Filter, Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
            Knowledge Continuity Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#687570] mt-0.5">
            Welcome back, {currentUser.name} ({currentUser.role}) &bull; 3 active handovers in progress
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8E9B96] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search facts, ADRs, PRs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 bg-white border border-[#E5EAE6] rounded-xl text-xs text-[#142640] w-48 sm:w-56 shadow-subtle focus:border-[#218653] focus:ring-1 focus:ring-[#218653]"
            />
          </div>

          <button
            onClick={() => navigate('/app/analysis')}
            className="p-2 bg-white border border-[#E5EAE6] rounded-xl text-[#687570] hover:text-[#142640] shadow-subtle hover:bg-slate-50 transition-colors"
            title="Filter by category"
          >
            <Filter className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/app/handovers')}
            className="bg-[#218653] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-pill flex items-center gap-1.5 hover:bg-[#1B6E44] transition-all duration-150 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Scope</span>
          </button>
        </div>
      </div>

      {/* Top Row: 3 Equal Rounded Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Active Transitions */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#142640] font-heading">Active Transitions</h3>
            <button
              onClick={() => navigate('/app/handovers')}
              className="text-xs font-semibold text-[#2F6B5D] hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-3.5 pt-1">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#142640]">Payments Architecture</span>
                <span className="text-[11px] font-bold text-[#218653]">75%</span>
              </div>
              <div className="w-full bg-[#EBF7F0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#218653] h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#142640]">Mobile App iOS/Android</span>
                <span className="text-[11px] font-bold text-[#218653]">60%</span>
              </div>
              <div className="w-full bg-[#EBF7F0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#218653] h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#142640]">Event Streaming Pipeline</span>
                <span className="text-[11px] font-bold text-[#218653]">40%</span>
              </div>
              <div className="w-full bg-[#EBF7F0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#218653] h-full rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Evidence Verification */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#142640] font-heading">Evidence Verification</h3>
            <button
              onClick={() => navigate('/app/evidence')}
              className="text-xs font-semibold text-[#2F6B5D] hover:underline"
            >
              Audit log
            </button>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            <div
              onClick={() => navigate('/app/evidence')}
              className="p-2.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#26734D]" />
                <span className="font-medium text-[#142640]">Stripe Webhook Idempotency</span>
              </div>
              <span className="text-[10px] font-bold text-[#26734D] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                Verified Fact
              </span>
            </div>

            <div
              onClick={() => navigate('/app/evidence')}
              className="p-2.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B7791F]" />
                <span className="font-medium text-[#142640]">PgBouncer Pool Allocation</span>
              </div>
              <span className="text-[10px] font-bold text-[#B7791F] bg-[#FEF7EB] px-2.5 py-0.5 rounded-full border border-[#F6DEB5]">
                Recommendation
              </span>
            </div>

            <div
              onClick={() => navigate('/app/evidence')}
              className="p-2.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B54747]" />
                <span className="font-medium text-[#142640]">Legacy Auth Token Rotation</span>
              </div>
              <span className="text-[10px] font-bold text-[#B54747] bg-[#FDF2F2] px-2.5 py-0.5 rounded-full border border-[#F8C8C8]">
                Question
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Role Coverage */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#142640] font-heading">Role Coverage</h3>
            <span className="text-[10px] text-[#687570] bg-[#F5F7F6] px-2.5 py-0.5 rounded-full border border-[#E5EAE6] font-semibold">
              {timeFilter}
            </span>
          </div>

          <div className="space-y-3 pt-1">
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

      {/* Bottom Row: Handover Completion Donut + Live Transition Log */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Handover Completion Donut */}
        <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-[#E5EAE6] shadow-resting flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#142640] font-heading">Handover Completion</h3>
              <span className="text-[10px] font-mono font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                Step 7 of 10
              </span>
            </div>

            <div className="flex items-center gap-5 my-3">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
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
                  <span className="text-xl font-extrabold text-[#142640] font-heading">75%</span>
                  <span className="text-[9px] uppercase font-bold text-[#8E9B96] block -mt-1">
                    Complete
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#218653]" />
                  <span className="text-[#687570] font-medium">42 Verified Facts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2F6B5D]" />
                  <span className="text-[#687570] font-medium">16 AI Inferences</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B7791F]" />
                  <span className="text-[#687570] font-medium">3 Flags to Resolve</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5EAE6] text-xs text-[#687570] flex items-center justify-between">
            <span>
              Manager Status: <strong className="text-[#142640]">In Review by Sarah Lin</strong>
            </span>
            <button
              onClick={() => navigate('/app/approvals')}
              className="text-[#218653] font-bold hover:underline"
            >
              Review &rarr;
            </button>
          </div>
        </div>

        {/* Live Transition Log */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5EAE6]">
            <h3 className="text-sm font-bold text-[#142640] font-heading">Live Transition Log</h3>
            <button
              onClick={() => navigate('/app/handovers')}
              className="text-xs font-semibold text-[#2F6B5D] hover:underline"
            >
              Full history
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EBF7F0] flex items-center justify-center text-[#218653] shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#142640] block">
                    Verified: Zero-downtime database migration strategy
                  </span>
                  <p className="text-[11px] text-[#8E9B96]">
                    Cited from <code>alembic/versions/94c_ledger.py</code> (Commit #4b92)
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-[#8E9B96] shrink-0">4m ago</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E8F2ED] flex items-center justify-center text-[#2F6B5D] shrink-0">
                  <GitPullRequest className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#142640] block">
                    Indexed: 14 pull requests from departing lead (Rutika Ghanwat)
                  </span>
                  <p className="text-[11px] text-[#8E9B96]">
                    Extracted 19 decisions and 8 unresolved questions
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-[#8E9B96] shrink-0">18m ago</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FEF7EB] flex items-center justify-center text-[#B7791F] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#142640] block">
                    Document Parsed: Disaster-Recovery-Runbook-v4.docx
                  </span>
                  <p className="text-[11px] text-[#8E9B96]">
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
  );
};
