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

  const { login, switchUser } = useAuth();
  const [email, setEmail] = useState('sarah.lin@knowflow.io');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your work email address.');
      return;
    }
    const result = login(email, password);
    navigate(result.redirectPath);
  };

  const handleQuickSignIn = (userId: string, roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('demopassword123');
    switchUser(userId);
    const result = login(roleEmail);
    navigate(result.redirectPath);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col lg:flex-row font-sans selection:bg-[#EBF7F0] selection:text-[#218653]">
      {/* LEFT COLUMN: Clean Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div>
          {/* Top Brand & Back to Home Link */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#142640] flex items-center justify-center text-white shadow-subtle relative overflow-hidden group-hover:bg-[#0E1C30] transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/30 to-[#A855F7]/30 opacity-70" />
                <Layers className="w-5 h-5 text-white relative z-10" />
              </div>
              <span className="font-heading font-extrabold text-lg tracking-tight text-[#142640]">
                KNOWFLOW
              </span>
            </Link>

            <Link
              to="/"
              className="text-xs font-semibold text-[#687570] hover:text-[#142640] flex items-center gap-1 transition-colors"
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
              Sign in to your workspace
            </h1>
            <p className="text-xs sm:text-sm text-[#687570]">
              Role is verified automatically by your account. Single sign-in for managers and team members.
            </p>
          </div>

          {/* Main Login Form Container */}
          <div className="max-w-md mx-auto lg:mx-0 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E5EAE6] shadow-resting space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8C8C8] text-xs text-[#B54747]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#142640] mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#142640]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#218653] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded text-[#218653] focus:ring-[#218653]"
                  />
                  <span className="text-xs text-[#687570]">Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Helper under form per spec: "Invited by your manager? Check your email..." */}
            <div className="p-3 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] text-xs text-[#687570] flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-[#218653] shrink-0 mt-0.5" />
              <div>
                <span>Invited by your manager? Check your work email for your direct invitation link, or </span>
                <Link to="/invite/inv-rutika" className="text-[#218653] font-bold hover:underline">
                  click here to simulate accepting an invitation
                </Link>.
              </div>
            </div>

            {/* Role Test Switcher for Evaluators / Hackathon Judges */}
            <div className="pt-3 border-t border-[#E5EAE6] space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E9B96] block text-center">
                Evaluation Test Logins (1-Click Switch)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSignIn('usr-1', 'sarah.lin@knowflow.io')}
                  className="p-2 rounded-xl bg-[#F5F7F6] hover:bg-[#EBF7F0] border border-[#E5EAE6] hover:border-[#C3E7D3] text-left transition-colors"
                >
                  <strong className="block text-xs text-[#142640]">Sarah Lin</strong>
                  <span className="text-[10px] text-[#218653] font-semibold">Manager</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickSignIn('usr-2', 'rutika.ghanwat@knowflow.io')}
                  className="p-2 rounded-xl bg-[#F5F7F6] hover:bg-[#EBF7F0] border border-[#E5EAE6] hover:border-[#C3E7D3] text-left transition-colors"
                >
                  <strong className="block text-xs text-[#142640]">Rutika G.</strong>
                  <span className="text-[10px] text-[#B7791F] font-semibold">Departing</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickSignIn('usr-3', 'marcus.vance@knowflow.io')}
                  className="p-2 rounded-xl bg-[#F5F7F6] hover:bg-[#EBF7F0] border border-[#E5EAE6] hover:border-[#C3E7D3] text-left transition-colors"
                >
                  <strong className="block text-xs text-[#142640]">Marcus V.</strong>
                  <span className="text-[10px] text-[#2F6B5D] font-semibold">Incoming</span>
                </button>
              </div>
            </div>
          </div>

          {/* Toggle to Sign Up with invitation clarification */}
          <div className="text-center lg:text-left text-xs text-[#687570] mt-6 max-w-md space-y-1">
            <p>
              Joining a team? Use the invitation link from your manager.
            </p>
            <p>
              Managing a new organization?{' '}
              <Link to="/signup" className="text-[#218653] font-bold hover:underline">
                Create manager workspace &rarr;
              </Link>
            </p>
          </div>
        </div>

        {/* Legal Footer Note */}
        <div className="pt-8 text-center lg:text-left text-[11px] text-[#8E9B96]">
          &copy; {new Date().getFullYear()} KNOWFLOW. Built by Team NOVYX. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: Dark Navy Showcase Panel (#142640) */}
      <div className="hidden lg:flex w-1/2 bg-[#142640] p-12 lg:p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Ambient Decorative Blur */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#218653]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Logo Mark: Purple on Crisp White Tile */}
          <div className="inline-flex items-center gap-3 bg-[#18304F] border border-[#23416B] p-2.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-subtle relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/20 to-[#A855F7]/20" />
              <Layers className="w-6 h-6 text-[#6366F1]" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-base tracking-tight text-white">
                KNOWFLOW
              </div>
              <div className="text-[10px] font-bold text-[#28A766] uppercase tracking-wider">
                Built by Team NOVYX
              </div>
            </div>
          </div>

          <div className="space-y-3 max-w-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-[#28A766] bg-[#218653]/25 px-3 py-1 rounded-full border border-[#218653]/40">
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
        <div className="relative z-10 bg-[#18304F] rounded-2xl border border-[#23416B] p-6 space-y-4 max-w-lg shadow-raised">
          <div className="flex items-center justify-between border-b border-[#23416B] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#28A766] animate-pulse" />
              <span className="text-xs font-bold text-white">The Three Handover Perspectives</span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#28A766] bg-[#218653]/30 px-2 py-0.5 rounded-full border border-[#218653]/40">
              Proposal Model
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-[#218653] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
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
              <div className="w-5 h-5 rounded-full bg-[#2F6B5D] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
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
