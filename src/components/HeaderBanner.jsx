import React from 'react';
import { Clock, Sparkles, ShieldCheck, KeyRound } from 'lucide-react';
import { LineIcon } from './SocialIcons';

export default function HeaderBanner({ settings }) {
  const {
    storeName,
    badgeText,
    description,
    subDescription,
    openingHours,
    announcement,
    bannerUrl,
    bannerFit = 'auto',
    bannerPosition = 'center',
    logoUrl,
    lineUrl,
    otpUrl = "https://ba-store-otp.vercel.app/"
  } = settings;

  return (
    <header className="relative w-full max-w-6xl xl:max-w-7xl mx-auto px-0 sm:px-4 pt-0 sm:pt-3">

      {/* Announcement Bar */}
      {announcement && (
        <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-1.5 overflow-hidden sm:rounded-t-2xl">
          <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-yellow-200" />
          <span className="truncate">{announcement}</span>
        </div>
      )}

      {/* Cover Banner Area (Auto-adapting aspect ratio across mobile, tablet, desktop) */}
      <div className="relative w-full aspect-[2/1] sm:aspect-[2.1/1] md:aspect-[2.2/1] max-h-[460px] overflow-hidden shadow-sm bg-gradient-to-b from-pink-100 via-pink-50 to-[#FDF5F8] sm:rounded-b-3xl">
        {bannerUrl ? (
          bannerFit === 'contain' ? (
            <div className="w-full h-full relative overflow-hidden bg-slate-900/10 flex items-center justify-center">
              {/* Blurred Ambient Backdrop to fit any image ratio without empty bars */}
              <img
                src={bannerUrl}
                alt="Store Banner Backdrop"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-60 scale-110"
              />
              {/* Full Sharp Image */}
              <img
                src={bannerUrl}
                alt="Store Banner"
                className="relative z-10 w-full h-full object-contain object-center"
              />
            </div>
          ) : (
            <img
              src={bannerUrl}
              alt="Store Banner"
              className={`w-full h-full object-cover ${
                bannerPosition === 'top'
                  ? 'object-top'
                  : bannerPosition === 'bottom'
                  ? 'object-bottom'
                  : 'object-center'
              }`}
            />
          )
        ) : (
          /* High quality decorative illustrated banner matching the reference photo */
          <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-pink-100 via-rose-50 to-purple-100 banner-pattern">
            {/* Cute background floating shapes */}
            <div className="absolute top-3 left-6 text-2xl sm:text-3xl opacity-60 animate-bounce" style={{ animationDuration: '4s' }}>✨</div>
            <div className="absolute bottom-10 right-10 text-xl sm:text-2xl opacity-60">💖</div>
            <div className="absolute top-6 right-16 text-2xl sm:text-4xl opacity-50">⭐</div>
            <div className="absolute bottom-6 left-12 text-xl sm:text-2xl opacity-50">🌸</div>
            <div className="absolute -top-10 -right-10 w-48 h-48 sm:w-64 sm:h-64 bg-pink-200/40 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 sm:w-64 sm:h-64 bg-purple-200/40 rounded-full blur-3xl"></div>

            {/* Banner Main Graphic */}
            <div className="relative z-10 text-center px-4 -mt-2">
              <div className="inline-block relative">
                {/* Store Name in bold bubbly 3D lettering style */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] font-['Prompt']">
                  {storeName}
                </h1>
                {/* Planetary Ring / Glow */}
                <div className="absolute -inset-x-6 sm:-inset-x-10 top-1/2 -translate-y-1/2 h-8 sm:h-12 border-2 border-pink-300/60 rounded-[100%] pointer-events-none transform -rotate-3"></div>
              </div>

              {/* Sub-badge */}
              <div className="mt-1 sm:mt-2">
                <span className="inline-block bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 text-amber-900 border border-amber-300/70 text-xs sm:text-sm md:text-base font-bold px-3.5 sm:px-5 py-0.5 sm:py-1 rounded-full shadow-xs">
                  {badgeText || "รับตัดแอพราคาส่ง"}
                </span>
              </div>

              {/* Extra tagline */}
              <p className="mt-1.5 sm:mt-2.5 text-[11px] sm:text-xs md:text-sm text-slate-600 font-medium max-w-xs sm:max-w-md md:max-w-lg mx-auto line-clamp-1">
                {subDescription || "โยนหรือใช้เองก็ได้ไม่บวกเพิ่ม ได้วันใช้งานครบแน่นอน"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Shop Profile & Overlapping Logo Section */}
      <div className="relative px-4 pt-0 pb-4 text-center">
        {/* Circular Logo Overlapping Banner Bottom Edge */}
        <div className="relative -mt-12 sm:-mt-16 md:-mt-20 mb-3 flex justify-center">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white p-1.5 shadow-lg border-2 border-pink-200/90 ring-4 ring-pink-100/60 hover:scale-105 transition-transform duration-300">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={storeName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              /* Built-in cute store logo */
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-200 via-rose-100 to-purple-100 flex flex-col items-center justify-center p-2 text-center overflow-hidden border border-pink-100">
                <span className="text-pink-500 font-black text-lg sm:text-2xl leading-none tracking-tight">BA</span>
                <span className="text-purple-600 font-extrabold text-[10px] sm:text-xs md:text-sm tracking-wider uppercase">STORE</span>
                <span className="text-xs sm:text-sm mt-0.5">💖</span>
              </div>
            )}
            <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 w-6 h-6 sm:w-7 sm:h-7 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-xs" title="ร้านเปิดให้บริการ">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>

        {/* Store Title & Description */}
        <h2 className="text-xl sm:text-3xl font-bold text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
          <span>{storeName}</span>
        </h2>
        <p className="text-xs sm:text-base text-pink-600 font-medium mt-1">
          {description}
        </p>

        {/* Opening Hours & Guarantee */}
        <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
          <div className="inline-flex items-center gap-1.5 bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-xs border border-pink-100 text-slate-700">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />
            <span>{openingHours}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>รับประกันดูแลตลอดการใช้งาน</span>
          </div>
        </div>

        {/* Contact Action Buttons (LINE & OTP) */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2.5 sm:gap-4 max-w-sm sm:max-w-md mx-auto px-2">
          {/* LINE Button */}
          <a
            href={lineUrl || "https://line.me"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm md:text-base active:scale-95 cursor-pointer text-center"
          >
            <LineIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="truncate">ติดต่อสั่งซื้อทาง LINE</span>
          </a>

          {/* OTP Button */}
          <a
            href={otpUrl || "https://ba-store-otp.vercel.app/"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm md:text-base active:scale-95 cursor-pointer text-center"
          >
            <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-yellow-200" />
            <span className="truncate">รับรหัส OTP</span>
          </a>
        </div>
      </div>
    </header>
  );
}
