import React, { useState } from 'react';
import { X, Sparkles, Flame, FileText, Plus, Trash2, CheckCircle2, Clock, XCircle, Upload, Monitor, Tv, Layers } from 'lucide-react';
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

  // Dynamic Apps List Initialization
  const getInitialApps = () => {
    if (promo?.apps && Array.isArray(promo.apps) && promo.apps.length > 0) {
      return promo.apps.map((a, i) => ({
        id: a.id || `app-${i + 1}-${Date.now()}`,
        name: a.name || '',
        icon: a.icon || APP_ICONS.iqiyi,
        devices: a.devices || '',
        resolution: a.resolution || ''
      }));
    }

    // Support migration from legacy app1, app2, app3
    const legacyList = [];
    if (promo?.app1Name || promo?.app1Icon) {
      legacyList.push({
        id: 'app-1',
        name: promo.app1Name || 'iQIYI',
        icon: promo.app1Icon || APP_ICONS.iqiyi,
        devices: promo.app1Devices || '',
        resolution: promo.app1Resolution || ''
      });
    }
    if (promo?.app2Name || promo?.app2Icon) {
      legacyList.push({
        id: 'app-2',
        name: promo.app2Name || 'Viu',
        icon: promo.app2Icon || APP_ICONS.viu,
        devices: promo.app2Devices || '',
        resolution: promo.app2Resolution || ''
      });
    }
    if (promo?.hasApp3 && (promo?.app3Name || promo?.app3Icon)) {
      legacyList.push({
        id: 'app-3',
        name: promo.app3Name || 'WeTV',
        icon: promo.app3Icon || APP_ICONS.iqiyi,
        devices: promo.app3Devices || '',
        resolution: promo.app3Resolution || ''
      });
    }

    if (legacyList.length > 0) return legacyList;

    // Default for brand new promotion: 2 apps
    return [
      { id: 'app-1', name: 'iQIYI', icon: APP_ICONS.iqiyi, devices: 'ดูพร้อมกันได้ 2 อุปกรณ์', resolution: 'Full HD 1080p' },
      { id: 'app-2', name: 'Viu', icon: APP_ICONS.viu, devices: 'ดูได้ 3 อุปกรณ์ ( ทรส 2 / เว็บ 1 )', resolution: 'Full HD 1080p' }
    ];
  };

  const [apps, setApps] = useState(getInitialApps);

  const [formData, setFormData] = useState(() => ({
    id: promo?.id || `promo-${Math.random().toString(36).slice(2, 9)}`,
    name: promo?.name || '',
    tag: promo?.tag || (getInitialApps().length === 1 ? '⚡ ดีลพิเศษ' : `🔥 โปรเซ็ต ${getInitialApps().length} แอพ`),
    tagColor: promo?.tagColor || 'rose',
    originalPrice: promo?.originalPrice || '',
    promoPrice: promo?.promoPrice || '',
    pricePeriod: promo?.pricePeriod || '/ 7 วัน',
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

  // Handler to add a new app to the combo
  const handleAddApp = () => {
    const nextIdx = apps.length + 1;
    const defaultPreset = presetList[(nextIdx - 1) % presetList.length];
    setApps([
      ...apps,
      {
        id: `app-${Date.now()}`,
        name: defaultPreset ? defaultPreset.name : `App ${nextIdx}`,
        icon: defaultPreset ? defaultPreset.icon : APP_ICONS.iqiyi,
        devices: '',
        resolution: ''
      }
    ]);
  };

  // Handler to remove an app
  const handleRemoveApp = (index) => {
    if (apps.length <= 1) return;
    const updated = apps.filter((_, i) => i !== index);
    setApps(updated);
  };

  // Handler to update an app's field
  const handleUpdateApp = (index, field, value) => {
    const updated = [...apps];
    updated[index] = { ...updated[index], [field]: value };
    setApps(updated);
  };

  // Handler for custom image upload per app
  const handleAppUpload = async (index, file) => {
    if (!file) return;
    try {
      const compressed = await compressImage(file, 500, 0.88);
      handleUpdateApp(index, 'icon', compressed);
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
    if (apps.length === 0) {
      alert('กรุณาเพิ่มอย่างน้อย 1 แอพในโปรโมชั่น');
      return;
    }

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

    const appCount = apps.length;
    const promoType = appCount === 1 ? 'single' : appCount === 2 ? 'dual' : appCount === 3 ? 'triple' : 'combo';

    const finalData = {
      ...formData,
      apps: apps.map((a, idx) => ({
        id: a.id || `app-${idx + 1}`,
        name: (a.name || `App ${idx + 1}`).trim(),
        icon: a.icon || '',
        devices: (a.devices || '').trim(),
        resolution: (a.resolution || '').trim()
      })),
      appCount,
      promoType,
      // Legacy backward compatibility fields
      app1Name: apps[0]?.name || '',
      app1Icon: apps[0]?.icon || '',
      app1Devices: apps[0]?.devices || '',
      app1Resolution: apps[0]?.resolution || '',
      app2Name: apps[1]?.name || '',
      app2Icon: apps[1]?.icon || '',
      app2Devices: apps[1]?.devices || '',
      app2Resolution: apps[1]?.resolution || '',
      hasApp3: apps.length >= 3,
      app3Name: apps[2]?.name || '',
      app3Icon: apps[2]?.icon || '',
      app3Devices: apps[2]?.devices || '',
      app3Resolution: apps[2]?.resolution || '',
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
            เลือกเองได้อย่างอิสระว่าจะรวมกี่แอพเป็นโปรโมชั่น (1 แอพเดี่ยว / 2 แอพคู่ / 3 แอพ / 4 แอพ หรือมากกว่านั้น)
          </p>
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
                  apps.length === 1
                    ? 'เช่น โปรโมชั่น Code Viu Premium 200 Code หรือ Viu รายเดือน'
                    : `เช่น เซ็ตคุ้ม ${apps.length} แอพ: ${apps.map(a => a.name).filter(Boolean).join(' + ')}`
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
                placeholder={apps.length === 1 ? 'เช่น ⚡ ดีลพิเศษ / โค้ดแท้' : `เช่น 🔥 โปรเซ็ต ${apps.length} แอพสุดฮิต`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
              />
            </div>
          </div>

          {/* DYNAMIC APPS BUILDER SECTION */}
          <div className="p-4 bg-gradient-to-r from-pink-50/70 via-white to-purple-50/70 rounded-2xl border border-pink-200 space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-500" />
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                  แอพที่รวมในโปรโมชั่นนี้ (รวมทั้งหมด {apps.length} แอพ)
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                  {apps.length === 1 ? '1 แอพเดี่ยว / ขายโค้ด' : apps.length === 2 ? 'แพ็กคู่ 2 แอพ' : `คอมโบเซ็ต ${apps.length} แอพ`}
                </span>
              </div>

              {/* Quick count selector buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 2, 3, 4].map((cnt) => (
                  <button
                    key={`cnt-${cnt}`}
                    type="button"
                    onClick={() => {
                      if (apps.length === cnt) return;
                      if (apps.length < cnt) {
                        const added = [...apps];
                        while (added.length < cnt) {
                          const idx = added.length + 1;
                          const preset = presetList[(idx - 1) % presetList.length];
                          added.push({
                            id: `app-${Date.now()}-${idx}`,
                            name: preset ? preset.name : `App ${idx}`,
                            icon: preset ? preset.icon : APP_ICONS.iqiyi,
                            devices: '',
                            resolution: ''
                          });
                        }
                        setApps(added);
                      } else {
                        setApps(apps.slice(0, cnt));
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      apps.length === cnt
                        ? 'bg-rose-500 text-white border-rose-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cnt} แอพ
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleAddApp}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 ml-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ เพิ่มแอพ ({apps.length + 1})</span>
                </button>
              </div>
            </div>

            {/* List of App Cards */}
            <div className={`grid grid-cols-1 ${apps.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : apps.length === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'} gap-3.5`}>
              {apps.map((app, index) => (
                <div
                  key={app.id || index}
                  className="p-3 bg-white rounded-2xl border border-pink-100/90 shadow-2xs space-y-2.5 relative flex flex-col justify-between"
                >
                  {/* Top Bar of App Card */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-[11px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      แอพที่ {index + 1}
                    </span>

                    {apps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveApp(index)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="ลบแอพนี้ออกจากโปรโมชั่น"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* App Icon & Name */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 p-1 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                      {app.icon ? (
                        <img src={app.icon} alt={app.name} className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <span className="text-[9px] font-bold text-pink-500">APP {index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] font-bold text-slate-600 block">ชื่อแอพ / แพ็กเกจ</label>
                      <input
                        type="text"
                        value={app.name}
                        onChange={(e) => handleUpdateApp(index, 'name', e.target.value)}
                        placeholder="เช่น iQIYI หรือ Viu โค้ด"
                        className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 focus:border-rose-500 outline-none font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Preset Icons & Upload */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-slate-500 font-medium">เลือกไอคอนสำเร็จรูป หรืออัปโหลดรูปจริง:</div>
                    <div className="grid grid-cols-6 gap-1">
                      {presetList.slice(0, 6).map((p) => (
                        <button
                          key={`app-${index}-preset-${p.key}`}
                          type="button"
                          onClick={() => {
                            handleUpdateApp(index, 'name', app.name || p.name);
                            handleUpdateApp(index, 'icon', p.icon);
                          }}
                          className={`p-1 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                            app.icon === p.icon ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-300' : 'border-slate-200 hover:border-pink-300 bg-slate-50'
                          }`}
                          title={p.name}
                        >
                          <img src={p.icon} alt={p.name} className="w-4 h-4 object-contain" />
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <label className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg cursor-pointer transition-colors">
                        <Upload className="w-3 h-3" />
                        <span>อัปโหลดรูปจริง</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAppUpload(index, e.target.files?.[0])}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="url"
                        value={app.icon?.startsWith('http') ? app.icon : ''}
                        onChange={(e) => handleUpdateApp(index, 'icon', e.target.value)}
                        placeholder="หรือวางลิงก์รูป..."
                        className="flex-1 px-2 py-0.5 text-[10px] rounded-lg border border-slate-200 focus:border-rose-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Specs Inputs */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">
                        จำนวนอุปกรณ์ ({app.name || `แอพที่ ${index + 1}`})
                      </label>
                      <input
                        type="text"
                        value={app.devices}
                        onChange={(e) => handleUpdateApp(index, 'devices', e.target.value)}
                        placeholder="เช่น ดูพร้อมกันได้ 2 อุปกรณ์ หรือ ส่งแบบโค้ด"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-rose-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">
                        ความคมชัด / คุณภาพ ({app.name || `แอพที่ ${index + 1}`})
                      </label>
                      <input
                        type="text"
                        value={app.resolution}
                        onChange={(e) => handleUpdateApp(index, 'resolution', e.target.value)}
                        placeholder="เช่น Full HD 1080p ไม่มีโฆษณาคั่น"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-rose-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add App Button */}
            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={handleAddApp}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-pink-50 text-rose-600 border border-dashed border-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:border-rose-500 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ เพิ่มแอพเข้าไปในโปรโมชั่นนี้อีก (แอพที่ {apps.length + 1})</span>
              </button>
            </div>
          </div>

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
                          label: apps.length === 1 ? '50 โค้ด' : 'เรท 1',
                          price: formData.promoPrice || '',
                          period: formData.pricePeriod || '',
                          status: 'ready',
                          statusText: ''
                        },
                        {
                          id: `promo-price-2`,
                          label: apps.length === 1 ? '100 โค้ด' : 'เรท 2',
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
                    กำหนดหลายเรทราคา (เช่น จำนวนโค้ด 50/100/200 โค้ด หรือเรทวัน)
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

                {/* Bulk Status for All Promo Rates */}
                {prices.length > 1 && (
                  <div className="flex items-center justify-between bg-white/90 p-2 rounded-xl border border-rose-200 flex-wrap gap-2">
                    <span className="text-[11px] font-bold text-slate-700">
                      ⚡ ปรับสถานะทุกเรท ({prices.length} เรท) พร้อมกัน:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setPrices(prices.map((p) => ({ ...p, status: 'ready' })))}
                        className="px-2 py-0.5 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg cursor-pointer transition-all active:scale-95"
                      >
                        🟢 พร้อมส่งทั้งหมด
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrices(prices.map((p) => ({ ...p, status: 'not_ready' })))}
                        className="px-2 py-0.5 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg cursor-pointer transition-all active:scale-95"
                      >
                        🟠 รอกดทั้งหมด
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrices(prices.map((p) => ({ ...p, status: 'out_of_stock' })))}
                        className="px-2 py-0.5 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg cursor-pointer transition-all active:scale-95"
                      >
                        🔴 หมดทั้งหมด
                      </button>
                    </div>
                  </div>
                )}

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
                          placeholder="เช่น 50 โค้ด หรือ 7 วัน"
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

                    {/* Per-Price Tier Status Bar (Dropdown) */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 flex-wrap gap-2">
                      <label className="text-[11px] font-bold text-slate-600">
                        สถานะเรทนี้:
                      </label>

                      <div className="flex items-center gap-1.5">
                        <select
                          value={p.status || 'ready'}
                          onChange={(e) => {
                            const updated = [...prices];
                            updated[idx].status = e.target.value;
                            setPrices(updated);
                          }}
                          className={`px-3 py-1 text-xs font-bold rounded-xl border outline-none cursor-pointer transition-all ${
                            p.status === 'not_ready'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : p.status === 'out_of_stock'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          <option value="ready">🟢 พร้อมส่ง</option>
                          <option value="not_ready">🟠 รอกด / ไม่พร้อมส่ง</option>
                          <option value="out_of_stock">🔴 สินค้าหมด</option>
                        </select>
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
                apps.length === 1
                  ? '• โค้ดแท้ 100% ใช้งานได้ทันที\n• รับประกันตลอดอายุการใช้งาน\n• ซื้อจำนวนมากมีเรทพิเศษ'
                  : `• ได้รับ ${apps.length} แอพพร้อมกัน: ${apps.map(a => a.name).filter(Boolean).join(' + ')}\n• ประหยัดทันที คุ้มกว่าซื้อแยก\n• บัญชีแท้ 100% ดูแลตลอดการใช้งาน`
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

            <div className="flex items-center gap-2">
              <select
                value={formData.stockStatus || (formData.inStock === false ? 'out_of_stock' : 'ready')}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    stockStatus: val,
                    inStock: val === 'ready',
                    stockStatusText: val === 'not_ready' ? 'ไม่พร้อมส่ง' : val === 'out_of_stock' ? 'สินค้าหมด' : 'พร้อมส่ง'
                  });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border outline-none cursor-pointer transition-all ${
                  formData.stockStatus === 'not_ready'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : (formData.stockStatus === 'out_of_stock' || formData.inStock === false)
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
              >
                <option value="ready">🟢 พร้อมส่ง (ลูกค้าสามารถสั่งซื้อได้ทันที)</option>
                <option value="not_ready">🟠 ไม่พร้อมส่ง / รอกด (ต้องรอคิวหรือรอกด)</option>
                <option value="out_of_stock">🔴 สินค้าหมด (ปิดรับออเดอร์ชั่วคราว)</option>
              </select>
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
              {isEditing ? 'บันทึกการแก้ไขโปรโมชั่น' : `สร้างโปรโมชั่น (${apps.length} แอพ) ทันที`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
