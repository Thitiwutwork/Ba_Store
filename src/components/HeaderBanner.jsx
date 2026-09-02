import React from 'react';
import { Clock, Sparkles, ShieldCheck, Settings } from 'lucide-react';
import { LineIcon } from './SocialIcons';

export default function HeaderBanner({ settings, onOpenAdmin }) {
  const {
    storeName,
    badgeText,
    description,
    subDescription,
    openingHours,
    announcement,
    bannerUrl,
    logoUrl,
    lineUrl
  } = settings;

  return (
    <header className="relative w-full max-w-4xl mx-auto">
      {/* Admin Quick Action Button (Floating top-right) */}
      <button
        onClick={onOpenAdmin}
        className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-700 hover:text-pink-600 text-xs font-medium rounded-full shadow-sm backdrop-blur-md transition-all duration-200 border border-pink-100/60 hover:shadow-md hover:scale-105"
        title="จัดการระบบหลังบ้าน (เพิ่ม/ลบ/แก้ไขสินค้า)"
      >
        <Settings className="w-3.5 h-3.5 text-pink-500 animate-spin-slow" />
        <span>จัดการร้านค้า</span>
      </button>

      {/* Announcement Bar */}
      {announcement && (
        <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-1.5 overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-yellow-200" />
          <span className="truncate">{announcement}</span>
        </div>
      )}

      {/* Cover Banner Area */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden shadow-sm bg-gradient-to-b from-pink-100 via-pink-50 to-[#FDF5F8]">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt="Store Banner"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          /* High quality decorative illustrated banner matching the reference photo */
          <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-pink-100 via-rose-50 to-purple-100">
            {/* Cute background floating shapes */}
            <div className="absolute top-3 left-6 text-2xl opacity-60 animate-bounce" style={{ animationDuration: '4s' }}>✨</div>
            <div className="absolute bottom-10 right-10 text-xl opacity-60">💖</div>
            <div className="absolute top-6 right-16 text-3xl opacity-50">⭐</div>
            <div className="absolute bottom-6 left-12 text-xl opacity-50">🌸</div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-200/40 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200/40 rounded-full blur-2xl"></div>

            {/* Banner Main Graphic */}
            <div className="relative z-10 text-center px-4 -mt-2">
              <div className="inline-block relative">
                {/* Store Name in bold bubbly 3D lettering style */}
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 drop-shadow-[0_2px_3px_rgba(255,255,255,0.8)] font-['Prompt']">
                  {storeName}
                </h1>
                {/* Planetary Ring / Glow */}
                <div className="absolute -inset-x-6 top-1/2 -translate-y-1/2 h-8 border-2 border-pink-300/60 rounded-[100%] pointer-events-none transform -rotate-3"></div>
              </div>

              {/* Sub-badge */}
              <div className="mt-1">
                <span className="inline-block bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 text-amber-900 border border-amber-300/70 text-xs sm:text-sm font-bold px-3.5 py-0.5 rounded-full shadow-xs">
                  {badgeText || "รับตัดแอพราคาส่ง"}
                </span>
              </div>

              {/* Extra tagline */}
              <p className="mt-1.5 text-[11px] sm:text-xs text-slate-600 font-medium max-w-xs sm:max-w-md mx-auto line-clamp-1">
                {subDescription || "โยนหรือใช้เองก็ได้ไม่บวกเพิ่ม ได้วันใช้งานครบแน่นอน"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Shop Profile & Overlapping Logo Section */}
      <div className="relative px-4 pt-0 pb-4 text-center">
        {/* Circular Logo Overlapping Banner Bottom Edge */}
        <div className="relative -mt-14 sm:-mt-16 mb-3 flex justify-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-md border-2 border-pink-200/80 ring-4 ring-pink-100/50 hover:scale-105 transition-transform duration-300">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={storeName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              /* Built-in cute store logo */
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-200 via-rose-100 to-purple-100 flex flex-col items-center justify-center p-2 text-center overflow-hidden border border-pink-100">
                <span className="text-pink-500 font-black text-base sm:text-lg leading-none tracking-tight">BA</span>
                <span className="text-purple-600 font-extrabold text-[10px] sm:text-xs tracking-wider uppercase">STORE</span>
                <span className="text-[10px] mt-0.5">💖</span>
              </div>
            )}
            <div className="absolute bottom-0 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white" title="ร้านเปิดให้บริการ">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Store Title & Description */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
          <span>{storeName}</span>
        </h2>
        <p className="text-sm text-pink-600 font-medium mt-0.5">
          {description}
        </p>

        {/* Opening Hours & Guarantee */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <div className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-xs border border-pink-100 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-pink-500" />
            <span>{openingHours}</span>
          </div>
          <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>รับประกันดูแลตลอดการใช้งาน</span>
          </div>
        </div>

        {/* Contact Action Button (LINE) */}
        <div className="mt-4 flex items-center justify-center max-w-xs mx-auto">
          {/* LINE Button */}
          <a
            href={lineUrl || "https://line.me"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-2.5 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm active:scale-95"
          >
            <LineIcon className="w-5 h-5 shrink-0" />
            <span>ติดต่อสั่งซื้อทาง LINE</span>
          </a>
        </div>
      </div>
    </header>
  );
}
