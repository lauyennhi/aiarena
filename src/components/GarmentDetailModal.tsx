import React from 'react';
import { Garment } from '../types/fashion';
import { getAllSources } from '../lib/dal';
import { Dialog } from './ui/Dialog';

interface GarmentDetailModalProps {
  garment: Garment | null;
  onClose: () => void;
  onSelectForStyling?: (garment: Garment) => void;
}

export const GarmentDetailModal: React.FC<GarmentDetailModalProps> = ({
  garment,
  onClose,
  onSelectForStyling,
}) => {
  if (!garment) return null;

  const sourcesList = getAllSources();
  const sources = sourcesList.filter((s) => garment.sourceIds.includes(s.id));
  const isApproved = garment.status === 'APPROVED' && garment.verified;

  return (
    <Dialog bare title={garment.name} size="2xl" onClose={onClose}>
      <div className="bg-[#FFFFFF] border border-[#E6DCCD] rounded-t-[30px] sm:rounded-[30px] w-full p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E6DCCD] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isApproved
                  ? 'bg-[#E5EDE2] text-[#4F7350] border border-[#CDE0C9]'
                  : 'bg-[#F6ECDA] text-[#8A5E17] border border-[#E4D1B5]'
              }`}>
                {isApproved ? '✓ Đã Thẩm Định Văn Hóa' : '⏳ Đang Thẩm Định'}
              </span>
              <span className="text-xs text-[#736960] font-mono">{garment.era}</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1B18] mt-1.5">
              {garment.name}
            </h3>
            <p className="text-xs text-[#736960] italic">{garment.vietnameseTitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="press grid size-10 place-items-center rounded-2xl text-[#736960] hover:text-[#1F1B18] hover:bg-[#F1EADF] transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1 text-xs">
          {/* Meaning & Historical Significance */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1F1B18] text-xs uppercase tracking-wider font-mono">
              Nguồn gốc & ý nghĩa
            </h4>
            <p className="text-[#736960] leading-relaxed bg-[#FBF8F3] p-4 rounded-2xl border border-[#E6DCCD]">
              {garment.culturalMeaning || garment.description}
            </p>
          </div>

          {/* Structural Characteristics */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1F1B18] text-xs uppercase tracking-wider font-mono">
              Đặc trưng kết cấu
            </h4>
            <ul className="space-y-2 text-[#736960]">
              {garment.characteristics.map((char, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#FBF8F3] p-3 rounded-2xl border border-[#E6DCCD]">
                  <span className="text-[#4F7350] font-bold mt-0.5">✦</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Non-negotiable Cultural Rules */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#8B1E2B] text-xs uppercase tracking-wider font-mono">
              Quy tắc không được làm sai
            </h4>
            <ul className="space-y-2 text-[#8B1E2B]">
              {garment.nonNegotiables.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#F9EBEA] p-3 rounded-2xl border border-[#F0CDCB]">
                  <span aria-hidden="true" className="font-bold mt-0.5">▲</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Base Colors */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1F1B18] text-xs uppercase tracking-wider font-mono">
              Bảng màu đã duyệt
            </h4>
            <div className="flex flex-wrap gap-2">
              {garment.baseColors.map((color) => (
                <div
                  key={color.hex}
                  className="flex items-center gap-2 bg-[#FBF8F3] px-3.5 py-1.5 rounded-xl border border-[#E6DCCD] text-xs text-[#1F1B18]"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-[#E6DCCD] shadow-2xs"
                    style={{ backgroundColor: color.hex }}
                  ></span>
                  <span>{color.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Sources */}
          {sources.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#E6DCCD]">
              <h4 className="font-bold text-[#1F1B18] text-xs uppercase tracking-wider font-mono">
                Nguồn khảo cứu
              </h4>
              <div className="space-y-2">
                {sources.map((src) => (
                  <div key={src.id} className="text-xs bg-[#FBF8F3] p-3.5 rounded-2xl border border-[#E6DCCD]">
                    <div className="font-bold text-[#1F1B18]">{src.title}</div>
                    <div className="text-[11px] text-[#736960] mt-0.5">
                      NXB: {src.publisher} • Thẩm định: <span className="text-[#4F7350] font-semibold">{src.reviewedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6DCCD]">
          <button
            onClick={onClose}
            className="press px-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#E6DCCD] hover:bg-[#F1EADF] text-[#1F1B18] text-xs font-semibold"
          >
            Đóng
          </button>
          {onSelectForStyling && (
            <button
              onClick={() => {
                onSelectForStyling(garment);
                onClose();
              }}
              className="press min-h-[44px] px-6 py-2.5 rounded-2xl bg-[#1F1B18] hover:bg-[#38322D] text-[#FFFFFF] font-bold text-xs shadow-xs transition"
            >
              Phối với y phục này →
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
};
