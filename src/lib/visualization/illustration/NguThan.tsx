import React from 'react';
import { computeGarmentTones } from './tones';

export interface NguThanProps {
  primaryColor: string;
  pantColor: string;
  isWideSleeve?: boolean; // Áo Tấc (tay thụng) vs Tay chẽn
  buttonCount?: number;   // Exactly 5 buttons according to historical data
}

export const NguThan: React.FC<NguThanProps> = ({
  primaryColor,
  pantColor,
  isWideSleeve = false,
  buttonCount = 5,
}) => {
  const tones = computeGarmentTones(primaryColor);

  // Exact 5 button coordinates: 1 at collar, 1 at neck curve, 1 at right armpit, 2 along right rib seam
  const buttonCoords = [
    { cx: 204, cy: 124 }, // 1. Cúc cổ áo
    { cx: 211, cy: 136 }, // 2. Cúc xương đòn phải
    { cx: 221, cy: 154 }, // 3. Cúc nách áo phải
    { cx: 225, cy: 180 }, // 4. Cúc sườn trên phải
    { cx: 227, cy: 208 }, // 5. Cúc sườn dưới phải
  ].slice(0, buttonCount);

  return (
    <g id="garment-ngu-than">
      {/* Trousers (Quần trắng / đen chuẩn điển chế) */}
      <path
        d="M174 250 L164 450 Q178 452 188 450 L198 290 L202 290 L212 450 Q222 452 236 450 L226 250 Z"
        fill={pantColor}
      />
      <path d="M200 290 L200 450" stroke="#1F1B18" strokeWidth="0.8" opacity="0.15" />

      {/* Thân Con (Tiểu phẩm lót kín bên trong - Không bao giờ bỏ) */}
      <path
        d="M188 126 L180 240 L195 240 L198 135 Z"
        fill={tones.shadow}
        opacity="0.9"
      />

      {/* Vạt Dưới / Thân Sau */}
      <path
        d="M166 235 L160 425 Q200 435 240 425 L234 235 Z"
        fill={tones.shadow}
        opacity="0.8"
      />

      {/* Vạt Lớn Phía Trước (Đè chéo sang phải - Hữu Nhậm chuẩn mực) */}
      <path
        d="M186 124 Q196 127 206 122 L223 154 L229 235 L238 422 Q200 432 162 422 L168 235 L174 130 Z"
        fill={tones.base}
      />

      {/* Đường cài khuy chéo từ cổ qua nách xuống sườn phải */}
      <path
        d="M204 124 Q210 134 220 152 L228 215"
        stroke={tones.shadow}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Gấu áo cong cánh cung (Đặc trưng ngũ thân) */}
      <path
        d="M162 422 Q200 432 238 422"
        stroke={tones.highlight}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />

      {/* Cổ Lập Lĩnh (Cổ đứng nghiêm cẩn cao 2-3.5cm) */}
      <path
        d="M188 118 Q200 122 212 118 L213 126 Q200 130 187 126 Z"
        fill={tones.base}
        stroke={tones.shadow}
        strokeWidth="1"
      />

      {/* Sleeves: Wide (Áo Tấc) vs Slim (Tay Chẽn) */}
      {isWideSleeve ? (
        // Tay thụng thụng rộng (Áo Tấc nghi lễ)
        <g id="tay-thung-ao-tac">
          {/* Left wide sleeve */}
          <path
            d="M178 126 L130 190 L115 310 L160 305 L170 160 Z"
            fill={tones.base}
          />
          {/* Right wide sleeve */}
          <path
            d="M222 126 L270 190 L285 310 L240 305 L230 160 Z"
            fill={tones.base}
          />
        </g>
      ) : (
        // Tay chẽn gọn gàng (Sinh hoạt, dạo phố, công sở)
        <g id="tay-chen">
          <path
            d="M178 126 L142 185 L135 280 L148 276 L160 190 L170 155 Z"
            fill={tones.base}
          />
          <path
            d="M222 126 L258 185 L265 280 L252 276 L240 190 L230 155 Z"
            fill={tones.base}
          />
        </g>
      )}

      {/* EXACT 5 BUTTONS (Hạt cúc kim loại/ngọc: Nhân, Lễ, Nghĩa, Trí, Tín) */}
      <g id="he-thong-ngu-cuc">
        {buttonCoords.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.cx} cy={pt.cy} r="2.8" fill="#D4AF37" stroke="#8A5E17" strokeWidth="0.8" />
            <circle cx={pt.cx - 0.7} cy={pt.cy - 0.7} r="1" fill="#FFF2B2" />
          </g>
        ))}
      </g>
    </g>
  );
};
