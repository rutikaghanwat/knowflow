import React, { useRef } from 'react';
import { cn } from '../../utils';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'underline' | 'contained';
  size?: 'sm' | 'md';
  className?: string;
  ariaLabel?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  size = 'md',
  className,
  ariaLabel = 'Navigation Tabs',
}) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledTabs = tabs.filter(t => !t.disabled);
    const currentIndex = enabledTabs.findIndex(t => t.id === tabs[index].id);

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = enabledTabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    onChange(enabledTabs[nextIndex].id);
    const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'flex items-center overflow-x-auto no-scrollbar',
        variant === 'contained' && 'bg-[#F1F5F3] p-1 rounded-xl border border-[#E5EAE6]',
        variant === 'underline' && 'border-b border-[#E5EAE6] gap-6',
        variant === 'pills' && 'gap-2',
        className
      )}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              'inline-flex items-center gap-2 font-medium transition-all duration-150 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#218653] focus:ring-offset-1 select-none',
              size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-xs sm:text-sm px-4 py-2',
              tab.disabled && 'opacity-40 cursor-not-allowed',

              variant === 'contained' && [
                'rounded-lg',
                isActive
                  ? 'bg-white text-[#142640] font-bold shadow-subtle'
                  : 'text-[#687570] hover:text-[#142640]',
              ],

              variant === 'pills' && [
                'rounded-full',
                isActive
                  ? 'bg-[#218653] text-white font-bold shadow-pill'
                  : 'bg-white text-[#687570] border border-[#E5EAE6] hover:border-[#CBD5E1] hover:text-[#142640]',
              ],

              variant === 'underline' && [
                'border-b-2 -mb-px px-1 pb-3 pt-1 rounded-none',
                isActive
                  ? 'border-[#218653] text-[#218653] font-bold'
                  : 'border-transparent text-[#687570] hover:text-[#142640] hover:border-[#CBD5E1]',
              ]
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1',
                  isActive ? 'bg-white/20 text-white' : 'bg-[#EBF7F0] text-[#218653]'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
