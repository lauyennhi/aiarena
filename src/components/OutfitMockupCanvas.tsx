import React, { useRef, useState } from 'react';
import { Garment, Accessory, CharacterItem } from '../types/fashion';
import { FunctionalNeedCode } from '../types/domain';
import { createMockupScene, VisualAssetReference } from '../lib/visualization/assetRegistry';

export interface AdaptiveAdjustmentsState {
  frontHemReduction?: number; // 0 to 30 cm
  sleeveLength?: number;      // -15 to +10 cm
  sleeveWidth?: number;       // 0 to 15 cm
  slitPosition?: number;      // 0 to 25 cm
  openingWidth?: number;      // 0 to 15 cm
  closureType?: string;       // 'MAGNETIC' | 'VELCRO' | 'BUTTON' | 'ZIPPER'
}

interface OutfitMockupCanvasProps {
  garment: Garment;
  primaryColor: string;
  pantColor: string;
  accessories: Accessory[];
  character: CharacterItem;
  adaptiveNeedCode?: string;
  adaptiveNeedCodes?: FunctionalNeedCode[];
  styleId?: string;
  eventId?: string;
  weatherId?: string;
  onColorChange?: (colorHex: string) => void;
  backgroundTheme?: 'MINIMAL_STUDIO' | 'HERITAGE_PALACE' | 'GARDEN_SPRING';
  compact?: boolean;
  adaptiveAdjustments?: AdaptiveAdjustmentsState;
  showHotspots?: boolean;
  onHandleDrag?: (handleName: string, deltaY: number) => void;
}

function renderAccessoryFallback(variant: string, color: string | null): React.ReactNode {
  const fill = color ?? '#D6A75B';
  switch (variant) {
    case 'HEADWEAR_WRAP':
      return <path d="M174 72Q200 68 226 72V62Q200 58 174 62Z" fill={fill} stroke="#44403C" strokeWidth="1" />;
    case 'HEADWEAR_MANTLE':
      return <ellipse cx="200" cy="65" rx="30" ry="10" fill={fill} stroke="#F59E0B" strokeWidth="1.5" />;
    case 'HEADWEAR_SCARF':
      return <path d="M176 68Q200 55 224 68L215 86 200 78 185 86Z" fill={fill} stroke="#A8A29E" strokeWidth="1" />;
    case 'HEADWEAR_HAT':
      return <g><ellipse cx="200" cy="65" rx="48" ry="7" fill={fill} /><path d="M178 64Q181 42 200 40Q219 42 222 64Z" fill={fill} stroke="#A8A29E" strokeWidth="1" /></g>;
    case 'HAIR_PIN':
      return <path d="M218 60L235 50M226 55l4-7" stroke={fill} strokeWidth="3" strokeLinecap="round" />;
    case 'NECKLACE':
      return <path d="M188 122Q200 138 212 122" stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round" />;
    case 'PENDANT':
      return <g><path d="M200 124v8" stroke={fill} strokeWidth="1.5" /><path d="M195 132h10v19h-10z" rx="2" fill={fill} stroke="#F59E0B" strokeWidth="0.8" /><circle cx="200" cy="131" r="2" fill="#EF4444" /></g>;
    case 'SASH':
      return <g><path d="M163 238h74v10h-74z" fill={fill} /><path d="M220 248l3 48h8l-2-48" fill={fill} /></g>;
    case 'INNER_BODICE':
      return <path d="M187 115l13 25 13-25-4 24h-18z" fill={fill} stroke="#F5F5F4" strokeWidth="1" />;
    case 'FAN':
      return <g transform="translate(100, 240) rotate(-15)"><path d="M0 30L20 0A30 30 0 0 1 50 15L20 40Z" fill={fill} opacity="0.95" /><line x1="10" y1="35" x2="35" y2="8" stroke="#78350F" strokeWidth="1" /></g>;
    case 'BAG':
      return <g><path d="M265 260h42l-4 48h-34z" fill={fill} stroke="#A8A29E" strokeWidth="1.5" /><path d="M274 260q1-20 12-20t12 20" fill="none" stroke={fill} strokeWidth="4" /></g>;
    default:
      return <path d="M200 230l10 10-10 10-10-10z" fill={fill} opacity="0.9" />;
  }
}

function renderShoeFallback(variant: string, color: string | null): React.ReactNode {
  const fill = color ?? '#8B1E2B';
  if (variant === 'SHOES_SNEAKER') {
    return <g><rect x="156" y="445" width="38" height="12" rx="4" fill={fill} stroke="#CBD5E1" strokeWidth="0.8" /><rect x="206" y="445" width="38" height="12" rx="4" fill={fill} stroke="#CBD5E1" strokeWidth="0.8" /></g>;
  }
  if (variant === 'SHOES_WOODEN') {
    return <g><path d="M158 446q18-2 35 0l3 8h-40z" fill={fill} stroke="#A87954" strokeWidth="2" /><path d="M204 446q18-2 35 0l3 8h-40z" fill={fill} stroke="#A87954" strokeWidth="2" /></g>;
  }
  if (variant === 'SHOES_CEREMONIAL') {
    return <g><path d="M158 448q17 0 32-4 5-5 7 1l-39 5z" fill={fill} /><path d="M206 448q17 0 32-4 5-5 7 1l-39 5z" fill={fill} /></g>;
  }
  return <g><ellipse cx="176" cy="450" rx="18" ry="5" fill={fill} /><ellipse cx="224" cy="450" rx="18" ry="5" fill={fill} /></g>;
}

interface SvgAssetImageProps {
  asset: VisualAssetReference;
  opacity?: number;
}

const SvgAssetImage: React.FC<SvgAssetImageProps> = ({ asset, opacity = 1 }) => {
  const [failed, setFailed] = useState(false);
  if (!asset.source || failed) return null;

  return (
    <image
      href={asset.source}
      x="0"
      y="0"
      width="400"
      height="500"
      preserveAspectRatio="xMidYMid meet"
      opacity={opacity}
      onError={() => setFailed(true)}
      data-asset-id={asset.assetId}
    />
  );
};

