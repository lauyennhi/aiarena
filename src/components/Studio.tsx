import React, { useState, useMemo } from 'react';
import { Garment, Accessory, CharacterItem, Outfit } from '../types/fashion';
import { OutfitMockupCanvas } from './OutfitMockupCanvas';
import { checkCulture } from '../lib/culture/ruleEngine';
import { evaluateColorHarmony } from '../lib/color/harmony';
import { getApprovedGarments, getApprovedAccessories, getCharacters } from '../lib/dal';
import { STYLE_CHOICES, styleLabel } from '../lib/styles';
import { SKIN_TONES, BODY_SHAPES, HAIR_SILHOUETTES, POSES } from './CharacterSelector';

interface StudioProps {
  onSaveOutfit: (outfit: Outfit) => void;
  onOpenCompare?: () => void;
  onOpenTailoringSheet?: (needCode: string) => void;
  showToast: (msg: string) => void;
}

type StudioCategory =
  | 'CHARACTER'
  | 'SHAPE'
  | 'SKIN'
  | 'HAIR'
  | 'POSE'
  | 'GARMENT'
  | 'COLOR'
  | 'ACCESSORIES'
  | 'BACKGROUND';

const STUDIO_CATEGORIES: { id: StudioCategory; stepNum: string; label: string; icon: string }[] = [
  { id: 'CHARACTER', stepNum: '01', label: 'Nhân vật', icon: '👤' },
  { id: 'SHAPE', stepNum: '02', label: 'Dáng người', icon: '📐' },
  { id: 'SKIN', stepNum: '03', label: 'Tông da', icon: '🎨' },
  { id: 'HAIR', stepNum: '04', label: 'Kiểu tóc', icon: '💇' },
  { id: 'POSE', stepNum: '05', label: 'Tư thế', icon: '🚶' },
  { id: 'GARMENT', stepNum: '06', label: 'Việt phục', icon: '👘' },
  { id: 'COLOR', stepNum: '07', label: 'Màu sắc', icon: '🌈' },
  { id: 'ACCESSORIES', stepNum: '08', label: 'Phụ kiện', icon: '💎' },
  { id: 'BACKGROUND', stepNum: '09', label: 'Bối cảnh', icon: '🖼️' },
];

const TRADITIONAL_PALETTE = [
  { name: 'Đỏ Son', hex: '#8B1E2B' },
  { name: 'Đỏ Điều', hex: '#9B111E' },
  { name: 'Xanh Lam Cung Đình', hex: '#2B5C8F' },
  { name: 'Xanh Thiên Thanh', hex: '#4A7C9B' },
  { name: 'Xanh Rêu Ngọc', hex: '#3A5543' },
  { name: 'Vàng Quỳ Hoàng Tộc', hex: '#D4AF37' },
  { name: 'Vàng Mỡ Gà', hex: '#E5C158' },
  { name: 'Tím Huế Đoan Trang', hex: '#53335A' },
  { name: 'Trắng Vỏ Trứng', hex: '#F4F0E8' },
  { name: 'Đen Sơn Mài', hex: '#1C1C1E' },
  { name: 'Hồng Đào', hex: '#E88B97' },
  { name: 'Nâu Củ Nâu', hex: '#7D5139' },
];

const BACKGROUND_THEMES: { id: 'MINIMAL_STUDIO' | 'HERITAGE_PALACE' | 'GARDEN_SPRING'; label: string; icon: string }[] = [
  { id: 'MINIMAL_STUDIO', label: 'Studio Tối Giản', icon: '🏛️' },
  { id: 'HERITAGE_PALACE', label: 'Cung Điện Cố Đô', icon: '🏯' },
  { id: 'GARDEN_SPRING', label: 'Vườn Xuân Dân Gian', icon: '🌸' },
];

// Slot definitions
type SlotType = 'head' | 'neck' | 'hand-left' | 'hand-right' | 'shoulder' | 'feet';

