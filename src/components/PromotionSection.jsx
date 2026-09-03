import React from 'react';
import { Flame, Sparkles, Monitor, Eye, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function PromotionSection({ promotions, onSelectPromo, isAdmin, onAddNew }) {
  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="w-full max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 pt-2 pb-4">
      {/* Promotion Section Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
            <Flame className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
              <span>โปรโมชั่นพิเศษ / แพ็กเกจคู่สุดคุ้ม</span>
              <span className="text-[10px] sm:text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                HOT DEAL 🔥
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              จับคู่แอพยอดฮิตในราคาพิเศษ คุ้มกว่าซื้อแยก ประหยัดทันที
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มโปรคู่</span>
          </button>
        )}
      </div>

      {/* Promotion Cards Grid (1 col on narrow mobile, 2 cols on tablet/desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4.5">
        {promotions.map((promo) => {
          const discount = Number(promo.originalPrice) - Number(promo.promoPrice);
          const hasDiscount = !isNaN(discount) && discount > 0;

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
                    <span>{promo.tag || '🔥 โปรคู่สุดคุ้ม'}</span>
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

              {/* Main Content Area: Dual App Showcase */}
              <div className="flex-1">
                {/* App Icons Showcase (2 or 3 Apps) */}
                <div className="relative flex items-center justify-center p-3 my-2 bg-gradient-to-r from-pink-50 via-white to-purple-50 rounded-2xl border border-pink-100/90 shadow-inner flex-wrap gap-y-2">
                  {/* App 1 */}
                  <div className="flex flex-col items-center">
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-white p-1.5 shadow-md border-2 border-pink-100 transform -rotate-3 group-hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                      {promo.app1Icon ? (
                        <img src={promo.app1Icon} alt={promo.app1Name} className="w-full h-full object-contain rounded-xl" />
                      ) : (
                        <span className="text-[10px] font-bold text-pink-500">APP 1</span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700 mt-1.5 truncate max-w-[75px]">
                      {promo.app1Name}
                    </span>
                  </div>

                  {/* Plus Badge 1 */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white mx-2 z-10 animate-bounce" style={{ animationDuration: '3s' }}>
                    +
                  </div>

                  {/* App 2 */}
                  <div className="flex flex-col items-center">
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-white p-1.5 shadow-md border-2 border-purple-100 transform rotate-3 group-hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                      {promo.app2Icon ? (
                        <img src={promo.app2Icon} alt={promo.app2Name} className="w-full h-full object-contain rounded-xl" />
                      ) : (
                        <span className="text-[10px] font-bold text-purple-500">APP 2</span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700 mt-1.5 truncate max-w-[75px]">
                      {promo.app2Name}
                    </span>
                  </div>

                  {/* App 3 (If present) */}
                  {promo.hasApp3 && promo.app3Icon && (
                    <>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white mx-2 z-10 animate-bounce" style={{ animationDuration: '3s' }}>
                        +
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-white p-1.5 shadow-md border-2 border-indigo-100 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                          <img src={promo.app3Icon} alt={promo.app3Name} className="w-full h-full object-contain rounded-xl" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-700 mt-1.5 truncate max-w-[75px]">
                          {promo.app3Name}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Promo Name */}
                <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-pink-600 transition-colors mt-2">
                  {promo.name}
                </h4>

                {/* Specs: Separated App Devices */}
                <div className="mt-2 space-y-1 text-[10px] sm:text-[11px]">
                  {promo.app1Devices && (
                    <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-pink-100 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0"></span>
                      <span className="font-bold text-slate-900 shrink-0">{promo.app1Name}:</span>
                      <span className="text-slate-600 truncate">{promo.app1Devices}</span>
                    </div>
                  )}

                  {promo.app2Devices && (
                    <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-purple-100 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                      <span className="font-bold text-slate-900 shrink-0">{promo.app2Name}:</span>
                      <span className="text-slate-600 truncate">{promo.app2Devices}</span>
                    </div>
                  )}

                  {promo.hasApp3 && promo.app3Devices && (
                    <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-indigo-100 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                      <span className="font-bold text-slate-900 shrink-0">{promo.app3Name}:</span>
                      <span className="text-slate-600 truncate">{promo.app3Devices}</span>
                    </div>
                  )}

                  {!promo.app1Devices && !promo.app2Devices && promo.devices && (
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
                  <span className="text-[10px] text-slate-400 font-medium block">ราคาแพ็กคู่พิเศษ</span>
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
