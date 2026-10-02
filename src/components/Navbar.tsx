import React, { useState } from 'react';

export type MainNavTab = 'HOME' | 'DISCOVERY' | 'LOOKBOOK';

interface NavbarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  lookbookCount: number;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  lookbookCount,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: MainNavTab; label: string }[] = [
    { id: 'HOME', label: 'Trang chủ' },
    { id: 'DISCOVERY', label: 'Khám phá' },
    { id: 'LOOKBOOK', label: 'Lookbook' },
  ];

  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-[#E6DCCD] bg-[#FBF8F3]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* Brand Logo in Fraunces */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('HOME');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 rounded-xl py-1 text-left min-h-[44px] focus-visible:outline-[#1F1B18]"
          aria-label="Vstyle — Về trang chủ"
        >
          <span
            aria-hidden="true"
            className="grid size-10 -rotate-3 place-items-center rounded-2xl bg-[#1F1B18] font-serif text-xl font-bold text-[#FBF8F3] shadow-xs"
          >
            V
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-2xl font-bold tracking-tight text-[#1F1B18]">
              Vstyle
            </span>
            <span className="hidden text-[11px] font-medium text-[#736960] sm:block">
              Việt phục Remix · đúng bản sắc, vừa mọi cơ thể
            </span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-2 h-full">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative flex items-center gap-2 h-full px-4 text-sm font-semibold transition min-h-[44px] focus-visible:outline-[#1F1B18] ${
                  isActive
                    ? 'text-[#1F1B18] font-bold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#1F1B18] after:rounded-full'
                    : 'text-[#736960] hover:text-[#1F1B18]'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'LOOKBOOK' && lookbookCount > 0 && (
                  <span
                    className="grid min-w-5 h-5 place-items-center rounded-full bg-[#1F1B18] px-1.5 text-[11px] font-bold text-[#FBF8F3] tabular"
                    aria-label={`${lookbookCount} bản phối đã lưu`}
                  >
                    {lookbookCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="press grid size-11 place-items-center rounded-2xl border border-[#E6DCCD] bg-[#FFFFFF] text-[#736960] hover:text-[#1F1B18] hover:border-[#D8CCBA] transition shadow-2xs"
              aria-label="Tìm kiếm y phục hoặc bối cảnh"
              title="Tìm kiếm"
            >
              <svg className="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          )}

          {/* Lookbook Button Pill */}
          <button
            type="button"
            onClick={() => onSelectTab('LOOKBOOK')}
            className={`press min-h-[44px] flex items-center gap-2 rounded-2xl px-4 text-xs sm:text-sm font-bold transition ${
              activeTab === 'LOOKBOOK'
                ? 'bg-[#1F1B18] text-[#FFFFFF] shadow-sm'
                : 'bg-[#FFFFFF] text-[#1F1B18] border border-[#E6DCCD] hover:bg-[#F1EADF]'
            }`}
          >
            <span>Lookbook</span>
            <span
              className="grid min-w-5 h-5 place-items-center rounded-full bg-[#1F1B18] px-1.5 text-[11px] font-bold text-[#FFFFFF] tabular"
              aria-label={`${lookbookCount} bản phối đã lưu`}
            >
              {lookbookCount}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="press md:hidden grid size-11 place-items-center rounded-2xl border border-[#E6DCCD] bg-[#FFFFFF] text-[#1F1B18]"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? (
              <span className="text-xl font-bold">✕</span>
            ) : (
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E6DCCD] bg-[#FBF8F3] px-5 py-3 shadow-lg space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold transition flex items-center justify-between min-h-[44px] ${
                  isActive
                    ? 'bg-[#F1EADF] text-[#1F1B18] font-bold'
                    : 'text-[#736960] hover:bg-[#FFFFFF] hover:text-[#1F1B18]'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'LOOKBOOK' && (
                  <span className="rounded-full bg-[#1F1B18] px-2 py-0.5 text-xs text-[#FFFFFF] font-bold">
                    {lookbookCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
