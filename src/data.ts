import { Product, Topping, PromoPackage } from './types';
import {
  basrengPedasImage,
  djarum76Image,
  djarumCoklatImage,
  djarumSuperImage,
  djiSamSoeImage,
  djiSamSoeSilverImage,
  esKopiSusuImage,
  kwetiauPangsitImage,
  magnumFilterImage,
  marlboroRedImage,
  nutrisariJerukImage,
  pisangKejuImage,
  seblakKomplitImage,
  seblakRatihImage,
  tahuCrispyImage,
} from './assets';

export const SEBLAK_TOPPINGS: Topping[] = [
  { id: 't_ceker', name: 'Ceker', price: 4000 },
  { id: 't_tulang', name: 'Tulang', price: 4000 },
  { id: 't_sosis', name: 'Sosis', price: 3000 },
  { id: 't_bakso', name: 'Bakso', price: 3000 },
  { id: 't_dumpling', name: 'Dumpling', price: 4000 },
  { id: 't_telur', name: 'Telur', price: 3000 },
  { id: 't_mie', name: 'Mie', price: 2000 },
  { id: 't_kerupuk', name: 'Kerupuk tambahan', price: 2000 },
];

export const SEBLAK_LEVELS = [
  'Level 0 — Tidak pedas',
  'Level 1 — Sedang',
  'Level 2 — Pedas',
  'Level 3 — Sangat pedas',
  'Level 4 — Pedas maksimal'
];

export const COFFEE_TEMPS = ['Panas', 'Dingin'];

