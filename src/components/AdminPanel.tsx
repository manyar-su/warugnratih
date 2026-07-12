import React, { useEffect, useState } from 'react';
import {
  ClipboardList,
  ImagePlus,
  Package,
  Pencil,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Star,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { MENU_ASSET_OPTIONS } from '../assets';
import { HERO_CONTENT_DEFAULTS, SEBLAK_LEVELS, SEBLAK_TOPPINGS } from '../data';
import { HeroContent, Order, Product, PromoPackage, Topping } from '../types';
import HeroSettingsPanel from './HeroSettingsPanel';
import ImageCropModal from './ImageCropModal';

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

type AdminTab = 'pesanan' | 'produk' | 'promo' | 'pengaturan';
type CropTarget = 'product' | 'promo' | null;

const DEFAULT_TOPPING_TEXT = SEBLAK_TOPPINGS.map((item) => `${item.name}|${item.price}`).join('\n');

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
  onClose,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('pesanan');
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [heroDraft, setHeroDraft] = useState<HeroContent>(heroContent);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Seblak');
  const [formPrice, setFormPrice] = useState(10000);
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState(MENU_ASSET_OPTIONS[0]?.src ?? '');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formBestSeller, setFormBestSeller] = useState(false);
  const [formAgeRestrict, setFormAgeRestrict] = useState(false);
  const [formLevelsText, setFormLevelsText] = useState(SEBLAK_LEVELS.join('\n'));
  const [formToppingsText, setFormToppingsText] = useState(DEFAULT_TOPPING_TEXT);

  const [promoFormName, setPromoFormName] = useState('');
  const [promoFormDesc, setPromoFormDesc] = useState('');
  const [promoFormPrice, setPromoFormPrice] = useState(15000);
  const [promoFormOriginalPrice, setPromoFormOriginalPrice] = useState(20000);
  const [promoFormImage, setPromoFormImage] = useState(MENU_ASSET_OPTIONS[0]?.src ?? '');
  const [promoFormItems, setPromoFormItems] = useState<string[]>([]);

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<CropTarget>(null);

  useEffect(() => {
    setHeroDraft(heroContent);
  }, [heroContent]);

  const formatRupiah = (num: number) => `Rp${num.toLocaleString('id-ID')}`;

  const resetProductForm = () => {
    setSelectedProduct(null);
    setFormName('');
    setFormCategory('Seblak');
    setFormPrice(10000);
    setFormDesc('');
    setFormImage(MENU_ASSET_OPTIONS[0]?.src ?? '');
    setFormAvailable(true);
    setFormBestSeller(false);
    setFormAgeRestrict(false);
    setFormLevelsText(SEBLAK_LEVELS.join('\n'));
    setFormToppingsText(DEFAULT_TOPPING_TEXT);
  };

  const resetPromoForm = () => {
    setPromoFormName('');
    setPromoFormDesc('');
    setPromoFormPrice(15000);
    setPromoFormOriginalPrice(20000);
    setPromoFormImage(MENU_ASSET_OPTIONS[0]?.src ?? '');
    setPromoFormItems([]);
  };

  const parseLevels = (raw: string) =>
    raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

  const parseToppings = (raw: string): Topping[] =>
    raw
      .split('\n')
      .map((line, index) => {
        const [namePart, pricePart] = line.split('|');
        const name = namePart?.trim();
        const price = Number(pricePart?.trim() || 0);

        if (!name) {
          return null;
        }

        return {
          id: `t_${index}_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
          name,
          price: Number.isFinite(price) ? price : 0,
        };
      })
      .filter(Boolean) as Topping[];

  const beginCropUpload = (file: File, target: CropTarget) => {
    if (file.size > 3 * 1024 * 1024) {
      try {
        alert('Ukuran gambar terlalu besar. Gunakan file di bawah 3MB.');
      } catch {
        console.warn('Ukuran gambar terlalu besar. Gunakan file di bawah 3MB.');
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setCropTarget(target);
        setCropImageSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCrop = (croppedImage: string) => {
    if (cropTarget === 'product') {
      setFormImage(croppedImage);
    }

    if (cropTarget === 'promo') {
      setPromoFormImage(croppedImage);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditingProduct(true);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormDesc(product.description);
    setFormImage(product.image);
    setFormAvailable(product.isAvailable);
    setFormBestSeller(Boolean(product.isBestSeller));
    setFormAgeRestrict(Boolean(product.hasAgeRestriction));
    setFormLevelsText((product.options?.levels || SEBLAK_LEVELS).join('\n'));
    setFormToppingsText(
      (product.options?.toppings || SEBLAK_TOPPINGS)
        .map((item) => `${item.name}|${item.price}`)
        .join('\n'),
    );
  };

  const handleSaveProduct = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formName.trim()) return;

    let productOptions: Product['options'] = { type: 'default' };

    if (formCategory === 'Seblak') {
      productOptions = {
        type: 'seblak',
        levels: parseLevels(formLevelsText),
        toppings: parseToppings(formToppingsText),
      };
    } else if (formCategory === 'Kopi') {
      productOptions = {
        type: 'kopi',
        coffeeOptions: {
          temps: ['Panas', 'Dingin'],
          sweetness: ['Normal', 'Kurang gula', 'Tanpa gula'],
        },
      };
    } else if (formCategory === 'Rokok') {
      productOptions = { type: 'rokok' };
    }

    const nextProduct: Product = {
      id: selectedProduct?.id || `p_custom_${Date.now()}`,
      name: formName,
      category: formCategory,
      price: formPrice,
      description: formDesc,
      image: formImage || MENU_ASSET_OPTIONS[0]?.src || '',
      isAvailable: formAvailable,
      isBestSeller: formBestSeller,
      hasAgeRestriction: formAgeRestrict,
      options: productOptions,
    };

    if (selectedProduct) {
      onUpdateProduct(nextProduct);
    } else {
      onAddProduct(nextProduct);
    }

    setIsEditingProduct(false);
    resetProductForm();
  };

  const handleSavePromo = (event: React.FormEvent) => {
    event.preventDefault();
    if (!promoFormName.trim() || !onAddPromo) return;

    onAddPromo({
      id: `promo_${Date.now()}`,
      name: promoFormName,
      description: promoFormDesc,
      price: promoFormPrice,
      originalPrice: promoFormOriginalPrice,
      image: promoFormImage || MENU_ASSET_OPTIONS[0]?.src || '',
      items: promoFormItems.length > 0 ? promoFormItems : ['Paket promo baru'],
    });

    setIsAddingPromo(false);
    resetPromoForm();
  };

  const renderAssetPicker = (
    selectedImage: string,
    onSelect: (src: string) => void,
    accentClass: string,
  ) => (
    <div className="space-y-2 rounded-2xl border border-stone-200 bg-stone-50 p-3">
      <p className="text-[10px] font-bold uppercase text-stone-500">Pilih dari assets/menu</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {MENU_ASSET_OPTIONS.map((asset) => (
          <button
            key={asset.id}
            type="button"
            onClick={() => onSelect(asset.src)}
            className={`overflow-hidden rounded-xl border text-left transition-all ${
              selectedImage === asset.src
                ? `${accentClass} ring-2`
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <img
              src={asset.src}
              alt={asset.label}
              className="h-20 w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="block px-2 py-1.5 text-[10px] font-semibold text-stone-700">
              {asset.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-center overflow-hidden bg-stone-950/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl sm:my-[2.5vh] sm:h-[95vh] sm:rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50 p-4 sm:p-5">
          <div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">
              Local Admin
            </span>
            <h2 className="mt-2 font-display text-lg font-extrabold text-stone-900 sm:text-xl">
              Dashboard Admin Warung Ratih
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-stone-100 bg-white px-4 py-2 no-scrollbar">
          {[
            { id: 'pesanan' as const, label: `Pesanan (${orders.length})`, icon: ClipboardList },
            { id: 'produk' as const, label: `Produk (${products.length})`, icon: Package },
            { id: 'promo' as const, label: `Promo (${promos.length})`, icon: Tag },
            { id: 'pengaturan' as const, label: 'Pengaturan Hero', icon: Settings2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsEditingProduct(false);
                  setIsAddingPromo(false);
                }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-red text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto bg-stone-50 p-4 sm:p-6">
          {activeTab === 'pesanan' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="rounded-[1.5rem] border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
                  Belum ada pesanan masuk dari website ini.
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="grid gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-5 lg:grid-cols-[1.1fr_1fr_0.9fr]">
                    <div className="space-y-1 text-xs text-stone-500">
                      <span className="rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[10px] font-bold text-stone-700">
                        {order.id}
                      </span>
                      <h3 className="pt-2 font-display text-sm font-extrabold text-stone-900">
                        {order.customerName}
                      </h3>
                      <p>{order.customerPhone}</p>
                      <p>{order.deliveryMethod}</p>
                      <p className="font-semibold text-brand-red">{formatRupiah(order.total)}</p>
                    </div>

                    <div className="space-y-2 text-xs text-stone-600">
                      {order.items.map((item) => (
                        <div key={item.id} className="rounded-2xl bg-stone-50 p-3">
                          <p className="font-bold text-stone-800">
                            {item.quantity}x {item.product.name}
                          </p>
                          {item.selectedLevel && <p>{item.selectedLevel}</p>}
                          {item.selectedToppings.length > 0 && (
                            <p>+ {item.selectedToppings.map((topping) => topping.name).join(', ')}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <label className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase text-stone-500">Status</span>
                        <select
                          value={order.status}
                          onChange={(event) =>
                            onUpdateOrderStatus(order.id, event.target.value as Order['status'])
                          }
                          className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs font-semibold text-stone-800"
                        >
                          {[
                            'Menunggu Konfirmasi',
                            'Pesanan Diterima',
                            'Sedang Dibuat',
                            'Siap Diambil',
                            'Sedang Diantar',
                            'Selesai',
                            'Dibatalkan',
                          ].map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                      {order.notes && (
                        <div className="rounded-2xl bg-stone-50 p-3 text-xs text-stone-500">
                          {order.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'produk' && (
            <div className="space-y-5">
              {isEditingProduct ? (
                <form onSubmit={handleSaveProduct} className="space-y-5 rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-4">
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-stone-900">
                        {selectedProduct ? `Edit ${selectedProduct.name}` : 'Tambah Menu Baru'}
                      </h3>
                      <p className="mt-1 text-xs text-stone-500">
                        Upload gambar akan masuk ke cropper dulu supaya landscape tetap penuh.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProduct(false);
                        resetProductForm();
                      }}
                      className="rounded-2xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-600"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase text-stone-700">Nama Menu</span>
                      <input
                        value={formName}
                        onChange={(event) => setFormName(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase text-stone-700">Kategori</span>
                      <select
                        value={formCategory}
                        onChange={(event) => setFormCategory(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs"
                      >
                        <option value="Seblak">Seblak</option>
                        <option value="Snack">Snack</option>
                        <option value="Kopi">Kopi</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Rokok">Rokok</option>
                      </select>
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase text-stone-700">Harga</span>
                      <input
                        type="number"
                        value={formPrice}
                        onChange={(event) => setFormPrice(Number(event.target.value))}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs"
                      />
                    </label>

                    <label className="space-y-1.5 sm:col-span-2">
                      <span className="text-xs font-bold uppercase text-stone-700">Deskripsi</span>
                      <textarea
                        value={formDesc}
                        onChange={(event) => setFormDesc(event.target.value)}
                        className="h-24 w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs"
                      />
                    </label>

                    <div className="space-y-3 sm:col-span-2">
                      <span className="text-xs font-bold uppercase text-stone-700">Gambar Menu</span>
                      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4 lg:flex-row">
                        <img
                          src={formImage}
                          alt="Preview menu"
                          className="h-44 w-full rounded-[1.25rem] object-cover lg:w-56"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 space-y-3">
                          <input
                            value={formImage}
                            onChange={(event) => setFormImage(event.target.value)}
                            className="w-full rounded-2xl border border-stone-200 bg-white p-3 text-xs"
                          />
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-xs font-bold text-stone-700">
                            <ImagePlus className="h-4 w-4" />
                            <span>Upload dan Crop</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) beginCropUpload(file, 'product');
                              }}
                            />
                          </label>
                          {renderAssetPicker(formImage, setFormImage, 'border-brand-red ring-brand-red/20')}
                        </div>
                      </div>
                    </div>

                    {formCategory === 'Seblak' && (
                      <>
                        <label className="space-y-1.5">
                          <span className="text-xs font-bold uppercase text-stone-700">Level Pedas</span>
                          <textarea
                            value={formLevelsText}
                            onChange={(event) => setFormLevelsText(event.target.value)}
                            className="h-36 w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs"
                          />
                        </label>
                        <label className="space-y-1.5">
                          <span className="text-xs font-bold uppercase text-stone-700">Topping</span>
                          <textarea
                            value={formToppingsText}
                            onChange={(event) => setFormToppingsText(event.target.value)}
                            className="h-36 w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs"
                          />
                          <span className="block text-[11px] text-stone-500">Format: `Nama|Harga` per baris.</span>
                        </label>
                      </>
                    )}

                    <div className="grid gap-3 sm:col-span-2 sm:grid-cols-3">
                      {[
                        { checked: formAvailable, setter: setFormAvailable, label: 'Stok tersedia' },
                        { checked: formBestSeller, setter: setFormBestSeller, label: 'Best seller' },
                        { checked: formAgeRestrict, setter: setFormAgeRestrict, label: 'Batasi usia 18+' },
                      ].map((item) => (
                        <label key={item.label} className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs font-semibold text-stone-700">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={(event) => item.setter(event.target.checked)}
                            className="accent-brand-red"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-red px-5 py-3 text-xs font-bold text-white"
                  >
                    <Save className="h-4 w-4" />
                    <span>Simpan Menu</span>
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-stone-900">Kelola Menu</h3>
                      <p className="mt-1 text-xs text-stone-500">Tambah, edit, hapus, dan atur topping menu.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        resetProductForm();
                        setIsEditingProduct(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl bg-brand-red px-4 py-3 text-xs font-bold text-white"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah Menu</span>
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {products.length === 0 ? (
                      <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
                        Menu masih kosong. Tambahkan dulu dari tombol di atas.
                      </div>
                    ) : (
                      products.map((product) => (
                        <div key={product.id} className="space-y-3 rounded-[1.5rem] border border-stone-200 bg-white p-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-44 w-full rounded-[1.25rem] object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                              {product.category}
                            </p>
                            <h4 className="mt-1 font-display text-base font-extrabold text-stone-900">
                              {product.name}
                            </h4>
                            <p className="mt-1 line-clamp-2 text-xs text-stone-500">{product.description}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-brand-red">{formatRupiah(product.price)}</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditProduct(product)}
                                className="rounded-xl bg-stone-100 p-2 text-stone-700"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteProduct(product.id)}
                                className="rounded-xl bg-red-50 p-2 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'promo' && (
            <div className="space-y-5">
              {isAddingPromo ? (
                <form onSubmit={handleSavePromo} className="space-y-5 rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-4">
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-stone-900">Tambah Promo</h3>
                      <p className="mt-1 text-xs text-stone-500">Pilih gambar promo dari assets atau upload lalu crop.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingPromo(false);
                        resetPromoForm();
                      }}
                      className="rounded-2xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-600"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase text-stone-700">Nama Promo</span>
                      <input
                        value={promoFormName}
                        onChange={(event) => setPromoFormName(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase text-stone-700">Deskripsi Promo</span>
                      <input
                        value={promoFormDesc}
                        onChange={(event) => setPromoFormDesc(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase text-stone-700">Harga Promo</span>
                      <input
                        type="number"
                        value={promoFormPrice}
                        onChange={(event) => setPromoFormPrice(Number(event.target.value))}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase text-stone-700">Harga Asli</span>
                      <input
                        type="number"
                        value={promoFormOriginalPrice}
                        onChange={(event) => setPromoFormOriginalPrice(Number(event.target.value))}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs"
                      />
                    </label>

                    <div className="space-y-3 sm:col-span-2">
                      <span className="text-xs font-bold uppercase text-stone-700">Gambar Promo</span>
                      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4 lg:flex-row">
                        <img
                          src={promoFormImage}
                          alt="Preview promo"
                          className="h-44 w-full rounded-[1.25rem] object-cover lg:w-56"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 space-y-3">
                          <input
                            value={promoFormImage}
                            onChange={(event) => setPromoFormImage(event.target.value)}
                            className="w-full rounded-2xl border border-stone-200 bg-white p-3 text-xs"
                          />
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-xs font-bold text-stone-700">
                            <ImagePlus className="h-4 w-4" />
                            <span>Upload dan Crop</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) beginCropUpload(file, 'promo');
                              }}
                            />
                          </label>
                          {renderAssetPicker(promoFormImage, setPromoFormImage, 'border-brand-orange ring-brand-orange/20')}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <span className="text-xs font-bold uppercase text-stone-700">Isi Paket Promo</span>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => {
                          const checked = promoFormItems.includes(product.name);
                          return (
                            <label
                              key={product.id}
                              className={`flex items-center gap-2 rounded-2xl border p-3 text-xs font-semibold ${
                                checked
                                  ? 'border-brand-orange bg-orange-50 text-brand-orange'
                                  : 'border-stone-200 bg-white text-stone-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    setPromoFormItems((current) => [...current, product.name]);
                                  } else {
                                    setPromoFormItems((current) => current.filter((item) => item !== product.name));
                                  }
                                }}
                                className="accent-brand-orange"
                              />
                              <span>{product.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-5 py-3 text-xs font-bold text-white"
                  >
                    <Save className="h-4 w-4" />
                    <span>Simpan Promo</span>
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-stone-900">Kelola Promo</h3>
                      <p className="mt-1 text-xs text-stone-500">Tambahkan promo baru atau hapus promo lama.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        resetPromoForm();
                        setIsAddingPromo(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-4 py-3 text-xs font-bold text-white"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah Promo</span>
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {promos.length === 0 ? (
                      <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
                        Promo masih kosong.
                      </div>
                    ) : (
                      promos.map((promo) => (
                        <div key={promo.id} className="space-y-3 rounded-[1.5rem] border border-stone-200 bg-white p-4">
                          <img
                            src={promo.image}
                            alt={promo.name}
                            className="h-44 w-full rounded-[1.25rem] object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-display text-base font-extrabold text-stone-900">{promo.name}</h4>
                            <p className="mt-1 line-clamp-2 text-xs text-stone-500">{promo.description}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-brand-red">{formatRupiah(promo.price)}</p>
                              <p className="text-[11px] text-stone-400 line-through">
                                {formatRupiah(promo.originalPrice)}
                              </p>
                            </div>
                            {onDeletePromo && (
                              <button
                                type="button"
                                onClick={() => onDeletePromo(promo.id)}
                                className="rounded-xl bg-red-50 p-2 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'pengaturan' && (
            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-xs leading-6 text-emerald-900">
                Pengaturan hero sudah mendukung upload dan crop gambar. Jika ingin kembali ke tampilan awal, gunakan tombol reset di bawah.
              </div>
              <HeroSettingsPanel
                value={heroDraft}
                onChange={setHeroDraft}
                onSave={() => onUpdateHeroContent(heroDraft)}
                onReset={() => {
                  setHeroDraft(HERO_CONTENT_DEFAULTS);
                  onUpdateHeroContent(HERO_CONTENT_DEFAULTS);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <ImageCropModal
        aspectRatio={4 / 3}
        imageSrc={cropImageSrc}
        isOpen={Boolean(cropImageSrc)}
        onApply={handleApplyCrop}
        onClose={() => {
          setCropImageSrc(null);
          setCropTarget(null);
        }}
        title="Crop Gambar Menu atau Promo"
      />
    </div>
  );
}
