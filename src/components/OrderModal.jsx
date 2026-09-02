import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Monitor, Tv, FileText, Sparkles } from 'lucide-react';
import { LineIcon } from './SocialIcons';

export default function OrderModal({ product, storeSettings, onClose, onShowToast }) {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const priceText = product.hasSecondPrice && product.secondPrice
    ? `${product.priceLabel || 'ลูกค้า'} ${product.priceUnit || '฿'}${product.price} / ${product.secondPriceLabel || 'ร้าน'} ${product.priceUnit || '฿'}${product.secondPrice}`
    : `${product.priceUnit || '฿'}${product.price} ${product.pricePeriod || ''}`;

  const orderMessage = `สวัสดีค่ะ สนใจสั่งซื้อ ${product.name} (เรท ${priceText}) ค่ะ รบกวนขอรายละเอียดและเลขบัญชีด้วยนะคะ`;

  const handleCopy = () => {
    navigator.clipboard.writeText(orderMessage);
    setCopied(true);
    onShowToast({ type: 'success', message: 'คัดลอกข้อความสำหรับส่งแชทเรียบร้อยแล้ว!' });
    setTimeout(() => setCopied(false), 2500);
  };

  const lineTargetUrl = product.orderLink || storeSettings.lineUrl || 'https://line.me';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-pink-100 relative my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto pr-1">
          {/* Header info */}
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
              <div className="flex items-center gap-1.5 mb-1">
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
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {product.name}
              </h3>
            </div>
          </div>

          {/* Pricing Highlight Box */}
          <div className="my-3.5 p-3 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 rounded-2xl border border-pink-200/80">
            <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>เรทราคาแพ็กเกจ</span>
            </div>

            {product.hasSecondPrice && product.secondPrice ? (
              <div className="flex items-center justify-around gap-2 text-center py-1">
                <div className="flex-1 bg-white/80 p-2 rounded-xl border border-pink-100">
                  <span className="text-[11px] font-medium text-slate-500 block">
                    {product.priceLabel || 'ราคาลูกค้า'}
                  </span>
                  <div className="text-pink-600 font-black text-xl">
                    <span className="text-xs font-bold mr-0.5">{product.priceUnit || '฿'}</span>
                    {product.price}
                  </div>
                  <span className="text-[10px] text-slate-400">{product.pricePeriod}</span>
                </div>

                <div className="text-slate-300 font-bold text-lg">/</div>

                <div className="flex-1 bg-white/80 p-2 rounded-xl border border-purple-100">
                  <span className="text-[11px] font-medium text-purple-600 block">
                    {product.secondPriceLabel || 'ราคาร้าน'}
                  </span>
                  <div className="text-purple-600 font-black text-xl">
                    <span className="text-xs font-bold mr-0.5">{product.priceUnit || '฿'}</span>
                    {product.secondPrice}
                  </div>
                  <span className="text-[10px] text-slate-400">{product.pricePeriod}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline justify-center gap-1 text-pink-600 py-1">
                {product.priceLabel && (
                  <span className="text-xs font-medium text-slate-500 mr-1">{product.priceLabel}</span>
                )}
                <span className="text-sm font-bold">{product.priceUnit || '฿'}</span>
                <span className="text-3xl font-black">{product.price}</span>
                <span className="text-xs text-slate-500 ml-1">{product.pricePeriod}</span>
              </div>
            )}
          </div>

          {/* Technical Specs: Devices & Resolution */}
          <div className="space-y-2 mb-3.5">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                <Monitor className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-700">
                  จำนวนอุปกรณ์ที่รองรับ / ดูพร้อมกันได้
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {product.devices || 'ดูได้ 1 จอ (รองรับทุกอุปกรณ์)'}
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <Tv className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-700">
                  ความคมชัดและระบบเสียง
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {product.resolution || 'ความคมชัดระดับ Full HD 1080p'}
                </div>
              </div>
            </div>
          </div>

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

          {/* Copyable chat message */}
          <div className="mb-4">
            <label className="text-[11px] font-medium text-slate-500 flex items-center justify-between mb-1">
              <span>ข้อความสำหรับส่งในแชท:</span>
              <span className="text-pink-500 text-[10px]">กดคัดลอกได้เลย</span>
            </label>
            <div className="bg-pink-50/70 border border-pink-200/70 rounded-xl p-2.5 text-xs text-slate-700 relative">
              <p className="line-clamp-2 italic pr-8 text-[11px]">{orderMessage}</p>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-white text-pink-600 hover:text-pink-700 rounded-lg shadow-xs hover:bg-pink-50 transition-colors"
                title="คัดลอกข้อความ"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {/* Direct LINE Button */}
            <a
              href={lineTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <LineIcon className="w-5 h-5 shrink-0" />
              <span>สั่งซื้อ / ติดต่อสอบถามผ่าน LINE</span>
              <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-80" />
            </a>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">คัดลอกข้อความเรียบร้อย</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>คัดลอกข้อความสั่งซื้อ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
