import { useEffect } from 'react';
import { STORE_INFO } from '../data';
import { heroWarungRatihImage, logoWarungRatihImage } from '../assets';

interface SeoHeadProps {
  activeTab: string;
  currentView: 'catalog' | 'checkout' | 'invoice';
}

const SITE_NAME = 'Warung Ratih';
const DEFAULT_TITLE = 'Warung Ratih | Seblak, Snack, Kopi, dan Pesan Antar di Mangunreja Tasikmalaya';
const DEFAULT_DESCRIPTION =
  'Warung Ratih melayani seblak, snack, kopi, dan minuman di Mangunreja, Tasikmalaya. Pesan online, pilih ambil sendiri atau delivery, lalu konfirmasi cepat via WhatsApp.';

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

function buildContent(activeTab: string, currentView: 'catalog' | 'checkout' | 'invoice') {
  if (currentView === 'checkout') {
    return {
      title: `Checkout Pesanan | ${SITE_NAME}`,
      description:
        'Selesaikan data pesanan Warung Ratih untuk pickup atau delivery area Mangunreja, lalu kirim invoice ke WhatsApp admin.',
      path: '/#/checkout',
    };
  }

  if (currentView === 'invoice') {
    return {
      title: `Invoice Pesanan | ${SITE_NAME}`,
      description:
        'Invoice pesanan Warung Ratih siap dikirim ke WhatsApp admin untuk konfirmasi ketersediaan dan proses pesanan.',
      path: '/',
    };
  }

  switch (activeTab) {
    case 'menu':
      return {
        title: `Menu Seblak dan Snack | ${SITE_NAME}`,
        description:
          'Lihat menu Warung Ratih: seblak berbagai level, snack, kopi, minuman, dan produk pelengkap untuk area Mangunreja Tasikmalaya.',
        path: '/#/menu',
      };
    case 'promo':
      return {
        title: `Promo Paket Hemat | ${SITE_NAME}`,
        description:
          'Temukan promo paket hemat Warung Ratih untuk seblak, snack, dan minuman favorit dengan harga lebih efisien.',
        path: '/#/promo',
      };
    case 'faq':
      return {
        title: `FAQ Pemesanan | ${SITE_NAME}`,
        description:
          'Baca pertanyaan umum seputar delivery, biaya antar, pembayaran, dan alur pemesanan Warung Ratih.',
        path: '/#/faq',
      };
    case 'kontak':
      return {
        title: `Kontak dan Lokasi | ${SITE_NAME}`,
        description:
          'Hubungi Warung Ratih, lihat jam operasional, area delivery, dan alamat warung di Mangunreja, Tasikmalaya.',
        path: '/#/kontak',
      };
    default:
      return {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        path: '/',
      };
  }
}

export default function SeoHead({ activeTab, currentView }: SeoHeadProps) {
  useEffect(() => {
    const siteUrl =
      (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env.VITE_SITE_URL ||
      window.location.origin;
    const { title, description, path } = buildContent(activeTab, currentView);
    const canonicalUrl = new URL(path, siteUrl).toString();
    const ogImage = new URL(heroWarungRatihImage, window.location.origin).toString();
    const logoImage = new URL(logoWarungRatihImage, window.location.origin).toString();

    document.title = title;
    document.documentElement.lang = 'id';

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large' });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'id_ID' });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });
    upsertLink('canonical', canonicalUrl);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: STORE_INFO.name,
      image: [ogImage],
      description: DEFAULT_DESCRIPTION,
      url: siteUrl,
      telephone: `+${STORE_INFO.phone}`,
      servesCuisine: ['Seblak', 'Snack', 'Coffee', 'Indonesian Street Food'],
      priceRange: 'Rp4.000-Rp41.000',
      address: {
        '@type': 'PostalAddress',
        streetAddress: STORE_INFO.streetAddress,
        addressLocality: STORE_INFO.locality,
        addressRegion: STORE_INFO.region,
        postalCode: STORE_INFO.postalCode,
        addressCountry: 'ID',
      },
      areaServed: [
        {
          '@type': 'City',
          name: STORE_INFO.locality,
        },
        {
          '@type': 'AdministrativeArea',
          name: 'Mangunreja',
        },
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '08:00',
          closes: '22:00',
        },
      ],
      sameAs: [STORE_INFO.googleMapsUrl, `https://wa.me/${STORE_INFO.phone}`],
      hasMap: STORE_INFO.googleMapsUrl,
      paymentAccepted: ['Cash', 'Bank Transfer', 'DANA', 'OVO', 'GoPay', 'QRIS'],
      acceptsReservations: 'False',
      logo: logoImage,
    };

    let script = document.getElementById('warung-ratih-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'warung-ratih-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }, [activeTab, currentView]);

  return null;
}
