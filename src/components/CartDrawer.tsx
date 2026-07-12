import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, FileText, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from '../lib/motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  // Calculate Subtotal
  const calculateItemPrice = (item: CartItem) => {
    const base = item.product.price;
    const toppings = item.selectedToppings.reduce((acc, t) => acc + t.price, 0);
    return base + toppings;
  };

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + calculateItemPrice(item) * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden z-10 border-l border-brand-beige"
            id="cart-drawer-panel"
          >
            {/* Header */}
            <div className="p-4 border-b border-brand-beige flex items-center justify-between shrink-0 bg-brand-cream">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-red" />
                <h3 className="font-display font-extrabold text-stone-900">
                  Keranjang Belanja
                </h3>
                <span className="bg-brand-red/10 text-brand-red text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                  {cartItems.length} Jenis
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
                id="btn-close-cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                /* Empty Cart State */
                <div 
                  id="empty-cart-state"
                  className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4"
                >
                  <div className="w-20 h-20 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center shadow-inner animate-pulse-subtle">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-stone-800 text-base">
                      Keranjang Belanja Kosong
                    </h4>
                    <p className="text-stone-500 text-xs leading-relaxed max-w-xs">
                      Sepertinya Anda belum memilih menu. Yuk jelajahi menu spesial Warung Ratih dan mulailah memesan!
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-brand-red hover:bg-red-700 text-white font-semibold text-xs py-2.5 px-6 rounded-xl shadow-xs cursor-pointer"
                  >
                    Jelajahi Menu Sekarang
                  </button>
                </div>
              ) : (
                /* Cart Items List */
                cartItems.map((item) => {
                  const itemUnitPrice = calculateItemPrice(item);
                  const itemSubtotal = itemUnitPrice * item.quantity;

                  return (
                    <motion.div
                      layout
                      key={item.id}
                      id={`cart-item-${item.id}`}
                      className="flex gap-3 p-3 bg-brand-cream rounded-2xl border border-brand-beige hover:border-brand-orange/30 hover:bg-white hover:shadow-xs transition-all duration-300"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white border border-brand-beige">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-contain bg-stone-50"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Info & Customization */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-display font-bold text-xs sm:text-sm text-stone-900 truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-stone-400 hover:text-brand-red p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Hapus"
                            id={`btn-remove-item-${item.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Preferences / Customizations tags */}
                        <div className="flex flex-wrap gap-1">
                          {/* Seblak level badge */}
                          {item.selectedLevel && (
                            <span className="inline-flex items-center text-[9px] bg-red-50 text-brand-red font-semibold px-1.5 py-0.5 rounded-sm">
                              {item.selectedLevel.split(' — ')[0]}
                            </span>
                          )}

                          {/* Kopi Temp / Sweetness badges */}
                          {item.selectedTemp && (
                            <span className="inline-flex items-center text-[9px] bg-amber-50 text-amber-800 font-semibold px-1.5 py-0.5 rounded-sm">
                              Suhu: {item.selectedTemp}
                            </span>
                          )}
                          {item.selectedSweetness && (
                            <span className="inline-flex items-center text-[9px] bg-stone-100 text-stone-600 font-semibold px-1.5 py-0.5 rounded-sm">
                              Gula: {item.selectedSweetness}
                            </span>
                          )}
                        </div>

                        {/* Seblak Toppings */}
                        {item.selectedToppings.length > 0 && (
                          <p className="text-[10px] text-stone-500 leading-tight">
                            <span className="font-semibold text-stone-600">Topping:</span>{' '}
                            {item.selectedToppings.map((t) => t.name).join(', ')}
                          </p>
                        )}

                        {/* Item Notes */}
                        {item.notes && (
                          <div className="flex items-start gap-1 bg-white border border-brand-beige p-1.5 rounded-lg text-[10px] text-stone-500 mt-1">
                            <FileText className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                            <span className="italic truncate" title={item.notes}>
                              "{item.notes}"
                            </span>
                          </div>
                        )}

                        {/* Prices and Quantity selectors */}
                        <div className="flex items-center justify-between pt-1 mt-1">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs font-bold text-stone-900">
                              {formatRupiah(itemSubtotal)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[9px] font-mono text-stone-400">
                                ({formatRupiah(itemUnitPrice)}/porsi)
                              </span>
                            )}
                          </div>

                          {/* Qty selectors */}
                          <div className="flex items-center gap-2 bg-white border border-brand-beige rounded-lg p-0.5 shrink-0 shadow-xs">
                            <button
                              onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1 hover:bg-stone-50 text-stone-600 rounded-md transition-colors cursor-pointer"
                              id={`btn-cart-minus-${item.id}`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span 
                              id={`cart-qty-display-${item.id}`}
                              className="font-mono font-bold text-[11px] text-stone-800 w-5 text-center"
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-stone-50 text-stone-600 rounded-md transition-colors cursor-pointer"
                              id={`btn-cart-plus-${item.id}`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Sticky Drawer Footer with Totals */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-brand-beige shrink-0 bg-brand-cream">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                    Subtotal Belanja:
                  </span>
                  <span 
                    id="cart-drawer-subtotal"
                    className="font-mono font-extrabold text-xl text-brand-red"
                  >
                    {formatRupiah(cartSubtotal)}
                  </span>
                </div>
                
                <button
                  onClick={onProceedToCheckout}
                  id="btn-drawer-proceed-checkout"
                  className="w-full bg-brand-red hover:bg-red-700 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-brand-red/10 flex items-center justify-center gap-2 cursor-pointer transition-all hover:gap-3 group"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="text-[10px] text-center text-stone-400 mt-2 font-medium">
                  Biaya pengantaran akan dihitung pada halaman berikutnya.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
