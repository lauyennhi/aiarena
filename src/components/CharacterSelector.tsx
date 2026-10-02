import React, { useState } from 'react';
import { CharacterItem } from '../types/fashion';
import { getCharacters } from '../lib/dal';

interface CharacterSelectorProps {
  selectedCharacterId: string;
  onSelect: (char: CharacterItem) => void;
  skinTone?: string | null;
  onSkinToneChange?: (tone: string | null) => void;
  selectedHair?: string;
  onHairChange?: (hair: string) => void;
  selectedPose?: string;
  onPoseChange?: (pose: string) => void;
}

export const SKIN_TONES = [
  { hex: '#F7EDE2', label: 'Trắng Ngà' },
  { hex: '#F3D9C7', label: 'Hồng Hào' },
  { hex: '#E2B897', label: 'Tự Nhiên' },
  { hex: '#C68B59', label: 'Bánh Mật' },
  { hex: '#8D5B4C', label: 'Trầm Ấm' },
  { hex: '#5E3A2B', label: 'Nâu Đồng' },
];

export const BODY_SHAPES = [
  { id: 'BALANCED', label: 'Phom Cân Đối', desc: 'Tỷ lệ thân hình chuẩn mực cổ điển' },
  { id: 'TALL', label: 'Phom Cao Ráo', desc: 'Thân cao thanh thoát, tà áo buông dài' },
  { id: 'CURVED', label: 'Phom Đầy Đặn', desc: 'Nét đẹp phúc hậu, đường cong mềm mại' },
  { id: 'SEATED', label: 'Phom Ngồi Tự Chủ', desc: 'Trọng tâm ngồi vững vàng, tà phẳng phiu' },
];

export const HAIR_SILHOUETTES = [
  { id: 'BUI_CU_TOI', label: 'Búi Củ Tỏi Cao', icon: '👱‍♀️', desc: 'Thanh thoát, khoe trọn cổ áo' },
  { id: 'TOC_VAN', label: 'Tóc Vấn Nếp Cổ', icon: '👑', desc: 'Hài hòa cùng mấn và khăn đóng' },
  { id: 'BOB_NGAN', label: 'Tóc Bob Hiện Đại', icon: '💇‍♀️', desc: 'Cá tính, trẻ trung đậm chất Gen Z' },
  { id: 'XOA_DAI', label: 'Tóc Xõa Tự Nhiên', icon: '👩‍🦰', desc: 'Dịu dàng thướt tha truyền thống' },
  { id: 'UON_SONG', label: 'Tóc Uốn Sóng', icon: '✨', desc: 'Sang trọng, lãng mạn đương đại' },
  { id: 'TOC_TEM', label: 'Tóc Tém Gọn Gàng', icon: '💇', desc: 'Năng động, tối giản thanh lịch' },
];

