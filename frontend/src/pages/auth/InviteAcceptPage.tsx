import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Building2,
  FolderGit2,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthService, InviteValidationResult } from '../../services/authService';

export const InviteAcceptPage: React.FC = () => {
  const { token = 'inv-rutika' } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { acceptInvitation } = useAuth();

  const [loading, setLoading] = useState(true);
  const [validation, setValidation] = useState<InviteValidationResult>({ isValid: false });

  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const runValidation = async () => {
      setLoading(true);
      const res = await AuthService.validateInviteToken(token);
      if (isMounted) {
        setValidation(res);
        if (res.isValid && res.inviteDetails) {
          setFullName(res.inviteDetails.perspective === 'incoming' ? 'Marcus Vance' : 'Rutika Ghanwat');
        }
        setLoading(false);
      }
    };
    runValidation();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || password.length < 8) {
      setError('Please choose a password of at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to technical confidentiality terms.');
      return;
    }

    setIsSubmitting(true);
    try {
      const redirectPath = await acceptInvitation(token, password);
      navigate(redirectPath);
    } catch (err: any) {
      setError(err?.message || 'Failed to accept invitation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7F6] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#218653] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#687570] font-medium">Validating invitation token...</p>
        </div>
      </div>
    );
  }

  // Handle Invalid, Expired, or Used Token States
  if (!validation.isValid) {
    return (
      <div className="min-h-screen bg-[#F5F7F6] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#142640] flex items-center justify-center text-white shadow-subtle">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-[#142640]">
              KNOWFLOW
            </span>
          </Link>

          <div className="bg-white p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF7EB] text-[#B7791F] flex items-center justify-center mx-auto">
              {validation.errorType === 'expired' ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <ShieldAlert className="w-7 h-7" />
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-extrabold text-[#142640] font-heading">
                {validation.errorType === 'expired'
                  ? 'Invitation Link Expired'
                  : validation.errorType === 'used'
                  ? 'Invitation Already Used'
                  : 'Invalid Invitation Link'}
              </h1>
              <p className="text-xs text-[#687570] leading-relaxed">
                {validation.errorMessage}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full py-2.5 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold transition-all"
              >
                Go to Sign In
              </Link>
              <Link
                to="/"
                className="w-full py-2.5 rounded-full border border-[#E5EAE6] hover:bg-[#F5F7F6] text-[#142640] text-xs font-semibold transition-all"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { inviteDetails } = validation;

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
          <span>Verified Team Invitation</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#142640] font-heading tracking-tight">
          Set up your employee account
        </h1>
        <p className="mt-1 text-xs text-[#687570]">
          Invited by <strong>{inviteDetails?.inviterName}</strong> &bull; Token valid {inviteDetails?.expiresAt}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl sm:rounded-3xl border border-[#E5EAE6] shadow-resting space-y-5">
          {/* Invitation Assignment Details Card */}
          <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5EAE6]">
              <span className="text-[#687570]">Organisation</span>
              <span className="font-bold text-[#142640] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#218653]" />
                {inviteDetails?.organization}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[#E5EAE6]">
              <span className="text-[#687570]">Project Scope</span>
              <span className="font-semibold text-[#142640] flex items-center gap-1">
                <FolderGit2 className="w-3.5 h-3.5 text-[#218653]" />
                {inviteDetails?.projectName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#687570]">Role Assignment</span>
              <span className="font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                {inviteDetails?.roleName}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8C8C8] text-xs text-[#B54747]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Read-Only Verified Email */}
            <div>
              <label className="block text-xs font-bold text-[#142640] mb-1">
                Invited Work Email (Read-Only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={inviteDetails?.email || ''}
                  readOnly
                  disabled
                  className="w-full pl-10 pr-3.5 py-2 text-xs bg-[#F5F7F6] border border-[#E5EAE6] rounded-xl text-[#687570] cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-[#142640] mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#142640] mb-1">
                Create Account Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                />
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
                  placeholder="Repeat your password"
                  required
                  className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                />
              </div>
            </div>

            {/* Confidentiality check */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-[#218653] focus:ring-[#218653] mt-0.5"
                />
                <span className="text-[11px] text-[#687570] leading-relaxed">
                  I agree to keep project knowledge, architecture runbooks, and credentials confidential in accordance with corporate data policy.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Activating Account...' : 'Accept Invitation & Enter Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Security footnote */}
          <div className="p-3 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] text-[11px] text-[#687570] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#218653] shrink-0" />
            <span>Role-scoped access: invitations never grant manager administration rights.</span>
          </div>
        </div>

        <div className="text-center text-xs text-[#687570] mt-6">
          Already activated your account?{' '}
          <Link to="/login" className="text-[#218653] font-bold hover:underline">
            Sign in &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
