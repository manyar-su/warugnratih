import React from 'react';
import { Play, MessageCircle, Zap, Coins, Store, Truck, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { STORE_INFO } from '../data';
import { HomeFeaturedItem } from '../types';
import {
  warungSeblakBackgroundImage,
} from '../assets';

interface HeroSectionProps {
  homeFeaturedItems: HomeFeaturedItem[];
  onLihatMenu: () => void;
  onPesanSekarang: () => void;
}

export default function HeroSection({ homeFeaturedItems, onLihatMenu, onPesanSekarang }: HeroSectionProps) {
  const highlights = [
    { icon: Zap, text: 'Pesanan cepat diproses', color: 'text-amber-500 bg-amber-50' },
    { icon: Coins, text: 'Harga terjangkau', color: 'text-emerald-500 bg-emerald-50' },
    { icon: Store, text: 'Bisa ambil di tempat', color: 'text-blue-500 bg-blue-50' },
    { icon: Truck, text: 'Bisa pesan antar sesuai area', color: 'text-indigo-500 bg-indigo-50' },
    { icon: CreditCard, text: 'Pembayaran tunai atau transfer', color: 'text-brand-orange bg-orange-50' },
  ];

  return (
    <section className="relative overflow-hidden py-8 sm:py-16 bg-gradient-to-b from-brand-cream/60 via-white to-white">
      <div className="absolute inset-0 -z-10 opacity-[0.06] mix-blend-multiply pointer-events-none select-none">
        <img
          src={warungSeblakBackgroundImage}
          alt="Warung Seblak Backdrop"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-red/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-full text-xs font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-ping" />
                Warung Kuliner Modern Tasikmalaya
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange rounded-full text-xs font-bold uppercase tracking-wider">
                Seblak Mulai 10 Ribuan
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-stone-950"
              id="hero-title"
            >
              Lagi Lapar? Pesan Favoritmu di <span className="text-brand-red relative inline-block">Warung Ratih<span className="absolute bottom-1 left-0 w-full h-2 bg-brand-orange/20 -z-10 rounded-sm" /></span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-stone-600 text-sm sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed"
              id="hero-description"
            >
              Nikmati seblak pedas, snack, kopi, minuman, dan kebutuhan warung lainnya. Pesan langsung dari HP, praktis tanpa antre.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
              id="hero-ctas"
            >
              <button
                onClick={onPesanSekarang}
                className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-brand-red/20 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Pesan Sekarang</span>
                <Play className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onLihatMenu}
                className="w-full sm:w-auto bg-white border border-brand-beige hover:border-brand-red hover:bg-brand-cream text-stone-800 hover:text-brand-red font-semibold px-8 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center"
              >
                Lihat Menu
              </button>

              <a
                href={`https://wa.me/${STORE_INFO.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-whatsapp hover:bg-emerald-600 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4.5 h-4.5 fill-current" />
                <span>Chat WhatsApp</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6 text-left border-t border-brand-beige"
            >
              {highlights.map((h, idx) => {
                const Icon = h.icon;
                return (
                  <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-brand-cream/60 hover:bg-white hover:shadow-xs transition-all border border-transparent hover:border-brand-beige">
                    <div className={`p-1.5 rounded-lg shrink-0 ${h.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium text-stone-700 leading-tight">
                      {h.text}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 aspect-square max-w-[450px] mx-auto lg:max-w-none">
              {homeFeaturedItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group rounded-3xl overflow-hidden shadow-md border-2 border-white hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-[10px] sm:text-xs font-bold text-stone-900 px-2.5 py-1 rounded-xl shadow-xs">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-orange text-white rounded-full flex items-center justify-center font-display font-bold text-xs shadow-lg rotate-12 z-10 animate-bounce">
              PROMO!
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
