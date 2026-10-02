import React, { useState } from 'react';

export interface HotspotDetail {
  id: string;
  name: string;
  x: number;
  y: number;
  number: number;
  why: string;
  source: string;
}

export interface HotspotsProps {
  garmentId?: string;
}

export const Hotspots: React.FC<HotspotsProps> = ({ garmentId }) => {
  const [activeHotspot, setActiveHotspot] = useState<HotspotDetail | null>(null);

  const isNguThan = garmentId?.includes('ngu-than');
  const isTuThan = garmentId?.includes('tu-than');

  const hotspots: HotspotDetail[] = [
    {
      id: 'hs-collar',
      number: 1,
      name: isTuThan ? 'Cổ Yếm & Cổ Nhạn' : 'Cổ Lập Lĩnh (Cổ Đứng)',
      x: 200,
      y: 122,
      why: isTuThan
        ? 'Yếm cổ nhạn hoặc cổ xây lót trong thể hiện sự đoan chính, kín đáo nhưng vẫn tạo vẻ thanh thoát cho người phụ nữ Việt xưa.'
        : 'Cổ đứng cao từ 2-3.5cm ôm sát cổ tôn vẻ đoan trang, nghiêm cẩn của người quân tử và phụ nữ đoan chính.',
      source: 'Ngàn năm áo mũ (Trần Quang Đức)',
    },
    {
      id: 'hs-closure',
      number: 2,
      name: isTuThan ? 'Dải Thắt Lưng Lụa' : 'Hệ Thống Ngũ Cúc (Hữu Nhậm)',
      x: 218,
      y: 165,
      why: isTuThan
        ? 'Thắt lưng lụa đào hoặc hoa sen giữ vạt áo gọn gàng khi lao động và tôn nét mềm mại thắt đáy lưng ong.'
        : 'Năm hạt cúc cài chéo sang sườn phải (hữu nhậm) tượng trưng cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín.',
      source: 'Khâm định Đại Nam hội điển sự lệ',
    },
    {
      id: 'hs-hem',
      number: 3,
      name: isNguThan ? 'Gấu Áo Cánh Cung' : 'Tà Áo Thướt Tha',
      x: 180,
      y: 380,
      why: isNguThan
        ? 'Gấu áo ngũ thân được may lượn hình cánh cung mềm mại, khi bước đi tà áo chuyển động uyển chuyển, kín đáo.'
        : 'Tà áo buông thả tự nhiên giúp cử động linh hoạt, giao hòa cùng nhịp sống và thiên nhiên.',
      source: 'Hồ sơ khảo cứu Áo Ngũ Thân (Đại Việt Cổ Phong)',
    },
    {
      id: 'hs-accessories',
      number: 4,
      name: 'Khăn Vấn & Thẻ Bài',
      x: 200,
      y: 65,
      why: 'Khăn vấn đầu tạo nên diện mạo chỉnh tề, thể hiện nếp sống văn hóa xem trọng hình thức trang trọng khi tiếp khách hoặc lễ nghi.',
      source: 'Tài liệu di sản văn hóa trang phục',
    },
  ];

  return (
    <g id="cultural-hotspots">
      {hotspots.map((hs) => {
        const isActive = activeHotspot?.id === hs.id;
        return (
          <g
            key={hs.id}
            transform={`translate(${hs.x}, ${hs.y})`}
            onClick={() => setActiveHotspot(isActive ? null : hs)}
            className="cursor-pointer group"
          >
            {/* Pulse Ring */}
            <circle
              r="10"
              fill="#D4AF37"
              opacity="0.3"
              className="animate-ping"
            />
            {/* Solid Anchor */}
            <circle
              r="8"
              fill="#1F1B18"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              className="group-hover:scale-110 transition-transform"
            />
            <text
              y="3.5"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="8"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              {hs.number}
            </text>
          </g>
        );
      })}

      {/* Popover Display in SVG */}
      {activeHotspot && (
        <foreignObject
          x="40"
          y={activeHotspot.y > 250 ? activeHotspot.y - 140 : activeHotspot.y + 15}
          width="320"
          height="130"
          className="overflow-visible"
        >
          <div className="bg-[#FFFFFF] border border-[#E6DCCD] rounded-2xl p-3.5 shadow-xl text-xs space-y-1.5 animate-rise border-t-2 border-t-[#D4AF37]">
            <div className="flex items-center justify-between border-b border-[#E6DCCD] pb-1.5">
              <span className="font-serif font-bold text-[#1F1B18] flex items-center gap-1.5">
                <span className="size-4.5 rounded-full bg-[#1F1B18] text-[#FFFFFF] text-[10px] grid place-items-center font-bold">
                  {activeHotspot.number}
                </span>
                {activeHotspot.name}
              </span>
              <button
                type="button"
                onClick={() => setActiveHotspot(null)}
                className="text-[#736960] hover:text-[#1F1B18] p-0.5"
              >
                ✕
              </button>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#8A5E17] uppercase tracking-wider font-mono">
                Vì sao?
              </p>
              <p className="text-[11px] text-[#736960] leading-snug mt-0.5">
                {activeHotspot.why}
              </p>
            </div>
            <p className="text-[10px] text-[#736960]/80 italic pt-1 border-t border-[#E6DCCD]/60">
              Nguồn: {activeHotspot.source}
            </p>
          </div>
        </foreignObject>
      )}
    </g>
  );
};
