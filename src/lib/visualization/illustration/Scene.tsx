import React from 'react';
import type { Garment, Accessory, CharacterItem } from '../../../types/fashion';
import { GroundShadow } from './GroundShadow';
import { Head } from './Head';
import { AoDai } from './AoDai';
import { TuThan } from './TuThan';
import { NguThan } from './NguThan';
import { SeatedAoDai } from './SeatedAoDai';
import { Accessories } from './Accessories';
import { Hotspots } from './Hotspots';

export interface SceneProps {
  garment: Garment;
  primaryColor: string;
  pantColor: string;
  accessories: Accessory[];
  character: CharacterItem;
  eventId?: string;
  weatherId?: string;
  isWheelchair?: boolean;
  showHotspots?: boolean;
}

export const Scene: React.FC<SceneProps> = ({
  garment,
  primaryColor,
  pantColor,
  accessories,
  character,
  eventId = 'EVENT_TET',
  weatherId = 'WEATHER_MILD',
  isWheelchair = false,
  showHotspots = false,
}) => {
  const isTuThan = garment.id.includes('tu-than');
  const isNguThan = garment.id.includes('ngu-than');
  const isWideSleeve = garment.id.includes('tac');

  return (
    <svg
      viewBox="0 0 400 500"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft Silk Sheen Linear Gradient */}
        <linearGradient id="silk-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
        </linearGradient>

        {/* Weather Lighting: Rain Stroke Pattern */}
        <pattern id="rain-strokes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#94A3B8" strokeWidth="0.8" opacity="0.3" />
        </pattern>
      </defs>

      {/* 1. LAYER 1: BACKDROP ACCORDING TO EVENT & WEATHER */}
      <g id="layer-backdrop">
        {/* Default Sand / Editorial Backdrop */}
        <rect width="400" height="500" fill="#FAF6F0" />
        <ellipse cx="200" cy="460" rx="190" ry="30" fill="#F1EADF" opacity="0.6" />

        {/* Event-specific motifs */}
        {eventId === 'EVENT_TET' && (
          <g id="backdrop-tet" opacity="0.75">
            {/* Peach blossom branch */}
            <path d="M40 80 Q100 60 140 100" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="80" cy="70" r="6" fill="#F472B6" />
            <circle cx="110" cy="75" r="5" fill="#F472B6" />
            <circle cx="130" cy="95" r="6" fill="#F472B6" />
            {/* Mai yellow blossoms */}
            <circle cx="60" cy="85" r="4.5" fill="#FBBF24" />
            <circle cx="95" cy="65" r="5" fill="#FBBF24" />
          </g>
        )}

        {(eventId === 'EVENT_GRADUATION' || eventId === 'EVENT_YEARBOOK') && (
          <g id="backdrop-graduation" opacity="0.3">
            {/* Ancient academy arches and columns */}
            <line x1="40" y1="50" x2="40" y2="460" stroke="#A89F91" strokeWidth="6" />
            <line x1="360" y1="50" x2="360" y2="460" stroke="#A89F91" strokeWidth="6" />
            <path d="M40 90 Q200 40 360 90" stroke="#A89F91" strokeWidth="4" fill="none" />
          </g>
        )}

        {eventId === 'EVENT_CASUAL' && (
          <g id="backdrop-casual-lanterns" opacity="0.6">
            {/* Hội An Wall & Lanterns */}
            <ellipse cx="60" cy="110" rx="10" ry="14" fill="#EF4444" opacity="0.8" />
            <line x1="60" y1="90" x2="60" y2="96" stroke="#1F1B18" strokeWidth="1" />
            <ellipse cx="340" cy="120" rx="9" ry="13" fill="#F59E0B" opacity="0.8" />
            <line x1="340" y1="100" x2="340" y2="107" stroke="#1F1B18" strokeWidth="1" />
          </g>
        )}

        {/* Weather Lighting Overlay */}
        {weatherId === 'WEATHER_HOT' && (
          <g id="weather-hot-sun">
            <circle cx="340" cy="60" r="32" fill="#FDE68A" opacity="0.4" />
            <circle cx="340" cy="60" r="20" fill="#F59E0B" opacity="0.3" />
          </g>
        )}

        {weatherId === 'WEATHER_RAIN' && (
          <rect width="400" height="500" fill="url(#rain-strokes)" />
        )}

        {weatherId === 'WEATHER_COOL' && (
          <rect width="400" height="500" fill="#E0F2FE" opacity="0.08" />
        )}
      </g>

      {/* 2. LAYER 2: GROUND SHADOW */}
      <GroundShadow isSeated={isWheelchair} />

      {/* 3. LAYER 3: BODY (Head & Hands) */}
      <Head skinTone={character.skinTone || '#F3D9C7'} isSeated={isWheelchair} />

      {/* 4. LAYER 4, 5, 6, 7: GARMENT (3-tone, folds, sheen) */}
      {isWheelchair ? (
        <SeatedAoDai
          primaryColor={primaryColor}
          pantColor={pantColor}
        />
      ) : isTuThan ? (
        <TuThan
          primaryColor={primaryColor}
        />
      ) : isNguThan ? (
        <NguThan
          primaryColor={primaryColor}
          pantColor={pantColor}
          isWideSleeve={isWideSleeve}
          buttonCount={5}
        />
      ) : (
        <AoDai
          primaryColor={primaryColor}
          pantColor={pantColor}
        />
      )}

      {/* 8. LAYER 8: ACCESSORIES */}
      <Accessories accessories={accessories} isSeated={isWheelchair} />

      {/* 9. LAYER 9: HOTSPOTS (Optional on Result) */}
      {showHotspots && <Hotspots garmentId={garment.id} />}
    </svg>
  );
};
