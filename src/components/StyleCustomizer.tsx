import React, { useState } from 'react';
import { Garment, Accessory } from '../types/fashion';
import { getApprovedAccessories } from '../lib/dal';

interface StyleCustomizerProps {
  garment: Garment;
  selectedColorHex: string;
  selectedPantColorHex: string;
  selectedAccessoryIds: string[];
  eventId?: string;
  showColors?: boolean;
  showPantColors?: boolean;
  showAccessories?: boolean;
  onColorChange: (hex: string) => void;
  onPantColorChange: (hex: string) => void;
  onToggleAccessory: (id: string) => void;
}

export const StyleCustomizer: React.FC<StyleCustomizerProps> = ({
  garment,
  selectedColorHex,
  selectedPantColorHex,
  selectedAccessoryIds,
  eventId,
  showColors = true,
  showPantColors = true,
  showAccessories = true,
  onColorChange,
  onPantColorChange,
  onToggleAccessory,
}) => {
  const [accFilter, setAccFilter] = useState<'ALL' | 'TRADITIONAL' | 'MODERN'>('ALL');

  const accessories = getApprovedAccessories().filter((accessory) =>
    accessory.compatibleGarmentIds.includes(garment.id) &&
    garment.compatibleAccessoryIds.includes(accessory.id) &&
    (!eventId || !accessory.compatibleEventIds.length || accessory.compatibleEventIds.includes(eventId)),
  );

  const filteredAccessories = accessories.filter((acc) => {
    const isModern = acc.styleTags.includes('REMIX_GEN_Z') || acc.id.includes('sneaker') || acc.id.includes('tui');
    if (accFilter === 'TRADITIONAL') return !isModern;
    if (accFilter === 'MODERN') return isModern;
    return true;
  });

  // Pant colors
  const pantColors = [
    { name: 'Trắng Ngà Tự Nhiên (Lễ Phục)', hex: '#F4F0E8' },
    { name: 'Đen Tuyển Lụa (Thanh Lịch)', hex: '#1C1C1E' },
    { name: 'Nâu Trầm Cổ', hex: '#5D4037' },
    { name: 'Đỏ Chu Sa (Hỷ Khúc)', hex: '#8B1E2B' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Primary Garment Color */}
      {showColors && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#1F1B18] font-mono uppercase tracking-wider block">
              Màu Tà Áo Chính ({garment.baseColors.length} màu chuẩn theo y phục):
            </label>
            <span className="text-xs font-mono text-[#736960]">{selectedColorHex}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {garment.baseColors.map((color) => {
              const isSelected = color.hex.toLowerCase() === selectedColorHex.toLowerCase();
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => onColorChange(color.hex)}
                  aria-pressed={isSelected}
                  className={`press min-h-[46px] p-2.5 rounded-[20px] border flex items-center gap-2.5 transition ${
                    isSelected
                      ? 'bg-[#F1EADF] border-[#1F1B18] ring-1 ring-[#1F1B18] shadow-xs'
                      : 'bg-[#FFFFFF] border-[#E6DCCD] hover:border-[#D8CCBA]'
                  }`}
                >
                  <span
                    className="size-5 rounded-full border border-[#D8CCBA] shrink-0 shadow-2xs"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs font-medium text-[#1F1B18] truncate">{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Pant Color */}
      {showPantColors && (
        <div className="space-y-2.5 pt-3 border-t border-[#E6DCCD]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#1F1B18] font-mono uppercase tracking-wider block">
              Màu Quần / Chân Váy Đi Kèm:
            </label>
            <span className="text-xs font-mono text-[#736960]">{selectedPantColorHex}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {pantColors.map((pc) => {
              const isSelected = pc.hex.toLowerCase() === selectedPantColorHex.toLowerCase();
              return (
                <button
                  key={pc.hex}
                  type="button"
                  onClick={() => onPantColorChange(pc.hex)}
                  aria-pressed={isSelected}
                  className={`press min-h-[46px] p-2.5 rounded-[20px] border flex items-center gap-2.5 transition ${
                    isSelected
                      ? 'bg-[#F1EADF] border-[#1F1B18] ring-1 ring-[#1F1B18] shadow-xs'
                      : 'bg-[#FFFFFF] border-[#E6DCCD] hover:border-[#D8CCBA]'
                  }`}
                >
                  <span
                    className="size-5 rounded-full border border-[#D8CCBA] shrink-0 shadow-2xs"
                    style={{ backgroundColor: pc.hex }}
                  />
                  <span className="text-xs font-medium text-[#1F1B18] truncate">{pc.name.split('(')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Layered Accessories (Traditional & Modern) */}
      {showAccessories && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs font-bold text-[#1F1B18] font-mono uppercase tracking-wider block">
                Phụ Kiện Tương Thích ({selectedAccessoryIds.length} món đã chọn):
              </label>
              <p className="text-[11px] text-[#736960] mt-0.5">
                Cho phép phối tự do giữa phụ kiện cổ điển và phụ kiện Gen Z hiện đại.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FBF8F3] border border-[#E6DCCD] rounded-xl self-start sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => setAccFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  accFilter === 'ALL' ? 'bg-[#1F1B18] text-[#FFFFFF]' : 'text-[#736960] hover:text-[#1F1B18]'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setAccFilter('TRADITIONAL')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  accFilter === 'TRADITIONAL' ? 'bg-[#1F1B18] text-[#FFFFFF]' : 'text-[#736960] hover:text-[#1F1B18]'
                }`}
              >
                Truyền thống
              </button>
              <button
                type="button"
                onClick={() => setAccFilter('MODERN')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  accFilter === 'MODERN' ? 'bg-[#1F1B18] text-[#FFFFFF]' : 'text-[#736960] hover:text-[#1F1B18]'
                }`}
              >
                Gen Z Remix
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredAccessories.map((acc) => {
              const isSelected = selectedAccessoryIds.includes(acc.id);
              const isModern = acc.styleTags.includes('REMIX_GEN_Z') || acc.id.includes('sneaker') || acc.id.includes('tui');

              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => onToggleAccessory(acc.id)}
                  aria-pressed={isSelected}
                  className={`p-3.5 rounded-[22px] border text-left flex items-start gap-3 transition ${
                    isSelected
                      ? 'bg-[#F1EADF] border-[#1F1B18] ring-1 ring-[#1F1B18] shadow-xs'
                      : 'bg-[#FFFFFF] border-[#E6DCCD] hover:border-[#D8CCBA]'
                  }`}
                >
                  <span className="text-xl shrink-0">
                    {acc.type === 'HEADWEAR' ? '🧢' :
                     acc.type === 'JEWELRY' || acc.type === 'PENDANT' ? '📿' :
                     acc.type === 'HANDHELD' ? '🪭' :
                     acc.type === 'FOOTWEAR' ? '👟' :
                     acc.type === 'BAG' ? '👜' : '✨'}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-serif font-bold text-xs text-[#1F1B18] truncate">
                        {acc.name}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border shrink-0 font-medium ${
                        isModern
                          ? 'bg-[#E6ECF3] text-[#2E4A6B] border-[#CAD9E8]'
                          : 'bg-[#E5EDE2] text-[#4F7350] border-[#CDE0C9]'
                      }`}>
                        {isModern ? 'Modern Remix' : 'Cổ truyền'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#736960] mt-1 line-clamp-2 leading-relaxed">
                      {acc.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
