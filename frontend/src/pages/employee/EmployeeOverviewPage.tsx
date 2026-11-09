import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  FileText,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FolderGit2,
  Sparkles,
  GitBranch,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Stepper, StepItem } from '../../components/ui/Stepper';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { defaultHandoverSteps } from '../../data/mockData';

export const EmployeeOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, activeHandover } = useAuth();
  const isDeparting = currentUser.perspective === 'departing';
  const isIncoming = currentUser.perspective === 'incoming';

  const stepperItems: StepItem[] = defaultHandoverSteps.map((s) => ({
    id: s.stepNumber,
    label: s.title,
    description: s.description,
    isCompleted: s.status === 'completed',
    isActive: s.status === 'in_progress',
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5EAE6] shadow-resting space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7F0] text-[#218653] border border-[#C3E7D3]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isDeparting ? 'Departing Contributor Portal' : 'Incoming Contributor Portal'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#687570]">
              Active Transition: <strong className="text-[#142640]">{currentUser.activeProjectName}</strong>
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isDeparting ? (
              <button
                onClick={() => navigate('/employee/handover/upload')}
                className="px-5 py-2.5 rounded-full bg-[#218653] text-white text-xs font-bold shadow-pill hover:bg-[#1B6E44] transition-all flex items-center gap-2 active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Runbooks</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/employee/report')}
                className="px-5 py-2.5 rounded-full bg-[#218653] text-white text-xs font-bold shadow-pill hover:bg-[#1B6E44] transition-all flex items-center gap-2 active:scale-95"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Open Handover Report</span>
              </button>
            )}
          </div>
        </div>

        {/* 10-Step Handover Lifecycle Progression Tracker */}
        <div className="pt-6 border-t border-[#E5EAE6] space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#142640]">
            <span>Handover Lifecycle Progress</span>
            <span className="text-[#218653] font-mono">Step 7 of 10 &bull; Manager Review</span>
          </div>
          <Stepper steps={stepperItems} currentStepIndex={6} />
        </div>
      </div>

      {/* Contextual Assignment Card */}
      {isDeparting && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Handover Checklist */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#142640] font-heading">
                My Handover Checklist
              </h2>
              <span className="text-xs font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                2 of 3 Done
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EBF7F0] text-[#218653] flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#142640] block">Upload Technical Documents</span>
                    <span className="text-[11px] text-[#687570]">6 PDF/DOCX runbooks and architecture specs contributed</span>
                  </div>
                </div>
                <Link to="/employee/handover/files" className="text-[#218653] font-bold hover:underline">
                  View &rarr;
                </Link>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EBF7F0] text-[#218653] flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#142640] block">Authorize GitHub Commit Sync</span>
                    <span className="text-[11px] text-[#687570]">Read-only sync linked to <code>knowflow/core-ledger</code></span>
                  </div>
                </div>
                <span className="text-xs text-[#218653] font-semibold">Authorized</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FEF7EB] border border-[#FCE2B6] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#B7791F] text-white flex items-center justify-center font-bold">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#142640] block">Review Clarifications & Submit</span>
                    <span className="text-[11px] text-[#687570]">1 unresolved question awaiting your optional notes</span>
                  </div>
                </div>
                <Link to="/employee/handover/review" className="text-[#B7791F] font-bold hover:underline">
                  Clarify &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Handover Summary Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#687570]">
                Assignment Scope
              </span>
              <h3 className="text-lg font-bold text-[#142640] font-heading">
                Backend Lead Transition
              </h3>
              <p className="text-xs text-[#687570] leading-relaxed">
                You are offboarding from <strong>Core Payments & Ledger Migration</strong>. Handover is being prepared for incoming maintainer <strong>Marcus Vance</strong>.
              </p>
              <div className="pt-2 text-xs space-y-1.5 text-[#687570]">
                <div className="flex justify-between">
                  <span>Manager:</span>
                  <strong className="text-[#142640]">Sarah Lin</strong>
                </div>
                <div className="flex justify-between">
                  <span>Target Date:</span>
                  <strong className="text-[#142640]">Nov 15, 2026</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5EAE6]">
              <Link
                to="/employee/handover/upload"
                className="w-full py-2.5 rounded-full border border-[#E5EAE6] hover:bg-[#F5F7F6] text-[#142640] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span>Upload More Files</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Incoming Member Perspective */}
      {isIncoming && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#142640] font-heading">
                Handover Dossier Status
              </h2>
              <span className="text-xs font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                Manager Approved
              </span>
            </div>

            <p className="text-xs text-[#687570] leading-relaxed">
              Your customized handover briefing for <strong>Core Payments & Ledger Migration</strong> has been compiled by AI analysis and formally authorized by Project Manager <strong>Sarah Lin</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
                <span className="text-[#687570] text-[11px] block">Verified Facts</span>
                <strong className="text-lg font-bold text-[#218653]">42</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
                <span className="text-[#687570] text-[11px] block">Decisions & ADRs</span>
                <strong className="text-lg font-bold text-[#142640]">8</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
                <span className="text-[#687570] text-[11px] block">Pending Checkpoints</span>
                <strong className="text-lg font-bold text-[#B7791F]">1</strong>
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                onClick={() => navigate('/employee/report')}
                className="px-5 py-2.5 rounded-full bg-[#218653] text-white text-xs font-bold hover:bg-[#1B6E44] transition-all flex items-center gap-1.5 shadow-pill"
              >
                <span>Read Full Handover Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('/employee/report/acknowledge')}
                className="px-5 py-2.5 rounded-full border border-[#E5EAE6] text-[#142640] text-xs font-bold hover:bg-[#F5F7F6] transition-all"
              >
                <span>Sign-off & Acknowledge</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#687570]">
              Handover Lead
            </span>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
                alt="Rutika Ghanwat"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E5EAE6]"
              />
              <div>
                <h4 className="text-sm font-bold text-[#142640]">Rutika Ghanwat</h4>
                <p className="text-xs text-[#687570]">Staff Backend Lead (Departing)</p>
              </div>
            </div>
            <p className="text-xs text-[#687570] leading-relaxed">
              Rutika contributed 6 runbooks and verified the double-entry ledger architecture before offboarding.
            </p>
            <div className="p-3 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] text-[11px] text-[#687570]">
              <ShieldCheck className="w-4 h-4 text-[#218653] inline mr-1" />
              <span>All citations are linked directly to commits in the GitHub repository.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
