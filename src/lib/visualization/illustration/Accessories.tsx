import React from 'react';
import type { Accessory } from '../../../types/fashion';

export interface AccessoriesProps {
  accessories: Accessory[];
  isSeated?: boolean;
}

export const Accessories: React.FC<AccessoriesProps> = ({
  accessories,
  isSeated = false,
}) => {
  if (!accessories || accessories.length === 0) return null;

  return (
    <g id="illustration-accessories">
      {accessories.map((acc) => {
        const fill = acc.colors[0] ?? '#D6A75B';

        switch (acc.id) {
          // 1. Khăn Đóng / Khăn Vấn
          case 'acc-khan-dong':
          case 'acc-khan-van':
            return (
              <g key={acc.id} id="acc-khan-dong">
                <ellipse cx="200" cy="64" rx="26" ry="9" fill={fill} stroke="#38322D" strokeWidth="0.8" />
                <path d="M174 65 Q200 72 226 65 Q224 58 200 58 Q176 58 174 65 Z" fill={fill} />
              </g>
            );

          // 2. Mấn Nữ Hoàng Gia
          case 'acc-man-nu':
            return (
              <g key={acc.id} id="acc-man-nu">
                <ellipse cx="200" cy="62" rx="30" ry="11" fill={fill} stroke="#D4AF37" strokeWidth="1.2" />
                <circle cx="200" cy="58" r="3" fill="#D4AF37" />
              </g>
            );

          // 3. Nón Quai Thao
          case 'acc-non-quai-thao':
            return (
              <g key={acc.id} id="acc-non-quai-thao">
                {/* Nón tròn dẹt rộng vành */}
                <ellipse cx="200" cy="62" rx="52" ry="8" fill="#F4E8C1" stroke="#A88B2A" strokeWidth="1" />
                {/* Quai thao buông dài */}
                <path d="M165 65 Q180 140 190 190" stroke="#7A2E35" strokeWidth="2" fill="none" />
                <path d="M235 65 Q220 140 210 190" stroke="#7A2E35" strokeWidth="2" fill="none" />
              </g>
            );

          // 4. Khăn Mỏ Quạ
          case 'acc-khan-mo-qua':
            return (
              <g key={acc.id} id="acc-khan-mo-qua">
                <path d="M176 68 Q200 54 224 68 L200 86 Z" fill="#1C1C1E" stroke="#38322D" strokeWidth="0.8" />
              </g>
            );

          // 5. Thẻ Bài
          case 'acc-the-bai':
            return (
              <g key={acc.id} id="acc-the-bai">
                <line x1="200" y1="126" x2="200" y2="136" stroke="#EF4444" strokeWidth="1.5" />
                <rect x="195" y="136" width="10" height="22" rx="2" fill="#FAF5EF" stroke="#D4AF37" strokeWidth="1" />
                <circle cx="200" cy="135" r="2" fill="#EF4444" />
                <text x="200" y="151" fontSize="6" textAnchor="middle" fill="#8A5E17" fontFamily="serif">祿</text>
              </g>
            );

          // 6. Kiềng Bạc
          case 'acc-kieng-bac':
            return (
              <g key={acc.id} id="acc-kieng-bac">
                <path d="M187 125 Q200 140 213 125" stroke="#E2E8F0" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </g>
            );

          // 7. Quạt Trầm Hương
          case 'acc-quat-tram-huong':
            return (
              <g key={acc.id} transform="translate(105, 230) rotate(-15)">
                <path d="M0 32 L22 0 A32 32 0 0 1 54 16 L22 42 Z" fill="#8C6747" opacity="0.95" />
                <line x1="12" y1="36" x2="38" y2="9" stroke="#523B27" strokeWidth="1" />
              </g>
            );

          // 8. Sneaker Retro (Modern Accessory)
          case 'acc-sneaker-retro':
            if (isSeated) {
              return (
                <g key={acc.id} id="acc-sneaker-seated">
                  <rect x="220" y="438" width="34" height="12" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                  <path d="M222 444 h30" stroke="#EF4444" strokeWidth="1.5" />
                </g>
              );
            }
            return (
              <g key={acc.id} id="acc-sneaker-standing">
                <rect x="156" y="445" width="36" height="13" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                <rect x="208" y="445" width="36" height="13" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                <path d="M160 451 h28" stroke="#EF4444" strokeWidth="1.5" />
                <path d="M212 451 h28" stroke="#EF4444" strokeWidth="1.5" />
              </g>
            );

          // 9. Guốc Mộc
          case 'acc-guoc-moc':
            if (isSeated) return null;
            return (
              <g key={acc.id} id="acc-guoc-moc">
                <path d="M158 447 Q175 445 192 447 L190 455 H160 Z" fill="#A87954" stroke="#63452B" strokeWidth="1" />
                <path d="M208 447 Q225 445 242 447 L240 455 H210 Z" fill="#A87954" stroke="#63452B" strokeWidth="1" />
                <path d="M165 446 Q175 440 185 446" stroke="#8B1E2B" strokeWidth="2.5" fill="none" />
                <path d="M215 446 Q225 440 235 446" stroke="#8B1E2B" strokeWidth="2.5" fill="none" />
              </g>
            );

          // 10. Hài Sen Cung Đình
          case 'acc-hai-sen':
            if (isSeated) return null;
            return (
              <g key={acc.id} id="acc-hai-sen">
                <path d="M158 448 Q174 445 190 448 L194 442 L198 448 L192 454 H158 Z" fill="#8B1E2B" stroke="#D4AF37" strokeWidth="0.8" />
                <path d="M208 448 Q224 445 240 448 L244 442 L248 448 L242 454 H208 Z" fill="#8B1E2B" stroke="#D4AF37" strokeWidth="0.8" />
              </g>
            );

          // 11. Túi Cói / Mini Bag
          case 'acc-tui-coi':
          case 'acc-mini-bag':
            return (
              <g key={acc.id} id="acc-tui">
                <rect x="264" y="255" width="36" height="42" rx="5" fill="#E8D7B8" stroke="#8A6E4B" strokeWidth="1.2" />
                <path d="M272 255 Q282 235 292 255" fill="none" stroke="#8A6E4B" strokeWidth="2" />
              </g>
            );

          default:
            return null;
        }
      })}
    </g>
  );
};
