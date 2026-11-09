import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Database,
  FileCheck2,
  Bell,
  User,
  Upload,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Layers,
  X,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../../utils';
import { useAuth } from '../../context/AuthContext';
import { mockNotifications } from '../../data/mockData';

interface EmployeeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser, switchUser } = useAuth();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const unreadNotificationsCount = mockNotifications.filter(
    (n) => !n.read && (currentUser.perspective === 'departing' || currentUser.perspective === 'incoming')
  ).length;

  const isDeparting = currentUser.perspective === 'departing';
  const isIncoming = currentUser.perspective === 'incoming';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0E1C30]/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Deep Navy `#142640` */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#142640] text-slate-300 border-r border-[#1D3457] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#1D3457]">
          <Link to="/employee/overview" className="flex items-center gap-2.5 group">
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
                  PORTAL
                </span>
              </div>
              <span className="text-[10px] text-slate-400 -mt-0.5">
                Team Workspace
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

        {/* Current User Card & Perspective Switcher */}
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
                  {isDeparting ? 'Departing Member' : 'Incoming Member'}
                </span>
              </div>
            </div>

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
                  switchUser('usr-2');
                  setShowRoleSwitcher(false);
                  navigate('/employee/overview');
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between ${
                  currentUser.id === 'usr-2' ? 'bg-[#218653] text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>Rutika (Departing)</span>
                {currentUser.id === 'usr-2' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  switchUser('usr-3');
                  setShowRoleSwitcher(false);
                  navigate('/employee/overview');
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between ${
                  currentUser.id === 'usr-3' ? 'bg-[#218653] text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>Marcus (Incoming)</span>
                {currentUser.id === 'usr-3' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  switchUser('usr-1');
                  setShowRoleSwitcher(false);
                  navigate('/app/overview');
                }}
                className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:bg-white/10"
              >
                <span>Sarah (Manager Workspace)</span>
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Items: Overview & My Projects */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
              WORKSPACE
            </span>
            <NavLink
              to="/employee/overview"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-[#218653] text-white shadow-pill font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/employee/projects"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-[#218653] text-white shadow-pill font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <FolderGit2 className="w-4 h-4" />
              <span>My Projects</span>
            </NavLink>
          </div>

          {/* Handover Section (Contextual: Departing vs Incoming) */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
              MY HANDOVER
            </span>

            {isDeparting && (
              <>
                <NavLink
                  to="/employee/handover/upload"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-[#218653] text-white shadow-pill font-bold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    )
                  }
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Sources</span>
                </NavLink>

                <NavLink
                  to="/employee/handover/files"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-[#218653] text-white shadow-pill font-bold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    )
                  }
                >
                  <FileText className="w-4 h-4" />
                  <span>My Files</span>
                  <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-white/10 text-slate-300">
                    6
                  </span>
                </NavLink>

                <NavLink
                  to="/employee/handover/review"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-[#218653] text-white shadow-pill font-bold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    )
                  }
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Review & Clarify</span>
                </NavLink>
              </>
            )}

            {isIncoming && (
              <>
                <NavLink
                  to="/employee/report"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-[#218653] text-white shadow-pill font-bold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    )
                  }
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Handover Report</span>
                  <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-[#28A766] text-white">
                    NEW
                  </span>
                </NavLink>

                <NavLink
                  to="/employee/report/acknowledge"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-[#218653] text-white shadow-pill font-bold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    )
                  }
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sign-off & Acknowledge</span>
                </NavLink>
              </>
            )}
          </div>

          {/* Knowledge & Shared Reports */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
              RESOURCES
            </span>
            <NavLink
              to="/employee/knowledge-base"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-[#218653] text-white shadow-pill font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <Database className="w-4 h-4" />
              <span>Knowledge Base</span>
            </NavLink>

            <NavLink
              to="/employee/reports"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-[#218653] text-white shadow-pill font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Handover Reports</span>
            </NavLink>
          </div>

          {/* Account & Notifications */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
              ACCOUNT
            </span>
            <NavLink
              to="/employee/notifications"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-[#218653] text-white shadow-pill font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[#B7791F] text-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/employee/profile"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-[#218653] text-white shadow-pill font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </NavLink>
          </div>
        </div>

        {/* Footer info: Role boundary notice */}
        <div className="p-3 border-t border-[#1D3457] bg-[#0E1C30]/50 text-[11px] text-slate-400">
          <span>Project Scope:</span>
          <p className="text-white font-semibold truncate mt-0.5">
            {currentUser.activeProjectName}
          </p>
        </div>
      </aside>
    </>
  );
};
