import React from 'react';
import {
  ArrowRight,
  Bike,
  Flame,
  List,
  Rocket,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Timer,
  Users,
} from 'lucide-react';
import { motion } from '../lib/motion';
import { HeroContent, Product } from '../types';

interface HeroSectionProps {
  heroContent: HeroContent;
  featuredProducts: Product[];
  onLihatMenu: () => void;
  onPesanSekarang: () => void;
}

const statIconMap = {
  star: Star,
  timer: Timer,
  users: Users,
} as const;

const featureIconMap = {
  rocket: Rocket,
  badge: Tag,
  store: Store,
  bike: Bike,
} as const;

const currency = (value: number) => `Rp${value.toLocaleString('id-ID')}`;

export default function HeroSection({
  heroContent,
  featuredProducts,
  onLihatMenu,
  onPesanSekarang,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,109,59,0.12),_transparent_45%),linear-gradient(180deg,_#fffaf5_0%,_#fff_45%,_#fffaf7_100%)] py-6 sm:py-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-brand-orange/10 to-transparent" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 p-4 shadow-[0_24px_80px_rgba(71,33,13,0.12)] sm:p-6 lg:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-red to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-200/70 sm:px-5">
                  <Flame className="h-4 w-4 fill-current" />
                  {heroContent.eyebrow}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-200/70 sm:px-5">
                  <Star className="h-4 w-4 fill-current" />
                  {heroContent.priceBadge}
                </span>
              </div>

              <div className="space-y-4">
                <h2
                  id="hero-title"
                  className="max-w-xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-stone-900 sm:text-5xl lg:text-[4.2rem]"
                >
                  {heroContent.titleLead}{' '}
                  <span className="bg-gradient-to-r from-brand-red via-orange-500 to-orange-400 bg-clip-text text-transparent">
                    {heroContent.titleAccent}
                  </span>
                </h2>
                <p
                  id="hero-description"
                  className="max-w-xl text-base leading-8 text-stone-600 sm:text-lg"
                >
                  {heroContent.description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onPesanSekarang}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-brand-red to-orange-500 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-orange-200/70 transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>{heroContent.primaryCtaLabel}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={onLihatMenu}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-orange-200 bg-white px-6 py-4 text-sm font-bold text-brand-orange shadow-sm transition-transform hover:-translate-y-0.5 hover:border-orange-300 cursor-pointer"
                >
                  <List className="h-5 w-5" />
                  <span>{heroContent.secondaryCtaLabel}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-brand-red/10 via-transparent to-amber-200/30 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] bg-stone-100 shadow-[0_32px_70px_rgba(126,53,8,0.20)]">
                <img
                  src={heroContent.backgroundImage}
                  alt="Latar hero Warung Ratih"
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-transparent" />
                <img
                  src={heroContent.heroImage}
                  alt="Menu utama Warung Ratih"
                  className="relative z-10 ml-auto aspect-[4/4.3] w-full max-w-[42rem] object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="rounded-[1.8rem] border border-white/80 bg-white/95 p-4 shadow-[0_20px_60px_rgba(71,33,13,0.10)] sm:p-5"
        >
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
                    Menu Favorit
                  </p>
                  <h3 className="font-display text-2xl font-extrabold text-stone-900">
                    Pilihan cepat untuk pelanggan Warung Ratih
                  </h3>
                </div>
                <button
                  onClick={onLihatMenu}
                  className="hidden items-center gap-1 text-sm font-semibold text-brand-orange transition-colors hover:text-brand-red sm:inline-flex cursor-pointer"
                >
                  Lihat semua
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {featuredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[1.5rem] border border-orange-100 bg-white shadow-sm"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {product.isBestSeller && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-brand-red shadow-sm">
                          <Flame className="h-3.5 w-3.5 fill-current" />
                          Favorit
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 p-4">
                      <div>
                        <h4 className="text-lg font-bold text-stone-900">{product.name}</h4>
                        <p className="line-clamp-2 text-sm text-stone-500">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-extrabold text-brand-red">
                          {currency(product.price)}
                        </span>
                        <button
                          onClick={onPesanSekarang}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-brand-orange text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
                          aria-label={`Pesan ${product.name}`}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3 rounded-[1.5rem] bg-gradient-to-r from-white to-orange-50 p-4 shadow-inner sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {heroContent.stats.map((stat) => {
                  const Icon = statIconMap[stat.icon];
                  return (
                    <div
                      key={stat.id}
                      className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-sm"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-brand-orange">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-stone-900">{stat.value}</p>
                        <p className="text-sm text-stone-500">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-3 rounded-[1.5rem] border border-orange-100 bg-white p-4 sm:grid-cols-2">
                {heroContent.features.map((feature) => {
                  const Icon = featureIconMap[feature.icon];
                  return (
                    <div
                      key={feature.id}
                      className="rounded-2xl border border-stone-100 bg-gradient-to-b from-white to-orange-50/40 p-4"
                    >
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-brand-orange">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-base font-bold text-stone-900">{feature.title}</h4>
                      <p className="text-sm text-stone-500">{feature.subtitle}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
