import React, { useState } from 'react';
import { Upload, Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';
import { LineIcon } from './SocialIcons';
import { compressImage } from '../utils/imageCompressor';

export default function AdminStoreSettings({ settings, onSaveSettings, onShowToast }) {
  const [formData, setFormData] = useState({ ...settings });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessing(true);
      const compressed = await compressImage(file, 1200, 0.85);
      setFormData((prev) => ({ ...prev, bannerUrl: compressed }));
      onShowToast({ type: 'info', message: 'ปรับขนาดและโหลดรูปภาพหน้าปกสำเร็จ' });
    } catch (err) {
      alert(err.message || 'ไม่สามารถประมวลผลรูปภาพได้');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessing(true);
      const compressed = await compressImage(file, 500, 0.88);
      setFormData((prev) => ({ ...prev, logoUrl: compressed }));
      onShowToast({ type: 'info', message: 'ปรับขนาดและโหลดรูปภาพโลโก้สำเร็จ' });
    } catch (err) {
      alert(err.message || 'ไม่สามารถประมวลผลรูปภาพได้');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    onShowToast({ type: 'success', message: 'บันทึกข้อมูลร้านค้าเรียบร้อยแล้ว!' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
      {/* Store Name & Badge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">ชื่อร้านค้า</label>
          <input
            type="text"
            required
            value={formData.storeName}
            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
            placeholder="เช่น BA STORE"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none font-bold text-slate-800"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">ป้ายสโลแกนใต้ชื่อปก</label>
          <input
            type="text"
            value={formData.badgeText}
            onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
            placeholder="เช่น รับตัดแอพราคาส่ง"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1">คำอธิบายสั้นๆ หน้าร้าน</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="เช่น ขายส่งแอพพรีเมี่ยมราคาถูกม๊ากก 💖"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-pink-600 font-medium"
        />
      </div>

      <div>
        <label className="block font-semibold text-slate-700 mb-1">คำอธิบายเพิ่มเติม</label>
        <input
          type="text"
          value={formData.subDescription}
          onChange={(e) => setFormData({ ...formData, subDescription: e.target.value })}
          placeholder="เช่น โยนหรือใช้เองก็ได้ไม่บวกเพิ่ม ได้วันใช้งานครบแน่นอน"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
        />
      </div>

      {/* Opening Hours & Announcement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">เวลาทำการของร้าน</label>
          <input
            type="text"
            value={formData.openingHours}
            onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
            placeholder="เช่น เปิด 09:00 - 23:00 น."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">แถบข้อความประกาศด้านบนสุด</label>
          <input
            type="text"
            value={formData.announcement}
            onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
            placeholder="เช่น จัดส่งไว 5-15 นาที • ดูแลตลอดการใช้งาน"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
          />
        </div>
      </div>

      {/* Banner & Logo Customization */}
      <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3.5">
        <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>ปรับแต่งรูปภาพหน้าปกและโลโก้</span>
        </h4>

        {/* Banner */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            รูปภาพหน้าปก (Cover Banner URL หรือ อัปโหลดจากเครื่อง)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.bannerUrl}
              onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
              placeholder="วางลิงก์รูปภาพ หรือ อัปโหลดจากเครื่อง (ถ้าว่างจะใช้ภาพอาร์ตเวิร์คเดิม)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-pink-200 bg-white text-xs outline-none"
            />
            <label className="flex items-center gap-1 px-3.5 py-2 bg-white hover:bg-pink-100 text-slate-700 rounded-xl border border-pink-200 cursor-pointer text-xs font-medium">
              <Upload className="w-3.5 h-3.5 text-pink-500" />
              <span>เลือกรูป</span>
              <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
            </label>
            {formData.bannerUrl && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bannerUrl: '' })}
                className="px-2.5 py-1 text-xs text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
              >
                ล้างรูป
              </button>
            )}
          </div>
        </div>

        {/* Banner Fit & Position Controls */}
        {formData.bannerUrl && (
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-slate-700">
              รูปแบบการแสดงผลรูปปกให้เหมาะกับเว็บ:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bannerFit: 'auto' })}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  (formData.bannerFit || 'auto') === 'auto'
                    ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold ring-2 ring-pink-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  <span>🌟 พอดีสัดส่วนอัตโนมัติ</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  ปรับสัดส่วน 2:1 พอดีกับมือถือและคอม ไม่ตัดขอบรูป
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, bannerFit: 'contain' })}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  formData.bannerFit === 'contain'
                    ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold ring-2 ring-pink-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  <span>🎨 ภาพเต็มใบ + แบล็คดรอปเบลอ</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  เห็นรูปครบทั้งใบ 100% ไม่ว่าจะใช้รูปแนวตั้งหรือสี่เหลี่ยม
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, bannerFit: 'cover' })}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  formData.bannerFit === 'cover'
                    ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold ring-2 ring-pink-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  <span>📐 ขยายเต็มกรอบ (Cover)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  ขยายภาพให้เต็มพื้นที่ สามารถเลือกจุดโฟกัสได้
                </div>
              </button>
            </div>

            {/* Position Picker if Cover */}
            {formData.bannerFit === 'cover' && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-500 font-medium">จุดโฟกัสภาพ:</span>
                {['top', 'center', 'bottom'].map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setFormData({ ...formData, bannerPosition: pos })}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      (formData.bannerPosition || 'center') === pos
                        ? 'bg-pink-500 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pos === 'top' ? 'ชิดบน' : pos === 'bottom' ? 'ชิดล่าง' : 'กึ่งกลาง'}
                  </button>
                ))}
              </div>
            )}

            {/* Live Mini Preview */}
            <div className="mt-2 p-2.5 bg-white rounded-xl border border-pink-200/80">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                ตัวอย่างการแสดงผลจริงบนเว็บ (Live Preview):
              </span>
              <div className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                {formData.bannerFit === 'contain' ? (
                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                    <img
                      src={formData.bannerUrl}
                      alt="Preview Backdrop"
                      className="absolute inset-0 w-full h-full object-cover blur-md opacity-60 scale-110"
                    />
                    <img
                      src={formData.bannerUrl}
                      alt="Preview"
                      className="relative z-10 w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <img
                    src={formData.bannerUrl}
                    alt="Preview"
                    className={`w-full h-full object-cover ${
                      formData.bannerPosition === 'top'
                        ? 'object-top'
                        : formData.bannerPosition === 'bottom'
                        ? 'object-bottom'
                        : 'object-center'
                    }`}
                  />
                )}
                {/* Mini Logo Overlay */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white p-0.5 border border-pink-200 shadow-sm z-20">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-pink-100 flex items-center justify-center text-[8px] font-bold text-pink-500">
                      LOGO
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logo */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            รูปภาพโลโก้ร้าน (ทรงกลม)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="วางลิงก์รูปโลโก้ หรือ อัปโหลดรูปภาพ"
              className="flex-1 px-3.5 py-2 rounded-xl border border-pink-200 bg-white text-xs outline-none"
            />
            <label className="flex items-center gap-1 px-3.5 py-2 bg-white hover:bg-pink-100 text-slate-700 rounded-xl border border-pink-200 cursor-pointer text-xs font-medium">
              <Upload className="w-3.5 h-3.5 text-pink-500" />
              <span>เลือกรูป</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {formData.logoUrl && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoUrl: '' })}
                className="px-2.5 py-1 text-xs text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
              >
                ล้างรูป
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LINE Contact Link */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
          <LineIcon className="w-4 h-4 text-emerald-500" />
          <span>ลิงก์ LINE Official หรือ LINE ติดต่อสั่งซื้อ</span>
        </label>
        <input
          type="text"
          value={formData.lineUrl}
          onChange={(e) => setFormData({ ...formData, lineUrl: e.target.value })}
          placeholder="เช่น https://line.me/ti/p/~@bastore"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          ปุ่ม "ติดต่อสั่งซื้อทาง LINE" และปุ่มในหน้าต่างดูรายละเอียดจะเปิดไปยังลิงก์นี้
        </p>
      </div>

      {/* Admin Password */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          รหัสผ่านเข้าสู่ระบบจัดการร้านค้า (Admin Password)
        </label>
        <div className="relative max-w-sm">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.adminPassword || formData.adminPin || ''}
            onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value, adminPin: e.target.value })}
            placeholder="ตั้งรหัสผ่านใหม่ เช่น bastore2026 หรือ 1234"
            className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 focus:border-pink-500 outline-none font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            tabIndex={-1}
            title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          ใช้สำหรับป้องกันไม่ให้คนอื่นเข้ามาแก้ไขข้อมูลหน้าร้าน (สามารถตั้งเป็นตัวอักษรและตัวเลขได้)
        </p>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-7 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
        >
          {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isProcessing ? 'กำลังประมวลผลรูปภาพ...' : 'บันทึกข้อมูลร้านค้า'}</span>
        </button>
      </div>
    </form>
  );
}
