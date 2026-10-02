import React, { useState } from 'react';
import { getEvents, getWeatherContexts } from '../lib/dal';

const FORMALITY_LABELS: Record<string, string> = {
  CASUAL_SMART: 'Thường ngày',
  SEMI_FORMAL: 'Bán trang trọng',
  FORMAL: 'Trang trọng',
  HIGH_FORMAL: 'Đại lễ',
};

const EVENT_ICONS: Record<string, { icon: string; tag: string }> = {
  EVENT_TET: { icon: '🌸', tag: 'Năm mới & Hỷ sự' },
  EVENT_GRADUATION: { icon: '🎓', tag: 'Trang trọng & Ý nghĩa' },
  EVENT_YEARBOOK: { icon: '📸', tag: 'Trẻ trung & Kỷ niệm' },
  EVENT_CULTURAL: { icon: '🏛️', tag: 'Di sản & Lịch sử' },
  EVENT_FESTIVAL: { icon: '🏮', tag: 'Rộn ràng & Dân gian' },
  EVENT_CONCERT: { icon: '🎵', tag: 'Nghệ thuật & Tỏa sáng' },
  EVENT_WEDDING: { icon: '💍', tag: 'Hỷ sự & Đoan trang' },
  EVENT_CASUAL: { icon: '🌿', tag: 'Thảnh thơi & Phố cổ' },
};

const WEATHER_ICONS: Record<string, { icon: string; advice: string }> = {
  WEATHER_HOT: { icon: '☀️', advice: 'Ưu tiên lụa tơ tằm, sa, đũi thoáng mát' },
  WEATHER_COLD: { icon: '❄️', advice: 'Gấm dày, nhiều lớp áo hoặc thêm áo choàng' },
  WEATHER_RAIN: { icon: '🌧️', advice: 'Tà áo cách đất an toàn, tránh ẩm ướt' },
  WEATHER_MILD: { icon: '🍃', advice: 'Thời tiết lý tưởng cho mọi chất liệu' },
};

interface ContextSelectorProps {
  selectedEventId: string;
  selectedWeatherId: string;
  selectedLocation?: string;
  selectedDate?: string;
  onEventChange: (id: string) => void;
  onWeatherChange: (id: string) => void;
  onLocationChange?: (location: string) => void;
  onDateChange?: (date: string) => void;
  onNaturalLanguageSubmit: (text: string) => void;
  isAiParsing?: boolean;
}

