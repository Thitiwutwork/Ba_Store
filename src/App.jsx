import React, { useState, useMemo } from 'react';
import HeaderBanner from './components/HeaderBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import OrderModal from './components/OrderModal';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { storage } from './utils/storage';
import { LineIcon } from './components/SocialIcons';

export default function App() {
  const [products, setProducts] = useState(() => storage.getProducts());
  const [settings, setSettings] = useState(() => storage.getSettings());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [orderingProduct, setOrderingProduct] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Filtered products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase().trim();
    return products.filter((prod) => {
      return (
        prod.name.toLowerCase().includes(query) ||
        (prod.tag && prod.tag.toLowerCase().includes(query)) ||
        (prod.subDetail && prod.subDetail.toLowerCase().includes(query)) ||
        (prod.devices && prod.devices.toLowerCase().includes(query)) ||
        (prod.resolution && prod.resolution.toLowerCase().includes(query)) ||
        (prod.category && prod.category.toLowerCase().includes(query))
      );
    });
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF5F8] text-[#374151] font-sans">
      {/* Header with Banner, Logo, Store info & Contacts */}
      <HeaderBanner
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {/* Realtime Search Bar & Rate Title */}
        <CategoryFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalItems={filteredProducts.length}
        />

        {/* Product Cards Grid */}
        <ProductGrid
          products={filteredProducts}
          onOrder={(product) => setOrderingProduct(product)}
          isAdmin={false}
          onAddNew={() => setIsAdminOpen(true)}
        />
      </main>

      {/* Floating LINE Quick Button for Mobile */}
      {settings.lineUrl && (
        <a
          href={settings.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 group sm:hidden"
          title="ติดต่อร้านทาง LINE"
        >
          <LineIcon className="w-5 h-5 shrink-0" />
          <span className="text-xs font-semibold">ทักไลน์</span>
        </a>
      )}

      {/* Footer */}
      <Footer
        storeName={settings.storeName}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Detail & Order Modal */}
      <OrderModal
        product={orderingProduct}
        storeSettings={settings}
        onClose={() => setOrderingProduct(null)}
        onShowToast={setToast}
      />

      {/* Admin Dashboard Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        setProducts={setProducts}
        settings={settings}
        setSettings={setSettings}
        onShowToast={setToast}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
