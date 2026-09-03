import React from 'react';
import { X, ExternalLink, Monitor, Tv, FileText, Sparkles, Flame, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { LineIcon } from './SocialIcons';

export default function OrderModal({ product, storeSettings, onClose }) {
  if (!product) return null;

  const isPromo = !!((product.apps && Array.isArray(product.apps) && product.apps.length > 0) || (product.app1Icon && (product.app2Icon || product.appCount === 1 || product.promoType === 'single')));
  const promoApps = isPromo
    ? ((product.apps && Array.isArray(product.apps) && product.apps.length > 0)
        ? product.apps
        : [
            ...(product.app1Name || product.app1Icon ? [{ name: product.app1Name, icon: product.app1Icon, devices: product.app1Devices, resolution: product.app1Resolution }] : []),
            ...(product.app2Name || product.app2Icon ? [{ name: product.app2Name, icon: product.app2Icon, devices: product.app2Devices, resolution: product.app2Resolution }] : []),
            ...(product.hasApp3 && (product.app3Name || product.app3Icon) ? [{ name: product.app3Name, icon: product.app3Icon, devices: product.app3Devices, resolution: product.app3Resolution }] : [])
          ])
    : [];
  const isSinglePromo = isPromo && promoApps.length === 1;
  const lineTargetUrl = product.orderLink || storeSettings.lineUrl || 'https://line.me';
  const parsePriceNum = (v) => {
    if (!v) return 0;
    const cleaned = String(v).replace(/[^0-9.]/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  };
  const origPrice = parsePriceNum(product.originalPrice);
  const promoPrice = parsePriceNum(product.promoPrice || (product.prices && product.prices[0]?.price));
  const discount = isPromo && origPrice > promoPrice ? origPrice - promoPrice : 0;

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
                    ประหยัด ฿{discount.toLocaleString()}
                  </span>
                )}
              </div>

              {/* App Icons Display (1, 2, 3, 4+ Apps) */}
              {isSinglePromo ? (
                <div className="flex items-center justify-center py-2 px-3 bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-rose-50/70 rounded-2xl border border-rose-100 mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-sm border border-rose-200 flex items-center justify-center">
                    <img src={promoApps[0]?.icon} alt={promoApps[0]?.name} className="w-full h-full object-contain rounded-xl" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-2 px-3 bg-gradient-to-r from-pink-50 via-white to-purple-50 rounded-2xl border border-pink-100 mb-2 flex-wrap gap-y-1">
                  {promoApps.map((app, idx) => (
                    <React.Fragment key={app.id || idx}>
                      {idx > 0 && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-[11px] flex items-center justify-center shadow-xs mx-1.5 shrink-0">
                          +
                        </div>
                      )}
                      <div className="flex flex-col items-center">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white p-1 shadow-sm border border-pink-100 flex items-center justify-center">
                          {app.icon ? (
                            <img src={app.icon} alt={app.name} className="w-full h-full object-contain rounded-xl" />
                          ) : (
                            <span className="text-[9px] font-bold text-pink-500">APP {idx + 1}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 mt-1 truncate max-w-[70px]">{app.name}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}

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
                    🎉 ประหยัดกว่าซื้อแยก ฿{discount.toLocaleString()}
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
                        className={`p-2.5 rounded-2xl border text-center shadow-xs flex flex-col justify-between transition-all ${
                          p.status === 'out_of_stock'
                            ? 'bg-slate-50 border-slate-200 opacity-75'
                            : p.status === 'not_ready'
                            ? 'bg-amber-50/50 border-amber-200'
                            : 'bg-white border-pink-200/90'
                        }`}
                      >
                        <div className="text-[11px] sm:text-xs font-bold text-slate-800 leading-snug break-words whitespace-normal px-0.5 mb-1.5 min-h-[1.75rem] flex items-center justify-center">
                          {p.label || `เรท ${idx + 1}`}
                        </div>
                        <div>
                          <div className={`font-black text-lg sm:text-xl leading-none ${p.status === 'out_of_stock' ? 'text-slate-400 line-through' : 'text-pink-600'}`}>
                            <span className="text-xs font-bold mr-0.5">{product.priceUnit || '฿'}</span>
                            {p.price}
                          </div>
                          {p.period && p.period.trim() ? (
                            <span className="text-[10px] text-slate-400 block leading-tight mt-1 break-words whitespace-normal">
                              {p.period}
                            </span>
                          ) : null}

                          {/* Per-Price Tier Status Badge */}
                          <div className="mt-2 flex justify-center">
                            {p.status === 'not_ready' ? (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                <Clock className="w-2.5 h-2.5 text-amber-600" />
                                <span>{p.statusText || 'รอกด'}</span>
                              </span>
                            ) : p.status === 'out_of_stock' ? (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                                <XCircle className="w-2.5 h-2.5 text-rose-600" />
                                <span>{p.statusText || 'หมด'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                <span>{p.statusText || 'พร้อมส่ง'}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              if (priceList.length === 2) {
                return (
                  <div className="flex items-center justify-around gap-2 text-center py-1">
                    <div className={`flex-1 p-2.5 rounded-xl border flex flex-col justify-between ${
                      priceList[0].status === 'out_of_stock'
                        ? 'bg-slate-50 border-slate-200 opacity-75'
                        : priceList[0].status === 'not_ready'
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-white/80 border-pink-100'
                    }`}>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-700 block leading-snug break-words whitespace-normal mb-1">
                        {priceList[0].label || 'ราคาลูกค้า'}
                      </span>
                      <div>
                        <div className={`font-black text-xl ${priceList[0].status === 'out_of_stock' ? 'text-slate-400 line-through' : 'text-pink-600'}`}>
                          <span className="text-xs font-bold mr-0.5">{product.priceUnit || '฿'}</span>
                          {priceList[0].price}
                        </div>
                        {priceList[0].period && priceList[0].period.trim() ? (
                          <span className="text-[10px] text-slate-400 block mt-0.5 break-words whitespace-normal">
                            {priceList[0].period}
                          </span>
                        ) : null}

                        {/* Status Badge */}
                        <div className="mt-1.5 flex justify-center">
                          {priceList[0].status === 'not_ready' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-2.5 h-2.5 text-amber-600" />
                              <span>{priceList[0].statusText || 'รอกด'}</span>
                            </span>
                          ) : priceList[0].status === 'out_of_stock' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                              <XCircle className="w-2.5 h-2.5 text-rose-600" />
                              <span>{priceList[0].statusText || 'หมด'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{priceList[0].statusText || 'พร้อมส่ง'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-300 font-bold text-lg">/</div>

                    <div className={`flex-1 p-2.5 rounded-xl border flex flex-col justify-between ${
                      priceList[1].status === 'out_of_stock'
                        ? 'bg-slate-50 border-slate-200 opacity-75'
                        : priceList[1].status === 'not_ready'
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-white/80 border-purple-100'
                    }`}>
                      <span className="text-[11px] sm:text-xs font-bold text-purple-700 block leading-snug break-words whitespace-normal mb-1">
                        {priceList[1].label || 'ราคาร้าน'}
                      </span>
                      <div>
                        <div className={`font-black text-xl ${priceList[1].status === 'out_of_stock' ? 'text-slate-400 line-through' : 'text-purple-600'}`}>
                          <span className="text-xs font-bold mr-0.5">{product.priceUnit || '฿'}</span>
                          {priceList[1].price}
                        </div>
                        {priceList[1].period && priceList[1].period.trim() ? (
                          <span className="text-[10px] text-slate-400 block mt-0.5 break-words whitespace-normal">
                            {priceList[1].period}
                          </span>
                        ) : null}

                        {/* Status Badge */}
                        <div className="mt-1.5 flex justify-center">
                          {priceList[1].status === 'not_ready' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-2.5 h-2.5 text-amber-600" />
                              <span>{priceList[1].statusText || 'รอกด'}</span>
                            </span>
                          ) : priceList[1].status === 'out_of_stock' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                              <XCircle className="w-2.5 h-2.5 text-rose-600" />
                              <span>{priceList[1].statusText || 'หมด'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{priceList[1].statusText || 'พร้อมส่ง'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="flex flex-col items-center justify-center py-1">
                  <div className="flex items-baseline justify-center gap-1 text-pink-600">
                    {priceList[0]?.label && (
                      <span className="text-xs font-medium text-slate-500 mr-1">{priceList[0].label}</span>
                    )}
                    <span className="text-sm font-bold">{product.priceUnit || '฿'}</span>
                    <span className={`text-3xl font-black ${priceList[0]?.status === 'out_of_stock' ? 'text-slate-400 line-through' : ''}`}>{priceList[0]?.price || product.price}</span>
                    {priceList[0]?.period && priceList[0].period.trim() ? (
                      <span className="text-xs text-slate-500 ml-1">{priceList[0].period}</span>
                    ) : null}
                  </div>
                  {priceList[0]?.status && (
                    <div className="mt-1">
                      {priceList[0].status === 'not_ready' ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{priceList[0].statusText || 'รอกด'}</span>
                        </span>
                      ) : priceList[0].status === 'out_of_stock' ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>{priceList[0].statusText || 'หมด'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{priceList[0].statusText || 'พร้อมส่ง'}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Technical Specs: Separated for Each App or Single Promo */}
          {isPromo ? (
            <div className="space-y-2.5 mb-3.5">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 px-0.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>{isSinglePromo ? 'รายละเอียดโปรโมชั่น' : `สเปกและรายละเอียดแยกตามแอพ (${promoApps.length} แอพ)`}</span>
              </div>

              {isSinglePromo ? (
                /* Single App Promo Specs Card */
                (promoApps[0]?.devices || promoApps[0]?.resolution || product.devices || product.resolution) && (
                  <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-rose-100">
                      <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-rose-200 flex items-center justify-center shrink-0">
                        <img src={promoApps[0]?.icon} alt={promoApps[0]?.name} className="w-full h-full object-contain rounded" />
                      </div>
                      <span className="text-xs font-black text-slate-800">{promoApps[0]?.name || product.name}</span>
                      <span className="ml-auto text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                        โปรพิเศษ
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-[11px] pt-0.5">
                      {(promoApps[0]?.devices || product.devices) && (
                        <div className="flex items-start gap-1.5 text-slate-700">
                          <Monitor className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="font-semibold text-slate-500 shrink-0">รูปแบบ:</span>
                          <span className="font-bold text-slate-800">{promoApps[0]?.devices || product.devices}</span>
                        </div>
                      )}
                      {(promoApps[0]?.resolution || product.resolution) && (
                        <div className="flex items-start gap-1.5 text-slate-700">
                          <Tv className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                          <span className="font-semibold text-slate-500 shrink-0">ความคมชัด / คุณภาพ:</span>
                          <span className="font-medium text-slate-700">{promoApps[0]?.resolution || product.resolution}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : (
                /* Dynamic Apps Specs Cards (2, 3, 4+ apps) */
                promoApps.map((app, idx) => (
                  <div key={app.id || idx} className="p-3 bg-pink-50/50 rounded-2xl border border-pink-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-pink-100">
                      <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-pink-200 flex items-center justify-center shrink-0">
                        <img src={app.icon} alt={app.name} className="w-full h-full object-contain rounded" />
                      </div>
                      <span className="text-xs font-black text-slate-800">{app.name}</span>
                      <span className="ml-auto text-[10px] bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full">
                        แอพที่ {idx + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-[11px] pt-0.5">
                      {app.devices && (
                        <div className="flex items-start gap-1.5 text-slate-700">
                          <Monitor className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                          <span className="font-semibold text-slate-500 shrink-0">อุปกรณ์:</span>
                          <span className="font-bold text-slate-800">{app.devices}</span>
                        </div>
                      )}
                      {app.resolution && (
                        <div className="flex items-start gap-1.5 text-slate-700">
                          <Tv className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                          <span className="font-semibold text-slate-500 shrink-0">ความคมชัด:</span>
                          <span className="font-medium text-slate-700">{app.resolution}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
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
          {product.packageDetails && product.packageDetails.trim() !== '' && (
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
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
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
