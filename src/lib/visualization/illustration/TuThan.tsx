import React from 'react';
import { computeGarmentTones } from './tones';

export interface TuThanProps {
  primaryColor: string;
  bodiceColor?: string; // Màu yếm
  sashColor?: string;   // Màu thắt lưng lụa
}

export const TuThan: React.FC<TuThanProps> = ({
  primaryColor,
  bodiceColor = '#A82B3A',
  sashColor = '#D4AF37',
}) => {
  const tones = computeGarmentTones(primaryColor);

  return (
    <g id="garment-tu-than">
      {/* Váy Đen Dân Gian (Long flowing black skirt) */}
      <path
        d="M172 245 L155 450 Q200 455 245 450 L228 245 Z"
        fill="#1C1C1E"
      />
      {/* Váy folds */}
      <path d="M185 260 L175 448" stroke="#38322D" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M215 260 L225 448" stroke="#38322D" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Yếm Cổ Xây / Cổ Nhạn Bên Trong */}
      <path
        d="M190 124 L200 148 L210 124 L216 160 L184 160 Z"
        fill={bodiceColor}
        stroke="#FFFFFF"
        strokeWidth="0.8"
      />

      {/* Áo Cánh Trắng Lót Mỏng */}
      <path
        d="M182 126 L178 240 L188 240 L190 145 Z"
        fill="#F4F0E8"
      />
      <path
        d="M218 126 L222 240 L212 240 L210 145 Z"
        fill="#F4F0E8"
      />

      {/* 2 Thân Sau (May liền sống áo giữa lưng) */}
      <path
        d="M174 126 L160 410 Q200 415 240 410 L226 126 Z"
        fill={tones.shadow}
        opacity="0.85"
      />
      {/* Đường may sống lưng */}
      <line x1="200" y1="130" x2="200" y2="410" stroke={tones.shadow} strokeWidth="1.2" opacity="0.6" />

      {/* 2 Thân Trước (Buông dài thướt tha hai bên, có thể thắt vạt) */}
      {/* Thân trước bên trái */}
      <path
        d="M176 126 L164 240 L166 410 Q180 412 188 405 L182 240 L186 138 Z"
        fill={tones.base}
      />
      {/* Thân trước bên phải */}
      <path
        d="M224 126 L236 240 L234 410 Q220 412 212 405 L218 240 L214 138 Z"
        fill={tones.base}
      />

      {/* Tay Áo Rộng Vừa Phải */}
      <path
        d="M178 126 L142 180 L136 260 L150 258 L160 185 L172 150 Z"
        fill={tones.base}
      />
      <path
        d="M222 126 L258 180 L264 260 L250 258 L240 185 L228 150 Z"
        fill={tones.base}
      />

      {/* Dải Thắt Lưng Lụa (Sash buộc rủ duyên dáng) */}
      <g id="that-lung-lua">
        {/* Bản lưng quấn eo */}
        <rect x="170" y="235" width="60" height="12" rx="3" fill={sashColor} />
        {/* Nút thắt giữa */}
        <ellipse cx="200" cy="241" rx="5" ry="4" fill={sashColor} stroke="#A88B2A" strokeWidth="0.8" />
        {/* 2 Dải lụa buông dài */}
        <path
          d="M198 245 Q195 300 192 345 L200 344 Q202 295 201 245 Z"
          fill={sashColor}
        />
        <path
          d="M202 245 Q205 310 210 360 L217 358 Q211 305 204 245 Z"
          fill={sashColor}
        />
      </g>
    </g>
  );
};