export const Studio: React.FC<StudioProps> = ({
  onSaveOutfit,
  onOpenCompare,
  onOpenTailoringSheet,
  showToast,
}) => {
  const allGarments = useMemo(() => getApprovedGarments(), []);
  const allAccessories = useMemo(() => getApprovedAccessories(), []);
  const allCharacters = useMemo(() => getCharacters(), []);

  // Studio State
  const [activeCategory, setActiveCategory] = useState<StudioCategory>('GARMENT');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterItem>(allCharacters[0]);
  const [selectedShape, setSelectedShape] = useState<string>('BALANCED');
  const [skinToneHex, setSkinToneHex] = useState<string>(allCharacters[0].defaultSkinTone ?? '#F3D9C7');
  const [selectedHair, setSelectedHair] = useState<string>('TOC_VAN');
  const [selectedPose, setSelectedPose] = useState<string>('STANDING');

  const [selectedGarment, setSelectedGarment] = useState<Garment>(allGarments[0]);
  const [primaryColorHex, setPrimaryColorHex] = useState<string>(allGarments[0].baseColors[0].hex);
  const [pantColorHex, setPantColorHex] = useState<string>('#F4F0E8');
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(['acc-khan-dong', 'acc-the-bai']);
  const [backgroundTheme, setBackgroundTheme] = useState<'MINIMAL_STUDIO' | 'HERITAGE_PALACE' | 'GARDEN_SPRING'>('MINIMAL_STUDIO');
  const [remixRatio, setRemixRatio] = useState<number>(35); // 0 (Traditional) to 100 (Remix)
  const [selectedStyleId, setSelectedStyleId] = useState<string>('TOI_GIAN');

  // Drag & drop state
  const [draggedItem, setDraggedItem] = useState<Accessory | null>(null);
  const [activeSlotHighlight, setActiveSlotHighlight] = useState<SlotType | null>(null);

  // Soft suggestion dismiss
  const [dismissedSuggestion, setDismissedSuggestion] = useState(false);

  // Character object with applied skin tone & pose
  const activeCharacter = useMemo<CharacterItem>(() => ({
    ...selectedCharacter,
    skinTone: skinToneHex,
    defaultSkinTone: skinToneHex,
    posture: selectedPose === 'WHEELCHAIR' ? 'WHEELCHAIR_SEATED' : 'STANDING',
  }), [selectedCharacter, skinToneHex, selectedPose]);

  // Active accessories list
  const activeAccessories = useMemo(() => (
    allAccessories.filter((acc) => selectedAccessoryIds.includes(acc.id))
  ), [allAccessories, selectedAccessoryIds]);

  // Real-time cultural check
  const cultureResult = useMemo(() => checkCulture({
    garmentId: selectedGarment.id,
    accessoryIds: selectedAccessoryIds,
    eventId: 'EVENT_GRADUATION',
    primaryColor: primaryColorHex,
    adaptiveNeedCode: selectedPose === 'WHEELCHAIR' ? 'WHEELCHAIR_SEATED' : undefined,
  }), [selectedGarment.id, selectedAccessoryIds, primaryColorHex, selectedPose]);

  // Color harmony
  const harmonyResult = useMemo(() => evaluateColorHarmony({
    primaryColor: primaryColorHex,
    pantColor: pantColorHex,
    accessoryColors: activeAccessories.map((a) => a.colors[0]).filter(Boolean),
  }), [primaryColorHex, pantColorHex, activeAccessories]);

  // Map accessory to slot
  const getAccessorySlot = (acc: Accessory): SlotType => {
    if (acc.type === 'HEADWEAR' || acc.type === 'HAIR_ACCESSORY') return 'head';
    if (acc.type === 'JEWELRY' || acc.type === 'PENDANT') return 'neck';
    if (acc.type === 'HANDHELD') return 'hand-left';
    if (acc.type === 'BAG') return 'hand-right';
    if (acc.type === 'BELT_SASH') return 'shoulder';
    if (acc.type === 'FOOTWEAR') return 'feet';
    return 'hand-right';
  };

  // Equip accessory
  const equipAccessory = (acc: Accessory) => {
    setSelectedAccessoryIds((prev) => {
      if (prev.includes(acc.id)) {
        return prev;
      }
      return [...prev, acc.id];
    });
    showToast(`Đã trang bị: ${acc.name}`);
  };

  // Unequip accessory
  const unequipAccessory = (accId: string) => {
    setSelectedAccessoryIds((prev) => prev.filter((id) => id !== accId));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, acc: Accessory) => {
    setDraggedItem(acc);
    setActiveSlotHighlight(getAccessorySlot(acc));
    e.dataTransfer.setData('text/plain', acc.id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setActiveSlotHighlight(null);
  };

  const handleDropOnSlot = (e: React.DragEvent, targetSlot: SlotType) => {
    e.preventDefault();
    if (draggedItem) {
      equipAccessory(draggedItem);
    }
    setDraggedItem(null);
    setActiveSlotHighlight(null);
  };

  // 5 AI Style Presets (Gợi ý phối cho mình)
  const AI_STYLE_PRESETS = [
    {
      id: 'MINIMAL',
      title: 'Tối Giản Thanh Lịch',
      desc: 'Áo Ngũ Thân màu mộc, phụ kiện tối giản thanh thoát',
      apply: () => {
        const nguThan = allGarments.find((g) => g.id === 'garment-ngu-than-tay-chen') ?? allGarments[0];
        setSelectedGarment(nguThan);
        setPrimaryColorHex(nguThan.baseColors[0].hex);
        setPantColorHex('#F4F0E8');
        setSelectedAccessoryIds(['acc-the-bai']);
        setRemixRatio(15);
        setSelectedStyleId('TOI_GIAN');
        showToast('Đã áp dụng phong cách: Tối Giản Thanh Lịch');
      },
    },
    {
      id: 'SOFT_GEN_Z',
      title: 'Soft Gen Z',
      desc: 'Phối màu pastel dịu nhẹ, sneaker retro năng động',
      apply: () => {
        const remixGarment = allGarments.find((g) => g.id === 'garment-ao-dai-ngu-than-remix') ?? allGarments[0];
        setSelectedGarment(remixGarment);
        setPrimaryColorHex('#4A7C9B');
        setPantColorHex('#F4F0E8');
        setSelectedAccessoryIds(['acc-sneaker-retro', 'acc-tui-coi']);
        setRemixRatio(80);
        setSelectedStyleId('REMIX_GEN_Z');
        showToast('Đã áp dụng phong cách: Soft Gen Z');
      },
    },
    {
      id: 'HERITAGE_REMIX',
      title: 'Heritage Remix',
      desc: 'Áo Tấc cung đình phối phụ kiện đương đại phá cách',
      apply: () => {
        const aoTac = allGarments.find((g) => g.id === 'garment-ao-tac') ?? allGarments[0];
        setSelectedGarment(aoTac);
        setPrimaryColorHex('#2B5C8F');
        setPantColorHex('#1C1C1E');
        setSelectedAccessoryIds(['acc-khan-dong', 'acc-sneaker-retro']);
        setRemixRatio(50);
        setSelectedStyleId('CONTEMPORARY');
        showToast('Đã áp dụng phong cách: Heritage Remix');
      },
    },
    {
      id: 'MODERN_CLASSIC',
      title: 'Cổ Điển Hoàng Gia',
      desc: '100% chuẩn điển chế, khăn đóng, hài thêu và thẻ bài',
      apply: () => {
        const nhatBinh = allGarments.find((g) => g.id === 'garment-ao-nhat-binh') ?? allGarments[0];
        setSelectedGarment(nhatBinh);
        setPrimaryColorHex('#8B1E2B');
        setPantColorHex('#F4F0E8');
        setSelectedAccessoryIds(['acc-man-nu', 'acc-kieng-bac', 'acc-hai-sen']);
        setRemixRatio(5);
        setSelectedStyleId('TRUYEN_THONG_HOANG_GIA');
        showToast('Đã áp dụng phong cách: Cổ Điển Hoàng Gia');
      },
    },
    {
      id: 'FESTIVAL',
      title: 'Lễ Hội Rực Rỡ',
      desc: 'Áo Tứ Thân dân gian, nón quai thao, quạt trầm hương',
      apply: () => {
        const tuThan = allGarments.find((g) => g.id === 'garment-ao-tu-than') ?? allGarments[0];
        setSelectedGarment(tuThan);
        setPrimaryColorHex('#9B111E');
        setPantColorHex('#1C1C1E');
        setSelectedAccessoryIds(['acc-khan-mo-qua', 'acc-non-quai-thao', 'acc-that-lung-lua']);
        setRemixRatio(20);
        setSelectedStyleId('TRUYEN_THONG_HOANG_GIA');
        showToast('Đã áp dụng phong cách: Lễ Hội Rực Rỡ');
      },
    },
  ];

  // Save outfit to Lookbook
  const handleSaveToLookbook = () => {
    const outfitToSave: Outfit = {
      id: `studio-${Date.now()}`,
      title: `${selectedGarment.name} · Studio (${remixRatio <= 35 ? 'Cổ Điển' : 'Remix'})`,
      garmentId: selectedGarment.id,
      primaryColor: primaryColorHex,
      pantColor: pantColorHex,
      accessoryIds: selectedAccessoryIds,
      characterId: selectedCharacter.id,
      hairStyle: selectedHair,
      footwear: 'HAI_SEN',
      eventId: 'EVENT_GRADUATION',
      weatherId: 'WEATHER_HOT',
      styleVibe: selectedStyleId,
      chuanScore: cultureResult.score,
      chatScore: Math.round(50 + (remixRatio * 0.45)),
      cultureStatus: cultureResult.status,
      retainedCharacteristics: cultureResult.retainedCharacteristics,
      sources: cultureResult.sourceIds,
      createdAt: new Date().toISOString(),
      adaptiveNeedCodes: selectedPose === 'WHEELCHAIR' ? ['WHEELCHAIR_SEATED'] : [],
    };
    onSaveOutfit(outfitToSave);
    showToast('Đã lưu bản phối Studio vào Lookbook! ✨');
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="rounded-[30px] border border-[#E6DCCD] bg-[#FFFFFF] p-6 lg:p-8 shadow-[0_4px_24px_-4px_rgba(31,27,24,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#1F1B18] text-[#FFFFFF] text-xl font-bold shadow-xs">
              🎮
            </span>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1B18]">
                STUDIO — Tự tay phối Việt phục
              </h2>
              <p className="text-xs sm:text-sm text-[#736960] mt-0.5">
                Game thời trang phối y phục truyền thống Việt Nam: kéo thả phụ kiện, tùy biến nhân vật và cân bằng phong cách.
              </p>
            </div>
          </div>
        </div>

        {/* Global Studio Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSaveToLookbook}
            className="btn-primary text-xs flex items-center gap-1.5 min-h-[44px]"
          >
            <span>⭐ Lưu Lookbook</span>
          </button>
          {onOpenCompare && (
            <button
              type="button"
              onClick={onOpenCompare}
              className="btn-secondary text-xs flex items-center gap-1.5 min-h-[44px]"
            >
              <span>So sánh</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 3-Column Studio Game Layout: LEFT (Categories) | CENTER (Character Stage) | RIGHT (Controls & Cultural) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CATEGORY NAVIGATION (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-1.5 bg-[#FFFFFF] border border-[#E6DCCD] rounded-[26px] p-3 shadow-[0_4px_20px_-2px_rgba(31,27,24,0.03)]">
          <span className="text-[10px] font-mono uppercase font-bold text-[#736960] tracking-wider block px-3 py-1.5">
            Danh mục phối
          </span>

          <nav aria-label="Danh mục Studio" className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {STUDIO_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`press min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-semibold transition text-left whitespace-nowrap lg:whitespace-normal ${
                    isActive
                      ? 'bg-[#1F1B18] text-[#FFFFFF] shadow-xs'
                      : 'text-[#736960] hover:text-[#1F1B18] hover:bg-[#F1EADF]'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <div className="leading-tight">
                    <span className="text-[10px] opacity-70 block font-mono">{cat.stepNum}</span>
                    <span>{cat.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* CENTER COLUMN: LARGE FASHION CHARACTER STAGE WITH INTERACTIVE SLOTS (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-[30px] border border-[#E6DCCD] bg-[#FFFFFF] p-6 shadow-[0_4px_24px_-4px_rgba(31,27,24,0.04)] relative overflow-hidden">
            {/* Stage Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E6DCCD] text-xs">
              <span className="font-semibold text-[#1F1B18] flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#4F7350] animate-pulse" />
                Sân Khấu Người Mẫu Ảo
              </span>
              <span className="text-[#736960]">
                {selectedGarment.name}
              </span>
            </div>

            {/* Mannequin Container with Interactive Drag & Drop Anchors */}
            <div className="relative aspect-[4/5] w-full max-w-[420px] mx-auto rounded-3xl overflow-hidden bg-[#FBF8F3] border border-[#E6DCCD] shadow-inner">
              <OutfitMockupCanvas
                garment={selectedGarment}
                primaryColor={primaryColorHex}
                pantColor={pantColorHex}
                accessories={activeAccessories}
                character={activeCharacter}
                adaptiveNeedCode={selectedPose === 'WHEELCHAIR' ? 'WHEELCHAIR_SEATED' : undefined}
                styleId={selectedStyleId}
                backgroundTheme={backgroundTheme}
              />

              {/* Interactive Anchor Slots Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Head slot */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnSlot(e, 'head')}
                  className={`pointer-events-auto absolute top-[8%] left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                    activeSlotHighlight === 'head'
                      ? 'bg-amber-400 border-amber-600 text-[#1F1B18] scale-110 ring-4 ring-amber-400/40 animate-pulse'
                      : 'bg-white/80 border-[#E6DCCD] text-[#736960] hover:bg-white'
                  }`}
                >
                  🧢 Đầu / Khăn
                </div>

                {/* Neck slot */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnSlot(e, 'neck')}
                  className={`pointer-events-auto absolute top-[23%] left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                    activeSlotHighlight === 'neck'
                      ? 'bg-amber-400 border-amber-600 text-[#1F1B18] scale-110 ring-4 ring-amber-400/40 animate-pulse'
                      : 'bg-white/80 border-[#E6DCCD] text-[#736960] hover:bg-white'
                  }`}
                >
                  📿 Cổ / Kiềng
                </div>

                {/* Left Hand slot */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnSlot(e, 'hand-left')}
                  className={`pointer-events-auto absolute top-[45%] left-[12%] px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                    activeSlotHighlight === 'hand-left'
                      ? 'bg-amber-400 border-amber-600 text-[#1F1B18] scale-110 ring-4 ring-amber-400/40 animate-pulse'
                      : 'bg-white/80 border-[#E6DCCD] text-[#736960] hover:bg-white'
                  }`}
                >
                  🪭 Quạt
                </div>

                {/* Right Hand slot */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnSlot(e, 'hand-right')}
                  className={`pointer-events-auto absolute top-[45%] right-[12%] px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                    activeSlotHighlight === 'hand-right'
                      ? 'bg-amber-400 border-amber-600 text-[#1F1B18] scale-110 ring-4 ring-amber-400/40 animate-pulse'
                      : 'bg-white/80 border-[#E6DCCD] text-[#736960] hover:bg-white'
                  }`}
                >
                  👜 Túi
                </div>

                {/* Feet slot */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnSlot(e, 'feet')}
                  className={`pointer-events-auto absolute bottom-[8%] left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                    activeSlotHighlight === 'feet'
                      ? 'bg-amber-400 border-amber-600 text-[#1F1B18] scale-110 ring-4 ring-amber-400/40 animate-pulse'
                      : 'bg-white/80 border-[#E6DCCD] text-[#736960] hover:bg-white'
                  }`}
                >
                  👟 Giày / Hài
                </div>
              </div>
            </div>

            {/* SECTION XVIII: TRADITIONAL ↔ REMIX SLIDER WITH CULTURAL THRESHOLD MARKER */}
            <div className="mt-5 pt-4 border-t border-[#E6DCCD] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F1B18]">
                  TRUYỀN THỐNG (0%)
                </span>
                <span className="text-xs font-mono font-bold text-[#1F1B18]">
                  {remixRatio}% REMIX
                </span>
                <span className="text-xs font-bold text-[#1F1B18]">
                  REMIX (100%)
                </span>
              </div>

              {/* Slider Track with Cultural Marker */}
              <div className="relative">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={remixRatio}
                  onChange={(e) => setRemixRatio(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#F1EADF] rounded-lg appearance-none cursor-pointer accent-[#1F1B18]"
                />

                {/* Cultural Threshold Marker at 65% */}
                <div
                  className="absolute top-[-20px] left-[65%] -translate-x-1/2 flex flex-col items-center pointer-events-none"
                  title="Ngưỡng chuyển giao đặc trưng văn hóa"
                >
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#F6ECDA] border border-[#ECDABF] text-[#8A5E17] whitespace-nowrap font-bold">
                    Ngưỡng chuyển giao đặc trưng
                  </span>
                  <span className="text-[#8A5E17] text-xs leading-none">▼</span>
                </div>
              </div>

              <p className="text-[11px] text-[#736960] leading-snug">
                {remixRatio >= 65
                  ? 'Ở mức này, một số đặc trưng truyền thống đã được biến tấu đáng kể (sneaker, kính, phụ kiện Gen Z) tạo phong cách đường phố trẻ trung.'
                  : remixRatio >= 35
                    ? 'Giao thoa hài hòa: Giữ nguyên phom dáng y phục cung đình kết hợp tinh tế cùng phụ kiện tối giản.'
                    : 'Bảo lưu trọn vẹn quy thức điển chế triều đình, màu sắc đoan trang và phụ kiện nghi lễ chuẩn mực.'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STYLING CONTROLS & REAL-TIME CULTURAL CHECK (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Real-time Cultural Check & Non-blocking Mismatch Suggestion */}
          <div className="rounded-[28px] border border-[#E6DCCD] bg-[#FFFFFF] p-5 shadow-[0_4px_20px_-2px_rgba(31,27,24,0.03)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E6DCCD] pb-3">
              <div>
                <h4 className="font-serif font-bold text-base text-[#1F1B18]">
                  Thẩm Định Văn Hóa Thực Thời
                </h4>
                <p className="text-[11px] text-[#736960]">
                  {cultureResult.status === 'KEEP' ? 'Đúng chuẩn y thức cổ truyền' : 'Có gợi ý phối hòa hợp'}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                cultureResult.status === 'KEEP'
                  ? 'bg-[#E5EDE2] text-[#4F7350] border-[#CDE0C9]'
                  : 'bg-[#F6ECDA] text-[#8A5E17] border-[#ECDABF]'
              }`}>
                {cultureResult.score}/100
              </span>
            </div>

            {/* Mismatch non-blocking suggestion */}
            {cultureResult.status !== 'KEEP' && !dismissedSuggestion && (
              <div className="rounded-2xl bg-[#F6ECDA] border border-[#ECDABF] p-3 text-xs text-[#8A5E17] space-y-2">
                <p className="leading-relaxed">
                  💡 {cultureResult.reasons[0] ?? 'Một số phụ kiện có thể tạo cảm giác hiện đại hơn so với lễ trang trọng.'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      // Apply suggested headwear
                      setSelectedAccessoryIds((prev) => [...prev.filter((id) => id !== 'acc-sneaker-retro'), 'acc-khan-dong']);
                      showToast('Đã thay bằng khăn đóng chuẩn lễ!');
                    }}
                    className="press px-3 py-1 bg-[#8A5E17] text-[#FFFFFF] rounded-lg font-bold text-[11px]"
                  >
                    Thử khăn vấn
                  </button>
                  <button
                    type="button"
                    onClick={() => setDismissedSuggestion(true)}
                    className="press px-3 py-1 bg-white border border-[#ECDABF] text-[#8A5E17] rounded-lg font-medium text-[11px]"
                  >
                    Bỏ qua
                  </button>
                </div>
              </div>
            )}

            {/* Equipped list */}
            <div>
              <span className="text-[11px] font-mono uppercase text-[#736960] font-bold block mb-1.5">
                Phụ kiện đang mặc ({activeAccessories.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeAccessories.length === 0 ? (
                  <span className="text-xs text-[#736960] italic">Kéo thả vật phẩm từ khay bên dưới lên người mẫu</span>
                ) : (
                  activeAccessories.map((acc) => (
                    <span
                      key={acc.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F1EADF] text-[#1F1B18] text-xs font-medium border border-[#E6DCCD]"
                    >
                      <span>{acc.name}</span>
                      <button
                        type="button"
                        onClick={() => unequipAccessory(acc.id)}
                        className="hover:text-[#8B1E2B] p-0.5 text-[#736960]"
                        title="Tháo gỡ"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* AI Style Suggestions (Gợi ý phối cho mình) */}
          <div className="rounded-[28px] border border-[#E6DCCD] bg-[#FFFFFF] p-5 shadow-[0_4px_20px_-2px_rgba(31,27,24,0.03)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E6DCCD] pb-2.5">
              <div>
                <h4 className="font-serif font-bold text-base text-[#1F1B18]">
                  Gợi Ý Phối Cho Mình
                </h4>
                <p className="text-[11px] text-[#736960]">
                  5 biến thể phong cách tự động từ AI Stylist
                </p>
              </div>
              <span className="text-xl">✨</span>
            </div>

            <div className="space-y-2">
              {AI_STYLE_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3 rounded-2xl border border-[#E6DCCD] bg-[#FBF8F3] hover:border-[#D8CCBA] transition flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-[#1F1B18] block">{preset.title}</span>
                    <span className="text-[10px] text-[#736960] line-clamp-1">{preset.desc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={preset.apply}
                    className="press px-3 py-1.5 rounded-xl bg-[#1F1B18] text-[#FFFFFF] font-bold text-xs shrink-0"
                  >
                    Áp dụng
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: INTERACTIVE ITEM TRAY ACCORDING TO ACTIVE CATEGORY */}
      <div className="rounded-[30px] border border-[#E6DCCD] bg-[#FFFFFF] p-6 shadow-[0_4px_24px_-4px_rgba(31,27,24,0.04)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6DCCD] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {STUDIO_CATEGORIES.find((c) => c.id === activeCategory)?.icon}
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1F1B18]">
              Khay Vật Phẩm: {STUDIO_CATEGORIES.find((c) => c.id === activeCategory)?.label}
            </h3>
          </div>
          <span className="text-xs text-[#736960]">
            Nhấp hoặc kéo thả trực tiếp lên người mẫu
          </span>
        </div>

        {/* 01 CHARACTER */}
        {activeCategory === 'CHARACTER' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allCharacters.map((char) => (
              <button
                key={char.id}
                type="button"
                onClick={() => {
                  setSelectedCharacter(char);
                  if (char.defaultSkinTone) setSkinToneHex(char.defaultSkinTone);
                  showToast(`Đã chọn mẫu: ${char.name}`);
                }}
                className={`press p-3.5 rounded-[22px] border text-center transition ${
                  selectedCharacter.id === char.id
                    ? 'border-[#1F1B18] bg-[#F1EADF] font-bold shadow-xs'
                    : 'border-[#E6DCCD] bg-[#FBF8F3] hover:border-[#D8CCBA]'
                }`}
              >
                <div className="text-3xl mb-1">{char.gender === 'FEMALE' ? '👩' : char.gender === 'MALE' ? '👨' : '🧑'}</div>
                <div className="text-xs font-bold text-[#1F1B18]">{char.name}</div>
                <div className="text-[10px] text-[#736960]">{char.gender}</div>
              </button>
            ))}
          </div>
        )}

        {/* 02 SHAPE */}
        {activeCategory === 'SHAPE' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BODY_SHAPES.map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => {
                  setSelectedShape(shape.id);
                  showToast(`Đã đổi: ${shape.label}`);
                }}
                className={`press p-4 rounded-[22px] border text-left transition ${
                  selectedShape === shape.id
                    ? 'border-[#1F1B18] bg-[#F1EADF] font-bold shadow-xs'
                    : 'border-[#E6DCCD] bg-[#FBF8F3] hover:border-[#D8CCBA]'
                }`}
              >
                <div className="text-xs font-bold text-[#1F1B18]">{shape.label}</div>
                <div className="text-[10px] text-[#736960] mt-1">{shape.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* 03 SKIN */}
        {activeCategory === 'SKIN' && (
          <div className="flex flex-wrap items-center gap-3">
            {SKIN_TONES.map((tone) => (
              <button
                key={tone.hex}
                type="button"
                onClick={() => {
                  setSkinToneHex(tone.hex);
                  showToast(`Đã đổi tông da: ${tone.label}`);
                }}
                className={`press flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs transition ${
                  skinToneHex.toLowerCase() === tone.hex.toLowerCase()
                    ? 'border-[#1F1B18] bg-[#F1EADF] font-bold ring-1 ring-[#1F1B18]'
                    : 'border-[#E6DCCD] bg-[#FBF8F3] text-[#736960]'
                }`}
              >
                <span className="size-5 rounded-full border border-[#D8CCBA]" style={{ backgroundColor: tone.hex }} />
                <span>{tone.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* 04 HAIR */}
        {activeCategory === 'HAIR' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {HAIR_SILHOUETTES.map((hair) => (
              <button
                key={hair.id}
                type="button"
                onClick={() => {
                  setSelectedHair(hair.id);
                  showToast(`Đã đổi kiểu tóc: ${hair.label}`);
                }}
                className={`press p-3.5 rounded-[22px] border text-center transition ${
                  selectedHair === hair.id
                    ? 'border-[#1F1B18] bg-[#F1EADF] font-bold shadow-xs'
                    : 'border-[#E6DCCD] bg-[#FBF8F3] hover:border-[#D8CCBA]'
                }`}
              >
                <div className="text-2xl mb-1">{hair.icon}</div>
                <div className="text-xs font-bold text-[#1F1B18]">{hair.label}</div>
                <div className="text-[10px] text-[#736960] mt-0.5">{hair.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* 05 POSE */}
        {activeCategory === 'POSE' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {POSES.map((pose) => (
              <button
                key={pose.id}
                type="button"
                onClick={() => {
                  setSelectedPose(pose.id);
                  showToast(`Đã đổi tư thế: ${pose.label}`);
                }}
                className={`press p-4 rounded-[22px] border text-center transition ${
                  selectedPose === pose.id
                    ? 'border-[#1F1B18] bg-[#F1EADF] font-bold shadow-xs'
                    : 'border-[#E6DCCD] bg-[#FBF8F3] hover:border-[#D8CCBA]'
                }`}
              >
                <div className="text-2xl mb-1">{pose.icon}</div>
                <div className="text-xs font-bold text-[#1F1B18]">{pose.label}</div>
              </button>
            ))}
          </div>
        )}

        {/* 06 GARMENT */}
        {activeCategory === 'GARMENT' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {allGarments.map((g) => {
              const isSelected = g.id === selectedGarment.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setSelectedGarment(g);
                    setPrimaryColorHex(g.baseColors[0].hex);
                    showToast(`Đã khoác lên: ${g.name}`);
                  }}
                  className={`press text-left p-4 rounded-[22px] border transition space-y-2 ${
                    isSelected
                      ? 'border-[#1F1B18] bg-[#F1EADF] shadow-xs ring-1 ring-[#1F1B18]'
                      : 'border-[#E6DCCD] bg-[#FBF8F3] hover:border-[#D8CCBA]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#1F1B18]">{g.name}</span>
                    {isSelected && <span className="text-xs font-bold text-[#1F1B18]">✓</span>}
                  </div>
                  <p className="text-[11px] text-[#736960] line-clamp-2 leading-relaxed">{g.culturalMeaning}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* 07 COLOR */}
        {activeCategory === 'COLOR' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#1F1B18] block mb-2">Bảng màu tà áo chính:</span>
              <div className="flex flex-wrap gap-2.5">
                {TRADITIONAL_PALETTE.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => {
                      setPrimaryColorHex(c.hex);
                      showToast(`Đã chọn màu: ${c.name}`);
                    }}
                    className={`press flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
                      primaryColorHex.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-[#1F1B18] bg-[#F1EADF] font-bold ring-1 ring-[#1F1B18]'
                        : 'border-[#E6DCCD] bg-[#FFFFFF] text-[#736960]'
                    }`}
                  >
                    <span className="size-4 rounded-full border border-[#D8CCBA]" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 08 ACCESSORIES (Draggable Cards) */}
        {activeCategory === 'ACCESSORIES' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allAccessories.map((acc) => {
              const isEquipped = selectedAccessoryIds.includes(acc.id);
              const slot = getAccessorySlot(acc);

              return (
                <div
                  key={acc.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, acc)}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    if (isEquipped) {
                      unequipAccessory(acc.id);
                    } else {
                      equipAccessory(acc);
                    }
                  }}
                  className={`press p-3.5 rounded-[22px] border text-left flex items-start justify-between gap-3 cursor-grab active:cursor-grabbing transition ${
                    isEquipped
                      ? 'border-[#1F1B18] bg-[#F1EADF] shadow-xs'
                      : 'border-[#E6DCCD] bg-[#FBF8F3] hover:border-[#D8CCBA]'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-xs text-[#1F1B18] truncate">{acc.name}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white border border-[#E6DCCD] text-[#736960]">
                        Slot: {slot}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#736960] line-clamp-1">{acc.description}</p>
                  </div>
                  <span className={`size-6 rounded-xl grid place-items-center text-xs font-bold shrink-0 ${
                    isEquipped ? 'bg-[#1F1B18] text-[#FFFFFF]' : 'border border-[#E6DCCD] text-[#736960]'
                  }`}>
                    {isEquipped ? '✓' : '+'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* 09 BACKGROUND */}
        {activeCategory === 'BACKGROUND' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BACKGROUND_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setBackgroundTheme(theme.id);
                  showToast(`Đã đổi bối cảnh: ${theme.label}`);
                }}
                className={`press p-4 rounded-[22px] border text-center transition ${
                  backgroundTheme === theme.id
                    ? 'border-[#1F1B18] bg-[#F1EADF] font-bold shadow-xs'
                    : 'border-[#E6DCCD] bg-[#FBF8F3] hover:border-[#D8CCBA]'
                }`}
              >
                <div className="text-3xl mb-1">{theme.icon}</div>
                <div className="text-xs font-bold text-[#1F1B18]">{theme.label}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
