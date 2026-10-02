import React, { useState } from 'react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  sourceTitle: string;
  sourceCitation: string;
  tag: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    question: 'Theo quy chế y phục cổ truyền Việt Nam, cổ áo Giao Lĩnh (cổ chéo) phải khép theo quy tắc nào?',
    options: [
      { id: 'a', text: 'Vạt phải đè lên vạt trái (Tả nhậm)', isCorrect: false },
      { id: 'b', text: 'Vạt trái đè lên vạt phải (Hữu nhậm)', isCorrect: true },
      { id: 'c', text: 'Tùy theo sở thích của người mặc', isCorrect: false },
      { id: 'd', text: 'Cài cúc đối xứng hai bên cổ', isCorrect: false },
    ],
    explanation: 'Quy tắc "Hữu nhậm" (vạt trái đè lên vạt phải) là biểu trưng của văn minh Hoa Hạ và Đại Việt, tượng trưng cho Dương thuận theo Âm và thuận lẽ tự nhiên. Kiểu "Tả nhậm" (vạt phải đè vạt trái) trong lịch sử chỉ dùng cho người đã khuất khi khâm liệm.',
    sourceTitle: 'Ngàn năm áo mũ',
    sourceCitation: 'Trần Quang Đức (2013), NXB Thế Giới & Nhã Nam, tr. 45-48',
    tag: 'Quy Tắc Điển Chế',
  },
  {
    id: 'q-2',
    question: 'Điểm khác biệt nhận diện quan trọng nhất giữa Áo Tấc và Áo Ngũ Thân tay chẽn là gì?',
    options: [
      { id: 'a', text: 'Số lượng cúc áo', isCorrect: false },
      { id: 'b', text: 'Chất liệu vải may áo', isCorrect: false },
      { id: 'c', text: 'Độ rộng của ống tay áo (tay thụng rộng vs tay ôm sát)', isCorrect: true },
      { id: 'd', text: 'Màu sắc chỉ may', isCorrect: false },
    ],
    explanation: 'Áo Tấc thực chất là áo ngũ thân nhưng có ống tay thụng rộng (dài và rộng từ 1 tấc trở lên), mang tính trang trọng và thường triều. Trong khi đó, Áo Ngũ Thân tay chẽn có ống tay thu hẹp ôm gọn cổ tay để thuận tiện cho sinh hoạt thường nhật.',
    sourceTitle: 'Khâm định Đại Nam hội điển sự lệ',
    sourceCitation: 'Nội các triều Nguyễn (1993), Bản dịch Viện Sử học, NXB Thuận Hóa, Quyển 78',
    tag: 'Cấu Trúc Y Phục',
  },
  {
    id: 'q-3',
    question: 'Áo Nhật Bình thời Nguyễn có dải cổ áo hình gì đặc trưng trước ngực?',
    options: [
      { id: 'a', text: 'Cổ tròn khép kín', isCorrect: false },
      { id: 'b', text: 'Dải cổ áo bản lớn chạy song song tạo thành hình chữ nhật', isCorrect: true },
      { id: 'c', text: 'Cổ trái tim khoét sâu', isCorrect: false },
      { id: 'd', text: 'Cổ cao 3 phân kiểu áo dài hiện đại', isCorrect: false },
    ],
    explanation: 'Tên gọi "Nhật Bình" bắt nguồn từ dải cổ áo thêu hoa văn tinh xảo ghép lại trước ngực tạo thành một khung hình chữ nhật (chữ Nhật 日), là thường phục của Hoàng thái hậu, Hoàng hậu, Công chúa và mệnh phụ triều Nguyễn.',
    sourceTitle: 'Ngàn năm áo mũ',
    sourceCitation: 'Trần Quang Đức (2013), mục Y phục Hậu phi triều Nguyễn, tr. 312-318',
    tag: 'Trang Phục Cung Đình',
  },
  {
    id: 'q-4',
    question: 'Trong ngày đầu năm mới (Tết Nguyên Đán) hoặc đại lễ cưới hỏi, màu sắc nào bị tránh mặc đơn độc theo văn hóa truyền thống?',
    options: [
      { id: 'a', text: 'Đỏ son rực rỡ', isCorrect: false },
      { id: 'b', text: 'Vàng hoa cúc', isCorrect: false },
      { id: 'c', text: 'Đen tuyền toàn thân hoặc trắng toát đơn độc không phụ kiện sắc ấm', isCorrect: true },
      { id: 'd', text: 'Xanh thiên thanh', isCorrect: false },
    ],
    explanation: 'Trong tâm thức dân gian Việt Nam, ngày đầu xuân năm mới và hỷ sự cần nguyên khí sinh sôi, hoan hỷ. Màu đen tuyền hoặc trắng toát đơn độc thường gắn với tang lễ hoặc sự lạnh lẽo, nên thường được phối kèm dải thắt lưng đỏ đào, mấn vàng hoặc phụ kiện tạo sự hài hòa cát tường.',
    sourceTitle: 'Hồ sơ khảo cứu Áo Ngũ Thân và Áo Tấc',
    sourceCitation: 'Nhóm nghiên cứu Đại Việt Cổ Phong (2021)',
    tag: 'Hài Hòa Bối Cảnh',
  },
  {
    id: 'q-5',
    question: 'Tại sao trong thiết kế thời trang thích ứng (Adaptive Fashion), tà áo trước của người ngồi xe lăn cần được cắt ngắn hơn?',
    options: [
      { id: 'a', text: 'Để tiết kiệm vải may áo', isCorrect: false },
      { id: 'b', text: 'Để tránh tà áo cuộn vào bánh xe lăn và không bị đùn gập khó chịu ở đùi khi ngồi lâu', isCorrect: true },
      { id: 'c', text: 'Để dễ khoe giày thêu', isCorrect: false },
      { id: 'd', text: 'Theo luật triều đình quy định', isCorrect: false },
    ],
    explanation: 'Khi ở tư thế ngồi liên tục, trọng tâm dồn xuống và khoảng cách từ thắt lưng đến mặt sàn ngắn lại. Giảm chiều dài tà trước (khoảng 10-15cm) và nâng điểm xẻ sườn giúp người mặc cử động tự chủ, an toàn tuyệt đối trước nan hoa xe lăn mà vẫn giữ trọn phom dáng trang trọng.',
    sourceTitle: 'Universal & Adaptive Fashion Guidelines for Traditional Garments',
    sourceCitation: 'Tài liệu nghiên cứu thiết kế thích ứng y phục truyền thống (2024)',
    tag: 'Thời Trang Thích Ứng',
  },
  {
    id: 'q-6',
    question: 'Phụ kiện "Thẻ bài" trong trang phục truyền thống quan lại và quý tộc triều Nguyễn có ý nghĩa gì?',
    options: [
      { id: 'a', text: 'Chỉ là một món đồ chơi trang trí', isCorrect: false },
      { id: 'b', text: 'Minh chứng phẩm hàm, chức tước hoặc lời chúc cát tường được khắc bằng chữ Hán/Nôm', isCorrect: true },
      { id: 'c', text: 'Dụng cụ giữ ấm cơ thể', isCorrect: false },
      { id: 'd', text: 'Dùng để cài bút lông', isCorrect: false },
    ],
    explanation: 'Thẻ bài là vật phẩm chế tác từ ngà, gỗ quý, đồi mồi hoặc kim loại quý, khắc phẩm trật quan chức hoặc các chữ cát tường như "Đại Lộc", "Phúc Thọ". Người mặc đeo thẻ bài bên ngực áo để thể hiện danh phận và phẩm phục chuẩn tắc.',
    sourceTitle: 'Khâm định Đại Nam hội điển sự lệ',
    sourceCitation: 'Nội các triều Nguyễn (1993), Bản dịch Viện Sử học, tr. 142',
    tag: 'Phụ Kiện Cổ Truyền',
  },
];

