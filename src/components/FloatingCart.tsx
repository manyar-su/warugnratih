import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from '../lib/motion';

interface FloatingCartProps {
  cartCount: number;
  cartTotal: number;
  onCartClick: () => void;
  isVisible: boolean; // Hide on full checkout page or if empty
}

export default function FloatingCart({
  cartCount,
  cartTotal,
  onCartClick,
  isVisible
}: FloatingCartProps) {
  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  return (
    <AnimatePresence>
      {isVisible && cartCount > 0 && (
        <div className="md:hidden fixed bottom-18 left-0 right-0 z-40 px-4 pointer-events-none">
          <motion.button
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCartClick}
            id="floating-cart-btn"
            className="w-full max-w-md mx-auto pointer-events-auto bg-gradient-to-r from-brand-red to-brand-orange text-white h-13 px-4 rounded-2xl flex items-center justify-between shadow-xl shadow-brand-red/20 active:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative bg-white/20 p-2 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-white" />
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-white text-brand-red rounded-full flex items-center justify-center font-mono text-[9px] font-extrabold ring-1 ring-brand-red">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-white/80 font-medium uppercase tracking-wider text-left leading-none">Keranjang Belanja</p>
                <p className="text-xs text-white font-bold text-left mt-0.5">{cartCount} Menu terpilih</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-white/80 font-mono text-right leading-none">Total Sementara</p>
              <p className="text-sm font-mono font-extrabold text-white mt-0.5">{formatRupiah(cartTotal)}</p>
            </div>
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
