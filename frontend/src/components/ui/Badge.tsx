import React from 'react';
import { cn, getStatusBadgeVariant } from '../../utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'mint';
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  showDot = true,
  className,
  children,
  ...props
}) => {
  if (status) {
    const config = getStatusBadgeVariant(status);
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
          config.bg,
          config.text,
          config.border,
          className
        )}
        {...props}
      >
        {showDot && (
          <span
            className={cn('w-1.5 h-1.5 rounded-full', {
              'bg-[#704B91]': config.text.includes('#704B91'),
              'bg-[#B7791F]': config.text.includes('#B7791F'),
              'bg-[#B54747]': config.text.includes('#B54747'),
              'bg-[#697586]': config.text.includes('#697586'),
            })}
          />
        )}
        {children || config.label}
      </span>
    );
  }

  const variants = {
    default: 'bg-[#F2EDF8] text-[#697586] border-[#E8E0EF]',
    success: 'bg-[#F2EDF8] text-[#704B91] border-[#E4D9EF]',
    warning: 'bg-[#FEF7EB] text-[#B7791F] border-[#F6DEB5]',
    error: 'bg-[#FDF2F2] text-[#B54747] border-[#F8C8C8]',
    mint: 'bg-[#F2EDF8] text-[#32164C] border-[#E4D9EF]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variant ? variants[variant] : variants.default,
        className
      )}
      {...props}
    >
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
};
