import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  User,
  Mail,
  Building,
  Lock,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('Project Manager');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !organization.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    navigate('/app/overview');
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col lg:flex-row font-sans selection:bg-[#EBF7F0] selection:text-[#218653]">
      {/* LEFT COLUMN: Clean Registration Form */}
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

          {/* Form Header */}
          <div className="max-w-md mx-auto lg:mx-0 space-y-2 mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
              Create your organization workspace
            </h1>
            <p className="text-xs sm:text-sm text-[#687570]">
              Start capturing verified project knowledge and structuring flawless team handovers.
            </p>
          </div>

          {/* Main Signup Form Container */}
          <div className="max-w-md mx-auto lg:mx-0 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E5EAE6] shadow-resting space-y-5">
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
                    placeholder="Sarah Lin"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#142640] mb-1.5">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={organization}
                      onChange={e => setOrganization(e.target.value)}
                      placeholder="Acme Tech"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142640] mb-1.5">
                    Primary Role
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                  >
                    <option value="Project Manager">Project Manager (Admin)</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="QA Engineer">QA Engineer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142640] mb-1.5">
                  Choose Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                  />
                </div>
              </div>

              <div className="text-[11px] text-[#687570] leading-tight">
                By creating a workspace, you agree to KNOWFLOW's Terms of Service and Privacy Policy. Read-only repository access is guaranteed.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Create Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link
                to="/app/overview"
                className="text-xs font-bold text-[#218653] hover:underline"
              >
                Or explore the pre-loaded Live Demo Workspace &rarr;
              </Link>
            </div>
          </div>

          {/* Toggle to Sign In */}
          <p className="text-center lg:text-left text-xs text-[#687570] mt-6 max-w-md">
            Already have an active workspace?{' '}
            <Link to="/login" className="text-[#218653] font-bold hover:underline">
              Sign in to your account &rarr;
            </Link>
          </p>
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
              Zero Context Loss
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight leading-snug">
              Every project has knowledge. Make sure none of it gets lost.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join engineering teams who trust KNOWFLOW to automate knowledge collection,
              reconstruct project state, and deliver verifiable handover reports.
            </p>
          </div>
        </div>

        {/* 3 Step Onboarding Flow Preview in Right Panel */}
        <div className="relative z-10 bg-[#18304F] rounded-2xl border border-[#23416B] p-6 space-y-3.5 max-w-lg shadow-raised">
          <div className="text-xs font-bold text-white border-b border-[#23416B] pb-2">
            What happens after creating your workspace:
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-[#218653] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="text-white">Connect GitHub & Upload Documents:</strong>
                <p className="text-[11px] text-slate-400">Read-only connection maps your repositories and extracts technical runbooks.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-[#218653] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="text-white">Deep AI Analysis & State Reconstruction:</strong>
                <p className="text-[11px] text-slate-400">Identifies decisions, pending tasks, blockers, and implicit dependencies.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-[#218653] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong className="text-white">Manager Review & Signed Off Transfer:</strong>
                <p className="text-[11px] text-slate-400">Project Manager reviews citations, approves report, and securely delivers it.</p>
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
