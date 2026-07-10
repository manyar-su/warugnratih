import React from 'react';
import { Star, Percent, Plus } from 'lucide-react';
import { PromoPackage } from '../types';
import { motion } from 'motion/react';

interface PromoCardProps {
  key?: React.Key;
  promo: PromoPackage;
  onAddPromoToCart: (promo: PromoPackage) => void;
}

export default function PromoCard({ promo, onAddPromoToCart }: PromoCardProps) {
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
      {/* Discount Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center gap-1 bg-brand-red text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm animate-bounce">
          <Percent className="w-3.5 h-3.5" /> Hemat {discountPercent}%
        </span>
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-16/10 overflow-hidden bg-stone-50 shrink-0">
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
