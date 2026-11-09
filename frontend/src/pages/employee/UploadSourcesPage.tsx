import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  FileCode2,
  CheckCircle2,
  X,
  AlertCircle,
  GitBranch,
  ShieldCheck,
  RefreshCw,
  Trash2,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'docx';
  progress: number;
  status: 'uploading' | 'extracting' | 'processed' | 'failed';
  extractedFacts?: number;
  docTypeTag?: 'Design Doc' | 'Meeting Notes' | 'Technical Spec' | 'Runbook' | 'Other';
  description?: string;
  error?: string;
}

const initialFiles: UploadedFileItem[] = [
  {
    id: 'f-1',
    name: 'Disaster-Recovery-Runbook-v4.docx',
    size: '2.4 MB',
    type: 'docx',
    progress: 100,
    status: 'processed',
    extractedFacts: 18,
    docTypeTag: 'Runbook',
    description: 'PostgreSQL failover and PgBouncer connection tuning thresholds for Cyber Week.',
  },
  {
    id: 'f-2',
    name: 'Core-Payments-Idempotency-ADR-041.pdf',
    size: '1.8 MB',
    type: 'pdf',
    progress: 100,
    status: 'processed',
    extractedFacts: 24,
    docTypeTag: 'Design Doc',
    description: 'Two-phase commit validation on Stripe checkout webhook locks.',
  },
  {
    id: 'f-3',
    name: 'Q3-Ledger-Reconciliation-Postmortem.pdf',
    size: '950 KB',
    type: 'pdf',
    progress: 100,
    status: 'processed',
    extractedFacts: 12,
    docTypeTag: 'Technical Spec',
    description: 'Root cause analysis of duplicate ledger credits during network partitions.',
  },
];

