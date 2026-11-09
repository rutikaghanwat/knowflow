import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building2,
  Briefcase,
  ArrowLeft,
  HelpCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Strong password metrics
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);
  const isPasswordStrong = hasMinLength && hasUpperCase && hasNumberOrSymbol;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid work email is required.';
    if (!organizationName.trim()) errs.organizationName = 'Organisation name is required.';
    if (!designation.trim()) errs.designation = 'Role or designation is required.';
    if (!isPasswordStrong) errs.password = 'Password does not meet the security requirements.';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (!agreeTerms) errs.agreeTerms = 'You must agree to the data protection terms.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await register({
        fullName,
        email,
        password,
        organizationName,
        designation,
      });

      if (res.requiresEmailVerification) {
        setIsSuccess(true);
      } else {
        navigate(res.redirectPath);
      }
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to create workspace.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col lg:flex-row font-sans selection:bg-[#EBF7F0] selection:text-[#218653]">
      {/* LEFT COLUMN: Clean Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div>
          {/* Top Brand & Back to Home */}
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

          {/* Verification Pending Screen State */}
          {isSuccess ? (
            <div className="max-w-md mx-auto lg:mx-0 bg-white p-8 rounded-3xl border border-[#C3E7D3] shadow-resting text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#EBF7F0] text-[#218653] flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-[#142640] font-heading">
                  Verify your work email
                </h2>
                <p className="text-xs sm:text-sm text-[#687570] leading-relaxed">
                  We've dispatched an activation link to <strong>{email}</strong> for organization <strong>{organizationName}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] text-xs text-[#687570] text-left space-y-2">
                <div className="flex items-center gap-2 text-[#142640] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#218653]" />
                  <span>Initial Administrator Workspace Provisioned</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  As the primary administrator, verifying your email unlocks project creation, member invites, and repository ingestion controls.
                </p>
              </div>

              <button
                onClick={() => navigate('/app/overview')}
                className="w-full py-3.5 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Continue to Manager Workspace (Dev Mode)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Form Header */}
              <div className="max-w-md mx-auto lg:mx-0 space-y-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#EBF7F0] text-[#218653] border border-[#C3E7D3]">
                  <span>Organization Administrator Setup</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
                  Create Manager Workspace
                </h1>
                <p className="text-xs sm:text-sm text-[#687570]">
                  Register your organization to initiate handovers, manage permissions, and govern technical knowledge continuity.
                </p>
              </div>

              {/* Main Registration Form */}
              <div className="max-w-md mx-auto lg:mx-0 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
                {errors.form && (
                  <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8C8C8] text-xs text-[#B54747] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.form}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#142640] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Sarah Lin"
                        required
                        className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-[#B54747] mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Work Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#142640] mb-1">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah.lin@company.com"
                        required
                        className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-[#B54747] mt-1">{errors.email}</p>}
                  </div>

                  {/* Organization & Designation Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#142640] mb-1">
                        Organisation
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-[#8E9B96] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          placeholder="Acme Inc."
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                        />
                      </div>
                      {errors.organizationName && <p className="text-[11px] text-[#B54747] mt-1">{errors.organizationName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#142640] mb-1">
                        Designation
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-[#8E9B96] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="Project Manager"
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                        />
                      </div>
                      {errors.designation && <p className="text-[11px] text-[#B54747] mt-1">{errors.designation}</p>}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-[#142640] mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E9B96] hover:text-[#142640]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Checklist */}
                    <div className="pt-2 grid grid-cols-3 gap-1 text-[10px]">
                      <span className={`inline-flex items-center gap-1 ${hasMinLength ? 'text-[#218653] font-semibold' : 'text-[#8E9B96]'}`}>
                        <CheckCircle2 className="w-3 h-3" /> 8+ chars
                      </span>
                      <span className={`inline-flex items-center gap-1 ${hasUpperCase ? 'text-[#218653] font-semibold' : 'text-[#8E9B96]'}`}>
                        <CheckCircle2 className="w-3 h-3" /> 1 uppercase
                      </span>
                      <span className={`inline-flex items-center gap-1 ${hasNumberOrSymbol ? 'text-[#218653] font-semibold' : 'text-[#8E9B96]'}`}>
                        <CheckCircle2 className="w-3 h-3" /> number/symbol
                      </span>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-[#142640] mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-[11px] text-[#B54747] mt-1">{errors.confirmPassword}</p>}
                  </div>

                  {/* Terms */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="rounded text-[#218653] focus:ring-[#218653] mt-0.5"
                      />
                      <span className="text-[11px] text-[#687570] leading-relaxed">
                        I authorize KNOWFLOW to set up our organization workspace and agree to data protection and read-only source governance policies.
                      </span>
                    </label>
                    {errors.agreeTerms && <p className="text-[11px] text-[#B54747] mt-1">{errors.agreeTerms}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Creating Workspace...' : 'Create Manager Account & Workspace'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Helper for Employees per spec */}
                <div className="p-3 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] text-xs text-[#687570] flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-[#218653] shrink-0 mt-0.5" />
                  <div>
                    <strong>Invited by your manager?</strong>
                    <p className="text-[11px] mt-0.5">
                      Do not register here. Use the invitation link sent to your work email to activate your employee profile.
                    </p>
                  </div>
                </div>
              </div>

              {/* Switch back to Login */}
              <div className="text-center lg:text-left text-xs text-[#687570] mt-4 max-w-md">
                Already registered?{' '}
                <Link to="/login" className="text-[#218653] font-bold hover:underline">
                  Sign in here &rarr;
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 text-center lg:text-left text-[11px] text-[#8E9B96]">
          &copy; {new Date().getFullYear()} KNOWFLOW. Built by Team NOVYX.
        </div>
      </div>

      {/* RIGHT COLUMN: Navy Brand Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#142640] p-12 lg:p-16 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#218653]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
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
                Manager Workspace Provisioning
              </div>
            </div>
          </div>

          <div className="space-y-3 max-w-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-[#28A766] bg-[#218653]/25 px-3 py-1 rounded-full border border-[#218653]/40">
              Primary Administrator Authority
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight leading-snug">
              Govern the complete knowledge handover lifecycle.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              As the Project Manager, you control who participates, what repositories are ingested, which findings are released, and when transitions are formally signed off.
            </p>
          </div>
        </div>

        {/* Governance Checklist Card */}
        <div className="relative z-10 bg-[#18304F] rounded-2xl border border-[#23416B] p-6 space-y-3.5 max-w-lg shadow-raised">
          <span className="text-xs font-bold text-white uppercase tracking-wider block">
            What you can manage as Administrator
          </span>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#28A766] shrink-0" />
              <span>Multi-Project Handover Scopes & Deadlines</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#28A766] shrink-0" />
              <span>Role-Tailored Dossiers (Backend, Frontend, DevOps)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#28A766] shrink-0" />
              <span>Read-Only GitHub and Document Ingestion Controls</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#28A766] shrink-0" />
              <span>Immutable Audit Logs and Digital Sign-Off Signatures</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 font-medium">
          Intelligent Knowledge. Seamless Handover. &bull; Team NOVYX
        </div>
      </div>
    </div>
  );
};
