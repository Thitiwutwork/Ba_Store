import React from 'react';
import ProductCard from './ProductCard';
import { PackageOpen, Plus } from 'lucide-react';

export default function ProductGrid({
  products,
  onOrder,
  isAdmin,
  onEdit,
  onDelete,
  onAddNew
}) {
  if (products.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-3 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h4 className="text-base font-semibold text-slate-700">ไม่พบรายการแอพที่คุณค้นหา</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูนะคะ
        </p>
        {isAdmin && (
          <button
            onClick={onAddNew}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มแอพรายการแรก</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-12">
      {/* 2-Column on Mobile, 3 on Tablet, 4 on Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOrder={onOrder}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
