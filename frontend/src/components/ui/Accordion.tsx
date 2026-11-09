import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string | string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenId,
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(() => {
    if (!defaultOpenId) return [];
    return Array.isArray(defaultOpenId) ? defaultOpenId : [defaultOpenId];
  });

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    } else {
      setOpenIds(prev => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `accordion-header-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-[#E5EAE6] bg-white overflow-hidden transition-all duration-200 shadow-subtle"
          >
            <h3>
              <button
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#F5F7F6]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#218653] focus:ring-inset"
              >
                <div className="flex items-center gap-3">
                  {item.icon && <span className="text-[#218653] shrink-0">{item.icon}</span>}
                  <div>
                    <span className="text-sm font-bold text-[#142640] block">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-xs text-[#687570] block mt-0.5">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-[#687570] shrink-0 transition-transform duration-200',
                    isOpen && 'rotate-180 text-[#218653]'
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={cn(
                'overflow-hidden transition-all duration-300',
                isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#687570] leading-relaxed border-t border-[#E5EAE6]/50">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
