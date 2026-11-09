import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Database,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { mockProjects } from '../../data/mockData';

export const EmployeeProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter projects to only those permitted to the employee
  const permittedProjects = mockProjects.filter((p) =>
    currentUser.perspective === 'departing'
      ? p.name.includes('Payments') || p.name.includes('Streaming')
      : p.name.includes('Payments')
  );

  const filteredProjects = permittedProjects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <PageHeader
        title="My Assigned Projects"
        description="Projects you are actively participating in with assigned handover responsibilities."
        badge="Permitted Scopes"
      />

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-[#8E9B96] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search assigned projects..."
          className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-[#E5EAE6] rounded-xl focus:border-[#218653] focus:ring-1 focus:ring-[#218653] text-[#142640]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-6 rounded-3xl bg-white border border-[#E5EAE6] shadow-resting hover:border-[#218653] transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                  Active Scope
                </span>
                <span className="text-xs font-mono font-bold text-[#142640]">
                  {project.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#142640] font-heading">
                {project.name}
              </h3>
              <p className="text-xs text-[#687570] leading-relaxed">
                {project.description}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#F5F7F6]">
                  <span className="text-[10px] text-[#687570] block">Sources</span>
                  <strong className="text-xs text-[#142640] font-bold">{project.sourcesCount} files</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F7F6]">
                  <span className="text-[10px] text-[#687570] block">Handovers</span>
                  <strong className="text-xs text-[#142640] font-bold">{project.handoversCount} active</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F7F6]">
                  <span className="text-[10px] text-[#687570] block">Team</span>
                  <strong className="text-xs text-[#142640] font-bold">{project.membersCount} members</strong>
                </div>
              </div>

              <div className="pt-2 text-xs text-[#687570] space-y-1">
                <div className="flex items-center justify-between">
                  <span>Manager:</span>
                  <strong className="text-[#142640]">{project.owner}</strong>
                </div>
                {project.repoUrl && (
                  <div className="flex items-center justify-between">
                    <span>GitHub Repository:</span>
                    <span className="font-mono text-[11px] text-[#218653]">{project.repoUrl}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5EAE6] flex justify-between items-center">
              <span className="text-[11px] text-[#687570]">
                Role: <strong>{currentUser.role}</strong>
              </span>
              <button
                onClick={() =>
                  navigate(
                    currentUser.perspective === 'departing'
                      ? '/employee/handover/upload'
                      : '/employee/report'
                  )
                }
                className="text-xs font-bold text-[#218653] hover:underline flex items-center gap-1"
              >
                <span>Open Handover</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
