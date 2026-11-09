import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Calendar,
  Users,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockProjects } from '../../data/mockData';

export const ProjectSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const project = mockProjects[0]; // Core Payments & Ledger

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7F0] text-[#218653] border border-[#C3E7D3] mb-2">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Authorized Project Scopes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
          Project Summary: {project.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#687570] max-w-2xl leading-relaxed">
          Read-only summary of project milestones, technical objectives, and verified repository boundaries.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAE6]">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
              {project.code}
            </span>
            <h2 className="text-lg font-bold text-[#142640] font-heading mt-1">
              {project.name}
            </h2>
          </div>

          <div className="text-xs text-[#687570]">
            Lead Manager: <strong className="text-[#142640]">{project.owner}</strong>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
            Architectural Objectives
          </span>
          <p className="text-xs sm:text-sm text-[#202B28] leading-relaxed">
            {project.objectives || project.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold text-[#8E9B96] uppercase block">Timeline</span>
            <strong className="text-[#142640] mt-0.5 block">{project.startDate} to {project.expectedCompletionDate}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold text-[#8E9B96] uppercase block">Repository</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <GitBranch className="w-3.5 h-3.5 text-[#218653]" />
              <strong className="text-[#142640] font-mono text-[11px] truncate">knowflow-payments-service</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold text-[#8E9B96] uppercase block">Transition State</span>
            <span className="text-[11px] font-bold text-[#218653] bg-[#EBF7F0] px-2 py-0.5 rounded-full inline-block mt-0.5">
              Active Handover in Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
