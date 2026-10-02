import React, { useState, useRef } from 'react';

interface HomeHeroProps {
  onRunStylist: (prompt: string) => void;
  onPickPhoto: (file: File) => void;
  photoPreviewUrl: string | null;
  isParsing?: boolean;
  onSelectStudio: () => void;
  onSelect9Steps: () => void;
  onSelectDiscovery: () => void;
  onSelectAdaptive: () => void;
}

const EXAMPLE_PROMPTS = [
  'Chụp kỷ yếu ở Hội An, trời nắng, thích màu xanh và muốn hiện đại một chút.',
  'Dự đám cưới bạn thân ở Hà Nội mùa thu, phong cách tối giản thanh lịch.',
  'Lễ tốt nghiệp đại học, muốn trang trọng nhưng trẻ trung với Áo Tấc.',
  'Đi lễ hội Đền Hùng, ngồi xe lăn, cần áo ngũ thân thoáng mát, dễ vận động.',
];

export const HomeHero: React.FC<HomeHeroProps> = ({
  onRunStylist,
  onPickPhoto,
  photoPreviewUrl,
  isParsing = false,
  onSelectStudio,
  onSelect9Steps,
  onSelectDiscovery,
  onSelectAdaptive,
}) => {
  const [promptText, setPromptText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    onRunStylist(promptText.trim());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPickPhoto(file);
    }
  };

  return (
    <section className="space-y-12">
      {/* Editorial Hero Block */}
      <div className="relative rounded-[32px] border border-[#E6DCCD] bg-[#FFFFFF] p-6 sm:p-10 lg:p-14 shadow-[0_4px_24px_-4px_rgba(31,27,24,0.04)] text-center space-y-6 overflow-hidden">
        {/* Editorial Title */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#F1EADF] text-[#736960] text-xs font-semibold tracking-wide uppercase font-mono">
            Nền Tảng Phối Việt Phục Thông Minh
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1F1B18] tracking-tight leading-[1.12]">
            Mặc Việt phục,<br />theo cách của bạn.
          </h1>
          <p className="text-base sm:text-lg text-[#736960] max-w-xl mx-auto leading-relaxed font-sans">
            Kể dịp bạn sắp đi. Gemini gợi ý phối và giải thích vì sao.
          </p>
        </div>

        {/* Large Natural Language Input Box */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-3">
          <div className="relative rounded-[26px] border border-[#E6DCCD] bg-[#FBF8F3] p-2 sm:p-2.5 shadow-inner focus-within:border-[#1F1B18] focus-within:ring-2 focus-within:ring-[#1F1B18]/10 transition">
            <textarea
              rows={2}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Kể cho Vstyle nghe bạn muốn mặc gì..."
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-[#1F1B18] placeholder-[#736960]/60 resize-none focus:outline-none font-sans"
              aria-label="Nhập mô tả nhu cầu phối đồ"
            />

            {photoPreviewUrl && (
              <div className="flex items-center gap-2 px-3 py-1 mb-2 bg-[#FFFFFF] rounded-xl border border-[#E6DCCD] w-fit text-xs text-[#1F1B18]">
                <img src={photoPreviewUrl} alt="Ảnh cảm hứng" className="size-6 rounded-md object-cover" />
                <span>Đã đính kèm ảnh cảm hứng</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E6DCCD]/60 px-1">
              {/* Secondary Action: Add photo inspiration */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="press min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#736960] hover:text-[#1F1B18] hover:bg-[#F1EADF] transition flex items-center gap-1.5"
                >
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span>Thêm ảnh cảm hứng</span>
                </button>
              </div>

              {/* Primary CTA: Phối giúp mình */}
              <button
                type="submit"
                disabled={isParsing || !promptText.trim()}
                className="press min-h-[44px] px-6 py-2 rounded-2xl bg-[#1F1B18] text-[#FFFFFF] text-sm font-semibold hover:bg-[#38322D] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-xs"
              >
                {isParsing ? (
                  <>
                    <span className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Gemini đang đọc…</span>
                  </>
                ) : (
                  <span>Phối giúp mình</span>
                )}
              </button>
            </div>
          </div>

          {/* Example prompt pills */}
          <div className="text-left space-y-1.5 pt-1">
            <span className="text-[11px] font-medium text-[#736960] block px-1">
              Gợi ý mẫu để thử nhanh:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPromptText(ex)}
                  className="press text-left text-xs bg-[#F1EADF]/70 hover:bg-[#F1EADF] text-[#1F1B18] px-3 py-1.5 rounded-xl border border-[#E6DCCD] transition line-clamp-1"
                >
                  “{ex}”
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* SECTION: BẠN MUỐN KHÁM PHÁ GÌ? (4 cards ngang desktop / 2x2 mobile) */}
      <div className="space-y-4 pt-2">
        <div className="text-center sm:text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1B18]">
            Bạn muốn khám phá gì?
          </h2>
          <p className="text-xs sm:text-sm text-[#736960] mt-1">
            Chọn phương thức sáng tạo phù hợp nhất với phong cách và nhu cầu của bạn.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: Phối đồ AI */}
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById('hero-prompt-input');
              if (input) {
                input.focus();
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else {
                onSelect9Steps();
              }
            }}
            className="group press rounded-[26px] border border-[#E6DCCD] bg-[#FFFFFF] p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(31,27,24,0.03)] flex flex-col justify-between text-left space-y-3 transition hover:border-[#D8CCBA] hover:shadow-sm"
          >
            <div className="space-y-2.5">
              <div className="size-11 rounded-2xl bg-[#F6ECDA] border border-[#ECDABF] grid place-items-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                <svg className="size-6 text-[#8A5E17]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1B18] group-hover:text-[#8A5E17] transition-colors">
                  Phối đồ AI
                </h3>
                <p className="text-[11px] sm:text-xs text-[#736960] leading-relaxed mt-1">
                  Kể một câu, nhận ngay gợi ý
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F1B18] group-hover:translate-x-0.5 transition-transform pt-1">
              Thử ngay →
            </span>
          </button>

          {/* Card 2: Studio */}
          <button
            type="button"
            onClick={onSelectStudio}
            className="group press rounded-[26px] border border-[#E6DCCD] bg-[#FFFFFF] p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(31,27,24,0.03)] flex flex-col justify-between text-left space-y-3 transition hover:border-[#D8CCBA] hover:shadow-sm"
          >
            <div className="space-y-2.5">
              <div className="size-11 rounded-2xl bg-[#E5EDE2] border border-[#CDE0C9] grid place-items-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                <svg className="size-6 text-[#4F7350]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1B18] group-hover:text-[#4F7350] transition-colors">
                  Studio
                </h3>
                <p className="text-[11px] sm:text-xs text-[#736960] leading-relaxed mt-1">
                  Tự tay phối như game thời trang
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F1B18] group-hover:translate-x-0.5 transition-transform pt-1">
              Vào Studio →
            </span>
          </button>

          {/* Card 3: Adaptive Fashion */}
          <button
            type="button"
            onClick={onSelectAdaptive}
            className="group press rounded-[26px] border border-[#E6DCCD] bg-[#FFFFFF] p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(31,27,24,0.03)] flex flex-col justify-between text-left space-y-3 transition hover:border-[#D8CCBA] hover:shadow-sm"
          >
            <div className="space-y-2.5">
              <div className="size-11 rounded-2xl bg-[#F1EADF] border border-[#E6DCCD] grid place-items-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                <svg className="size-6 text-[#736960]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="4.5" r="2.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l4 3m-4-3l-3 4m3-1l-3-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1B18] group-hover:text-[#8A5E17] transition-colors">
                  Adaptive Fashion
                </h3>
                <p className="text-[11px] sm:text-xs text-[#736960] leading-relaxed mt-1">
                  Điều chỉnh theo nhu cầu cơ thể
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F1B18] group-hover:translate-x-0.5 transition-transform pt-1">
              Xưởng may đo →
            </span>
          </button>

          {/* Card 4: Kiến thức */}
          <button
            type="button"
            onClick={onSelectDiscovery}
            className="group press rounded-[26px] border border-[#E6DCCD] bg-[#FFFFFF] p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(31,27,24,0.03)] flex flex-col justify-between text-left space-y-3 transition hover:border-[#D8CCBA] hover:shadow-sm"
          >
            <div className="space-y-2.5">
              <div className="size-11 rounded-2xl bg-[#FBF0EE] border border-[#F2D7D3] grid place-items-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                <svg className="size-6 text-[#8B1E2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1B18] group-hover:text-[#8B1E2B] transition-colors">
                  Kiến thức
                </h3>
                <p className="text-[11px] sm:text-xs text-[#736960] leading-relaxed mt-1">
                  Tìm hiểu Việt phục + Quiz
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F1B18] group-hover:translate-x-0.5 transition-transform pt-1">
              Khám phá →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
