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
} from 'lucide-react';
import { cn } from '../../utils';
import { useAuth, UserRolePerspective } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Construct navigation strictly according to active role perspective
  const getNavigationSections = () => {
    if (currentUser.perspective === 'departing') {
      return [
        {
          title: 'MY HANDOVER',
          items: [
            { label: 'Overview', to: '/app/my-handover', icon: LayoutDashboard },
            { label: 'My Files', to: '/app/my-files', icon: FileText },
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

    if (currentUser.perspective === 'member') {
      return [{ title: 'ACCOUNT', items: [{ label: 'Settings', to: '/app/settings', icon: Settings }] }];
    }

    // Default: MANAGER
    return [
      {
        title: 'WORKSPACE',
        items: [
          { label: 'Overview', to: '/app/overview', icon: LayoutDashboard },
          { label: 'Projects', to: '/app/projects', icon: FolderGit2 },
          { label: 'Team Members', to: '/app/team', icon: Users },
        ],
      },
      {
        title: 'KNOWLEDGE',
        items: [
          { label: 'Knowledge Sources', to: '/app/sources', icon: Database },
          { label: 'AI Analysis', to: '/app/analysis', icon: Cpu },
          { label: 'Project State', to: '/app/project-state', icon: Layers },
          { label: 'Evidence Audit', to: '/app/evidence', icon: ShieldCheck },
        ],
      },
      {
        title: 'HANDOVER',
        items: [
          { label: 'Handovers', to: '/app/handovers', icon: Layers },
          { label: 'Reports', to: '/app/reports', icon: FileCheck2 },
          {
            label: 'Approvals',
            to: '/app/approvals',
            icon: ShieldCheck,
            badge: undefined,
          },
        ],
      },
      {
        title: 'MANAGEMENT',
        items: [
          { label: 'Settings', to: '/app/settings', icon: Settings },
        ],
      },
    ];
  };

  const navigationSections = getNavigationSections();


  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#241036]/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Exact Deep Navy `#32164C` */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#32164C] text-slate-300 border-r border-[#4B3062] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header with Purple Icon on Crisp White Tile */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#4B3062]">
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
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#BDA4D2] bg-[#704B91]/30 px-1.5 py-0.2 rounded-full border border-[#704B91]/40">
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
        <div className="px-3 py-2.5 bg-[#241036]/70 border-b border-[#4B3062] relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {currentUser.avatar ? <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20 shrink-0" /> : <span className="w-6 h-6 rounded-full bg-[#704B91] text-white grid place-items-center text-[9px] font-bold shrink-0">{currentUser.name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()}</span>}
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-semibold text-[#BDA4D2] uppercase tracking-wider block -mt-0.5">
                  {currentUser.perspective === 'manager'
                    ? 'Manager'
                    : currentUser.perspective === 'departing'
                    ? 'Departing Member'
                    : currentUser.perspective === 'incoming'
                    ? 'Incoming Member'
                    : 'Project Member'}
                </span>
              </div>
            </div>

          </div>
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
                          ? 'bg-[#704B91] text-white font-semibold shadow-pill'
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

        </div>

        {/* Action Button & Footer (Matching reference screenshot "+ New Handover") */}
        <div className="p-3 border-t border-[#4B3062] bg-[#241036]/50 space-y-2.5">
          {currentUser.perspective === 'manager' ? (
            <button
              onClick={() => navigate('/app/handovers')}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/5"
            >
              <Plus className="w-3.5 h-3.5 text-[#BDA4D2]" />
              <span>+ New Handover</span>
            </button>
          ) : currentUser.perspective === 'departing' ? (
            <button
              onClick={() => navigate('/app/my-files')}
              className="w-full py-2 px-3 rounded-xl bg-[#704B91] hover:bg-[#5D3B7B] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-pill"
            >
              <Upload className="w-3.5 h-3.5 text-white" />
              <span>View My Files</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/app/acknowledgement')}
              className="w-full py-2 px-3 rounded-xl bg-[#704B91] hover:bg-[#5D3B7B] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-pill"
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
