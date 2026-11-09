import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { mockHandoverReport } from '../../data/mockData';

export const EmployeeReportsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <PageHeader
        title="Handover Reports"
        description="Formal handover briefings shared with you after managerial audit and approval."
        badge="Authorized Dossiers"
      />

      <div className="space-y-4">
        {/* Approved Report Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#C3E7D3] shadow-resting space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#218653] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#C3E7D3]">
                  Manager Approved
                </span>
                <span className="text-xs text-[#687570] font-mono">v{mockHandoverReport.version} &bull; Released Nov 4, 2026</span>
              </div>
              <h3 className="text-lg font-bold text-[#142640] font-heading">
                {mockHandoverReport.title}
              </h3>
            </div>

            <button
              onClick={() => navigate('/employee/report')}
              className="px-5 py-2.5 rounded-full bg-[#218653] text-white text-xs font-bold shadow-pill hover:bg-[#1B6E44] transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>View Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[#687570] leading-relaxed">
            {mockHandoverReport.summary}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#F5F7F6]">
              <span className="text-[#687570] text-[11px] block">Verified Facts</span>
              <strong className="text-sm font-bold text-[#218653]">{mockHandoverReport.verifiedFactsCount} facts</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#F5F7F6]">
              <span className="text-[#687570] text-[11px] block">AI Inferences</span>
              <strong className="text-sm font-bold text-[#2F6B5D]">{mockHandoverReport.aiInferencesCount} inferences</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#F5F7F6]">
              <span className="text-[#687570] text-[11px] block">Recommendations</span>
              <strong className="text-sm font-bold text-[#B7791F]">{mockHandoverReport.recommendationsCount} items</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#F5F7F6]">
              <span className="text-[#687570] text-[11px] block">Unresolved Flags</span>
              <strong className="text-sm font-bold text-[#142640]">{mockHandoverReport.unresolvedCount} questions</strong>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5EAE6] flex items-center justify-between text-xs text-[#687570]">
            <span>
              Approved by: <strong className="text-[#142640]">{mockHandoverReport.manager.name}</strong> ({mockHandoverReport.manager.role})
            </span>
            <span className="text-[#218653] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for digital sign-off
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
