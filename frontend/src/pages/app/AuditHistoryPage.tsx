import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  UserPlus,
  Upload,
  Send,
  CheckCircle2,
  Share2,
  FileCheck,
  Trash2,
  Search,
  Filter,
  Download,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export type AuditEventType =
  | 'invite'
  | 'upload'
  | 'submission'
  | 'approval'
  | 'sharing'
  | 'acknowledgement'
  | 'revocation';

interface AuditLogEntry {
  id: string;
  eventType: AuditEventType;
  actionText: string;
  actorName: string;
  actorRole: string;
  projectName: string;
  timestamp: string;
  targetResource: string;
  securityHash: string;
  ipAddress: string;
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud-001',
    eventType: 'acknowledgement',
    actionText: 'Digital handover signed and acknowledged',
    actorName: 'Marcus Vance',
    actorRole: 'Backend Developer (Incoming)',
    projectName: 'Core Payments & Ledger Migration',
    timestamp: '2026-11-07 14:15:32 IST',
    targetResource: 'Handover Report: v1.0',
    securityHash: 'sha256:7c9e1...4a2b',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'aud-002',
    eventType: 'sharing',
    actionText: 'Report access unlocked for incoming maintainer',
    actorName: 'Sarah Lin',
    actorRole: 'Project Manager',
    projectName: 'Core Payments & Ledger Migration',
    timestamp: '2026-11-04 10:30:11 IST',
    targetResource: 'Recipient: marcus.vance@knowflow.io',
    securityHash: 'sha256:3d8f2...9b1c',
    ipAddress: '10.0.0.12',
  },
  {
    id: 'aud-003',
    eventType: 'approval',
    actionText: 'Handover report reviewed and formally signed off',
    actorName: 'Sarah Lin',
    actorRole: 'Project Manager',
    projectName: 'Core Payments & Ledger Migration',
    timestamp: '2026-11-04 10:28:44 IST',
    targetResource: 'Handover Dossier: ho-01',
    securityHash: 'sha256:1a4e8...5f0a',
    ipAddress: '10.0.0.12',
  },
  {
    id: 'aud-004',
    eventType: 'submission',
    actionText: 'Handover sources submitted for managerial review',
    actorName: 'Rutika Ghanwat',
    actorRole: 'Backend Developer (Departing)',
    projectName: 'Core Payments & Ledger Migration',
    timestamp: '2026-11-03 18:22:05 IST',
    targetResource: '6 verified sources + clarification note',
    securityHash: 'sha256:9f2c4...8e3d',
    ipAddress: '172.16.4.88',
  },
  {
    id: 'aud-005',
    eventType: 'upload',
    actionText: 'Uploaded technical runbook "Disaster-Recovery-Runbook-v4.docx"',
    actorName: 'Rutika Ghanwat',
    actorRole: 'Backend Developer (Departing)',
    projectName: 'Core Payments & Ledger Migration',
    timestamp: '2026-11-02 11:45:19 IST',
    targetResource: 'Source: Disaster-Recovery-Runbook-v4.docx (1.8 MB)',
    securityHash: 'sha256:4b7d1...2a9e',
    ipAddress: '172.16.4.88',
  },
  {
    id: 'aud-006',
    eventType: 'invite',
    actionText: 'Team invitation token generated for incoming replacement',
    actorName: 'Sarah Lin',
    actorRole: 'Project Manager',
    projectName: 'Core Payments & Ledger Migration',
    timestamp: '2026-11-01 09:15:00 IST',
    targetResource: 'Recipient: marcus.vance@knowflow.io',
    securityHash: 'sha256:8e1b3...6c4f',
    ipAddress: '10.0.0.12',
  },
  {
    id: 'aud-007',
    eventType: 'revocation',
    actionText: 'Handover report access token revoked after transition close',
    actorName: 'Sarah Lin',
    actorRole: 'Project Manager',
    projectName: 'Identity & Session Token Rotation',
    timestamp: '2026-10-22 17:00:10 IST',
    targetResource: 'Recipient: david.k@knowflow.io',
    securityHash: 'sha256:5c2a9...1d7b',
    ipAddress: '10.0.0.12',
  },
];

