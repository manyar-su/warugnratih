export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isBestSeller?: boolean;
  hasAgeRestriction?: boolean;
  layout?: 'normal' | 'wide' | 'tall';
  options?: {
    type: 'seblak' | 'kopi' | 'rokok' | 'default';
    levels?: string[];
    toppings?: Topping[];
    coffeeOptions?: {
      temps?: string[];
      sweetness?: string[];
    };
  };
}

export interface CartItem {
  id: string; // Unique ID for this cart entry (includes variations/toppings hash)
  product: Product;
  quantity: number;
  selectedLevel?: string; // For seblak level
  selectedToppings: Topping[]; // For seblak toppings
  selectedTemp?: string; // For kopi temp (Panas/Dingin)
  selectedSweetness?: string; // For kopi sweetness
  notes?: string; // Custom notes for this item
}

export interface PromoPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  items: string[];
}

export interface Order {
  id: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'Ambil Sendiri' | 'Pesan Antar';
  address?: string;
  landmark?: string;
  deliveryFee: number;
  discount: number;
  paymentMethod: 'Tunai' | 'Transfer Bank' | 'E-wallet';
  items: CartItem[];
  subtotal: number;
  total: number;
  status: 'Menunggu Konfirmasi' | 'Pesanan Diterima' | 'Sedang Dibuat' | 'Siap Diambil' | 'Sedang Diantar' | 'Selesai' | 'Dibatalkan';
  notes?: string;
}

export interface HeroStat {
  id: string;
  value: string;
  label: string;
  icon: 'star' | 'timer' | 'users';
}

export interface HeroFeature {
  id: string;
  title: string;
  subtitle: string;
  icon: 'rocket' | 'badge' | 'store' | 'bike';
}

export interface HeroContent {
  eyebrow: string;
  priceBadge: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  heroImage: string;
  backgroundImage: string;
  stats: HeroStat[];
  features: HeroFeature[];
}
