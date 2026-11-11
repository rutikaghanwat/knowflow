import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !organization.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true); setError('');
    try { await register(email, password, name, organization, 'Project Manager'); navigate('/app/overview'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not create your workspace.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FC] flex flex-col lg:flex-row font-sans selection:bg-[#F2EDF8] selection:text-[#704B91]">
      {/* LEFT COLUMN: Clean Registration Form */}
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

          {/* Form Header */}
          <div className="max-w-md mx-auto lg:mx-0 space-y-2 mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#32164C] font-heading tracking-tight">
              Create your organization workspace
            </h1>
            <p className="text-xs sm:text-sm text-[#697586]">
              Start capturing verified project knowledge and structuring flawless team handovers.
            </p>
          </div>

          {/* Main Signup Form Container */}
          <div className="max-w-md mx-auto lg:mx-0 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8C8C8] text-xs text-[#B54747]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#32164C] mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#89919D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E8E0EF] rounded-xl focus:border-[#704B91] focus:ring-1 focus:ring-[#704B91] text-[#32164C]"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#32164C] mb-1.5">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#89919D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={organization}
                      onChange={e => setOrganization(e.target.value)}
                      placeholder="Acme Tech"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E8E0EF] rounded-xl focus:border-[#704B91] focus:ring-1 focus:ring-[#704B91] text-[#32164C]"
                    />
                  </div>
                </div>


              </div>

              <div>
                <label className="block text-xs font-bold text-[#32164C] mb-1.5">
                  Choose Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#89919D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E8E0EF] rounded-xl focus:border-[#704B91] focus:ring-1 focus:ring-[#704B91] text-[#32164C]"
                  />
                </div>
              </div>

              <div className="text-[11px] text-[#697586] leading-tight">
                Creating a workspace makes you its owner. You can add existing KNOWFLOW accounts to projects and assign their project roles.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#704B91] hover:bg-[#5D3B7B] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>{isSubmitting ? 'Creating workspace…' : 'Create Workspace'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link
                to="/app/overview"
                className="text-xs font-bold text-[#704B91] hover:underline"
              >
                Or explore the pre-loaded Live Demo Workspace &rarr;
              </Link>
            </div>
          </div>

          {/* Toggle to Sign In */}
          <p className="text-center lg:text-left text-xs text-[#697586] mt-6 max-w-md">
            Already have an active workspace?{' '}
            <Link to="/login" className="text-[#704B91] font-bold hover:underline">
              Sign in to your account &rarr;
            </Link>
          </p>
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
        <div className="relative z-10 bg-[#39204F] rounded-2xl border border-[#604477] p-6 space-y-3.5 max-w-lg shadow-raised">
          <div className="text-xs font-bold text-white border-b border-[#604477] pb-2">
            What happens after creating your workspace:
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-[#704B91] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="text-white">Connect GitHub & Upload Documents:</strong>
                <p className="text-[11px] text-slate-400">Read-only connection maps your repositories and extracts technical runbooks.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-[#704B91] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="text-white">Deep AI Analysis & State Reconstruction:</strong>
                <p className="text-[11px] text-slate-400">Identifies decisions, pending tasks, blockers, and implicit dependencies.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-[#704B91] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
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