export const COFFEE_SWEETNESS = [
  'Normal',
  'Kurang gula',
  'Tanpa gula',
  'Tambah gula'
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- SEBLAK ---
  {
    id: 'p_seblak_ori',
    name: 'Seblak Original',
    description: 'Seblak kuah gurih pedas khas Ratih dengan kerupuk basah lembut, telur orak-arik, mie, dan bumbu kencur yang harum meresap.',
    price: 10000,
    category: 'Seblak',
    image: seblakRatihImage,
    isAvailable: true,
    isBestSeller: true,
    options: {
      type: 'seblak',
      levels: SEBLAK_LEVELS,
      toppings: SEBLAK_TOPPINGS
    }
  },
  {
    id: 'p_seblak_ceker',
    name: 'Seblak Ceker',
    description: 'Seblak original yang dipadukan dengan ceker ayam yang empuk, gurih, dan bumbu meresap sampai ke tulang.',
    price: 15000,
    category: 'Seblak',
    image: 'https://images.unsplash.com/photo-1594911774802-8822a7079af1?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    isBestSeller: true,
    options: {
      type: 'seblak',
      levels: SEBLAK_LEVELS,
      toppings: SEBLAK_TOPPINGS
    }
  },
  {
    id: 'p_seblak_tulang',
    name: 'Seblak Tulang',
    description: 'Seblak pedas dengan potongan tulang muda ayam yang gurih untuk sensasi kriuk-kriuk nikmat di setiap suapan.',
    price: 15000,
    category: 'Seblak',
    image: 'https://images.unsplash.com/photo-1560611580-b98a2d62263b?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    options: {
      type: 'seblak',
      levels: SEBLAK_LEVELS,
      toppings: SEBLAK_TOPPINGS
    }
  },
  {
    id: 'p_seblak_seafood',
    name: 'Seblak Seafood',
    description: 'Seblak premium dengan isian seafood segar seperti chikuwa, crabstick, dumpling keju, dan bakso ikan.',
    price: 20000,
    category: 'Seblak',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    options: {
      type: 'seblak',
      levels: SEBLAK_LEVELS,
      toppings: SEBLAK_TOPPINGS
    }
  },
  {
    id: 'p_seblak_komplit',
    name: 'Seblak Komplit',
    description: 'Varian terlaris dan terlengkap! Perpaduan seblak dengan ceker empuk, tulang muda, sosis sapi, bakso, dumpling keju, telur, dan mie.',
    price: 25000,
    category: 'Seblak',
    image: seblakKomplitImage,
    isAvailable: true,
    isBestSeller: true,
    layout: 'wide',
    options: {
      type: 'seblak',
      levels: SEBLAK_LEVELS,
      toppings: SEBLAK_TOPPINGS
    }
  },
  {
    id: 'p_makanan_kwetiau_pangsit',
    name: 'Kwetiau Pangsit',
    description: 'Kwetiau goreng kenyal dipadu pangsit rebus lembut berselimut bumbu pedas nampol dan gurih harum yang bikin nagih! Disajikan hangat.',
    price: 18000,
    category: 'Seblak',
    image: kwetiauPangsitImage,
    isAvailable: true,
    isBestSeller: true,
    layout: 'wide'
  },

  // --- SNACK ---
  {
    id: 'p_snack_singkong',
    name: 'Keripik Singkong',
    description: 'Keripik singkong renyah buatan lokal dengan taburan bumbu asin gurih alami.',
    price: 5000,
    category: 'Snack',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    isAvailable: true
  },
  {
    id: 'p_snack_basreng',
    name: 'Basreng Pedas Daun Jeruk',
    description: 'Baso goreng potong stik renyah dibalut bumbu cabe bubuk melimpah dan aroma segar irisan daun jeruk.',
    price: 7000,
    category: 'Snack',
    image: basrengPedasImage,
    isAvailable: true,
    isBestSeller: true
  },
  {
    id: 'p_snack_tahu_crispy',
    name: 'Tahu Crispy',
    description: 'Tahu goreng super renyah dengan kremesan melimpah yang gurih di luar, lembut di dalam. Bikin nagih tiap gigitan!',
    price: 12000,
    category: 'Snack',
    image: tahuCrispyImage,
    isAvailable: true,
    isBestSeller: true,
    layout: 'tall'
  },
  {
    id: 'p_snack_pisang_keju',
    name: 'Pisang Keju',
    description: 'Pisang manis lembut yang dipanggang harum, disiram susu kental manis dan parutan keju cheddar yang sangat melimpah. Fresh dan hangat!',
    price: 15000,
    category: 'Snack',
    image: pisangKejuImage,
    isAvailable: true,
    isBestSeller: true,
    layout: 'wide'
  },
  {
    id: 'p_snack_makaroni',
    name: 'Makaroni Pedas',
    description: 'Makaroni bantet renyah dengan taburan bumbu pedas kencur khas yang bikin nagih.',
    price: 7000,
    category: 'Snack',
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=500&auto=format&fit=crop&q=80',
    isAvailable: true
  },
  {
    id: 'p_snack_kacang',
    name: 'Kacang Bawang',
    description: 'Kacang tanah kupas gurih beraroma bawang putih goreng yang harum.',
    price: 5000,
    category: 'Snack',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&auto=format&fit=crop&q=80',
    isAvailable: true
  },
  {
    id: 'p_snack_wafer',
    name: 'Wafer Cokelat',
    description: 'Wafer renyah berlapis krim cokelat manis tebal, cocok untuk penawar pedas.',
    price: 3000,
    category: 'Snack',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&auto=format&fit=crop&q=80',
    isAvailable: true
  },
  {
    id: 'p_snack_biskuit',
    name: 'Biskuit Susu',
    description: 'Biskuit susu manis yang renyah dan nikmat dicelup ke kopi hangat.',
    price: 4000,
    category: 'Snack',
    image: 'https://images.unsplash.com/photo-1558961309-db0364424674?w=500&auto=format&fit=crop&q=80',
    isAvailable: true
  },

  // --- ROKOK ---
  {
    id: 'p_rokok_dji_sam_soe',
    name: 'Dji Sam Soe',
    description: 'Rokok kretek legendaris Indonesia dengan cita rasa tembakau murni yang mantap dan harum khas. Khusus usia 18+.',
    price: 23000,
    category: 'Rokok',
    image: djiSamSoeImage,
    isAvailable: true,
    hasAgeRestriction: true,
    options: { type: 'rokok' }
  },
  {
    id: 'p_rokok_djarum_76',
    name: 'Djarum 76',
    description: 'Rokok kretek tradisional legendaris dengan ramuan cengkeh pilihan aromatik yang harum gurih. Khusus usia 18+.',
    price: 18000,
    category: 'Rokok',
    image: djarum76Image,
    isAvailable: true,
    hasAgeRestriction: true,
    options: { type: 'rokok' }
  },
  {
    id: 'p_rokok_djarum_coklat',
    name: 'Djarum Coklat',
    description: 'Rokok kretek tanpa filter legendaris dengan cita rasa tembakau srintil dan klembak kemenyan pilihan. Khusus usia 18+.',
    price: 19000,
    category: 'Rokok',
    image: djarumCoklatImage,
    isAvailable: true,
    hasAgeRestriction: true,
    options: { type: 'rokok' }
  },
  {
    id: 'p_rokok_234_silver',
    name: 'Dji Sam Soe 234 Silver',
    description: 'Varian rokok kretek filter Dji Sam Soe dengan tarikan yang lebih halus namun tetap mantap. Khusus usia 18+.',
    price: 19000,
    category: 'Rokok',
    image: djiSamSoeSilverImage,
    isAvailable: true,
    hasAgeRestriction: true,
    options: { type: 'rokok' }
  },
  {
    id: 'p_rokok_djarum_super',
    name: 'Djarum Super',
    description: 'Rokok kretek filter premium nomor satu dengan cita rasa saus rempah khas Djarum yang legendaris. Khusus usia 18+.',
    price: 28000,
    category: 'Rokok',
    image: djarumSuperImage,
    isAvailable: true,
    hasAgeRestriction: true,
    options: { type: 'rokok' }
  },
  {
    id: 'p_rokok_magnum_filter',
    name: 'Magnum Filter',
    description: 'Rokok kretek filter dengan ukuran batang mantap, sensasi rasa gurih berkelas, dan aroma menggoda. Khusus usia 18+.',
    price: 29000,
    category: 'Rokok',
    image: magnumFilterImage,
    isAvailable: true,
    hasAgeRestriction: true,
    options: { type: 'rokok' }
  },
  {
    id: 'p_rokok_marlboro',
    name: 'Marlboro Red',
    description: 'Rokok putih filter legendaris dunia dengan cita rasa tembakau virginia berkualitas tinggi yang tegas dan mantap. Khusus usia 18+.',
    price: 41000,
    category: 'Rokok',
    image: marlboroRedImage,
    isAvailable: true,
    hasAgeRestriction: true,
    options: { type: 'rokok' }
  },

  // --- KOPI ---
  {
    id: 'p_kopi_hitam',
    name: 'Kopi Hitam Tubruk',
    description: 'Seduhan kopi hitam murni berkualitas tinggi dengan aroma harum yang kuat dan cita rasa pekat mendalam.',
    price: 5000,
    category: 'Kopi',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    options: {
      type: 'kopi',
      coffeeOptions: { temps: COFFEE_TEMPS, sweetness: COFFEE_SWEETNESS }
    }
  },
  {
    id: 'p_kopi_susu',
    name: 'Kopi Susu Tradisional',
    description: 'Perpaduan seimbang kopi hitam kental dan manisnya susu kental manis yang gurih mantap.',
    price: 7000,
    category: 'Kopi',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    options: {
      type: 'kopi',
      coffeeOptions: { temps: COFFEE_TEMPS, sweetness: COFFEE_SWEETNESS }
    }
  },
  {
    id: 'p_kopi_aren',
    name: 'Kopi Gula Aren',
    description: 'Kopi susu premium dibalut rasa manis khas sirup gula aren alami yang wangi.',
    price: 10000,
    category: 'Kopi',
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    options: {
      type: 'kopi',
      coffeeOptions: { temps: COFFEE_TEMPS, sweetness: COFFEE_SWEETNESS }
    }
  },
  {
    id: 'p_es_kopi_susu',
    name: 'Es Kopi Susu Creamy',
    description: 'Espresso segar dipadukan dengan susu cair segar, krimer nabati, dan gula aren cair disajikan dingin.',
    price: 12000,
    category: 'Kopi',
    image: esKopiSusuImage,
    isAvailable: true,
    isBestSeller: true,
    options: {
      type: 'kopi',
      coffeeOptions: { temps: ['Dingin'], sweetness: COFFEE_SWEETNESS }
    }
  },
  {
    id: 'p_kopi_sachet',
    name: 'Cappuccino Sachet',
    description: 'Seduhan kopi cappuccino sachet instan lengkap dengan taburan choco granule di atas busanya.',
    price: 7000,
    category: 'Kopi',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    options: {
      type: 'kopi',
      coffeeOptions: { temps: COFFEE_TEMPS, sweetness: COFFEE_SWEETNESS }
    }
  },

  // --- MINUMAN ---
  {
    id: 'p_es_teh',
    name: 'Es Teh Manis',
    description: 'Teh melati seduh tradisional yang harum dan manis, disajikan dingin menyegarkan penawar pedas.',
    price: 5000,
    category: 'Minuman',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    isBestSeller: true
  },
  {
    id: 'p_teh_hangat',
    name: 'Teh Manis Hangat',
    description: 'Teh melati hangat manis yang menenangkan perut setelah menyantap seblak.',
    price: 4000,
    category: 'Minuman',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    isAvailable: true
  },
  {
    id: 'p_air_mineral',
    name: 'Air Mineral Dingin',
    description: 'Air mineral kemasan botol dingin ukuran 600ml untuk kesegaran murni.',
    price: 4000,
    category: 'Minuman',
    image: 'https://images.unsplash.com/photo-1608885898957-a599fb18ec3f?w=500&auto=format&fit=crop&q=80',
    isAvailable: true
  },
  {
    id: 'p_nutrisari_jeruk',
    name: 'Es Nutrisari Jeruk',
    description: 'Minuman buah jeruk segar instan Nutrisari yang manis dan asam segar, disajikan dengan es batu dingin.',
    price: 5000,
    category: 'Minuman',
    image: nutrisariJerukImage,
    isAvailable: true,
    isBestSeller: true
  },
  {
    id: 'p_soda',
    name: 'Fanta / Coca-cola Dingin',
    description: 'Minuman bersoda kemasan botol segar dingin (Fanta Merah atau Coca-Cola).',
    price: 7000,
    category: 'Minuman',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    isAvailable: true
  }
];

