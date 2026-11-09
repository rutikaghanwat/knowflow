import React from 'react';
import { cn } from '../../utils';

export interface TimelineEntry {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  timestamp: string;
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'info' | 'neutral';
  meta?: React.ReactNode;
}

export interface TimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ entries, className }) => {
  const getStatusColor = (status?: TimelineEntry['status']) => {
    switch (status) {
      case 'success':
        return 'bg-[#EBF7F0] text-[#218653] border-[#C3E7D3]';
      case 'warning':
        return 'bg-[#FEF7EB] text-[#B7791F] border-[#FCE2B6]';
      case 'info':
        return 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';
      default:
        return 'bg-[#F1F5F3] text-[#475569] border-[#CBD5E1]';
    }
  };

  return (
    <div className={cn('relative pl-6 space-y-6', className)}>
      {/* Vertical Spine */}
      <div className="absolute top-2 bottom-2 left-2.5 w-0.5 bg-[#E5EAE6] -z-0" />

      {entries.map((entry) => (
        <div key={entry.id} className="relative z-10 flex items-start gap-3 group">
          <div
            className={cn(
              'w-6 h-6 rounded-full -ml-[23px] flex items-center justify-center border shadow-subtle shrink-0 text-xs',
              getStatusColor(entry.status)
            )}
          >
            {entry.icon ? entry.icon : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
          </div>
          <div className="flex-1 bg-white p-3.5 rounded-2xl border border-[#E5EAE6] shadow-subtle hover:border-[#CBD5E1] transition-colors">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-[#142640]">
                {entry.title}
              </h4>
              <time className="text-[11px] text-[#687570] shrink-0 font-mono">
                {entry.timestamp}
              </time>
            </div>
            {entry.subtitle && (
              <div className="text-xs text-[#687570] mt-1 leading-relaxed">
                {entry.subtitle}
              </div>
            )}
            {entry.meta && <div className="mt-2 pt-2 border-t border-[#E5EAE6]">{entry.meta}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};
