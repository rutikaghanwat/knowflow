import React from 'react';
import { cn } from '../../utils';
import { Clock, Loader2, CheckCircle2, AlertOctagon } from 'lucide-react';

export type ProcessingStatus = 'uploaded' | 'extracting' | 'processed' | 'failed';

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: ProcessingStatus;
  size?: 'sm' | 'md';
  failureReason?: string;
  showIcon?: boolean;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = 'md',
  failureReason,
  showIcon = true,
  className,
  ...props
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'uploaded':
        return {
          label: 'Uploaded',
          classes: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
          icon: <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />,
        };
      case 'extracting':
        return {
          label: 'Extracting text',
          classes: 'bg-[#FEF7EB] text-[#B7791F] border-[#FCE2B6]',
          icon: <Loader2 className={cn('animate-spin', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} aria-hidden="true" />,
        };
      case 'processed':
        return {
          label: 'Processed',
          classes: 'bg-[#EBF7F0] text-[#218653] border-[#C3E7D3]',
          icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />,
        };
      case 'failed':
        return {
          label: failureReason ? `Failed: ${failureReason}` : 'Failed',
          classes: 'bg-[#FDF2F2] text-[#B54747] border-[#F8B4B4]',
          icon: <AlertOctagon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors select-none',
        size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5',
        config.classes,
        className
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
