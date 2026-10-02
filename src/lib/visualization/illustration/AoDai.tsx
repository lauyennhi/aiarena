import React from 'react';
import { computeGarmentTones } from './tones';

export interface AoDaiProps {
  primaryColor: string;
  pantColor: string;
  sleeveAdjustment?: number; // cm
  hemAdjustment?: number;    // cm
  slitPosition?: number;     // cm
}

export const AoDai: React.FC<AoDaiProps> = ({
  primaryColor,
  pantColor,
  sleeveAdjustment = 0,
  hemAdjustment = 0,
  slitPosition = 0,
}) => {
  const tones = computeGarmentTones(primaryColor);
  const hemY = 430 - hemAdjustment * 2;
  const slitY = 240 - slitPosition * 2;
  const sleeveReach = 280 + sleeveAdjustment * 2;

  return (
    <g id="garment-ao-dai">
      {/* Trousers (Quần lụa suông rộng) */}
      <path
        d="M174 250 L165 448 Q178 450 188 448 L197 290 L203 290 L212 448 Q222 450 235 448 L226 250 Z"
        fill={pantColor}
      />
      <path d="M199 290 L199 448" stroke="#1F1B18" strokeWidth="0.8" opacity="0.15" />

      {/* Back Hem Shadow */}
      <path
        d={`M165 240 L160 ${hemY + 8} Q200 ${hemY + 18} 240 ${hemY + 8} L235 240 Z`}
        fill={tones.shadow}
      />

      {/* Main Front Body & Tà Áo (Base) */}
      <path
        d={`M178 126 Q200 130 222 126 L234 235 Q235 ${slitY} 240 ${hemY} Q200 ${hemY + 12} 160 ${hemY} Q165 ${slitY} 166 235 Z`}
        fill={tones.base}
      />

      {/* Highlight Tone: Center chest and light drape */}
      <path
        d={`M188 128 Q200 131 212 128 L218 240 Q200 242 182 240 Z`}
        fill={tones.highlight}
        opacity="0.3"
      />

      {/* Side Slits & Shadow Tones */}
      <path
        d={`M166 235 Q165 ${slitY} 160 ${hemY} L166 ${hemY} Q170 ${slitY} 172 235 Z`}
        fill={tones.shadow}
        opacity="0.5"
      />
      <path
        d={`M234 235 Q235 ${slitY} 240 ${hemY} L234 ${hemY} Q230 ${slitY} 228 235 Z`}
        fill={tones.shadow}
        opacity="0.3"
      />

      {/* Sleeves (Tay áo lụa dài) */}
      {/* Left arm */}
      <path
        d={`M178 128 L142 185 L135 ${sleeveReach} L148 ${sleeveReach - 5} L160 190 L170 155 Z`}
        fill={tones.base}
      />
      {/* Left arm shadow */}
      <path
        d={`M142 185 L135 ${sleeveReach} L140 ${sleeveReach} L148 185 Z`}
        fill={tones.shadow}
        opacity="0.4"
      />

      {/* Right arm */}
      <path
        d={`M222 128 L258 185 L265 ${sleeveReach} L252 ${sleeveReach - 5} L240 190 L230 155 Z`}
        fill={tones.base}
      />
      {/* Right arm highlight */}
      <path
        d={`M224 130 L256 185 L260 ${sleeveReach - 10} L256 ${sleeveReach - 10} L228 135 Z`}
        fill={tones.highlight}
        opacity="0.25"
      />

      {/* Collar (Cổ đứng / Lập lĩnh thanh thoát) */}
      <path
        d="M188 120 Q200 124 212 120 L214 128 Q200 132 186 128 Z"
        fill={tones.base}
        stroke={tones.shadow}
        strokeWidth="0.8"
      />

      {/* Silk Fold Lines */}
      <g stroke={tones.shadow} strokeWidth="1" fill="none" opacity="0.4" strokeLinecap="round">
        <path d="M192 145 Q195 190 190 230" />
        <path d="M208 145 Q205 190 210 230" />
        <path d={`M185 280 Q188 340 180 ${hemY - 20}`} />
        <path d={`M215 280 Q212 340 220 ${hemY - 20}`} />
      </g>
    </g>
  );
};
