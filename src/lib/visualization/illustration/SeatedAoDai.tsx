import React from 'react';
import { computeGarmentTones } from './tones';

export interface SeatedAoDaiProps {
  primaryColor: string;
  pantColor: string;
  frontHemReduction?: number; // cm (default 12cm reduction for wheelchair)
  slitRaise?: number;         // cm
}

export const SeatedAoDai: React.FC<SeatedAoDaiProps> = ({
  primaryColor,
  pantColor,
  frontHemReduction = 12,
  slitRaise = 8,
}) => {
  const tones = computeGarmentTones(primaryColor);
  const lapHemY = 360 - frontHemReduction * 1.5;

  return (
    <g id="garment-seated-wheelchair">
      {/* Wheelchair Structural Frame (Behind) */}
      <g id="wheelchair-frame" stroke="#44403C" strokeWidth="2.5" fill="none">
        {/* Backrest frame */}
        <line x1="140" y1="170" x2="140" y2="330" />
        <line x1="135" y1="180" x2="140" y2="180" strokeWidth="4" />
        {/* Large Wheel & Spokes */}
        <circle cx="150" cy="380" r="68" stroke="#1F1B18" strokeWidth="4" />
        <circle cx="150" cy="380" r="60" stroke="#736960" strokeWidth="1.5" />
        {/* Hub */}
        <circle cx="150" cy="380" r="10" fill="#1F1B18" />
        {/* Spokes */}
        <line x1="150" y1="315" x2="150" y2="445" stroke="#736960" strokeWidth="0.8" />
        <line x1="85" y1="380" x2="215" y2="380" stroke="#736960" strokeWidth="0.8" />
        <line x1="105" y1="335" x2="195" y2="425" stroke="#736960" strokeWidth="0.8" />
        <line x1="105" y1="425" x2="195" y2="335" stroke="#736960" strokeWidth="0.8" />
        {/* Footrest */}
        <path d="M225 435 L255 435 L250 445 L220 445 Z" fill="#292524" />
      </g>

      {/* Seated Leg / Pants Geometry */}
      <g id="seated-pants">
        {/* Thighs horizontal projection */}
        <path
          d="M170 260 L245 275 L240 315 L165 305 Z"
          fill={pantColor}
        />
        {/* Calves vertical down to footrest */}
        <path
          d="M230 300 L245 425 L225 425 L215 310 Z"
          fill={pantColor}
        />
      </g>

      {/* Seated Garment Torso */}
      <path
        d="M178 126 Q200 130 222 126 L232 235 L168 235 Z"
        fill={tones.base}
      />

      {/* Lap Drape (Tà áo phủ đùi được điều chỉnh ngắn gọn không chạm bánh xe) */}
      <path
        d={`M168 235 L245 260 L240 ${lapHemY} Q200 ${lapHemY + 6} 165 ${lapHemY - 5} Z`}
        fill={tones.base}
      />
      {/* Lap shadow underneath drape */}
      <path
        d={`M165 ${lapHemY - 5} Q200 ${lapHemY + 6} 240 ${lapHemY} L238 ${lapHemY + 8} Q200 ${lapHemY + 14} 164 ${lapHemY + 2} Z`}
        fill={tones.shadow}
        opacity="0.6"
      />

      {/* Side Slit Relief (Nâng điểm xẻ tà chống kích nách/eo khi ngồi) */}
      <path
        d={`M168 ${235 - slitRaise} Q172 250 178 260`}
        stroke={tones.highlight}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Sleeves relaxed on armrest/lap */}
      <path
        d="M178 126 L150 185 L180 240 L195 235 L170 185 L174 135 Z"
        fill={tones.base}
      />
      <path
        d="M222 126 L248 185 L220 240 L205 235 L230 185 L226 135 Z"
        fill={tones.base}
      />

      {/* Collar */}
      <path
        d="M188 120 Q200 124 212 120 L214 128 Q200 132 186 128 Z"
        fill={tones.base}
        stroke={tones.shadow}
        strokeWidth="0.8"
      />
    </g>
  );
};