export const KnowledgeQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);

    const isCorrect = currentQ.options.find((opt) => opt.id === optionId)?.isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const getRankBadge = (points: number) => {
    const total = QUIZ_QUESTIONS.length;
    const ratio = points / total;
    if (ratio >= 0.85) return { title: 'Bậc Thầy Cổ Phục', color: 'text-[#8A5E17] bg-[#F6ECDA] border-[#E4D1B5]', icon: '👑' };
    if (ratio >= 0.5) return { title: 'Nhà Khảo Cứu Trẻ', color: 'text-[#4F7350] bg-[#E5EDE2] border-[#CDE0C9]', icon: '📜' };
    return { title: 'Mầm Non Y Phục', color: 'text-[#736960] bg-[#F1EADF] border-[#E6DCCD]', icon: '🌱' };
  };

  if (quizFinished) {
    const badge = getRankBadge(score);
    return (
      <div className="bg-[#FFFFFF] border border-[#E6DCCD] rounded-[28px] p-6 sm:p-8 text-center space-y-6 shadow-[0_4px_24px_-4px_rgba(31,27,24,0.04)]">
        <div className="text-4xl">{badge.icon}</div>
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${badge.color}`}>
            {badge.title}
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#1F1B18]">
            Kết Quả Thử Tài Văn Hóa Việt Phục
          </h3>
          <p className="text-sm text-[#736960] mt-1">
            Bạn đã trả lời đúng <strong className="text-[#1F1B18] text-lg">{score}</strong> / {QUIZ_QUESTIONS.length} câu hỏi.
          </p>
        </div>

        <div className="bg-[#FBF8F3] p-5 rounded-2xl border border-[#E6DCCD] text-left text-xs text-[#1F1B18] space-y-2 max-w-lg mx-auto">
          <p className="font-semibold text-[#8A5E17]">💡 Lời khuyên từ Vstyle:</p>
          <p className="leading-relaxed text-[#736960]">
            Việt phục không chỉ là trang phục mà còn là tấm gương phản chiếu tâm hồn, nghi lễ và tri thức thẩm mỹ nghìn năm. Việc hiểu rõ vạt áo, nếp khăn và màu sắc giúp bạn tự tin phối đồ chuẩn xác và đầy cá tính.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="press min-h-[44px] px-6 py-2.5 rounded-2xl bg-[#1F1B18] text-[#FFFFFF] font-bold text-xs hover:bg-[#38322D] transition shadow-xs"
        >
          Thử Lại Từ Đầu
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#E6DCCD] rounded-[28px] p-5 sm:p-7 space-y-5 shadow-[0_4px_24px_-4px_rgba(31,27,24,0.04)]">
      {/* Progress header */}
      <div className="flex items-center justify-between border-b border-[#E6DCCD] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1EADF] text-[#1F1B18] border border-[#E6DCCD]">
            {currentQ.tag}
          </span>
          <span className="text-xs text-[#736960] font-mono">
            Câu {currentIdx + 1} / {QUIZ_QUESTIONS.length}
          </span>
        </div>
        <span className="text-xs font-bold text-[#1F1B18]">
          Điểm: {score}
        </span>
      </div>

      {/* Question */}
      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1F1B18] leading-snug">
        {currentQ.question}
      </h3>

      {/* Options */}
      <div className="space-y-2.5">
        {currentQ.options.map((opt) => {
          let btnStyle = 'bg-[#FBF8F3] border-[#E6DCCD] text-[#1F1B18] hover:border-[#1F1B18] hover:bg-[#F1EADF]';

          if (isAnswered) {
            if (opt.isCorrect) {
              btnStyle = 'bg-[#E5EDE2] border-[#4F7350] text-[#1F1B18] font-semibold ring-1 ring-[#4F7350]';
            } else if (selectedOption === opt.id) {
              btnStyle = 'bg-[#F9EBEA] border-[#8B1E2B] text-[#8B1E2B] ring-1 ring-[#8B1E2B]';
            } else {
              btnStyle = 'opacity-40 bg-[#FBF8F3] border-[#E6DCCD] text-[#736960]';
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(opt.id)}
              className={`w-full text-left p-4 rounded-2xl border text-sm transition flex items-center justify-between gap-3 ${btnStyle}`}
            >
              <span>{opt.text}</span>
              {isAnswered && opt.isCorrect && (
                <span className="text-[#4F7350] font-bold shrink-0">✓ Đúng</span>
              )}
              {isAnswered && selectedOption === opt.id && !opt.isCorrect && (
                <span className="text-[#8B1E2B] font-bold shrink-0">✕ Sai</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation after answered */}
      {isAnswered && (
        <div className="mt-4 p-4.5 rounded-2xl bg-[#FBF8F3] border border-[#E6DCCD] space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F1B18]">
            <span>📖 Giải thích kiến thức:</span>
          </div>
          <p className="text-xs text-[#736960] leading-relaxed">
            {currentQ.explanation}
          </p>
          <div className="pt-2 border-t border-[#E6DCCD] text-[11px] text-[#736960] flex items-center gap-1.5">
            <span className="text-[#736960]">Trích dẫn:</span>
            <span className="italic font-medium text-[#1F1B18]">{currentQ.sourceTitle}</span>
            <span>— {currentQ.sourceCitation}</span>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="press min-h-[44px] px-5 py-2 rounded-2xl bg-[#1F1B18] text-[#FFFFFF] font-bold text-xs hover:bg-[#38322D] transition shadow-xs"
            >
              {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Câu Tiếp Theo →' : 'Xem Kết Quả Tổng Kết 🏆'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
