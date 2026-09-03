import React, { useState, useRef } from 'react';
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
  ArrowDown,
  LayoutGrid,
  List,
  ChevronsUp
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

  // View Modes: 'list' (detailed table) | 'reorder' (visual card sorter)
  const [prodViewMode, setProdViewMode] = useState('list');
  const [promoViewMode, setPromoViewMode] = useState('list');

  // Drag references (useRef avoids re-rendering during drag)
  const draggedProdIndexRef = useRef(null);
  const draggedPromoIndexRef = useRef(null);
  const [dropTargetProdIndex, setDropTargetProdIndex] = useState(null);
  const [dropTargetPromoIndex, setDropTargetPromoIndex] = useState(null);

  // Security Password check
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Reordering Handlers for Products
  const handleJumpProduct = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= products.length || fromIndex === toIndex) return;
    const reordered = [...products];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    const withSort = reordered.map((p, idx) => ({ ...p, sortOrder: idx }));
    setProducts(withSort);
    storage.saveProducts(withSort);
    onShowToast({ type: 'success', message: `ย้าย "${moved.name}" ไปอยู่อันดับ #${toIndex + 1} เรียบร้อยแล้ว` });
  };

  const handleMoveProduct = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    handleJumpProduct(index, targetIndex);
  };

  const handleProdDragStart = (e, index) => {
    draggedProdIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleProdDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetProdIndex !== index) {
      setDropTargetProdIndex(index);
    }
  };

  const handleProdDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetProdIndex(null);
    const raw = e.dataTransfer.getData('text/plain');
    const sourceIndex = raw !== '' ? parseInt(raw, 10) : draggedProdIndexRef.current;
    if (isNaN(sourceIndex) || sourceIndex === null || sourceIndex === targetIndex) {
      draggedProdIndexRef.current = null;
      return;
    }
    handleJumpProduct(sourceIndex, targetIndex);
    draggedProdIndexRef.current = null;
  };

  const handleProdDragEnd = () => {
    draggedProdIndexRef.current = null;
    setDropTargetProdIndex(null);
  };

  // Reordering Handlers for Promotions
  const handleJumpPromo = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= promotions.length || fromIndex === toIndex) return;
    const reordered = [...promotions];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    const withSort = reordered.map((p, idx) => ({ ...p, sortOrder: idx }));
    setPromotions(withSort);
    storage.savePromotions(withSort);
    onShowToast({ type: 'success', message: `ย้ายโปรโมชั่น "${moved.name}" ไปอยู่อันดับ #${toIndex + 1} เรียบร้อยแล้ว` });
  };

  const handleMovePromo = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    handleJumpPromo(index, targetIndex);
  };

  const handlePromoDragStart = (e, index) => {
    draggedPromoIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handlePromoDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetPromoIndex !== index) {
      setDropTargetPromoIndex(index);
    }
  };

  const handlePromoDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetPromoIndex(null);
    const raw = e.dataTransfer.getData('text/plain');
    const sourceIndex = raw !== '' ? parseInt(raw, 10) : draggedPromoIndexRef.current;
    if (isNaN(sourceIndex) || sourceIndex === null || sourceIndex === targetIndex) {
      draggedPromoIndexRef.current = null;
      return;
    }
    handleJumpPromo(sourceIndex, targetIndex);
    draggedPromoIndexRef.current = null;
  };

  const handlePromoDragEnd = () => {
    draggedPromoIndexRef.current = null;
    setDropTargetPromoIndex(null);
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
              <div className="flex items-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 border-b border-slate-100 pb-2.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${

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
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${

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
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${

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
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${

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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-pink-50/50 p-3 sm:p-3.5 rounded-2xl border border-pink-100 gap-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">รายการแอพทั้งหมด ({products.length})</h4>
                      <p className="text-xs text-slate-500">
                        เลือกดรอปดาวน์เปลี่ยนสถานะได้ทันที หรือติ๊กเลือกหลายแอพเพื่อเปลี่ยนสถานะพร้อมกัน
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* View Mode Toggle: List vs Reorder Grid */}
                      <div className="flex items-center bg-white p-1 rounded-xl border border-pink-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setProdViewMode('list')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            prodViewMode === 'list'
                              ? 'bg-pink-500 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <List className="w-3.5 h-3.5" />
                          <span>มุมมองรายการ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProdViewMode('reorder')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            prodViewMode === 'reorder'
                              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                              : 'text-pink-600 hover:bg-pink-50'
                          }`}
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          <span>🔀 โหมดจัดเรียงการ์ด</span>
                        </button>
                      </div>

                      {prodViewMode === 'list' && (
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
                      )}

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
                    <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 p-2.5 sm:p-3 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
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

                  {/* Visual Reorder Grid Mode */}
                  {prodViewMode === 'reorder' ? (
                    <div className="bg-pink-50/40 p-3.5 rounded-2xl border border-pink-200 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <LayoutGrid className="w-4 h-4 text-pink-500" />
                          <span>โหมดจัดเรียงการ์ด: คลิกเลือกอันดับในช่องตัวเลข หรือกดปุ่ม ▲ / ▼ หรือคลิกลากการ์ดสลับที่ได้ทันที</span>
                        </div>
                        <span className="text-xs text-pink-600 bg-white border border-pink-200 px-2.5 py-0.5 rounded-full font-bold">
                          ทั้งหมด {products.length} แอพ
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {products.map((prod, idx) => (
                          <div
                            key={prod.id}
                            draggable
                            onDragStart={(e) => handleProdDragStart(e, idx)}
                            onDragOver={(e) => handleProdDragOver(e, idx)}
                            onDrop={(e) => handleProdDrop(e, idx)}
                            onDragEnd={handleProdDragEnd}
                            className={`bg-white rounded-2xl p-3 border-2 shadow-xs flex flex-col justify-between items-center text-center transition-all cursor-grab active:cursor-grabbing hover:shadow-md relative group ${
                              dropTargetProdIndex === idx
                                ? 'border-pink-500 ring-2 ring-pink-300 bg-pink-50/70 scale-102'
                                : 'border-slate-200/90 hover:border-pink-300'
                            }`}
                          >
                            {/* Top Bar: Sequence Number & Direct Dropdown */}
                            <div className="w-full flex items-center justify-between gap-1 mb-1.5">
                              <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-black text-xs flex items-center justify-center shadow-xs">
                                #{idx + 1}
                              </span>
                              <select
                                value={idx}
                                onChange={(e) => handleJumpProduct(idx, parseInt(e.target.value, 10))}
                                className="text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg px-1.5 py-0.5 outline-none cursor-pointer"
                                title="คลิกเลือกเปลี่ยนไปอันดับนี้ทันที"
                              >
                                {products.map((_, pIdx) => (
                                  <option key={pIdx} value={pIdx}>
                                    อันดับ {pIdx + 1}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Center: App Icon & Name */}
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 p-1.5 border border-slate-200 flex items-center justify-center my-1 group-hover:scale-105 transition-transform">
                              {prod.icon ? (
                                <img src={prod.icon} alt={prod.name} draggable={false} className="w-full h-full object-contain rounded-xl" />
                              ) : (
                                <span className="text-xs font-bold text-pink-500">APP</span>
                              )}
                            </div>

                            <div className="w-full mt-1">
                              <h5 className="text-xs font-bold text-slate-800 truncate" title={prod.name}>
                                {prod.name}
                              </h5>
                              <span className="text-[10px] text-slate-400 truncate block">
                                {prod.category}
                              </span>
                            </div>

                            {/* Quick Move Buttons */}
                            <div className="mt-2 w-full pt-1.5 border-t border-slate-100 flex items-center justify-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={(e) => { e.stopPropagation(); handleMoveProduct(idx, 'up'); }}
                                className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-pink-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                                title="เลื่อนขึ้น 1 อันดับ"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === products.length - 1}
                                onClick={(e) => { e.stopPropagation(); handleMoveProduct(idx, 'down'); }}
                                className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-pink-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                                title="เลื่อนลง 1 อันดับ"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={(e) => { e.stopPropagation(); handleJumpProduct(idx, 0); }}
                                className="px-1.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-pink-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none text-[10px] font-bold transition-colors cursor-pointer"
                                title="ย้ายขึ้นไปอยู่อันดับ 1 บนสุด"
                              >
                                บนสุด
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Detailed Product Items List (Fully Responsive Mobile + Desktop) */
                    <div className="space-y-2.5">
                      {products.map((prod, idx) => (
                        <div
                          key={prod.id}
                          onDragOver={(e) => handleProdDragOver(e, idx)}
                          onDrop={(e) => handleProdDrop(e, idx)}
                          className={`p-3 sm:p-3.5 bg-white hover:bg-pink-50/30 rounded-2xl border shadow-xs transition-all duration-150 flex flex-col gap-2.5 sm:gap-3 ${
                            dropTargetProdIndex === idx
                              ? 'border-pink-500 ring-2 ring-pink-300 bg-pink-50/60'
                              : selectedProductIds.includes(prod.id)
                              ? 'border-pink-500 ring-2 ring-pink-100 bg-pink-50/20'
                              : 'border-slate-200/80'
                          }`}
                        >
                          {/* Mobile-Only Top Control Bar */}
                          <div className="flex sm:hidden items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-1.5">
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
                                className="w-4 h-4 rounded text-pink-600 cursor-pointer shrink-0"
                              />
                              <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200/90 rounded-lg p-0.5 shadow-2xs select-none">
                                <select
                                  value={idx}
                                  onChange={(e) => handleJumpProduct(idx, parseInt(e.target.value, 10))}
                                  className="bg-white border border-pink-200 text-pink-700 font-extrabold text-[11px] px-1 py-0.5 rounded outline-none cursor-pointer"
                                  title="เลือกอันดับ"
                                >
                                  {products.map((_, pIdx) => (
                                    <option key={pIdx} value={pIdx}>
                                      #{pIdx + 1}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={(e) => { e.stopPropagation(); handleMoveProduct(idx, 'up'); }}
                                  className="p-1 rounded text-slate-500 hover:text-pink-600 disabled:opacity-20 cursor-pointer"
                                  title="ขึ้น"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === products.length - 1}
                                  onClick={(e) => { e.stopPropagation(); handleMoveProduct(idx, 'down'); }}
                                  className="p-1 rounded text-slate-500 hover:text-pink-600 disabled:opacity-20 cursor-pointer"
                                  title="ลง"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={(e) => { e.stopPropagation(); handleJumpProduct(idx, 0); }}
                                  className="px-1 py-0.5 rounded text-[9px] font-bold text-slate-500 hover:text-pink-600 disabled:opacity-20 cursor-pointer"
                                  title="บนสุด"
                                >
                                  บนสุด
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
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
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold border outline-none cursor-pointer ${
                                  prod.stockStatus === 'not_ready'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : (prod.stockStatus === 'out_of_stock' || prod.inStock === false)
                                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                }`}
                              >
                                <option value="ready">🟢 พร้อมส่ง</option>
                                <option value="not_ready">🟠 รอกด</option>
                                <option value="out_of_stock">🔴 หมด</option>
                              </select>
                              <button
                                onClick={() => handleEditProduct(prod)}
                                className="p-1 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="p-1 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
                                title="ลบ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Main Row: Desktop Controls + Thumbnail + Info + Desktop Actions */}
                          <div className="flex items-center justify-between gap-3 w-full">
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                              {/* Desktop-Only Reorder & Checkbox */}
                              <div className="hidden sm:flex items-center gap-2 shrink-0">
                                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-xl p-1 shadow-2xs select-none">
                                  <div
                                    draggable
                                    onDragStart={(e) => handleProdDragStart(e, idx)}
                                    onDragEnd={handleProdDragEnd}
                                    className="p-1 text-slate-400 hover:text-pink-600 cursor-grab active:cursor-grabbing hover:bg-white rounded-lg transition-colors"
                                    title="คลิกลากเพื่อสลับตำแหน่ง"
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <select
                                    value={idx}
                                    onChange={(e) => handleJumpProduct(idx, parseInt(e.target.value, 10))}
                                    className="bg-white border border-pink-200 text-pink-700 font-extrabold text-xs px-1.5 py-0.5 rounded-lg outline-none cursor-pointer hover:border-pink-400"
                                    title="คลิกเลือกเปลี่ยนไปอันดับนี้ทันที"
                                  >
                                    {products.map((_, pIdx) => (
                                      <option key={pIdx} value={pIdx}>
                                        #{pIdx + 1}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="flex items-center gap-0.5 border-l border-slate-200 pl-1">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={(e) => { e.stopPropagation(); handleMoveProduct(idx, 'up'); }}
                                      className="p-1 rounded text-slate-500 hover:text-pink-600 hover:bg-white disabled:opacity-20 cursor-pointer transition-colors"
                                      title="ย้ายขึ้นบน 1 ตำแหน่ง"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === products.length - 1}
                                      onClick={(e) => { e.stopPropagation(); handleMoveProduct(idx, 'down'); }}
                                      className="p-1 rounded text-slate-500 hover:text-pink-600 hover:bg-white disabled:opacity-20 cursor-pointer transition-colors"
                                      title="ย้ายลงล่าง 1 ตำแหน่ง"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={(e) => { e.stopPropagation(); handleJumpProduct(idx, 0); }}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500 hover:text-pink-600 hover:bg-white disabled:opacity-20 cursor-pointer transition-colors"
                                      title="ย้ายไปบนสุด (อันดับ 1)"
                                    >
                                      บนสุด
                                    </button>
                                  </div>
                                </div>
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
                                  className="w-4 h-4 rounded text-pink-600 cursor-pointer"
                                />
                              </div>

                              {/* Thumbnail */}
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 p-1.5 border border-slate-200 flex items-center justify-center shrink-0">
                                {prod.icon ? (
                                  <img src={prod.icon} alt={prod.name} className="w-full h-full object-contain rounded-xl" />
                                ) : (
                                  <span className="text-xs text-pink-500 font-bold">APP</span>
                                )}
                              </div>

                              <div className="min-w-0 space-y-0.5 sm:space-y-1 flex-1">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                    {prod.name}
                                  </h4>
                                  {prod.tag && (
                                    <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold shrink-0">
                                      {prod.tag}
                                    </span>
                                  )}
                                </div>

                                {/* Dynamic Price Tiers Display */}
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs flex-wrap">
                                  {(() => {
                                    const priceList = (prod.prices && Array.isArray(prod.prices) && prod.prices.length > 0)
                                      ? prod.prices
                                      : [
                                          { label: prod.priceLabel || 'ลูกค้า', price: prod.price, period: prod.pricePeriod },
                                          ...(prod.hasSecondPrice && prod.secondPrice ? [{ label: prod.secondPriceLabel || 'ร้าน', price: prod.secondPrice, period: prod.pricePeriod }] : [])
                                        ];

                                    return priceList.map((p, pIndex) => (
                                      <React.Fragment key={pIndex}>
                                        <span className={`font-bold ${pIndex === 0 ? 'text-pink-600' : pIndex === 1 ? 'text-purple-600' : 'text-rose-600'}`}>
                                          {p.label}: {prod.priceUnit || '฿'}{p.price}
                                        </span>
                                        {pIndex < priceList.length - 1 && <span className="text-slate-300">/</span>}
                                      </React.Fragment>
                                    ));
                                  })()}
                                  <span className="text-slate-300">•</span>
                                  <span className="text-slate-500 font-medium">{prod.category}</span>
                                </div>

                                {/* Devices & Resolution */}
                                {(prod.devices || prod.resolution) && (
                                  <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
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

                            {/* Desktop-Only Action Buttons */}
                            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
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
                        </div>
                      ))}
                    </div>
                )}
              </div>
            )}

              {/* TAB 2: PROMOTIONS LIST & CRUD */}
              {activeTab === 'promotions' && (
                <div className="space-y-4">
                  {/* Top Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-rose-50/60 p-3 sm:p-3.5 rounded-2xl border border-rose-200 gap-2.5">
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
                      {/* View Mode Toggle: List vs Reorder Grid */}
                      <div className="flex items-center bg-white p-1 rounded-xl border border-rose-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setPromoViewMode('list')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            promoViewMode === 'list'
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <List className="w-3.5 h-3.5" />
                          <span>มุมมองรายการ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPromoViewMode('reorder')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            promoViewMode === 'reorder'
                              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs'
                              : 'text-rose-600 hover:bg-rose-50'
                          }`}
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          <span>🔀 โหมดจัดเรียงการ์ด</span>
                        </button>
                      </div>

                      {promoViewMode === 'list' && (
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
                      )}

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
                    <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 p-2.5 sm:p-3 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
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

                  {/* Visual Reorder Grid Mode for Promotions */}
                  {promoViewMode === 'reorder' ? (
                    <div className="bg-rose-50/40 p-3.5 rounded-2xl border border-rose-200 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <LayoutGrid className="w-4 h-4 text-rose-500" />
                          <span>โหมดจัดเรียงการ์ด: คลิกเลือกอันดับในช่องตัวเลข หรือกดปุ่ม ▲ / ▼ หรือคลิกลากการ์ดสลับที่ได้ทันที</span>
                        </div>
                        <span className="text-xs text-rose-600 bg-white border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
                          ทั้งหมด {promotions.length} โปรโมชั่น
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {promotions.map((promo, idx) => (
                          <div
                            key={promo.id}
                            draggable
                            onDragStart={(e) => handlePromoDragStart(e, idx)}
                            onDragOver={(e) => handlePromoDragOver(e, idx)}
                            onDrop={(e) => handlePromoDrop(e, idx)}
                            onDragEnd={handlePromoDragEnd}
                            className={`bg-white rounded-2xl p-3 border-2 shadow-xs flex flex-col justify-between items-center text-center transition-all cursor-grab active:cursor-grabbing hover:shadow-md relative group ${
                              dropTargetPromoIndex === idx
                                ? 'border-rose-500 ring-2 ring-rose-300 bg-rose-50/70 scale-102'
                                : 'border-slate-200/90 hover:border-rose-300'
                            }`}
                          >
                            {/* Top Bar: Sequence Number & Direct Dropdown */}
                            <div className="w-full flex items-center justify-between gap-1 mb-1.5">
                              <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white font-black text-xs flex items-center justify-center shadow-xs">
                                #{idx + 1}
                              </span>
                              <select
                                value={idx}
                                onChange={(e) => handleJumpPromo(idx, parseInt(e.target.value, 10))}
                                className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg px-1.5 py-0.5 outline-none cursor-pointer"
                                title="คลิกเลือกเปลี่ยนไปอันดับนี้ทันที"
                              >
                                {promotions.map((_, pIdx) => (
                                  <option key={pIdx} value={pIdx}>
                                    อันดับ {pIdx + 1}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Dual App Icons */}
                            <div className="flex items-center p-1.5 bg-rose-50/50 rounded-xl border border-rose-100 my-1 group-hover:scale-105 transition-transform">
                              <div className="w-9 h-9 rounded-lg bg-white p-1 border border-pink-100 flex items-center justify-center">
                                <img src={promo.app1Icon} alt={promo.app1Name} draggable={false} className="w-full h-full object-contain rounded" />
                              </div>
                              <span className="text-xs font-black text-rose-500 mx-1">+</span>
                              <div className="w-9 h-9 rounded-lg bg-white p-1 border border-purple-100 flex items-center justify-center">
                                <img src={promo.app2Icon} alt={promo.app2Name} draggable={false} className="w-full h-full object-contain rounded" />
                              </div>
                            </div>

                            <div className="w-full mt-1">
                              <h5 className="text-xs font-bold text-slate-800 truncate" title={promo.name}>
                                {promo.name}
                              </h5>
                              <span className="text-[11px] font-extrabold text-rose-600 block">
                                {promo.currency || '฿'}{promo.promoPrice}
                              </span>
                            </div>

                            {/* Quick Move Buttons */}
                            <div className="mt-2 w-full pt-1.5 border-t border-slate-100 flex items-center justify-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={(e) => { e.stopPropagation(); handleMovePromo(idx, 'up'); }}
                                className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                                title="เลื่อนขึ้น 1 อันดับ"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === promotions.length - 1}
                                onClick={(e) => { e.stopPropagation(); handleMovePromo(idx, 'down'); }}
                                className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                                title="เลื่อนลง 1 อันดับ"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={(e) => { e.stopPropagation(); handleJumpPromo(idx, 0); }}
                                className="px-1.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none text-[10px] font-bold transition-colors cursor-pointer"
                                title="ย้ายขึ้นไปอยู่อันดับ 1 บนสุด"
                              >
                                บนสุด
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Detailed Promotions List (Fully Responsive Mobile + Desktop) */
                    <div className="space-y-2.5">
                      {promotions.map((promo, idx) => (
                        <div
                          key={promo.id}
                          onDragOver={(e) => handlePromoDragOver(e, idx)}
                          onDrop={(e) => handlePromoDrop(e, idx)}
                          className={`p-3 sm:p-3.5 bg-white hover:bg-rose-50/30 rounded-2xl border shadow-xs transition-all duration-150 flex flex-col gap-2.5 sm:gap-3 ${
                            dropTargetPromoIndex === idx
                              ? 'border-rose-500 ring-2 ring-rose-300 bg-rose-50/60'
                              : selectedPromoIds.includes(promo.id)
                              ? 'border-rose-500 ring-2 ring-rose-100 bg-rose-50/20'
                              : 'border-slate-200/80'
                          }`}
                        >
                          {/* Mobile-Only Top Control Bar */}
                          <div className="flex sm:hidden items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-1.5">
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
                                className="w-4 h-4 rounded text-rose-600 cursor-pointer shrink-0"
                              />
                              <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200/90 rounded-lg p-0.5 shadow-2xs select-none">
                                <select
                                  value={idx}
                                  onChange={(e) => handleJumpPromo(idx, parseInt(e.target.value, 10))}
                                  className="bg-white border border-rose-200 text-rose-700 font-extrabold text-[11px] px-1 py-0.5 rounded outline-none cursor-pointer"
                                  title="เลือกอันดับ"
                                >
                                  {promotions.map((_, pIdx) => (
                                    <option key={pIdx} value={pIdx}>
                                      #{pIdx + 1}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={(e) => { e.stopPropagation(); handleMovePromo(idx, 'up'); }}
                                  className="p-1 rounded text-slate-500 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
                                  title="ขึ้น"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === promotions.length - 1}
                                  onClick={(e) => { e.stopPropagation(); handleMovePromo(idx, 'down'); }}
                                  className="p-1 rounded text-slate-500 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
                                  title="ลง"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={(e) => { e.stopPropagation(); handleJumpPromo(idx, 0); }}
                                  className="px-1 py-0.5 rounded text-[9px] font-bold text-slate-500 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
                                  title="บนสุด"
                                >
                                  บนสุด
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
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
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold border outline-none cursor-pointer ${
                                  promo.stockStatus === 'not_ready'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : (promo.stockStatus === 'out_of_stock' || promo.inStock === false)
                                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                }`}
                              >
                                <option value="ready">🟢 พร้อมส่ง</option>
                                <option value="not_ready">🟠 รอกด</option>
                                <option value="out_of_stock">🔴 หมด</option>
                              </select>
                              <button
                                onClick={() => handleEditPromo(promo)}
                                className="p-1 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePromo(promo.id, promo.name)}
                                className="p-1 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
                                title="ลบ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Main Row: Desktop Controls + Dual Icons + Info + Desktop Actions */}
                          <div className="flex items-center justify-between gap-3 w-full">
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                              {/* Desktop-Only Reorder & Checkbox */}
                              <div className="hidden sm:flex items-center gap-2 shrink-0">
                                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-xl p-1 shadow-2xs select-none">
                                  <div
                                    draggable
                                    onDragStart={(e) => handlePromoDragStart(e, idx)}
                                    onDragEnd={handlePromoDragEnd}
                                    className="p-1 text-slate-400 hover:text-rose-600 cursor-grab active:cursor-grabbing hover:bg-white rounded-lg transition-colors"
                                    title="คลิกลากเพื่อสลับตำแหน่ง"
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <select
                                    value={idx}
                                    onChange={(e) => handleJumpPromo(idx, parseInt(e.target.value, 10))}
                                    className="bg-white border border-rose-200 text-rose-700 font-extrabold text-xs px-1.5 py-0.5 rounded-lg outline-none cursor-pointer hover:border-rose-400"
                                    title="คลิกเลือกเปลี่ยนไปอันดับนี้ทันที"
                                  >
                                    {promotions.map((_, pIdx) => (
                                      <option key={pIdx} value={pIdx}>
                                        #{pIdx + 1}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="flex items-center gap-0.5 border-l border-slate-200 pl-1">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={(e) => { e.stopPropagation(); handleMovePromo(idx, 'up'); }}
                                      className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-white disabled:opacity-20 cursor-pointer transition-colors"
                                      title="ย้ายขึ้นบน 1 ตำแหน่ง"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === promotions.length - 1}
                                      onClick={(e) => { e.stopPropagation(); handleMovePromo(idx, 'down'); }}
                                      className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-white disabled:opacity-20 cursor-pointer transition-colors"
                                      title="ย้ายลงล่าง 1 ตำแหน่ง"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={(e) => { e.stopPropagation(); handleJumpPromo(idx, 0); }}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500 hover:text-rose-600 hover:bg-white disabled:opacity-20 cursor-pointer transition-colors"
                                      title="ย้ายไปบนสุด (อันดับ 1)"
                                    >
                                      บนสุด
                                    </button>
                                  </div>
                                </div>
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
                                  className="w-4 h-4 rounded text-rose-600 cursor-pointer shrink-0"
                                />
                              </div>

                              {/* Dual App Icons Showcase */}
                              <div className="flex items-center p-1 bg-rose-50/50 rounded-xl border border-rose-100 shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white p-1 border border-pink-100 flex items-center justify-center">
                                  <img src={promo.app1Icon} alt={promo.app1Name} className="w-full h-full object-contain rounded" />
                                </div>
                                <span className="text-xs font-black text-rose-500 mx-1">+</span>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white p-1 border border-purple-100 flex items-center justify-center">
                                  <img src={promo.app2Icon} alt={promo.app2Name} className="w-full h-full object-contain rounded" />
                                </div>
                              </div>

                              <div className="min-w-0 space-y-0.5 sm:space-y-1 flex-1">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                    {promo.name}
                                  </h4>
                                  {promo.tag && (
                                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-semibold shrink-0">
                                      {promo.tag}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs flex-wrap">
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

                            {/* Desktop-Only Actions */}
                            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
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
                        </div>
                      ))}
                    </div>
                )}
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
