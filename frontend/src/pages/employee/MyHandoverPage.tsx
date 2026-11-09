import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FolderGit2,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  User,
  AlertCircle,
  Sparkles,
  GitBranch,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockHandovers } from '../../data/mockData';

export const MyHandoverPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, activeHandover } = useAuth();
  const firstName = currentUser.name.split(' ')[0];

  if (!activeHandover) {
    return (
      <div className="bg-white rounded-3xl border border-[#E5EAE6] p-12 text-center max-w-xl mx-auto shadow-resting my-12 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F5F7F6] text-[#8E9B96] flex items-center justify-center mx-auto">
          <Clock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#142640] font-heading">
          No handover assigned yet
        </h2>
        <p className="text-xs text-[#687570] leading-relaxed">
          Your manager will notify you when a formal project knowledge transfer starts.
        </p>
      </div>
    );
  }

  const checklistItems = [
    {
      id: 1,
      title: 'Upload technical documents & runbooks',
      status: 'completed',
      detail: '3 files uploaded (PDF & DOCX)',
      action: () => navigate('/app/upload-sources'),
      actionLabel: 'Upload more',
    },
    {
      id: 2,
      title: 'Confirm connected GitHub repositories',
      status: 'completed',
      detail: 'knowflow-payments-service (Read-only sync active)',
      action: () => navigate('/app/upload-sources'),
      actionLabel: 'View repo',
    },
    {
      id: 3,
      title: 'Review processed sources & extracted facts',
      status: 'in_progress',
      detail: '58 knowledge claims extracted by AST tokenizer',
      action: () => navigate('/app/my-files'),
      actionLabel: 'Browse files',
    },
    {
      id: 4,
      title: 'Clarify ambiguities & confirm submission',
      status: 'pending',
      detail: 'Optional notes for unresolved dependencies before manager sign-off',
      action: () => navigate('/app/review-confirm'),
      actionLabel: 'Review & Confirm',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Welcoming Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF7EB] text-[#B7791F] border border-[#F6DEB5]">
          <Clock className="w-3.5 h-3.5" />
          <span>Departing Contributor Workspace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
          Hi {firstName}, let's hand over your knowledge.
        </h1>
        <p className="text-xs sm:text-sm text-[#687570] max-w-2xl leading-relaxed">
          KNOWFLOW automatically parses your commits and runbooks to build an evidence-backed handover.
          Upload your project documents and confirm your repository connections below.
        </p>
      </div>

      {/* 2. Handover Summary Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAE6]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Active Project Handover
            </span>
            <h2 className="text-xl font-extrabold text-[#142640] font-heading">
              {activeHandover.projectName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#218653] bg-[#EBF7F0] px-3 py-1 rounded-full border border-[#C3E7D3]">
              Stage: Knowledge Ingestion & Extraction
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Incoming Replacement
            </span>
            <div className="flex items-center gap-2 mt-1">
              <User className="w-4 h-4 text-[#218653]" />
              <strong className="text-[#142640] text-sm">{activeHandover.incomingMember.name}</strong>
            </div>
            <span className="text-[11px] text-[#687570]">{activeHandover.targetRole}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Target Completion
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-[#B7791F]" />
              <strong className="text-[#142640] text-sm">Nov 15, 2026</strong>
            </div>
            <span className="text-[11px] text-[#687570]">6 days remaining</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Manager & Reviewer
            </span>
            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck className="w-4 h-4 text-[#2F6B5D]" />
              <strong className="text-[#142640] text-sm">{activeHandover.reviewer.name}</strong>
            </div>
            <span className="text-[11px] text-[#687570]">Lead Project Manager</span>
          </div>
        </div>
      </div>

      {/* 3. Compact Checklist */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#142640] font-heading">
            Your Handover Checklist
          </h3>
          <span className="text-xs font-semibold text-[#687570]">
            2 of 4 Steps Complete
          </span>
        </div>

        <div className="space-y-3">
          {checklistItems.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-[#E5EAE6] bg-[#F5F7F6] hover:bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {item.status === 'completed' && (
                    <CheckCircle2 className="w-5 h-5 text-[#218653]" />
                  )}
                  {item.status === 'in_progress' && (
                    <div className="w-5 h-5 rounded-full border-2 border-[#218653] border-t-transparent animate-spin" />
                  )}
                  {item.status === 'pending' && (
                    <div className="w-5 h-5 rounded-full border-2 border-[#CBD5E1]" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#142640]">{item.title}</h4>
                  <p className="text-[11px] text-[#687570] mt-0.5">{item.detail}</p>
                </div>
              </div>

              <button
                onClick={item.action}
                className="self-end sm:self-auto px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-[#E5EAE6] text-xs font-bold text-[#142640] flex items-center gap-1 shadow-subtle hover:text-[#218653] transition-colors"
              >
                <span>{item.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. "What happens next" mini timeline */}
      <div className="bg-[#142640] text-white p-6 sm:p-8 rounded-3xl border border-[#1D3457] shadow-raised space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#28A766]" />
            <h3 className="text-sm font-bold font-heading">What happens next</h3>
          </div>
          <span className="text-[10px] font-mono text-[#28A766] bg-[#218653]/30 px-2.5 py-0.5 rounded-full border border-[#218653]/50">
            Manager Review Follows
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Once you confirm and submit your uploaded documents, <strong>Sarah Lin</strong> will review the
          extracted evidence, resolve questions, and formally approve the handover report before Marcus Vance accesses it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] font-bold text-[#28A766] block">STEP 3-4 (Current)</span>
            <strong className="text-white">Knowledge Ingestion</strong>
            <p className="text-[10px] text-slate-400 mt-0.5">Uploading runbooks & AST parsing</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 block">STEP 5-6</span>
            <strong className="text-slate-200">Evidence Audit</strong>
            <p className="text-[10px] text-slate-400 mt-0.5">Classification & confidence checks</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 block">STEP 7-8</span>
            <strong className="text-slate-200">Manager Sign-Off</strong>
            <p className="text-[10px] text-slate-400 mt-0.5">Sarah reviews & approves release</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 block">STEP 9-10</span>
            <strong className="text-slate-200">Transfer & Sign</strong>
            <p className="text-[10px] text-slate-400 mt-0.5">Marcus reviews and signs off</p>
          </div>
        </div>
      </div>
    </div>
  );
};
