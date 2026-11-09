import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Grid,
  List,
  Upload,
  Calendar,
  CheckCircle2,
  X,
  Download,
  Trash2,
  ArrowRight,
  Eye,
  GitBranch,
  ShieldCheck,
  FileCode2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface EmployeeFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'github';
  size: string;
  uploadedAt: string;
  status: 'processed' | 'indexing' | 'failed';
  factsCount: number;
  docTag: string;
  extractedSnippet: string;
  downloadUrl?: string;
}

const mockEmployeeFiles: EmployeeFile[] = [
  {
    id: 'f-1',
    name: 'Disaster-Recovery-Runbook-v4.docx',
    type: 'docx',
    size: '2.4 MB',
    uploadedAt: 'Today at 09:30 AM',
    status: 'processed',
    factsCount: 18,
    docTag: 'Runbook',
    extractedSnippet:
      'Under sustained burst (>5,000 req/sec), connection pool limits on PgBouncer must be tuned to 300. Multi-AZ automatic failover triggers within 12 seconds.',
  },
  {
    id: 'f-2',
    name: 'Core-Payments-Idempotency-ADR-041.pdf',
    type: 'pdf',
    size: '1.8 MB',
    uploadedAt: 'Yesterday at 04:15 PM',
    status: 'processed',
    factsCount: 24,
    docTag: 'Architecture Decision Record',
    extractedSnippet:
      'Two-phase commit validation on Stripe checkout webhook locks using Redis NX keys with 300-second expiration. Eliminates duplicate credit card processing.',
  },
  {
    id: 'f-3',
    name: 'Q3-Ledger-Reconciliation-Postmortem.pdf',
    type: 'pdf',
    size: '950 KB',
    uploadedAt: 'Nov 07, 2026',
    status: 'processed',
    factsCount: 12,
    docTag: 'Technical Spec',
    extractedSnippet:
      'Root-cause identified: race condition during double-entry ledger settlement on asynchronous Kafka event consumers. Addressed by transaction isolation level Serializable.',
  },
  {
    id: 'f-4',
    name: 'knowflow-payments-service (GitHub Repository)',
    type: 'github',
    size: '48 Commits',
    uploadedAt: 'Nov 06, 2026',
    status: 'processed',
    factsCount: 42,
    docTag: 'Repository Sync',
    extractedSnippet:
      'Parsed 14 pull requests authored by Rutika Ghanwat covering Stripe webhooks, Redis locking, and Alembic database migration scripts.',
  },
];

