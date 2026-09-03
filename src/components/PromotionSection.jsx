import React from 'react';
import { Flame, Sparkles, Monitor, Tv, Eye, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function PromotionSection({ promotions, onSelectPromo, isAdmin, onAddNew }) {
  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="my-6 px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-md text-white">
            <Flame className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5 font-['Prompt']">
              <span>โปรโมชั่นพิเศษ</span>
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                HOT DEALS 🔥
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              จัดเซ็ตรวมแอพสุดคุ้ม หรือโค้ดยกล็อตราคาพิเศษ
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ เพิ่มโปรโมชั่นใหม่</span>
          </button>
        )}
      </div>

      {/* Promotion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4.5">
        {promotions.map((promo) => {
          const discount = Number(promo.originalPrice) - Number(promo.promoPrice);
          const hasDiscount = !isNaN(discount) && discount > 0;

          // Resolve dynamic list of apps
          const promoApps = (promo.apps && Array.isArray(promo.apps) && promo.apps.length > 0)
            ? promo.apps
            : [
                ...(promo.app1Name || promo.app1Icon ? [{ name: promo.app1Name, icon: promo.app1Icon, devices: promo.app1Devices, resolution: promo.app1Resolution }] : []),
                ...(promo.app2Name || promo.app2Icon ? [{ name: promo.app2Name, icon: promo.app2Icon, devices: promo.app2Devices, resolution: promo.app2Resolution }] : []),
                ...(promo.hasApp3 && (promo.app3Name || promo.app3Icon) ? [{ name: promo.app3Name, icon: promo.app3Icon, devices: promo.app3Devices, resolution: promo.app3Resolution }] : [])
              ];

          const isSingleApp = promoApps.length === 1;

          return (
            <div
              key={promo.id}
              className="relative group bg-gradient-to-b from-white via-pink-50/20 to-rose-50/30 rounded-3xl p-3.5 sm:p-5 border-2 border-pink-200/90 shadow-card hover:shadow-soft-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400"></div>

              {/* Tag & Savings Badge & Availability Status */}
              <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 shadow-xs">
                    <Sparkles className="w-3 h-3 text-rose-500" />
                    <span>{promo.tag || (isSingleApp ? '⚡ ดีลพิเศษ' : `🔥 รวม ${promoApps.length} แอพสุดคุ้ม`)}</span>
                  </span>

                  {promo.stockStatus === 'not_ready' ? (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{promo.stockStatusText || 'ไม่พร้อมส่ง'}</span>
                    </span>
                  ) : (promo.stockStatus === 'out_of_stock' || promo.inStock === false) ? (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200">
                      <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>{promo.stockStatusText || 'สินค้าหมด'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{promo.stockStatusText || 'พร้อมส่ง'}</span>
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <span className="inline-flex items-center text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ประหยัด ฿{discount}
                  </span>
                )}
              </div>

              {/* Main Content Area: Showcase */}
              <div className="flex-1">
                {isSingleApp ? (
                  /* Single App Promo Showcase */
                  <div className="relative flex items-center justify-center p-3 my-2 bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-rose-50/70 rounded-2xl border border-rose-100/90 shadow-inner">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 shadow-md border-2 border-rose-200/80 transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      {promoApps[0]?.icon ? (
                        <img src={promoApps[0].icon} alt={promoApps[0].name} className="w-full h-full object-contain rounded-xl" />
                      ) : (
                        <Sparkles className="w-8 h-8 text-rose-400" />
                      )}
                    </div>
                  </div>
                ) : (
                  /* 2, 3, 4, or more Apps Dynamic Showcase */
                  <div className="relative flex items-center justify-center p-3 my-2 bg-gradient-to-r from-pink-50 via-white to-purple-50 rounded-2xl border border-pink-100/90 shadow-inner flex-wrap gap-y-2">
                    {promoApps.map((app, idx) => (
                      <React.Fragment key={app.id || idx}>
                        {idx > 0 && (
                          <div
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white mx-1.5 z-10 animate-bounce shrink-0"
                            style={{ animationDuration: '3s' }}
                          >
                            +
                          </div>
                        )}
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 shadow-md border-2 border-pink-100 transform hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                            {app.icon ? (
                              <img src={app.icon} alt={app.name} className="w-full h-full object-contain rounded-xl" />
                            ) : (
                              <span className="text-[9px] font-bold text-pink-500">APP {idx + 1}</span>
                            )}
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-slate-700 mt-1 truncate max-w-[75px]">
                            {app.name}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Promo Name */}
                <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-pink-600 transition-colors mt-2">
                  {promo.name}
                </h4>

                {/* Specs */}
                <div className="mt-2 space-y-1 text-[10px] sm:text-[11px]">
                  {isSingleApp ? (
                    <>
                      {promoApps[0]?.devices && (
                        <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-rose-100 text-slate-700">
                          <Monitor className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="text-slate-600 truncate">{promoApps[0].devices}</span>
                        </div>
                      )}
                      {promoApps[0]?.resolution && (
                        <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-purple-100 text-slate-700">
                          <Tv className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span className="text-slate-600 truncate">{promoApps[0].resolution}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    promoApps.map((app, idx) => (
                      app.devices && (
                        <div key={idx} className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-pink-100 text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0"></span>
                          <span className="font-bold text-slate-900 shrink-0">{app.name}:</span>
                          <span className="text-slate-600 truncate">{app.devices}</span>
                        </div>
                      )
                    ))
                  )}

                  {promoApps.length === 0 && promo.devices && (
                    <div className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200 text-slate-500">
                      <Monitor className="w-3 h-3 text-pink-500 shrink-0" />
                      <span className="truncate">{promo.devices}</span>
                    </div>
                  )}
                </div>

                {/* Package Details snippet */}
                {promo.packageDetails && (
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-2 line-clamp-2 whitespace-pre-line leading-relaxed">
                    {promo.packageDetails}
                  </p>
                )}
              </div>

              {/* Bottom: Price & Action */}
              <div className="mt-3 pt-3 border-t border-dashed border-pink-200 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {isSingleApp
                      ? 'ราคาโปรโมชั่นพิเศษ'
                      : promoApps.length === 2
                      ? 'ราคาแพ็กคู่พิเศษ'
                      : `ราคาเซ็ต ${promoApps.length} แอพพิเศษ`}
                  </span>
                  {promo.prices && promo.prices.length > 0 ? (
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {promo.prices.slice(0, 2).map((item, idx) => (
                        <span key={item.id || idx} className="text-xs sm:text-sm font-black text-rose-600">
                          {item.label}: ฿{item.price}
                          {idx === 0 && promo.prices.length > 1 && ' / '}
                        </span>
                      ))}
                      {promo.prices.length > 2 && (
                        <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                          +{promo.prices.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      {promo.originalPrice && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold">
                          ฿{promo.originalPrice}
                        </span>
                      )}
                      <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">
                        ฿{promo.promoPrice}
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                        {promo.pricePeriod || ''}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onSelectPromo(promo)}
                  className={`inline-flex items-center gap-1.5 py-2 sm:py-2.5 px-4 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer ${
                    promo.stockStatus === 'not_ready'
                      ? 'bg-gradient-to-r from-amber-500 via-rose-400 to-amber-500 hover:from-amber-600 hover:to-rose-500'
                      : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:to-pink-600'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>ดูรายละเอียด</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
