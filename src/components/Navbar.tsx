import React from 'react';
import { ShoppingBag, Phone, Clock, MapPin, Menu as MenuIcon, X } from 'lucide-react';
import { heroLogoImage } from '../assets';
import { STORE_INFO } from '../data';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({
  cartCount,
  onCartClick,
  activeTab,
  setActiveTab
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'menu', label: 'Menu' },
    { id: 'promo', label: 'Promo' },
    { id: 'faq', label: 'Tanya Jawab' },
    { id: 'kontak', label: 'Kontak' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-brand-beige shadow-xs">
      {/* Top Banner - Mini info bar */}
      <div className="bg-brand-red text-white text-xs py-1 px-4 text-center font-medium tracking-wide hidden sm:block">
        <span className="inline-flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" /> Jam Buka: {STORE_INFO.hours}
        </span>
        <span className="mx-3">|</span>
        <span className="inline-flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" /> Tasikmalaya, Perum Kharisma (Bisa Pesan Antar)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo */}
        <button
          onClick={() => setActiveTab('beranda')}
          className="flex items-center gap-2 text-left cursor-pointer group"
          id="nav-logo"
        >
          <img
            src={heroLogoImage}
            alt="Logo Warung Ratih"
            className="w-10 h-10 rounded-full object-cover border border-brand-beige group-hover:scale-105 transition-transform shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="font-display font-bold text-lg leading-tight text-stone-900 group-hover:text-brand-red transition-colors">
              Warung Ratih
            </h1>
            <p className="text-[10px] text-stone-500 font-mono tracking-wider -mt-0.5">
              SEBLAK & SNACK MODERN
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-brand-red/10 text-brand-red'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Cart and Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCartClick}
            id="nav-cart-btn"
            className="relative p-2 rounded-xl text-stone-700 hover:bg-stone-50 hover:text-brand-red transition-all cursor-pointer group"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-105" />
            {cartCount > 0 && (
              <span 
                id="nav-cart-badge"
                className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange text-white rounded-full flex items-center justify-center font-mono text-[10px] font-bold ring-2 ring-white animate-pulse-subtle"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Quick WA CTA Button */}
          <a
            href={`https://wa.me/${STORE_INFO.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-whatsapp-cta"
            className="hidden sm:inline-flex items-center gap-2 bg-whatsapp text-white hover:bg-emerald-600 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Chat WA</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="nav-mobile-menu-toggle"
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-50 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Desktop Nav items for mobile users) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-brand-beige bg-white px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-brand-red/10 text-brand-red font-semibold'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-brand-beige flex flex-col gap-2">
            <a
              href={`https://wa.me/${STORE_INFO.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-whatsapp text-white text-base font-medium rounded-xl hover:bg-emerald-600"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Hubungi Kami di WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
