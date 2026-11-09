import React from 'react';
import { EvidenceType } from '../../types';
import { cn, getEvidenceMeta } from '../../utils';
import { CheckCircle2, Sparkles, AlertTriangle, HelpCircle } from 'lucide-react';

interface EvidenceBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: EvidenceType;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  type,
  showIcon = true,
  size = 'md',
  className,
  ...props
}) => {
  const meta = getEvidenceMeta(type);

  const getIcon = () => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
    switch (type) {
      case 'verified_fact':
        return <CheckCircle2 className={iconSize} />;
      case 'ai_inference':
        return <Sparkles className={iconSize} />;
      case 'recommendation':
        return <AlertTriangle className={iconSize} />;
      case 'unknown_missing':
        return <HelpCircle className={iconSize} />;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors select-none',
        size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5',
        meta.badgeClass,
        className
      )}
      title={meta.desc}
      {...props}
    >
      {showIcon && getIcon()}
      <span>{meta.label}</span>
    </span>
  );
};