export const OutfitMockupCanvas: React.FC<OutfitMockupCanvasProps> = ({
  garment,
  primaryColor,
  pantColor,
  accessories,
  character,
  adaptiveNeedCode,
  adaptiveNeedCodes,
  styleId,
  eventId = 'EVENT_TET',
  weatherId = 'WEATHER_MILD',
  onColorChange,
  backgroundTheme = 'MINIMAL_STUDIO',
  compact = false,
  adaptiveAdjustments,
  showHotspots = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedNeedCodes = adaptiveNeedCodes ??
    (adaptiveNeedCode && adaptiveNeedCode !== 'NONE' ? [adaptiveNeedCode as FunctionalNeedCode] : []);
  const scene = createMockupScene({
    garment,
    character,
    accessories,
    primaryColor,
    adaptiveNeedCodes: selectedNeedCodes,
    backgroundId: backgroundTheme,
    styleId,
  });
  const isWheelchair = scene.adaptive.isSeated || character.posture === 'WHEELCHAIR_SEATED';

  // Export SVG to PNG
  const handleDownload = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(image, 0, 0, 800, 1000);
        const png = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `Vstyle_${garment.name.replace(/\s+/g, '_')}.png`;
        downloadLink.href = png;
        downloadLink.click();
      }
    };
    image.src = blobURL;
  };

  // Adaptive dimension calculations (scale cm to svg pixels)
  const hemReductionPx = Math.min((adaptiveAdjustments?.frontHemReduction ?? (isWheelchair ? 15 : 0)) * 1.5, 50);
  const slitRaisePx = Math.min((adaptiveAdjustments?.slitPosition ?? 0) * 1.8, 45);
  const sleeveWidthPx = Math.min((adaptiveAdjustments?.sleeveWidth ?? 0) * 1.2, 18);
  const sleeveLengthPx = Math.max(Math.min((adaptiveAdjustments?.sleeveLength ?? 0) * 1.5, 25), -25);
  const openingWidthPx = Math.min((adaptiveAdjustments?.openingWidth ?? 0) * 1.2, 16);

  return (
    <div className="relative flex flex-col items-center justify-center w-full bg-[#FBF8F3] rounded-[26px] overflow-hidden border border-[#E6DCCD] shadow-xs">
      {/* Canvas Top Bar */}
      {!compact && (
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-[#FFFFFF]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E6DCCD] text-xs font-semibold text-[#1F1B18] shadow-xs pointer-events-auto">
            <span aria-hidden="true" className="size-2 rounded-full bg-[#4F7350]" />
            Minh họa vector cổ phục
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={handleDownload}
              className="press flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#E6DCCD] hover:bg-[#F1EADF] text-[#1F1B18] text-xs font-semibold rounded-xl shadow-xs"
              aria-label="Tải ảnh mockup (PNG)"
            >
              <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Tải ảnh PNG
            </button>
          </div>
        </div>
      )}

      {/* Main SVG Render Area with 9 deterministic Layer Order */}
      <div className="w-full aspect-[4/5] max-w-[420px] flex items-center justify-center p-2 select-none">
        <svg
          ref={svgRef}
          viewBox="0 0 400 500"
          className="w-full h-full drop-shadow-md select-none"
          role="img"
          aria-label={`Bản phối minh họa ${garment.name}, ${character.name}`}
          data-scene-layers={scene.layers.join(',')}
          data-style-id={scene.style.dataId}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background Gradients */}
            <linearGradient id="bg-minimal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBF8F3" />
              <stop offset="50%" stopColor="#F1EADF" />
              <stop offset="100%" stopColor="#E6DCCD" />
            </linearGradient>

            <linearGradient id="bg-heritage" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F9EBEA" />
              <stop offset="100%" stopColor="#F1EADF" />
            </linearGradient>

            <linearGradient id="bg-garden" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E5EDE2" />
              <stop offset="100%" stopColor="#F1EADF" />
            </linearGradient>

            {/* 3-Tone Shading: Fabric Shadow & Silk Highlight */}
            <linearGradient id="fabric-shading" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.10" />
              <stop offset="75%" stopColor="#000000" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
            </linearGradient>

            <linearGradient id="silk-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.12" />
            </linearGradient>

            {/* Subtle brocade jacquard pattern */}
            <pattern id="brocade-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M12 0 C16 4, 20 8, 24 12 C20 16, 16 20, 12 24 C8 20, 4 16, 0 12 C4 8, 8 4, 12 0 Z M12 6 C14 9, 17 12, 12 18 C7 12, 10 9, 12 6 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="0.5"
                opacity="0.12"
              />
            </pattern>

            <linearGradient id="nhat-binh-stripes" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="20%" stopColor="#EAB308" />
              <stop offset="40%" stopColor="#F8FAFC" />
              <stop offset="60%" stopColor="#DC2626" />
              <stop offset="80%" stopColor="#18181B" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            <radialGradient id="halo-glow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#8A5E17" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#8A5E17" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. LAYER: BACKDROP (Event-specific Backdrop & Weather Lighting) */}
          <g
            id="layer-background"
            data-layer-id={scene.background.dataId}
            data-asset-id={scene.background.assetId}
            data-asset-source={scene.background.source ?? ''}
            data-fallback-key={scene.background.fallbackKey}
          >
            {/* Base Backdrop Canvas */}
            <rect
              width="400"
              height="500"
              rx="16"
              fill={backgroundTheme === 'HERITAGE_PALACE'
                ? 'url(#bg-heritage)'
                : backgroundTheme === 'GARDEN_SPRING' ? 'url(#bg-garden)' : 'url(#bg-minimal)'}
            />
            <SvgAssetImage asset={scene.background} />
            <circle cx="200" cy="180" r="160" fill="url(#halo-glow)" />

            {/* EVENT BACKDROPS (XXI) */}
            {eventId === 'EVENT_TET' ? (
              // Tết: Hoa mai, cành đào, đèn lồng lễ hội
              <g id="event-backdrop-tet" opacity="0.85">
                <path d="M 330 40 Q 300 80 270 120 Q 240 140 210 160" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="310" cy="65" r="7" fill="#F43F5E" opacity="0.9" />
                <circle cx="285" cy="100" r="8" fill="#F43F5E" opacity="0.9" />
                <circle cx="260" cy="130" r="6" fill="#FBBF24" opacity="0.9" />
                <circle cx="230" cy="148" r="7" fill="#F43F5E" opacity="0.8" />
                <circle cx="335" cy="85" r="5" fill="#FBBF24" opacity="0.9" />
                {/* Floating petals */}
                <path d="M 80 140 Q 88 144 86 152 Q 78 148 80 140 Z" fill="#F43F5E" opacity="0.5" />
                <path d="M 320 220 Q 328 224 326 232 Q 318 228 320 220 Z" fill="#FBBF24" opacity="0.5" />
              </g>
            ) : eventId === 'EVENT_GRADUATION' || eventId === 'EVENT_YEARBOOK' ? (
              // Tốt nghiệp / Kỷ yếu: Cổng vòm cổ kính + Hàng cột + Lá trúc
              <g id="event-backdrop-graduation" opacity="0.35">
                <path d="M 60 480 L 60 180 Q 200 80 340 180 L 340 480" stroke="#1F1B18" strokeWidth="2" fill="none" />
                <line x1="90" y1="190" x2="90" y2="480" stroke="#1F1B18" strokeWidth="1.5" strokeDasharray="6 4" />
                <line x1="310" y1="190" x2="310" y2="480" stroke="#1F1B18" strokeWidth="1.5" strokeDasharray="6 4" />
                <path d="M 70 120 Q 100 130 90 160" stroke="#4F7350" strokeWidth="1.5" fill="none" />
                <circle cx="85" cy="140" r="3" fill="#4F7350" />
                <circle cx="95" cy="155" r="3" fill="#4F7350" />
              </g>
            ) : eventId === 'EVENT_FESTIVAL' || eventId === 'EVENT_CULTURAL' ? (
              // Lễ hội: Cờ ngũ sắc truyền thống (Five-color flags)
              <g id="event-backdrop-festival" opacity="0.75">
                <line x1="50" y1="60" x2="50" y2="280" stroke="#78350F" strokeWidth="2" />
                <polygon points="50,70 100,85 50,105" fill="#EF4444" stroke="#F59E0B" strokeWidth="1" />
                <polygon points="50,115 95,130 50,145" fill="#3B82F6" stroke="#10B981" strokeWidth="1" />
                <line x1="350" y1="80" x2="350" y2="280" stroke="#78350F" strokeWidth="2" />
                <polygon points="350,90 300,105 350,125" fill="#F59E0B" stroke="#EF4444" strokeWidth="1" />
              </g>
            ) : eventId === 'EVENT_CASUAL' ? (
              // Dạo phố: Đèn lồng Hội An + Tường cổ
              <g id="event-backdrop-casual" opacity="0.8">
                <line x1="40" y1="40" x2="360" y2="60" stroke="#78350F" strokeWidth="1" strokeDasharray="3 3" />
                {/* Lanterns */}
                <ellipse cx="100" cy="75" rx="12" ry="16" fill="#F59E0B" opacity="0.85" />
                <ellipse cx="100" cy="75" rx="6" ry="16" fill="#D97706" opacity="0.9" />
                <line x1="100" y1="91" x2="100" y2="105" stroke="#B45309" strokeWidth="1" />
                <ellipse cx="300" cy="85" rx="14" ry="18" fill="#DC2626" opacity="0.8" />
                <ellipse cx="300" cy="85" rx="7" ry="18" fill="#B91C1C" opacity="0.9" />
                <line x1="300" y1="103" x2="300" y2="118" stroke="#7F1D1D" strokeWidth="1" />
              </g>
            ) : eventId === 'EVENT_CONCERT' ? (
              // Hòa nhạc: Soft stage light beams
              <g id="event-backdrop-concert" opacity="0.25">
                <polygon points="30,0 120,0 260,500 140,500" fill="#E6ECF3" opacity="0.4" />
                <polygon points="370,0 280,0 140,500 260,500" fill="#F6ECDA" opacity="0.4" />
              </g>
            ) : eventId === 'EVENT_WEDDING' ? (
              // Đám cưới: Vòng hoa hỷ sự thanh nhã
              <g id="event-backdrop-wedding" opacity="0.4">
                <circle cx="200" cy="180" r="140" stroke="#8B1E2B" strokeWidth="1.5" fill="none" strokeDasharray="5 5" />
                <circle cx="200" cy="180" r="146" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
              </g>
            ) : (
              // Default: Minimal sand horizon & curved arch
              <g id="event-backdrop-default" opacity="0.25">
                <path d="M 85 485V220a115 115 0 0 1 230 0v265" fill="none" stroke="#1F1B18" strokeWidth="1" />
                <path d="M 0 440 Q 200 420 400 440" stroke="#E6DCCD" strokeWidth="1.5" fill="none" />
              </g>
            )}

            {/* WEATHER LIGHTING OVERLAYS (XXII - Does NOT alter garment color) */}
            {weatherId === 'WEATHER_HOT' && (
              <g id="weather-hot-sun" opacity="0.65">
                <circle cx="340" cy="65" r="28" fill="#F59E0B" opacity="0.3" />
                <circle cx="340" cy="65" r="16" fill="#FBBF24" opacity="0.7" />
                <line x1="340" y1="28" x2="340" y2="20" stroke="#F59E0B" strokeWidth="2" />
                <line x1="340" y1="102" x2="340" y2="110" stroke="#F59E0B" strokeWidth="2" />
                <line x1="303" y1="65" x2="295" y2="65" stroke="#F59E0B" strokeWidth="2" />
                <line x1="377" y1="65" x2="385" y2="65" stroke="#F59E0B" strokeWidth="2" />
              </g>
            )}
            {weatherId === 'WEATHER_COLD' && (
              <g id="weather-cold-mist" opacity="0.25">
                <path d="M 20 120 Q 150 140 280 110 T 400 130" stroke="#2E4A6B" strokeWidth="12" fill="none" />
                <path d="M 0 200 Q 180 230 320 190 T 400 210" stroke="#2E4A6B" strokeWidth="10" fill="none" />
              </g>
            )}
            {weatherId === 'WEATHER_RAIN' && (
              <g id="weather-rain-strokes" stroke="#2E4A6B" strokeWidth="1.2" opacity="0.22" strokeLinecap="round">
                <line x1="40" y1="40" x2="25" y2="90" />
                <line x1="120" y1="70" x2="105" y2="120" />
                <line x1="280" y1="30" x2="265" y2="80" />
                <line x1="350" y1="80" x2="335" y2="130" />
                <line x1="60" y1="200" x2="45" y2="250" />
                <line x1="330" y1="240" x2="315" y2="290" />
              </g>
            )}
          </g>

          {/* 2. LAYER: GROUND SHADOW */}
          <g id="layer-ground-shadow">
            <ellipse cx="200" cy="462" rx={isWheelchair ? 95 : 75} ry="12" fill="#1F1B18" opacity="0.18" />
            <ellipse cx="200" cy="462" rx={isWheelchair ? 60 : 45} ry="7" fill="#1F1B18" opacity="0.15" />
          </g>

          {/* ADAPTIVE SUPPORT (Wheelchair frame if seated) */}
          {(isWheelchair || selectedNeedCodes.length > 0) && (
            <g id="layer-adaptive" data-layer-id={scene.adaptive.dataId} data-need-codes={scene.adaptive.needCodes.join(',')}>
              {isWheelchair && (
                <g id="wheelchair-frame">
                  {/* Seating frame & backrest */}
                  <rect x="135" y="235" width="130" height="155" rx="10" fill="#292524" stroke="#78716C" strokeWidth="2.5" />
                  {/* Armrests */}
                  <rect x="122" y="265" width="16" height="75" rx="4" fill="#44403C" />
                  <rect x="262" y="265" width="16" height="75" rx="4" fill="#44403C" />
                  {/* Wheels */}
                  <circle cx="125" cy="380" r="48" fill="none" stroke="#D97706" strokeWidth="4" />
                  <circle cx="125" cy="380" r="14" fill="#78716C" />
                  <circle cx="275" cy="380" r="48" fill="none" stroke="#D97706" strokeWidth="4" />
                  <circle cx="275" cy="380" r="14" fill="#78716C" />
                  {/* Footrest */}
                  <rect x="155" y="442" width="90" height="10" rx="3" fill="#57534E" />
                </g>
              )}
            </g>
          )}

          {/* 3. LAYER: BODY (Character Body, Posture, Neck, Head) */}
          <g
            id="layer-character"
            data-layer-id={scene.character.dataId}
            data-asset-id={scene.character.assetId}
            data-asset-source={scene.character.source ?? ''}
            data-fallback-key={scene.character.fallbackKey}
            data-pose-id={scene.character.poseId}
            data-body-representation={character.bodyRepresentation}
          >
            <g id="character-body-vector" data-character-variant={scene.character.variant}>
              {scene.character.variant === 'CHARACTER_MASCULINE' ? (
                <path d="M157 132Q143 133 135 151L114 220Q109 239 124 245Q139 247 145 230L166 180H234L255 230Q261 247 276 245Q291 239 286 220L265 151Q257 133 243 132Z" fill={character.skinTone} />
              ) : scene.character.variant === 'CHARACTER_CURVY' ? (
                <path d="M158 132Q141 134 133 153L112 218Q105 239 122 248Q139 251 147 231L168 178H232L253 231Q261 251 278 248Q295 239 288 218L267 153Q259 134 242 132Z" fill={character.skinTone} />
              ) : (
                <path d="M160 132Q145 134 138 151L119 222Q114 240 129 245Q143 247 149 231L168 178H232L251 231Q257 247 271 245Q286 240 281 222L262 151Q255 134 240 132Z" fill={character.skinTone} />
              )}
              {/* Hands */}
              <path d="M124 238q-7 8-4 17 4 7 12 2l10-15zM276 238q7 8 4 17-4 7-12 2l-10-15z" fill={character.skinTone} />
            </g>
            {/* Neck */}
            <rect x="190" y="100" width="20" height="35" rx="5" fill={character.skinTone ?? character.defaultSkinTone} />
            {/* Head */}
            <ellipse cx="200" cy="85" rx="26" ry="32" fill={character.skinTone ?? character.defaultSkinTone} />
            {/* Subtle serene facial cues */}
            <path d="M 194 85 Q 200 88 206 85" stroke="#8D5B4C" strokeWidth="1" fill="none" opacity="0.4" />
            <path d="M 192 78 Q 196 76 200 78" stroke="#5E3A2B" strokeWidth="1" fill="none" opacity="0.4" />
            <path d="M 200 78 Q 204 76 208 78" stroke="#5E3A2B" strokeWidth="1" fill="none" opacity="0.4" />
            <SvgAssetImage asset={scene.character} />
          </g>

          {/* HAIR LAYER */}
          <g id="layer-hair" data-layer-id={scene.hair.dataId} data-character-id={scene.hair.characterId} data-fallback-key={scene.hair.fallbackKey}>
            {scene.character.variant === 'CHARACTER_MASCULINE' ? (
              <path d="M174 84c0-38 52-38 52 0l-7 13c-6-8-13-12-19-12s-13 4-19 12z" fill="#18181B" />
            ) : scene.character.variant === 'CHARACTER_UNISEX' ? (
              <path d="M174 84c0-39 52-39 52 0l-4 17-12-9-10 7-10-7-12 9z" fill="#18181B" />
            ) : (
              <path d="M174 85c0-40 52-40 52 0v39l-11 8-4-35c-7-7-18-7-25 0l-4 35-8-8z" fill="#18181B" />
            )}
          </g>

          {/* 4. LAYER: GARMENT BOTTOM (Quần thụng lụa / Chân váy) */}
          <g id="layer-garment-bottom" data-layer-id={`${garment.id}:bottom`} data-garment-id={garment.id}>
            {!isWheelchair ? (
              <path
                d="M 165 280 L 160 445 Q 180 448 196 445 L 198 320 L 202 320 L 204 445 Q 220 448 240 445 L 235 280 Z"
                fill={pantColor}
                stroke="#1F1B18"
                strokeWidth="0.5"
                opacity="0.95"
              />
            ) : (
              <path
                d="M 155 270 Q 150 350 160 410 L 240 410 Q 250 350 245 270 Z"
                fill={pantColor}
                stroke="#1F1B18"
                strokeWidth="0.5"
                opacity="0.95"
              />
            )}
          </g>

          {/* 5, 6, 7. LAYER: GARMENT BODY + SHADOW + HIGHLIGHT + FOLDS (Structural Authenticity) */}
          <g
            id="layer-garment"
            data-layer-id={scene.garment.dataId}
            data-asset-id={scene.garment.assetId}
            data-asset-source={scene.garment.source ?? ''}
            data-template-id={scene.garment.templateId}
            data-fallback-key={scene.garment.fallbackKey}
          >
            <g id="layer-garment-color" data-layer-id={scene.garmentColor.dataId} data-color={scene.garmentColor.value}>
              {/* A. Áo Ngũ Thân Tay Chẽn */}
              {garment.svgTemplate === 'NGU_THAN_TAY_CHEN' && (
                <g id="template-ngu-than-tay-chen">
                  {/* Base Tone with Brocade Texture */}
                  <path
                    d={`M ${155 - openingWidthPx} 125 L 130 145 L 140 270 L 150 ${405 - hemReductionPx} Q 200 ${415 - hemReductionPx} 250 ${405 - hemReductionPx} L 260 270 L 270 145 L ${245 + openingWidthPx} 125 Z`}
                    fill={primaryColor}
                  />
                  <path
                    d={`M ${155 - openingWidthPx} 125 L 130 145 L 140 270 L 150 ${405 - hemReductionPx} Q 200 ${415 - hemReductionPx} 250 ${405 - hemReductionPx} L 260 270 L 270 145 L ${245 + openingWidthPx} 125 Z`}
                    fill="url(#brocade-pattern)"
                  />

                  {/* 6. Garment Shadow (3-Tone) */}
                  <path
                    d={`M ${155 - openingWidthPx} 125 L 130 145 L 140 270 L 150 ${405 - hemReductionPx} Q 200 ${415 - hemReductionPx} 250 ${405 - hemReductionPx} L 260 270 L 270 145 L ${245 + openingWidthPx} 125 Z`}
                    fill="url(#fabric-shading)"
                  />

                  {/* 7. Garment Highlight (Silk Sheen) */}
                  <path
                    d={`M 155 125 L 135 155 L 145 280 L 195 280 L 180 125 Z`}
                    fill="url(#silk-sheen)"
                  />

                  {/* Structural Authenticity: Thân con bên trong (Internal 5th panel) */}
                  <path d={`M 195 125 L 188 280 L 180 ${405 - hemReductionPx}`} stroke="#FFFFFF" strokeWidth="0.8" opacity="0.3" strokeDasharray="3 3" />

                  {/* Vạt đè bên phải - Hữu Nhậm (Left over Right closure flap) */}
                  <path
                    d={`M 200 120 L 212 155 Q 215 190 216 230 L 216 ${408 - hemReductionPx}`}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.6"
                  />

                  {/* Side Slit line (Xẻ tà) adjusted by slitRaisePx */}
                  <line x1="140" y1={270 - slitRaisePx} x2="140" y2={405 - hemReductionPx} stroke="#1F1B18" strokeWidth="0.8" opacity="0.35" />
                  <line x1="260" y1={270 - slitRaisePx} x2="260" y2={405 - hemReductionPx} stroke="#1F1B18" strokeWidth="0.8" opacity="0.35" />

                  {/* Fold lines (XX) */}
                  <path d="M 160 180 Q 180 260 170 340" stroke="#1F1B18" strokeWidth="0.7" fill="none" opacity="0.25" />
                  <path d="M 240 180 Q 220 260 230 340" stroke="#1F1B18" strokeWidth="0.7" fill="none" opacity="0.25" />

                  {/* Tay chẽn gọn gàng (Sleeve length & width responsive) */}
                  <path d={`M 145 135 L ${115 - sleeveWidthPx} ${240 + sleeveLengthPx} L ${130 - sleeveWidthPx} ${250 + sleeveLengthPx} L 155 170 Z`} fill={primaryColor} />
                  <path d={`M 255 135 L ${285 + sleeveWidthPx} ${240 + sleeveLengthPx} L ${270 + sleeveWidthPx} ${250 + sleeveLengthPx} L 245 170 Z`} fill={primaryColor} />

                  {/* 5 Cúc áo điển chế (Ngũ thường: Cúc cổ, cúc nách, 3 cúc sườn) */}
                  <circle cx="202" cy="125" r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  <circle cx="206" cy="142" r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  <circle cx="211" cy="165" r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  <circle cx="215" cy="195" r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  <circle cx="216" cy="230" r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />

                  {/* Cổ lập lĩnh ôm sát cổ */}
                  <path d={`M 188 129 Q 200 132 212 129 L 213 118 Q 200 120 187 118 Z`} fill={primaryColor} stroke="#E5E7EB" strokeWidth="0.8" />
                </g>
              )}

              {/* B. Áo Tấc (Áo thụng ngũ thân) */}
              {garment.svgTemplate === 'AO_TAC' && (
                <g id="template-ao-tac">
                  <path
                    d={`M ${150 - openingWidthPx} 125 L 110 160 L 130 300 L 140 ${435 - hemReductionPx} Q 200 ${445 - hemReductionPx} 260 ${435 - hemReductionPx} L 270 300 L 290 160 L ${250 + openingWidthPx} 125 Z`}
                    fill={primaryColor}
                  />
                  <path
                    d={`M ${150 - openingWidthPx} 125 L 110 160 L 130 300 L 140 ${435 - hemReductionPx} Q 200 ${445 - hemReductionPx} 260 ${435 - hemReductionPx} L 270 300 L 290 160 L ${250 + openingWidthPx} 125 Z`}
                    fill="url(#brocade-pattern)"
                  />
                  <path
                    d={`M ${150 - openingWidthPx} 125 L 110 160 L 130 300 L 140 ${435 - hemReductionPx} Q 200 ${445 - hemReductionPx} 260 ${435 - hemReductionPx} L 270 300 L 290 160 L ${250 + openingWidthPx} 125 Z`}
                    fill="url(#fabric-shading)"
                  />

                  {/* Ống tay thụng rộng đặc trưng Áo Tấc (>= 1 tấc) */}
                  <path
                    d={`M 140 135 L ${75 - sleeveWidthPx} ${270 + sleeveLengthPx} Q ${100 - sleeveWidthPx} ${310 + sleeveLengthPx} 140 280 L 155 170 Z`}
                    fill={primaryColor}
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                    opacity="0.95"
                  />
                  <path
                    d={`M 260 135 L ${325 + sleeveWidthPx} ${270 + sleeveLengthPx} Q ${300 + sleeveWidthPx} ${310 + sleeveLengthPx} 260 280 L 245 170 Z`}
                    fill={primaryColor}
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                    opacity="0.95"
                  />

                  {/* Fold lines */}
                  <path d="M 155 220 Q 170 330 160 410" stroke="#1F1B18" strokeWidth="0.6" fill="none" opacity="0.25" />
                  <path d="M 245 220 Q 230 330 240 410" stroke="#1F1B18" strokeWidth="0.6" fill="none" opacity="0.25" />

                  {/* Viền nẹp tà */}
                  <path d={`M 140 ${435 - hemReductionPx} Q 200 ${445 - hemReductionPx} 260 ${435 - hemReductionPx}`} stroke="#F59E0B" strokeWidth="2.5" fill="none" opacity="0.85" />

                  {/* Cổ lập lĩnh & 5 cúc */}
                  <path d="M 188 129 Q 200 132 212 129 L 213 118 Q 200 120 187 118 Z" fill={primaryColor} stroke="#E5E7EB" strokeWidth="0.8" />
                  <circle cx="202" cy="125" r="3" fill="#D97706" />
                  <circle cx="207" cy="145" r="3" fill="#D97706" />
                  <circle cx="212" cy="170" r="3" fill="#D97706" />
                  <circle cx="216" cy="200" r="3" fill="#D97706" />
                  <circle cx="217" cy="235" r="3" fill="#D97706" />
                </g>
              )}

              {/* C. Áo Nhật Bình (Cung đình thời Nguyễn) */}
              {garment.svgTemplate === 'AO_NHAT_BINH' && (
                <g id="template-ao-nhat-binh">
                  <path
                    d={`M ${150 - openingWidthPx} 125 L 120 160 L 135 300 L 145 ${425 - hemReductionPx} Q 200 ${435 - hemReductionPx} 255 ${425 - hemReductionPx} L 265 300 L 280 160 L ${250 + openingWidthPx} 125 Z`}
                    fill={primaryColor}
                  />
                  <path
                    d={`M ${150 - openingWidthPx} 125 L 120 160 L 135 300 L 145 ${425 - hemReductionPx} Q 200 ${435 - hemReductionPx} 255 ${425 - hemReductionPx} L 265 300 L 280 160 L ${250 + openingWidthPx} 125 Z`}
                    fill="url(#brocade-pattern)"
                  />
                  <path
                    d={`M ${150 - openingWidthPx} 125 L 120 160 L 135 300 L 145 ${425 - hemReductionPx} Q 200 ${435 - hemReductionPx} 255 ${425 - hemReductionPx} L 265 300 L 280 160 L ${250 + openingWidthPx} 125 Z`}
                    fill="url(#fabric-shading)"
                  />

                  {/* Structural Authenticity: Cổ áo bản lớn hình chữ nhật (Rectangular collar band) */}
                  <rect x="175" y="119" width="50" height="91" rx="3" fill="#FBBF24" stroke="#B45309" strokeWidth="1.8" />
                  <rect x="183" y="125" width="34" height="75" fill="#991B1B" opacity="0.9" />

                  {/* Dải kết phi phong buông thõng */}
                  <path d="M 188 210 L 188 320 L 194 320 L 194 210 Z" fill="#D97706" stroke="#92400E" strokeWidth="0.5" />
                  <path d="M 206 210 L 206 320 L 212 320 L 212 210 Z" fill="#D97706" stroke="#92400E" strokeWidth="0.5" />

                  {/* Cổ tay áo dải hoa văn ngũ sắc */}
                  <rect x="105" y="240" width="25" height="18" fill="url(#nhat-binh-stripes)" rx="2" />
                  <rect x="270" y="240" width="25" height="18" fill="url(#nhat-binh-stripes)" rx="2" />

                  {/* Cúc cài ngọc giữa ngực */}
                  <circle cx="200" cy="120" r="4" fill="#E0E7FF" stroke="#4338CA" strokeWidth="1" />
                </g>
              )}

              {/* D. Áo Giao Lĩnh (Cổ chéo thời Lê - Trần) */}
              {garment.svgTemplate === 'AO_GIAO_LINH' && (
                <g id="template-ao-giao-linh">
                  <path
                    d={`M ${150 - openingWidthPx} 125 L 115 155 L 135 290 L 140 ${420 - hemReductionPx} Q 200 ${430 - hemReductionPx} 260 ${420 - hemReductionPx} L 265 290 L 285 155 L ${250 + openingWidthPx} 125 Z`}
                    fill={primaryColor}
                  />
                  <path
                    d={`M ${150 - openingWidthPx} 125 L 115 155 L 135 290 L 140 ${420 - hemReductionPx} Q 200 ${430 - hemReductionPx} 260 ${420 - hemReductionPx} L 265 290 L 285 155 L ${250 + openingWidthPx} 125 Z`}
                    fill="url(#fabric-shading)"
                  />
                  {/* Cổ chéo chữ V giao nhau - Hữu nhậm (trái đè sang phải chuẩn tắc) */}
                  <path d="M 180 115 L 225 185" stroke="#FFFFFF" strokeWidth="4" fill="none" opacity="0.8" />
                  <path d="M 220 115 L 175 185" stroke="#E5E7EB" strokeWidth="3" fill="none" opacity="0.6" />
                  {/* Dải thắt lưng vải bay bổng */}
                  <rect x="165" y="225" width="70" height="14" rx="2" fill="#78350F" />
                  <path d="M 205 239 L 200 340 L 210 340 L 215 239 Z" fill="#78350F" opacity="0.9" />
                </g>
              )}

              {/* E. Áo Đối Khâm */}
              {garment.svgTemplate === 'AO_DOI_KHAM' && (
                <g id="template-ao-doi-kham">
                  <path d="M 175 125 L 175 320 L 225 320 L 225 125 Z" fill="#F5F5F4" />
                  <path d={`M 145 125 L 125 155 L 135 ${410 - hemReductionPx} L 175 ${410 - hemReductionPx} L 175 125 Z`} fill={primaryColor} />
                  <path d={`M 255 125 L 275 155 L 265 ${410 - hemReductionPx} L 225 ${410 - hemReductionPx} L 225 125 Z`} fill={primaryColor} />
                  <rect x="168" y="125" width="8" height={285 - hemReductionPx} fill="#FBBF24" opacity="0.85" />
                  <rect x="224" y="125" width="8" height={285 - hemReductionPx} fill="#FBBF24" opacity="0.85" />
                </g>
              )}

              {/* G. Áo Tứ Thân (Dân gian Bắc Bộ) */}
              {garment.svgTemplate === 'AO_TU_THAN' && (
                <g id="template-ao-tu-than">
                  <path d="M 168 250 L 152 446 L 248 446 L 232 250 Z" fill={pantColor} opacity="0.96" />
                  <path d={`M 155 125 L 128 150 L 140 300 L 158 ${430 - hemReductionPx} L 196 ${430 - hemReductionPx} L 198 244 L 186 125 Z`} fill={primaryColor} />
                  <path d={`M 245 125 L 272 150 L 260 300 L 242 ${430 - hemReductionPx} L 204 ${430 - hemReductionPx} L 202 244 L 214 125 Z`} fill={primaryColor} />
                  <path d={`M 155 125 L 128 150 L 140 300 L 158 ${430 - hemReductionPx} L 196 ${430 - hemReductionPx} L 198 244 L 186 125 Z`} fill="url(#fabric-shading)" />
                  <path d={`M 245 125 L 272 150 L 260 300 L 242 ${430 - hemReductionPx} L 204 ${430 - hemReductionPx} L 202 244 L 214 125 Z`} fill="url(#fabric-shading)" />
                  {/* Nút thắt hai vạt trước */}
                  <ellipse cx="200" cy="246" rx="9" ry="6" fill={primaryColor} stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1" />
                  <path d="M 196 250 L 190 300 L 197 300 Z M 204 250 L 210 300 L 203 300 Z" fill={primaryColor} stroke="#000" strokeOpacity="0.25" strokeWidth="0.6" />
                </g>
              )}

              {/* H. Áo Dài truyền thống */}
              {garment.svgTemplate === 'AO_DAI' && (
                <g id="template-ao-dai">
                  <path d={`M 166 238 L 234 238 L 244 ${446 - hemReductionPx} Q 200 ${452 - hemReductionPx} 156 ${446 - hemReductionPx} Z`} fill={primaryColor} />
                  <path d={`M 166 238 L 234 238 L 244 ${446 - hemReductionPx} Q 200 ${452 - hemReductionPx} 156 ${446 - hemReductionPx} Z`} fill="url(#fabric-shading)" />
                  <path d="M 160 125 L 140 145 L 160 242 L 240 242 L 260 145 L 240 125 Z" fill={primaryColor} />
                  <path d="M 160 125 L 140 145 L 160 242 L 240 242 L 260 145 L 240 125 Z" fill="url(#fabric-shading)" />
                  <path d={`M 145 135 L ${116 - sleeveWidthPx} ${250 + sleeveLengthPx} L ${128 - sleeveWidthPx} ${256 + sleeveLengthPx} L 158 160 Z`} fill={primaryColor} />
                  <path d={`M 255 135 L ${284 + sleeveWidthPx} ${250 + sleeveLengthPx} L ${272 + sleeveWidthPx} ${256 + sleeveLengthPx} L 242 160 Z`} fill={primaryColor} />
                  {/* Cúc bấm chéo nách */}
                  <path d="M 200 121 Q 222 132 246 152" stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.55" />
                  <circle cx="208" cy="126" r="2.2" fill="#F5E7C4" />
                  <circle cx="219" cy="133" r="2.2" fill="#F5E7C4" />
                  <circle cx="231" cy="141" r="2.2" fill="#F5E7C4" />
                  <circle cx="242" cy="149" r="2.2" fill="#F5E7C4" />
                  <path d="M 188 129 Q 200 132 212 129 L 213 118 Q 200 120 187 118 Z" fill={primaryColor} stroke="#E5E7EB" strokeWidth="0.8" />
                </g>
              )}

              {/* F. Áo Ngũ Thân Tân Thời (Remix) */}
              {garment.svgTemplate === 'NGU_THAN_REMIX' && (
                <g id="template-ngu-than-remix">
                  <path
                    d={`M 155 125 L 130 145 L 140 260 L 152 ${360 - hemReductionPx} Q 200 ${370 - hemReductionPx} 248 ${360 - hemReductionPx} L 260 260 L 270 145 L 245 125 Z`}
                    fill={primaryColor}
                  />
                  <path
                    d={`M 155 125 L 130 145 L 140 260 L 152 ${360 - hemReductionPx} Q 200 ${370 - hemReductionPx} 248 ${360 - hemReductionPx} L 260 260 L 270 145 L 245 125 Z`}
                    fill="url(#fabric-shading)"
                  />
                  <path d={`M 200 120 L 214 150 L 216 ${360 - hemReductionPx}`} stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.7" />
                  <circle cx="203" cy="126" r="2.5" fill="#E2E8F0" />
                  <circle cx="208" cy="148" r="2.5" fill="#E2E8F0" />
                  <circle cx="214" cy="175" r="2.5" fill="#E2E8F0" />
                </g>
              )}

              {/* Generic fallback */}
              {!scene.garment.hasVectorTemplate && (
                <g id="template-generic-vector">
                  <path d={`M155 125L125 150 140 290 150 ${420 - hemReductionPx}Q200 ${430 - hemReductionPx} 250 ${420 - hemReductionPx}L260 290 275 150 245 125Z`} fill={primaryColor} />
                  <path d={`M155 125L125 150 140 290 150 ${420 - hemReductionPx}Q200 ${430 - hemReductionPx} 250 ${420 - hemReductionPx}L260 290 275 150 245 125Z`} fill="url(#fabric-shading)" />
                  <path d={`M200 120L214 155V${420 - hemReductionPx}`} stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
                </g>
              )}
              <SvgAssetImage asset={scene.garment} opacity={0.35} />
            </g>
          </g>

          {/* 8. LAYER: ACCESSORIES & SHOES */}
          <g id="layer-accessories" data-layer-id={scene.accessories.map((item) => item.dataId).join(',')}>
            {scene.accessories.map((item) => (
              <g
                key={item.dataId}
                data-layer-id={item.dataId}
                data-asset-id={item.assetId}
                data-asset-source={item.source ?? ''}
                data-fallback-key={item.fallbackKey}
              >
                {renderAccessoryFallback(item.variant, item.color)}
                <SvgAssetImage asset={item} opacity={0.9} />
              </g>
            ))}
          </g>

          <g id="layer-shoes" data-layer-id={scene.shoes.map((item) => item.dataId).join(',')}>
            {scene.shoes.map((item) => (
              <g
                key={item.dataId}
                data-layer-id={item.dataId}
                data-asset-id={item.assetId}
                data-asset-source={item.source ?? ''}
                data-fallback-key={item.fallbackKey}
                transform={isWheelchair ? 'translate(0,-28)' : undefined}
              >
                {renderShoeFallback(item.variant, item.color)}
                <SvgAssetImage asset={item} opacity={0.9} />
              </g>
            ))}
          </g>

          {/* 9. LAYER: HOTSPOTS / INTERACTIVE HANDLES (XIX) */}
          {(showHotspots || adaptiveAdjustments) && (
            <g id="layer-hotspots" className="cursor-pointer">
              {/* Hem Drag Handle */}
              <g transform={`translate(200, ${405 - hemReductionPx})`}>
                <line x1="-50" y1="0" x2="50" y2="0" stroke="#8A5E17" strokeWidth="2" strokeDasharray="4 2" />
                <circle cx="0" cy="0" r="7" fill="#8A5E17" stroke="#FFFFFF" strokeWidth="2" />
                <text x="0" y="-10" textAnchor="middle" fill="#1F1B18" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  Tà áo: -{Math.round(hemReductionPx / 1.5)}cm
                </text>
              </g>

              {/* Slit Drag Handle */}
              <g transform={`translate(140, ${270 - slitRaisePx})`}>
                <circle cx="0" cy="0" r="6" fill="#4F7350" stroke="#FFFFFF" strokeWidth="2" />
                <text x="-8" y="4" textAnchor="end" fill="#1F1B18" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  Điểm xẻ tà
                </text>
              </g>

              {/* Sleeve Handle */}
              <g transform={`translate(${115 - sleeveWidthPx}, ${240 + sleeveLengthPx})`}>
                <circle cx="0" cy="0" r="6" fill="#2E4A6B" stroke="#FFFFFF" strokeWidth="2" />
                <text x="-8" y="4" textAnchor="end" fill="#1F1B18" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  Tay áo
                </text>
              </g>

              {/* Closure Handle */}
              <g transform="translate(202, 125)">
                <circle cx="0" cy="0" r="5" fill="#8B1E2B" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="10" y="4" fill="#1F1B18" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  Khuy cài
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Interactive Quick Color Swatches */}
      {onColorChange && garment.baseColors.length > 0 && (
        <div className="w-full px-4 py-3 bg-[#FFFFFF] border-t border-[#E6DCCD] flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-xs text-[#736960] font-medium whitespace-nowrap">Màu sắc y phục:</span>
          <div className="flex items-center gap-2">
            {garment.baseColors.map((color) => {
              const isSelected = color.hex.toLowerCase() === primaryColor.toLowerCase();
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => onColorChange(color.hex)}
                  title={color.name}
                  aria-label={`Màu ${color.name}`}
                  aria-pressed={isSelected}
                  className={`press relative size-8 rounded-full border transition ${
                    isSelected ? 'ring-2 ring-[#1F1B18] ring-offset-2 ring-offset-[#FFFFFF] border-[#1F1B18] scale-105' : 'border-[#E6DCCD] hover:scale-105 shadow-2xs'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
