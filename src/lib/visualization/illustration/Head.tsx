import React from 'react';

export interface HeadProps {
  skinTone: string;
  hairId?: string;
  isSeated?: boolean;
}

export const Head: React.FC<HeadProps> = ({
  skinTone = '#F3D9C7',
  hairId = 'TOC_VAN',
}) => {
  return (
    <g id="illustration-head">
      {/* Neck */}
      <path
        d="M192 100 L192 125 Q200 128 208 125 L208 100 Z"
        fill={skinTone}
      />
      {/* Neck shadow */}
      <path
        d="M192 118 Q200 124 208 118 L208 125 Q200 128 192 125 Z"
        fill="#1F1B18"
        opacity="0.1"
      />

      {/* Head oval */}
      <ellipse cx="200" cy="85" rx="20" ry="24" fill={skinTone} />

      {/* Subtle facial features */}
      {/* Eyebrows */}
      <path d="M190 78 Q194 76 197 78" stroke="#3D322B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M203 78 Q206 76 210 78" stroke="#3D322B" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Eyes */}
      <path d="M191 82 Q194 80 196 82" stroke="#1F1B18" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M204 82 Q206 80 209 82" stroke="#1F1B18" strokeWidth="1.4" fill="none" strokeLinecap="round" />

      {/* Nose bridge */}
      <path d="M200 83 L200 88 L202 89" stroke="#3D322B" strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round" />

      {/* Lips */}
      <path d="M196 94 Q200 97 204 94" stroke="#A84B55" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Hair Silhouettes */}
      {hairId === 'TOC_VAN' && (
        <g id="hair-toc-van">
          <ellipse cx="200" cy="65" rx="24" ry="10" fill="#1C1917" />
          <path d="M178 72 Q200 58 222 72 Q215 88 200 88 Q185 88 178 72 Z" fill="#1C1917" />
        </g>
      )}

      {hairId === 'BUOI_CUBO' && (
        <g id="hair-buoi-cu-bo">
          <circle cx="200" cy="56" r="12" fill="#1C1917" />
          <path d="M180 75 Q200 62 220 75 Q212 85 200 86 Q188 85 180 75 Z" fill="#1C1917" />
        </g>
      )}

      {hairId === 'XOA_TU_NHIEN' && (
        <g id="hair-xoa-tu-nhien">
          <path d="M178 72 Q200 62 222 72 L225 125 Q220 135 210 130 L208 95 L192 95 L190 130 Q180 135 175 125 Z" fill="#1C1917" />
        </g>
      )}

      {hairId === 'BOI_TRUYEN_THONG' && (
        <g id="hair-boi-truyen-thong">
          <circle cx="200" cy="60" r="14" fill="#1C1917" />
          <circle cx="200" cy="50" r="8" fill="#1C1917" />
          <path d="M179 74 Q200 64 221 74 Z" fill="#1C1917" />
        </g>
      )}

      {hairId === 'NGAN_HIEN_DAI' && (
        <g id="hair-ngan-hien-dai">
          <path d="M178 75 Q200 60 222 75 Q224 90 220 95 L215 85 Q200 82 185 85 L180 95 Q176 90 178 75 Z" fill="#1C1917" />
        </g>
      )}

      {hairId === 'TET_LUA' && (
        <g id="hair-tet-lua">
          <ellipse cx="200" cy="66" rx="23" ry="10" fill="#1C1917" />
          <path d="M182 85 L180 140 Q185 145 188 140 L190 85 Z" fill="#1C1917" />
        </g>
      )}
    </g>
  );
};
