import React, { useEffect, useState } from 'react';
import { LayoutGrid, Plus, Edit, Trash2, CheckCircle2, ShoppingCart, ListCollapse, ToggleLeft, ToggleRight, X, Star, PlusCircle } from 'lucide-react';
import { HERO_CONTENT_DEFAULTS } from '../data';
import { HeroContent, Order, Product, PromoPackage, Topping } from '../types';
import HeroSettingsPanel from './HeroSettingsPanel';

interface AdminPanelProps {
  heroContent: HeroContent;
  products: Product[];
  orders: Order[];
  promos: PromoPackage[];
  onUpdateHeroContent: (heroContent: HeroContent) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onDeletePromo?: (promoId: string) => void;
  onAddPromo?: (promo: PromoPackage) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onClose: () => void;
}

export default function AdminPanel({
  heroContent,
  products,
  orders,
  promos,
  onUpdateHeroContent,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onDeletePromo,
  onAddPromo,
  onUpdateOrderStatus,
  onClose
}: AdminPanelProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<'pesanan' | 'produk' | 'promo' | 'pengaturan'>('pesanan');
  
  // Product Edit/Add State
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Custom Delete Confirmation States (for iframe-safe fallback)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [promoToDelete, setPromoToDelete] = useState<PromoPackage | null>(null);

  // Form States
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Seblak');
  const [formPrice, setFormPrice] = useState(0);
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formBestSeller, setFormBestSeller] = useState(false);
  const [formAgeRestrict, setFormAgeRestrict] = useState(false);

  // Promo Add Form States
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [promoFormName, setPromoFormName] = useState('');
  const [promoFormDesc, setPromoFormDesc] = useState('');
  const [promoFormPrice, setPromoFormPrice] = useState(15000);
  const [promoFormOriginalPrice, setPromoFormOriginalPrice] = useState(20000);
  const [promoFormImage, setPromoFormImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80');
  const [promoFormItems, setPromoFormItems] = useState<string[]>([]);
  const [heroDraft, setHeroDraft] = useState<HeroContent>(heroContent);

  useEffect(() => {
    setHeroDraft(heroContent);
  }, [heroContent]);

  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  const handleEditClick = (prod: Product) => {
    setSelectedProduct(prod);
    setIsEditing(true);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormPrice(prod.price);
    setFormDesc(prod.description);
    setFormImage(prod.image);
    setFormAvailable(prod.isAvailable);
    setFormBestSeller(!!prod.isBestSeller);
    setFormAgeRestrict(!!prod.hasAgeRestriction);
  };

  const handleAddNewClick = () => {
    setSelectedProduct(null);
    setIsEditing(true);
    setFormName('');
    setFormCategory('Seblak');
    setFormPrice(10000);
    setFormDesc('');
    setFormImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80');
    setFormAvailable(true);
    setFormBestSeller(false);
    setFormAgeRestrict(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (formName.trim() === '') return;

    if (selectedProduct) {
      // Edit mode
      const updated: Product = {
        ...selectedProduct,
        name: formName,
        category: formCategory,
        price: formPrice,
        description: formDesc,
        image: formImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
        isAvailable: formAvailable,
        isBestSeller: formBestSeller,
        hasAgeRestriction: formAgeRestrict,
        options: selectedProduct.options // Keep options intact
      };
      onUpdateProduct(updated);
    } else {
      // Add mode
      // Determine options type based on category
      let optionsType: 'seblak' | 'kopi' | 'rokok' | 'default' = 'default';
      let optionsData = undefined;

      if (formCategory === 'Seblak') {
        optionsType = 'seblak';
        optionsData = {
          type: optionsType,
          levels: [
            'Level 0 — Tidak pedas',
            'Level 1 — Sedang',
            'Level 2 — Pedas',
            'Level 3 — Sangat pedas',
            'Level 4 — Pedas maksimal'
          ],
          toppings: [
            { id: 't_ceker', name: 'Ceker', price: 4000 },
            { id: 't_tulang', name: 'Tulang', price: 4000 },
            { id: 't_sosis', name: 'Sosis', price: 3000 },
            { id: 't_bakso', name: 'Bakso', price: 3000 }
          ]
        };
      } else if (formCategory === 'Kopi') {
        optionsType = 'kopi';
        optionsData = {
          type: optionsType,
          coffeeOptions: {
            temps: ['Panas', 'Dingin'],
            sweetness: ['Normal', 'Kurang gula', 'Tanpa gula']
          }
        };
      } else if (formCategory === 'Rokok') {
        optionsType = 'rokok';
        optionsData = { type: optionsType };
      }

      const newProd: Product = {
        id: 'p_custom_' + Date.now(),
        name: formName,
        category: formCategory,
        price: formPrice,
        description: formDesc,
        image: formImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
        isAvailable: formAvailable,
        isBestSeller: formBestSeller,
        hasAgeRestriction: formAgeRestrict,
        options: optionsData as any
      };
      onAddProduct(newProd);
    }

    setIsEditing(false);
    setSelectedProduct(null);
  };

  const handleAddNewPromoClick = () => {
    setIsAddingPromo(true);
    setPromoFormName('');
    setPromoFormDesc('');
    setPromoFormPrice(15000);
    setPromoFormOriginalPrice(20000);
    setPromoFormImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80');
    setPromoFormItems([]);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoFormName.trim() === '') return;

    const newPromo: PromoPackage = {
      id: 'pr_custom_' + Date.now(),
      name: promoFormName,
      description: promoFormDesc,
      price: promoFormPrice,
      originalPrice: promoFormOriginalPrice,
      image: promoFormImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      items: promoFormItems.length > 0 ? promoFormItems : ['1 Porsi Seblak', '1 Es Teh Manis']
    };

    if (onAddPromo) {
      onAddPromo(newPromo);
    }
    setIsAddingPromo(false);
  };

  const statusOptions: Order['status'][] = [
    'Menunggu Konfirmasi',
    'Pesanan Diterima',
    'Sedang Dibuat',
    'Siap Diambil',
    'Sedang Diantar',
    'Selesai',
    'Dibatalkan'
  ];

  const handleSaveHeroSettings = () => {
    onUpdateHeroContent(heroDraft);
  };

  const handleResetHeroSettings = () => {
    setHeroDraft(HERO_CONTENT_DEFAULTS);
    onUpdateHeroContent(HERO_CONTENT_DEFAULTS);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-center bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-5xl h-full sm:h-[95vh] sm:my-[2.5vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider font-mono">
              Local Sandbox Database
            </span>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-stone-900 mt-1">
              Dashboard Admin Warung Ratih
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
            id="btn-close-admin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-100 bg-white px-4 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setActiveAdminTab('pesanan'); setIsEditing(false); }}
            className={`py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'pesanan'
                ? 'border-brand-red text-brand-red font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Daftar Pesanan ({orders.length})
          </button>
          <button
            onClick={() => { setActiveAdminTab('produk'); }}
            className={`py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'produk'
                ? 'border-brand-red text-brand-red font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Kelola Produk ({products.length})
          </button>
          <button
            onClick={() => { setActiveAdminTab('promo'); setIsEditing(false); }}
            className={`py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'promo'
                ? 'border-brand-red text-brand-red font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Promo Aktif ({promos.length})
          </button>
          <button
            onClick={() => { setActiveAdminTab('pengaturan'); setIsEditing(false); setIsAddingPromo(false); }}
            className={`py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'pengaturan'
                ? 'border-brand-red text-brand-red font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Pengaturan Hero
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50/50">
          
          {/* PESANAN VIEW */}
          {activeAdminTab === 'pesanan' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-stone-900 flex items-center gap-2">
                <ShoppingCart className="w-4.5 h-4.5 text-brand-red" />
                Antrean Pesanan Masuk (Sesi Ini)
              </h3>
              
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-stone-100 text-center space-y-2">
                  <p className="font-bold text-stone-700 text-sm">Belum Ada Pesanan</p>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto">
                    Pesanan pelanggan yang melakukan checkout di tab utama akan muncul di sini secara real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/95 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
                    >
                      {/* Customer / ID details */}
                      <div className="md:col-span-4 space-y-1 font-mono text-xs text-stone-500">
                        <span className="bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                          {order.id}
                        </span>
                        <h4 className="font-display font-extrabold text-stone-900 text-sm mt-1.5">{order.customerName}</h4>
                        <p className="text-stone-600 font-semibold">{order.customerPhone}</p>
                        <p className="text-[10px] mt-2">Dibuat: {order.date} {order.time} WIB</p>
                        <p className="text-[10px] text-brand-orange font-bold mt-1">Pembayaran: {order.paymentMethod}</p>
                      </div>

                      {/* Items Ordered column */}
                      <div className="md:col-span-5 space-y-2 text-xs">
                        <span className="text-[10px] uppercase font-bold text-stone-400 font-mono tracking-wider block">Daftar Menu:</span>
                        <div className="space-y-1.5 pl-2 border-l border-stone-100">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="leading-snug">
                              <span className="font-bold text-stone-800">{it.quantity}x {it.product.name}</span>
                              {it.selectedLevel && <span className="text-[10px] text-brand-red ml-1.5 bg-red-50 px-1 rounded-sm">Lvl {it.selectedLevel.split(' — ')[0].replace('Level ', '')}</span>}
                              {it.selectedTemp && <span className="text-[10px] text-amber-800 ml-1.5 bg-amber-50 px-1 rounded-sm">{it.selectedTemp}</span>}
                              {it.selectedToppings.length > 0 && (
                                <p className="text-[10px] text-stone-500 pl-4 mt-0.5">
                                  +Toppings: {it.selectedToppings.map((t) => t.name).join(', ')}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                        {order.notes && (
                          <p className="text-[10px] italic text-stone-500 bg-stone-50 p-2 rounded-xl mt-2 border border-stone-200/40">
                            "Catatan: {order.notes}"
                          </p>
                        )}
                        <p className="text-stone-800 font-bold mt-2 font-mono text-[11px]">
                          Grand Total: <span className="text-brand-red">{formatRupiah(order.total)}</span>
                        </p>
                      </div>

                      {/* Status Modification Column */}
                      <div className="md:col-span-3 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-stone-400 font-mono tracking-wider block">Atur Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                          className="w-full bg-stone-50 border border-stone-250 p-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red font-semibold text-stone-800"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <div className="pt-2">
                          <span className="text-[10px] block text-stone-400">Status Saat Ini:</span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange mt-0.5">
                            <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-ping" />
                            {order.status}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PRODUK VIEW (Lists & Forms) */}
          {activeAdminTab === 'produk' && (
            <div className="space-y-6">
              
              {isEditing ? (
                /* Edit/Add Form */
                <form onSubmit={handleSaveProduct} className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-150 shadow-sm space-y-4">
                  <h4 className="font-display font-extrabold text-base text-stone-900 border-b border-stone-100 pb-3">
                    {selectedProduct ? `Ubah Produk: ${selectedProduct.name}` : 'Tambah Produk Baru'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block uppercase">Nama Produk</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Contoh: Seblak Seafood Super"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block uppercase">Kategori</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:outline-none"
                      >
                        <option value="Seblak">Seblak</option>
                        <option value="Snack">Snack</option>
                        <option value="Kopi">Kopi</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Rokok">Rokok</option>
                      </select>
                    </div>

                    {/* Price */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block uppercase">Harga (Rupiah)</label>
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none font-mono"
                      />
                    </div>

                    {/* Image URL or Local Upload */}
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-stone-700 block uppercase">Gambar Produk</label>
                      <div className="flex gap-2.5 items-center">
                        {formImage && (
                          <div className="relative group shrink-0">
                            <img
                              src={formImage}
                              alt="Preview"
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-stone-50 shadow-sm"
                              referrerPolicy="no-referrer"
                            />
                            {formImage.startsWith('data:') && (
                              <button
                                type="button"
                                onClick={() => setFormImage('')}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm"
                                title="Hapus gambar"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={formImage}
                            onChange={(e) => setFormImage(e.target.value)}
                            placeholder="URL Gambar atau pilih file di bawah..."
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none font-mono"
                          />
                          <div className="flex items-center gap-2">
                            <label className="bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors border border-stone-250 inline-flex items-center gap-1">
                              <span>📂 Upload File Gambar</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    // limit file size to ~3MB to fit comfortably in localstorage
                                    if (file.size > 3 * 1024 * 1024) {
                                      try {
                                        alert("Ukuran gambar terlalu besar! Silakan pilih gambar di bawah 3MB agar performa tetap maksimal.");
                                      } catch {
                                        console.warn("Ukuran gambar terlalu besar! Silakan pilih gambar di bawah 3MB agar performa tetap maksimal.");
                                      }
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        setFormImage(reader.result);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            {formImage && (
                              <button
                                type="button"
                                onClick={() => setFormImage('')}
                                className="text-[10px] text-red-600 font-bold hover:underline"
                              >
                                Reset Gambar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block uppercase">Deskripsi Produk</label>
                      <textarea
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Berikan deskripsi singkat lezat mengenai produk ini..."
                        className="w-full h-16 bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none resize-none"
                      />
                    </div>

                    {/* Checkboxes flags */}
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <label className="flex items-center gap-2 text-xs text-stone-700 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formAvailable}
                          onChange={(e) => setFormAvailable(e.target.checked)}
                          className="rounded text-brand-red focus:ring-brand-red h-4 w-4"
                        />
                        <span>Stok Tersedia (Ready)</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-stone-700 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formBestSeller}
                          onChange={(e) => setFormBestSeller(e.target.checked)}
                          className="rounded text-brand-red focus:ring-brand-red h-4 w-4"
                        />
                        <span>Tampilkan Tag Best Seller</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-stone-700 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formAgeRestrict}
                          onChange={(e) => setFormAgeRestrict(e.target.checked)}
                          className="rounded text-brand-red focus:ring-brand-red h-4 w-4"
                        />
                        <span>Batasi Usia (18+)</span>
                      </label>
                    </div>

                  </div>

                  {/* Actions inside Form */}
                  <div className="flex gap-3 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs rounded-xl"
                    >
                      Simpan Produk
                    </button>
                  </div>

                </form>
              ) : (
                /* Products list */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-100">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">Kelola Produk Warung</h4>
                      <p className="text-[11px] text-stone-400">Total terdaftar: {products.length} menu</p>
                    </div>
                    <button
                      onClick={handleAddNewClick}
                      id="btn-admin-add-new"
                      className="inline-flex items-center justify-center gap-1.5 bg-brand-red hover:bg-red-700 text-white font-extrabold text-xs py-2.5 px-4.5 rounded-xl cursor-pointer"
                    >
                      <PlusCircle className="w-4.5 h-4.5" />
                      <span>Tambah Produk</span>
                    </button>
                  </div>

                  {/* Product Cards Management Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white rounded-2xl p-4 border border-stone-150 flex flex-col justify-between space-y-4"
                      >
                        <div className="flex gap-3 items-start">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-contain bg-stone-50 shrink-0 border"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase font-bold text-stone-400 block font-mono">{prod.category}</span>
                            <h5 className="font-bold text-xs sm:text-sm text-stone-900 truncate leading-snug">{prod.name}</h5>
                            <p className="text-xs font-mono font-bold text-brand-red">{formatRupiah(prod.price)}</p>
                          </div>
                        </div>

                        {/* Status flags */}
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <span className={`px-2 py-0.5 rounded-md font-bold ${
                            prod.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {prod.isAvailable ? 'Stok Ready' : 'Stok Habis'}
                          </span>
                          {prod.isBestSeller && (
                            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-bold">Best Seller</span>
                          )}
                          {prod.hasAgeRestriction && (
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-bold">18+</span>
                          )}
                        </div>

                        {/* Edit delete buttons */}
                        <div className="flex gap-2 border-t border-stone-50 pt-3">
                          <button
                            onClick={() => handleEditClick(prod)}
                            id={`btn-admin-edit-${prod.id}`}
                            className="flex-1 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 font-semibold text-xs border border-stone-200 rounded-lg flex items-center justify-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              let confirmed = false;
                              try {
                                confirmed = window.confirm(`Yakin ingin menghapus ${prod.name}?`);
                              } catch {
                                confirmed = true;
                              }
                              if (confirmed) {
                                onDeleteProduct(prod.id);
                              } else {
                                // Fallback custom dialog if window.confirm is blocked or cancelled
                                setProductToDelete(prod);
                              }
                            }}
                            id={`btn-admin-del-${prod.id}`}
                            className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-brand-red font-semibold text-xs rounded-lg flex items-center justify-center cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* PROMO VIEW */}
          {activeAdminTab === 'promo' && (
            <div className="space-y-6">
              
              {isAddingPromo ? (
                /* Add Promo Form */
                <form onSubmit={handleSavePromo} className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-150 shadow-sm space-y-4">
                  <h4 className="font-display font-extrabold text-base text-stone-900 border-b border-stone-100 pb-3">
                    Tambah Paket Promo Baru
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block uppercase">Nama Paket Promo</label>
                      <input
                        type="text"
                        required
                        value={promoFormName}
                        onChange={(e) => setPromoFormName(e.target.value)}
                        placeholder="Contoh: Promo Duet Kenyang"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block uppercase">Deskripsi Promo</label>
                      <input
                        type="text"
                        required
                        value={promoFormDesc}
                        onChange={(e) => setPromoFormDesc(e.target.value)}
                        placeholder="Contoh: Seblak Komplit + Es Teh Manis Segar"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Promo Price */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block uppercase">Harga Promo (Rupiah)</label>
                      <input
                        type="number"
                        required
                        value={promoFormPrice}
                        onChange={(e) => setPromoFormPrice(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none font-mono"
                      />
                    </div>

                    {/* Original Price */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block uppercase">Harga Asli Sebelum Diskon (Rupiah)</label>
                      <input
                        type="number"
                        required
                        value={promoFormOriginalPrice}
                        onChange={(e) => setPromoFormOriginalPrice(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none font-mono"
                      />
                    </div>

                    {/* Image URL or Local Upload */}
                    <div className="space-y-1.5 col-span-1 sm:col-span-2">
                      <label className="text-xs font-bold text-stone-700 block uppercase">Gambar Paket Promo</label>
                      <div className="flex gap-2.5 items-center">
                        {promoFormImage && (
                          <div className="relative group shrink-0">
                            <img
                              src={promoFormImage}
                              alt="Preview Promo"
                              className="w-16 h-16 rounded-xl object-cover border border-stone-200 bg-stone-50 shadow-sm"
                              referrerPolicy="no-referrer"
                            />
                            {promoFormImage.startsWith('data:') && (
                              <button
                                type="button"
                                onClick={() => setPromoFormImage('')}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm"
                                title="Hapus gambar"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={promoFormImage}
                            onChange={(e) => setPromoFormImage(e.target.value)}
                            placeholder="URL Gambar atau unggah di bawah..."
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none font-mono"
                          />
                          <div className="flex items-center gap-2">
                            <label className="bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors border border-stone-250 inline-flex items-center gap-1">
                              <span>📂 Upload File Gambar Promo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 3 * 1024 * 1024) {
                                      try {
                                        alert("Ukuran gambar terlalu besar! Silakan pilih gambar di bawah 3MB agar performa tetap maksimal.");
                                      } catch {
                                        console.warn("Ukuran gambar terlalu besar!");
                                      }
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        setPromoFormImage(reader.result);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            {promoFormImage && (
                              <button
                                type="button"
                                onClick={() => setPromoFormImage('')}
                                className="text-[10px] text-red-600 font-bold hover:underline"
                              >
                                Reset Gambar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Included Items List Builder */}
                    <div className="space-y-2 col-span-1 sm:col-span-2">
                      <label className="text-xs font-bold text-stone-700 block uppercase">Daftar Item dalam Promo</label>
                      <p className="text-[10px] text-stone-500">Pilih menu yang termasuk dalam paket promo ini:</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-3 border border-stone-200 rounded-2xl bg-stone-50">
                        {products.map((p) => {
                          const isChecked = promoFormItems.includes(p.name);
                          return (
                            <label
                              key={p.id}
                              className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-medium cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-brand-orange/10 border-brand-orange text-brand-orange'
                                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setPromoFormItems([...promoFormItems, p.name]);
                                  } else {
                                    setPromoFormItems(promoFormItems.filter((item) => item !== p.name));
                                  }
                                }}
                                className="accent-brand-orange shrink-0"
                              />
                              <span className="line-clamp-1">{p.name}</span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Display Selected Custom Manual Items as text tags or list */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-stone-400 block uppercase">Preview Item Promo:</span>
                        {promoFormItems.length === 0 ? (
                          <span className="text-xs text-stone-400 italic">Belum ada item dipilih. Default paket akan menggunakan produk ilustratif.</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {promoFormItems.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg"
                              >
                                {item}
                                <button
                                  type="button"
                                  onClick={() => setPromoFormItems(promoFormItems.filter((i) => i !== item))}
                                  className="text-stone-400 hover:text-red-500 font-bold ml-1"
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="flex gap-3 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setIsAddingPromo(false)}
                      className="flex-1 py-3 border border-stone-250 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-50 transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      Simpan Paket Promo
                    </button>
                  </div>
                </form>
              ) : (
                /* List & Header */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display font-bold text-sm text-stone-900 flex items-center gap-2">
                        <Star className="w-4.5 h-4.5 text-brand-orange fill-current" />
                        Daftar Paket Promo Aktif
                      </h3>
                      <p className="text-xs text-stone-450 mt-0.5">Kelola paket diskon dan bundel promo makanan Anda.</p>
                    </div>

                    <button
                      onClick={handleAddNewPromoClick}
                      className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Tambah Paket Promo</span>
                    </button>
                  </div>

                  {promos.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 border border-stone-150 text-center space-y-3">
                      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-brand-orange border border-amber-100">
                        <Star className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-stone-800 text-sm">Belum Ada Promo Aktif</h4>
                      <p className="text-xs text-stone-500 max-w-xs mx-auto">Klik tombol di atas untuk membuat paket promo pertama Anda!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {promos.map((p) => (
                        <div key={p.id} className="bg-white rounded-2xl p-4 border border-stone-150 space-y-3 hover:border-stone-250 transition-colors">
                          <div className="flex gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover bg-stone-50 border border-stone-100"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-stone-900">{p.name}</h4>
                              <p className="text-[11px] text-stone-400 line-clamp-2 mt-0.5">{p.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {p.items && p.items.map((item, idx) => (
                              <span key={idx} className="bg-stone-50 border border-stone-100 text-stone-600 text-[9px] px-1.5 py-0.5 rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-stone-50">
                            <div>
                              <span className="text-[10px] text-stone-400 block">Harga Promo</span>
                              <span className="font-bold text-brand-red">{formatRupiah(p.price)}</span>{' '}
                              <span className="line-through text-stone-400 text-[10px]">{formatRupiah(p.originalPrice)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-1 rounded-md text-[10px]">
                                Diskon Aktif
                              </span>
                              {onDeletePromo && (
                                <button
                                  onClick={() => {
                                    let confirmed = false;
                                    try {
                                      confirmed = window.confirm(`Yakin ingin menghapus promo ${p.name}?`);
                                    } catch {
                                      confirmed = true;
                                    }
                                    if (confirmed) {
                                      onDeletePromo(p.id);
                                    } else {
                                      // Fallback custom dialog if window.confirm is blocked or cancelled
                                      setPromoToDelete(p);
                                    }
                                  }}
                                  className="p-1.5 text-brand-red bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 cursor-pointer"
                                  title="Hapus Promo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {activeAdminTab === 'pengaturan' && (
            <HeroSettingsPanel
              value={heroDraft}
              onChange={setHeroDraft}
              onSave={handleSaveHeroSettings}
              onReset={handleResetHeroSettings}
            />
          )}

        </div>

      </div>

      {/* Fallback Custom Product Delete Confirmation Dialog */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <h4 className="font-display font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-brand-red" />
              Konfirmasi Hapus Produk
            </h4>
            <p className="text-stone-600 text-sm mt-3 leading-relaxed">
              Apakah Anda yakin ingin menghapus produk <strong className="text-stone-900">{productToDelete.name}</strong> dari menu warung? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="flex-1 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fallback Custom Promo Delete Confirmation Dialog */}
      {promoToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <h4 className="font-display font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-brand-red" />
              Konfirmasi Hapus Promo
            </h4>
            <p className="text-stone-600 text-sm mt-3 leading-relaxed">
              Apakah Anda yakin ingin menghapus paket promo <strong className="text-stone-900">{promoToDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setPromoToDelete(null)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (onDeletePromo) onDeletePromo(promoToDelete.id);
                  setPromoToDelete(null);
                }}
                className="flex-1 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
