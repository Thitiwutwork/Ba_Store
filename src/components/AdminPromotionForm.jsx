import React, { useState } from 'react';
import { X, Sparkles, Flame, FileText, Plus, Trash2 } from 'lucide-react';
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
    { key: 'capcut', name: 'CapCut', icon: APP_ICONS.capcut }
  ];

  const [formData, setFormData] = useState(() => ({
    id: promo?.id || `promo-${Math.random().toString(36).slice(2, 9)}`,
    name: promo?.name || '',
    tag: promo?.tag || '🔥 โปรคู่สุดคุ้ม',
    tagColor: promo?.tagColor || 'rose',
    app1Name: promo?.app1Name || 'iQIYI',
    app1Icon: promo?.app1Icon || APP_ICONS.iqiyi,
    app1Devices: promo?.app1Devices || 'ดูพร้อมกันได้ 2 อุปกรณ์',
    app1Resolution: promo?.app1Resolution || 'Full HD 1080p คมชัดระดับสูง',
    app2Name: promo?.app2Name || 'Viu',
    app2Icon: promo?.app2Icon || APP_ICONS.viu,
    app2Devices: promo?.app2Devices || 'ดูได้ 3 อุปกรณ์ ( ทรส 2 / เว็บ 1 )',
    app2Resolution: promo?.app2Resolution || 'Full HD 1080p ไม่มีโฆษณาคั่น',
    hasApp3: Boolean(promo?.hasApp3 || promo?.app3Name),
    app3Name: promo?.app3Name || 'WeTV',
    app3Icon: promo?.app3Icon || APP_ICONS.iqiyi,
    app3Devices: promo?.app3Devices || '1 อุปกรณ์ (ดูได้พร้อมกัน)',
    app3Resolution: promo?.app3Resolution || 'Full HD 1080p คมชัดระดับสูง',
    originalPrice: promo?.originalPrice || '',
    promoPrice: promo?.promoPrice || '',
    pricePeriod: promo?.pricePeriod || '/ 7 วัน',
    devices: promo?.devices || '',
    resolution: promo?.resolution || '',
    packageDetails: promo?.packageDetails || '• ได้รับแอพพร้อมกันครบตามเซ็ต\n• ประหยัดทันที คุ้มกว่าซื้อแยก\n• บัญชีแท้ 100% จัดส่งไว ดูแลตลอดการใช้งาน',
    orderLink: promo?.orderLink || '',
    inStock: promo?.inStock !== false
  }));

  const handleApp1Upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 400, 0.88);
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
    if (!formData.promoPrice.trim()) {
      alert('กรุณากรอกราคาโปรโมชั่น');
      return;
    }
    onSave(formData);
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
        <div className="mb-4 pr-8">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <span>{isEditing ? 'แก้ไขโปรโมชั่นแพ็กคู่' : 'เพิ่มโปรโมชั่นแพ็กคู่ใหม่'}</span>
          </h3>
          <p className="text-xs text-slate-500">
            จับคู่ 2 แอพขายคู่กัน เช่น อ้าย 7 วัน + Viu จาก 30 เหลือ 25
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
          {/* Promo Name & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                ชื่อโปรโมชั่น / ชื่อแพ็กเกจคู่ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="เช่น แพ็กคู่สุดคุ้ม: iQIYI (7 วัน) + Viu Premium (7 วัน)"
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
                placeholder="เช่น 🔥 โปรคู่สุดฮิต"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
              />
            </div>
          </div>

          {/* Apps Selection Box (Supports 2 or 3 Apps) */}
          <div className="p-4 bg-gradient-to-r from-pink-50/60 via-white to-purple-50/60 rounded-2xl border border-pink-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>เลือกแอพที่จะจัดเซ็ตโปรโมชั่น ({formData.hasApp3 ? '3 แอพ' : '2 แอพ'})</span>
              </h4>

              {!formData.hasApp3 ? (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasApp3: true })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ เพิ่มแอพที่ 3 (เซ็ต 3 แอพ)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasApp3: false })}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบแอพที่ 3</span>
                </button>
              )}
            </div>

            <div className={`grid grid-cols-1 ${formData.hasApp3 ? 'md:grid-cols-3' : 'sm:grid-cols-2'} gap-3.5`}>
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

              {/* App 3 Selector (Optional) */}
              {formData.hasApp3 && (
                <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-xs space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 p-1 border border-slate-200 flex items-center justify-center shrink-0">
                      {formData.app3Icon ? (
                        <img src={formData.app3Icon} alt={formData.app3Name} className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <span className="text-[9px] font-bold text-indigo-500">APP 3</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-[11px] font-bold text-indigo-800 block">แอพที่ 3 (App 3)</label>
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

          {/* Pricing: Original Price vs Promo Price */}
          <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ราคาปกติ (ก่อนลด)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">฿</span>
                <input
                  type="text"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="เช่น 30"
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
                  required
                  value={formData.promoPrice}
                  onChange={(e) => setFormData({ ...formData, promoPrice: e.target.value })}
                  placeholder="เช่น 25"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border-2 border-rose-400 bg-white focus:border-rose-600 outline-none font-bold text-rose-700 text-base"
                />
              </div>
              <p className="text-[10px] text-rose-500 mt-0.5 font-medium">ราคาจริงที่ลูกค้าต้องจ่าย</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ระยะเวลาแพ็กเกจ
              </label>
              <input
                type="text"
                value={formData.pricePeriod}
                onChange={(e) => setFormData({ ...formData, pricePeriod: e.target.value })}
                placeholder="เช่น / 7 วัน หรือ / 30 วัน"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-rose-500 outline-none"
              />
            </div>
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
              placeholder="• ได้รับ 2 แอพพร้อมกัน: iQIYI 7 วัน + Viu 7 วัน&#10;• ประหยัดทันที ฿5 จากราคาปกติ ฿30 เหลือเพียง ฿25&#10;• บัญชีแท้ 100% ดูแลตลอดการใช้งาน"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-rose-500 outline-none text-xs leading-relaxed font-sans"
            />
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
              {isEditing ? 'บันทึกการแก้ไขโปรโมชั่น' : 'สร้างโปรโมชั่นแพ็กคู่'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
