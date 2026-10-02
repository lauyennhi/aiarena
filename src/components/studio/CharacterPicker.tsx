import React from 'react';
import type { CharacterItem } from '../../types/fashion';
import { SKIN_TONES, BODY_SHAPES, HAIR_SILHOUETTES, POSES } from '../CharacterSelector';

export interface CharacterPickerProps {
  characters: CharacterItem[];
  selectedCharacter: CharacterItem;
  onSelectCharacter: (char: CharacterItem) => void;
  selectedShape: string;
  onSelectShape: (shapeId: string) => void;
  skinToneHex: string;
  onSelectSkinTone: (hex: string) => void;
  selectedHair: string;
  onSelectHair: (hairId: string) => void;
  selectedPose: string;
  onSelectPose: (poseId: string) => void;
}

export const CharacterPicker: React.FC<CharacterPickerProps> = ({
  characters,
  selectedCharacter,
  onSelectCharacter,
  selectedShape,
  onSelectShape,
  skinToneHex,
  onSelectSkinTone,
  selectedHair,
  onSelectHair,
  selectedPose,
  onSelectPose,
}) => {
  return (
    <div className="space-y-5">
      {/* 1. Mẫu Người */}
      <div>
        <span className="text-xs font-bold text-[#1F1B18] block mb-2">Chọn Người Mẫu:</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {characters.map((char) => (
            <button
              key={char.id}
              type="button"
              onClick={() => onSelectCharacter(char)}
              className={`press p-3 rounded-2xl border text-center transition ${
                selectedCharacter.id === char.id
                  ? 'border-[#1F1B18] bg-[#F1EADF] font-bold shadow-xs'
                  : 'border-[#E6DCCD] bg-[#FFFFFF] hover:border-[#D8CCBA]'
              }`}
            >
              <div className="text-2xl mb-1">{char.gender === 'FEMALE' ? '👩' : char.gender === 'MALE' ? '👨' : '🧑'}</div>
              <div className="text-xs font-bold text-[#1F1B18]">{char.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Dáng Người (Không phán xét cơ thể) */}
      <div>
        <span className="text-xs font-bold text-[#1F1B18] block mb-2">Tỷ Lệ Vóc Dáng:</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BODY_SHAPES.map((shape) => (
            <button
              key={shape.id}
              type="button"
              onClick={() => onSelectShape(shape.id)}
              className={`press p-3 rounded-2xl border text-left transition ${
                selectedShape === shape.id
                  ? 'border-[#1F1B18] bg-[#F1EADF] font-bold shadow-xs'
                  : 'border-[#E6DCCD] bg-[#FFFFFF] hover:border-[#D8CCBA]'
              }`}
            >
              <div className="text-xs font-bold text-[#1F1B18]">{shape.label}</div>
              <div className="text-[10px] text-[#736960] mt-0.5">{shape.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tông Da Di Sản (Ít nhất 6 tone) */}
      <div>
        <span className="text-xs font-bold text-[#1F1B18] block mb-2">Tông Màu Da:</span>
        <div className="flex flex-wrap gap-2.5">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone.hex}
              type="button"
              onClick={() => onSelectSkinTone(tone.hex)}
              className={`press flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition ${
                skinToneHex.toLowerCase() === tone.hex.toLowerCase()
                  ? 'border-[#1F1B18] bg-[#F1EADF] font-bold ring-1 ring-[#1F1B18]'
                  : 'border-[#E6DCCD] bg-[#FFFFFF] text-[#736960]'
              }`}
            >
              <span className="size-4.5 rounded-full border border-[#D8CCBA]" style={{ backgroundColor: tone.hex }} />
              <span>{tone.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Kiểu Tóc Silhouette */}
      <div>
        <span className="text-xs font-bold text-[#1F1B18] block mb-2">Kiểu Tóc / Vấn Đầu:</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {HAIR_SILHOUETTES.map((hair) => (
            <button
              key={hair.id}
              type="button"
              onClick={() => onSelectHair(hair.id)}
              className={`press p-2.5 rounded-2xl border text-center transition ${
                selectedHair === hair.id
                  ? 'border-[#1F1B18] bg-[#F1EADF] font-bold shadow-xs'
                  : 'border-[#E6DCCD] bg-[#FFFFFF] hover:border-[#D8CCBA]'
              }`}
            >
              <div className="text-xl mb-1">{hair.icon}</div>
              <div className="text-[11px] font-bold text-[#1F1B18]">{hair.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Tư Thế (Đứng, Đi, Ngồi, Wheelchair) */}
      <div>
        <span className="text-xs font-bold text-[#1F1B18] block mb-2">Tư Thế:</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {POSES.map((pose) => (
            <button
              key={pose.id}
              type="button"
              onClick={() => onSelectPose(pose.id)}
              className={`press p-3 rounded-2xl border text-center transition ${
                selectedPose === pose.id
                  ? 'border-[#1F1B18] bg-[#F1EADF] font-bold shadow-xs'
                  : 'border-[#E6DCCD] bg-[#FFFFFF] hover:border-[#D8CCBA]'
              }`}
            >
              <div className="text-2xl mb-1">{pose.icon}</div>
              <div className="text-xs font-bold text-[#1F1B18]">{pose.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
