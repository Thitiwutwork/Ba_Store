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
  KeyRound,
  Monitor,
  Tv
} from 'lucide-react';
import AdminStoreSettings from './AdminStoreSettings';
import AdminProductForm from './AdminProductForm';
import { storage } from '../utils/storage';

export default function AdminModal({
  isOpen,
  onClose,
  products,
  setProducts,
  settings,
  setSettings,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'store' | 'backup'
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Security PIN check
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (enteredPin === (settings.adminPin || '1234')) {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
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

  // Store Settings
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  // Backup & Restore
  const handleExport = () => {
    storage.exportBackup(products, settings);
    onShowToast({ type: 'success', message: 'ดาวน์โหลดไฟล์สำรองข้อมูล JSON แล้ว' });
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await storage.importBackup(file);
      setProducts(data.products);
      setSettings(data.settings);
      storage.saveProducts(data.products);
      storage.saveSettings(data.settings);
      onShowToast({ type: 'success', message: 'นำเข้าข้อมูลสำเร็จแล้ว!' });
    } catch (err) {
      alert(err.message || 'เกิดข้อผิดพลาดในการนำเข้าไฟล์');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('คำเตือน: คุณต้องการรีเซ็ตข้อมูลสินค้าและร้านค้ากลับเป็นค่าเริ่มต้น 6 รายการหรือไม่?')) {
      storage.resetAll();
      const defaultProds = storage.getProducts();
      const defaultSets = storage.getSettings();
      setProducts(defaultProds);
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

        {/* PIN Security Check (If not unlocked) */}
        {!isUnlocked ? (
          <div className="py-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 text-pink-600 rounded-3xl flex items-center justify-center shadow-xs">
              <KeyRound className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">กรุณาใส่รหัส PIN จัดการร้าน</h3>
            <p className="text-sm text-slate-500 mt-1.5 mb-6">
              รหัสเริ่มต้นจากระบบคือ <span className="font-mono font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">1234</span> (เปลี่ยนได้ในเมนูตั้งค่าร้านค้า)
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                maxLength={8}
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="กรอกรหัส PIN..."
                autoFocus
                className="w-full text-center tracking-widest text-2xl font-mono py-3 px-4 rounded-2xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
              />
              {pinError && (
                <p className="text-xs text-rose-500 font-medium">รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 hover:from-pink-600 hover:to-rose-500 text-white font-bold rounded-2xl text-sm shadow-sm transition-all cursor-pointer"
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
                    จัดการรายการแอพพรีเมียม ข้อมูลร้านค้า และการสำรองข้อมูลในที่เดียว
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
                  <span>จัดการสินค้า ({products.length} รายการ)</span>
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

                            {/* Dual Price or Single Price display */}
                            <div className="flex items-center gap-2 text-xs flex-wrap">
                              {prod.hasSecondPrice && prod.secondPrice ? (
                                <>
                                  <span className="text-pink-600 font-bold">
                                    {prod.priceLabel || 'ลูกค้า'}: {prod.priceUnit || '฿'}{prod.price}
                                  </span>
                                  <span className="text-slate-300">/</span>
                                  <span className="text-purple-600 font-bold">
                                    {prod.secondPriceLabel || 'ร้าน'}: {prod.priceUnit || '฿'}{prod.secondPrice}
                                  </span>
                                </>
                              ) : (
                                <span className="text-pink-600 font-bold">
                                  {prod.priceLabel ? `${prod.priceLabel} ` : ''}{prod.priceUnit || '฿'}{prod.price} {prod.pricePeriod}
                                </span>
                              )}

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

              {/* TAB 2: STORE SETTINGS */}
              {activeTab === 'store' && (
                <AdminStoreSettings
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                  onShowToast={onShowToast}
                />
              )}

              {/* TAB 3: BACKUP & RESTORE */}
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
                      หากต้องการล้างข้อมูลทั้งหมดและกลับไปใช้สินค้าตัวอย่าง 6 รายการเดิมของร้าน
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
      </div>
    </div>
  );
}
