import React from 'react';
import {
  User,
  Mail,
  Building2,
  Briefcase,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  FolderGit2,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';

export const EmployeeProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <PageHeader
        title="My Profile & Permissions"
        description="Your employee identity, assigned handover role, and data access boundaries."
        badge="Account"
      />

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5EAE6] shadow-resting space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#218653]"
          />
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#142640] font-heading">
              {currentUser.name}
            </h2>
            <p className="text-xs text-[#687570]">{currentUser.role} &bull; {currentUser.organization}</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
              <ShieldCheck className="w-3 h-3" />
              <span>Perspective: {currentUser.perspective.toUpperCase()}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E5EAE6] text-xs">
          <div className="p-4 rounded-2xl bg-[#F5F7F6] space-y-1">
            <span className="text-[#687570] block">Work Email Address</span>
            <strong className="text-[#142640]">{currentUser.email}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F7F6] space-y-1">
            <span className="text-[#687570] block">Timezone</span>
            <strong className="text-[#142640]">{currentUser.timezone}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F7F6] space-y-1">
            <span className="text-[#687570] block">Active Assigned Scope</span>
            <strong className="text-[#142640]">{currentUser.activeProjectName}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F7F6] space-y-1">
            <span className="text-[#687570] block">Access Enforcement</span>
            <strong className="text-[#218653]">Server-Side Token RBAC</strong>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-5 rounded-2xl bg-[#142640] text-white flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-[#218653]/30 text-[#28A766] flex items-center justify-center shrink-0">
          <KeyRound className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-white">Role-Based Permission Governance</h4>
          <p className="text-slate-300 leading-relaxed">
            Your permissions are granted per handover scope by your Project Manager. You only have access to documents, repositories, and findings explicitly cleared for your active role.
          </p>
        </div>
      </div>
    </div>
  );
};