export const ContextSelector: React.FC<ContextSelectorProps> = ({
  selectedEventId,
  selectedWeatherId,
  selectedLocation = '',
  selectedDate = '',
  onEventChange,
  onWeatherChange,
  onLocationChange,
  onDateChange,
  onNaturalLanguageSubmit,
  isAiParsing = false,
}) => {
  const [nlInput, setNlInput] = useState('');
  const eventsList = getEvents();
  const weatherList = getWeatherContexts();

  const handleNlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlInput.trim()) return;
    onNaturalLanguageSubmit(nlInput.trim());
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick natural language helper */}
      <div className="rounded-[24px] border border-[#E6DCCD] bg-[#FBF8F3] p-4 sm:p-5 space-y-2">
        <label className="text-xs font-semibold text-[#1F1B18] font-mono uppercase tracking-wider block">
          Điền nhanh bối cảnh bằng một câu:
        </label>
        <form onSubmit={handleNlSubmit} className="relative">
          <input
            type="text"
            value={nlInput}
            onChange={(e) => setNlInput(e.target.value)}
            placeholder="Ví dụ: Đi chụp kỷ yếu ở Hội An trời nắng ấm, muốn áo tấc trẻ trung..."
            disabled={isAiParsing}
            className="w-full bg-[#FFFFFF] border border-[#E6DCCD] focus:border-[#1F1B18] rounded-2xl px-4 py-3 pr-28 text-xs sm:text-sm text-[#1F1B18] placeholder-[#736960]/60 focus:outline-none transition shadow-2xs"
          />
          <button
            type="submit"
            disabled={isAiParsing || !nlInput.trim()}
            className="press absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#1F1B18] hover:bg-[#38322D] disabled:opacity-30 text-[#FFFFFF] text-xs font-bold rounded-xl transition flex items-center gap-1"
          >
            {isAiParsing ? 'Đang đọc…' : 'Điền giúp'}
          </button>
        </form>
      </div>

      {/* 2. Dịp / Sự kiện (Events) with Illustrations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1F1B18] font-mono uppercase tracking-wider">
            1. Bạn sắp tham gia dịp gì? (8 bối cảnh văn hóa)
          </span>
          <span className="text-xs text-[#736960]">Chọn 1 dịp</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {eventsList.map((event) => {
            const isSelected = event.id === selectedEventId;
            const meta = EVENT_ICONS[event.id] ?? { icon: '✨', tag: 'Sự kiện đặc biệt' };
            const formality = FORMALITY_LABELS[event.formality ?? (event as any).formalityLevel] ?? 'Trang trọng';

            return (
              <button
                key={event.id}
                type="button"
                onClick={() => onEventChange(event.id)}
                className={`press text-left p-4 rounded-[22px] border transition relative flex flex-col justify-between space-y-2 min-h-[110px] ${
                  isSelected
                    ? 'border-[#1F1B18] bg-[#F1EADF] shadow-xs ring-1 ring-[#1F1B18]'
                    : 'border-[#E6DCCD] bg-[#FFFFFF] hover:border-[#D8CCBA]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{meta.icon}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E6DCCD] text-[#736960] font-medium">
                    {formality}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1F1B18]">
                    {event.name}
                  </h4>
                  <p className="text-[11px] text-[#736960] line-clamp-1 mt-0.5">
                    {event.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Thời tiết (Weather) with Illustrations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1F1B18] font-mono uppercase tracking-wider">
            2. Dự báo thời tiết tại nơi bạn đến:
          </span>
          <span className="text-xs text-[#736960]">Ảnh hưởng đến chất liệu và phụ kiện</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {weatherList.map((weather) => {
            const isSelected = weather.id === selectedWeatherId;
            const meta = WEATHER_ICONS[weather.id] ?? { icon: '🌤️', advice: 'Thời tiết ôn hòa' };

            return (
              <button
                key={weather.id}
                type="button"
                onClick={() => onWeatherChange(weather.id)}
                className={`press text-left p-3.5 rounded-[20px] border transition space-y-1.5 ${
                  isSelected
                    ? 'border-[#1F1B18] bg-[#F1EADF] shadow-xs ring-1 ring-[#1F1B18]'
                    : 'border-[#E6DCCD] bg-[#FFFFFF] hover:border-[#D8CCBA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{meta.icon}</span>
                  {isSelected && <span className="text-[#1F1B18] text-xs font-bold">✓</span>}
                </div>
                <div className="font-serif font-bold text-xs text-[#1F1B18]">
                  {weather.name}
                </div>
                <p className="text-[10px] text-[#736960] line-clamp-2 leading-snug">
                  {meta.advice}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Địa điểm & Ngày diễn ra (Tùy chọn) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E6DCCD]">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#1F1B18]">
            Địa điểm cụ thể (tùy chọn):
          </label>
          <input
            type="text"
            value={selectedLocation}
            onChange={(e) => onLocationChange?.(e.target.value)}
            placeholder="Hội An, Hà Nội, Cố đô Huế, Trường học..."
            className="w-full bg-[#FFFFFF] border border-[#E6DCCD] rounded-2xl px-3.5 py-2.5 text-xs text-[#1F1B18] focus:border-[#1F1B18] focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#1F1B18]">
            Thời gian tổ chức:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange?.(e.target.value)}
            className="w-full bg-[#FFFFFF] border border-[#E6DCCD] rounded-2xl px-3.5 py-2.5 text-xs text-[#1F1B18] focus:border-[#1F1B18] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
