import React, { useMemo, useState } from 'react';
import type { CharacterItem, FunctionalNeedCode } from '../types/fashion';
import { OutfitMockupCanvas } from './OutfitMockupCanvas';
import { Dialog } from './ui/Dialog';
import { SealStamp } from './ui/SealStamp';
import { checkCulture } from '../lib/culture/ruleEngine';
import { calculateStyleScore } from '../lib/recommendation/engine';
import { evaluateColorHarmony } from '../lib/color/harmony';
import { getApprovedAccessories, getApprovedGarments, getEventById } from '../lib/dal';
import { styleLabel } from '../lib/styles';

export interface LookSnapshot {
  id: string;
  title: string;
  garmentId: string;
  primaryColor: string;
  pantColor: string;
  accessoryIds: string[];
  eventId: string;
  styleVibe: string;
  adaptiveNeedCodes?: FunctionalNeedCode[];
}

interface CompareViewProps {
  looks: LookSnapshot[];
  character: CharacterItem;
  onClose: () => void;
  onUseLook?: (look: LookSnapshot) => void;
}

const garmentsById = new Map(getApprovedGarments().map((garment) => [garment.id, garment]));
const accessoriesById = new Map(getApprovedAccessories().map((accessory) => [accessory.id, accessory]));

function evaluate(look: LookSnapshot) {
  const garment = garmentsById.get(look.garmentId);
  if (!garment) return null;
  const accessories = look.accessoryIds.flatMap((id) => {
    const accessory = accessoriesById.get(id);
    return accessory ? [accessory] : [];
  });
  const event = getEventById(look.eventId);
  const culture = checkCulture({
    garmentId: garment.id,
    accessoryIds: look.accessoryIds,
    eventId: look.eventId,
    primaryColor: look.primaryColor,
    adaptiveNeedCode: look.adaptiveNeedCodes?.[0],
  });
  const style = calculateStyleScore(garment, look.primaryColor, look.accessoryIds, look.eventId, look.styleVibe);
  const harmony = evaluateColorHarmony({
    primaryColor: look.primaryColor,
    pantColor: look.pantColor,
    accessoryColors: accessories.map((accessory) => accessory.colors[0]).filter(Boolean),
    eventAdvice: event?.culturalAdvice,
    eventName: event?.name,
  });
  const colorName = garment.baseColors.find((color) => color.hex.toLowerCase() === look.primaryColor.toLowerCase())?.name ?? look.primaryColor;
  return { garment, accessories, event, culture, style, harmony, colorName };
}

