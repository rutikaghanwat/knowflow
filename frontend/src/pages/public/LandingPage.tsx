import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  FileQuestion,
  HelpCircle,
  GitBranch,
  Lock,
  Layers,
  ArrowRightLeft,
  Users,
  Compass,
  Check,
  Calendar,
  MessageSquareCode,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import { PublicFooter } from '../../components/public/PublicFooter';
import { WaveDivider } from '../../components/public/WaveDivider';
import { OrganicBlob } from '../../components/public/OrganicBlob';
import { ProductPreviewMockup } from '../../components/public/ProductPreviewMockup';
import { StepperTimeline } from '../../components/public/StepperTimeline';
import { EvidenceBadgeShowcase } from '../../components/public/EvidenceBadgeShowcase';
import { RoleReportShowcase } from '../../components/public/RoleReportShowcase';
import { FeaturesShowcase } from '../../components/public/FeaturesShowcase';
import { FaqAccordion } from '../../components/public/FaqAccordion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8FC] text-[#202B28] flex flex-col font-sans selection:bg-[#F2EDF8] selection:text-[#704B91]">
      {/* Morphing Navigation Bar */}
      <PublicNavbar />

      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Organic Ambient Gradient Blob */}
        <OrganicBlob />

        {/* Eyebrow / Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#F2EDF8] text-[#704B91] border border-[#E4D9EF] mb-6 shadow-subtle">
          <Sparkles className="w-3.5 h-3.5 text-[#BDA4D2]" />
          <span>Intelligent Knowledge. Seamless Handover.</span>
        </div>

        {/* Master Vision Headline */}
        <h1 className="fluid-h1 font-extrabold text-[#32164C] font-heading tracking-tight max-w-5xl mx-auto mb-6">
          When a person leaves a project,{' '}
          <span className="text-[#704B91]">their knowledge should not leave with them.</span>
        </h1>

        {/* Supporting Proposition */}
        <p className="fluid-p text-[#697586] max-w-3xl mx-auto leading-relaxed mb-10">
          KNOWFLOW captures authorized engineering knowledge from GitHub and technical documents,
          reconstructs current project state, and produces evidence-backed, role-specific handover
          reports that managers can review, correct, and sign off on.
        </p>

        {/* Liquid Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-6">
          <button
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#704B91] hover:bg-[#5D3B7B] text-white text-sm font-bold shadow-pill transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#32164C] text-sm font-bold border border-[#E8E0EF] shadow-resting transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>See How It Works</span>
          </a>
        </div>

        {/* Live Workspace Fast-Track */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#697586] mb-8">
          <span>Want to explore the live workspace directly?</span>
          <Link
            to="/app/overview"
            className="text-[#704B91] font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Open Demo Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* For Employees Strip per Section 1 */}
        <div className="max-w-3xl mx-auto mb-12 p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#E8E0EF] shadow-resting flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#704B91] bg-[#F2EDF8] px-2 py-0.5 rounded-full border border-[#E4D9EF]">
              <span>Role Pathways</span>
            </div>
            <p className="text-xs text-[#32164C]">
              <strong>Departing members:</strong> Upload runbooks and confirm GitHub access with zero manual writeups.
            </p>
            <p className="text-xs text-[#697586]">
              <strong>Incoming members:</strong> Receive approved, role-tailored handover dossiers with verifiable citations.
            </p>
          </div>
          <Link
            to="/login"
            className="px-4 py-2 rounded-full border border-[#E8E0EF] hover:border-[#704B91] text-xs font-bold text-[#32164C] hover:text-[#704B91] shrink-0 transition-colors shadow-subtle bg-white"
          >
            Joining a team? Sign in &rarr;
          </Link>
        </div>

        {/* Interactive Software Preview (Mirroring visual reference) */}
        <ProductPreviewMockup />
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section id="problem" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#704B91] bg-[#F2EDF8] px-3.5 py-1 rounded-full border border-[#E4D9EF]">
            The Continuity Crisis
          </span>
          <h2 className="fluid-h2 font-extrabold text-[#32164C] font-heading mt-3 tracking-tight">
            Every team loses critical context during transitions
          </h2>
          <p className="text-sm sm:text-base text-[#697586] mt-3">
            Traditional handovers rely on rushed exit meetings and incomplete documents.
            Crucial project state disappears the day the contributor walks out the door.
          </p>
        </div>

        {/* 4 Pain Point Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF2F2] text-[#B54747] flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#32164C] font-heading">
              Decisions Without Reasoning
            </h3>
            <p className="text-xs text-[#697586] leading-relaxed">
              Why was a specific database chosen? Why was a library replaced? Without documented rationale, replacements often repeat past mistakes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF7EB] text-[#B7791F] flex items-center justify-center">
              <FileQuestion className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#32164C] font-heading">
              Unclear Ownership & Secrets
            </h3>
            <p className="text-xs text-[#697586] leading-relaxed">
              Who manages third-party fraud credentials? Which staging servers are active? Ownership gaps cause unexpected outages.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF2F2] text-[#B54747] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#32164C] font-heading">
              Unresolved Work & Blockers
            </h3>
            <p className="text-xs text-[#697586] leading-relaxed">
              Unmerged feature branches, incomplete refactorings, and undocumented technical debt leave replacements stuck for weeks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F2EDF8] text-[#704B91] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#32164C] font-heading">
              Scattered Knowledge Silos
            </h3>
            <p className="text-xs text-[#697586] leading-relaxed">
              Critical runbook steps are isolated in terminal histories, Slack DMs, local scratchpads, and fragmented PDF runbooks.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHO IT HELPS (5 STAKEHOLDERS) */}
      <section id="who-it-helps" className="py-20 sm:py-28 bg-white border-y border-[#E8E0EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#704B91] bg-[#F2EDF8] px-3.5 py-1 rounded-full border border-[#E4D9EF]">
              Role-Aware Continuity
            </span>
            <h2 className="fluid-h2 font-extrabold text-[#32164C] font-heading mt-3 tracking-tight">
              Built for every stakeholder across the engineering lifecycle
            </h2>
            <p className="text-sm sm:text-base text-[#697586] mt-3">
              KNOWFLOW solves transition pain from the perspective of each individual contributor and manager.
            </p>
          </div>

          {/* 5 Stakeholder Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stakeholder 1 */}
            <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#FAF8FC] border border-[#E8E0EF] space-y-3">
              <span className="text-[11px] font-bold text-[#704B91] bg-[#F2EDF8] px-2.5 py-0.5 rounded-full border border-[#E4D9EF]">
                Departing Members
              </span>
              <h3 className="text-lg font-bold text-[#32164C] font-heading">
                Zero Friction Handover Creation
              </h3>
              <p className="text-xs text-[#697586] leading-relaxed">
                No tedious manual writing of 50-page handovers during exit week. KNOWFLOW extracts decisions and tasks directly from existing code commits and runbooks.
              </p>
            </div>

            {/* Stakeholder 2 */}
            <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#FAF8FC] border border-[#E8E0EF] space-y-3">
              <span className="text-[11px] font-bold text-[#704B91] bg-[#F2EDF8] px-2.5 py-0.5 rounded-full border border-[#E4D9EF]">
                Incoming Replacements
              </span>
              <h3 className="text-lg font-bold text-[#32164C] font-heading">
                Instant Context & Traceable Answers
              </h3>
              <p className="text-xs text-[#697586] leading-relaxed">
                Arrive on day one with an evidence-backed briefing tailored to your specific role. Every single claim links directly to the underlying code commit or document page.
              </p>
            </div>

            {/* Stakeholder 3 */}
            <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#FAF8FC] border border-[#E8E0EF] space-y-3">
              <span className="text-[11px] font-bold text-[#704B91] bg-[#F2EDF8] px-2.5 py-0.5 rounded-full border border-[#E4D9EF]">
                Project Managers & Leads
              </span>
              <h3 className="text-lg font-bold text-[#32164C] font-heading">
                Full Transition Governance & Sign-Off
              </h3>
              <p className="text-xs text-[#697586] leading-relaxed">
                As the primary administrator, review all facts, resolve missing information flags, add managerial comments, and formally approve the handover before release.
              </p>
            </div>

            {/* Stakeholder 4 */}
            <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#FAF8FC] border border-[#E8E0EF] space-y-3">
              <span className="text-[11px] font-bold text-[#704B91] bg-[#F2EDF8] px-2.5 py-0.5 rounded-full border border-[#E4D9EF]">
                Developers & DevOps
              </span>
              <h3 className="text-lg font-bold text-[#32164C] font-heading">
                Unbroken Velocity & Architecture Memory
              </h3>
              <p className="text-xs text-[#697586] leading-relaxed">
                Know exactly who wrote each service, which PR introduced breaking API changes, and how infrastructure scaling was configured without slowing down sprint goals.
              </p>
            </div>

            {/* Stakeholder 5 */}
            <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#FAF8FC] border border-[#E8E0EF] space-y-3 md:col-span-2 lg:col-span-1">
              <span className="text-[11px] font-bold text-[#704B91] bg-[#F2EDF8] px-2.5 py-0.5 rounded-full border border-[#E4D9EF]">
                Organizations & Leadership
              </span>
              <h3 className="text-lg font-bold text-[#32164C] font-heading">
                Institutional Knowledge Retention
              </h3>
              <p className="text-xs text-[#697586] leading-relaxed">
                Transform employee departures from operational crises into seamless handoffs. Retain intellectual property and maintain uninterrupted business delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS (10-STEP LIFECYCLE) */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#704B91] bg-[#F2EDF8] px-3.5 py-1 rounded-full border border-[#E4D9EF]">
            End-to-End Workflow
          </span>
          <h2 className="fluid-h2 font-extrabold text-[#32164C] font-heading mt-3 tracking-tight">
            A 10-step verified knowledge handover lifecycle
          </h2>
          <p className="text-sm sm:text-base text-[#697586] mt-3">
            From initial project setup and knowledge ingestion to managerial sign-off and digital acknowledgment.
          </p>
        </div>

        {/* Interactive 10-Step Lifecycle Component */}
        <StepperTimeline />
      </section>

      {/* SECTION 5: EVIDENCE YOU CAN TRUST */}
      <section id="evidence" className="py-20 sm:py-28 bg-white border-y border-[#E8E0EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#704B91] bg-[#F2EDF8] px-3.5 py-1 rounded-full border border-[#E4D9EF]">
              Verifiable Intelligence
            </span>
            <h2 className="fluid-h2 font-extrabold text-[#32164C] font-heading mt-3 tracking-tight">
              Every claim is backed by traceable evidence
            </h2>
            <p className="text-sm sm:text-base text-[#697586] mt-3">
              KNOWFLOW eliminates hallucinated assertions with a strict 4-badge classification system and clickable source citations.
            </p>
          </div>

          {/* Interactive Evidence Badge & Citation Drawer */}
          <EvidenceBadgeShowcase />
        </div>
      </section>

      {/* SECTION 6: ACCESS PERMISSION FIRST, ROLE RELEVANCE SECOND */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#704B91] bg-[#F2EDF8] px-3.5 py-1 rounded-full border border-[#E4D9EF]">
            Dual-Layer Governance
          </span>
          <h2 className="fluid-h2 font-extrabold text-[#32164C] font-heading mt-3 tracking-tight">
            Security boundary first. Role personalization second.
          </h2>
          <p className="text-sm sm:text-base text-[#697586] mt-3">
            KNOWFLOW ensures sensitive secrets are never leaked across permission lines while delivering exactly what each engineer needs.
          </p>
        </div>

        {/* 2-Layer Comparison Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Layer 1: Access Permission Boundary */}
          <div className="bg-white p-7 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F2EDF8] text-[#704B91] flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#704B91]">
                Security Boundary
              </span>
              <h3 className="text-xl font-bold text-[#32164C] font-heading">
                Layer 1: Access Permission Check
              </h3>
              <p className="text-xs sm:text-sm text-[#697586] leading-relaxed">
                Before any knowledge extraction occurs, KNOWFLOW validates the incoming engineer's authorization level against corporate IAM and GitHub organization permissions.
              </p>

              <div className="pt-2 space-y-2 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF8FC]">
                  <CheckCircle2 className="w-4 h-4 text-[#704B91]" />
                  <span>Only authorized repositories and documents are ingested</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF8FC]">
                  <CheckCircle2 className="w-4 h-4 text-[#704B91]" />
                  <span>Zero cross-contamination of unapproved project secrets</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E0EF] text-xs font-semibold text-[#32164C]">
              Guaranteed by: Read-only OAuth + Corporate RBAC
            </div>
          </div>

          {/* Layer 2: Role Relevance Personalization */}
          <div className="bg-white p-7 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#32164C] text-white flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#32164C]">
                Intelligence Ranking
              </span>
              <h3 className="text-xl font-bold text-[#32164C] font-heading">
                Layer 2: Role Relevance Filtering
              </h3>
              <p className="text-xs sm:text-sm text-[#697586] leading-relaxed">
                Within permitted sources, KNOWFLOW synthesizes content specifically tailored to the replacement's job function. No information overload.
              </p>

              <div className="pt-2 space-y-2 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF8FC]">
                  <CheckCircle2 className="w-4 h-4 text-[#704B91]" />
                  <span>Backend Engineers get DB schemas, migrations & locks</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF8FC]">
                  <CheckCircle2 className="w-4 h-4 text-[#704B91]" />
                  <span>Project Managers get milestone timelines & risk heatmaps</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E0EF] text-xs font-semibold text-[#32164C]">
              Guaranteed by: AST Tokenizer + Semantic Role Classifier
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: ROLE-SPECIFIC REPORTS */}
      <section id="roles" className="py-20 sm:py-28 bg-white border-y border-[#E8E0EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#704B91] bg-[#F2EDF8] px-3.5 py-1 rounded-full border border-[#E4D9EF]">
              Role-Specific Handover Reports
            </span>
            <h2 className="fluid-h2 font-extrabold text-[#32164C] font-heading mt-3 tracking-tight">
              Different roles need different answers
            </h2>
            <p className="text-sm sm:text-base text-[#697586] mt-3">
              Select a role below to preview how KNOWFLOW customizes findings and action checklists for each engineering discipline.
            </p>
          </div>

          {/* Interactive Role Report Showcase Component */}
          <RoleReportShowcase />
        </div>
      </section>

      {/* SECTION 8: 8 MAIN PLATFORM MODULES */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#704B91] bg-[#F2EDF8] px-3.5 py-1 rounded-full border border-[#E4D9EF]">
            Complete Platform Architecture
          </span>
          <h2 className="fluid-h2 font-extrabold text-[#32164C] font-heading mt-3 tracking-tight">
            Eight integrated modules powering seamless handovers
          </h2>
          <p className="text-sm sm:text-base text-[#697586] mt-3">
            A comprehensive, connected system designed to handle every facet of technical knowledge continuity.
          </p>
        </div>

        {/* 8 Features Grid Component */}
        <FeaturesShowcase />
      </section>

      {/* SECTION 9: SECURITY & GOVERNANCE (DARK NAVY SECTION) */}
      <section id="security" className="relative bg-[#32164C] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Wave Divider on top transition */}
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#BDA4D2] bg-[#704B91]/30 px-3.5 py-1 rounded-full border border-[#704B91]/50">
              Enterprise Governance & Security
            </span>
            <h2 className="fluid-h2 font-extrabold text-white font-heading tracking-tight">
              Built for strict enterprise compliance and data protection
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              KNOWFLOW treats your source code and documentation as mission-critical intellectual property.
            </p>
          </div>

          {/* 4 Security Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#39204F] p-6 rounded-2xl sm:rounded-3xl border border-[#604477] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#704B91]/20 text-[#BDA4D2] flex items-center justify-center">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">
                Read-Only Git Sync
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                KNOWFLOW never executes code, writes commits, or modifies repository branches. All repository connections operate under strict read-only tokens.
              </p>
            </div>

            <div className="bg-[#39204F] p-6 rounded-2xl sm:rounded-3xl border border-[#604477] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#704B91]/20 text-[#BDA4D2] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">
                AES-256 Vector Vault
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ingested PDF and DOCX technical runbooks are encrypted at rest and in transit. Customer data remains segregated in tenant-isolated partitions.
              </p>
            </div>

            <div className="bg-[#39204F] p-6 rounded-2xl sm:rounded-3xl border border-[#604477] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#704B91]/20 text-[#BDA4D2] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">
                Zero AI Model Training
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your private code, internal architectural debates, and company documentation are never used to train or fine-tune public foundation models.
              </p>
            </div>

            <div className="bg-[#39204F] p-6 rounded-2xl sm:rounded-3xl border border-[#604477] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#704B91]/20 text-[#BDA4D2] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">
                Manager-Locked Access
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The Project Manager is the sole authority authorized to unlock and publish handover briefings to incoming engineers, preventing premature leaks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: IMPACT (QUALITATIVE BENEFITS) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#704B91] bg-[#F2EDF8] px-3.5 py-1 rounded-full border border-[#E4D9EF]">
            Continuous Delivery Impact
          </span>
          <h2 className="fluid-h2 font-extrabold text-[#32164C] font-heading mt-3 tracking-tight">
            The qualitative impact of evidence-based handovers
          </h2>
          <p className="text-sm sm:text-base text-[#697586] mt-3">
            Real organizational advantages that transform employee departures from crises into seamless handoffs.
          </p>
        </div>

        {/* 4 Qualitative Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F2EDF8] text-[#704B91] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#32164C] font-heading">
              Zero Ramp-Up Guesswork
            </h3>
            <p className="text-xs text-[#697586] leading-relaxed">
              New team members don't have to guess why legacy microservices exist or who holds access keys. Every answer is cited directly to code commits.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F2EDF8] text-[#704B91] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#32164C] font-heading">
              Complete Architectural Memory
            </h3>
            <p className="text-xs text-[#697586] leading-relaxed">
              Preserve institutional memory and trade-off debates so decisions made months ago remain transparent and defensible over time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F2EDF8] text-[#704B91] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#32164C] font-heading">
              Flawless Transition Auditing
            </h3>
            <p className="text-xs text-[#697586] leading-relaxed">
              Managers have full audit logs of what knowledge was transferred, which checks were completed, and digital signatures from both parties.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-[#E8E0EF] shadow-resting space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F2EDF8] text-[#704B91] flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#32164C] font-heading">
              Reduced Offboarding Stress
            </h3>
            <p className="text-xs text-[#697586] leading-relaxed">
              Departing contributors are spared repetitive exit interviews and can complete offboarding with dignity, knowing their work is preserved.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 11: ROADMAP */}
      <section className="py-20 sm:py-28 bg-white border-y border-[#E8E0EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#704B91] bg-[#F2EDF8] px-3.5 py-1 rounded-full border border-[#E4D9EF]">
              Platform Evolution
            </span>
            <h2 className="fluid-h2 font-extrabold text-[#32164C] font-heading mt-3 tracking-tight">
              What we are building next
            </h2>
            <p className="text-sm sm:text-base text-[#697586] mt-3">
              Planned capabilities on the KNOWFLOW product roadmap.
            </p>
          </div>

          {/* Compact Planned Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF8FC] border border-[#E8E0EF] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#704B91]">
                <span>Q1 2027</span>
                <span className="text-[10px] bg-[#F2EDF8] px-2 py-0.5 rounded-full border border-[#E4D9EF]">Planned</span>
              </div>
              <h3 className="text-sm font-bold text-[#32164C] font-heading">
                Slack & Teams Knowledge Bot
              </h3>
              <p className="text-xs text-[#697586]">
                Interactive bot for querying past handover findings and unresolved questions directly within company chat channels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8FC] border border-[#E8E0EF] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#704B91]">
                <span>Q2 2027</span>
                <span className="text-[10px] bg-[#F2EDF8] px-2 py-0.5 rounded-full border border-[#E4D9EF]">Planned</span>
              </div>
              <h3 className="text-sm font-bold text-[#32164C] font-heading">
                Linear & Jira Bi-Directional Sync
              </h3>
              <p className="text-xs text-[#697586]">
                Auto-convert unresolved handover gaps and recommended actions into assigned issue tickets in sprint backlogs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8FC] border border-[#E8E0EF] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#704B91]">
                <span>Q3 2027</span>
                <span className="text-[10px] bg-[#F2EDF8] px-2 py-0.5 rounded-full border border-[#E4D9EF]">Planned</span>
              </div>
              <h3 className="text-sm font-bold text-[#32164C] font-heading">
                On-Premises Air-Gapped Deployment
              </h3>
              <p className="text-xs text-[#697586]">
                Deploy KNOWFLOW entirely within defense or healthcare private cloud infrastructure with local LLM models.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8FC] border border-[#E8E0EF] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#704B91]">
                <span>Q4 2027</span>
                <span className="text-[10px] bg-[#F2EDF8] px-2 py-0.5 rounded-full border border-[#E4D9EF]">Planned</span>
              </div>
              <h3 className="text-sm font-bold text-[#32164C] font-heading">
                Automated Voice Exit Debrief
              </h3>
              <p className="text-xs text-[#697586]">
                Audio exit interview companion that dynamically prompts the departing engineer for answers to detected code gaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: FAQ ACCORDION */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#704B91] bg-[#F2EDF8] px-3.5 py-1 rounded-full border border-[#E4D9EF]">
            Frequently Asked Questions
          </span>
          <h2 className="fluid-h2 font-extrabold text-[#32164C] font-heading mt-3 tracking-tight">
            Everything you need to know about KNOWFLOW
          </h2>
          <p className="text-sm sm:text-base text-[#697586] mt-3">
            Real answers regarding security boundaries, evidence auditing, and manager approvals.
          </p>
        </div>

        {/* Faq Accordion Component */}
        <FaqAccordion />
      </section>

      {/* SECTION 13: FINAL CALL TO ACTION (WITH WAVE EDGE) */}
      <section className="relative bg-[#32164C] text-white py-24 sm:py-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#704B91]/20 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-[#BDA4D2] border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built by Team NOVYX</span>
          </div>

          <h2 className="fluid-h2 font-extrabold text-white font-heading tracking-tight">
            Keep Knowledge Moving. Keep Projects Growing.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            When an employee, volunteer, or contributor transitions off a project, make sure their expertise stays with the team.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#704B91] hover:bg-[#5D3B7B] text-white text-sm font-bold shadow-pill transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/app/overview"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-bold border border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Explore Live Workspace Demo</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 14: FOOTER */}
      <PublicFooter />
    </div>
  );
};
