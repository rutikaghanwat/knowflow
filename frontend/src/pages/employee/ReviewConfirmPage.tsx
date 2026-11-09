import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileCheck2,
  ShieldCheck,
  Send,
  MessageSquare,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ClarificationItem {
  id: string;
  topic: string;
  detectedQuestion: string;
  sourceContext: string;
  clarificationText: string;
  isSaved: boolean;
}

const initialClarifications: ClarificationItem[] = [
  {
    id: 'c-1',
    topic: 'Third-Party Fraud API Key Rotation',
    detectedQuestion: 'No documented schedule for rotating FraudGateway webhook HMAC signing secrets found in runbook.',
    sourceContext: 'Disaster-Recovery-Runbook-v4.docx (Page 14)',
    clarificationText: 'HMAC keys rotate quarterly via 1Password vault "Payments-Infra". Marcus has been added as read-only accessor.',
    isSaved: true,
  },
  {
    id: 'c-2',
    topic: 'Redis Secondary Region Failover Dry-Run',
    detectedQuestion: 'Draft ADR-041 marks secondary region dry-run as pending. Is there an active ticket?',
    sourceContext: 'Core-Payments-Idempotency-ADR-041.pdf (Section 4)',
    clarificationText: 'Scheduled for Sprint 28 post Cyber Week peak freeze. SRE team ticket is INFRA-892.',
    isSaved: true,
  },
];

export const ReviewConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, activeHandover } = useAuth();

  const [clarifications, setClarifications] = useState<ClarificationItem[]>(initialClarifications);
  const [newClarification, setNewClarification] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleSaveClarification = (id: string, text: string) => {
    setClarifications(prev =>
      prev.map(c => (c.id === id ? { ...c, clarificationText: text, isSaved: true } : c))
    );
  };

  const handleFinalSubmit = () => {
    setIsSubmitted(true);
    setShowSubmitModal(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7F0] text-[#218653] border border-[#C3E7D3] mb-2">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Step 4: Submission & Pre-Review Clarifications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
          Review & Confirm Submission
        </h1>
        <p className="text-xs sm:text-sm text-[#687570] max-w-2xl leading-relaxed">
          Review the detected knowledge topics extracted from your documents and repository.
          Add clarification notes to answer detected gaps before final manager sign-off.
        </p>

        {/* Boundary Disclaimer per Section 3.5 */}
        <div className="pt-2 flex items-start gap-2 text-xs text-[#2F6B5D] bg-[#E8F2ED] p-3.5 rounded-2xl border border-[#CBE2D7]">
          <Info className="w-4 h-4 text-[#218653] shrink-0 mt-0.5" />
          <span>
            <strong>Handover Governance Notice:</strong> As the departing contributor, your responsibility is to contribute sources and clarify facts.
            You do <em>not</em> generate, approve, or share the final handover report.
            Your manager (Sarah Lin) will review, edit, and approve the role-specific report before releasing it to Marcus Vance.
          </span>
        </div>
      </div>

      {/* 2. "What we found in your sources" Summary Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE6]">
          <h2 className="text-base font-extrabold text-[#142640] font-heading">
            What We Found in Your Sources
          </h2>
          <span className="text-xs font-mono font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
            Automatic AST Synthesis
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-2xl font-extrabold text-[#142640] font-heading block">3</span>
            <span className="text-[11px] font-semibold text-[#687570]">Documents Processed</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-2xl font-extrabold text-[#218653] font-heading block">58</span>
            <span className="text-[11px] font-semibold text-[#687570]">Extracted Facts</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-2xl font-extrabold text-[#B7791F] font-heading block">2</span>
            <span className="text-[11px] font-semibold text-[#687570]">Ambiguities to Clarify</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-2xl font-extrabold text-[#2F6B5D] font-heading block">14</span>
            <span className="text-[11px] font-semibold text-[#687570]">Pull Requests Synced</span>
          </div>
        </div>
      </div>

      {/* 3. "Needs your input" Clarification List */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B7791F]" />
            <h3 className="text-base font-bold text-[#142640] font-heading">
              Needs Your Input: Detected Ambiguities
            </h3>
          </div>
          <p className="text-xs text-[#687570] mt-1">
            The system flagged these unresolved items. Clarification notes you provide will be attached as
            <em> "Added by {currentUser.name}"</em> and reviewed by Sarah Lin.
          </p>
        </div>

        <div className="space-y-4">
          {clarifications.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#142640] font-heading">
                  {idx + 1}. {item.topic}
                </span>
                <span className="text-[10px] font-mono font-semibold text-[#687570] bg-white px-2 py-0.5 rounded border border-[#E5EAE6]">
                  {item.sourceContext}
                </span>
              </div>

              <p className="text-xs text-[#B7791F] font-medium bg-[#FEF7EB] p-2.5 rounded-xl border border-[#F6DEB5]">
                {item.detectedQuestion}
              </p>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#142640] mb-1">
                  Your Clarification Note:
                </label>
                <textarea
                  rows={2}
                  value={item.clarificationText}
                  onChange={e => handleSaveClarification(item.id, e.target.value)}
                  disabled={isSubmitted}
                  className="w-full p-2.5 bg-white border border-[#E5EAE6] rounded-xl text-xs text-[#142640] focus:ring-1 focus:ring-[#218653] disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="text-[10px] text-[#28A766] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Note will be attributed to {currentUser.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Final Submission Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-[#EBF7F0] border border-[#C3E7D3] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white text-[#218653] flex items-center justify-center mx-auto shadow-subtle">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#142640] font-heading">
              Handover Documents Submitted!
            </h3>
            <p className="text-xs text-[#2F6B5D] max-w-md mx-auto leading-relaxed">
              Your runbooks and clarification notes are now locked and submitted to <strong>Sarah Lin</strong>.
              Your files are now read-only. Status: <strong>Waiting for manager review</strong>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#142640] font-heading">
                Ready to submit your handover knowledge?
              </h3>
              <p className="text-xs text-[#687570] mt-0.5">
                After submission, your uploaded files become read-only while Sarah Lin reviews the evidence.
              </p>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-3 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center gap-2 shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit to Manager</span>
            </button>
          </div>
        )}
      </div>

      {/* Submission Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-[#E5EAE6] p-6 sm:p-8 max-w-md w-full space-y-4 shadow-modal">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF7F0] text-[#218653] flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#142640] font-heading">
                Confirm Handover Submission
              </h3>
              <p className="text-xs text-[#687570] leading-relaxed">
                You are submitting <strong>3 documents</strong>, <strong>48 commits</strong>, and <strong>2 clarification notes</strong>
                to Sarah Lin for review and report approval.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] text-[11px] text-[#687570]">
              Once submitted, your uploaded files will be locked to ensure audit consistency during manager review.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-1/2 py-2.5 rounded-full border border-[#E5EAE6] text-xs font-bold text-[#687570] hover:bg-slate-50"
              >
                Go Back
              </button>
              <button
                onClick={handleFinalSubmit}
                className="w-1/2 py-2.5 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
