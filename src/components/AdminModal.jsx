import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Package,
  Download,
  Upload,
  RotateCcw,
  Lock,
  Eye,
  EyeOff,
  Monitor,
  Tv,
  Flame
} from 'lucide-react';
import AdminStoreSettings from './AdminStoreSettings';
import AdminProductForm from './AdminProductForm';
import AdminPromotionForm from './AdminPromotionForm';
import { storage } from '../utils/storage';

export default function AdminModal({
  isOpen,
  onClose,
  products,
  setProducts,
  promotions = [],
  setPromotions,
  settings,
  setSettings,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'promotions' | 'store' | 'backup'
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Promotions CRUD state
  const [editingPromo, setEditingPromo] = useState(null);
  const [isPromoFormOpen, setIsPromoFormOpen] = useState(false);

  // Security Password check
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    const expectedPassword = settings.adminPassword || settings.adminPin || '1234';
    if (enteredPassword === expectedPassword) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Product CRUD
  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setIsFormOpen(true);
  };

  const handleSaveProduct = (formData) => {
    let updated;
    const exists = products.some((p) => p.id === formData.id);
    if (exists) {
      updated = products.map((p) => (p.id === formData.id ? formData : p));
      onShowToast({ type: 'success', message: `แก้ไข ${formData.name} สำเร็จแล้ว` });
    } else {
      updated = [formData, ...products];
      onShowToast({ type: 'success', message: `เพิ่มแอพ ${formData.name} สำเร็จแล้ว` });
    }
    setProducts(updated);
    storage.saveProducts(updated);
    setIsFormOpen(false);
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${name}" ?`)) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      storage.saveProducts(updated);
      onShowToast({ type: 'info', message: `ลบแอพเรียบร้อยแล้ว` });
    }
  };

  // Promotion CRUD
  const handleAddNewPromo = () => {
    setEditingPromo(null);
    setIsPromoFormOpen(true);
  };

  const handleEditPromo = (promo) => {
    setEditingPromo(promo);
    setIsPromoFormOpen(true);
  };

  const handleSavePromo = (formData) => {
    let updated;
    const exists = promotions.some((p) => p.id === formData.id);
    if (exists) {
      updated = promotions.map((p) => (p.id === formData.id ? formData : p));
      onShowToast({ type: 'success', message: `แก้ไขโปรโมชั่น ${formData.name} สำเร็จแล้ว` });
    } else {
      updated = [formData, ...promotions];
      onShowToast({ type: 'success', message: `เพิ่มโปรโมชั่น ${formData.name} สำเร็จแล้ว` });
    }
    setPromotions(updated);
    storage.savePromotions(updated);
    setIsPromoFormOpen(false);
  };

  const handleDeletePromo = (id, name) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบโปรโมชั่น "${name}" ?`)) {
      const updated = promotions.filter((p) => p.id !== id);
      setPromotions(updated);
      storage.savePromotions(updated);
      onShowToast({ type: 'info', message: `ลบโปรโมชั่นเรียบร้อยแล้ว` });
    }
  };

  // Store Settings
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  // Backup & Restore
  const handleExport = () => {
    storage.exportBackup(products, settings, promotions);
    onShowToast({ type: 'success', message: 'ดาวน์โหลดไฟล์สำรองข้อมูล JSON แล้ว' });
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await storage.importBackup(file);
      setProducts(data.products);
      setSettings(data.settings);
      if (data.promotions) setPromotions(data.promotions);
      storage.saveProducts(data.products);
      storage.saveSettings(data.settings);
      if (data.promotions) storage.savePromotions(data.promotions);
      onShowToast({ type: 'success', message: 'นำเข้าข้อมูลสำเร็จแล้ว!' });
    } catch (err) {
      alert(err.message || 'เกิดข้อผิดพลาดในการนำเข้าไฟล์');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('คำเตือน: คุณต้องการรีเซ็ตข้อมูลสินค้า โปรโมชั่น และร้านค้ากลับเป็นค่าเริ่มต้นหรือไม่?')) {
      storage.resetAll();
      const defaultProds = storage.getProducts();
      const defaultPromos = storage.getPromotions();
      const defaultSets = storage.getSettings();
      setProducts(defaultProds);
      setPromotions(defaultPromos);
      setSettings(defaultSets);
      onShowToast({ type: 'info', message: 'รีเซ็ตข้อมูลร้านค้ากลับเป็นค่าเริ่มต้นเรียบร้อยแล้ว' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      {/* Expanded Wide Modal for Easy Reading */}
      <div className="bg-white rounded-3xl max-w-4xl lg:max-w-5xl w-full p-5 sm:p-8 shadow-2xl border border-pink-100 my-auto relative max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Password Security Check (If not unlocked) */}
        {!isUnlocked ? (
          <div className="py-12 text-center max-w-md mx-auto w-full px-2">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-pink-100 to-rose-100 text-pink-600 rounded-3xl flex items-center justify-center shadow-xs border border-pink-200/60">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">เข้าสู่ระบบจัดการร้านค้า</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 mb-6">
              กรุณากรอกรหัสผ่านเพื่อเข้าสู่ระบบหลังบ้าน (ค่าเริ่มต้น: <span className="font-mono font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">1234</span>)
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="กรอกรหัสผ่าน Admin..."
                  autoFocus
                  className="w-full text-center tracking-wider text-lg font-mono py-3.5 pl-4 pr-12 rounded-2xl border-2 border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                  title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {passwordError && (
                <p className="text-xs text-rose-500 font-semibold bg-rose-50 py-1.5 px-3 rounded-xl border border-rose-200">
                  รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 hover:from-pink-600 hover:to-rose-500 text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                เข้าสู่ระบบจัดการ
              </button>
            </form>
          </div>
        ) : (
          /* Main Admin Interface (Wide & Highly Readable) */
          <>
            {/* Header & Tabs */}
            <div className="mb-5 pr-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    ระบบจัดการร้านค้า (Admin Panel)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    จัดการรายการแอพ โปรโมชั่นแพ็กเกจคู่ ข้อมูลร้านค้า และการสำรองข้อมูล
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 mt-5 border-b border-slate-100 pb-2.5 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>จัดการสินค้า ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('promotions')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'promotions'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  <span>โปรโมชั่นแพ็กคู่ ({promotions.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('store')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'store'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>ข้อมูลร้านค้า & หน้าปก</span>
                </button>

                <button
                  onClick={() => setActiveTab('backup')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'backup'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>สำรอง & กู้คืนข้อมูล</span>
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto pr-1">
              {/* TAB 1: PRODUCT LIST & CRUD */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  {/* Top Action Bar */}
                  <div className="flex items-center justify-between bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">รายการแอพทั้งหมด ({products.length})</h4>
                      <p className="text-xs text-slate-500">
                        คุณสามารถเพิ่มแอพใหม่ แก้ไขราคา รายละเอียด หรือลบสินค้าได้ทันที
                      </p>
                    </div>
                    <button
                      onClick={handleAddNewProduct}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 hover:from-pink-600 hover:to-rose-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>เพิ่มแอพใหม่</span>
                    </button>
                  </div>

                  {/* Product items list (Wide Cards) */}
                  <div className="space-y-2.5">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white hover:bg-pink-50/30 rounded-2xl border border-slate-200/80 shadow-xs transition-colors gap-3"
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          {/* Large thumbnail */}
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 p-1.5 border border-slate-200 flex items-center justify-center shrink-0">
                            {prod.icon ? (
                              <img src={prod.icon} alt={prod.name} className="w-full h-full object-contain rounded-xl" />
                            ) : (
                              <span className="text-xs text-pink-500 font-bold">APP</span>
                            )}
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                {prod.name}
                              </h4>
                              {prod.tag && (
                                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold shrink-0">
                                  {prod.tag}
                                </span>
                              )}
                            </div>

                            {/* Dynamic Price Tiers Display */}
                            <div className="flex items-center gap-2 text-xs flex-wrap">
                              {(() => {
                                const priceList = (prod.prices && Array.isArray(prod.prices) && prod.prices.length > 0)
                                  ? prod.prices
                                  : [
                                      { label: prod.priceLabel || 'ลูกค้า', price: prod.price, period: prod.pricePeriod },
                                      ...(prod.hasSecondPrice && prod.secondPrice ? [{ label: prod.secondPriceLabel || 'ร้าน', price: prod.secondPrice, period: prod.pricePeriod }] : [])
                                    ];

                                return priceList.map((p, idx) => (
                                  <React.Fragment key={idx}>
                                    <span className={`font-bold ${idx === 0 ? 'text-pink-600' : idx === 1 ? 'text-purple-600' : 'text-rose-600'}`}>
                                      {p.label}: {prod.priceUnit || '฿'}{p.price}
                                    </span>
                                    {idx < priceList.length - 1 && <span className="text-slate-300">/</span>}
                                  </React.Fragment>
                                ));
                              })()}

                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500 font-medium">{prod.category}</span>
                            </div>

                            {/* Devices & Resolution tags if available */}
                            {(prod.devices || prod.resolution) && (
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                                {prod.devices && (
                                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                    <Monitor className="w-3 h-3 text-pink-500" />
                                    <span>{prod.devices}</span>
                                  </span>
                                )}
                                {prod.resolution && (
                                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                    <Tv className="w-3 h-3 text-purple-500" />
                                    <span>{prod.resolution}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                            title="แก้ไข"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>แก้ไข</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                            title="ลบ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ลบ</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: PROMOTIONS LIST & CRUD */}
              {activeTab === 'promotions' && (
                <div className="space-y-4">
                  {/* Top Action Bar */}
                  <div className="flex items-center justify-between bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-rose-500" />
                        <span>รายการโปรโมชั่นแพ็กคู่ ({promotions.length})</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        จับคู่ขาย 2 แอพพร้อมกัน เช่น อ้าย 7 วัน + Viu จาก 30 เหลือ 25
                      </p>
                    </div>
                    <button
                      onClick={handleAddNewPromo}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>เพิ่มโปรคู่ใหม่</span>
                    </button>
                  </div>

                  {/* Promotions List */}
                  <div className="space-y-2.5">
                    {promotions.map((promo) => (
                      <div
                        key={promo.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white hover:bg-rose-50/30 rounded-2xl border border-slate-200/80 shadow-xs transition-colors gap-3"
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          {/* Dual App Icons Showcase */}
                          <div className="flex items-center p-1 bg-rose-50/50 rounded-xl border border-rose-100 shrink-0">
                            <div className="w-10 h-10 rounded-lg bg-white p-1 border border-pink-100 flex items-center justify-center">
                              <img src={promo.app1Icon} alt={promo.app1Name} className="w-full h-full object-contain rounded" />
                            </div>
                            <span className="text-xs font-black text-rose-500 mx-1">+</span>
                            <div className="w-10 h-10 rounded-lg bg-white p-1 border border-purple-100 flex items-center justify-center">
                              <img src={promo.app2Icon} alt={promo.app2Name} className="w-full h-full object-contain rounded" />
                            </div>
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                {promo.name}
                              </h4>
                              {promo.tag && (
                                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-semibold shrink-0">
                                  {promo.tag}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-xs flex-wrap">
                              {promo.originalPrice && (
                                <span className="text-slate-400 line-through">
                                  ฿{promo.originalPrice}
                                </span>
                              )}
                              <span className="text-rose-600 font-extrabold text-sm">
                                ฿{promo.promoPrice} {promo.pricePeriod}
                              </span>
                              {Number(promo.originalPrice) > Number(promo.promoPrice) && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                                  ประหยัด ฿{Number(promo.originalPrice) - Number(promo.promoPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleEditPromo(promo)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                            title="แก้ไขโปรโมชั่น"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>แก้ไข</span>
                          </button>
                          <button
                            onClick={() => handleDeletePromo(promo.id, promo.name)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                            title="ลบโปรโมชั่น"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ลบ</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: STORE SETTINGS */}
              {activeTab === 'store' && (
                <AdminStoreSettings
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                  onShowToast={onShowToast}
                />
              )}

              {/* TAB 4: BACKUP & RESTORE */}
              {activeTab === 'backup' && (
                <div className="space-y-4 py-2">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-pink-500" />
                      <span>สำรองข้อมูลสินค้า (Export JSON)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      ดาวน์โหลดไฟล์ JSON เก็บไว้เป็นไฟล์สำรอง สามารถนำไปเปิดใช้งานบนเครื่องอื่นหรือเบราว์เซอร์อื่นได้ทันที
                    </p>
                    <button
                      onClick={handleExport}
                      className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      ดาวน์โหลดไฟล์สำรองข้อมูล (.json)
                    </button>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-purple-500" />
                      <span>กู้คืนข้อมูลสินค้า (Import JSON)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      อัปโหลดไฟล์ JSON ที่คุณเคยสำรองไว้ ข้อมูลเดิมจะถูกแทนที่ด้วยข้อมูลจากไฟล์
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>เลือกไฟล์ .json เพื่อกู้คืน</span>
                      <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                    </label>
                  </div>

                  <div className="bg-rose-50/80 p-5 rounded-2xl border border-rose-200">
                    <h4 className="text-sm font-bold text-rose-800 mb-1 flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4 text-rose-600" />
                      <span>คืนค่าเริ่มต้นระบบ (Reset to Defaults)</span>
                    </h4>
                    <p className="text-xs text-rose-700/80 mb-3">
                      หากต้องการล้างข้อมูลทั้งหมดและกลับไปใช้สินค้าและโปรโมชั่นตัวอย่างเริ่มต้นของร้าน
                    </p>
                    <button
                      onClick={handleResetToDefault}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      รีเซ็ตกลับเป็นค่าเริ่มต้น
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Product Add / Edit Modal Overlay */}
        {isFormOpen && (
          <AdminProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onClose={() => setIsFormOpen(false)}
          />
        )}

        {/* Promotion Add / Edit Modal Overlay */}
        {isPromoFormOpen && (
          <AdminPromotionForm
            promo={editingPromo}
            onSave={handleSavePromo}
            onClose={() => setIsPromoFormOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
