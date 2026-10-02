import React, { useState } from 'react';
import { CultureCheckResult, Source } from '../types/fashion';
import { getAllSources } from '../lib/dal';
import { Dialog } from './ui/Dialog';
import { SealStamp } from './ui/SealStamp';

interface CultureCheckCardProps {
  result: CultureCheckResult;
}

export const CultureCheckCard: React.FC<CultureCheckCardProps> = ({ result }) => {
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  const sourcesList = getAllSources();
  const verifiedSources = sourcesList.filter((s) => result.sourceIds.includes(s.id));

  const statusConfig = {
    KEEP: {
      label: 'Giữ chuẩn',
      badgeColor: 'bg-[#E5EDE2] text-[#4F7350] border-[#CDE0C9]',
      description: 'Bảo tồn trọn vẹn kết cấu và triết lý y phục truyền thống Việt Nam.',
    },
    CONSIDER: {
      label: 'Cân nhắc bối cảnh',
      badgeColor: 'bg-[#F6ECDA] text-[#8A5E17] border-[#ECDABF]',
      description: 'Có yếu tố biến tấu đương đại hoặc phụ kiện cần lưu ý bối cảnh xuất hiện.',
    },
    WARNING: {
      label: 'Cần lưu ý văn hóa',
      badgeColor: 'bg-[#F9EBEA] text-[#8B1E2B] border-[#F0CDCB]',
      description: 'Phối này có điểm xung đột trực tiếp với quy thức trang phục cổ truyền đã được xác thực.',
    },
  }[result.status];

  return (
    <div className="rounded-[28px] border border-[#E6DCCD] bg-[#FFFFFF] p-6 shadow-[0_4px_20px_-2px_rgba(31,27,24,0.03)] flex flex-col gap-4">
      {/* Header with Chuẩn Score Gauge */}
      <div className="flex items-center justify-between border-b border-[#E6DCCD] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-[#1F1B18]">Chuẩn văn hóa</h3>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${statusConfig.badgeColor}`}>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-xs text-[#736960] mt-1">
            Bộ quy tắc có nguồn của Vstyle chấm — bảo đảm tính chân thực lịch sử.
          </p>
        </div>

        <SealStamp score={result.score} status={result.status} size="md" />
      </div>

      {/* Rules evaluation */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#1F1B18] uppercase tracking-wider font-mono">
          Đánh giá điển chế
        </div>
        <ul className="space-y-1.5">
          {result.reasons.map((reason, idx) => (
            <li
              key={idx}
              className={`text-xs p-3 rounded-2xl border flex items-start gap-2.5 leading-relaxed ${
                result.status === 'WARNING'
                  ? 'bg-[#F9EBEA] border-[#F0CDCB] text-[#8B1E2B]'
                  : result.status === 'CONSIDER'
                    ? 'bg-[#F6ECDA] border-[#ECDABF] text-[#8A5E17]'
                    : 'bg-[#F1EADF]/60 border-[#E6DCCD] text-[#1F1B18]'
              }`}
            >
              <span className="font-bold text-sm shrink-0 leading-none">
                {result.status === 'WARNING' ? '⚠️' : result.status === 'CONSIDER' ? 'ℹ️' : '✓'}
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Verified characteristics */}
      {result.retainedCharacteristics.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-[#E6DCCD]">
          <span className="text-xs font-semibold text-[#736960] block">
            Đặc trưng văn hóa được bảo tồn:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {result.retainedCharacteristics.map((trait, idx) => (
              <span
                key={idx}
                className="text-[11px] px-3 py-1 bg-[#E5EDE2] text-[#4F7350] border border-[#CDE0C9] rounded-xl font-medium"
              >
                ✓ {trait}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Historical citations */}
      <div className="pt-2 border-t border-[#E6DCCD] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#736960]">
          <span>Nguồn khảo cứu:</span>
          {verifiedSources.map((source) => (
            <button
              key={source.id}
              type="button"
              onClick={() => setSelectedSource(source)}
              className="text-[#1F1B18] font-semibold underline hover:text-[#736960] transition"
            >
              {source.title.split('-')[0].trim()}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-[#736960] font-mono">
          {verifiedSources.length} nguồn tham khảo
        </span>
      </div>

      {/* Source Citation Modal */}
      {selectedSource && (
        <Dialog bare title="Nguồn khảo cứu văn hóa" size="md" onClose={() => setSelectedSource(null)}>
          <div className="p-6 bg-[#FFFFFF] rounded-[28px] space-y-4">
            <div className="flex items-start justify-between border-b border-[#E6DCCD] pb-3">
              <div>
                <span className="text-[10px] text-[#4F7350] font-mono uppercase font-bold tracking-wider">
                  Nguồn Tham Khảo
                </span>
                <h4 className="font-serif text-lg font-bold text-[#1F1B18]">
                  {selectedSource.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSource(null)}
                className="text-[#736960] hover:text-[#1F1B18] p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#736960] leading-relaxed">
              <p><strong>Tác giả:</strong> {selectedSource.author ?? 'N/A'}</p>
              <p><strong>NXB / Cơ quan:</strong> {selectedSource.publisher} ({selectedSource.year})</p>
              <p className="bg-[#F1EADF] p-3 rounded-2xl border border-[#E6DCCD] text-[#1F1B18]">
                {selectedSource.notes}
              </p>
              {selectedSource.reviewedBy && (
                <p className="text-[11px] text-[#736960]">
                  Thẩm định bởi: <strong>{selectedSource.reviewedBy}</strong> ({selectedSource.reviewedAt})
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedSource(null)}
                className="btn-primary text-xs py-2 px-5 min-h-[40px]"
              >
                Đóng
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
