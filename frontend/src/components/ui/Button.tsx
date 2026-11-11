import React from 'react';
import { cn } from '../../utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'mint' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-control transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#32164C] text-white hover:bg-[#122C27] active:bg-[#0E231F] shadow-subtle border border-[#32164C]',
      secondary:
        'bg-[#704B91] text-white hover:bg-[#26574B] active:bg-[#1E453B] shadow-subtle border border-[#704B91]',
      mint:
        'bg-[#F2EDF8] text-[#32164C] hover:bg-[#D9ECE1] active:bg-[#C9E3D4] border border-[#E4D9EF]',
      outline:
        'bg-white text-[#202B28] border border-[#E8E0EF] hover:bg-[#FAF8FC] hover:border-[#D9CBE3] active:bg-[#F2EDF8]',
      ghost:
        'bg-transparent text-[#202B28] hover:bg-[#F2EDF8] active:bg-[#F2EDF8]',
      danger:
        'bg-[#B54747] text-white hover:bg-[#9B3C3C] active:bg-[#853333] shadow-subtle border border-[#B54747]',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-3.5 py-2 gap-2 h-9',
      lg: 'text-base px-5 py-2.5 gap-2.5 h-11',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
