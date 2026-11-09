import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const getHomePath = () => {
    if (currentUser.perspective === 'departing') return '/app/my-handover';
    if (currentUser.perspective === 'incoming') return '/app/my-report';
    return '/app/overview';
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E5EAE6] p-8 text-center shadow-resting space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#FEF7EB] text-[#B7791F] flex items-center justify-center mx-auto border border-[#F6DEB5]">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B7791F] bg-[#FEF7EB] px-2.5 py-0.5 rounded-full border border-[#F6DEB5]">
            Access Restricted
          </span>
          <h1 className="text-2xl font-extrabold text-[#142640] font-heading tracking-tight">
            You don't have access to this page
          </h1>
          <p className="text-xs text-[#687570] leading-relaxed">
            Your current account role (<strong>{currentUser.role} &bull; {currentUser.perspective.toUpperCase()}</strong>)
            does not have permission to view or manage this section.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] text-left text-xs text-[#687570] space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-[#142640]">
            <ShieldAlert className="w-4 h-4 text-[#218653]" />
            <span>KNOWFLOW Permission Boundary</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Manager governance enforces role-specific views so sensitive administrative settings and unapproved handover dossiers remain protected.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(getHomePath())}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to My Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
