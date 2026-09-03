import React from 'react';
import { Eye, Sparkles, CheckCircle2, Clock, XCircle, Tv, Monitor } from 'lucide-react';

export default function ProductCard({ product, onOrder, isAdmin, onEdit, onDelete }) {
  const {
    name,
    category,
    tag,
    tagColor = 'pink',
    devices,
    resolution,
    packageDetails,
    subDetail,
    priceLabel = '',
    price,
    hasSecondPrice,
    secondPriceLabel = '',
    secondPrice,
    priceUnit = '฿',
    pricePeriod = '',
    icon,
    inStock = true,
    stockStatus = 'ready',
    stockStatusText
  } = product;

  // Tag color mapping
  const tagColorClasses = {
    pink: 'bg-pink-100/90 text-pink-700 border-pink-200',
    green: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
    purple: 'bg-purple-100/90 text-purple-700 border-purple-200',
    rose: 'bg-rose-100/90 text-rose-700 border-rose-200',
    blue: 'bg-sky-100/90 text-sky-700 border-sky-200',
    amber: 'bg-amber-100/90 text-amber-800 border-amber-200'
  };

  const badgeClass = tagColorClasses[tagColor] || tagColorClasses.pink;

  return (
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-4.5 border border-pink-100/70 shadow-card hover:shadow-soft-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Admin Quick Action Floating Buttons if in Admin Mode */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-sm p-1 rounded-lg border border-pink-200 shadow-xs">
          <button
            onClick={() => onEdit(product)}
            className="px-2 py-0.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
          >
            แก้ไข
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="px-2 py-0.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
          >
            ลบ
          </button>
        </div>
      )}

      {/* Top Section: App Icon + Tag */}
      <div>
        <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 mb-2 sm:mb-3 border border-slate-100/80 group-hover:scale-[1.02] transition-transform duration-300">
          {icon ? (
            <img
              src={icon}
              alt={name}
              className="w-full h-full object-contain rounded-lg sm:rounded-xl"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-lg bg-pink-100 flex items-center justify-center text-pink-400 font-bold text-base sm:text-xl">
              APP
            </div>
          )}

          {/* Floating Tag Badge */}
          {tag && (
            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
              <span className={`inline-flex items-center gap-0.5 text-[9px] sm:text-xs font-bold px-2 py-0.5 rounded-full border shadow-xs ${badgeClass}`}>
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>{tag}</span>
              </span>
            </div>
          )}
        </div>

        {/* Category Label */}
        {category && (
          <div className="text-[10px] sm:text-xs font-semibold text-pink-500 mb-0.5 line-clamp-1">
            {category}
          </div>
        )}

        {/* App Name */}
        <h4 className="text-xs sm:text-base font-bold text-slate-800 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-snug group-hover:text-pink-600 transition-colors">
          {name}
        </h4>

        {/* Quick Specs (Devices & Resolution if available) */}
        {(devices || resolution) && (
          <div className="mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 flex-wrap text-[9px] sm:text-[11px] text-slate-500">
            {devices && (
              <span className="inline-flex items-center gap-1 bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded-md text-slate-600 max-w-full">
                <Monitor className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-500 shrink-0" />
                <span className="truncate">{devices}</span>
              </span>
            )}
            {resolution && (
              <span className="inline-flex items-center gap-1 bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded-md text-slate-600 max-w-full">
                <Tv className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-500 shrink-0" />
                <span className="truncate">{resolution}</span>
              </span>
            )}
          </div>
        )}

        {/* Sub-detail rate (Like ลูกค้า 56 / ร้าน 59 in reference screenshot) */}
        {subDetail && (
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-1.5 font-medium line-clamp-1">
            {subDetail}
          </p>
        )}

        {/* Extra Package Features */}
        {packageDetails && (
          <p className="text-[9px] sm:text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed whitespace-pre-line">
            {packageDetails}
          </p>
        )}
      </div>

      {/* Bottom Section: Price & View Details Action */}
      <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-3 border-t border-dashed border-pink-100/90">
        <div className="flex items-baseline justify-between mb-2">
          {/* Dynamic Multiple Prices Display */}
          {(() => {
            const priceList = (product.prices && Array.isArray(product.prices) && product.prices.length > 0)
              ? product.prices
              : [
                  { id: '1', label: priceLabel || '', price: price, period: pricePeriod || '' },
                  ...(hasSecondPrice && secondPrice ? [{ id: '2', label: secondPriceLabel || '', price: secondPrice, period: pricePeriod || '' }] : [])
                ];

            if (priceList.length > 2) {
              return (
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                  {priceList.slice(0, 3).map((item, idx) => (
                    <div key={item.id || idx} className="inline-flex items-baseline gap-0.5 text-[9px] sm:text-xs">
                      <span className={`font-medium ${idx === 0 ? 'text-slate-500' : idx === 1 ? 'text-purple-600' : 'text-rose-600'}`}>
                        {item.label || `เรท ${idx + 1}`}:
                      </span>
                      <span className="font-bold text-slate-900">฿{item.price}</span>
                      {idx < Math.min(priceList.length - 1, 2) && <span className="text-slate-300 ml-1">/</span>}
                    </div>
                  ))}
                  {priceList.length > 3 && (
                    <span className="text-[9px] text-pink-600 font-bold bg-pink-50 border border-pink-200 px-1 py-0.2 rounded">
                      +{priceList.length - 3}
                    </span>
                  )}
                </div>
              );
            }

            if (priceList.length === 2) {
              return (
                <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                  <div className="inline-flex items-baseline gap-0.5">
                    <span className="text-[9px] sm:text-xs text-slate-500 font-medium">{priceList[0].label || 'ลูกค้า'}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-pink-500">{priceUnit}</span>
                    <span className="text-sm sm:text-lg font-black text-slate-900 tracking-tight">{priceList[0].price}</span>
                  </div>
                  <span className="text-slate-300 text-xs">/</span>
                  <div className="inline-flex items-baseline gap-0.5">
                    <span className="text-[9px] sm:text-xs text-purple-600 font-medium">{priceList[1].label || 'ร้าน'}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-purple-500">{priceUnit}</span>
                    <span className="text-sm sm:text-lg font-black text-purple-700 tracking-tight">{priceList[1].price}</span>
                  </div>
                </div>
              );
            }

            return (
              <div className="flex items-baseline gap-0.5">
                {priceList[0]?.label && (
                  <span className="text-[9px] sm:text-xs text-slate-500 font-medium mr-0.5">{priceList[0].label}</span>
                )}
                <span className="text-xs sm:text-sm font-semibold text-pink-500">{priceUnit}</span>
                <span className="text-base sm:text-2xl font-black text-slate-900 tracking-tight">
                  {priceList[0]?.price || price}
                </span>
                {priceList[0]?.period && priceList[0].period.trim() ? (
                  <span className="text-[9px] sm:text-xs text-slate-400 font-normal ml-0.5">
                    {priceList[0].period}
                  </span>
                ) : null}
              </div>
            );
          })()}

          <div className="flex items-center text-[9px] sm:text-xs font-bold shrink-0 ml-1">
            {stockStatus === 'not_ready' ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-amber-700 bg-amber-50 border border-amber-200">
                <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                <span>{stockStatusText || 'ไม่พร้อมส่ง'}</span>
              </span>
            ) : (stockStatus === 'out_of_stock' || inStock === false) ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-rose-600 bg-rose-50 border border-rose-200">
                <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
                <span>{stockStatusText || 'สินค้าหมด'}</span>
              </span>
            ) : (
              <span className="flex items-center text-emerald-600">
                <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-500 shrink-0" />
                <span>{stockStatusText || 'พร้อมส่ง'}</span>
              </span>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onOrder(product)}
          className={`w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all duration-200 active:scale-97 cursor-pointer text-white ${
            stockStatus === 'not_ready'
              ? 'bg-gradient-to-r from-amber-500 via-rose-400 to-amber-500 hover:from-amber-600 hover:to-rose-500'
              : 'bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 hover:from-pink-600 hover:to-rose-500'
          }`}
        >
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>ดูรายละเอียด</span>
        </button>
      </div>
    </div>
  );
}
