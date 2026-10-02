import React, { useState } from 'react';
import { Garment } from '../types/fashion';
import { getApprovedGarments, getGarments, getCultureRules, getAllSources } from '../lib/dal';
import { KnowledgeQuiz } from './KnowledgeQuiz';

interface GarmentDiscoveryProps {
  selectedGarmentId: string;
  onSelectGarment: (garment: Garment) => void;
  onViewDetails: (garment: Garment) => void;
  approvedOnly?: boolean;
}

export const GarmentDiscovery: React.FC<GarmentDiscoveryProps> = ({
  selectedGarmentId,
  onSelectGarment,
  onViewDetails,
  approvedOnly = false,
}) => {
  const [subSection, setSubSection] = useState<'GARMENTS' | 'KNOWLEDGE' | 'QUIZ'>('GARMENTS');
  const [filterPeriod, setFilterPeriod] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const garments = approvedOnly ? getApprovedGarments() : getGarments();
  const rules = getCultureRules();
  const sources = getAllSources();
  const verifiedGarmentCount = garments.filter((garment) => garment.status === 'APPROVED' && garment.verified).length;

  const filteredGarments = garments.filter((g) => {
    const matchesPeriod = filterPeriod === 'ALL' || g.period === filterPeriod;
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.vietnameseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.culturalMeaning || g.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPeriod && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Discovery Section Sub-tabs */}
      <div className="flex items-center justify-between border-b border-[#E6DCCD] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSubSection('GARMENTS')}
            className={`press min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition ${
              subSection === 'GARMENTS'
                ? 'bg-[#1F1B18] text-[#FFFFFF] font-bold shadow-xs'
                : 'bg-[#FFFFFF] text-[#736960] hover:text-[#1F1B18] border border-[#E6DCCD]'
            }`}
          >
            👘 Kho Y Phục Cổ Truyền ({garments.length})
          </button>
          <button
            type="button"
            onClick={() => setSubSection('KNOWLEDGE')}
            className={`press min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition ${
              subSection === 'KNOWLEDGE'
                ? 'bg-[#1F1B18] text-[#FFFFFF] font-bold shadow-xs'
                : 'bg-[#FFFFFF] text-[#736960] hover:text-[#1F1B18] border border-[#E6DCCD]'
            }`}
          >
            📜 Cơ Sở Tri Thức & Thư Tịch ({sources.length})
          </button>
          <button
            type="button"
            onClick={() => setSubSection('QUIZ')}
            className={`press min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition ${
              subSection === 'QUIZ'
                ? 'bg-[#1F1B18] text-[#FFFFFF] font-bold shadow-xs'
                : 'bg-[#FFFFFF] text-[#736960] hover:text-[#1F1B18] border border-[#E6DCCD]'
            }`}
          >
            🏆 Đố Vui Việt Phục
          </button>
        </div>
      </div>

      {/* SUB-SECTION 1: GARMENTS CATALOG */}
      {subSection === 'GARMENTS' && (
        <div className="bg-[#FFFFFF] border border-[#E6DCCD] rounded-[28px] p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(31,27,24,0.04)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DCCD] pb-4">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1B18] flex items-center gap-2">
                <span>Khám Phá Y Phục Truyền Thống</span>
                <span className="text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-[#E5EDE2] text-[#4F7350] border border-[#CDE0C9]">
                  {approvedOnly ? 'Chỉ dữ liệu đã duyệt' : `${verifiedGarmentCount} y phục có nguồn tham khảo`}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#736960] mt-1">
                Dữ liệu y phục chuẩn xác theo điển chế triều đình và nghiên cứu phục dựng uy tín
              </p>
            </div>

            {/* Search input */}
            <div className="relative">
              <input
                aria-label="Tìm y phục"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên áo, thời kỳ..."
                className="w-full sm:w-64 bg-[#FBF8F3] border border-[#E6DCCD] rounded-2xl px-3.5 py-2 text-xs text-[#1F1B18] placeholder-[#736960]/60 focus:outline-none focus:border-[#1F1B18]"
              />
            </div>
          </div>

          {/* Period Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'Tất cả thời kỳ' },
              { id: 'NGUYEN', label: 'Triều Nguyễn (Ngũ Thân, Tấc, Nhật Bình)' },
              { id: 'LE_TRAN_LY', label: 'Thời Lê - Trần - Lý (Giao Lĩnh, Đối Khâm)' },
              { id: 'DUONG_DAI', label: 'Đương Đại (Việt phục Remix)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterPeriod(tab.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap transition font-semibold ${
                  filterPeriod === tab.id
                    ? 'bg-[#1F1B18] text-[#FFFFFF]'
                    : 'bg-[#FBF8F3] text-[#736960] hover:text-[#1F1B18] border border-[#E6DCCD]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Garments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGarments.map((g) => {
              const isSelected = g.id === selectedGarmentId;
              const isApproved = g.status === 'APPROVED' && g.verified;

              return (
                <div
                  key={g.id}
                  className={`rounded-[24px] border p-5 flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-[#F1EADF] border-[#1F1B18] shadow-sm ring-1 ring-[#1F1B18]'
                      : 'bg-[#FFFFFF] border-[#E6DCCD] hover:border-[#D8CCBA] shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] text-[#736960] uppercase font-mono tracking-wider font-semibold">
                        {g.era}
                      </span>
                      {isApproved ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E5EDE2] text-[#4F7350] border border-[#CDE0C9]">
                          ✓ Đã Thẩm Định
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F6ECDA] text-[#8A5E17] border border-[#E4D1B5]">
                          ⏳ Đang Thẩm Định
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#1F1B18]">
                      {g.name}
                    </h4>

                    <p className="text-xs text-[#736960] line-clamp-2 leading-relaxed">
                      {g.culturalMeaning || g.description}
                    </p>

                    <div className="pt-1 flex items-center gap-1.5">
                      <span className="text-[10px] text-[#736960]">Màu sắc tiêu biểu:</span>
                      {g.baseColors.slice(0, 5).map((c) => (
                        <span
                          key={c.hex}
                          className="size-3.5 rounded-full border border-[#E6DCCD] inline-block shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-[#E6DCCD] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetails(g)}
                      className="press text-xs font-semibold text-[#736960] hover:text-[#1F1B18] underline underline-offset-2"
                    >
                      Chi tiết & nguồn →
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectGarment(g)}
                      className={`press min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        isSelected
                          ? 'bg-[#1F1B18] text-[#FFFFFF]'
                          : 'bg-[#F1EADF] text-[#1F1B18] hover:bg-[#E6DCCD]'
                      }`}
                    >
                      {isSelected ? 'Đang chọn ✓' : 'Chọn phối đồ'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: KNOWLEDGE BASE & SOURCES */}
      {subSection === 'KNOWLEDGE' && (
        <div className="bg-[#FFFFFF] border border-[#E6DCCD] rounded-[28px] p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(31,27,24,0.04)] space-y-6">
          <div className="border-b border-[#E6DCCD] pb-4">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1B18]">
              Cơ Sở Tri Thức Văn Hóa & Thư Tịch Khảo Cứu
            </h3>
            <p className="text-xs sm:text-sm text-[#736960] mt-1 max-w-2xl leading-relaxed">
              Vstyle cam kết tính trung thực lịch sử (Data Honesty): mọi quy tắc phối đồ, kiêng kỵ màu sắc hay quy chuẩn may đo đều có nguồn khảo cứu được thẩm định bởi ban cố vấn văn hóa.
            </p>
          </div>

          {/* Sources list */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F1B18] font-mono">
              Thư Tịch & Ấn Phẩm Tham Chiếu:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sources.map((src) => (
                <div key={src.id} className="bg-[#FBF8F3] p-4.5 rounded-[22px] border border-[#E6DCCD] space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#1F1B18] leading-snug">{src.title}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E5EDE2] text-[#4F7350] border border-[#CDE0C9] shrink-0">
                      ✓ Đã Thẩm Định
                    </span>
                  </div>
                  <p className="text-[11px] text-[#736960]">
                    Tác giả / Cơ quan: <strong className="text-[#1F1B18]">{src.author}</strong> ({src.publisher}, {src.year})
                  </p>
                  <p className="text-[11px] text-[#736960] leading-relaxed">
                    {src.notes}
                  </p>
                  {src.reviewedBy && (
                    <div className="text-[10px] text-[#736960] pt-1.5 border-t border-[#E6DCCD]/80">
                      Cố vấn thẩm định: <span className="font-semibold text-[#1F1B18]">{src.reviewedBy}</span> ({src.reviewedAt})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Rules Overview */}
          <div className="space-y-3 pt-4 border-t border-[#E6DCCD]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F1B18] font-mono">
              Bộ Quy Tắc Điển Chế & Hòa Nhập Văn Hóa ({rules.length} quy tắc):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {rules.map((rule) => (
                <div key={rule.id} className="bg-[#FBF8F3] p-4 rounded-[20px] border border-[#E6DCCD] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1F1B18]">{rule.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      rule.severity === 'WARNING'
                        ? 'bg-[#F9EBEA] text-[#8B1E2B] border border-[#F0CDCB]'
                        : 'bg-[#F6ECDA] text-[#8A5E17] border border-[#E4D1B5]'
                    }`}>
                      {rule.severity === 'WARNING' ? 'Bắt buộc' : 'Khuyến nghị'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#736960] leading-relaxed">{rule.description}</p>
                  <p className="text-[10px] text-[#736960] font-mono">Mã nguồn: {rule.sourceIds.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: QUIZ */}
      {subSection === 'QUIZ' && (
        <KnowledgeQuiz />
      )}
    </div>
  );
};
