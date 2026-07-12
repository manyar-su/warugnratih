import React from 'react';
import { Star, Plus, Eye, Lock } from 'lucide-react';
import { Product } from '../types';
import { motion } from '../lib/motion';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetail
}: ProductCardProps) {
  // Format currency
  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4 }}
      className={`group relative bg-white rounded-3xl border border-brand-beige shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex ${
        product.layout === 'wide'
          ? 'md:col-span-2 flex-col md:flex-row'
          : product.layout === 'tall'
            ? 'md:row-span-2 flex-col md:min-h-[460px]'
            : 'col-span-1 flex-col'
      } h-full ${
        !product.isAvailable ? 'opacity-70' : ''
      }`}
      id={`product-card-${product.id}`}
    >
      {/* Badge Top Left */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestSeller && (
          <span 
            id={`badge-bestseller-${product.id}`}
            className="inline-flex items-center gap-1 bg-brand-orange text-white text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm animate-pulse-subtle"
          >
            <Star className="w-3 h-3 fill-current" /> Best Seller
          </span>
        )}
        {product.hasAgeRestriction && (
          <span 
            id={`badge-age-${product.id}`}
            className="inline-flex items-center gap-1 bg-purple-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm"
          >
            <Lock className="w-3 h-3" /> 18+ Only
          </span>
        )}
      </div>

      {/* Image Gallery area */}
      <div 
        onClick={() => product.isAvailable && onViewDetail(product)}
        className={`relative overflow-hidden bg-stone-50 shrink-0 cursor-pointer group-hover:brightness-95 transition-all duration-300 ${
          product.layout === 'wide'
            ? 'w-full md:w-[42%] aspect-4/3 md:aspect-auto'
            : product.layout === 'tall'
              ? 'aspect-[3/4] md:aspect-[3/4] flex-1'
              : 'aspect-4/3'
        }`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-106"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Hover overlay for quick action */}
        {product.isAvailable && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <button
              onClick={() => onViewDetail(product)}
              className="p-2.5 bg-white text-stone-900 rounded-full shadow-md hover:bg-brand-red hover:text-white hover:scale-105 transition-all cursor-pointer"
              title="Lihat Detail"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sold Out Overlay */}
        {!product.isAvailable && (
          <div 
            id={`soldout-overlay-${product.id}`}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center"
          >
            <span className="bg-white text-stone-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              Habis
            </span>
          </div>
        )}
      </div>

      {/* Card Content area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Status */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-stone-400">
            {product.category}
          </span>
          {product.isAvailable ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Tersedia" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-rose-400" title="Stok Habis" />
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 leading-snug group-hover:text-brand-red transition-colors mb-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>

        {/* Age Restriction Notice */}
        {product.hasAgeRestriction && (
          <p className="text-[10px] text-purple-600 bg-purple-50 p-2 rounded-xl mb-3 leading-snug font-medium">
            Produk hanya dapat dibeli oleh pelanggan berusia 18 tahun ke atas.
          </p>
        )}

        {/* Price and Add CTA bar */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-50 mt-auto">
          <div>
            <span className="text-[10px] text-stone-400 block font-mono -mb-0.5">Harga</span>
            <span className="font-mono font-bold text-base text-stone-900">
              {formatRupiah(product.price)}
            </span>
          </div>

          {/* Action Button */}
          {product.isAvailable ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onViewDetail(product)}
                className="p-2 border border-brand-beige hover:border-brand-red/30 hover:bg-stone-50 rounded-xl text-stone-500 hover:text-brand-red transition-colors cursor-pointer"
                title="Sesuaikan Topping / Detail"
                id={`btn-detail-${product.id}`}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onAddToCart(product)}
                className="flex items-center gap-1 bg-brand-red hover:bg-red-700 text-white font-semibold text-xs py-2 px-3.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer group/btn"
                id={`btn-add-${product.id}`}
              >
                <Plus className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform" />
                <span>Pesan</span>
              </button>
            </div>
          ) : (
            <button
              disabled
              className="bg-stone-100 text-stone-400 font-semibold text-xs py-2 px-4 rounded-xl cursor-not-allowed"
            >
              Habis
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
