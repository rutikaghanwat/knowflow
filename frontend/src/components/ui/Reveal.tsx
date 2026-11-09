import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils';

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  direction = 'up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-6';
      case 'down':
        return '-translate-y-6';
      case 'left':
        return 'translate-x-6';
      case 'right':
        return '-translate-x-6';
      case 'none':
        return '';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: '600ms',
        transitionDelay: `${delay}ms`,
      }}
      className={cn(
        'transition-all ease-out transform',
        isVisible ? 'opacity-100 translate-x-0 translate-y-0' : cn('opacity-0', getTransform()),
        className
      )}
    >
      {children}
    </div>
  );
};
