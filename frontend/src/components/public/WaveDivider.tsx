import React from 'react';

interface WaveDividerProps {
  fillColor?: string;
  inverted?: boolean;
  className?: string;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
  fillColor = '#FFFFFF',
  inverted = false,
  className = '',
}) => {
  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className} ${
        inverted ? 'rotate-180 -mb-px' : '-mt-px'
      }`}
      aria-hidden="true"
    >
      <svg
        className="relative block w-full h-8 sm:h-12 lg:h-16"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
};
