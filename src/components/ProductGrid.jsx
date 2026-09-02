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
      <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
          <PackageOpen className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <h4 className="text-base sm:text-xl font-bold text-slate-700">ไม่พบรายการแอพที่คุณค้นหา</h4>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xs sm:max-w-sm mx-auto">
          ลองค้นหาด้วยคำค้นหาอื่นดูนะคะ
        </p>
        {isAdmin && (
          <button
            onClick={onAddNew}
            className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มแอพรายการแรก</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 pb-16">
      {/* Fully Responsive Grid: 2 cols on mobile, 3 cols on tablet, 4-5 cols on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6">
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
