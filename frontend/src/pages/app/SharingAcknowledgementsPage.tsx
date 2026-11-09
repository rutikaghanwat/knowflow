import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
  ExternalLink,
  UserCheck,
  FileText,
  AlertCircle,
  Eye,
  KeyRound,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { mockHandovers, mockHandoverReport } from '../../data/mockData';

interface AcknowledgementRecord {
  id: string;
  handoverId: string;
  projectName: string;
  incomingMember: string;
  incomingEmail: string;
  departingMember: string;
  reportTitle: string;
  sharedAt: string;
  status: 'acknowledged' | 'pending_review' | 'access_revoked';
  acknowledgedAt?: string;
  acknowledgementComment?: string;
  checklistScore?: string;
  accessExpires?: string;
}

const mockAcknowledgements: AcknowledgementRecord[] = [
  {
    id: 'ack-01',
    handoverId: 'ho-01',
    projectName: 'Core Payments & Ledger Migration',
    incomingMember: 'Marcus Vance',
    incomingEmail: 'marcus.vance@knowflow.io',
    departingMember: 'Rutika Ghanwat',
    reportTitle: 'Core Payments & Ledger Migration — Handover Dossier v1.0',
    sharedAt: '2026-11-04 10:30 IST',
    status: 'acknowledged',
    acknowledgedAt: '2026-11-07 14:15 IST',
    acknowledgementComment: 'Reviewed all double-entry ledger constraints, Redis lock timeouts, and Stripe webhook dead letter backoff handlers. Verified staging credentials.',
    checklistScore: '7 of 7 items verified',
    accessExpires: '2026-12-07 (30-day window)',
  },
  {
    id: 'ack-02',
    handoverId: 'ho-02',
    projectName: 'Distributed Event Streaming v2',
    incomingMember: 'Elena Rostova',
    incomingEmail: 'elena.r@knowflow.io',
    departingMember: 'Alex Chen',
    reportTitle: 'Kafka Topic Architecture & Partition Compaction Guide',
    sharedAt: '2026-11-08 09:00 IST',
    status: 'pending_review',
    checklistScore: '3 of 6 items verified',
    accessExpires: '2026-12-08 (30-day window)',
  },
  {
    id: 'ack-03',
    handoverId: 'ho-03',
    projectName: 'Identity & Session Token Rotation',
    incomingMember: 'David Kalu',
    incomingEmail: 'david.k@knowflow.io',
    departingMember: 'Maya Lin',
    reportTitle: 'OAuth2 JWKS Token Migration Runbook',
    sharedAt: '2026-10-20 16:45 IST',
    status: 'access_revoked',
    acknowledgedAt: '2026-10-22 11:20 IST',
    acknowledgementComment: 'Transition completed and signed off. Access revoked after scheduled handover window closed.',
    checklistScore: '5 of 5 items verified',
  },
];