export const MyFilesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [files, setFiles] = useState<EmployeeFile[]>(mockEmployeeFiles);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pdf' | 'docx' | 'github'>('all');
  const [selectedFile, setSelectedFile] = useState<EmployeeFile | null>(null);

  const filteredFiles = files.filter(file => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.docTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || file.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7F0] text-[#218653] border border-[#C3E7D3] mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Scoped Document Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
              My Uploaded Files
            </h1>
          </div>

          <button
            onClick={() => navigate('/app/upload-sources')}
            className="self-start sm:self-auto px-4 py-2 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Source</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#687570] max-w-2xl leading-relaxed">
          This view displays only the files you have uploaded and repository sources authorized for your transition.
          Other team members' private files are strictly isolated.
        </p>
      </div>

      {/* 2. Controls Toolbar: Search, Filter, View Mode Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAE6] shadow-resting flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8E9B96] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, tag, or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F7F6] border border-[#E5EAE6] rounded-xl text-[#142640] focus:bg-white focus:border-[#218653]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 text-xs bg-[#F5F7F6] border border-[#E5EAE6] rounded-xl text-[#142640]"
          >
            <option value="all">All File Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="docx">DOCX Runbooks</option>
            <option value="github">GitHub Sources</option>
          </select>
        </div>

        {/* View Mode Switcher (Desktop only; on mobile always cards) */}
        <div className="hidden sm:flex items-center gap-1 bg-[#F5F7F6] p-1 rounded-xl border border-[#E5EAE6]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-[#142640] shadow-subtle'
                : 'text-[#687570] hover:text-[#142640]'
            }`}
            aria-label="Grid layout"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-[#142640] shadow-subtle'
                : 'text-[#687570] hover:text-[#142640]'
            }`}
            aria-label="List layout"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Empty State */}
      {filteredFiles.length === 0 && (
        <div className="bg-white rounded-3xl border border-[#E5EAE6] p-12 text-center max-w-lg mx-auto shadow-resting space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F7F6] text-[#8E9B96] flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#142640]">No matching files found</h3>
          <p className="text-xs text-[#687570]">
            Try adjusting your search query or upload a new PDF / DOCX runbook.
          </p>
          <button
            onClick={() => navigate('/app/upload-sources')}
            className="px-5 py-2 rounded-full bg-[#218653] text-white text-xs font-bold shadow-pill"
          >
            Upload Source
          </button>
        </div>
      )}

      {/* 4. Files Presentation (Grid or List) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className="bg-white p-5 rounded-2xl border border-[#E5EAE6] hover:border-[#218653] shadow-resting hover:shadow-card-hover transition-all duration-200 cursor-pointer space-y-3 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      file.type === 'pdf'
                        ? 'bg-[#FDF2F2] text-[#B54747]'
                        : file.type === 'docx'
                        ? 'bg-[#EBF7F0] text-[#218653]'
                        : 'bg-[#142640] text-white'
                    }`}
                  >
                    {file.type === 'github' ? (
                      <GitBranch className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#142640] group-hover:text-[#218653] transition-colors line-clamp-1">
                      {file.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-[#2F6B5D] bg-[#E8F2ED] px-2 py-0.2 rounded-full border border-[#CBE2D7]">
                      {file.docTag}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#218653] bg-[#EBF7F0] px-2 py-0.5 rounded-full border border-[#C3E7D3] shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{file.factsCount} facts</span>
                </span>
              </div>

              <p className="text-[11px] text-[#687570] line-clamp-2 leading-relaxed">
                {file.extractedSnippet}
              </p>

              <div className="flex items-center justify-between text-[11px] text-[#8E9B96] pt-2 border-t border-[#E5EAE6]">
                <span>{file.size}</span>
                <span>{file.uploadedAt}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5EAE6] shadow-resting overflow-hidden divide-y divide-[#E5EAE6]">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className="p-4 hover:bg-[#F5F7F6] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    file.type === 'pdf'
                      ? 'bg-[#FDF2F2] text-[#B54747]'
                      : file.type === 'docx'
                      ? 'bg-[#EBF7F0] text-[#218653]'
                      : 'bg-[#142640] text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#142640]">{file.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-[#8E9B96] mt-0.5">
                    <span>{file.docTag}</span>
                    <span>&bull;</span>
                    <span>{file.size}</span>
                    <span>&bull;</span>
                    <span>{file.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[10px] font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                  {file.factsCount} extracted facts
                </span>
                <button className="text-xs text-[#2F6B5D] font-bold hover:underline">
                  Inspect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Right-Side Slide-Over Drawer for File Inspection (per spec) */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#142640]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedFile(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-modal flex flex-col justify-between p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE6]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                      Source Details
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1 rounded-lg text-[#687570] hover:text-[#142640] hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#142640] font-heading">
                    {selectedFile.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#687570]">
                    <span>{selectedFile.docTag}</span>
                    <span>&bull;</span>
                    <span>{selectedFile.size}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#142640]">Extraction Status:</span>
                    <span className="font-bold text-[#218653] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{selectedFile.factsCount} facts extracted</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-[#687570]">
                    Indexed for: <strong>Core Payments & Ledger Migration</strong>
                  </div>
                  <div className="text-[11px] text-[#687570]">
                    Uploaded: <strong>{selectedFile.uploadedAt}</strong> by <strong>Rutika Ghanwat</strong>
                  </div>
                </div>

                {/* Extracted Text Preview per spec */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#142640]">
                    Permitted Extracted Text Excerpt
                  </span>
                  <div className="p-4 rounded-xl bg-slate-50 border border-[#E5EAE6] text-xs font-mono text-slate-800 leading-relaxed max-h-48 overflow-y-auto">
                    {selectedFile.extractedSnippet}
                  </div>
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="pt-4 border-t border-[#E5EAE6] space-y-2">
                <button
                  onClick={() => alert(`Simulating download of ${selectedFile.name}`)}
                  className="w-full py-2.5 px-4 rounded-full bg-[#142640] text-white text-xs font-bold hover:bg-[#0E1C30] flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </button>

                <button
                  onClick={() => setSelectedFile(null)}
                  className="w-full py-2 px-4 rounded-full border border-[#E5EAE6] text-xs font-semibold text-[#687570] hover:bg-slate-50"
                >
                  Close Drawer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
