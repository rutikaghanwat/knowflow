import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockHandovers } from '../../data/mockData';

export const IncomingOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, activeHandover } = useAuth();
  const firstName = currentUser.name.split(' ')[0];

  const handover = activeHandover || mockHandovers[0];
  const isReportShared = handover.status === 'in_review' || handover.status === 'approved' || handover.status === 'completed';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7F0] text-[#218653] border border-[#C3E7D3] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Incoming Contributor Workspace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
          Welcome, {firstName}.
        </h1>
        <p className="text-xs sm:text-sm text-[#687570] max-w-2xl leading-relaxed">
          You have been designated as the incoming technical owner for <strong>{handover.projectName}</strong>.
          Your handover report contains verified architectural decisions, runbook citations, and role-tailored actions.
        </p>
      </div>

      {/* 2. Handover Status Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAE6]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Handover Dossier
            </span>
            <h2 className="text-xl font-extrabold text-[#142640] font-heading">
              {handover.projectName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#218653] bg-[#EBF7F0] px-3 py-1 rounded-full border border-[#C3E7D3]">
              Role: {handover.targetRole}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Outgoing Member
            </span>
            <div className="flex items-center gap-2 mt-1">
              <User className="w-4 h-4 text-[#B7791F]" />
              <strong className="text-[#142640] text-sm">{handover.departingMember.name}</strong>
            </div>
            <span className="text-[11px] text-[#687570]">Staff Platform Lead</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Reviewing Manager
            </span>
            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck className="w-4 h-4 text-[#218653]" />
              <strong className="text-[#142640] text-sm">{handover.reviewer.name}</strong>
            </div>
            <span className="text-[11px] text-[#687570]">Project Lead & Admin</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Verification Score
            </span>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4 text-[#218653]" />
              <strong className="text-[#142640] text-sm">96% Confidence</strong>
            </div>
            <span className="text-[11px] text-[#687570]">42 Verified Facts</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          {isReportShared ? (
            <div className="p-4 rounded-2xl bg-[#EBF7F0] border border-[#C3E7D3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <strong className="text-sm font-bold text-[#142640] block">
                  Your Handover Report Is Ready to Review
                </strong>
                <p className="text-xs text-[#2F6B5D] mt-0.5">
                  Sarah Lin has audited the evidence and authorized your role-specific handover briefing.
                </p>
              </div>

              <button
                onClick={() => navigate('/app/my-report')}
                className="px-6 py-2.5 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-colors flex items-center gap-2 shrink-0 active:scale-95"
              >
                <span>Open Handover Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FEF7EB] border border-[#F6DEB5] text-xs text-[#B7791F] flex items-center gap-3">
              <Clock className="w-5 h-5 shrink-0" />
              <div>
                <strong>Report in Preparation:</strong> Your handover report is being prepared and reviewed by your manager (Sarah Lin).
                You will be notified as soon as it is approved for release.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Onboarding Quick Checklist */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
        <h3 className="text-base font-extrabold text-[#142640] font-heading">
          Your Onboarding Pathway
        </h3>

        <div className="space-y-3">
          <div
            onClick={() => navigate('/app/my-report')}
            className="p-4 rounded-2xl bg-[#F5F7F6] hover:bg-white border border-[#E5EAE6] transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EBF7F0] text-[#218653] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <div>
                <strong className="text-xs text-[#142640] block">Review Handover Findings</strong>
                <span className="text-[11px] text-[#687570]">Inspect tasks, architecture decisions, and database migration notes</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#687570]" />
          </div>

          <div
            onClick={() => navigate('/app/permitted-evidence')}
            className="p-4 rounded-2xl bg-[#F5F7F6] hover:bg-white border border-[#E5EAE6] transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EBF7F0] text-[#218653] flex items-center justify-center font-bold text-xs">
                02
              </div>
              <div>
                <strong className="text-xs text-[#142640] block">Verify Permitted Evidence & Runbooks</strong>
                <span className="text-[11px] text-[#687570]">Trace claims back to specific commits, PRs, and PgBouncer runbooks</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#687570]" />
          </div>

          <div
            onClick={() => navigate('/app/acknowledgement')}
            className="p-4 rounded-2xl bg-[#F5F7F6] hover:bg-white border border-[#E5EAE6] transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EBF7F0] text-[#218653] flex items-center justify-center font-bold text-xs">
                03
              </div>
              <div>
                <strong className="text-xs text-[#142640] block">Acknowledge Knowledge Transfer</strong>
                <span className="text-[11px] text-[#687570]">Complete verification checklist and digitally sign transfer acknowledgment</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#687570]" />
          </div>
        </div>
      </div>
    </div>
  );
};
