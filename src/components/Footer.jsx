import React from 'react';
import { ShieldCheck, Clock, Headphones } from 'lucide-react';

export default function Footer({ storeName, onOpenAdmin }) {
  return (
    <footer className="w-full max-w-4xl mx-auto px-4 pt-6 pb-16 text-center border-t border-pink-100/80 mt-auto">
      {/* 3 Value Badges */}
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto mb-6 text-slate-600">
        <div className="p-2.5 bg-white rounded-xl border border-pink-100/60 shadow-xs flex flex-col items-center">
          <ShieldCheck className="w-5 h-5 text-emerald-500 mb-1" />
          <span className="text-[11px] font-bold">ของแท้ 100%</span>
          <span className="text-[9px] text-slate-400">ได้วันใช้งานครบ</span>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-pink-100/60 shadow-xs flex flex-col items-center">
          <Clock className="w-5 h-5 text-pink-500 mb-1" />
          <span className="text-[11px] font-bold">ส่งไว 5-15 น.</span>
          <span className="text-[9px] text-slate-400">เปิดทุกวัน</span>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-pink-100/60 shadow-xs flex flex-col items-center">
          <Headphones className="w-5 h-5 text-purple-500 mb-1" />
          <span className="text-[11px] font-bold">ดูแลตลอดสัญญา</span>
          <span className="text-[9px] text-slate-400">เคลมไว ไม่ทิ้งงาน</span>
        </div>
      </div>

      {/* Copyright and Admin link */}
      <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mb-2">
        <span>© {new Date().getFullYear()} {storeName}. All rights reserved.</span>
        <span>•</span>
        <button
          onClick={onOpenAdmin}
          className="text-pink-500 hover:text-pink-600 underline font-medium cursor-pointer"
        >
          เข้าสู่ระบบจัดการร้าน
        </button>
      </div>
      <p className="text-[10px] text-slate-400">
        Modern Minimal Landing Page for Premium Reseller • Ready for Vercel
      </p>
    </footer>
  );
}
