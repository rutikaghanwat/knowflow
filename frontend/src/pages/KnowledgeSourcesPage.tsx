import React, { useState } from 'react';
import {
  UploadCloud,
  GitBranch,
  FileText,
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Trash2,
  ExternalLink,
  Plus,
  Info,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SearchInput } from '../components/ui/SearchInput';
import { Modal } from '../components/ui/Modal';
import { mockKnowledgeSources, mockProjects } from '../data/mockData';
import { KnowledgeSource, SourceType } from '../types';
import { formatTimeAgo } from '../utils';

export const KnowledgeSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<KnowledgeSource[]>(mockKnowledgeSources);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [gitHubForm, setGitHubForm] = useState({
    repoUrl: '',
    branch: 'main',
    project: mockProjects[0].name,
  });
  const [gitHubError, setGitHubError] = useState('');

  // Filtering
  const filteredSources = sources.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || s.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Simulated Document Upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const processFiles = (files: File[]) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validFiles = files.filter(f =>
      allowed.includes(f.type) || f.name.endsWith('.pdf') || f.name.endsWith('.docx')
    );

    if (validFiles.length === 0) {
      alert('Please upload standard PDF or DOCX architectural documents.');
      return;
    }

    const newSources: KnowledgeSource[] = validFiles.map((file, i) => ({
      id: `src-${Date.now()}-${i}`,
      name: file.name,
      type: file.name.endsWith('.docx') ? 'docx' : 'pdf',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      projectId: mockProjects[0].id,
      projectName: mockProjects[0].name,
      status: 'indexing',
      progress: 25,
      extractedFactsCount: 0,
      lastSynced: new Date().toISOString(),
      addedBy: 'Sarah Lin',
    }));

    setSources([...newSources, ...sources]);
  };

  const handleConnectGitHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gitHubForm.repoUrl.trim() || !gitHubForm.repoUrl.includes('/')) {
      setGitHubError('Please provide a valid GitHub repository path (e.g. acme-org/repo-name)');
      return;
    }

    const newRepo: KnowledgeSource = {
      id: `src-${Date.now()}`,
      name: gitHubForm.repoUrl.replace(/^https?:\/\/github\.com\//, '').trim(),
      type: 'github',
      projectId: mockProjects[0].id,
      projectName: gitHubForm.project,
      status: 'indexing',
      progress: 15,
      branch: `${gitHubForm.branch} (analyzing commits...)`,
      extractedFactsCount: 0,
      lastSynced: new Date().toISOString(),
      addedBy: 'Sarah Lin',
      url: `https://github.com/${gitHubForm.repoUrl.replace(/^https?:\/\/github\.com\//, '')}`,
    };

    setSources([newRepo, ...sources]);
    setIsGitHubModalOpen(false);
    setGitHubForm({ repoUrl: '', branch: 'main', project: mockProjects[0].name });
    setGitHubError('');
  };

  const handleDeleteSource = (id: string) => {
    if (confirm('Are you sure you want to remove this knowledge source from the project index?')) {
      setSources(sources.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Sources"
        description="Ingest authorized technical runbooks, architecture decision records (ADRs), and GitHub commit trails for factual handover generation."
        actions={
          <Button
            variant="secondary"
            leftIcon={<GitBranch className="w-4 h-4" />}
            onClick={() => setIsGitHubModalOpen(true)}
          >
            Connect Repository
          </Button>
        }
      />

      {/* Top 2 Cards: Document Upload Zone & GitHub Connector Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Ingestion Zone */}
        <div className="lg:col-span-2">
          <div
            onDragOver={e => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-card-lg p-6 sm:p-8 text-center transition-all flex flex-col items-center justify-center bg-white ${
              isDragging
                ? 'border-[#183B35] bg-[#E8F2ED]/40'
                : 'border-[#E5EAE6] hover:border-[#2F6B5D]'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#E8F2ED] text-[#183B35] flex items-center justify-center mb-3 border border-[#D0E3D9]">
              <UploadCloud className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#183B35] font-heading">
              Upload Technical Documentation
            </h3>
            <p className="text-xs text-[#687570] max-w-md mt-1 mb-4 leading-relaxed">
              Drag & drop ADRs, runbooks, onboarding checklists, or vendor SLA docs in <strong>.PDF</strong> or <strong>.DOCX</strong> format (Max 25MB per file).
            </p>

            <label className="cursor-pointer">
              <span className="px-4 py-2 rounded-control text-xs font-semibold bg-[#183B35] text-white hover:bg-[#122C27] transition-all shadow-subtle inline-block">
                Browse Files
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* GitHub Ingestion Status Card */}
        <Card className="p-5 flex flex-col justify-between bg-gradient-to-br from-white to-[#F7F8F6]">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2F6B5D] uppercase tracking-wider">
              <GitBranch className="w-4 h-4 text-[#183B35]" />
              <span>Git Commit & PR Extraction</span>
            </div>

            <h4 className="text-sm font-bold text-[#183B35] font-heading">
              Authoritative Commit Trails
            </h4>

            <p className="text-xs text-[#687570] leading-relaxed">
              KNOWFLOW parses commit histories, merged pull requests, and code comments to reconstruct who made architectural decisions and when.
            </p>

            <div className="p-3 bg-[#E8F2ED] rounded-control border border-[#D0E3D9] text-xs space-y-1">
              <span className="font-semibold text-[#183B35] block">Supported Ingestion:</span>
              <p className="text-[#202B28] text-[11px]">&bull; Release commits & tags</p>
              <p className="text-[#202B28] text-[11px]">&bull; Architecture Decisions (`/docs/adr/*`)</p>
              <p className="text-[#202B28] text-[11px]">&bull; Open WIP branches & unmerged PRs</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGitHubModalOpen(true)}
            className="w-full mt-4"
          >
            Connect Repository
          </Button>
        </Card>
      </div>

      {/* Sources Inventory & Filters */}
      <Card>
        <CardHeader className="flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <CardTitle>Connected Knowledge Sources ({sources.length})</CardTitle>
            <p className="text-xs text-[#687570] mt-0.5">
              Verified documents and code repositories driving handover reports
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <SearchInput
              placeholder="Filter sources..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              className="sm:w-64"
            />

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-[#E5EAE6] rounded-control text-[#202B28]"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF Documents</option>
              <option value="docx">DOCX Files</option>
              <option value="github">GitHub Repositories</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-[#E5EAE6] rounded-control text-[#202B28]"
            >
              <option value="all">All Statuses</option>
              <option value="processed">Processed</option>
              <option value="indexing">Indexing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8F6] border-b border-[#E5EAE6] text-[#687570] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Source Name</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Uploaded By</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Extracted Facts</th>
                  <th className="py-3 px-4">Last Synced</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE6]">
                {filteredSources.map(source => (
                  <tr key={source.id} className="hover:bg-[#F7F8F6] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded bg-[#E8F2ED] text-[#183B35] shrink-0">
                          {source.type === 'github' ? (
                            <GitBranch className="w-4 h-4 text-[#2F6B5D]" />
                          ) : (
                            <FileText className="w-4 h-4 text-[#183B35]" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#183B35]">
                            {source.name}
                          </div>
                          {source.branch && (
                            <span className="font-mono text-[10px] text-[#2F6B5D] block">
                              Branch: {source.branch}
                            </span>
                          )}
                          {source.size && (
                            <span className="text-[10px] text-[#8E9B96]">{source.size}</span>
                          )}
                        </div>
                      </div>

                      {source.errorReason && (
                        <div className="mt-1 flex items-start gap-1 text-[11px] text-[#B54747] bg-[#FDF2F2] p-1.5 rounded border border-[#F8C8C8]">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{source.errorReason}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#202B28]">
                      {source.projectName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        source.addedBy.includes('Rutika') || source.id.includes('src-1') || source.id.includes('src-2')
                          ? 'text-[#B7791F] bg-[#FEF7EB] border-[#F6DEB5]'
                          : 'text-[#2F6B5D] bg-[#E8F2ED] border-[#C3E7D3]'
                      }`}>
                        {source.addedBy.includes('Rutika') || source.id.includes('src-1') || source.id.includes('src-2')
                          ? 'Departing Member (Rutika G.)'
                          : 'Manager (Sarah Lin)'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F0F4F2] text-[#687570]">
                        {source.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge status={source.status} />
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-[#183B35]">
                      {source.extractedFactsCount > 0 ? (
                        <span className="text-[#26734D]">{source.extractedFactsCount} facts</span>
                      ) : (
                        <span className="text-[#8E9B96]">&mdash;</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#687570]">
                      {formatTimeAgo(source.lastSynced)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDeleteSource(source.id)}
                          className="p-1.5 text-[#8E9B96] hover:text-[#B54747] hover:bg-[#FDF2F2] rounded-control transition-colors"
                          title="Remove source"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Connect GitHub Modal */}
      <Modal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        title="Connect GitHub Repository"
        subtitle="Extract commit histories, pull request discussions, and architecture docs."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsGitHubModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConnectGitHub}>
              Start Ingestion
            </Button>
          </>
        }
      >
        <form onSubmit={handleConnectGitHub} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#183B35] mb-1">
              Repository Name / URL <span className="text-[#B54747]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. acme-corp/payment-ledger-service"
              value={gitHubForm.repoUrl}
              onChange={e => setGitHubForm({ ...gitHubForm, repoUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control font-mono"
            />
            {gitHubError && <p className="text-[11px] text-[#B54747] mt-1">{gitHubError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Branch to Analyze
              </label>
              <input
                type="text"
                placeholder="main"
                value={gitHubForm.branch}
                onChange={e => setGitHubForm({ ...gitHubForm, branch: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Assign to Project
              </label>
              <select
                value={gitHubForm.project}
                onChange={e => setGitHubForm({ ...gitHubForm, project: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
              >
                {mockProjects.map(p => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 rounded-control bg-[#F7F8F6] border border-[#E5EAE6] text-xs text-[#687570] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#2F6B5D] shrink-0 mt-0.5" />
            <span>
              KNOWFLOW uses read-only AST tokenization to index public & authorized repositories without storing source code binaries.
            </span>
          </div>
        </form>
      </Modal>
    </div>
  );
};