export const UploadSourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, activeHandover } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<UploadedFileItem[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<UploadedFileItem | null>(null);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);
  const [githubConnected, setGithubConnected] = useState(true);

  // Validate file: PDF and DOCX only, max 50MB
  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const newItems: UploadedFileItem[] = [];

    Array.from(fileList).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'pdf' && ext !== 'docx') {
        setErrorMessage(`"${file.name}" rejected: Only PDF and DOCX documents are accepted.`);
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the 50MB size limit.`);
        return;
      }

      // Check duplicate
      if (files.some(f => f.name === file.name)) {
        setErrorMessage(`Warning: "${file.name}" has already been uploaded.`);
        return;
      }

      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;

      const newItem: UploadedFileItem = {
        id: `f-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        size: sizeFormatted,
        type: ext as 'pdf' | 'docx',
        progress: 30,
        status: 'uploading',
        docTypeTag: 'Runbook',
      };

      newItems.push(newItem);
    });

    if (newItems.length > 0) {
      setFiles(prev => [...newItems, ...prev]);

      // Simulate progressive extraction pipeline
      newItems.forEach(item => {
        setTimeout(() => {
          setFiles(prev =>
            prev.map(f => (f.id === item.id ? { ...f, progress: 70, status: 'extracting' } : f))
          );
        }, 1200);

        setTimeout(() => {
          setFiles(prev =>
            prev.map(f =>
              f.id === item.id
                ? {
                    ...f,
                    progress: 100,
                    status: 'processed',
                    extractedFacts: Math.floor(Math.random() * 15) + 6,
                  }
                : f
            )
          );
        }, 2500);
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete) {
      setFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
      setFileToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7F0] text-[#218653] border border-[#C3E7D3] mb-2">
              <Upload className="w-3.5 h-3.5" />
              <span>Step 1: Document & Source Contribution</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142640] font-heading tracking-tight">
              Upload Sources & Runbooks
            </h1>
          </div>

          <button
            onClick={() => navigate('/app/my-files')}
            className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#E5EAE6] text-xs font-bold text-[#142640] hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-subtle"
          >
            <span>View My Files ({files.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#687570] max-w-2xl leading-relaxed">
          Upload Architecture Decision Records (ADRs), postmortems, deployment guides, and runbooks.
          KNOWFLOW's AST tokenizer extracts facts, decisions, and dependencies with zero hallucination.
        </p>

        {/* Privacy Hint per spec */}
        <div className="pt-2 flex items-center gap-2 text-xs text-[#2F6B5D] bg-[#E8F2ED] p-3 rounded-2xl border border-[#CBE2D7]">
          <ShieldCheck className="w-4 h-4 text-[#218653] shrink-0" />
          <span>
            <strong>Privacy Note:</strong> Only upload files you are authorized to share on this project.
            Your manager (Sarah Lin) will review the report before anyone else sees it.
          </span>
        </div>
      </div>

      {/* 2. Drag & Drop Zone */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`bg-white rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#218653] bg-[#EBF7F0]/40 scale-[1.01]'
            : 'border-[#CBD5E1] hover:border-[#218653] hover:bg-slate-50/50'
        } shadow-resting`}
        tabIndex={0}
        role="button"
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload files: Drag and drop PDF or DOCX files here or press Enter to browse"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={e => processFiles(e.target.files)}
        />

        <div className="w-16 h-16 rounded-2xl bg-[#EBF7F0] text-[#218653] flex items-center justify-center mx-auto mb-4 border border-[#C3E7D3] shadow-subtle">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[#142640] font-heading">
          Drag and drop PDF or DOCX files here
        </h3>
        <p className="text-xs text-[#687570] max-w-sm mx-auto mt-1 mb-4">
          Upload technical runbooks, ADRs, or architecture specs (up to 50MB per file).
        </p>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-6 py-2.5 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-colors inline-flex items-center gap-2"
        >
          <span>Browse from computer</span>
        </button>
      </div>

      {/* Error / Warning Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#FDF2F2] border border-[#F8C8C8] text-xs text-[#B54747] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Uploaded Files List with Status Pipeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5EAE6]">
          <h3 className="text-sm font-bold text-[#142640] font-heading">
            Uploaded Files ({files.length})
          </h3>
          <span className="text-xs text-[#687570]">
            All documents stay private to this project handover
          </span>
        </div>

        <div className="space-y-3">
          {files.map(file => {
            const isExpanded = expandedFileId === file.id;

            return (
              <div
                key={file.id}
                className="p-4 rounded-2xl border border-[#E5EAE6] bg-[#F5F7F6] space-y-3 transition-colors"
              >
                {/* File Row Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        file.type === 'pdf'
                          ? 'bg-[#FDF2F2] text-[#B54747]'
                          : 'bg-[#EBF7F0] text-[#218653]'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#142640] truncate max-w-sm sm:max-w-md">
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#687570] mt-0.5">
                        <span>{file.size}</span>
                        <span>&bull;</span>
                        <span className="uppercase font-semibold">{file.type}</span>
                        {file.docTypeTag && (
                          <>
                            <span>&bull;</span>
                            <span className="font-semibold text-[#2F6B5D] bg-white px-2 py-0.2 rounded border border-[#E5EAE6]">
                              {file.docTypeTag}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Chip & Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {file.status === 'uploading' && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#B7791F] bg-[#FEF7EB] px-2.5 py-1 rounded-full border border-[#F6DEB5]">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Uploading ({file.progress}%)</span>
                      </span>
                    )}

                    {file.status === 'extracting' && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2F6B5D] bg-[#E8F2ED] px-2.5 py-1 rounded-full border border-[#CBE2D7]">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Extracting text & AST...</span>
                      </span>
                    )}

                    {file.status === 'processed' && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-1 rounded-full border border-[#C3E7D3]">
                        <CheckCircle2 className="w-3 h-3 text-[#218653]" />
                        <span>Processed ({file.extractedFacts} facts)</span>
                      </span>
                    )}

                    {file.status === 'failed' && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#B54747] bg-[#FDF2F2] px-2.5 py-1 rounded-full border border-[#F8C8C8]">
                        <AlertCircle className="w-3 h-3" />
                        <span>Extraction Failed</span>
                      </span>
                    )}

                    <button
                      onClick={() => setExpandedFileId(isExpanded ? null : file.id)}
                      className="p-1.5 text-[#687570] hover:text-[#142640] rounded-lg hover:bg-white transition-colors"
                      title="Edit metadata tag"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => setFileToDelete(file)}
                      className="p-1.5 text-[#8E9B96] hover:text-[#B54747] rounded-lg hover:bg-[#FDF2F2] transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar (if in flight) */}
                {file.progress < 100 && (
                  <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#218653] h-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {/* Progressive Disclosure: Document Tag & Description */}
                {isExpanded && (
                  <div className="pt-3 border-t border-[#E5EAE6] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#142640] mb-1">
                        Document Classification
                      </label>
                      <select
                        value={file.docTypeTag || 'Runbook'}
                        onChange={e =>
                          setFiles(prev =>
                            prev.map(f =>
                              f.id === file.id
                                ? { ...f, docTypeTag: e.target.value as any }
                                : f
                            )
                          )
                        }
                        className="w-full p-2 bg-white border border-[#E5EAE6] rounded-xl text-xs text-[#142640]"
                      >
                        <option value="Runbook">Runbook / Ops Guide</option>
                        <option value="Design Doc">Architecture Decision Record (ADR)</option>
                        <option value="Technical Spec">Technical Specification</option>
                        <option value="Meeting Notes">Architecture Notes</option>
                        <option value="Other">Other Document</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#142640] mb-1">
                        Short Summary / Purpose for Marcus Vance
                      </label>
                      <input
                        type="text"
                        value={file.description || ''}
                        onChange={e =>
                          setFiles(prev =>
                            prev.map(f =>
                              f.id === file.id ? { ...f, description: e.target.value } : f
                            )
                          )
                        }
                        placeholder="e.g. Explains PgBouncer connection tuning thresholds"
                        className="w-full p-2 bg-white border border-[#E5EAE6] rounded-xl text-xs text-[#142640]"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. GitHub Source Connection Card (per spec) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE6] shadow-resting space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#142640] text-white flex items-center justify-center shrink-0">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#142640] font-heading">
                  Connected GitHub Repository
                </h3>
                <span className="text-[10px] font-bold text-[#218653] bg-[#EBF7F0] px-2 py-0.5 rounded-full border border-[#C3E7D3]">
                  Authorized by Sarah Lin
                </span>
              </div>
              <p className="text-xs text-[#687570] font-mono mt-0.5">
                github.com/acme-org/knowflow-payments-service (branch: <code>main</code>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setGithubConnected(!githubConnected)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                githubConnected
                  ? 'bg-[#EBF7F0] text-[#218653] border border-[#C3E7D3]'
                  : 'bg-[#142640] text-white hover:bg-[#0E1C30]'
              }`}
            >
              {githubConnected ? 'Sync Active' : 'Connect Repo'}
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F5F7F6] border border-[#E5EAE6] space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[#142640]">
            <span className="font-semibold">Knowledge Ingested from Git:</span>
            <span className="font-mono text-[#218653] font-bold">14 Pull Requests &bull; 48 Commits</span>
          </div>
          <p className="text-[11px] text-[#687570] leading-relaxed">
            <strong>Permission Boundary:</strong> KNOWFLOW only reads commits and PR discussions authored or approved
            by your handle. It never executes code, modifies branches, or pushes commits.
          </p>
        </div>
      </div>

      {/* 5. Next Step Action Banner */}
      <div className="bg-[#142640] text-white p-6 sm:p-8 rounded-3xl border border-[#1D3457] shadow-raised flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-heading">
            Done contributing your runbooks and documents?
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Proceed to review detected topics, add any clarification notes, and submit to Sarah Lin.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/review-confirm')}
          className="px-6 py-3 rounded-full bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold shadow-pill transition-all duration-150 flex items-center gap-2 shrink-0 active:scale-95"
        >
          <span>Continue to Review & Confirm</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-[#E5EAE6] p-6 max-w-sm w-full space-y-4 shadow-modal">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2F2] text-[#B54747] flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#142640]">Delete uploaded file?</h3>
              <p className="text-xs text-[#687570]">
                Are you sure you want to remove <strong>{fileToDelete.name}</strong>?
                Extracted facts from this file will be excluded from the handover.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setFileToDelete(null)}
                className="w-1/2 py-2 rounded-full border border-[#E5EAE6] text-xs font-bold text-[#687570] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="w-1/2 py-2 rounded-full bg-[#B54747] hover:bg-[#9B3C3C] text-white text-xs font-bold shadow-sm"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
