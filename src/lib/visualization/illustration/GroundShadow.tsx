import React from 'react';

export interface GroundShadowProps {
  isSeated?: boolean;
}

export const GroundShadow: React.FC<GroundShadowProps> = ({ isSeated = false }) => {
  return (
    <g id="ground-shadow" opacity="0.35">
      <defs>
        <radialGradient id="shadow-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1F1B18" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#1F1B18" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1F1B18" stopOpacity="0" />
        </radialGradient>
      </defs>
      {isSeated ? (
        <ellipse cx="200" cy="462" rx="72" ry="16" fill="url(#shadow-gradient)" />
      ) : (
        <ellipse cx="200" cy="460" rx="60" ry="12" fill="url(#shadow-gradient)" />
      )}
    </g>
  );
};
