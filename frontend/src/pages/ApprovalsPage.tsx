import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { mockApprovals } from '../data/mockData';
import { ApprovalRequest } from '../types';
import { formatTimeAgo } from '../utils';

export const ApprovalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(mockApprovals);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'request_changes' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const pastApprovals = approvals.filter(a => a.status !== 'pending');

  const handleOpenReview = (approval: ApprovalRequest, action: 'approve' | 'request_changes') => {
    setSelectedApproval(approval);
    setReviewAction(action);
    setReviewNotes('');
  };

  const handleConfirmReview = () => {
    if (!selectedApproval || !reviewAction) return;

    const newStatus = reviewAction === 'approve' ? 'approved' : 'changes_requested';
    setApprovals(prev =>
      prev.map(a =>
        a.id === selectedApproval.id
          ? {
              ...a,
              status: newStatus,
              notes: reviewNotes || (reviewAction === 'approve' ? 'Approved by VP of Engineering' : 'Corrections requested'),
            }
          : a
      )
    );

    const message =
      reviewAction === 'approve'
        ? `Handover report "${selectedApproval.handoverTitle}" was approved successfully.`
        : `Change requests for "${selectedApproval.handoverTitle}" were submitted to the departing engineer.`;

    setFeedbackSuccess(message);
    setSelectedApproval(null);
    setReviewAction(null);
    setTimeout(() => setFeedbackSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manager Approvals"
        description="Verify facts, challenge inferences, and authorize handover sign-offs before departing engineers complete exit procedures."
      />

      {/* Success Notification Alert */}
      {feedbackSuccess && (
        <div className="p-4 rounded-card bg-[#EBF7F0] border border-[#C3E7D3] text-[#26734D] flex items-center justify-between text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackSuccess}</span>
          </div>
          <button
            onClick={() => setFeedbackSuccess(null)}
            className="text-[#26734D] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Pending Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#183B35] font-heading">
            Pending Approval Queue ({pendingApprovals.length})
          </h3>
          <span className="text-xs text-[#687570]">
            Requires manager sign-off
          </span>
        </div>

        {pendingApprovals.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="w-6 h-6" />}
            title="All handover reports are reviewed"
            description="There are currently no pending handover approvals awaiting your review."
          />
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map(approval => (
              <Card key={approval.id} className="p-5 sm:p-6 border-[#F6DEB5] bg-gradient-to-r from-white to-[#FEF7EB]/30">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[#2F6B5D] bg-[#E8F2ED] px-2.5 py-0.5 rounded border border-[#D0E3D9]">
                        {approval.projectName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEF7EB] text-[#B7791F] border border-[#F6DEB5]">
                        Priority: {approval.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-[#8E9B96] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Submitted {formatTimeAgo(approval.submittedAt)}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#183B35] font-heading">
                      {approval.handoverTitle}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-[#687570]">
                      <span>
                        Departing: <strong className="text-[#202B28]">{approval.departingMember}</strong>
                      </span>
                      <span>&rarr;</span>
                      <span>
                        Incoming: <strong className="text-[#202B28]">{approval.incomingMember}</strong>
                      </span>
                    </div>

                    {approval.notes && (
                      <p className="text-xs text-[#B7791F] bg-[#FEF7EB] p-2.5 rounded-control border border-[#F6DEB5] max-w-xl">
                        <strong>Review Note:</strong> {approval.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/app/reports?id=${approval.reportId}`)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Inspect Report
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<XCircle className="w-4 h-4 text-[#B54747]" />}
                      onClick={() => handleOpenReview(approval, 'request_changes')}
                    >
                      Request Changes
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckCircle2 className="w-4 h-4 text-[#C3E7D3]" />}
                      onClick={() => handleOpenReview(approval, 'approve')}
                    >
                      Approve Handover
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Completed Approvals */}
      <div className="pt-6 border-t border-[#E5EAE6] space-y-4">
        <h3 className="text-base font-bold text-[#183B35] font-heading">
          Signed Off & Completed Handovers ({pastApprovals.length})
        </h3>

        <div className="bg-white rounded-card border border-[#E5EAE6] overflow-x-auto shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F6] border-b border-[#E5EAE6] text-[#687570] uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Handover Title</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Departing Contributor</th>
                <th className="py-3 px-4">Review Decision Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE6]">
              {pastApprovals.map(approval => (
                <tr key={approval.id} className="hover:bg-[#F7F8F6] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#183B35]">{approval.handoverTitle}</td>
                  <td className="py-3.5 px-4 font-medium text-[#202B28]">{approval.projectName}</td>
                  <td className="py-3.5 px-4">
                    <Badge status={approval.status} />
                  </td>
                  <td className="py-3.5 px-4 text-[#202B28]">{approval.departingMember}</td>
                  <td className="py-3.5 px-4 text-[#687570] max-w-xs truncate">{approval.notes}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/app/reports?id=${approval.reportId}`)}
                    >
                      View Report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!selectedApproval}
        onClose={() => setSelectedApproval(null)}
        title={reviewAction === 'approve' ? 'Approve Knowledge Handover' : 'Request Corrections'}
        subtitle={`Handover: ${selectedApproval?.handoverTitle}`}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setSelectedApproval(null)}>
              Cancel
            </Button>
            <Button
              variant={reviewAction === 'approve' ? 'primary' : 'danger'}
              size="sm"
              onClick={handleConfirmReview}
            >
              {reviewAction === 'approve' ? 'Confirm Sign-Off' : 'Submit Feedback'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-[#687570] leading-relaxed">
            {reviewAction === 'approve'
              ? 'By approving this report, you confirm that all critical architecture decisions, dependencies, and on-call operational duties have been verified and transferred to the incoming owner.'
              : 'Specify which facts require re-verification or additional documentation before exit sign-off.'}
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              {reviewAction === 'approve' ? 'Approval Sign-off Remarks (Optional)' : 'Required Corrections *'}
            </label>
            <textarea
              rows={4}
              placeholder={
                reviewAction === 'approve'
                  ? 'e.g. Verified with SRE team. On-call handover complete.'
                  : 'e.g. Please clarify missing cron job location and verify Redis failover logs.'
              }
              value={reviewNotes}
              onChange={e => setReviewNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
