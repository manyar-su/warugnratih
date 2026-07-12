import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from './lib/motion';
import { ShoppingBag, ChevronRight, Phone, AlertTriangle, ShieldCheck } from 'lucide-react';

// Types
import { HeroContent, Product, CartItem, Order, PromoPackage } from './types';

// Data
import {
  HERO_CONTENT_DEFAULTS,
  INITIAL_PRODUCTS,
  PROMO_PACKAGES,
  STORE_INFO,
  sanitizeProducts,
  sanitizePromos,
} from './data';

// Reusable Components
import Navbar from './components/Navbar';
import MobileBottomNavigation from './components/MobileBottomNavigation';
import HeroSection from './components/HeroSection';
import CategoryTabs from './components/CategoryTabs';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import AgeConfirmationModal from './components/AgeConfirmationModal';
import FloatingCart from './components/FloatingCart';
import CartDrawer from './components/CartDrawer';
import CheckoutForm from './components/CheckoutForm';
import InvoiceCard from './components/InvoiceCard';
import PromoCard from './components/PromoCard';
import StoreInformation from './components/StoreInformation';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

export default function App() {
  // --- CORE STATE ---
  // Load products from localStorage or default to INITIAL_PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('wr_products');
      return saved ? sanitizeProducts(JSON.parse(saved)) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Load orders from localStorage or default to empty array
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('wr_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load promos from localStorage or default to PROMO_PACKAGES
  const [promos, setPromos] = useState<PromoPackage[]>(() => {
    try {
      const saved = localStorage.getItem('wr_promos');
      return saved ? sanitizePromos(JSON.parse(saved)) : PROMO_PACKAGES;
    } catch {
      return PROMO_PACKAGES;
    }
  });

  const [heroContent, setHeroContent] = useState<HeroContent>(() => {
    try {
      const saved = localStorage.getItem('wr_hero_content');
      return saved ? { ...HERO_CONTENT_DEFAULTS, ...JSON.parse(saved) } : HERO_CONTENT_DEFAULTS;
    } catch {
      return HERO_CONTENT_DEFAULTS;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('beranda'); // 'beranda' | 'menu' | 'promo' | 'faq' | 'kontak'
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Menu');
  const [currentView, setCurrentView] = useState<'catalog' | 'checkout' | 'invoice'>('catalog');

  // Local Storage Cart Persistent State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('wr_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal / Overlay States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);

  // Focus Item Pointer
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pendingAgeRestrictItem, setPendingAgeRestrictItem] = useState<Product | null>(null);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  
  // Successful Checkout Invoice state
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Anchor Refs
  const catalogRef = useRef<HTMLDivElement>(null);

  // Sync Cart with local storage
  useEffect(() => {
    try {
      localStorage.setItem('wr_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to sync cartItems with localStorage:', e);
    }
  }, [cartItems]);

  // Sync Products with local storage
  useEffect(() => {
    try {
      localStorage.setItem('wr_products', JSON.stringify(sanitizeProducts(products)));
    } catch (e) {
      console.warn('Failed to sync products with localStorage:', e);
    }
  }, [products]);

  // Sync Orders with local storage
  useEffect(() => {
    try {
      localStorage.setItem('wr_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to sync orders with localStorage:', e);
    }
  }, [orders]);

  // Sync Promos with local storage
  useEffect(() => {
    try {
      localStorage.setItem('wr_promos', JSON.stringify(sanitizePromos(promos)));
    } catch (e) {
      console.warn('Failed to sync promos with localStorage:', e);
    }
  }, [promos]);

  useEffect(() => {
    try {
      localStorage.setItem('wr_hero_content', JSON.stringify(heroContent));
    } catch (e) {
      console.warn('Failed to sync heroContent with localStorage:', e);
    }
  }, [heroContent]);

  // Handle Hash/URL routing trigger
  useEffect(() => {
    const handleHashRoute = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/pesanan/') && currentOrder) {
        setCurrentView('invoice');
      } else if (hash === '#/checkout') {
        setCurrentView('checkout');
      } else if (hash === '#/promo') {
        setActiveTab('promo');
        setCurrentView('catalog');
      } else if (hash === '#/faq') {
        setActiveTab('faq');
        setCurrentView('catalog');
      } else if (hash === '#/kontak') {
        setActiveTab('kontak');
        setCurrentView('catalog');
      } else if (hash === '#/menu') {
        setActiveTab('menu');
        setCurrentView('catalog');
      } else {
        // Default home
        setCurrentView('catalog');
        if (hash === '#/' || hash === '') {
          setActiveTab('beranda');
        }
      }
    };

    window.addEventListener('hashchange', handleHashRoute);
    handleHashRoute(); // Run initial compile on mount
    
    return () => window.removeEventListener('hashchange', handleHashRoute);
  }, [currentOrder]);

  // Adjust URL Hash visually based on states
  const setURLRoute = (route: string) => {
    window.location.hash = route;
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentView('catalog');
    
    if (tabId === 'beranda') {
      setURLRoute('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabId === 'menu') {
      setURLRoute('/menu');
      setSelectedCategory('Semua Menu');
      setTimeout(() => {
        catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setURLRoute(`/${tabId}`);
      // Scroll slightly down to make content obvious
      setTimeout(() => {
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }, 100);
    }
  };

  // --- CART OPERATIONS ---
  const handleAddToCart = (product: Product) => {
    // If Rokok and age not confirmed yet, trigger age confirmation first
    if (product.hasAgeRestriction && !isAgeConfirmed) {
      setPendingAgeRestrictItem(product);
      setIsAgeModalOpen(true);
      return;
    }

    // For non-customizable products (snack, rokok, drinks without options), add directly
    if (!product.options || product.options.type === 'default' || product.options.type === 'rokok') {
      const existing = cartItems.find((item) => item.product.id === product.id);
      if (existing) {
        setCartItems(
          cartItems.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id}_default`,
          product,
          quantity: 1,
          selectedToppings: []
        };
        setCartItems([...cartItems, newItem]);
      }
    } else {
      // Products with options (Seblak, Kopi) -> Open customization modal/sheet
      setSelectedProduct(product);
      setIsDetailModalOpen(true);
    }
  };

  const handleCustomAddToCart = (customItem: CartItem) => {
    const existing = cartItems.find((item) => item.id === customItem.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === customItem.id ? { ...item, quantity: item.quantity + customItem.quantity } : item
        )
      );
    } else {
      setCartItems([...cartItems, customItem]);
    }
  };

  // Add promo package to cart directly
  const handleAddPromoToCart = (promo: PromoPackage) => {
    // Treat promo as a special custom product item
    const promoProduct: Product = {
      id: promo.id,
      name: promo.name,
      description: promo.description,
      price: promo.price,
      category: 'Promo',
      image: promo.image,
      isAvailable: true,
      options: { type: 'default' }
    };

    const existing = cartItems.find((item) => item.product.id === promo.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.product.id === promo.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: `${promo.id}_promo`,
        product: promoProduct,
        quantity: 1,
        selectedToppings: []
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    setCartItems(
      cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const calculateItemPrice = (item: CartItem) => {
    const base = item.product.price;
    const toppings = item.selectedToppings.reduce((acc, t) => acc + t.price, 0);
    return base + toppings;
  };

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + calculateItemPrice(item) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- CHECKOUT SUBMISSION ---
  const handleCheckoutSubmit = (customerData: {
    name: string;
    phone: string;
    deliveryMethod: 'Ambil Sendiri' | 'Pesan Antar';
    address?: string;
    landmark?: string;
    deliveryFee: number;
    paymentMethod: 'Tunai' | 'Transfer Bank' | 'E-wallet';
    notes?: string;
  }) => {
    // Generate order metadata
    const now = new Date();
    // YYYYMMDD formatting
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    
    // Unique serial ID WR-YYYYMMDD-3digitRandom
    const orderNum = Math.floor(100 + Math.random() * 900);
    const orderId = `WR-${yyyy}${mm}${dd}-${orderNum}`;

    const newOrder: Order = {
      id: orderId,
      date: `${dd} ${now.toLocaleString('id-ID', { month: 'long' })} ${yyyy}`,
      time: `${hh}.${min}`,
      customerName: customerData.name,
      customerPhone: customerData.phone,
      deliveryMethod: customerData.deliveryMethod,
      address: customerData.address,
      landmark: customerData.landmark,
      deliveryFee: customerData.deliveryFee,
      discount: 0, // Expandable discount
      paymentMethod: customerData.paymentMethod,
      items: [...cartItems],
      subtotal: cartTotal,
      total: cartTotal + customerData.deliveryFee,
      status: 'Menunggu Konfirmasi',
      notes: customerData.notes
    };

    // Update session state
    setOrders([newOrder, ...orders]);
    setCurrentOrder(newOrder);
    
    // Switch to Invoice view
    setURLRoute(`/pesanan/${orderId}`);
    setCurrentView('invoice');

    // Clean cart and close cart view
    setCartItems([]);
    setIsCartOpen(false);
  };

  // --- AGE GATE VERIFICATION ---
  const handleAgeConfirmSuccess = () => {
    setIsAgeConfirmed(true);
    setIsAgeModalOpen(false);
    if (pendingAgeRestrictItem) {
      const target = pendingAgeRestrictItem;
      setPendingAgeRestrictItem(null);
      // Wait for modal exit to trigger add
      setTimeout(() => {
        handleAddToCart(target);
      }, 300);
    }
  };

  // --- DYNAMIC CATALOG FILTER ---
  // If activeTab is 'promo', we filter only categories belonging to Promo.
  const filteredProducts = products.filter((prod) => {
    if (selectedCategory === 'Semua Menu') {
      return prod.category !== 'Rokok' || activeTab === 'menu'; // Hide tobacco by default on generic main catalog
    }
    return prod.category === selectedCategory;
  });

  const heroFeaturedProducts = products
    .filter((product) => product.category !== 'Rokok')
    .sort((a, b) => Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller)))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-brand-cream pb-16 md:pb-0 font-sans antialiased text-brand-text">
      {/* Navbar Header banner */}
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* VIEW ORCHESTRATOR */}
      <main className="relative">
        
        {/* VIEW 1: CATALOG HOME AND SECTIONS */}
        {currentView === 'catalog' && (
          <div className="space-y-1 w-full overflow-hidden">
            
            {/* 1. Landing Hero (Show only when active tab is Beranda) */}
            {activeTab === 'beranda' && (
              <HeroSection
                heroContent={heroContent}
                featuredProducts={heroFeaturedProducts}
                onLihatMenu={() => handleTabChange('menu')}
                onPesanSekarang={() => handleTabChange('menu')}
              />
            )}

            {/* 2. Promo Packages Section (Show when active tab is 'promo' or highlights on home) */}
            {(activeTab === 'promo' || activeTab === 'beranda') && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-brand-beige pb-3">
                  <div>
                    <span className="text-[10px] bg-brand-red/10 text-brand-red font-bold font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      Promo Spesial
                    </span>
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 mt-1">
                      Paket Hemat Ratih
                    </h3>
                  </div>
                  {activeTab === 'beranda' && (
                    <button
                      onClick={() => handleTabChange('promo')}
                      className="text-xs text-brand-orange hover:text-brand-red font-semibold transition-colors flex items-center gap-0.5"
                    >
                      <span>Lihat Semua Promo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promos.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-sm text-stone-500 font-medium">
                      Saat ini belum ada promo aktif. Pantau terus ya!
                    </div>
                  ) : (
                    promos.map((promo) => (
                      <PromoCard
                        key={promo.id}
                        promo={promo}
                        onAddPromoToCart={handleAddPromoToCart}
                      />
                    ))
                  )}
                </div>
              </section>
            )}

            {/* 3. Product Catalog Grid Block (Show on 'menu' tab, category selections, or home list) */}
            {(activeTab === 'menu' || activeTab === 'beranda') && (
              <div ref={catalogRef} className="scroll-mt-20">
                
                {/* Category Filtering Navigation Bar */}
                <CategoryTabs
                  selectedCategory={selectedCategory}
                  setSelectedCategory={(cat) => {
                    setSelectedCategory(cat);
                    setActiveTab('menu'); // Force tab to menu so other sections shrink
                  }}
                />

                {/* Catalog grid space */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-extrabold text-lg sm:text-xl text-stone-950">
                        Menu {selectedCategory}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-stone-400 font-mono tracking-wide mt-0.5">
                        Menampilkan {filteredProducts.length} pilihan masakan & cemilan
                      </p>
                    </div>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-brand-beige p-12 text-center text-stone-500">
                      Menu kategori ini tidak tersedia atau habis.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto grid-flow-row-dense">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={handleAddToCart}
                          onViewDetail={(p) => {
                            if (p.hasAgeRestriction && !isAgeConfirmed) {
                              setPendingAgeRestrictItem(p);
                              setIsAgeModalOpen(true);
                            } else {
                              setSelectedProduct(p);
                              setIsDetailModalOpen(true);
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* 4. Store Information Block (Contacts, Address, Map) */}
            {(activeTab === 'kontak' || activeTab === 'beranda') && (
              <StoreInformation />
            )}

            {/* 5. FAQs Section Collapsible Accordion */}
            {(activeTab === 'faq' || activeTab === 'beranda') && (
              <FAQSection />
            )}

          </div>
        )}

        {/* VIEW 2: CHECKOUT SCREEN FORM */}
        {currentView === 'checkout' && (
          <CheckoutForm
            cartItems={cartItems}
            onCancel={() => handleTabChange('menu')}
            onSubmitOrder={handleCheckoutSubmit}
          />
        )}

        {/* VIEW 3: INVOICE / SUCCESS RECEIPT PAGE */}
        {currentView === 'invoice' && currentOrder && (
          <InvoiceCard
            order={currentOrder}
            onBackToMenu={() => {
              setCurrentOrder(null);
              handleTabChange('beranda');
            }}
          />
        )}

      </main>

      {/* Static Footer */}
      <Footer />

      {/* --- FLOATING CONTROLS --- */}
      
      {/* 1. Mobile Bottom navigation rail (Strictly for portable viewports) */}
      <MobileBottomNavigation
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* 2. Floating action cart button above bottom navigation for Mobile clients */}
      <FloatingCart
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCartClick={() => setIsCartOpen(true)}
        isVisible={currentView === 'catalog' && !isCartOpen}
      />

      {/* --- MODALS AND PORTAL OVERLAYS --- */}

      {/* 1. Interactive Cart Drawer Side Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setURLRoute('/checkout');
          setCurrentView('checkout');
        }}
      />

      {/* 2. Customized Product Detail / Ingredient Toppings Dialog */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleCustomAddToCart}
      />

      {/* 3. Cigarette Age Limit Guard Gate Confirmation Modal */}
      <AgeConfirmationModal
        isOpen={isAgeModalOpen}
        onClose={() => {
          setIsAgeModalOpen(false);
          setPendingAgeRestrictItem(null);
        }}
        onConfirm={handleAgeConfirmSuccess}
      />

    </div>
  );
}
