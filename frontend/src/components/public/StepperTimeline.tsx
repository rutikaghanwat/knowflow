import React, { useState } from 'react';
import {
  FolderPlus,
  UserCheck,
  Database,
  Cpu,
  Layers,
  Filter,
  ShieldCheck,
  Edit3,
  FileCheck2,
  Lock,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface StepDetail {
  number: number;
  title: string;
  actor: 'Project Manager' | 'AI Engine' | 'Departing Member' | 'Incoming Member';
  summary: string;
  keyOutputs: string[];
  icon: React.ElementType;
}

const stepsData: StepDetail[] = [
  {
    number: 1,
    title: 'Project Setup & Scope',
    actor: 'Project Manager',
    summary: 'The Project Manager initializes the project workspace, establishes timeline goals, and designates the departing member, replacement member, and target technical roles.',
    keyOutputs: ['Handover initiation charter', 'Role target definition', 'Access authorization boundaries'],
    icon: FolderPlus,
  },
  {
    number: 2,
    title: 'Employee & Role Assignment',
    actor: 'Project Manager',
    summary: 'Assigns departing and incoming personnel to specific projects and roles with defined responsibilities and access scopes.',
    keyOutputs: ['Member-to-project mapping', 'IAM role validation', 'Responsibility matrix'],
    icon: UserCheck,
  },
  {
    number: 3,
    title: 'Smart Knowledge Collection',
    actor: 'Departing Member',
    summary: 'Authorizes read-only GitHub repository sync and ingests unstructured technical documents including Architecture Decision Records (ADRs), runbooks, and specifications in PDF or DOCX format.',
    keyOutputs: ['Repository commit history index', 'Technical documentation vector store', 'Runbook inventory'],
    icon: Database,
  },
  {
    number: 4,
    title: 'Deep Project Analysis & AST',
    actor: 'AI Engine',
    summary: 'Analyzes commits, PR discussions, and document trees using AST tokenization to identify completed tasks, architectural rationale, implicit dependencies, and technical debt.',
    keyOutputs: ['Author contribution graphs', 'Architectural decision log', 'Implicit dependency mapping'],
    icon: Cpu,
  },
  {
    number: 5,
    title: 'Project State Reconstruction',
    actor: 'AI Engine',
    summary: 'Synthesizes current project status, cross-checks documentation against code commits, and flags information contradictions, unmerged feature branches, and undocumented decisions.',
    keyOutputs: ['Consolidated project state matrix', 'Contradiction & gap detection log', 'Blocker taxonomy'],
    icon: Layers,
  },
  {
    number: 6,
    title: 'Role & Permission Filtering',
    actor: 'AI Engine',
    summary: 'Applies dual-layer filtering: verifies incoming engineer’s access permission boundary first, then extracts knowledge strictly relevant to their specific role.',
    keyOutputs: ['Access-cleared knowledge bundle', 'Role relevance ranking', 'Sensitive secret suppression'],
    icon: Filter,
  },
  {
    number: 7,
    title: 'Role-Specific Report Generation',
    actor: 'AI Engine',
    summary: 'Assembles a structured, evidence-backed handover report organized into completed work, pending tasks, key decisions, risks, dependencies, and recommended next actions.',
    keyOutputs: ['Role-specific handover report', 'Confidence scoring metadata', 'Traceable citation links'],
    icon: FileCheck2,
  },
  {
    number: 8,
    title: 'Manager Review & Corrections',
    actor: 'Project Manager',
    summary: 'The Project Manager reviews every finding, inspects source citations, adds managerial comments, flags inaccuracies, and requests clarifications before release.',
    keyOutputs: ['Manager audit remarks', 'Corrected facts registry', 'Unresolved question answers'],
    icon: Edit3,
  },
  {
    number: 9,
    title: 'Handover Report Sign-Off',
    actor: 'Project Manager',
    summary: 'Formal administrative approval authorizing the release of the validated handover report to the incoming team member.',
    keyOutputs: ['Formal managerial approval stamp', 'Release authorization lock', 'Immutable transition timestamp'],
    icon: ShieldCheck,
  },
  {
    number: 10,
    title: 'Secure Knowledge Transfer',
    actor: 'Incoming Member',
    summary: 'The incoming contributor accesses their personalized handover workspace, completes onboarding comprehension checks, and digitally signs the transfer acknowledgment.',
    keyOutputs: ['Transfer acknowledgment signature', 'Archived handover dossier', 'Project continuity verified'],
    icon: Lock,
  },
];

export const StepperTimeline: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const activeDetail = stepsData[selectedStep - 1];
  const Icon = activeDetail.icon;

  return (
    <div className="space-y-8">
      {/* Horizontal Desktop Scrub Bar / Stepper */}
      <div className="overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 min-w-[720px] lg:min-w-full justify-between">
          {stepsData.map(step => {
            const isSelected = selectedStep === step.number;
            const isPassed = selectedStep > step.number;
            return (
              <button
                key={step.number}
                onClick={() => setSelectedStep(step.number)}
                className="group flex flex-col items-center flex-1 focus:outline-none"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 ${
                    isSelected
                      ? 'bg-[#704B91] text-white border-[#704B91] scale-110 shadow-pill'
                      : isPassed
                      ? 'bg-[#F2EDF8] text-[#704B91] border-[#704B91]'
                      : 'bg-white text-[#697586] border-[#E8E0EF] group-hover:border-[#704B91]'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : String(step.number).padStart(2, '0')}
                </div>
                <span
                  className={`mt-2 text-[11px] font-semibold text-center leading-tight line-clamp-1 max-w-[80px] transition-colors ${
                    isSelected
                      ? 'text-[#704B91] font-bold'
                      : 'text-[#697586] group-hover:text-[#32164C]'
                  }`}
                >
                  {step.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Showcase Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E0EF] p-6 sm:p-8 shadow-resting transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8E0EF]">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2EDF8] text-[#704B91] flex items-center justify-center shrink-0 shadow-subtle">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#704B91] bg-[#F2EDF8] px-2.5 py-0.5 rounded-full border border-[#E4D9EF]">
                  STEP {String(activeDetail.number).padStart(2, '0')} OF 10
                </span>
                <span className="text-xs font-semibold text-[#32164C] bg-slate-100 px-2.5 py-0.5 rounded-full">
                  Primary Actor: {activeDetail.actor}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#32164C] font-heading mt-1.5 tracking-tight">
                {activeDetail.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={() => setSelectedStep(prev => (prev > 1 ? prev - 1 : 10))}
              className="px-3.5 py-1.5 rounded-full border border-[#E8E0EF] text-xs font-semibold text-[#697586] hover:text-[#32164C] hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setSelectedStep(prev => (prev < 10 ? prev + 1 : 1))}
              className="px-4 py-1.5 rounded-full bg-[#704B91] text-white text-xs font-semibold hover:bg-[#5D3B7B] transition-colors flex items-center gap-1 shadow-pill"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Content Description & Key Outputs */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#697586]">
              Operational Responsibility & Workflow
            </h4>
            <p className="text-sm text-[#202B28] leading-relaxed">
              {activeDetail.summary}
            </p>
          </div>

          <div className="space-y-3 bg-[#FAF8FC] p-4 rounded-xl border border-[#E8E0EF]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#32164C]">
              Verified Deliverables
            </h4>
            <ul className="space-y-1.5">
              {activeDetail.keyOutputs.map((output, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#202B28]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#704B91] shrink-0 mt-0.5" />
                  <span>{output}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
