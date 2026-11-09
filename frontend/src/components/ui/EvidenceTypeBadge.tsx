import React from 'react';
import { EvidenceType } from '../../types';
import { cn, getEvidenceMeta } from '../../utils';
import { CheckCircle2, Sparkles, AlertTriangle, HelpCircle } from 'lucide-react';

export interface EvidenceTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: EvidenceType;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const EvidenceTypeBadge: React.FC<EvidenceTypeBadgeProps> = ({
  type,
  showIcon = true,
  size = 'md',
  className,
  ...props
}) => {
  const meta = getEvidenceMeta(type);

  const getIcon = () => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';
    switch (type) {
      case 'verified_fact':
        return <CheckCircle2 className={iconSize} aria-hidden="true" />;
      case 'ai_inference':
        return <Sparkles className={iconSize} aria-hidden="true" />;
      case 'recommendation':
        return <AlertTriangle className={iconSize} aria-hidden="true" />;
      case 'unknown_missing':
        return <HelpCircle className={iconSize} aria-hidden="true" />;
    }
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-all select-none',
        sizeClasses[size],
        meta.badgeClass,
        className
      )}
      title={meta.desc}
      role="status"
      aria-label={`${meta.label}: ${meta.desc}`}
      {...props}
    >
      {showIcon && getIcon()}
      <span>{meta.label}</span>
    </span>
  );
};