export const PROMO_PACKAGES: PromoPackage[] = [
  {
    id: 'promo_1',
    name: 'Paket Hemat Ratih',
    description: 'Paket paling pas untuk pemula! Nikmati kelezatan Seblak Original pedas dipadukan dengan kesegaran Es Teh Manis.',
    price: 13000,
    originalPrice: 15000,
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=500&auto=format&fit=crop&q=80',
    items: ['Seblak Original', 'Es Teh Manis']
  },
  {
    id: 'promo_2',
    name: 'Paket Puas Komplit',
    description: 'Paket kenyang juara! Seblak Komplit dengan aneka topping melimpah bersanding dengan Es Kopi Susu Creamy yang nikmat.',
    price: 33000,
    originalPrice: 37000,
    image: seblakKomplitImage,
    items: ['Seblak Komplit', 'Es Kopi Susu Creamy']
  },
  {
    id: 'promo_3',
    name: 'Paket Nongkrong Ratih',
    description: 'Sempurna untuk kumpul santai bareng teman! 2 Porsi Basreng Pedas + 2 Gelas Kopi Susu Tradisional.',
    price: 24000,
    originalPrice: 28000,
    image: basrengPedasImage,
    items: ['2x Basreng Pedas', '2x Kopi Susu Tradisional']
  }
];