export const CompareView: React.FC<CompareViewProps> = ({ looks, character, onClose, onUseLook }) => {
  const [leftId, setLeftId] = useState(looks[0]?.id ?? '');
  const [rightId, setRightId] = useState(looks[1]?.id ?? looks[0]?.id ?? '');
  const left = looks.find((look) => look.id === leftId);
  const right = looks.find((look) => look.id === rightId);
  const leftResult = useMemo(() => (left ? evaluate(left) : null), [left]);
  const rightResult = useMemo(() => (right ? evaluate(right) : null), [right]);

  const verdict = (() => {
    if (!leftResult || !rightResult || !left || !right || left.id === right.id) return null;
    const parts: string[] = [];
    const cultureWinner = leftResult.culture.score === rightResult.culture.score ? null : leftResult.culture.score > rightResult.culture.score ? left : right;
    const styleWinner = leftResult.style.score === rightResult.style.score ? null : leftResult.style.score > rightResult.style.score ? left : right;
    const harmonyWinner = leftResult.harmony.score === rightResult.harmony.score ? null : leftResult.harmony.score > rightResult.harmony.score ? left : right;
    parts.push(cultureWinner ? `"${cultureWinner.title}" giữ chuẩn văn hóa tốt hơn.` : 'Hai bản phối ngang nhau về chuẩn văn hóa.');
    parts.push(styleWinner ? `"${styleWinner.title}" hợp gu và dịp hơn.` : 'Điểm Chất theo gu tương đương.');
    parts.push(harmonyWinner ? `"${harmonyWinner.title}" có màu sắc hài hòa hơn.` : 'Màu sắc hài hòa tương đương.');
    return parts.join(' ');
  })();

  const renderColumn = (
    look: LookSnapshot | undefined,
    result: ReturnType<typeof evaluate>,
    selectedId: string,
    onSelect: (id: string) => void,
    label: string,
  ) => (
    <div className="space-y-4 rounded-[24px] border border-[#E6DCCD] bg-[#FBF8F3] p-5 shadow-xs">
      <label className="block text-xs text-[#736960]">
        <span className="mb-1 block font-semibold text-[#1F1B18]">{label}</span>
        <select
          value={selectedId}
          onChange={(event) => onSelect(event.target.value)}
          className="min-h-11 w-full rounded-xl border border-[#E6DCCD] bg-[#FFFFFF] px-3 text-sm text-[#1F1B18] focus:border-[#1F1B18] focus:outline-none"
        >
          {looks.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label>
      {look && result ? (
        <>
          <div className="mx-auto max-w-[260px] rounded-2xl overflow-hidden border border-[#E6DCCD] bg-[#FFFFFF] shadow-2xs">
            <OutfitMockupCanvas
              garment={result.garment}
              primaryColor={look.primaryColor}
              pantColor={look.pantColor}
              accessories={result.accessories}
              character={character}
              adaptiveNeedCodes={look.adaptiveNeedCodes}
              styleId={look.styleVibe}
              compact
            />
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-bold text-[#1F1B18]">{result.garment.name}</h3>
              <p className="text-xs text-[#736960]">{result.colorName} · {styleLabel(look.styleVibe)} · {result.event?.name}</p>
            </div>
            <SealStamp score={result.culture.score} status={result.culture.status} size="sm" />
          </div>
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              ['Chuẩn', result.culture.score],
              ['Chất', result.style.score],
              ['Màu', result.harmony.score],
            ].map(([name, value]) => (
              <div key={name} className="rounded-xl border border-[#E6DCCD] bg-[#FFFFFF] p-2.5 shadow-2xs">
                <dt className="text-[11px] text-[#736960]">{name}</dt>
                <dd className="font-serif text-xl font-bold text-[#1F1B18] tabular">{value}</dd>
              </div>
            ))}
          </dl>
          <ul className="space-y-1 text-xs leading-relaxed text-[#736960]">
            {[...result.culture.reasons.slice(0, 1), ...result.harmony.notes.slice(0, 1).map((note) => note.text)].map((text) => (
              <li key={text} className="flex gap-2"><span aria-hidden="true" className="text-[#8A5E17]">·</span>{text}</li>
            ))}
          </ul>
          {onUseLook && (
            <button
              type="button"
              onClick={() => onUseLook(look)}
              className="press min-h-[44px] w-full rounded-2xl bg-[#1F1B18] text-xs font-bold text-[#FFFFFF] hover:bg-[#38322D] transition shadow-xs"
            >
              Chọn bản phối này
            </button>
          )}
        </>
      ) : (
        <p className="py-12 text-center text-xs text-[#736960]">Không tìm thấy bản phối</p>
      )}
    </div>
  );

  return (
    <Dialog size="xl" title="So sánh bản phối" description="Đặt hai phương án cạnh nhau để so về Chuẩn, Chất và Màu trước khi quyết định" onClose={onClose}>
      <div className="space-y-6">
        {verdict && (
          <aside aria-label="Nhận xét so sánh" className="rounded-2xl border border-[#E6DCCD] bg-[#F1EADF] p-4 text-xs leading-relaxed text-[#1F1B18]">
            <strong className="block text-[11px] uppercase tracking-wider text-[#8A5E17] font-mono">Nhận xét tổng quan</strong>
            <p className="mt-1">{verdict}</p>
          </aside>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderColumn(left, leftResult, leftId, setLeftId, 'Phương án A')}
          {renderColumn(right, rightResult, rightId, setRightId, 'Phương án B')}
        </div>
      </div>
    </Dialog>
  );
};
