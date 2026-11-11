import React, { useState } from 'react';
import {
  FolderKanban,
  Users,
  Database,
  Cpu,
  Layers,
  FileCheck2,
  ShieldCheck,
  Lock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';

interface FeatureItem {
  id: string;
  moduleNumber: string;
  title: string;
  shortDesc: string;
  detailedPoints: string[];
  icon: React.ElementType;
}

const featuresList: FeatureItem[] = [
  {
    id: 'feat-1',
    moduleNumber: '01',
    title: 'Project Setup & Scope',
    shortDesc: 'Establish project boundaries, handover timelines, target objectives, and authorized access credentials.',
    detailedPoints: [
      'Configurable project metadata, timeline targets, and completion criteria',
      'Granular role permission maps for 6 engineering and leadership roles',
      'Unified project health dashboard tracking handover completion score',
    ],
    icon: FolderKanban,
  },
  {
    id: 'feat-2',
    moduleNumber: '02',
    title: 'Employee & Role Management',
    shortDesc: 'Manage departing and incoming engineers with clear responsibility matrices and system access boundaries.',
    detailedPoints: [
      'Comprehensive profile directory linking members to code repositories and projects',
      'Clear responsibility mapping ensuring zero unowned infrastructure services',
      'Audited status tracking across active, departing, and onboarding states',
    ],
    icon: Users,
  },
  {
    id: 'feat-3',
    moduleNumber: '03',
    title: 'Smart Knowledge Collection',
    shortDesc: 'Ingest read-only GitHub repository commit history alongside PDF and DOCX technical specifications.',
    detailedPoints: [
      'Automatic parsing of ADRs, runbooks, and design specifications without manual re-formatting',
      'Read-only GitHub sync extracting commit messages, PR descriptions, and author attribution',
      'Granular source status indicators with real-time indexing progress and fact count',
    ],
    icon: Database,
  },
  {
    id: 'feat-4',
    moduleNumber: '04',
    title: 'Deep Project Analysis & AST',
    shortDesc: 'Identify completed tasks, pending work, key decisions, and implicit dependencies using AST tokenization.',
    detailedPoints: [
      'Abstract Syntax Tree (AST) tokenization tracing commit authors to concrete code blocks',
      'Extraction of architectural trade-offs and rationale behind critical technical decisions',
      'Automatic discovery of undocumented third-party API dependencies and credentials',
    ],
    icon: Cpu,
  },
  {
    id: 'feat-5',
    moduleNumber: '05',
    title: 'Project State Reconstruction',
    shortDesc: 'Consolidate project truth, detect contradictions between code and docs, and flag knowledge gaps.',
    detailedPoints: [
      'Side-by-side conflict detection highlighting discrepancies between runbooks and current codebase',
      'Detection of unmerged feature branches, stale pull requests, and orphaned microservices',
      'Manager resolution tool to formally reconcile conflicting project statements',
    ],
    icon: Layers,
  },
  {
    id: 'feat-6',
    moduleNumber: '06',
    title: 'Role-Specific Handover Reports',
    shortDesc: 'Generate tailored handover briefings organized into completed work, decisions, risks, and next actions.',
    detailedPoints: [
      'Strict dual-layer filtering: IAM access verification first, role relevance ranking second',
      'Role-tailored sections for Backend, Frontend, DevOps, and Project Management roles',
      'Comprehensive executive summary with completion percentage and verification metrics',
    ],
    icon: FileCheck2,
  },
  {
    id: 'feat-7',
    moduleNumber: '07',
    title: 'Manager Review & Verification',
    shortDesc: 'The Project Manager inspects citations, corrects findings, resolves questions, and authorizes release.',
    detailedPoints: [
      'Clickable evidence inspection showing exact commit hashes, file paths, and document pages',
      'Inline managerial correction and feedback system for adjusting AI classifications',
      'Formal approval stamp authorizing the release of the handover dossier',
    ],
    icon: ShieldCheck,
  },
  {
    id: 'feat-8',
    moduleNumber: '08',
    title: 'Secure Knowledge Transfer',
    shortDesc: 'Deliver verifiable briefings to incoming engineers with interactive checklists and digital acknowledgment.',
    detailedPoints: [
      'Role-filtered incoming contributor portal with interactive comprehension checklists',
      'Digital signature acknowledgment verifying complete knowledge transfer',
      'Immutable handover dossier archival for future compliance and audit reference',
    ],
    icon: Lock,
  },
];

export const FeaturesShowcase: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuresList.map(item => {
        const Icon = item.icon;
        const isExpanded = expandedId === item.id;

        return (
          <div
            key={item.id}
            className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-200 p-6 flex flex-col justify-between ${
              isExpanded
                ? 'border-[#704B91] shadow-resting ring-1 ring-[#704B91]/30'
                : 'border-[#E8E0EF] hover:border-slate-300 shadow-subtle'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#F2EDF8] text-[#704B91] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-[#89919D] bg-[#FAF8FC] px-2 py-0.5 rounded-full border border-[#E8E0EF]">
                  MODULE {item.moduleNumber}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#32164C] font-heading">
                  {item.title}
                </h3>
                <p className="text-xs text-[#697586] mt-1.5 leading-relaxed">
                  {item.shortDesc}
                </p>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="pt-3 border-t border-[#E8E0EF] space-y-2 animate-fadeIn">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#32164C] block">
                    Key Capabilities
                  </span>
                  <ul className="space-y-1.5">
                    {item.detailedPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#202B28]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#704B91] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 mt-2">
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full py-1.5 px-3 rounded-full text-xs font-bold text-[#704B91] hover:text-[#32164C] hover:bg-[#F2EDF8] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{isExpanded ? 'Hide details' : 'Learn more'}</span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
