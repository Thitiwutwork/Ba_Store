import React from 'react';
import { Eye, Sparkles, CheckCircle2, Tv, Monitor } from 'lucide-react';

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
    priceLabel = 'ลูกค้า',
    price,
    hasSecondPrice,
    secondPriceLabel = 'ร้าน',
    secondPrice,
    priceUnit = '฿',
    pricePeriod = '/ เดือน',
    icon,
    inStock = true
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
    <div className="group relative bg-white rounded-2xl p-3 sm:p-3.5 border border-pink-100/70 shadow-card hover:shadow-soft-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Admin Quick Action Floating Buttons if in Admin Mode */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-pink-200 shadow-xs">
          <button
            onClick={() => onEdit(product)}
            className="px-2 py-0.5 text-[11px] font-medium text-blue-600 hover:bg-blue-50 rounded"
          >
            แก้ไข
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="px-2 py-0.5 text-[11px] font-medium text-rose-600 hover:bg-rose-50 rounded"
          >
            ลบ
          </button>
        </div>
      )}

      {/* Top Section: App Icon + Tag */}
      <div>
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 mb-2.5 border border-slate-100/80 group-hover:scale-[1.02] transition-transform duration-300">
          {icon ? (
            <img
              src={icon}
              alt={name}
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-lg bg-pink-100 flex items-center justify-center text-pink-400 font-bold text-lg">
              APP
            </div>
          )}

          {/* Floating Tag Badge */}
          {tag && (
            <div className="absolute top-2 left-2">
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-xs ${badgeClass}`}>
                <Sparkles className="w-2.5 h-2.5" />
                {tag}
              </span>
            </div>
          )}
        </div>

        {/* Category Label */}
        {category && (
          <div className="text-[11px] font-medium text-pink-500 mb-0.5 line-clamp-1">
            {category}
          </div>
        )}

        {/* App Name */}
        <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 min-h-[2rem] leading-snug group-hover:text-pink-600 transition-colors">
          {name}
        </h4>

        {/* Quick Specs (Devices & Resolution if available) */}
        {(devices || resolution) && (
          <div className="mt-1 flex items-center gap-1.5 flex-wrap text-[10px] text-slate-500">
            {devices && (
              <span className="inline-flex items-center gap-0.5 bg-slate-100/80 px-1.5 py-0.5 rounded text-slate-600">
                <Monitor className="w-2.5 h-2.5 text-pink-500" />
                <span className="truncate max-w-[120px]">{devices}</span>
              </span>
            )}
            {resolution && (
              <span className="inline-flex items-center gap-0.5 bg-slate-100/80 px-1.5 py-0.5 rounded text-slate-600">
                <Tv className="w-2.5 h-2.5 text-purple-500" />
                <span className="truncate max-w-[90px]">{resolution}</span>
              </span>
            )}
          </div>
        )}

        {/* Sub-detail rate (Like ลูกค้า 56 / ร้าน 59 in reference screenshot) */}
        {subDetail && (
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium line-clamp-1">
            {subDetail}
          </p>
        )}

        {/* Extra Package Features (Supports multiline break preview) */}
        {packageDetails && (
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed whitespace-pre-line">
            {packageDetails}
          </p>
        )}
      </div>

      {/* Bottom Section: Price & View Details Action */}
      <div className="mt-3 pt-2.5 border-t border-dashed border-pink-100/90">
        <div className="flex items-baseline justify-between mb-2">
          {/* Dual Price or Single Price */}
          {hasSecondPrice && secondPrice ? (
            <div className="flex items-baseline gap-1 flex-wrap">
              <div className="flex items-baseline gap-0.5">
                <span className="text-[10px] text-slate-500 font-medium">{priceLabel || 'ลูกค้า'}</span>
                <span className="text-[11px] font-bold text-pink-500">{priceUnit}</span>
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{price}</span>
              </div>
              <span className="text-slate-300 text-xs">/</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[10px] text-purple-600 font-medium">{secondPriceLabel || 'ร้าน'}</span>
                <span className="text-[11px] font-bold text-purple-500">{priceUnit}</span>
                <span className="text-base sm:text-lg font-black text-purple-700 tracking-tight">{secondPrice}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-0.5">
              {priceLabel && <span className="text-[10px] text-slate-500 font-medium mr-0.5">{priceLabel}</span>}
              <span className="text-xs font-semibold text-pink-500">{priceUnit}</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {price}
              </span>
              <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                {pricePeriod}
              </span>
            </div>
          )}

          <div className="flex items-center text-[10px] font-medium shrink-0 ml-1">
            {inStock ? (
              <span className="flex items-center text-emerald-600">
                <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-500" />
                <span>พร้อมส่ง</span>
              </span>
            ) : (
              <span className="text-slate-400">หมด</span>
            )}
          </div>
        </div>

        {/* View Details Button (Replaces old order button) */}
        <button
          onClick={() => onOrder(product)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 hover:from-pink-600 hover:to-rose-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all duration-200 active:scale-97 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>ดูรายละเอียด</span>
        </button>
      </div>
    </div>
  );
}
