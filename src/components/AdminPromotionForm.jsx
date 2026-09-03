import React, { useState } from 'react';
import { X, Sparkles, Flame, FileText, Plus, Trash2, CheckCircle2, Clock, XCircle, Upload, Monitor, Tv } from 'lucide-react';
import { APP_ICONS } from '../data/initialData';
import { compressImage } from '../utils/imageCompressor';

export default function AdminPromotionForm({ promo, onSave, onClose }) {
  const isEditing = !!promo;

  const presetList = [
    { key: 'iqiyi', name: 'iQIYI', icon: APP_ICONS.iqiyi },
    { key: 'viu', name: 'Viu', icon: APP_ICONS.viu },
    { key: 'netflix', name: 'Netflix', icon: APP_ICONS.netflix },
    { key: 'youtube', name: 'YouTube', icon: APP_ICONS.youtube },
    { key: 'spotify', name: 'Spotify', icon: APP_ICONS.spotify },
    { key: 'disney', name: 'Disney+', icon: APP_ICONS.disney },
    { key: 'canva', name: 'Canva', icon: APP_ICONS.canva },
    { key: 'youku', name: 'Youku', icon: APP_ICONS.youku },
    { key: 'chatgpt', name: 'ChatGPT', icon: APP_ICONS.chatgpt },
    { key: 'capcut', name: 'CapCut', icon: APP_ICONS.capcut },
    { key: 'otp', name: 'OTP', icon: APP_ICONS.otp }
  ];

  const getInitialPromoType = () => {
    if (promo?.promoType) return promo.promoType;
    if (promo?.appCount === 1 || promo?.isSingleApp || (promo && !promo.app2Name)) return 'single';
    if (promo?.hasApp3 || promo?.appCount === 3) return 'triple';
    return 'dual';
  };

  const [promoType, setPromoType] = useState(getInitialPromoType);
  const [customSingleUrl, setCustomSingleUrl] = useState('');

  const [formData, setFormData] = useState(() => ({
    id: promo?.id || `promo-${Math.random().toString(36).slice(2, 9)}`,
    name: promo?.name || '',
    tag: promo?.tag || (getInitialPromoType() === 'single' ? '⚡ ดีลพิเศษ' : '🔥 โปรคู่สุดคุ้ม'),
    tagColor: promo?.tagColor || 'rose',
    app1Name: promo?.app1Name || (getInitialPromoType() === 'single' ? 'Viu' : 'iQIYI'),
    app1Icon: promo?.app1Icon || (getInitialPromoType() === 'single' ? APP_ICONS.viu : APP_ICONS.iqiyi),
    app1Devices: promo?.app1Devices || '',
    app1Resolution: promo?.app1Resolution || '',
    app2Name: promo?.app2Name || 'Viu',
    app2Icon: promo?.app2Icon || APP_ICONS.viu,
    app2Devices: promo?.app2Devices || '',
    app2Resolution: promo?.app2Resolution || '',
    hasApp3: Boolean(promo?.hasApp3 || promo?.app3Name),
    app3Name: promo?.app3Name || 'WeTV',
    app3Icon: promo?.app3Icon || APP_ICONS.iqiyi,
    app3Devices: promo?.app3Devices || '',
    app3Resolution: promo?.app3Resolution || '',
    originalPrice: promo?.originalPrice || '',
    promoPrice: promo?.promoPrice || '',
    pricePeriod: promo?.pricePeriod || '',
    devices: promo?.devices || '',
    resolution: promo?.resolution || '',
    packageDetails: promo?.packageDetails || '',
    orderLink: promo?.orderLink || '',
    inStock: promo?.inStock !== false,
    stockStatus: promo?.stockStatus || (promo?.inStock === false ? 'out_of_stock' : 'ready'),
    stockStatusText: promo?.stockStatusText || ''
  }));

  // Dynamic price tiers support for promotions (e.g. 50 codes, 100 codes, 200 codes)
  const getInitialPrices = () => {
    if (promo?.prices && Array.isArray(promo.prices) && promo.prices.length > 0) {
      return promo.prices.map((p, idx) => ({
        id: p.id || `promo-price-${idx}-${Date.now()}`,
        label: p.label || `เรท ${idx + 1}`,
        price: p.price || '',
        period: p.period || '',
        status: p.status || 'ready',
        statusText: p.statusText || ''
      }));
    }
    return [];
  };

  const [prices, setPrices] = useState(getInitialPrices);
  const [hasMultiplePrices, setHasMultiplePrices] = useState(() => Boolean(promo?.prices && promo.prices.length > 0));

  const handleApp1Upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 600, 0.9);
      setFormData((prev) => ({ ...prev, app1Icon: compressed }));
    } catch (err) {
      alert(err.message || 'ไม่สามารถประมวลผลรูปภาพได้');
    }
  };

  const handleApp2Upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 400, 0.88);
      setFormData((prev) => ({ ...prev, app2Icon: compressed }));
    } catch (err) {
      alert(err.message || 'ไม่สามารถประมวลผลรูปภาพได้');
    }
  };

  const handleApp3Upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 400, 0.88);
      setFormData((prev) => ({ ...prev, app3Icon: compressed }));
    } catch (err) {
      alert(err.message || 'ไม่สามารถประมวลผลรูปภาพได้');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('กรุณากรอกชื่อโปรโมชั่น');
      return;
    }

    const isSingle = promoType === 'single';
    const isTriple = promoType === 'triple';

    let validPrices = [];
    let mainPromoPrice = formData.promoPrice;

    if (hasMultiplePrices) {
      validPrices = prices.filter((p) => p.price && String(p.price).trim() !== '');
      if (validPrices.length === 0) {
        alert('กรุณากรอกราคาอย่างน้อย 1 เรท');
        return;
      }
      mainPromoPrice = validPrices[0].price;
    } else {
      if (!formData.promoPrice.trim()) {
        alert('กรุณากรอกราคาโปรโมชั่น');
        return;
      }
    }

    const finalData = {
      ...formData,
      promoType,
      appCount: isSingle ? 1 : isTriple ? 3 : 2,
      hasApp3: isTriple,
      app2Name: isSingle ? '' : formData.app2Name,
      app2Icon: isSingle ? '' : formData.app2Icon,
      app3Name: isTriple ? formData.app3Name : '',
      app3Icon: isTriple ? formData.app3Icon : '',
      promoPrice: mainPromoPrice,
      prices: hasMultiplePrices ? validPrices.map((p, idx) => ({
        id: p.id || `promo-price-${idx + 1}`,
        label: (p.label || `เรท ${idx + 1}`).trim(),
        price: String(p.price).trim(),
        period: (p.period || '').trim(),
        status: p.status || 'ready',
        statusText: (p.statusText || '').trim()
      })) : [],
      packageDetails: formData.packageDetails?.trim() || ''
    };

    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl sm:max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-pink-100 my-auto relative max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-3 pr-8">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <span>{isEditing ? 'แก้ไขโปรโมชั่น' : 'สร้างโปรโมชั่นใหม่'}</span>
          </h3>
          <p className="text-xs text-slate-500">
            สร้างได้ทั้งแอพเดี่ยว (เช่น ขาย Code Viu หลักร้อยโค้ด), แพ็กคู่ หรือคอมโบเซ็ต 3 แอพ
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl mb-3.5 border border-slate-200/70">
          <button
            type="button"
            onClick={() => {
              setPromoType('single');
              if (!formData.tag || formData.tag.includes('คู่')) {
                setFormData(prev => ({ ...prev, tag: '⚡ ดีลพิเศษ' }));
              }
            }}
            className={`flex-1 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              promoType === 'single'
                ? 'bg-white text-rose-600 shadow-sm border border-rose-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📱 1 แอพ (เดี่ยว / ขายโค้ด)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPromoType('dual');
              if (!formData.tag || formData.tag.includes('ดีลพิเศษ')) {
                setFormData(prev => ({ ...prev, tag: '🔥 โปรคู่สุดคุ้ม' }));
              }
            }}
            className={`flex-1 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              promoType === 'dual'
                ? 'bg-white text-rose-600 shadow-sm border border-rose-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🎁 2 แอพ (แพ็กคู่)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPromoType('triple');
              if (!formData.tag || formData.tag.includes('ดีลพิเศษ')) {
                setFormData(prev => ({ ...prev, tag: '🚀 คอมโบ 3 แอพ' }));
              }
            }}
            className={`flex-1 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              promoType === 'triple'
                ? 'bg-white text-rose-600 shadow-sm border border-rose-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🚀 3 แอพ (คอมโบเซ็ต)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
          {/* Promo Name & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                ชื่อโปรโมชั่น <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={
                  promoType === 'single'
                    ? 'เช่น โปรโมชั่น Code Viu Premium 200 Code หรือ Viu รายเดือน'
                    : 'เช่น แพ็กคู่สุดคุ้ม: iQIYI (7 วัน) + Viu Premium (7 วัน)'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-none font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ป้ายกำกับโปรโมชั่น
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder={promoType === 'single' ? 'เช่น ⚡ ดีลพิเศษ / โค้ดแท้' : 'เช่น 🔥 โปรคู่สุดฮิต'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
              />
            </div>
          </div>

          {/* Apps Selection Box based on promoType */}
          {promoType === 'single' ? (
            /* SINGLE APP PROMO BOX */
            <div className="p-4 bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-rose-50/70 rounded-2xl border border-rose-200 space-y-3.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>ข้อมูลแอพและรูปภาพโลโก้โปรโมชั่นเดี่ยว</span>
                </h4>
                <span className="text-[11px] text-rose-600 font-medium">ใส่รูปโลโก้แอพจริงได้พอดี</span>
              </div>

              {/* Logo / Image Uploader Box */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-white rounded-2xl border border-rose-100 shadow-xs">
                {/* Logo Preview */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border-2 border-rose-200 flex items-center justify-center p-2 shadow-xs shrink-0 overflow-hidden">
                  {formData.app1Icon ? (
                    <img src={formData.app1Icon} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <Sparkles className="w-8 h-8 text-rose-300" />
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 w-full space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs active:scale-95">
                      <Upload className="w-4 h-4" />
                      <span>อัปโหลดรูปภาพ / โลโก้จริง</span>
                      <input type="file" accept="image/*" onChange={handleApp1Upload} className="hidden" />
                    </label>

                    <input
                      type="url"
                      value={customSingleUrl}
                      onChange={(e) => {
                        setCustomSingleUrl(e.target.value);
                        if (e.target.value) setFormData((prev) => ({ ...prev, app1Icon: e.target.value }));
                      }}
                      placeholder="หรือวางลิงก์รูปภาพ (Image URL)..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-rose-500 outline-none bg-white"
                    />
                  </div>

                  {/* Preset quick picker */}
                  <div className="pt-1.5">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">หรือเลือกจากไอคอนระบบ:</div>
                    <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
                      {presetList.map((p) => (
                        <button
                          key={`single-${p.key}`}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, app1Icon: p.icon, app1Name: prev.app1Name || p.name }))}
                          className={`p-1 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                            formData.app1Icon === p.icon ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200 scale-105' : 'border-slate-200 hover:border-rose-300 bg-slate-50'
                          }`}
                          title={p.name}
                        >
                          <img src={p.icon} alt={p.name} className="w-6 h-6 object-contain" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Single App Name & Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">ชื่อแอพ / แพ็กเกจ</label>
                  <input
                    type="text"
                    value={formData.app1Name}
                    onChange={(e) => setFormData({ ...formData, app1Name: e.target.value })}
                    placeholder="เช่น Viu Premium Code"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-rose-500 outline-none font-semibold bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Monitor className="w-3.5 h-3.5 text-rose-500" />
                    <span>จำนวนอุปกรณ์ / รูปแบบการส่ง</span>
                  </label>
                  <input
                    type="text"
                    value={formData.app1Devices}
                    onChange={(e) => setFormData({ ...formData, app1Devices: e.target.value })}
                    placeholder="เช่น ส่งแบบ Code / รอกด 5-10 นาที"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-rose-500 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Tv className="w-3.5 h-3.5 text-purple-500" />
                    <span>ความคมชัด / คุณภาพ</span>
                  </label>
                  <input
                    type="text"
                    value={formData.app1Resolution}
                    onChange={(e) => setFormData({ ...formData, app1Resolution: e.target.value })}
                    placeholder="เช่น Full HD 1080p ไม่มีโฆษณา"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-rose-500 outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* DUAL OR TRIPLE APP COMBO BOX */
            <div className="p-4 bg-gradient-to-r from-pink-50/60 via-white to-purple-50/60 rounded-2xl border border-pink-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>เลือกแอพที่จะจัดเซ็ตโปรโมชั่น ({promoType === 'triple' ? '3 แอพ' : '2 แอพ'})</span>
                </h4>
              </div>

              <div className={`grid grid-cols-1 ${promoType === 'triple' ? 'md:grid-cols-3' : 'sm:grid-cols-2'} gap-3.5`}>
                {/* App 1 Selector */}
                <div className="p-3 bg-white rounded-xl border border-pink-100 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 p-1 border border-slate-200 flex items-center justify-center shrink-0">
                      {formData.app1Icon ? (
                        <img src={formData.app1Icon} alt={formData.app1Name} className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <span className="text-[9px] font-bold text-pink-500">APP 1</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-[11px] font-bold text-slate-700 block">แอพที่ 1 (App 1)</label>
                      <input
                        type="text"
                        value={formData.app1Name}
                        onChange={(e) => setFormData({ ...formData, app1Name: e.target.value })}
                        placeholder="เช่น iQIYI"
                        className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 focus:border-pink-500 outline-none font-semibold"
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-medium">เลือกไอคอนสำเร็จรูป หรือเลือกไฟล์:</div>
                  <div className="grid grid-cols-5 gap-1">
                    {presetList.slice(0, 5).map((p) => (
                      <button
                        key={`app1-${p.key}`}
                        type="button"
                        onClick={() => setFormData({ ...formData, app1Name: p.name, app1Icon: p.icon })}
                        className="p-1 rounded-lg border border-slate-200 hover:border-pink-400 bg-slate-50 flex items-center justify-center cursor-pointer"
                        title={p.name}
                      >
                        <img src={p.icon} alt={p.name} className="w-5 h-5 object-contain" />
                      </button>
                    ))}
                  </div>
                  <label className="inline-block text-[10px] text-pink-600 hover:underline cursor-pointer">
                    + อัปโหลดไอคอนแอพที่ 1
                    <input type="file" accept="image/*" onChange={handleApp1Upload} className="hidden" />
                  </label>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">
                        จำนวนอุปกรณ์ ({formData.app1Name || 'App 1'})
                      </label>
                      <input
                        type="text"
                        value={formData.app1Devices}
                        onChange={(e) => setFormData({ ...formData, app1Devices: e.target.value })}
                        placeholder="เช่น ดูพร้อมกันได้ 2 อุปกรณ์"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-pink-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">
                        ความคมชัด ({formData.app1Name || 'App 1'})
                      </label>
                      <input
                        type="text"
                        value={formData.app1Resolution}
                        onChange={(e) => setFormData({ ...formData, app1Resolution: e.target.value })}
                        placeholder="เช่น Full HD 1080p คมชัดระดับสูง"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-pink-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* App 2 Selector */}
                <div className="p-3 bg-white rounded-xl border border-purple-100 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 p-1 border border-slate-200 flex items-center justify-center shrink-0">
                      {formData.app2Icon ? (
                        <img src={formData.app2Icon} alt={formData.app2Name} className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <span className="text-[9px] font-bold text-purple-500">APP 2</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-[11px] font-bold text-slate-700 block">แอพที่ 2 (App 2)</label>
                      <input
                        type="text"
                        value={formData.app2Name}
                        onChange={(e) => setFormData({ ...formData, app2Name: e.target.value })}
                        placeholder="เช่น Viu"
                        className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 focus:border-purple-500 outline-none font-semibold"
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-medium">เลือกไอคอนสำเร็จรูป หรือเลือกไฟล์:</div>
                  <div className="grid grid-cols-5 gap-1">
                    {presetList.slice(0, 5).map((p) => (
                      <button
                        key={`app2-${p.key}`}
                        type="button"
                        onClick={() => setFormData({ ...formData, app2Name: p.name, app2Icon: p.icon })}
                        className="p-1 rounded-lg border border-slate-200 hover:border-purple-400 bg-slate-50 flex items-center justify-center cursor-pointer"
                        title={p.name}
                      >
                        <img src={p.icon} alt={p.name} className="w-5 h-5 object-contain" />
                      </button>
                    ))}
                  </div>
                  <label className="inline-block text-[10px] text-purple-600 hover:underline cursor-pointer">
                    + อัปโหลดไอคอนแอพที่ 2
                    <input type="file" accept="image/*" onChange={handleApp2Upload} className="hidden" />
                  </label>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">
                        จำนวนอุปกรณ์ ({formData.app2Name || 'App 2'})
                      </label>
                      <input
                        type="text"
                        value={formData.app2Devices}
                        onChange={(e) => setFormData({ ...formData, app2Devices: e.target.value })}
                        placeholder="เช่น ดูได้ 3 อุปกรณ์ ( ทรส 2 / เว็บ 1 )"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">
                        ความคมชัด ({formData.app2Name || 'App 2'})
                      </label>
                      <input
                        type="text"
                        value={formData.app2Resolution}
                        onChange={(e) => setFormData({ ...formData, app2Resolution: e.target.value })}
                        placeholder="เช่น Full HD 1080p ไม่มีโฆษณาคั่น"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* App 3 Selector (Triple mode) */}
                {promoType === 'triple' && (
                  <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 p-1 border border-slate-200 flex items-center justify-center shrink-0">
                        {formData.app3Icon ? (
                          <img src={formData.app3Icon} alt={formData.app3Name} className="w-full h-full object-contain rounded-lg" />
                        ) : (
                          <span className="text-[9px] font-bold text-indigo-500">APP 3</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="text-[11px] font-bold text-slate-700 block">แอพที่ 3 (App 3)</label>
                        <input
                          type="text"
                          value={formData.app3Name}
                          onChange={(e) => setFormData({ ...formData, app3Name: e.target.value })}
                          placeholder="เช่น WeTV"
                          className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 outline-none font-semibold"
                        />
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 font-medium">เลือกไอคอนสำเร็จรูป หรือเลือกไฟล์:</div>
                    <div className="grid grid-cols-5 gap-1">
                      {presetList.slice(0, 5).map((p) => (
                        <button
                          key={`app3-${p.key}`}
                          type="button"
                          onClick={() => setFormData({ ...formData, app3Name: p.name, app3Icon: p.icon })}
                          className="p-1 rounded-lg border border-slate-200 hover:border-indigo-400 bg-slate-50 flex items-center justify-center cursor-pointer"
                          title={p.name}
                        >
                          <img src={p.icon} alt={p.name} className="w-5 h-5 object-contain" />
                        </button>
                      ))}
                    </div>
                    <label className="inline-block text-[10px] text-indigo-600 hover:underline cursor-pointer">
                      + อัปโหลดไอคอนแอพที่ 3
                      <input type="file" accept="image/*" onChange={handleApp3Upload} className="hidden" />
                    </label>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block">
                          จำนวนอุปกรณ์ ({formData.app3Name || 'App 3'})
                        </label>
                        <input
                          type="text"
                          value={formData.app3Devices}
                          onChange={(e) => setFormData({ ...formData, app3Devices: e.target.value })}
                          placeholder="เช่น 1 อุปกรณ์ (ดูได้พร้อมกัน)"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block">
                          ความคมชัด ({formData.app3Name || 'App 3'})
                        </label>
                        <input
                          type="text"
                          value={formData.app3Resolution}
                          onChange={(e) => setFormData({ ...formData, app3Resolution: e.target.value })}
                          placeholder="เช่น Full HD 1080p คมชัดระดับสูง"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pricing Section: Single Price OR Multi-tier Prices */}
          <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>กำหนดราคาโปรโมชั่น</span>
              </label>

              {/* Toggle Multi-Tier Pricing Button */}
              <button
                type="button"
                onClick={() => {
                  if (!hasMultiplePrices) {
                    setHasMultiplePrices(true);
                    if (prices.length === 0) {
                      setPrices([
                        {
                          id: `promo-price-1`,
                          label: promoType === 'single' ? '50 โค้ด' : 'เรท 1',
                          price: formData.promoPrice || '',
                          period: formData.pricePeriod || '',
                          status: 'ready',
                          statusText: ''
                        },
                        {
                          id: `promo-price-2`,
                          label: promoType === 'single' ? '100 โค้ด' : 'เรท 2',
                          price: '',
                          period: formData.pricePeriod || '',
                          status: 'ready',
                          statusText: ''
                        }
                      ]);
                    }
                  } else {
                    setHasMultiplePrices(false);
                  }
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-white px-3 py-1.5 rounded-xl border border-rose-200 hover:border-rose-300 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
              >
                {hasMultiplePrices ? 'สลับเป็นราคาเดี่ยว' : '+ เพิ่มหลายเรทราคา / หลายจำนวนโค้ด'}
              </button>
            </div>

            {!hasMultiplePrices ? (
              /* Single Pricing Row */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ราคาปกติ (ก่อนลด - ไม่บังคับ)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">฿</span>
                    <input
                      type="text"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="เช่น 30 หรือ 200"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-rose-500 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">จะแสดงเป็นตัวเลขขีดฆ่า</p>
                </div>

                <div>
                  <label className="block font-semibold text-rose-700 mb-1">
                    ราคาโปรโมชั่นพิเศษ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-500 font-bold">฿</span>
                    <input
                      type="text"
                      required={!hasMultiplePrices}
                      value={formData.promoPrice}
                      onChange={(e) => setFormData({ ...formData, promoPrice: e.target.value })}
                      placeholder="เช่น 25 หรือ 180"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border-2 border-rose-400 bg-white focus:border-rose-600 outline-none font-bold text-rose-700 text-base"
                    />
                  </div>
                  <p className="text-[10px] text-rose-500 mt-0.5 font-medium">ราคาจริงที่ลูกค้าต้องจ่าย</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ระยะเวลา / รายละเอียดราคา
                  </label>
                  <input
                    type="text"
                    value={formData.pricePeriod}
                    onChange={(e) => setFormData({ ...formData, pricePeriod: e.target.value })}
                    placeholder="เช่น / 7 วัน หรือ / โค้ด"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-rose-500 outline-none"
                  />
                </div>
              </div>
            ) : (
              /* Dynamic Multi-tier Pricing List */
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    กำหนดหลายเรทราคา (เช่น จำนวนโค้ด 50/100/200 โค้ด)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPrices([
                        ...prices,
                        {
                          id: `promo-price-${Date.now()}`,
                          label: `${(prices.length + 1) * 50} โค้ด`,
                          price: '',
                          period: prices[0]?.period || '',
                          status: 'ready',
                          statusText: ''
                        }
                      ]);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ เพิ่มเรทราคา ({prices.length + 1})</span>
                  </button>
                </div>

                {prices.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-3 bg-white rounded-xl border border-rose-200 shadow-2xs space-y-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          ชื่อเรท / จำนวนโค้ด
                        </label>
                        <input
                          type="text"
                          value={p.label}
                          onChange={(e) => {
                            const updated = [...prices];
                            updated[idx].label = e.target.value;
                            setPrices(updated);
                          }}
                          placeholder="เช่น 50 โค้ด หรือ 100 โค้ด"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-rose-500 outline-none text-xs bg-white font-semibold"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-rose-600 mb-1">
                          ราคา <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-1">
                          <span className="text-rose-500 font-bold">฿</span>
                          <input
                            type="text"
                            required
                            value={p.price}
                            onChange={(e) => {
                              const updated = [...prices];
                              updated[idx].price = e.target.value;
                              setPrices(updated);
                            }}
                            placeholder="เช่น 450"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-rose-500 outline-none font-bold text-rose-700 text-xs bg-white"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">หน่วยเวลา/แพ็ก</label>
                        <input
                          type="text"
                          value={p.period}
                          onChange={(e) => {
                            const updated = [...prices];
                            updated[idx].period = e.target.value;
                            setPrices(updated);
                          }}
                          placeholder="เช่น / 30 วัน หรือเว้นว่างได้"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-rose-500 outline-none text-xs bg-white"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end pt-1 sm:pt-4">
                        {prices.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = prices.filter((_, i) => i !== idx);
                              setPrices(updated);
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="ลบเรทนี้"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Per-Price Tier Status Bar */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                        <span>สถานะเรทนี้:</span>
                        {p.status === 'not_ready' ? (
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            รอกด / ไม่พร้อมส่ง
                          </span>
                        ) : p.status === 'out_of_stock' ? (
                          <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            หมด
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            พร้อมส่ง
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...prices];
                            updated[idx].status = 'ready';
                            setPrices(updated);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            p.status === 'ready' || !p.status
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>พร้อมส่ง</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...prices];
                            updated[idx].status = 'not_ready';
                            setPrices(updated);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            p.status === 'not_ready'
                              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>รอกด</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...prices];
                            updated[idx].status = 'out_of_stock';
                            setPrices(updated);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            p.status === 'out_of_stock'
                              ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <XCircle className="w-3 h-3" />
                          <span>หมด</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Multiline Package Details */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-pink-500" />
              <span>รายละเอียดเงื่อนไขโปรโมชั่น (กด Enter เพื่อขึ้นบรรทัดใหม่)</span>
            </label>
            <textarea
              rows={3}
              value={formData.packageDetails}
              onChange={(e) => setFormData({ ...formData, packageDetails: e.target.value })}
              placeholder={
                promoType === 'single'
                  ? '• โค้ดแท้ 100% ใช้งานได้ทันที\n• รับประกันตลอดอายุการใช้งาน\n• ซื้อจำนวนมากมีเรทพิเศษ'
                  : '• ได้รับ 2 แอพพร้อมกัน: iQIYI 7 วัน + Viu 7 วัน\n• ประหยัดทันที คุ้มกว่าซื้อแยก\n• บัญชีแท้ 100% ดูแลตลอดการใช้งาน'
              }
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-rose-500 outline-none text-xs leading-relaxed font-sans"
            />
          </div>

          {/* Specific Order Link (Optional) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ลิงก์สั่งซื้อเฉพาะโปรโมชั่นนี้ (ไม่บังคับ - ถ้าเว้นว่างจะใช้ LINE ของร้าน)
            </label>
            <input
              type="url"
              value={formData.orderLink}
              onChange={(e) => setFormData({ ...formData, orderLink: e.target.value })}
              placeholder="เช่น ลิงก์ห้อง LINE ส่วนตัว หรือ ฟอร์มสั่งซื้อ"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-rose-500 outline-none text-xs"
            />
          </div>

          {/* Promotion Stock Status & Availability */}
          <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                <span>สถานะโปรโมชั่นรวมและความพร้อมส่ง</span>
              </label>
              <span className="text-[11px] text-slate-500">กำหนดสถานะที่แสดงหน้าร้าน</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, inStock: true, stockStatus: 'ready' })}
                className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  formData.stockStatus === 'ready' || (formData.inStock && !formData.stockStatus)
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>พร้อมส่ง</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, inStock: false, stockStatus: 'not_ready' })}
                className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  formData.stockStatus === 'not_ready'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>ไม่พร้อมส่ง (รอกด)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, inStock: false, stockStatus: 'out_of_stock' })}
                className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  formData.stockStatus === 'out_of_stock'
                    ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>สินค้าหมด</span>
              </button>
            </div>

            {/* Custom status text */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                ข้อความสถานะเพิ่มเติม (ไม่บังคับ เช่น รอกด, Code รอ 1 ชม., รอคิว):
              </label>
              <input
                type="text"
                value={formData.stockStatusText || ''}
                onChange={(e) => setFormData({ ...formData, stockStatusText: e.target.value })}
                placeholder={
                  formData.stockStatus === 'not_ready'
                    ? 'เช่น ไม่พร้อมส่ง หรือ รอกด (เว้นว่างไว้จะแสดงคำว่า ไม่พร้อมส่ง)'
                    : formData.stockStatus === 'out_of_stock'
                    ? 'เช่น สินค้าหมด หรือ หมดชั่วคราว'
                    : 'เช่น พร้อมส่ง (เว้นว่างได้)'
                }
                className="w-full px-3 py-1.5 rounded-xl border border-rose-200 focus:border-rose-500 outline-none text-xs bg-white"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {isEditing ? 'บันทึกการแก้ไขโปรโมชั่น' : 'สร้างโปรโมชั่นทันที'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
