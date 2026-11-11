import React, { useEffect, useRef, useState } from 'react';

export const OrganicBlob: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
      aria-hidden="true"
    >
      <div
        className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[520px] sm:w-[980px] sm:h-[640px] rounded-full blur-3xl opacity-35 bg-gradient-to-tr from-[#704B91]/25 via-[#704B91]/20 to-[#32164C]/15 ${
          isVisible ? 'animate-blob-slow' : ''
        }`}
        style={{
          filter: 'blur(75px)',
          willChange: 'transform',
        }}
      />
      <div
        className={`absolute top-48 -left-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-20 bg-gradient-to-br from-[#BDA4D2]/20 to-[#F2EDF8]/40 ${
          isVisible ? 'animate-pulse-subtle' : ''
        }`}
        style={{
          filter: 'blur(65px)',
        }}
      />
    </div>
  );
};
