import React, { useState, useEffect } from 'react';
import { X, Flame, Star, Plus, Minus, MessageSquare, ShoppingBag } from 'lucide-react';
import { Product, Topping, CartItem } from '../types';
import { motion, AnimatePresence } from '../lib/motion';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart
}: ProductDetailModalProps) {
  // Form State
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [selectedTemp, setSelectedTemp] = useState<string>('');
  const [selectedSweetness, setSelectedSweetness] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setSelectedLevel(product.options?.levels?.[0] || '');
      setSelectedToppings([]);
      setSelectedTemp(product.options?.coffeeOptions?.temps?.[0] || 'Dingin');
      setSelectedSweetness(product.options?.coffeeOptions?.sweetness?.[0] || 'Normal');
      setQuantity(1);
      setNotes('');
    }
  }, [product, isOpen]);

  const handleToppingToggle = (topping: Topping) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  if (!product) return null;

  // Calculate prices
  const basePrice = product.price;
  const toppingsPrice = selectedToppings.reduce((acc, t) => acc + t.price, 0);
  const unitPrice = basePrice + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddSubmit = () => {
    // Generate a unique ID based on selections so multiple customizations of same product aren't overridden in cart
    const toppingsHash = selectedToppings
      .map((t) => t.id)
      .sort()
      .join(',');
    const uniqueId = `${product.id}_lvl:${selectedLevel}_top:${toppingsHash}_tmp:${selectedTemp}_swt:${selectedSweetness}_notes:${notes}`;

    const cartItem: CartItem = {
      id: uniqueId,
      product,
      quantity,
      selectedLevel: product.options?.type === 'seblak' ? selectedLevel : undefined,
      selectedToppings: product.options?.type === 'seblak' ? selectedToppings : [],
      selectedTemp: product.options?.type === 'kopi' ? selectedTemp : undefined,
      selectedSweetness: product.options?.type === 'kopi' ? selectedSweetness : undefined,
      notes: notes.trim() !== '' ? notes.trim() : undefined
    };

    onAddToCart(cartItem);
    onClose();
  };

  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Content Drawer */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden z-10 border border-brand-beige"
            id="product-detail-modal"
          >
            {/* Header */}
            <div className="p-4 border-b border-brand-beige flex items-center justify-between shrink-0 bg-brand-cream">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500">
                Pilihan Menu: {product.category}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
                aria-label="Tutup"
                id="btn-close-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
              
              {/* Product Info Block */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-start">
                <div className="sm:col-span-5 aspect-4/3 rounded-2xl overflow-hidden shadow-inner border border-brand-beige shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain bg-stone-50"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="sm:col-span-7 space-y-2">
                  {product.isBestSeller && (
                    <span className="inline-flex items-center gap-1 bg-brand-orange text-white text-[9px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                      <Star className="w-2.5 h-2.5 fill-current" /> Favorit Pelanggan
                    </span>
                  )}
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-stone-900 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm font-mono font-bold text-brand-red">
                    Harga dasar: {formatRupiah(product.price)}
                  </p>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Seblak Options (Levels & Toppings) */}
              {product.options?.type === 'seblak' && (
                <div className="space-y-5 border-t border-brand-beige pt-5">
                  
                  {/* Levels Select */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-brand-red fill-current" /> Pilih Level Kepedasan
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {product.options.levels?.map((lvl, idx) => {
                        const isLvlSelected = selectedLevel === lvl;
                        return (
                          <button
                            key={lvl}
                            id={`level-opt-${idx}`}
                            onClick={() => setSelectedLevel(lvl)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                              isLvlSelected
                                ? 'bg-brand-red text-white border-brand-red shadow-sm font-bold'
                                : 'bg-stone-50 border-brand-beige text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            Lvl {idx}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-stone-400 font-mono tracking-wide">
                      {selectedLevel}
                    </p>
                  </div>

                  {/* Toppings Multi Select */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                      Tambah Topping Ekstra (Boleh Pilih Lebih dari Satu)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {product.options.toppings?.map((topping) => {
                        const isToppingSelected = selectedToppings.some((t) => t.id === topping.id);
                        return (
                          <button
                            key={topping.id}
                            id={`topping-opt-${topping.id}`}
                            onClick={() => handleToppingToggle(topping)}
                            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                              isToppingSelected
                                ? 'bg-orange-50 border-brand-orange text-brand-orange shadow-xs font-semibold ring-1 ring-brand-orange/20'
                                : 'bg-stone-50 border-brand-beige text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            <span className="text-xs block truncate">{topping.name}</span>
                            <span className="text-[10px] font-mono text-stone-500 font-bold block mt-1">
                              +{formatRupiah(topping.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Coffee Options (Temp & Sweetness) */}
              {product.options?.type === 'kopi' && (
                <div className="space-y-5 border-t border-brand-beige pt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Temperature */}
                    {product.options.coffeeOptions?.temps && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                          Suhu Penyajian
                        </label>
                        <div className="flex gap-2">
                          {product.options.coffeeOptions.temps.map((temp) => (
                            <button
                              key={temp}
                              id={`temp-opt-${temp.toLowerCase()}`}
                              onClick={() => setSelectedTemp(temp)}
                              className={`flex-1 p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                                selectedTemp === temp
                                  ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                                  : 'bg-stone-50 border-brand-beige text-stone-700 hover:bg-stone-100'
                              }`}
                            >
                              {temp}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sweetness */}
                    {product.options.coffeeOptions?.sweetness && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                          Kadar Gula
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {product.options.coffeeOptions.sweetness.map((sweet) => (
                            <button
                              key={sweet}
                              id={`sweet-opt-${sweet.replace(/\s+/g, '-').toLowerCase()}`}
                              onClick={() => setSelectedSweetness(sweet)}
                              className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                                selectedSweetness === sweet
                                  ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                                  : 'bg-stone-50 border-brand-beige text-stone-700 hover:bg-stone-100'
                              }`}
                            >
                              {sweet}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Special Note Box */}
              <div className="space-y-2 border-t border-brand-beige pt-5">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-stone-400" /> Catatan Khusus Untuk Dapur
                </label>
                <textarea
                  id="detail-special-notes"
                  placeholder="Contoh: Seblak kuah sedikit, Pisahkan topping, Kopi kurang manis..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-18 bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red transition-all resize-none"
                  maxLength={150}
                />
              </div>

              {/* Quantity Counter Block */}
              <div className="flex items-center justify-between border-t border-brand-beige pt-5">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Jumlah Pesanan
                </span>
                <div className="flex items-center gap-3 bg-brand-cream border border-brand-beige rounded-2xl p-1 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-white text-stone-600 rounded-xl transition-all cursor-pointer"
                    id="btn-detail-qty-minus"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span 
                    id="detail-qty-display"
                    className="font-mono font-bold text-sm text-stone-800 w-8 text-center"
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-white text-stone-600 rounded-xl transition-all cursor-pointer"
                    id="btn-detail-qty-plus"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Footer with checkout summary */}
            <div className="p-4 border-t border-brand-beige shrink-0 bg-brand-cream/90 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono">Estimasi Total</span>
                <div className="flex items-baseline gap-1.5">
                  <span 
                    id="detail-total-price"
                    className="font-mono font-extrabold text-lg text-stone-950"
                  >
                    {formatRupiah(totalPrice)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-[11px] font-mono text-stone-400">
                      ({formatRupiah(unitPrice)} / porsi)
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleAddSubmit}
                id="btn-detail-add-to-cart"
                className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-md shadow-brand-red/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tambahkan ke Keranjang</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
