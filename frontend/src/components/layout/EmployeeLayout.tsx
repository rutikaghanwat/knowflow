import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  ChevronDown,
  LogOut,
  ShieldAlert,
  User,
} from 'lucide-react';
import { EmployeeSidebar } from './EmployeeSidebar';
import { useAuth } from '../../context/AuthContext';
import { mockNotifications } from '../../data/mockData';

export const EmployeeLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { currentUser, logout, switchUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotificationsCount = mockNotifications.filter(
    (n) => !n.read && (currentUser.perspective === 'departing' || currentUser.perspective === 'incoming')
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Human-readable titles from pathname
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('/employee/projects')) return { title: 'My Assigned Projects', category: 'Workspace' };
    if (path.includes('/employee/handover/upload')) return { title: 'Upload Handover Sources', category: 'Handover Contribution' };
    if (path.includes('/employee/handover/files')) return { title: 'Contributed Files & Runbooks', category: 'Handover Contribution' };
    if (path.includes('/employee/handover/review')) return { title: 'Review & Clarifications', category: 'Handover Contribution' };
    if (path.includes('/employee/report/acknowledge')) return { title: 'Dossier Sign-off & Acknowledgment', category: 'Knowledge Transfer' };
    if (path.includes('/employee/report')) return { title: 'Approved Handover Report', category: 'Knowledge Transfer' };
    if (path.includes('/employee/knowledge-base')) return { title: 'Permitted Knowledge Base', category: 'Resources' };
    if (path.includes('/employee/reports')) return { title: 'Handover Reports Archive', category: 'Resources' };
    if (path.includes('/employee/notifications')) return { title: 'Notifications & Alerts', category: 'Account' };
    if (path.includes('/employee/profile')) return { title: 'My Profile & Permissions', category: 'Account' };
    return { title: 'Employee Overview', category: 'Workspace' };
  };

  const { title, category } = getPageInfo();

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex font-sans selection:bg-[#EBF7F0] selection:text-[#218653]">
      {/* Role-Specific Employee Sidebar */}
      <EmployeeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Topbar: ~64px */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E5EAE6] flex items-center justify-between px-4 sm:px-6 shadow-subtle">
          {/* Left: Mobile hamburger + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-[#687570] hover:text-[#142640] hover:bg-[#F5F7F6] lg:hidden focus:outline-none focus:ring-2 focus:ring-[#218653]"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#687570]">
                {category}
              </span>
              <h1 className="text-sm sm:text-base font-extrabold text-[#142640] font-heading truncate">
                {title}
              </h1>
            </div>
          </div>

          {/* Right: Quick actions, notifications, user avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/employee/notifications')}
              className="p-2 text-[#687570] hover:text-[#142640] hover:bg-[#F5F7F6] rounded-xl relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B7791F]" />
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:pl-2 rounded-xl border border-[#E5EAE6] hover:bg-[#F5F7F6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#218653]"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E5EAE6]"
                />
                <div className="hidden sm:block text-left text-xs">
                  <span className="font-bold text-[#142640] block leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#218653] font-semibold block leading-tight">
                    {currentUser.perspective === 'departing' ? 'Departing Member' : 'Incoming Member'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#687570] hidden sm:block mr-1" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5EAE6] rounded-2xl shadow-modal z-50 p-1.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-[#E5EAE6] mb-1">
                    <span className="font-bold text-[#142640] block">{currentUser.name}</span>
                    <span className="text-[11px] text-[#687570] block truncate">{currentUser.email}</span>
                  </div>

                  <Link
                    to="/employee/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#142640] hover:bg-[#F5F7F6] font-medium"
                  >
                    <User className="w-4 h-4 text-[#687570]" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      switchUser('usr-1');
                      navigate('/app/overview');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#218653] hover:bg-[#EBF7F0] font-semibold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Switch to Manager View</span>
                  </button>

                  <div className="border-t border-[#E5EAE6] my-1" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#B54747] hover:bg-[#FDF2F2] font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
