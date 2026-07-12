import React from 'react';
import { Home, Utensils, Star, ShoppingBag, PhoneCall } from 'lucide-react';
import { motion } from '../lib/motion';

interface MobileBottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onCartClick: () => void;
}

export default function MobileBottomNavigation({
  activeTab,
  setActiveTab,
  cartCount,
  onCartClick
}: MobileBottomNavigationProps) {
  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'promo', label: 'Promo', icon: Star },
    { id: 'keranjang', label: 'Keranjang', icon: ShoppingBag, isCart: true },
    { id: 'kontak', label: 'Kontak', icon: PhoneCall }
  ];

  const handleTabClick = (itemId: string) => {
    if (itemId === 'keranjang') {
      onCartClick();
    } else {
      setActiveTab(itemId);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-100 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-2 pb-safe-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Determine if tab is active
          // Note: "keranjang" tab is technically active if the user triggers the cart view but we can also highlight it when count > 0
          const isActive = item.isCart ? false : activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className="flex flex-col items-center justify-center w-16 h-full text-stone-500 relative focus:outline-none cursor-pointer"
            >
              <div className="relative">
                {/* Micro-interaction on click using framer-motion */}
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`p-1 rounded-full ${
                    isActive ? 'text-brand-red' : 'text-stone-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Badge for Shopping Cart */}
                {item.isCart && cartCount > 0 && (
                  <span 
                    id="mobile-nav-cart-badge"
                    className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-brand-orange text-white rounded-full flex items-center justify-center font-mono text-[9px] font-bold ring-2 ring-white animate-bounce"
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-medium tracking-wide mt-0.5 ${
                  isActive ? 'text-brand-red font-semibold' : 'text-stone-400'
                }`}
              >
                {item.label}
              </span>

              {/* Minimal active indicator dot */}
              {isActive && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute bottom-1 w-1.5 h-1.5 bg-brand-red rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
