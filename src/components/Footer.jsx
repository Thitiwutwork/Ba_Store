import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Clock, Headphones } from 'lucide-react';

export default function Footer({ storeName = 'BA STORE', onOpenAdmin, settings = {} }) {
  const [showAdminLink, setShowAdminLink] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const badge1 = settings.badge1Title !== undefined ? settings.badge1Title : 'ได้วันใช้งานครบ 100%';
  const badge1Sub = settings.badge1Sub !== undefined ? settings.badge1Sub : '';

  const badge2 = settings.badge2Title !== undefined ? settings.badge2Title : 'ใช้เวลาตัดไม่นาน';
  const badge2Sub = settings.badge2Sub !== undefined ? settings.badge2Sub : '';

  const badge3 = settings.badge3Title !== undefined ? settings.badge3Title : 'ดูแลตลอดการใช้งาน';
  const badge3Sub = settings.badge3Sub !== undefined ? settings.badge3Sub : '';

  // Secret 3-click trigger on "BA" / storeName
  const handleSecretTrigger = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2500);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      setShowAdminLink(true);
      if (typeof onOpenAdmin === 'function') {
        onOpenAdmin();
      }
    }
  };

  // Optional keyboard secret shortcut: Alt + A or Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) ||
          ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setShowAdminLink(true);
        if (typeof onOpenAdmin === 'function') {
          onOpenAdmin();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAdmin]);

  return (
    <footer className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 pt-8 pb-16 text-center border-t border-pink-100/80 mt-auto">
      {/* 3 Value Badges */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md sm:max-w-xl mx-auto mb-6 text-slate-600">
        <div className="p-3 bg-white rounded-2xl border border-pink-100/70 shadow-xs flex flex-col items-center justify-center text-center">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mb-1 shrink-0" />
          <span className="text-[11px] sm:text-sm font-bold text-slate-800 leading-tight">{badge1}</span>
          {Boolean(badge1Sub && badge1Sub.trim()) && <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{badge1Sub}</span>}
        </div>
        <div className="p-3 bg-white rounded-2xl border border-pink-100/70 shadow-xs flex flex-col items-center justify-center text-center">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 mb-1 shrink-0" />
          <span className="text-[11px] sm:text-sm font-bold text-slate-800 leading-tight">{badge2}</span>
          {Boolean(badge2Sub && badge2Sub.trim()) && <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{badge2Sub}</span>}
        </div>
        <div className="p-3 bg-white rounded-2xl border border-pink-100/70 shadow-xs flex flex-col items-center justify-center text-center">
          <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mb-1 shrink-0" />
          <span className="text-[11px] sm:text-sm font-bold text-slate-800 leading-tight">{badge3}</span>
          {Boolean(badge3Sub && badge3Sub.trim()) && <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{badge3Sub}</span>}
        </div>
      </div>

      {/* Copyright and Secret Admin link (Completely invisible to visitors) */}
      <div className="text-xs sm:text-sm text-slate-400 select-none flex items-center justify-center gap-2 mb-2">
        <span
          onClick={handleSecretTrigger}
          className="cursor-default select-none"
        >
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </span>

        {showAdminLink && (
          <>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-pink-500 hover:text-pink-600 underline font-medium cursor-pointer animate-fade-in"
            >
              เข้าสู่ระบบจัดการร้าน
            </button>
          </>
        )}
      </div>
      <p className="text-[10px] sm:text-xs text-slate-400">
        Modern Minimal Responsive Landing Page for Premium Reseller
      </p>
    </footer>
  );
}
