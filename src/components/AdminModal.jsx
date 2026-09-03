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
  Flame,
  CheckCircle2,
  Clock,
  XCircle,
  GripVertical,
  ArrowUp,
  ArrowDown
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

  // Bulk Selection States
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedPromoIds, setSelectedPromoIds] = useState([]);

  // Product Reordering State (Drag & Drop)
  const [draggedProdIndex, setDraggedProdIndex] = useState(null);
  const [dragOverProdIndex, setDragOverProdIndex] = useState(null);

  // Promotion Reordering State (Drag & Drop)
  const [draggedPromoIndex, setDraggedPromoIndex] = useState(null);
  const [dragOverPromoIndex, setDragOverPromoIndex] = useState(null);

  // Security Password check
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Reordering Handlers for Products
  const handleMoveProduct = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;
    const reordered = [...products];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setProducts(reordered);
    storage.saveProducts(reordered);
    onShowToast({ type: 'success', message: `สลับตำแหน่ง "${temp.name}" ไปที่อันดับ #${targetIndex + 1} แล้ว` });
  };

  const handleProdDragStart = (e, index) => {
    setDraggedProdIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleProdDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverProdIndex !== index) {
      setDragOverProdIndex(index);
    }
  };

  const handleProdDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedProdIndex === null || draggedProdIndex === targetIndex) {
      setDraggedProdIndex(null);
      setDragOverProdIndex(null);
      return;
    }
    const reordered = [...products];
    const [removed] = reordered.splice(draggedProdIndex, 1);
    reordered.splice(targetIndex, 0, removed);
    setProducts(reordered);
    storage.saveProducts(reordered);
    setDraggedProdIndex(null);
    setDragOverProdIndex(null);
    onShowToast({ type: 'success', message: `ย้าย "${removed.name}" ไปที่อันดับ #${targetIndex + 1} เรียบร้อยแล้ว` });
  };

  const handleProdDragEnd = () => {
    setDraggedProdIndex(null);
    setDragOverProdIndex(null);
  };

  // Reordering Handlers for Promotions
  const handleMovePromo = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= promotions.length) return;
    const reordered = [...promotions];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setPromotions(reordered);
    storage.savePromotions(reordered);
    onShowToast({ type: 'success', message: `สลับโปรโมชั่น "${temp.name}" ไปที่อันดับ #${targetIndex + 1} แล้ว` });
  };

  const handlePromoDragStart = (e, index) => {
    setDraggedPromoIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handlePromoDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverPromoIndex !== index) {
      setDragOverPromoIndex(index);
    }
  };

  const handlePromoDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedPromoIndex === null || draggedPromoIndex === targetIndex) {
      setDraggedPromoIndex(null);
      setDragOverPromoIndex(null);
      return;
    }
    const reordered = [...promotions];
    const [removed] = reordered.splice(draggedPromoIndex, 1);
    reordered.splice(targetIndex, 0, removed);
    setPromotions(reordered);
    storage.savePromotions(reordered);
    setDraggedPromoIndex(null);
    setDragOverPromoIndex(null);
    onShowToast({ type: 'success', message: `ย้าย "${removed.name}" ไปที่อันดับ #${targetIndex + 1} เรียบร้อยแล้ว` });
  };

  const handlePromoDragEnd = () => {
    setDraggedPromoIndex(null);
    setDragOverPromoIndex(null);
  };

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

  // Bulk Status Handlers
  const handleBulkUpdateProductStatus = (newStatus) => {
    if (selectedProductIds.length === 0) return;
    const statusText = newStatus === 'ready' ? 'พร้อมส่ง' : newStatus === 'not_ready' ? 'ไม่พร้อมส่ง' : 'สินค้าหมด';
    const updated = products.map((prod) => {
      if (selectedProductIds.includes(prod.id)) {
        const updatedPrices = (prod.prices && Array.isArray(prod.prices))
          ? prod.prices.map((p) => ({ ...p, status: newStatus }))
          : prod.prices;
        return {
          ...prod,
          stockStatus: newStatus,
          inStock: newStatus === 'ready',
          stockStatusText: statusText,
          prices: updatedPrices
        };
      }
      return prod;
    });
    setProducts(updated);
    storage.saveProducts(updated);
    onShowToast({
      type: 'success',
      message: `ปรับสถานะ ${selectedProductIds.length} สินค้าเป็น "${statusText}" สำเร็จเรียบร้อยแล้ว!`
    });
    setSelectedProductIds([]);
  };

  const handleBulkUpdatePromoStatus = (newStatus) => {
    if (selectedPromoIds.length === 0) return;
    const statusText = newStatus === 'ready' ? 'พร้อมส่ง' : newStatus === 'not_ready' ? 'ไม่พร้อมส่ง' : 'สินค้าหมด';
    const updated = promotions.map((promo) => {
      if (selectedPromoIds.includes(promo.id)) {
        const updatedPrices = (promo.prices && Array.isArray(promo.prices))
          ? promo.prices.map((p) => ({ ...p, status: newStatus }))
          : promo.prices;
        return {
          ...promo,
          stockStatus: newStatus,
          inStock: newStatus === 'ready',
          stockStatusText: statusText,
          prices: updatedPrices
        };
      }
      return promo;
    });
    setPromotions(updated);
    storage.savePromotions(updated);
    onShowToast({
      type: 'success',
      message: `ปรับสถานะ ${selectedPromoIds.length} โปรโมชั่นเป็น "${statusText}" สำเร็จเรียบร้อยแล้ว!`
    });
    setSelectedPromoIds([]);
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
                  <div className="flex items-center justify-between bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 flex-wrap gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">รายการแอพทั้งหมด ({products.length})</h4>
                      <p className="text-xs text-slate-500">
                        เลือกดรอปดาวน์เปลี่ยนสถานะได้ทันที หรือติ๊กเลือกหลายแอพเพื่อเปลี่ยนสถานะพร้อมกัน
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-pink-200 text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs hover:bg-pink-50">
                        <input
                          type="checkbox"
                          checked={products.length > 0 && selectedProductIds.length === products.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProductIds(products.map((p) => p.id));
                            } else {
                              setSelectedProductIds([]);
                            }
                          }}
                          className="w-4 h-4 rounded text-pink-600 cursor-pointer"
                        />
                        <span>เลือกทั้งหมด ({selectedProductIds.length})</span>
                      </label>

                      <button
                        onClick={handleAddNewProduct}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 hover:from-pink-600 hover:to-rose-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>เพิ่มแอพใหม่</span>
                      </button>
                    </div>
                  </div>

                  {/* Bulk Action Bar for Products */}
                  {selectedProductIds.length > 0 && (
                    <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 p-3 rounded-2xl text-white shadow-md flex items-center justify-between flex-wrap gap-2 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-lg">
                          เลือกอยู่ {selectedProductIds.length} รายการ
                        </span>
                        <span className="text-xs font-medium">⚡ เปลี่ยนสถานะพร้อมกันทีเดียว:</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleBulkUpdateProductStatus('ready')}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>🟢 พร้อมส่งทั้งหมด</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBulkUpdateProductStatus('not_ready')}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>🟠 รอกดทั้งหมด</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBulkUpdateProductStatus('out_of_stock')}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>🔴 สินค้าหมดทั้งหมด</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedProductIds([])}
                          className="px-2 py-1 text-xs text-white/80 hover:text-white cursor-pointer ml-1 underline"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Reordering helper hint */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-pink-50/50 border border-pink-200/60 px-3.5 py-2 rounded-xl">
                    <GripVertical className="w-4 h-4 text-pink-500 shrink-0" />
                    <span><b>จัดเรียงลำดับ:</b> คลิกลากที่ไอคอน ⠿ หรือกดปุ่ม ▲ / ▼ เพื่อสลับตำแหน่งการแสดงผลหน้าร้านได้ทันที</span>
                  </div>

                  {/* Product items list (Wide Cards) */}
                  <div className="space-y-2.5">
                    {products.map((prod, idx) => {
                      const isDragging = draggedProdIndex === idx;
                      const isDragOver = dragOverProdIndex === idx;

                      return (
                        <div
                          key={prod.id}
                          draggable
                          onDragStart={(e) => handleProdDragStart(e, idx)}
                          onDragOver={(e) => handleProdDragOver(e, idx)}
                          onDrop={(e) => handleProdDrop(e, idx)}
                          onDragEnd={handleProdDragEnd}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white hover:bg-pink-50/30 rounded-2xl border shadow-xs transition-all duration-150 gap-3 ${
                            isDragging
                              ? 'opacity-40 scale-[0.98] border-pink-400 bg-pink-50'
                              : isDragOver
                              ? 'border-pink-500 ring-2 ring-pink-300 bg-pink-50/60'
                              : selectedProductIds.includes(prod.id)
                              ? 'border-pink-500 ring-2 ring-pink-100 bg-pink-50/20'
                              : 'border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                            {/* Reordering Grip & Arrow Buttons */}
                            <div className="flex items-center gap-1 shrink-0 select-none">
                              <div
                                className="p-1 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                                title="คลิกลากเพื่อเปลี่ยนตำแหน่ง"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>

                              <div className="flex flex-col -space-y-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveProduct(idx, 'up');
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-pink-600 hover:bg-pink-50 disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"
                                  title="สลับขึ้นบน"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === products.length - 1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveProduct(idx, 'down');
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-pink-600 hover:bg-pink-50 disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"
                                  title="สลับลงล่าง"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="text-[10px] font-extrabold text-slate-400 w-5 text-center shrink-0">
                                #{idx + 1}
                              </span>
                            </div>

                            {/* Checkbox for batch selection */}
                            <input
                              type="checkbox"
                              checked={selectedProductIds.includes(prod.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProductIds([...selectedProductIds, prod.id]);
                                } else {
                                  setSelectedProductIds(selectedProductIds.filter((id) => id !== prod.id));
                                }
                              }}
                              className="w-4 h-4 rounded text-pink-600 cursor-pointer shrink-0 mt-1 sm:mt-0"
                            />
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
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 flex-wrap">
                          {/* Status Dropdown */}
                          <select
                            value={prod.stockStatus || (prod.inStock === false ? 'out_of_stock' : 'ready')}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              const updatedPrices = (prod.prices && Array.isArray(prod.prices))
                                ? prod.prices.map((p) => ({ ...p, status: newStatus }))
                                : prod.prices;
                              const updated = {
                                ...prod,
                                stockStatus: newStatus,
                                inStock: newStatus === 'ready',
                                stockStatusText: newStatus === 'not_ready' ? 'ไม่พร้อมส่ง' : newStatus === 'out_of_stock' ? 'สินค้าหมด' : 'พร้อมส่ง',
                                prices: updatedPrices
                              };
                              handleSaveProduct(updated);
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all ${
                              prod.stockStatus === 'not_ready'
                                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:border-amber-400'
                                : (prod.stockStatus === 'out_of_stock' || prod.inStock === false)
                                ? 'bg-rose-50 text-rose-700 border-rose-300 hover:border-rose-400'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-emerald-400'
                            }`}
                          >
                            <option value="ready">🟢 พร้อมส่ง</option>
                            <option value="not_ready">🟠 รอกด / ไม่พร้อมส่ง</option>
                            <option value="out_of_stock">🔴 สินค้าหมด</option>
                          </select>

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
                    );
                  })}
                  </div>
                </div>
              )}

              {/* TAB 2: PROMOTIONS LIST & CRUD */}
              {activeTab === 'promotions' && (
                <div className="space-y-4">
                  {/* Top Action Bar */}
                  <div className="flex items-center justify-between bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200 flex-wrap gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-rose-500" />
                        <span>รายการโปรโมชั่น ({promotions.length})</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        เลือกดรอปดาวน์เปลี่ยนสถานะได้ทันที หรือติ๊กเลือกหลายโปรเพื่อเปลี่ยนพร้อมกัน
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-rose-200 text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs hover:bg-rose-50">
                        <input
                          type="checkbox"
                          checked={promotions.length > 0 && selectedPromoIds.length === promotions.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPromoIds(promotions.map((p) => p.id));
                            } else {
                              setSelectedPromoIds([]);
                            }
                          }}
                          className="w-4 h-4 rounded text-rose-600 cursor-pointer"
                        />
                        <span>เลือกทั้งหมด ({selectedPromoIds.length})</span>
                      </label>

                      <button
                        onClick={handleAddNewPromo}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>เพิ่มโปรโมชั่นใหม่</span>
                      </button>
                    </div>
                  </div>

                  {/* Bulk Action Bar for Promotions */}
                  {selectedPromoIds.length > 0 && (
                    <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 p-3 rounded-2xl text-white shadow-md flex items-center justify-between flex-wrap gap-2 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-lg">
                          เลือกอยู่ {selectedPromoIds.length} โปรโมชั่น
                        </span>
                        <span className="text-xs font-medium">⚡ เปลี่ยนสถานะพร้อมกันทีเดียว:</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleBulkUpdatePromoStatus('ready')}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>🟢 พร้อมส่งทั้งหมด</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBulkUpdatePromoStatus('not_ready')}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>🟠 รอกดทั้งหมด</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBulkUpdatePromoStatus('out_of_stock')}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>🔴 สินค้าหมดทั้งหมด</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPromoIds([])}
                          className="px-2 py-1 text-xs text-white/80 hover:text-white cursor-pointer ml-1 underline"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Reordering helper hint for promotions */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-rose-50/50 border border-rose-200/60 px-3.5 py-2 rounded-xl">
                    <GripVertical className="w-4 h-4 text-rose-500 shrink-0" />
                    <span><b>จัดเรียงลำดับ:</b> คลิกลากที่ไอคอน ⠿ หรือกดปุ่ม ▲ / ▼ เพื่อสลับลำดับโปรโมชั่นหน้าร้านได้ทันที</span>
                  </div>

                  {/* Promotions List */}
                  <div className="space-y-2.5">
                    {promotions.map((promo, idx) => {
                      const isDragging = draggedPromoIndex === idx;
                      const isDragOver = dragOverPromoIndex === idx;

                      return (
                        <div
                          key={promo.id}
                          draggable
                          onDragStart={(e) => handlePromoDragStart(e, idx)}
                          onDragOver={(e) => handlePromoDragOver(e, idx)}
                          onDrop={(e) => handlePromoDrop(e, idx)}
                          onDragEnd={handlePromoDragEnd}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white hover:bg-rose-50/30 rounded-2xl border shadow-xs transition-all duration-150 gap-3 ${
                            isDragging
                              ? 'opacity-40 scale-[0.98] border-rose-400 bg-rose-50'
                              : isDragOver
                              ? 'border-rose-500 ring-2 ring-rose-300 bg-rose-50/60'
                              : selectedPromoIds.includes(promo.id)
                              ? 'border-rose-500 ring-2 ring-rose-100 bg-rose-50/20'
                              : 'border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                            {/* Reordering Grip & Arrow Buttons */}
                            <div className="flex items-center gap-1 shrink-0 select-none">
                              <div
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                                title="คลิกลากเพื่อเปลี่ยนตำแหน่ง"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>

                              <div className="flex flex-col -space-y-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMovePromo(idx, 'up');
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"
                                  title="สลับขึ้นบน"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === promotions.length - 1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMovePromo(idx, 'down');
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"
                                  title="สลับลงล่าง"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="text-[10px] font-extrabold text-slate-400 w-5 text-center shrink-0">
                                #{idx + 1}
                              </span>
                            </div>

                            {/* Checkbox for batch selection */}
                            <input
                              type="checkbox"
                              checked={selectedPromoIds.includes(promo.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPromoIds([...selectedPromoIds, promo.id]);
                                } else {
                                  setSelectedPromoIds(selectedPromoIds.filter((id) => id !== promo.id));
                                }
                              }}
                              className="w-4 h-4 rounded text-rose-600 cursor-pointer shrink-0 mt-1 sm:mt-0"
                            />
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
                              {(() => {
                                const orig = parseFloat(String(promo.originalPrice || '').replace(/[^0-9.]/g, '')) || 0;
                                const curr = parseFloat(String(promo.promoPrice || (promo.prices && promo.prices[0]?.price) || '').replace(/[^0-9.]/g, '')) || 0;
                                const disc = orig > curr ? orig - curr : 0;
                                if (disc <= 0) return null;
                                return (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                                    ประหยัด ฿{disc.toLocaleString()}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 flex-wrap">
                          {/* Status Dropdown */}
                          <select
                            value={promo.stockStatus || (promo.inStock === false ? 'out_of_stock' : 'ready')}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              const updatedPrices = (promo.prices && Array.isArray(promo.prices))
                                ? promo.prices.map((p) => ({ ...p, status: newStatus }))
                                : promo.prices;
                              const updated = {
                                ...promo,
                                stockStatus: newStatus,
                                inStock: newStatus === 'ready',
                                stockStatusText: newStatus === 'not_ready' ? 'ไม่พร้อมส่ง' : newStatus === 'out_of_stock' ? 'สินค้าหมด' : 'พร้อมส่ง',
                                prices: updatedPrices
                              };
                              handleSavePromo(updated);
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all ${
                              promo.stockStatus === 'not_ready'
                                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:border-amber-400'
                                : (promo.stockStatus === 'out_of_stock' || promo.inStock === false)
                                ? 'bg-rose-50 text-rose-700 border-rose-300 hover:border-rose-400'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-emerald-400'
                            }`}
                          >
                            <option value="ready">🟢 พร้อมส่ง</option>
                            <option value="not_ready">🟠 รอกด / ไม่พร้อมส่ง</option>
                            <option value="out_of_stock">🔴 สินค้าหมด</option>
                          </select>

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
                    );
                  })}
                  </div>
                </div>
              )}

              {/* TAB 3: STORE SETTINGS */}
              {activeTab === 'store' && (
                <AdminStoreSettings
                  settings={settings}
                  products={products}
                  promotions={promotions}
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
