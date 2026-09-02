import React from 'react';
import { Search, Sparkles } from 'lucide-react';

export default function CategoryFilter({
  searchQuery,
  onSearchChange,
  totalItems
}) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-2 mb-4 space-y-3">
      {/* Title & Count */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>เรทราคารับตัดปัจจุบัน</span>
          <span className="text-xs font-normal text-slate-500 bg-pink-50 border border-pink-200/60 px-2 py-0.5 rounded-full ml-1">
            {totalItems} รายการ
          </span>
        </h3>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-pink-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหาชื่อแอพ เช่น iQIYI, Netflix, YouTube..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-pink-200/80 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            ล้างค้นหา
          </button>
        )}
      </div>
    </div>
  );
}
