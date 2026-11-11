import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { requestPasswordReset } from '../../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await requestPasswordReset(email.trim()); setSubmitted(true); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not send a reset email.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#F2EDF8] selection:text-[#704B91]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#32164C] flex items-center justify-center text-white shadow-subtle relative overflow-hidden group-hover:bg-[#241036] transition-colors">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/30 to-[#A855F7]/30 opacity-70" />
            <Layers className="w-5 h-5 text-white relative z-10" />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-[#32164C]">
            KNOWFLOW
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-[#32164C] font-heading tracking-tight">
          Reset your password
        </h1>
        <p className="mt-1 text-xs text-[#697586]">
          Enter your work email address to receive recovery instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-6">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F2EDF8] text-[#704B91] flex items-center justify-center mx-auto border border-[#E4D9EF]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#32164C] font-heading">
                Instructions sent
              </h3>
              <p className="text-xs text-[#697586] leading-relaxed">
                If an account exists for <strong>{email}</strong>, a password reset link has been dispatched.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#704B91] hover:underline inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex gap-2"><AlertCircle size={15}/>{error}</p>}
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
                    required
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E8E0EF] rounded-xl focus:border-[#704B91] focus:ring-1 focus:ring-[#704B91] text-[#32164C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#704B91] hover:bg-[#5D3B7B] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>{loading ? 'Sending…' : 'Send Reset Link'}</span>
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#704B91] hover:underline inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to sign in</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
