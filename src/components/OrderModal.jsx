import React from 'react';
import { X, ExternalLink, Monitor, Tv, FileText, Sparkles, Flame, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { LineIcon } from './SocialIcons';

export default function OrderModal({ product, storeSettings, onClose }) {
  if (!product) return null;

  const isPromo = !!(product.app1Icon && product.app2Icon);
  const lineTargetUrl = product.orderLink || storeSettings.lineUrl || 'https://line.me';
  const discount = isPromo ? Number(product.originalPrice) - Number(product.promoPrice) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-pink-100 relative my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto pr-1">
          {/* Header info */}
          {isPromo ? (
            /* Promotion Dual App Header */
            <div className="pb-3 border-b border-pink-100">
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  <Flame className="w-3 h-3 text-rose-500" />
                  <span>{product.tag || '🔥 โปรคู่สุดคุ้ม'}</span>
                </span>
                {product.stockStatus === 'not_ready' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>{product.stockStatusText || 'ไม่พร้อมส่ง (รอกด)'}</span>
                  </span>
                ) : (product.stockStatus === 'out_of_stock' || product.inStock === false) ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    <XCircle className="w-3 h-3 text-rose-600" />
                    <span>{product.stockStatusText || 'สินค้าหมด'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{product.stockStatusText || 'พร้อมส่ง'}</span>
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                    ประหยัด ฿{discount}
                  </span>
                )}
              </div>

              {/* App Icons Display (2 or 3 Apps) */}
              <div className="flex items-center justify-center py-2 px-3 bg-gradient-to-r from-pink-50 via-white to-purple-50 rounded-2xl border border-pink-100 mb-2 flex-wrap gap-y-1">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-sm border border-pink-100 flex items-center justify-center">
                    <img src={product.app1Icon} alt={product.app1Name} className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 mt-1">{product.app1Name}</span>
                </div>

                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-[11px] flex items-center justify-center shadow-xs mx-2">
                  +
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-sm border border-purple-100 flex items-center justify-center">
                    <img src={product.app2Icon} alt={product.app2Name} className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 mt-1">{product.app2Name}</span>
                </div>

                {product.hasApp3 && product.app3Icon && (
                  <>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-[11px] flex items-center justify-center shadow-xs mx-2">
                      +
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-sm border border-indigo-100 flex items-center justify-center">
                        <img src={product.app3Icon} alt={product.app3Name} className="w-full h-full object-contain rounded-xl" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 mt-1">{product.app3Name}</span>
                    </div>
                  </>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {product.name}
              </h3>
            </div>
          ) : (
            /* Single Product Header */
            <div className="flex items-center gap-3.5 pb-3 border-b border-pink-100">
              <div className="w-16 h-16 p-1 bg-pink-50 rounded-2xl border border-pink-100 shadow-xs flex items-center justify-center shrink-0">
                {product.icon ? (
                  <img
                    src={product.icon}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-pink-400 font-bold">APP</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  {product.category && (
                    <span className="text-[10px] font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                      {product.category}
                    </span>
                  )}
                  {product.tag && (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {product.tag}
                    </span>
                  )}
                  {product.stockStatus === 'not_ready' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{product.stockStatusText || 'ไม่พร้อมส่ง (รอกด)'}</span>
                    </span>
                  ) : (product.stockStatus === 'out_of_stock' || product.inStock === false) ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      <XCircle className="w-3 h-3 text-rose-600" />
                      <span>{product.stockStatusText || 'สินค้าหมด'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{product.stockStatusText || 'พร้อมส่ง'}</span>
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {product.name}
                </h3>
              </div>
            </div>
          )}

          {/* Pricing Highlight Box */}
          <div className="my-3.5 p-3 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 rounded-2xl border border-pink-200/80">
            <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>{isPromo ? 'เรทราคาโปรโมชั่นพิเศษ' : 'เรทราคาแพ็กเกจ'}</span>
            </div>

            {isPromo ? (
              <div className="text-center py-1">
                <div className="flex items-baseline justify-center gap-2">
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through font-semibold">
                      ฿{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs font-bold text-rose-500">฿</span>
                  <span className="text-3xl font-black text-rose-600 tracking-tight">
                    {product.promoPrice}
                  </span>
                  <span className="text-xs text-slate-500">{product.pricePeriod}</span>
                </div>
                {discount > 0 && (
                  <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    🎉 ประหยัดกว่าซื้อแยก ฿{discount}
                  </span>
                )}
              </div>
            ) : (() => {
              const priceList = (product.prices && Array.isArray(product.prices) && product.prices.length > 0)
                ? product.prices
                : [
                    { id: '1', label: product.priceLabel || '', price: product.price, period: product.pricePeriod || '' },
                    ...(product.hasSecondPrice && product.secondPrice ? [{ id: '2', label: product.secondPriceLabel || '', price: product.secondPrice, period: product.pricePeriod || '' }] : [])
                  ];

              if (priceList.length > 2) {
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-1">
                    {priceList.map((p, idx) => (
                      <div
                        key={p.id || idx}
                        className="bg-white p-2.5 rounded-2xl border border-pink-200/90 text-center shadow-xs flex flex-col justify-between"
                      >
                        <div className="text-[11px] sm:text-xs font-bold text-slate-800 leading-snug break-words whitespace-normal px-0.5 mb-1.5 min-h-[1.75rem] flex items-center justify-center">
                          {p.label || `เรท ${idx + 1}`}
                        </div>
                        <div>
                          <div className="text-pink-600 font-black text-lg sm:text-xl leading-none">
                            <span className="text-xs font-bold mr-0.5">{product.priceUnit || '฿'}</span>
                            {p.price}
                          </div>
                          {p.period && p.period.trim() ? (
                            <span className="text-[10px] text-slate-400 block leading-tight mt-1 break-words whitespace-normal">
                              {p.period}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              if (priceList.length === 2) {
                return (
                  <div className="flex items-center justify-around gap-2 text-center py-1">
                    <div className="flex-1 bg-white/80 p-2.5 rounded-xl border border-pink-100 flex flex-col justify-between">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-700 block leading-snug break-words whitespace-normal mb-1">
                        {priceList[0].label || 'ราคาลูกค้า'}
                      </span>
                      <div>
                        <div className="text-pink-600 font-black text-xl">
                          <span className="text-xs font-bold mr-0.5">{product.priceUnit || '฿'}</span>
                          {priceList[0].price}
                        </div>
                        {priceList[0].period && priceList[0].period.trim() ? (
                          <span className="text-[10px] text-slate-400 block mt-0.5 break-words whitespace-normal">
                            {priceList[0].period}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-slate-300 font-bold text-lg">/</div>

                    <div className="flex-1 bg-white/80 p-2.5 rounded-xl border border-purple-100 flex flex-col justify-between">
                      <span className="text-[11px] sm:text-xs font-bold text-purple-700 block leading-snug break-words whitespace-normal mb-1">
                        {priceList[1].label || 'ราคาร้าน'}
                      </span>
                      <div>
                        <div className="text-purple-600 font-black text-xl">
                          <span className="text-xs font-bold mr-0.5">{product.priceUnit || '฿'}</span>
                          {priceList[1].price}
                        </div>
                        {priceList[1].period && priceList[1].period.trim() ? (
                          <span className="text-[10px] text-slate-400 block mt-0.5 break-words whitespace-normal">
                            {priceList[1].period}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="flex items-baseline justify-center gap-1 text-pink-600 py-1">
                  {priceList[0]?.label && (
                    <span className="text-xs font-medium text-slate-500 mr-1">{priceList[0].label}</span>
                  )}
                  <span className="text-sm font-bold">{product.priceUnit || '฿'}</span>
                  <span className="text-3xl font-black">{priceList[0]?.price || product.price}</span>
                  {priceList[0]?.period && priceList[0].period.trim() ? (
                    <span className="text-xs text-slate-500 ml-1">{priceList[0].period}</span>
                  ) : null}
                </div>
              );
            })()}
          </div>

          {/* Technical Specs: Separated for Each App in the Combo */}
          {isPromo ? (
            <div className="space-y-2.5 mb-3.5">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 px-0.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>สเปกและรายละเอียดการใช้งานแยกตามแอพ</span>
              </div>

              {/* App 1 Specs Card */}
              <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-200/80 space-y-1.5">
                <div className="flex items-center gap-2 pb-1.5 border-b border-pink-100">
                  <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-pink-200 flex items-center justify-center shrink-0">
                    <img src={product.app1Icon} alt={product.app1Name} className="w-full h-full object-contain rounded" />
                  </div>
                  <span className="text-xs font-black text-slate-800">{product.app1Name}</span>
                  <span className="ml-auto text-[10px] bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full">
                    แอพที่ 1
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1 text-[11px] pt-0.5">
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <Monitor className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-500 shrink-0">อุปกรณ์:</span>
                    <span className="font-bold text-slate-800">{product.app1Devices || product.devices || 'ดูได้ 1 อุปกรณ์'}</span>
                  </div>
                  {product.app1Resolution && (
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <Tv className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-500 shrink-0">ความคมชัด:</span>
                      <span className="font-medium text-slate-700">{product.app1Resolution}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* App 2 Specs Card */}
              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-200/80 space-y-1.5">
                <div className="flex items-center gap-2 pb-1.5 border-b border-purple-100">
                  <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-purple-200 flex items-center justify-center shrink-0">
                    <img src={product.app2Icon} alt={product.app2Name} className="w-full h-full object-contain rounded" />
                  </div>
                  <span className="text-xs font-black text-slate-800">{product.app2Name}</span>
                  <span className="ml-auto text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                    แอพที่ 2
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1 text-[11px] pt-0.5">
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <Monitor className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-500 shrink-0">อุปกรณ์:</span>
                    <span className="font-bold text-slate-800">{product.app2Devices || product.devices || 'ดูได้ 1 อุปกรณ์'}</span>
                  </div>
                  {product.app2Resolution && (
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <Tv className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-500 shrink-0">ความคมชัด:</span>
                      <span className="font-medium text-slate-700">{product.app2Resolution}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* App 3 Specs Card (If present) */}
              {product.hasApp3 && product.app3Name && (
                <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-200/80 space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-indigo-100">
                    <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-indigo-200 flex items-center justify-center shrink-0">
                      {product.app3Icon ? (
                        <img src={product.app3Icon} alt={product.app3Name} className="w-full h-full object-contain rounded" />
                      ) : (
                        <span className="text-[9px] font-bold text-indigo-500">APP 3</span>
                      )}
                    </div>
                    <span className="text-xs font-black text-slate-800">{product.app3Name}</span>
                    <span className="ml-auto text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                      แอพที่ 3
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1 text-[11px] pt-0.5">
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <Monitor className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-500 shrink-0">อุปกรณ์:</span>
                      <span className="font-bold text-slate-800">{product.app3Devices || 'ดูได้ 1 อุปกรณ์'}</span>
                    </div>
                    {product.app3Resolution && (
                      <div className="flex items-start gap-1.5 text-slate-700">
                        <Tv className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="font-semibold text-slate-500 shrink-0">ความคมชัด:</span>
                        <span className="font-medium text-slate-700">{product.app3Resolution}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            ((product.devices && product.devices.trim()) || (product.resolution && product.resolution.trim())) && (
              <div className="space-y-2 mb-3.5">
                {product.devices && product.devices.trim() && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-700">
                        จำนวนอุปกรณ์ที่รองรับ / ดูพร้อมกันได้
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {product.devices}
                      </div>
                    </div>
                  </div>
                )}

                {product.resolution && product.resolution.trim() && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Tv className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-700">
                        ความคมชัดและระบบเสียง
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {product.resolution}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          )}

          {/* Package Details with multiline support */}
          {product.packageDetails && (
            <div className="mb-4 p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-pink-500" />
                <span>รายละเอียดและเงื่อนไขการใช้งาน</span>
              </div>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                {product.packageDetails}
              </p>
            </div>
          )}

          {/* Action Button: Direct LINE */}
          <div className="pt-2">
            <a
              href={lineTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-4 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer ${
                product.stockStatus === 'not_ready'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600'
                  : (product.stockStatus === 'out_of_stock' || product.inStock === false)
                  ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800'
                  : 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 hover:from-emerald-600 hover:to-green-600'
              }`}
            >
              <LineIcon className="w-5 h-5 shrink-0" />
              <span>
                {product.stockStatus === 'not_ready'
                  ? 'สอบถามคิว / สั่งจองผ่าน LINE'
                  : (product.stockStatus === 'out_of_stock' || product.inStock === false)
                  ? 'สอบถามสถานะสินค้าผ่าน LINE'
                  : isPromo
                  ? 'สั่งซื้อโปรโมชั่นนี้ผ่าน LINE'
                  : 'สั่งซื้อ / ติดต่อสอบถามผ่าน LINE'}
              </span>
              <ExternalLink className="w-4 h-4 ml-auto opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
