import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EvidenceType, HandoverStatus, SourceStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function getStatusBadgeVariant(status: HandoverStatus | SourceStatus | string) {
  switch (status) {
    case 'approved':
    case 'processed':
    case 'completed':
    case 'active':
      return {
        bg: 'bg-[#EBF7F0]',
        text: 'text-[#26734D]',
        border: 'border-[#C3E7D3]',
        label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      };
    case 'in_review':
    case 'indexing':
    case 'in_progress':
    case 'pending':
      return {
        bg: 'bg-[#FEF7EB]',
        text: 'text-[#B7791F]',
        border: 'border-[#F6DEB5]',
        label: status === 'in_review' ? 'In Review' : status === 'in_progress' ? 'In Progress' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      };
    case 'rejected':
    case 'failed':
    case 'on_hold':
      return {
        bg: 'bg-[#FDF2F2]',
        text: 'text-[#B54747]',
        border: 'border-[#F8C8C8]',
        label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      };
    case 'draft':
    case 'archived':
    default:
      return {
        bg: 'bg-[#F0F4F2]',
        text: 'text-[#687570]',
        border: 'border-[#D0E3D9]',
        label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      };
  }
}

export function getEvidenceMeta(type: EvidenceType) {
  switch (type) {
    case 'verified_fact':
      return {
        label: 'Verified Fact',
        desc: 'Directly supported by repository commits or validated documentation',
        badgeClass: 'bg-[#E8F2ED] text-[#183B35] border-[#B9D7C8]',
        iconColor: '#183B35',
      };
    case 'ai_inference':
      return {
        label: 'AI Inference',
        desc: 'Synthesized from cross-source patterns and documented commit trails',
        badgeClass: 'bg-[#EAF1F8] text-[#2C5282] border-[#C3D9ED]',
        iconColor: '#2C5282',
      };
    case 'recommendation':
      return {
        label: 'Recommendation',
        desc: 'Suggested transition action for incoming maintainers',
        badgeClass: 'bg-[#FEF7EB] text-[#B7791F] border-[#F6DEB5]',
        iconColor: '#B7791F',
      };
    case 'unknown_missing':
      return {
        label: 'Missing Info',
        desc: 'Gap identified in documentation requiring manual clarification',
        badgeClass: 'bg-[#FDF2F2] text-[#B54747] border-[#F8C8C8]',
        iconColor: '#B54747',
      };
  }
}