export const FAQ_ITEMS = [
  {
    id: 'faq_1',
    question: 'Apakah bisa pesan antar (delivery)?',
    answer: 'Ya, bisa! Kami melayani jasa pesan antar khusus area sekitar Warung Ratih (maksimal radius 5 km) dengan biaya pengantaran terjangkau mulai dari Rp5.000 saja.'
  },
  {
    id: 'faq_2',
    question: 'Berapa biaya pengantaran pesanan?',
    answer: 'Biaya pengantaran disesuaikan dengan area pengantaran. Untuk area dekat (0-2 km) dikenakan tarif flat Rp5.000, sedangkan area sedang (2-5 km) dikenakan tarif Rp8.000.'
  },
  {
    id: 'faq_3',
    question: 'Apakah bisa membayar secara tunai saat barang sampai?',
    answer: 'Tentu saja! Kami mendukung metode COD (Cash On Delivery) atau Tunai Saat Terima. Anda juga bisa membayar menggunakan transfer bank (BCA/Mandiri) atau e-wallet (GoPay, OVO, Dana).'
  },
  {
    id: 'faq_4',
    question: 'Apakah pesanan bisa diambil sendiri di warung?',
    answer: 'Bisa banget! Anda bisa memesan secara online terlebih dahulu lewat website ini untuk menghindari antrean, lalu langsung mengambil pesanan ke warung saat sudah siap.'
  },
  {
    id: 'faq_5',
    question: 'Apakah level pedas seblak bisa disesuaikan?',
    answer: 'Sangat bisa! Seblak kami memiliki pilihan tingkat kepedasan dari Level 0 (tidak pedas sama sekali) hingga Level 4 (pedas maksimal bagi pencinta rasa pedas ekstrim).'
  },
  {
    id: 'faq_6',
    question: 'Apakah saya bisa menambah topping seblak sesuka hati?',
    answer: 'Ya, kami menyediakan beragam topping tambahan lezat seperti ceker ayam empuk, tulang muda gurih, sosis, bakso, dumpling keju, telur ayam, mie instan, dan kerupuk tambahan yang bisa Anda tambahkan di halaman detail produk.'
  },
  {
    id: 'faq_7',
    question: 'Bagaimana cara memastikan pesanan saya sudah diterima?',
    answer: 'Setelah Anda melakukan checkout di website, Anda akan diarahkan untuk mengirim detail invoice pesanan langsung ke WhatsApp admin kami. Admin kami akan segera mengonfirmasi ketersediaan menu dan mengabari Anda setelah pesanan mulai diproses.'
  },
  {
    id: 'faq_8',
    question: 'Apakah pesanan bisa dibatalkan?',
    answer: 'Pesanan hanya dapat dibatalkan apabila admin belum mengonfirmasi/memproses pesanan Anda di WhatsApp. Harap hubungi admin kami secepatnya jika ingin melakukan perubahan.'
  }
];

export const STORE_INFO = {
  name: 'Warung Ratih',
  phone: '6281932018669',
  streetAddress: 'Karisma Residence, Blok C.xx, RT.008/RW.003, Margajaya, Kec. Mangunreja',
  locality: 'Kabupaten Tasikmalaya',
  region: 'Jawa Barat',
  postalCode: '46462',
  address:
    'Karisma Residence, Blok C.xx, RT.008/RW.003, Margajaya, Kec. Mangunreja, Kabupaten Tasikmalaya, Jawa Barat 46462',
  hours: 'Senin-Minggu, 08.00-22.00 WIB',
  googleMapsUrl: 'https://maps.google.com/?q=Karisma+Residence+Mangunreja+Tasikmalaya',
  mapEmbedUrl:
    'https://maps.google.com/maps?q=Karisma%20Residence%20Mangunreja%20Tasikmalaya&t=&z=15&ie=UTF8&iwloc=&output=embed',
  deliveryAreas: [
    { name: 'Sangat Dekat (0 - 1 km)', fee: 3000 },
    { name: 'Area Dekat (1 - 2 km)', fee: 5000 },
    { name: 'Area Sedang (2 - 5 km)', fee: 8000 }
  ]
};
