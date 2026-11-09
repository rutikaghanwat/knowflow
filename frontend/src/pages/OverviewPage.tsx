import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FolderGit2,
  FileCheck2,
  ShieldCheck,
  Users,
  Layers,
  ArrowRightLeft,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  GitPullRequest,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockHandovers, mockProjects, mockApprovals, mockTeamMembers } from '../data/mockData';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('This Week');

  // Greeting by time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeProjectsCount = mockProjects.length;
  const activeHandoversCount = mockHandovers.length;
  const pendingApprovalsCount = mockApprovals.filter(a => a.status === 'pending').length;
  const teamMembersCount = mockTeamMembers.length;

  // Empty state for new manager
  const isNewManager = activeProjectsCount === 0;

  if (isNewManager) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#EBF7F0] text-[#218653] flex items-center justify-center mx-auto shadow-subtle">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
            Welcome to KNOWFLOW
          </h1>
          <p className="text-sm text-[#687570] max-w-md mx-auto leading-relaxed">
            Your workspace is ready. Start by creating your first project and inviting your engineering team.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate('/app/projects')}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#218653] text-white text-xs font-bold shadow-pill hover:bg-[#1B6E44] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Project</span>
          </button>
          <Link
            to="/app/team"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-[#E5EAE6] text-[#142640] text-xs font-bold hover:bg-[#F5F7F6] transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-[#218653]" />
            <span>Invite Team Members</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Toolbar: Greeting by Time of Day + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
            Knowledge Continuity Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#687570] mt-0.5">
            {getGreeting()}, {currentUser.name} ({currentUser.role}) &bull; {activeHandoversCount} active transitions in progress
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8E9B96] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search facts, ADRs, PRs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 bg-white border border-[#E5EAE6] rounded-xl text-xs text-[#142640] w-44 sm:w-52 shadow-subtle focus:border-[#218653] focus:ring-1 focus:ring-[#218653]"
            />
          </div>

          <button
            onClick={() => navigate('/app/projects')}
            className="px-3.5 py-2 bg-white border border-[#E5EAE6] rounded-xl text-xs font-bold text-[#142640] hover:bg-[#F5F7F6] transition-all flex items-center gap-1.5 shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5 text-[#218653]" />
            <span>New Project</span>
          </button>

          <button
            onClick={() => navigate('/app/handovers')}
            className="bg-[#218653] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-pill flex items-center gap-1.5 hover:bg-[#1B6E44] transition-all duration-150 active:scale-95"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Initiate Handover</span>
          </button>
        </div>
      </div>

      {/* Row 1: Four Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/app/projects')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle hover:border-[#218653] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#687570] font-medium">Active Projects</span>
            <div className="w-8 h-8 rounded-xl bg-[#EBF7F0] text-[#218653] flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#142640] font-heading mt-2">
            {activeProjectsCount}
          </p>
          <span className="text-[10px] text-[#218653] font-semibold mt-1 block">
            Across 2 repositories
          </span>
        </div>

        <div
          onClick={() => navigate('/app/handovers')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle hover:border-[#218653] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#687570] font-medium">Active Handovers</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F2ED] text-[#2F6B5D] flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#142640] font-heading mt-2">
            {activeHandoversCount}
          </p>
          <span className="text-[10px] text-[#2F6B5D] font-semibold mt-1 block">
            1 nearing completion
          </span>
        </div>

        <div
          onClick={() => navigate('/app/approvals')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle hover:border-[#218653] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#687570] font-medium">Pending Approvals</span>
            <div className="w-8 h-8 rounded-xl bg-[#FEF7EB] text-[#B7791F] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#142640] font-heading mt-2">
            {pendingApprovalsCount}
          </p>
          <span className="text-[10px] text-[#B7791F] font-semibold mt-1 block">
            Requires manager sign-off
          </span>
        </div>

        <div
          onClick={() => navigate('/app/team')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle hover:border-[#218653] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#687570] font-medium">Team Members</span>
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#142640] font-heading mt-2">
            {teamMembersCount}
          </p>
          <span className="text-[10px] text-[#2563EB] font-semibold mt-1 block">
            2 pending invitations
          </span>
        </div>
      </div>

      {/* Row 2: Active Projects, Handover Status, Team Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Active Projects */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#142640] font-heading">Active Projects</h3>
            <button
              onClick={() => navigate('/app/projects')}
              className="text-xs font-semibold text-[#218653] hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-3.5 pt-1">
            {mockProjects.slice(0, 4).map((p, idx) => {
              const projectProgress = [75, 60, 40, 20][idx % 4];
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#142640] truncate max-w-[200px]">{p.name}</span>
                    <span className="text-[11px] font-bold text-[#218653]">{projectProgress}%</span>
                  </div>
                  <div className="w-full bg-[#EBF7F0] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#218653] h-full rounded-full transition-all duration-300" style={{ width: `${projectProgress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Handover Status (Outgoing to Incoming, Stage, Status) */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#142640] font-heading">Handover Status</h3>
            <button
              onClick={() => navigate('/app/handovers')}
              className="text-xs font-semibold text-[#218653] hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            {mockHandovers.map((h) => (
              <div
                key={h.id}
                onClick={() => navigate('/app/handovers')}
                className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] hover:bg-slate-50 transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#142640] truncate">{h.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    h.status === 'in_review'
                      ? 'bg-[#EBF7F0] text-[#218653] border-[#C3E7D3]'
                      : 'bg-[#FEF7EB] text-[#B7791F] border-[#FCE2B6]'
                  }`}>
                    {h.status === 'in_review' ? 'Step 7 of 10' : 'In Review'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#687570]">
                  <span>{h.departingMember.name} &rarr; {h.incomingMember.name}</span>
                  <span className="font-semibold text-[#218653]">{h.progressPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Team Workload */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#142640] font-heading">Team Coverage</h3>
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

      {/* Row 3: Handover Progress Donut + Recent Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Handover Progress Donut */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5EAE6] shadow-resting flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#142640] font-heading">Handover Progress</h3>
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

        {/* Recent Activity Log (Real events only per prompt) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5EAE6]">
            <h3 className="text-sm font-bold text-[#142640] font-heading">Recent Handover Events</h3>
            <button
              onClick={() => navigate('/app/audit')}
              className="text-xs font-semibold text-[#218653] hover:underline"
            >
              Full audit log &rarr;
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
                    Report Acknowledged: Marcus Vance digitally confirmed Core Payments handover
                  </span>
                  <p className="text-[11px] text-[#8E9B96]">
                    7/7 checklist items verified &bull; Digital signature recorded
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-[#8E9B96] shrink-0 font-mono">14:15 IST</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E8F2ED] flex items-center justify-center text-[#2F6B5D] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#142640] block">
                    Report Approved: Sarah Lin authorized release of Core Payments dossier
                  </span>
                  <p className="text-[11px] text-[#8E9B96]">
                    Approved for Marcus Vance with Backend Role filter
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-[#8E9B96] shrink-0 font-mono">Nov 4</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FEF7EB] flex items-center justify-center text-[#B7791F] shrink-0">
                  <GitPullRequest className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#142640] block">
                    Sources Submitted: Rutika Ghanwat submitted 6 runbooks and code citations
                  </span>
                  <p className="text-[11px] text-[#8E9B96]">
                    Ready for managerial review and gap verification
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-[#8E9B96] shrink-0 font-mono">Nov 3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
