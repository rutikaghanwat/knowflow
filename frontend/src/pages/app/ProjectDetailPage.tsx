import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FolderGit2,
  GitBranch,
  Calendar,
  ExternalLink,
  Users,
  Database,
  ArrowRightLeft,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { mockProjects, mockKnowledgeSources, mockHandovers, mockTeamMembers } from '../../data/mockData';
import { formatTimeAgo, formatDate } from '../../utils';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'handovers' | 'team'>('overview');

  const project = mockProjects.find(p => p.id === id) || mockProjects[0];
  const projectSources = mockKnowledgeSources.filter(s => s.projectName === project.name);
  const projectHandovers = mockHandovers.filter(h => h.projectName === project.name);
  const projectMembers = mockTeamMembers.filter(m => m.projects.includes(project.name));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FolderGit2 },
    { id: 'sources', label: `Knowledge Sources (${projectSources.length})`, icon: Database },
    { id: 'handovers', label: `Handovers (${projectHandovers.length})`, icon: ArrowRightLeft },
    { id: 'team', label: `Team Members (${projectMembers.length})`, icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/app/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#687570] hover:text-[#183B35] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Project Header Card */}
      <Card className="p-6 bg-white border-[#E5EAE6] shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAE6]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#2F6B5D] bg-[#E8F2ED] px-2.5 py-0.5 rounded border border-[#D0E3D9]">
                {project.code}
              </span>
              <Badge status={project.status} />
              {project.repoUrl && (
                <a
                  href={`https://${project.repoUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#2F6B5D] hover:underline inline-flex items-center gap-1 ml-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{project.repoUrl}</span>
                </a>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-[#183B35] font-heading">
              {project.name}
            </h1>
            <p className="text-xs text-[#687570] max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/app/handovers?action=create')}
            >
              Initiate Handover
            </Button>
          </div>
        </div>

        {/* Project Meta Metrics */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8E9B96] tracking-wider block">Project Lead</span>
            <span className="font-semibold text-[#183B35] mt-0.5 block">{project.owner}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8E9B96] tracking-wider block">Contributors</span>
            <span className="font-semibold text-[#183B35] mt-0.5 block">{project.membersCount} Engineers</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8E9B96] tracking-wider block">Indexed Sources</span>
            <span className="font-semibold text-[#183B35] mt-0.5 block">{project.sourcesCount} Documents & Repos</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8E9B96] tracking-wider block">Last Synced</span>
            <span className="font-semibold text-[#183B35] mt-0.5 block">{formatTimeAgo(project.lastUpdated)}</span>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#E5EAE6] pb-px overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-control border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-[#183B35] text-[#183B35] bg-white'
                  : 'border-transparent text-[#687570] hover:text-[#202B28] hover:bg-[#F7F8F6]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-[#183B35] font-heading">
                Architecture & Scope Summary
              </h3>
              <p className="text-xs text-[#202B28] leading-relaxed">
                {project.description}
              </p>

              <div className="p-4 bg-[#F7F8F6] rounded-card border border-[#E5EAE6] space-y-2">
                <span className="text-xs font-bold text-[#183B35] block">
                  Knowledge Preservation Status
                </span>
                <p className="text-xs text-[#687570] leading-relaxed">
                  Repository commit trails are indexed continuously. Technical runbooks and architecture decision records provide evidence for active transition reports.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs text-[#26734D] font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AST Knowledge Tokenizer verified 221 facts</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E9B96]">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  leftIcon={<Database className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/app/sources')}
                >
                  Upload Technical Document
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  leftIcon={<GitBranch className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/app/sources')}
                >
                  Connect Additional Repository
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  leftIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/app/handovers?action=create')}
                >
                  Initiate New Handover
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Sources */}
      {activeTab === 'sources' && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Connected Knowledge Sources</CardTitle>
              <p className="text-xs text-[#687570] mt-0.5">Documents and repository histories attached to {project.name}</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => navigate('/app/sources')}
            >
              Add Source
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#E5EAE6]">
              {projectSources.map(source => (
                <div key={source.id} className="p-4 flex items-center justify-between gap-3 hover:bg-[#F7F8F6] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-[#E8F2ED] text-[#183B35]">
                      {source.type === 'github' ? <GitBranch className="w-4 h-4 text-[#2F6B5D]" /> : <FileText className="w-4 h-4 text-[#183B35]" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#183B35]">{source.name}</h4>
                      <p className="text-[11px] text-[#8E9B96]">
                        {source.branch || source.size} &bull; Synced {formatTimeAgo(source.lastSynced)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-[#26734D]">
                      {source.extractedFactsCount} facts extracted
                    </span>
                    <Badge status={source.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Handovers */}
      {activeTab === 'handovers' && (
        <div className="space-y-4">
          {projectHandovers.map(ho => (
            <Card
              key={ho.id}
              className="p-5 hover:border-[#2F6B5D] transition-all cursor-pointer"
              onClick={() => navigate(`/app/reports?id=${ho.reportId || 'rep-01'}`)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge status={ho.status} />
                    <span className="text-xs text-[#8E9B96]">Target: {formatDate(ho.targetDate)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#183B35] font-heading">{ho.title}</h4>
                  <p className="text-xs text-[#687570]">
                    Departing: <strong>{ho.departingMember.name}</strong> &rarr; Incoming: <strong>{ho.incomingMember.name}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#183B35]">{ho.progressPercentage}% Complete</span>
                    <div className="w-24 bg-[#E5EAE6] h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-[#26734D] h-full rounded-full" style={{ width: `${ho.progressPercentage}%` }} />
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 4: Team */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectMembers.map(member => (
            <Card key={member.id} className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#D0E3D9]"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#183B35]">{member.name}</h4>
                  <p className="text-[11px] text-[#2F6B5D] font-medium">{member.role}</p>
                  <p className="text-[10px] text-[#8E9B96]">{member.email}</p>
                </div>
              </div>
              <Badge status={member.status} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
