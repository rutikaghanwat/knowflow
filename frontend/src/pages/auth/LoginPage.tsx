import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  ArrowLeft,
  Sparkles,
  UserCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSessionExpired = searchParams.get('session') === 'expired';

  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!email.trim() || !password) { setError('Enter your work email and password.'); return; }
    try { const result = await login(email, password); navigate(result.redirectPath); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to sign in.'); }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FC] flex flex-col lg:flex-row font-sans selection:bg-[#F2EDF8] selection:text-[#704B91]">
      {/* LEFT COLUMN: Clean Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div>
          {/* Top Brand & Back to Home Link */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#32164C] flex items-center justify-center text-white shadow-subtle relative overflow-hidden group-hover:bg-[#241036] transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/30 to-[#A855F7]/30 opacity-70" />
                <Layers className="w-5 h-5 text-white relative z-10" />
              </div>
              <span className="font-heading font-extrabold text-lg tracking-tight text-[#32164C]">
                KNOWFLOW
              </span>
            </Link>

            <Link
              to="/"
              className="text-xs font-semibold text-[#697586] hover:text-[#32164C] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
          </div>

          {/* Session Expired Banner if triggered */}
          {isSessionExpired && (
            <div className="max-w-md mx-auto lg:mx-0 mb-6 p-3.5 rounded-2xl bg-[#FEF7EB] border border-[#F6DEB5] flex items-start gap-3 text-xs text-[#B7791F]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Your session has expired</strong>
                <span>Please sign back in with your company credentials to continue your handover work.</span>
              </div>
            </div>
          )}

          {/* Form Header */}
          <div className="max-w-md mx-auto lg:mx-0 space-y-2 mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#32164C] font-heading tracking-tight">
              Sign in to your workspace
            </h1>
            <p className="text-xs sm:text-sm text-[#697586]">
              Role is verified automatically by your account. Single sign-in for managers and team members.
            </p>
          </div>

          {/* Main Login Form Container */}
          <div className="max-w-md mx-auto lg:mx-0 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8C8C8] text-xs text-[#B54747]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#32164C] mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#89919D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E8E0EF] rounded-xl focus:border-[#704B91] focus:ring-1 focus:ring-[#704B91] text-[#32164C]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#32164C]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#704B91] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#89919D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E8E0EF] rounded-xl focus:border-[#704B91] focus:ring-1 focus:ring-[#704B91] text-[#32164C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#704B91] hover:bg-[#5D3B7B] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>{isLoading ? 'Signing in…' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="p-3 rounded-xl bg-[#F2EDF8] border border-[#E4D9EF] text-xs text-[#5B4770] flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-[#704B91] shrink-0 mt-0.5" />
              <span>Use the account created in your KNOWFLOW Supabase project. Demo shortcuts are disabled so authentication always uses real credentials.</span>
            </div>
          </div>

          {/* Toggle to Sign Up with invitation clarification */}
          <div className="text-center lg:text-left text-xs text-[#697586] mt-6 max-w-md space-y-1">
            <p>
              Joining a team? Use the invitation link from your manager.
            </p>
            <p>
              Managing a new organization?{' '}
              <Link to="/signup" className="text-[#704B91] font-bold hover:underline">
                Create manager workspace &rarr;
              </Link>
            </p>
          </div>
        </div>

        {/* Legal Footer Note */}
        <div className="pt-8 text-center lg:text-left text-[11px] text-[#89919D]">
          &copy; {new Date().getFullYear()} KNOWFLOW. Built by Team NOVYX. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: Dark Navy Showcase Panel (#32164C) */}
      <div className="hidden lg:flex w-1/2 bg-[#32164C] p-12 lg:p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Ambient Decorative Blur */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#704B91]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Logo Mark: Purple on Crisp White Tile */}
          <div className="inline-flex items-center gap-3 bg-[#39204F] border border-[#604477] p-2.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-subtle relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/20 to-[#A855F7]/20" />
              <Layers className="w-6 h-6 text-[#6366F1]" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-base tracking-tight text-white">
                KNOWFLOW
              </div>
              <div className="text-[10px] font-bold text-[#BDA4D2] uppercase tracking-wider">
                Built by Team NOVYX
              </div>
            </div>
          </div>

          <div className="space-y-3 max-w-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-[#BDA4D2] bg-[#704B91]/25 px-3 py-1 rounded-full border border-[#704B91]/40">
              Role-Aware Continuity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight leading-snug">
              When a person leaves a project, their knowledge should not leave with them.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Whether you are a departing contributor submitting runbooks or an incoming engineer reviewing
              verified architecture decisions, KNOWFLOW provides a seamless, evidence-backed transition.
            </p>
          </div>
        </div>

        {/* 3 Personas Summary Mini-Card in Right Panel */}
        <div className="relative z-10 bg-[#39204F] rounded-2xl border border-[#604477] p-6 space-y-4 max-w-lg shadow-raised">
          <div className="flex items-center justify-between border-b border-[#604477] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#BDA4D2] animate-pulse" />
              <span className="text-xs font-bold text-white">The Three Handover Perspectives</span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#BDA4D2] bg-[#704B91]/30 px-2 py-0.5 rounded-full border border-[#704B91]/40">
              Proposal Model
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-[#704B91] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                M
              </div>
              <div>
                <strong className="text-white">Project Manager:</strong>
                <p className="text-[11px] text-slate-400">Initiates handovers, authorizes sources, audits evidence, and approves release.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-[#B7791F] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                D
              </div>
              <div>
                <strong className="text-white">Departing Employee:</strong>
                <p className="text-[11px] text-slate-400">Uploads runbooks and specs, confirms GitHub access, clarifies ambiguities.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-[#704B91] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                I
              </div>
              <div>
                <strong className="text-white">Incoming Employee:</strong>
                <p className="text-[11px] text-slate-400">Receives approved role-specific report, inspects citations, and acknowledges.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 text-xs text-slate-400 font-medium">
          Intelligent Knowledge. Seamless Handover. &bull; Enterprise Ready
        </div>
      </div>
    </div>
  );
};
