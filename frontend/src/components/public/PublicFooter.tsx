import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, ArrowUp, Github } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0E1C30] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Vision Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-subtle relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/20 to-[#A855F7]/20" />
                <Layers className="w-5 h-5 text-[#6366F1]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-lg tracking-tight text-white">
                    KNOWFLOW
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#28A766] bg-[#218653]/20 px-2 py-0.5 rounded-full border border-[#218653]/40">
                    By NOVYX
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-200">
              Intelligent Knowledge. Seamless Handover.
            </p>

            <blockquote className="text-xs text-slate-400 italic border-l-2 border-[#218653] pl-3 py-0.5 max-w-sm">
              &ldquo;When a person leaves a project, their knowledge should not leave with them.&rdquo;
            </blockquote>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An evidence-based, permission-aware employee knowledge handover platform that
              reconstructs project state and generates role-appropriate briefings with verifiable citations.
            </p>
          </div>

          {/* Navigation Links Column 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#problem" className="hover:text-white transition-colors">
                  The Problem
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  10-Step Handover
                </a>
              </li>
              <li>
                <a href="#evidence" className="hover:text-white transition-colors">
                  Evidence System
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-white transition-colors">
                  Role-Specific Briefs
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Platform Features
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition-colors">
                  Security & Access
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Links Column 2: Handover Roles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Supported Roles
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-slate-200 transition-colors">Project Managers & Leads</li>
              <li className="hover:text-slate-200 transition-colors">Backend Engineers</li>
              <li className="hover:text-slate-200 transition-colors">Frontend Engineers</li>
              <li className="hover:text-slate-200 transition-colors">DevOps & Cloud Engineers</li>
              <li className="hover:text-slate-200 transition-colors">UI/UX Designers</li>
              <li className="hover:text-slate-200 transition-colors">QA & Reliability Engineers</li>
            </ul>
          </div>

          {/* Navigation Links Column 3: Governance & App */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Access & App
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  Create Workspace
                </Link>
              </li>
              <li>
                <Link to="/app/overview" className="hover:text-white transition-colors text-[#28A766] font-semibold">
                  Live Product Workspace
                </Link>
              </li>
              <li>
                <Link to="/app/reports" className="hover:text-white transition-colors">
                  Sample Handover Reports
                </Link>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#218653]" />
                  <span>SOC2 & Git Read-Only Safe</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} KNOWFLOW. Built by Team NOVYX.</span>
            <span className="text-slate-600">•</span>
            <span>All project continuity rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