export const AuditHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.actionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || log.eventType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getEventIcon = (type: AuditEventType) => {
    switch (type) {
      case 'invite':
        return <UserPlus className="w-4 h-4 text-[#2563EB]" />;
      case 'upload':
        return <Upload className="w-4 h-4 text-[#2F6B5D]" />;
      case 'submission':
        return <Send className="w-4 h-4 text-[#B7791F]" />;
      case 'approval':
        return <CheckCircle2 className="w-4 h-4 text-[#218653]" />;
      case 'sharing':
        return <Share2 className="w-4 h-4 text-[#7C3AED]" />;
      case 'acknowledgement':
        return <FileCheck className="w-4 h-4 text-[#218653]" />;
      case 'revocation':
        return <Trash2 className="w-4 h-4 text-[#B54747]" />;
    }
  };

  const getBadgeStyle = (type: AuditEventType) => {
    switch (type) {
      case 'approval':
      case 'acknowledgement':
        return 'bg-[#EBF7F0] text-[#218653] border-[#C3E7D3]';
      case 'submission':
        return 'bg-[#FEF7EB] text-[#B7791F] border-[#FCE2B6]';
      case 'invite':
        return 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';
      case 'revocation':
        return 'bg-[#FDF2F2] text-[#B54747] border-[#F8B4B4]';
      default:
        return 'bg-[#F5F7F6] text-[#475569] border-[#E5EAE6]';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit History & Governance Log"
        description="Tamper-evident chronological log of all invitations, document uploads, submissions, approvals, report sharing, and acknowledgements."
        badge="Enterprise Compliance"
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle">
          <span className="text-xs text-[#687570]">Total Logged Actions</span>
          <p className="text-2xl font-extrabold text-[#142640] font-heading mt-1">142</p>
          <span className="text-[10px] text-[#218653] font-semibold mt-1 block">Immutable record</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle">
          <span className="text-xs text-[#687570]">Manager Sign-Offs</span>
          <p className="text-2xl font-extrabold text-[#142640] font-heading mt-1">8</p>
          <span className="text-[10px] text-[#218653] font-semibold mt-1 block">100% verified</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle">
          <span className="text-xs text-[#687570]">Engineer Signatures</span>
          <p className="text-2xl font-extrabold text-[#142640] font-heading mt-1">7</p>
          <span className="text-[10px] text-[#218653] font-semibold mt-1 block">Digitally acknowledged</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle">
          <span className="text-xs text-[#687570]">Integrity Check</span>
          <p className="text-2xl font-extrabold text-[#218653] font-heading mt-1">PASS</p>
          <span className="text-[10px] text-[#687570] font-mono mt-1 block">SHA-256 HMAC</span>
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
            placeholder="Search events, actors, or resources..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {['all', 'invite', 'upload', 'submission', 'approval', 'sharing', 'acknowledgement', 'revocation'].map(
            (t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  typeFilter === t
                    ? 'bg-[#142640] text-white shadow-subtle'
                    : 'bg-white text-[#687570] border border-[#E5EAE6] hover:bg-[#F5F7F6]'
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAE6] overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAE6] bg-[#F5F7F6]/60 text-[11px] font-bold text-[#687570] uppercase tracking-wider">
                <th className="px-5 py-3.5">Event</th>
                <th className="px-5 py-3.5">Action & Target</th>
                <th className="px-5 py-3.5">Actor</th>
                <th className="px-5 py-3.5">Project</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5 font-mono">Verification Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE6] text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F5F7F6]/50 transition-colors">
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize ${getBadgeStyle(
                        log.eventType
                      )}`}
                    >
                      {getEventIcon(log.eventType)}
                      <span>{log.eventType}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-[#142640]">{log.actionText}</div>
                    <div className="text-[11px] text-[#687570] mt-0.5">{log.targetResource}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#142640]">{log.actorName}</div>
                    <div className="text-[11px] text-[#687570]">{log.actorRole}</div>
                  </td>
                  <td className="px-5 py-4 text-[#142640] font-medium">
                    {log.projectName}
                  </td>
                  <td className="px-5 py-4 text-[#687570] font-mono text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="px-5 py-4 font-mono text-[10px] text-[#8E9B96]">
                    {log.securityHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
