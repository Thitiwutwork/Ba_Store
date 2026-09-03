import React, { useState } from 'react';
import { X, Upload, Sparkles, Plus, Trash2, Monitor, Tv, FileText } from 'lucide-react';
import { APP_ICONS, CATEGORIES } from '../data/initialData';
import { compressImage } from '../utils/imageCompressor';

export default function AdminProductForm({ product, onSave, onClose }) {
  const isEditing = !!product;

  const [formData, setFormData] = useState(() => ({
    id: product?.id || `prod-${Math.random().toString(36).slice(2, 9)}`,
    name: product?.name || '',
    category: product?.category || 'ซีรีส์ / หนัง',
    tag: product?.tag || '',
    tagColor: product?.tagColor || 'pink',
    devices: product?.devices || '',
    resolution: product?.resolution || '',
    packageDetails: product?.packageDetails || '',
    subDetail: product?.subDetail || '',
    priceLabel: product?.priceLabel || 'ลูกค้า',
    price: product?.price || '',
    hasSecondPrice: product?.hasSecondPrice ?? false,
    secondPriceLabel: product?.secondPriceLabel || 'ร้าน',
    secondPrice: product?.secondPrice || '',
    priceUnit: product?.priceUnit || '฿',
    pricePeriod: product?.pricePeriod || '',
    icon: product?.icon || APP_ICONS.iqiyi,
    orderLink: product?.orderLink || '',
    inStock: product?.inStock ?? true
  }));

  // Support unlimited dynamic price tiers
  const getInitialPrices = () => {
    if (product?.prices && Array.isArray(product.prices) && product.prices.length > 0) {
      return product.prices.map((p, idx) => ({
        id: p.id || `price-${idx}-${Date.now()}`,
        label: p.label || (idx === 0 ? 'ลูกค้า' : idx === 1 ? 'ร้าน' : `ราคาที่ ${idx + 1}`),
        price: p.price || '',
        period: p.period !== undefined ? p.period : (product?.pricePeriod || '')
      }));
    }
    const list = [
      {
        id: 'price-1',
        label: product?.priceLabel || 'ลูกค้า',
        price: product?.price || '',
        period: product?.pricePeriod || ''
      }
    ];
    if (product?.hasSecondPrice && product?.secondPrice) {
      list.push({
        id: 'price-2',
        label: product?.secondPriceLabel || 'ร้าน',
        price: product?.secondPrice || '',
        period: product?.pricePeriod || ''
      });
    }
    return list;
  };

  const [prices, setPrices] = useState(getInitialPrices);
  const [customUrl, setCustomUrl] = useState('');

  // Handle local file upload (converts to optimized data URL)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 400, 0.88);
      setFormData((prev) => ({ ...prev, icon: compressed }));
    } catch (err) {
      alert(err.message || 'ไม่สามารถประมวลผลรูปภาพได้');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('กรุณากรอกชื่อแอพ');
      return;
    }
    const validPrices = prices.filter((p) => p.price && String(p.price).trim() !== '');
    if (validPrices.length === 0) {
      alert('กรุณากรอกราคาอย่างน้อย 1 ราคา');
      return;
    }

    const cleanedPrices = validPrices.map((p, idx) => ({
      id: p.id || `price-${idx + 1}`,
      label: (p.label || `ราคาที่ ${idx + 1}`).trim(),
      price: String(p.price).trim(),
      period: (p.period || '').trim()
    }));

    const finalData = {
      ...formData,
      prices: cleanedPrices,
      price: cleanedPrices[0].price,
      priceLabel: cleanedPrices[0].label,
      pricePeriod: (cleanedPrices[0].period || '').trim(),
      hasSecondPrice: cleanedPrices.length > 1,
      secondPrice: cleanedPrices.length > 1 ? cleanedPrices[1].price : '',
      secondPriceLabel: cleanedPrices.length > 1 ? cleanedPrices[1].label : ''
    };
    onSave(finalData);
  };

  const presetList = [
    { key: 'iqiyi', name: 'iQIYI', icon: APP_ICONS.iqiyi },
    { key: 'netflix', name: 'Netflix', icon: APP_ICONS.netflix },
    { key: 'youtube', name: 'YouTube', icon: APP_ICONS.youtube },
    { key: 'spotify', name: 'Spotify', icon: APP_ICONS.spotify },
    { key: 'disney', name: 'Disney+', icon: APP_ICONS.disney },
    { key: 'canva', name: 'Canva', icon: APP_ICONS.canva },
    { key: 'viu', name: 'Viu', icon: APP_ICONS.viu },
    { key: 'youku', name: 'Youku', icon: APP_ICONS.youku },
    { key: 'chatgpt', name: 'ChatGPT', icon: APP_ICONS.chatgpt },
    { key: 'capcut', name: 'CapCut', icon: APP_ICONS.capcut }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl sm:max-w-3xl w-full p-5 sm:p-8 shadow-2xl border border-pink-100 my-auto relative max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-pink-100">
          <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {isEditing ? 'แก้ไขข้อมูลแอพพรีเมียม' : 'เพิ่มแอพใหม่เข้าร้าน'}
            </h3>
            <p className="text-xs text-slate-500">
              กรอกข้อมูลแอพ กำหนด 1-2 ราคา พร้อมรายละเอียดอุปกรณ์และความคมชัด
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm">
          {/* App Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ชื่อแอพ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="เช่น Netflix Premium 4K หรือ iQIYI VIP"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
            />
          </div>

          {/* Category & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">หมวดหมู่</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="ซีรีส์ / หนัง">ซีรีส์ / หนัง</option>
                <option value="สตรีมมิ่ง">สตรีมมิ่ง</option>
                <option value="เพลง">เพลง</option>
                <option value="กราฟิก / ทำงาน">กราฟิก / ทำงาน</option>
                <option value="เครื่องมือ AI">เครื่องมือ AI</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ป้ายแท็ก (Badge)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="เช่น ขายดี, ยอดนิยม, เมลเดิม"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
                />
                <select
                  value={formData.tagColor}
                  onChange={(e) => setFormData({ ...formData, tagColor: e.target.value })}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none bg-white text-xs"
                >
                  <option value="pink">ชมพู</option>
                  <option value="green">เขียว</option>
                  <option value="purple">ม่วง</option>
                  <option value="rose">แดง</option>
                  <option value="blue">ฟ้า</option>
                  <option value="amber">ส้ม</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Section with Unlimited Price Tiers */}
          <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200/80 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>กำหนดราคาแอพ (สามารถเพิ่มได้หลายราคา เช่น ลูกค้า / ร้าน / ตัวแทน)</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  const newIdx = prices.length + 1;
                  const defaultLabel = newIdx === 2 ? 'ร้าน' : newIdx === 3 ? 'ตัวแทน' : `ราคาที่ ${newIdx}`;
                  setPrices([
                    ...prices,
                    {
                      id: `price-${Date.now()}`,
                      label: defaultLabel,
                      price: '',
                      period: prices[0]?.period || ''
                    }
                  ]);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ เพิ่มราคา ({prices.length + 1})</span>
              </button>
            </div>

            {/* Dynamic Price Rows */}
            <div className="space-y-2.5">
              {prices.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-xl border items-center transition-all ${
                    idx === 0
                      ? 'bg-white border-pink-200 shadow-xs'
                      : idx === 1
                      ? 'bg-purple-50/70 border-purple-200'
                      : 'bg-rose-50/60 border-rose-200'
                  }`}
                >
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      ป้ายกำกับราคาที่ {idx + 1}
                    </label>
                    <input
                      type="text"
                      value={p.label}
                      onChange={(e) => {
                        const updated = [...prices];
                        updated[idx].label = e.target.value;
                        setPrices(updated);
                      }}
                      placeholder={idx === 0 ? 'เช่น ลูกค้า' : idx === 1 ? 'เช่น ร้าน' : 'เช่น ตัวแทน / VIP'}
                      className="w-full px-3.5 py-1.5 rounded-lg border border-slate-200 focus:border-pink-500 outline-none text-xs bg-white font-medium"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      ราคาที่ {idx + 1} {idx === 0 && <span className="text-rose-500">*</span>}
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-pink-600 font-bold text-sm">฿</span>
                      <input
                        type="text"
                        required={idx === 0}
                        value={p.price}
                        onChange={(e) => {
                          const updated = [...prices];
                          updated[idx].price = e.target.value;
                          setPrices(updated);
                        }}
                        placeholder="เช่น 56"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-pink-500 outline-none font-bold text-pink-600 text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">หน่วยเวลา</label>
                    <input
                      type="text"
                      value={p.period}
                      onChange={(e) => {
                        const updated = [...prices];
                        updated[idx].period = e.target.value;
                        setPrices(updated);
                      }}
                      placeholder="ไม่บังคับ เช่น / 30 วัน หรือเว้นว่างได้"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-pink-500 outline-none text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2 flex sm:justify-end pt-1 sm:pt-4">
                    {prices.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = prices.filter((_, i) => i !== idx);
                          setPrices(updated);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-100/70 hover:bg-rose-200/80 rounded-lg transition-colors cursor-pointer"
                        title="ลบราคานี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">ลบราคาที่ {idx + 1}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium py-1">ราคาหลัก</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specs: Devices & Resolution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-pink-500" />
                <span>จำนวนอุปกรณ์ที่รองรับ / ดูพร้อมกันได้</span>
              </label>
              <input
                type="text"
                value={formData.devices}
                onChange={(e) => setFormData({ ...formData, devices: e.target.value })}
                placeholder="เช่น ดูได้ 1 จอ (ทุกอุปกรณ์) หรือ 4 อุปกรณ์พร้อมกัน"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Tv className="w-3.5 h-3.5 text-purple-500" />
                <span>ความคมชัด / คุณภาพ</span>
              </label>
              <input
                type="text"
                value={formData.resolution}
                onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                placeholder="เช่น Full HD 1080p หรือ Ultra HD 4K + Spatial Audio"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
              />
            </div>
          </div>

          {/* Sub detail & Highlight rate */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ข้อความไฮไลท์สั้นๆ (แสดงใต้ชื่อแอพ)
            </label>
            <input
              type="text"
              value={formData.subDetail}
              onChange={(e) => setFormData({ ...formData, subDetail: e.target.value })}
              placeholder="เช่น ลูกค้า 56 / ร้าน 59 หรือ จอส่วนตัว ล็อกรหัส PIN ได้"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
            />
          </div>

          {/* Package Details (Multiline Textarea with Shift+Enter support) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-pink-500" />
                <span>รายละเอียดและเงื่อนไขแพ็กเกจย่อย</span>
              </label>
              <span className="text-[11px] text-pink-500 font-medium">
                💡 กด Enter หรือ Shift + Enter เพื่อขึ้นบรรทัดใหม่ได้
              </span>
            </div>
            <textarea
              rows={4}
              value={formData.packageDetails}
              onChange={(e) => setFormData({ ...formData, packageDetails: e.target.value })}
              placeholder="กรอกรายละเอียด เช่น:&#10;• ใช้งานได้ 30 วันเต็ม&#10;• ต่อเมลเดิมได้ ไม่ต้องให้รหัสผ่าน&#10;• รับประกันตลอดอายุการใช้งาน"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none font-sans text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {/* Icon Selection Section */}
          <div className="p-3.5 bg-pink-50/50 rounded-2xl border border-pink-100">
            <label className="block font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>เลือกหรืออัปโหลดไอคอนแอพ</span>
              <span className="text-[11px] text-pink-500 font-normal">
                กดเลือกไอคอนพรีเซ็ต หรือเลือกรูปจากเครื่อง
              </span>
            </label>

            {/* Icon Presets Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-2 mb-3">
              {presetList.map((preset) => (
                <button
                  type="button"
                  key={preset.key}
                  onClick={() => setFormData({ ...formData, icon: preset.icon })}
                  className={`relative p-1.5 rounded-xl border transition-all cursor-pointer ${
                    formData.icon === preset.icon
                      ? 'border-pink-500 ring-2 ring-pink-300 scale-105 bg-white shadow-xs'
                      : 'border-slate-200 hover:border-pink-300 bg-white'
                  }`}
                  title={preset.name}
                >
                  <img src={preset.icon} alt={preset.name} className="w-9 h-9 rounded-lg object-contain mx-auto" />
                </button>
              ))}
            </div>

            {/* Custom URL or File Upload */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-pink-100">
              {/* File upload */}
              <label className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-pink-100/50 text-slate-700 rounded-xl border border-pink-200 cursor-pointer text-xs font-medium transition-colors">
                <Upload className="w-4 h-4 text-pink-500" />
                <span>อัปโหลดรูปภาพจากเครื่อง</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Direct image link */}
              <input
                type="url"
                value={customUrl}
                onChange={(e) => {
                  setCustomUrl(e.target.value);
                  if (e.target.value) setFormData({ ...formData, icon: e.target.value });
                }}
                placeholder="หรือวางลิงก์รูป (Image URL)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-pink-200 text-xs outline-none bg-white"
              />
            </div>
          </div>

          {/* Specific Order Link (Optional) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ลิงก์สั่งซื้อเฉพาะแอพนี้ (ไม่บังคับ - ถ้าเว้นว่างจะใช้ LINE ของร้าน)
            </label>
            <input
              type="url"
              value={formData.orderLink}
              onChange={(e) => setFormData({ ...formData, orderLink: e.target.value })}
              placeholder="เช่น ลิงก์ห้อง LINE ส่วนตัว หรือ ฟอร์มสั่งซื้อ"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-xs"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 hover:from-pink-600 hover:to-rose-500 text-white font-semibold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มแอพทันที'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
