import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layers, ArrowRight, User, Mail, Lock, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const InviteAcceptPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { acceptInvitation } = useAuth();

  // If token has 'marcus', it's incoming backend engineer; otherwise departing
  const isIncoming = token?.includes('marcus') || token?.includes('incoming');
  const initialName = isIncoming ? 'Marcus Vance' : 'Rutika Ghanwat';
  const initialEmail = isIncoming ? 'marcus.vance@knowflow.io' : 'rutika.ghanwat@knowflow.io';
  const assignedRole = isIncoming ? 'Incoming Backend Engineer' : 'Departing Staff Platform Lead';
  const projectName = 'Core Payments & Ledger Migration';

  const [name, setName] = useState(initialName);
  const [email] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please choose a password to secure your account.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const redirectPath = acceptInvitation(token || 'inv-default', password, name);
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#EBF7F0] selection:text-[#218653]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#142640] flex items-center justify-center text-white shadow-subtle relative overflow-hidden group-hover:bg-[#0E1C30] transition-colors">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/30 to-[#A855F7]/30 opacity-70" />
            <Layers className="w-5 h-5 text-white relative z-10" />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-[#142640]">
            KNOWFLOW
          </span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7F0] text-[#218653] border border-[#C3E7D3] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Project Handover Invitation</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#142640] font-heading tracking-tight">
          Set up your employee account
        </h1>
        <p className="mt-1 text-xs text-[#687570]">
          You have been invited by <strong>Sarah Lin (Project Manager)</strong> to join KNOWFLOW
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl sm:rounded-3xl border border-[#E5EAE6] shadow-resting space-y-5">
          {/* Invitation Assignment Card */}
          <div className="p-4 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#142640]">Assigned Handover:</span>
              <span className="font-bold text-[#218653] bg-[#EBF7F0] px-2 py-0.5 rounded-full border border-[#C3E7D3]">
                {assignedRole}
              </span>
            </div>
            <p className="text-[11px] text-[#687570]">
              Project: <strong className="text-[#142640]">{projectName}</strong>
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8C8C8] text-xs text-[#B54747]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#142640] mb-1.5">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142640] mb-1.5">
                Work Email Address (Locked by Manager)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5F7F6] border border-[#E5EAE6] rounded-xl text-[#687570] cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142640] mb-1.5">
                Create a Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142640] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
                className="rounded text-[#218653] focus:ring-[#218653]"
              />
              <label htmlFor="terms" className="text-xs text-[#687570] cursor-pointer">
                I accept the project handover confidentiality guidelines
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Accept Invitation & Join Handover</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-[#687570]">
            Already activated this account?{' '}
            <Link to="/login" className="text-[#218653] font-bold hover:underline">
              Sign in directly
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
