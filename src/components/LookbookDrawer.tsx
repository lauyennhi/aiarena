import React, { useState, useEffect } from 'react';
import { Outfit } from '../types/fashion';
import {
  getSavedOutfits,
  deleteOutfitFromLookbook,
  renameOutfitInLookbook,
} from '../lib/storage/lookbook';
import { getGarments } from '../lib/dal';
import { Dialog } from './ui/Dialog';

interface LookbookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadOutfit: (outfit: Outfit) => void;
  onShareOutfit: (outfit: Outfit) => void;
}

export const LookbookDrawer: React.FC<LookbookDrawerProps> = ({
  isOpen,
  onClose,
  onLoadOutfit,
  onShareOutfit,
}) => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const garments = getGarments();

  useEffect(() => {
    if (isOpen) {
      setOutfits(getSavedOutfits());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    deleteOutfitFromLookbook(id);
    setOutfits(getSavedOutfits());
  };

  const handleStartRename = (outfit: Outfit) => {
    setEditingId(outfit.id);
    setNewTitle(outfit.title);
  };

  const handleSaveRename = (id: string) => {
    if (newTitle.trim()) {
      renameOutfitInLookbook(id, newTitle.trim());
      setOutfits(getSavedOutfits());
    }
    setEditingId(null);
  };

  return (
    <Dialog variant="drawer" title="Lookbook của bạn" description={`${outfits.length} bản phối đã lưu trên thiết bị này`} onClose={onClose}>
      <div className="flex flex-col">
        {/* Outfits List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-3.5">
          {outfits.length === 0 ? (
            <div className="text-center py-16 text-[#736960] text-xs space-y-2">
              <span className="text-3xl block">📖</span>
              <p>Chưa có bản phối nào.</p>
              <p className="text-[11px] text-[#736960]/80">
                Phối một bộ rồi bấm "Lưu Lookbook" ở màn Kết quả để lưu lại bộ sưu tập của bạn.
              </p>
            </div>
          ) : (
            outfits.map((outfit) => {
              const garment = garments.find((g) => g.id === outfit.garmentId);

              return (
                <div
                  key={outfit.id}
                  className="bg-[#FBF8F3] border border-[#E6DCCD] rounded-[22px] p-4 space-y-3 hover:border-[#D8CCBA] transition shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    {editingId === outfit.id ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          aria-label="Tên mới cho bản phối"
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="bg-[#FFFFFF] border border-[#1F1B18] rounded-xl px-2.5 py-1 text-xs text-[#1F1B18] w-full focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(outfit.id)}
                          className="px-2.5 py-1 bg-[#1F1B18] text-[#FFFFFF] text-xs font-bold rounded-xl"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-[#1F1B18]">
                            {outfit.title}
                          </h4>
                          <button
                            onClick={() => handleStartRename(outfit)}
                            className="text-[#736960] hover:text-[#1F1B18] text-[11px]"
                            aria-label="Đổi tên bản phối"
                            title="Đổi tên bản phối"
                          >
                            ✏️
                          </button>
                        </div>
                        <p className="text-xs text-[#736960] mt-0.5">{garment?.name}</p>
                      </div>
                    )}

                    {/* Scores badge */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] bg-[#E5EDE2] text-[#4F7350] border border-[#CDE0C9] px-2 py-0.5 rounded-full font-medium">
                        Chuẩn: {outfit.chuanScore}
                      </span>
                      <span className="text-[10px] bg-[#F1EADF] text-[#1F1B18] border border-[#E6DCCD] px-2 py-0.5 rounded-full font-medium">
                        Chất: {outfit.chatScore}
                      </span>
                    </div>
                  </div>

                  {/* Color swatch & details */}
                  <div className="flex items-center justify-between text-xs text-[#736960] pt-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-[#E6DCCD] shadow-2xs"
                        style={{ backgroundColor: outfit.primaryColor }}
                        title="Màu tà áo"
                      />
                      <span className="text-[11px] font-medium">{outfit.styleVibe}</span>
                      {outfit.adaptiveNeedCode && (
                        <span className="text-[10px] bg-[#E5EDE2] text-[#4F7350] px-2 py-0.5 rounded-full border border-[#CDE0C9]">
                          Thích ứng
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-[#736960] font-mono">
                      {new Date(outfit.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E6DCCD]">
                    <button
                      onClick={() => {
                        onShareOutfit(outfit);
                        onClose();
                      }}
                      className="press px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F1EADF] border border-[#E6DCCD] text-[#1F1B18] text-xs font-semibold rounded-xl transition"
                    >
                      Chia sẻ
                    </button>
                    <button
                      onClick={() => {
                        onLoadOutfit(outfit);
                        onClose();
                      }}
                      className="press px-3.5 py-1.5 bg-[#1F1B18] hover:bg-[#38322D] text-[#FFFFFF] text-xs font-bold rounded-xl transition shadow-xs"
                    >
                      Tải bản phối này
                    </button>
                    <button
                      onClick={() => handleDelete(outfit.id)}
                      className="press px-2.5 py-1.5 text-[#8B1E2B] hover:bg-[#F9EBEA] text-xs rounded-xl transition"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Dialog>
  );
};
