import React from 'react';
import { Star, Percent, Plus, Trash2 } from 'lucide-react';
import { PromoPackage } from '../types';
import { motion, AnimatePresence } from '../lib/motion';

interface PromoCardProps {
  key?: React.Key;
  promo: PromoPackage;
  onAddPromoToCart: (promo: PromoPackage) => void;
  onDelete?: (promoId: string) => void;
}

export default function PromoCard({ promo, onAddPromoToCart, onDelete }: PromoCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  const discountAmount = promo.originalPrice - promo.price;
  const discountPercent = Math.round((discountAmount / promo.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl border border-brand-beige hover:border-brand-orange/45 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative"
      id={`promo-card-${promo.id}`}
    >
      {/* Delete Promo Button */}
      {onDelete && (
        <div className="absolute top-3 left-3 z-15">
          <button
            onClick={(e) => {
              e.stopPropagation();
              let confirmed = false;
              try {
                confirmed = window.confirm(`Yakin ingin menghapus promo ${promo.name}?`);
              } catch {
                confirmed = true;
              }
              if (confirmed) {
                onDelete(promo.id);
              } else {
                // Fallback custom confirm dialog inside the card
                setShowConfirmDelete(true);
              }
            }}
            className="p-1.5 bg-white/90 hover:bg-rose-50 text-brand-red border border-rose-100 hover:text-rose-700 hover:scale-105 rounded-xl shadow-md transition-all cursor-pointer"
            title="Hapus Promo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Fallback Custom Confirmation Overlay */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-30"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="space-y-4"
            >
              <div className="mx-auto w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-sm text-white">
                  Hapus Promo Ini?
                </h4>
                <p className="text-stone-300 text-[10px] max-w-[180px] mx-auto mt-1 leading-relaxed">
                  Apakah Anda yakin ingin menghapus promo <strong className="text-white font-semibold">{promo.name}</strong>?
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-1">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (onDelete) onDelete(promo.id);
                    setShowConfirmDelete(false);
                  }}
                  className="px-3.5 py-1.5 bg-brand-red hover:bg-red-700 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discount Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center gap-1 bg-brand-red text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm animate-bounce">
          <Percent className="w-3.5 h-3.5" /> Hemat {discountPercent}%
        </span>
      </div>

      {/* Thumbnail */}
      <div 
        onClick={() => onAddPromoToCart(promo)}
        className="relative aspect-16/10 overflow-hidden bg-stone-50 shrink-0 cursor-pointer hover:brightness-95 transition-all duration-300"
      >
        <img
          src={promo.image}
          alt={promo.name}
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-103"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        
        {/* Absolute header on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-bold">
          <Star className="w-4 h-4 text-brand-orange fill-current" />
          <span>Paket Terlaris</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 space-y-3 justify-between">
        <div className="space-y-1">
          <h3 className="font-display font-extrabold text-base text-stone-900 group-hover:text-brand-orange transition-colors">
            {promo.name}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {promo.description}
          </p>

          {/* List of items in bundle */}
          <div className="pt-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange block">Isi Paket:</span>
            <ul className="flex flex-wrap gap-1 mt-1">
              {promo.items.map((it) => (
                <li key={it} className="text-[10px] bg-brand-cream text-stone-600 border border-brand-beige rounded-md px-2 py-0.5 font-medium">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-beige mt-auto">
          <div>
            <span className="text-[10px] text-stone-400 block font-mono -mb-0.5">Harga Promo</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold text-lg text-brand-red">
                {formatRupiah(promo.price)}
              </span>
              <span className="text-[10px] text-stone-400 font-mono line-through">
                {formatRupiah(promo.originalPrice)}
              </span>
            </div>
          </div>

          <button
            onClick={() => onAddPromoToCart(promo)}
            id={`btn-add-promo-${promo.id}`}
            className="flex items-center gap-1 bg-brand-orange hover:bg-orange-600 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer group/btn"
          >
            <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
            <span>Ambil Promo</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