export const SharingAcknowledgementsPage: React.FC = () => {
  const [records, setRecords] = useState<AcknowledgementRecord[]>(mockAcknowledgements);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'acknowledged' | 'pending_review' | 'access_revoked'>('all');
  const [selectedRecord, setSelectedRecord] = useState<AcknowledgementRecord | null>(null);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [recordToRevoke, setRecordToRevoke] = useState<AcknowledgementRecord | null>(null);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.incomingMember.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRevokeAccess = () => {
    if (!recordToRevoke) return;
    setRecords((prev) =>
      prev.map((r) => (r.id === recordToRevoke.id ? { ...r, status: 'access_revoked' } : r))
    );
    setRevokeModalOpen(false);
    setRecordToRevoke(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sharing & Acknowledgements"
        description="Audit shared handover reports, track incoming engineer acknowledgements, and manage token permissions."
        badge="Manager Governance"
      />

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EBF7F0] text-[#218653] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#687570] font-medium">Formally Acknowledged</p>
            <h3 className="text-2xl font-extrabold text-[#142640] font-heading mt-0.5">
              {records.filter((r) => r.status === 'acknowledged').length}
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FEF7EB] text-[#B7791F] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#687570] font-medium">Pending Review</p>
            <h3 className="text-2xl font-extrabold text-[#142640] font-heading mt-0.5">
              {records.filter((r) => r.status === 'pending_review').length}
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#687570] font-medium">Revoked / Archived</p>
            <h3 className="text-2xl font-extrabold text-[#142640] font-heading mt-0.5">
              {records.filter((r) => r.status === 'access_revoked').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project, recipient or title..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {(['all', 'acknowledged', 'pending_review', 'access_revoked'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-[#142640] text-white shadow-subtle'
                  : 'bg-white text-[#687570] border border-[#E5EAE6] hover:bg-[#F5F7F6]'
              }`}
            >
              {s === 'all'
                ? 'All Statuses'
                : s === 'acknowledged'
                ? 'Acknowledged'
                : s === 'pending_review'
                ? 'Pending'
                : 'Revoked'}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table / Card List */}
      <div className="bg-white rounded-2xl border border-[#E5EAE6] overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAE6] bg-[#F5F7F6]/60 text-[11px] font-bold text-[#687570] uppercase tracking-wider">
                <th className="px-5 py-3.5">Handover & Project</th>
                <th className="px-5 py-3.5">Recipient (Incoming)</th>
                <th className="px-5 py-3.5">Shared Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Verification</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE6] text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#687570]">
                    No handover sharing records match the active filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F5F7F6]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#142640]">{r.reportTitle}</div>
                      <div className="text-[11px] text-[#687570] mt-0.5">{r.projectName}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#142640]">{r.incomingMember}</div>
                      <div className="text-[11px] text-[#687570]">{r.incomingEmail}</div>
                    </td>
                    <td className="px-5 py-4 text-[#687570] font-mono text-[11px]">
                      {r.sharedAt}
                    </td>
                    <td className="px-5 py-4">
                      {r.status === 'acknowledged' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-1 rounded-full border border-[#C3E7D3]">
                          <CheckCircle2 className="w-3 h-3" /> Acknowledged
                        </span>
                      )}
                      {r.status === 'pending_review' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B7791F] bg-[#FEF7EB] px-2.5 py-1 rounded-full border border-[#FCE2B6]">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                      {r.status === 'access_revoked' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-full border border-[#CBD5E1]">
                          <ShieldAlert className="w-3 h-3" /> Revoked
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-semibold text-[#142640]">{r.checklistScore}</div>
                      {r.acknowledgedAt && (
                        <div className="text-[10px] text-[#218653] font-mono">Signed: {r.acknowledgedAt}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRecord(r)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#E5EAE6] hover:bg-[#F5F7F6] text-xs font-semibold text-[#142640] transition-colors"
                        >
                          View Audit
                        </button>
                        {r.status !== 'access_revoked' && (
                          <button
                            onClick={() => {
                              setRecordToRevoke(r);
                              setRevokeModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-[#F8B4B4] hover:bg-[#FDF2F2] text-xs font-semibold text-[#B54747] transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedRecord && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRecord(null)}
          title="Handover Sign-off & Audit Record"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#687570]">Project:</span>
                <span className="font-bold text-[#142640]">{selectedRecord.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687570]">Recipient:</span>
                <span className="font-bold text-[#142640]">{selectedRecord.incomingMember} ({selectedRecord.incomingEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687570]">Departing Lead:</span>
                <span className="font-bold text-[#142640]">{selectedRecord.departingMember}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687570]">Shared Timestamp:</span>
                <span className="font-mono text-[#142640]">{selectedRecord.sharedAt}</span>
              </div>
              {selectedRecord.acknowledgedAt && (
                <div className="flex justify-between">
                  <span className="text-[#687570]">Acknowledged Timestamp:</span>
                  <span className="font-mono text-[#218653] font-bold">{selectedRecord.acknowledgedAt}</span>
                </div>
              )}
            </div>

            {selectedRecord.acknowledgementComment && (
              <div className="space-y-1">
                <span className="font-bold text-[#142640] block">Engineer Acknowledgment Notes:</span>
                <p className="p-3 rounded-xl bg-white border border-[#E5EAE6] text-[#687570] leading-relaxed italic">
                  "{selectedRecord.acknowledgementComment}"
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-full bg-[#142640] text-white text-xs font-bold"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Revocation Confirmation Modal */}
      {revokeModalOpen && recordToRevoke && (
        <Modal
          isOpen={true}
          onClose={() => setRevokeModalOpen(false)}
          title="Revoke Handover Report Access"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-[#B54747] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">This will immediately revoke access</strong>
                <span>
                  {recordToRevoke.incomingMember} will no longer be able to open or view the dossier for {recordToRevoke.projectName}.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRevokeModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#E5EAE6] text-xs font-semibold text-[#142640]"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeAccess}
                className="px-4 py-2 rounded-full bg-[#B54747] text-white text-xs font-bold hover:bg-[#993A3A] transition-colors"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
