import React from 'react';
import { Search, Sparkles } from 'lucide-react';

export default function CategoryFilter({
  searchQuery,
  onSearchChange,
  totalItems
}) {
  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 mt-3 sm:mt-6 mb-4 sm:mb-6 space-y-3">
      {/* Title & Count */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
          <span>เรทราคารับตัดปัจจุบัน</span>
          <span className="text-xs sm:text-sm font-semibold text-pink-600 bg-pink-100/70 border border-pink-200 px-2.5 py-0.5 rounded-full ml-1">
            {totalItems} รายการ
          </span>
        </h3>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหาชื่อแอพ เช่น iQIYI, Netflix, YouTube, Spotify..."
          className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3.5 bg-white rounded-2xl border border-pink-200/80 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-xs sm:text-sm md:text-base text-slate-800 placeholder:text-slate-400 shadow-sm hover:border-pink-300 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs sm:text-sm text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            ล้างค้นหา
          </button>
        )}
      </div>
    </div>
  );
}