export const POSES = [
  { id: 'STANDING', label: 'Đứng Trang Trọng', icon: '🚶' },
  { id: 'WALKING', label: 'Bước Đi Tự Nhiên', icon: '💃' },
  { id: 'SEATED', label: 'Ngồi Đĩnh Đạc', icon: '🪑' },
  { id: 'WHEELCHAIR', label: 'Xe Lăn Tự Chủ', icon: '♿' },
];

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  selectedCharacterId,
  onSelect,
  skinTone = null,
  onSkinToneChange,
  selectedHair = 'TOC_VAN',
  onHairChange,
  selectedPose = 'STANDING',
  onPoseChange,
}) => {
  const characters = getCharacters();
  const [selectedShape, setSelectedShape] = useState('BALANCED');

  return (
    <div className="space-y-6">
      {/* Character Profile Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1F1B18] font-mono uppercase tracking-wider">
            1. Chọn Người Mẫu Đại Diện:
          </span>
          <span className="text-xs text-[#736960]">Đa dạng giới & phong thái</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {characters.map((char) => {
            const isSelected = char.id === selectedCharacterId;
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => onSelect(char)}
                className={`press text-center p-4 rounded-[22px] border transition space-y-1.5 ${
                  isSelected
                    ? 'border-[#1F1B18] bg-[#F1EADF] shadow-xs ring-1 ring-[#1F1B18]'
                    : 'border-[#E6DCCD] bg-[#FFFFFF] hover:border-[#D8CCBA]'
                }`}
              >
                <div className="size-12 mx-auto rounded-full bg-[#FBF8F3] border border-[#E6DCCD] grid place-items-center text-lg shadow-inner">
                  {char.gender === 'FEMALE' ? '👩' : char.gender === 'MALE' ? '👨' : '🧑'}
                </div>
                <div className="font-serif font-bold text-sm text-[#1F1B18] mt-1">
                  {char.name}
                </div>
                <p className="text-[10px] text-[#736960] line-clamp-1">
                  {char.gender === 'FEMALE' ? 'Nữ giới' : char.gender === 'MALE' ? 'Nam giới' : 'Đa dạng'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Body Shape (Tôn trọng, không phán xét) */}
      <div className="space-y-3 pt-3 border-t border-[#E6DCCD]">
        <span className="text-xs font-bold text-[#1F1B18] font-mono uppercase tracking-wider block">
          2. Dáng Người (Body Shape):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BODY_SHAPES.map((shape) => (
            <button
              key={shape.id}
              type="button"
              onClick={() => setSelectedShape(shape.id)}
              className={`press text-left p-3 rounded-2xl border transition text-xs ${
                selectedShape === shape.id
                  ? 'border-[#1F1B18] bg-[#F1EADF] text-[#1F1B18] font-bold ring-1 ring-[#1F1B18]'
                  : 'border-[#E6DCCD] bg-[#FFFFFF] text-[#736960] hover:text-[#1F1B18]'
              }`}
            >
              <span className="block font-semibold text-[#1F1B18]">{shape.label}</span>
              <span className="text-[10px] text-[#736960] block mt-0.5">{shape.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Skin Tone (6 Tones) */}
      {onSkinToneChange && (
        <div className="space-y-3 pt-3 border-t border-[#E6DCCD]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1F1B18] font-mono uppercase tracking-wider">
              3. Tông Màu Da (6 sắc độ tự nhiên):
            </span>
            <button
              type="button"
              onClick={() => onSkinToneChange(null)}
              className="text-xs text-[#736960] hover:text-[#1F1B18] underline"
            >
              Mặc định theo mẫu
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {SKIN_TONES.map((tone) => {
              const isSelected = skinTone === tone.hex;
              return (
                <button
                  key={tone.hex}
                  type="button"
                  onClick={() => onSkinToneChange(tone.hex)}
                  title={tone.label}
                  className={`press flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition ${
                    isSelected
                      ? 'border-[#1F1B18] bg-[#F1EADF] text-[#1F1B18] font-bold ring-1 ring-[#1F1B18]'
                      : 'border-[#E6DCCD] bg-[#FFFFFF] text-[#736960] hover:text-[#1F1B18]'
                  }`}
                >
                  <span
                    className="size-4.5 rounded-full border border-[#D8CCBA] shrink-0"
                    style={{ backgroundColor: tone.hex }}
                  />
                  <span>{tone.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hair Silhouette (6 Silhouettes) */}
      <div className="space-y-3 pt-3 border-t border-[#E6DCCD]">
        <span className="text-xs font-bold text-[#1F1B18] font-mono uppercase tracking-wider block">
          4. Kiểu Tóc & Khung Đầu (6 dáng tóc):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {HAIR_SILHOUETTES.map((hair) => {
            const isSelected = selectedHair === hair.id;
            return (
              <button
                key={hair.id}
                type="button"
                onClick={() => onHairChange?.(hair.id)}
                className={`press text-left p-3 rounded-2xl border transition text-xs flex items-center gap-2.5 ${
                  isSelected
                    ? 'border-[#1F1B18] bg-[#F1EADF] text-[#1F1B18] font-bold ring-1 ring-[#1F1B18]'
                    : 'border-[#E6DCCD] bg-[#FFFFFF] text-[#736960] hover:text-[#1F1B18]'
                }`}
              >
                <span className="text-lg shrink-0">{hair.icon}</span>
                <div>
                  <span className="block font-semibold text-[#1F1B18]">{hair.label}</span>
                  <span className="text-[10px] text-[#736960] block">{hair.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pose (4 Poses) */}
      <div className="space-y-3 pt-3 border-t border-[#E6DCCD]">
        <span className="text-xs font-bold text-[#1F1B18] font-mono uppercase tracking-wider block">
          5. Tư Thế (Pose):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {POSES.map((pose) => {
            const isSelected = selectedPose === pose.id;
            return (
              <button
                key={pose.id}
                type="button"
                onClick={() => onPoseChange?.(pose.id)}
                className={`press text-left p-3 rounded-2xl border transition text-xs flex items-center gap-2 ${
                  isSelected
                    ? 'border-[#1F1B18] bg-[#F1EADF] text-[#1F1B18] font-bold ring-1 ring-[#1F1B18]'
                    : 'border-[#E6DCCD] bg-[#FFFFFF] text-[#736960] hover:text-[#1F1B18]'
                }`}
              >
                <span className="text-xl shrink-0">{pose.icon}</span>
                <span className="font-semibold">{pose.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
