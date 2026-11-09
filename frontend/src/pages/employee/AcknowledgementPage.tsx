import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockHandoverReport } from '../../data/mockData';

export const AcknowledgementPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const report = mockHandoverReport;

  const [acknowledged, setAcknowledged] = useState(false);
  const [comment, setComment] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ackDate, setAckDate] = useState<string | null>(null);

  const checklistItems = [
    { id: 1, label: 'I have reviewed the architecture decisions and runbook citations.', checked: true },
    { id: 2, label: 'I have verified access to relevant GitHub repositories and documentation.', checked: true },
    { id: 3, label: 'I understand the pending database migrations and PgBouncer connection guidelines.', checked: true },
    { id: 4, label: 'I acknowledge ownership transfer for the payments-worker and ledger services.', checked: true },
  ];

  const handleConfirmAck = () => {
    setAcknowledged(true);
    setAckDate(new Date().toLocaleString());
    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7F0] text-[#218653] border border-[#C3E7D3] mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Final Handover Sign-Off</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
          Handover Transfer Acknowledgment
        </h1>
        <p className="text-xs sm:text-sm text-[#687570] max-w-2xl leading-relaxed">
          Formally acknowledge that you have reviewed the evidence-backed handover report and accept
          operational ownership for <strong>{report.projectName}</strong>.
        </p>
      </div>

      {/* 2. Transfer Summary Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAE6]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9B96] block">
              Dossier Reference
            </span>
            <h3 className="text-base font-bold text-[#142640]">
              {report.title} (v{report.version})
            </h3>
          </div>
          <span className="text-xs font-bold text-[#218653] bg-[#EBF7F0] px-3 py-1 rounded-full border border-[#C3E7D3]">
            Target Role: {report.targetRole}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold text-[#8E9B96] uppercase block">Transferred By</span>
            <strong className="text-sm text-[#142640] mt-0.5 block">{report.departingMember.name}</strong>
            <span className="text-[11px] text-[#687570]">Staff Platform Lead</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6]">
            <span className="text-[10px] font-bold text-[#8E9B96] uppercase block">Accepted By</span>
            <strong className="text-sm text-[#142640] mt-0.5 block">{currentUser.name}</strong>
            <span className="text-[11px] text-[#687570]">{currentUser.role}</span>
          </div>
        </div>
      </div>

      {/* 3. Review Checklist */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
        <h3 className="text-base font-bold text-[#142640] font-heading">
          Comprehension & Access Checklist
        </h3>

        <div className="space-y-3 text-xs">
          {checklistItems.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#218653] shrink-0" />
              <span className="text-[#142640] font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold text-[#142640] mb-1.5">
            Optional Notes or Follow-Up Requests (Shared with Sarah Lin):
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Completed 1Password setup. All credentials verified. Ready for next sprint on-call."
            value={comment}
            onChange={e => setComment(e.target.value)}
            disabled={acknowledged}
            className="w-full p-3 bg-white border border-[#E5EAE6] rounded-2xl text-xs text-[#142640] focus:border-[#218653] disabled:bg-[#F5F7F6]"
          />
        </div>
      </div>

      {/* 4. Acknowledgment State / Button */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting">
        {acknowledged ? (
          <div className="p-6 rounded-2xl bg-[#EBF7F0] border border-[#C3E7D3] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white text-[#218653] flex items-center justify-center mx-auto shadow-subtle">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#142640] font-heading">
              Transfer Digitally Acknowledged!
            </h3>
            <p className="text-xs text-[#2F6B5D] max-w-md mx-auto leading-relaxed">
              Timestamped verification logged on <strong>{ackDate}</strong>.
              Signed by <strong>{currentUser.name}</strong>. Notification dispatched to Sarah Lin.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/app/incoming-overview')}
                className="px-6 py-2 rounded-full bg-[#218653] text-white text-xs font-bold shadow-pill"
              >
                Return to Workspace Overview
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#142640]">
                Ready to confirm knowledge transfer?
              </h3>
              <p className="text-xs text-[#687570] mt-0.5">
                This creates an immutable timestamped audit record for engineering compliance.
              </p>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-6 py-3 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-colors flex items-center gap-2 shrink-0 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Acknowledge Handover Transfer</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-[#E5EAE6] p-6 sm:p-8 max-w-md w-full space-y-4 shadow-modal">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF7F0] text-[#218653] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#142640] font-heading">
                Confirm Knowledge Transfer
              </h3>
              <p className="text-xs text-[#687570] leading-relaxed">
                By confirming, you sign that you have received and comprehended the handover briefing for
                <strong> {report.projectName}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-2.5 rounded-full border border-[#E5EAE6] text-xs font-bold text-[#687570] hover:bg-slate-50"
              >
                Review Again
              </button>
              <button
                onClick={handleConfirmAck}
                className="w-1/2 py-2.5 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill"
              >
                Yes, Sign Off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
