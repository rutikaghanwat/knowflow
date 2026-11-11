import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  User,
  Building,
  CheckCircle2,
  LogOut,
  ExternalLink,
  ShieldCheck,
  FolderGit2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from '../../types';
import { formatTimeAgo } from '../../utils';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/app/overview' || path === '/app') return 'Overview';
    if (path === '/app/my-handover') return 'My Handover';
    if (path === '/app/upload-sources') return 'Upload Sources';
    if (path === '/app/my-files') return 'My Uploaded Files';
    if (path === '/app/review-confirm') return 'Review & Confirm Submission';
    if (path === '/app/incoming-overview') return 'Incoming Handover Overview';
    if (path === '/app/my-report') return 'Handover Report Dossier';
    if (path === '/app/permitted-evidence') return 'Permitted Evidence & Citations';
    if (path === '/app/acknowledgement') return 'Transfer Acknowledgment';
    if (path === '/app/project-summary') return 'Project Summary';
    if (path.startsWith('/app/projects')) return 'Projects';
    if (path.startsWith('/app/team')) return 'Team Members';
    if (path.startsWith('/app/sources')) return 'Knowledge Sources';
    if (path.startsWith('/app/analysis')) return 'AI Knowledge Analysis';
    if (path.startsWith('/app/project-state')) return 'Project State Reconstruction';
    if (path.startsWith('/app/evidence')) return 'Evidence Audit & Citations';
    if (path.startsWith('/app/handovers')) return 'Handovers';
    if (path.startsWith('/app/reports')) return 'Handover Reports';
    if (path.startsWith('/app/approvals')) return 'Manager Approvals';
    if (path.startsWith('/app/settings')) return 'Settings';
    return 'Workspace';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E8E0EF] flex items-center justify-between px-4 sm:px-6">
      {/* Left Section: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-[#697586] hover:text-[#32164C] hover:bg-[#F2EDF8] rounded-control lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#89919D] hidden sm:inline">Workspace</span>
          <span className="text-xs text-[#89919D] hidden sm:inline">/</span>
          <h2 className="text-base font-bold text-[#32164C] font-heading">{getPageTitle()}</h2>
        </div>
      </div>

      {/* Right Section: Search, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick Search */}
        <div className="relative hidden md:block w-56 lg:w-64">
          <Search className="w-4 h-4 text-[#89919D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search handovers, sources..."
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && globalSearch.trim()) navigate(`/app/analysis?q=${encodeURIComponent(globalSearch.trim())}`); }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8FC] border border-[#E8E0EF] rounded-xl text-[#32164C] placeholder:text-[#89919D] focus:bg-white focus:border-[#704B91] transition-colors"
          />
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#697586] hover:text-[#32164C] hover:bg-[#F2EDF8] rounded-xl transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B7791F] ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#E8E0EF] shadow-dropdown z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-[#E8E0EF] flex items-center justify-between bg-[#FAF8FC]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#32164C] font-heading">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#F2EDF8] text-[#704B91]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-[#704B91] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#E8E0EF]">
                {notifications.length === 0 && <p className="p-6 text-center text-xs text-[#697586]">No notifications yet.</p>}
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3.5 hover:bg-[#FAF8FC] transition-colors flex items-start gap-3 ${
                      !notif.read ? 'bg-[#F2EDF8]/30' : ''
                    }`}
                  >
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-[#704B91] shrink-0 opacity-75" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#32164C]">{notif.title}</p>
                      <p className="text-xs text-[#697586] mt-0.5 line-clamp-2">{notif.message}</p>
                      <span className="text-[10px] text-[#89919D] mt-1 inline-block">
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 border-t border-[#E8E0EF] bg-[#FAF8FC] text-center">
                <Link
                  to={currentUser.perspective === 'manager' ? '/app/approvals' : '/app/overview'}
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-[#704B91] hover:underline inline-flex items-center gap-1"
                >
                  <span>View all activity</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Menu (With Role Badge & Project Name) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-[#F2EDF8] border border-transparent hover:border-[#E8E0EF] transition-colors"
          >
            {currentUser.avatar ? <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-[#E4D9EF]" /> : <span className="w-7 h-7 rounded-full bg-[#F2EDF8] text-[#704B91] grid place-items-center text-[10px] font-bold">{currentUser.name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()}</span>}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#32164C] leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#704B91] font-bold leading-tight">
                {currentUser.perspective === 'manager'
                  ? 'Manager'
                  : currentUser.perspective === 'departing'
                  ? 'Departing Member'
                  : currentUser.perspective === 'incoming'
                  ? 'Incoming Member'
                  : 'Project Member'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#697586]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E8E0EF] shadow-dropdown z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-[#E8E0EF] bg-[#FAF8FC] space-y-1">
                <p className="text-xs font-bold text-[#32164C]">{currentUser.name}</p>
                <p className="text-[11px] text-[#697586] truncate">{currentUser.email}</p>
                
                {/* Role badge with project name per Section 1 */}
                <div className="pt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#704B91] bg-[#F2EDF8] px-2 py-0.5 rounded-full w-fit border border-[#E4D9EF]">
                    <ShieldCheck className="w-3 h-3" />
                    <span>
                      {currentUser.perspective === 'manager'
                        ? 'Manager'
                        : currentUser.perspective === 'departing'
                        ? 'Departing Member'
                        : 'Incoming Member'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#697586]">
                    <FolderGit2 className="w-3 h-3 text-[#89919D]" />
                    <span className="truncate">{currentUser.activeProjectName}</span>
                  </div>
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                <Link
                  to="/app/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#202B28] hover:bg-[#FAF8FC] rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-[#697586]" />
                  <span>Account & Profile</span>
                </Link>
              </div>

              <div className="p-1 border-t border-[#E8E0EF] bg-[#FAF8FC]">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#B54747] hover:bg-[#FDF2F2] rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
