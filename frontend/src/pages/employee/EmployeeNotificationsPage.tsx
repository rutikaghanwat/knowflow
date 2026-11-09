import React from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  FileCheck2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { mockNotifications } from '../../data/mockData';

export const EmployeeNotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <PageHeader
        title="Notifications & Handover Alerts"
        description="Real transition events, manager approvals, and required review checkpoints."
        badge="Activity Stream"
      />

      <div className="space-y-3">
        {mockNotifications.map((notif) => (
          <div
            key={notif.id}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-subtle flex items-start gap-3.5 hover:border-[#218653] transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EBF7F0] text-[#218653] flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#142640]">
                  {notif.title}
                </h4>
                <time className="text-[11px] text-[#8E9B96] font-mono shrink-0">
                  {notif.timestamp}
                </time>
              </div>
              <p className="text-xs text-[#687570] leading-relaxed">
                {notif.message}
              </p>
              {notif.link && (
                <div className="pt-1.5">
                  <a
                    href={notif.link}
                    className="text-xs font-bold text-[#218653] hover:underline"
                  >
                    View transition details &rarr;
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
