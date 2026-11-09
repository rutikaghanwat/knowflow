import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils';

export interface StepItem {
  id: string | number;
  label: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
}

export interface StepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex,
  className,
  orientation = 'horizontal',
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={cn('space-y-4', className)}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex || step.isCompleted;
          const isActive = idx === currentStepIndex || step.isActive;

          return (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    isCompleted && 'bg-[#218653] text-white',
                    isActive && 'bg-[#142640] text-white ring-4 ring-[#218653]/20',
                    !isCompleted && !isActive && 'bg-[#F1F5F3] text-[#687570] border border-[#CBD5E1]'
                  )}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 h-6 my-1',
                      isCompleted ? 'bg-[#218653]' : 'bg-[#E5EAE6]'
                    )}
                  />
                )}
              </div>
              <div className="pt-0.5">
                <p
                  className={cn(
                    'text-xs sm:text-sm font-semibold',
                    isActive ? 'text-[#142640]' : isCompleted ? 'text-[#218653]' : 'text-[#687570]'
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-[11px] text-[#687570] mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-0.5 bg-[#E5EAE6] -z-0" />
        {/* Active track progress */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-[#218653] transition-all duration-300 -z-0"
          style={{
            width: `${(currentStepIndex / Math.max(steps.length - 1, 1)) * 100}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex || step.isCompleted;
          const isActive = idx === currentStepIndex || step.isActive;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-subtle',
                  isCompleted && 'bg-[#218653] text-white',
                  isActive && 'bg-[#142640] text-white ring-4 ring-[#218653]/30 scale-110',
                  !isCompleted && !isActive && 'bg-white text-[#687570] border border-[#CBD5E1]'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  'text-[11px] font-medium mt-1.5 whitespace-nowrap hidden sm:block',
                  isActive ? 'text-[#142640] font-bold' : isCompleted ? 'text-[#218653]' : 'text-[#687570]'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
