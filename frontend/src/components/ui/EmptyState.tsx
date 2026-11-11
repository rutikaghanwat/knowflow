import React from 'react';
import { cn } from '../../utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-card border border-dashed border-[#E8E0EF] bg-[#FAF8FC]/60',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-[#F2EDF8] text-[#32164C] flex items-center justify-center mb-3.5 border border-[#E4D9EF]">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#32164C] font-heading">{title}</h3>
      <p className="text-sm text-[#697586] max-w-sm mt-1 mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
