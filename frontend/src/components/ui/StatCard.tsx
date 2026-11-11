import React from 'react';
import { cn } from '../../utils';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
  onClick,
}) => {
  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={cn('p-5 flex flex-col justify-between relative overflow-hidden', className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#697586] uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#32164C] font-heading mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-control bg-[#F2EDF8] text-[#32164C] flex items-center justify-center shrink-0 border border-[#E4D9EF]">
          {icon}
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 pt-3 border-t border-[#E8E0EF] flex items-center justify-between text-xs">
          {description && <span className="text-[#697586]">{description}</span>}
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium ml-auto',
                trend.positive ? 'text-[#704B91]' : 'text-[#B54747]'
              )}
            >
              {trend.positive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
