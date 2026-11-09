import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Users,
  Database,
  Cpu,
  Layers,
  FileCheck2,
  ShieldCheck,
  Settings,
  X,
  ArrowLeft,
  Plus,
  ChevronDown,
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  Lock,
  UserCheck,
  Share2,
  History,
} from 'lucide-react';
import { cn } from '../../utils';
import { useAuth, UserRolePerspective } from '../../context/AuthContext';
import { mockApprovals } from '../../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser, switchUser } = useAuth();
  const pendingApprovalsCount = mockApprovals.filter(a => a.status === 'pending').length;
  const [recentProjectsExpanded, setRecentProjectsExpanded] = useState(true);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Construct navigation strictly according to active role perspective
  const getNavigationSections = () => {
    if (currentUser.perspective === 'departing') {
      return [
        {
          title: 'MY HANDOVER',
          items: [
            { label: 'Overview', to: '/app/my-handover', icon: LayoutDashboard },
            { label: 'Upload Sources', to: '/app/upload-sources', icon: Upload },
            { label: 'My Files', to: '/app/my-files', icon: FileText, count: 4 },
            { label: 'Review & Confirm', to: '/app/review-confirm', icon: FileCheck2 },
          ],
        },
        {
          title: 'PROJECT',
          items: [
            { label: 'Project Summary', to: '/app/project-summary', icon: FolderGit2 },
          ],
        },
        {
          title: 'ACCOUNT',
          items: [
            { label: 'Settings', to: '/app/settings', icon: Settings },
          ],
        },
      ];
    }

    if (currentUser.perspective === 'incoming') {
      return [
        {
          title: 'MY HANDOVER',
          items: [
            { label: 'Overview', to: '/app/incoming-overview', icon: LayoutDashboard },
            { label: 'My Handover Report', to: '/app/my-report', icon: FileCheck2 },
            { label: 'Permitted Evidence', to: '/app/permitted-evidence', icon: ShieldCheck },
            { label: 'Acknowledgement', to: '/app/acknowledgement', icon: CheckCircle2 },
          ],
        },
        {
          title: 'PROJECT',
          items: [
            { label: 'Project Summary', to: '/app/project-summary', icon: FolderGit2 },
          ],
        },
        {
          title: 'ACCOUNT',
          items: [
            { label: 'Settings', to: '/app/settings', icon: Settings },
          ],
        },
      ];
    }

    // Default: MANAGER
    return [
      {
        title: 'WORKSPACE',
        items: [
          { label: 'Overview', to: '/app/overview', icon: LayoutDashboard },
          { label: 'Projects', to: '/app/projects', icon: FolderGit2, count: 4 },
          { label: 'Team Members', to: '/app/team', icon: Users },
        ],
      },
      {
        title: 'KNOWLEDGE',
        items: [
          { label: 'Knowledge Sources', to: '/app/sources', icon: Database, count: 6 },
          { label: 'AI Analysis', to: '/app/analysis', icon: Cpu },
          { label: 'Project State', to: '/app/project-state', icon: Layers },
          { label: 'Evidence Audit', to: '/app/evidence', icon: ShieldCheck },
        ],
      },
      {
        title: 'HANDOVER',
        items: [
          { label: 'Handovers', to: '/app/handovers', icon: Layers, count: 3 },
          { label: 'Reports', to: '/app/reports', icon: FileCheck2 },
          {
            label: 'Approvals',
            to: '/app/approvals',
            icon: ShieldCheck,
            badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          },
          { label: 'Sharing & Acknowledgements', to: '/app/sharing-acknowledgements', icon: Share2 },
        ],
      },
      {
        title: 'MANAGEMENT',
        items: [
          { label: 'Audit History', to: '/app/audit', icon: History },
          { label: 'Settings', to: '/app/settings', icon: Settings },
        ],
      },
    ];
  };

  const navigationSections = getNavigationSections();

  const recentProjects = [
    { name: 'Core Payments & Ledger', progress: 75 },
    { name: 'Mobile App iOS & Android', progress: 60 },
    { name: 'Distributed Streaming v2', progress: 40 },
    { name: 'Internal Tooling & DevOps', progress: 20 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0E1C30]/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Exact Deep Navy `#142640` */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#142640] text-slate-300 border-r border-[#1D3457] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header with Purple Icon on Crisp White Tile */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#1D3457]">
          <Link to="/app/overview" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-subtle relative overflow-hidden group-hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/20 to-[#A855F7]/20" />
              <Layers className="w-4 h-4 text-[#6366F1]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-sm tracking-tight text-white">
                  KNOWFLOW
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#28A766] bg-[#218653]/30 px-1.5 py-0.2 rounded-full border border-[#218653]/40">
                  NOVYX
                </span>
              </div>
              <span className="text-[10px] text-slate-400 -mt-0.5">
                Handover Platform
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User & Perspective Pill */}
        <div className="px-3 py-2.5 bg-[#0E1C30]/70 border-b border-[#1D3457] relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20 shrink-0"
              />
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-semibold text-[#28A766] uppercase tracking-wider block -mt-0.5">
                  {currentUser.perspective === 'manager'
                    ? 'Manager'
                    : currentUser.perspective === 'departing'
                    ? 'Departing Member'
                    : 'Incoming Member'}
                </span>
              </div>
            </div>

            {/* Quick 1-click Role Switcher Dropdown for Testing */}
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="text-[10px] text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 flex items-center gap-0.5"
              title="Switch role for testing"
            >
              <span>Switch</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Role Switcher Menu */}
          {showRoleSwitcher && (
            <div className="absolute left-3 right-3 top-12 bg-[#18304F] border border-[#23416B] rounded-xl shadow-modal z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                Simulate Role:
              </span>
              <button
                onClick={() => {
                  switchUser('usr-1');
                  setShowRoleSwitcher(false);
                  navigate('/app/overview');
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between ${
                  currentUser.id === 'usr-1' ? 'bg-[#218653] text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>Sarah Lin</span>
                <span className="text-[9px] uppercase opacity-75">Manager</span>
              </button>

              <button
                onClick={() => {
                  switchUser('usr-2');
                  setShowRoleSwitcher(false);
                  navigate('/app/my-handover');
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between ${
                  currentUser.id === 'usr-2' ? 'bg-[#218653] text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>Rutika G.</span>
                <span className="text-[9px] uppercase opacity-75">Departing</span>
              </button>

              <button
                onClick={() => {
                  switchUser('usr-3');
                  setShowRoleSwitcher(false);
                  navigate('/app/my-report');
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between ${
                  currentUser.id === 'usr-3' ? 'bg-[#218653] text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>Marcus V.</span>
                <span className="text-[9px] uppercase opacity-75">Incoming</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {navigationSections.map(section => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>

              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group',
                        isActive
                          ? 'bg-[#218653] text-white font-semibold shadow-pill'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={cn(
                              'w-4 h-4 transition-colors',
                              isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                            )}
                          />
                          <span>{item.label}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#B7791F] text-white">
                            {item.badge}
                          </span>
                        )}

                        {item.count !== undefined && !item.badge && (
                          <span
                            className={cn(
                              'text-[10px] px-1.5 py-0.2 rounded font-medium',
                              isActive
                                ? 'text-white bg-white/20'
                                : 'text-slate-400 bg-white/5'
                            )}
                          >
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* Sub-Section: Recent Active Projects (Manager only per spec) */}
          {currentUser.perspective === 'manager' && (
            <div className="pt-2 border-t border-[#1D3457] space-y-2">
              <button
                onClick={() => setRecentProjectsExpanded(!recentProjectsExpanded)}
                className="w-full flex items-center justify-between px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
              >
                <span>Recent Handovers</span>
                <ChevronDown
                  className={cn(
                    'w-3 h-3 transition-transform duration-200',
                    recentProjectsExpanded ? 'rotate-180' : ''
                  )}
                />
              </button>

              {recentProjectsExpanded && (
                <div className="space-y-1.5 px-1">
                  {recentProjects.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate('/app/handovers')}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-200 truncate pr-2">
                          {p.name}
                        </span>
                        <span className="text-[10px] font-bold text-[#28A766]">
                          {p.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-[#0E1C30] h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-[#218653] h-full rounded-full"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button & Footer (Matching reference screenshot "+ New Handover") */}
        <div className="p-3 border-t border-[#1D3457] bg-[#0E1C30]/50 space-y-2.5">
          {currentUser.perspective === 'manager' ? (
            <button
              onClick={() => navigate('/app/handovers')}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/5"
            >
              <Plus className="w-3.5 h-3.5 text-[#28A766]" />
              <span>+ New Handover</span>
            </button>
          ) : currentUser.perspective === 'departing' ? (
            <button
              onClick={() => navigate('/app/upload-sources')}
              className="w-full py-2 px-3 rounded-xl bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-pill"
            >
              <Upload className="w-3.5 h-3.5 text-white" />
              <span>Upload Source</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/app/acknowledgement')}
              className="w-full py-2 px-3 rounded-xl bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-pill"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>Sign Acknowledgment</span>
            </button>
          )}

          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-white transition-colors py-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Public Landing Page</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
