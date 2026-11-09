import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
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
        <h1 className="text-2xl font-extrabold text-[#142640] font-heading tracking-tight">
          Reset your password
        </h1>
        <p className="mt-1 text-xs text-[#687570]">
          Enter your work email address to receive recovery instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl sm:rounded-3xl border border-[#E5EAE6] shadow-resting space-y-6">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#EBF7F0] text-[#218653] flex items-center justify-center mx-auto border border-[#C3E7D3]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#142640] font-heading">
                Instructions sent
              </h3>
              <p className="text-xs text-[#687570] leading-relaxed">
                If an account exists for <strong>{email}</strong>, a password reset link has been dispatched.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#218653] hover:underline inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
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
                    required
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Send Reset Link</span>
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#218653] hover:underline inline-flex items-center gap-1.5"
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
