# Warung Ratih

Website katalog dan pemesanan online untuk Warung Ratih. Pengunjung dapat melihat menu seblak, snack, kopi, minuman, memilih variasi pesanan, melakukan checkout, lalu mengirim invoice langsung ke WhatsApp admin untuk konfirmasi.

## Fitur Utama

- Katalog menu responsif untuk desktop dan mobile
- Filter kategori menu, promo, FAQ, dan informasi warung
- Checkout dengan pilihan ambil sendiri atau pesan antar
- Invoice pesanan yang siap dikirim ke WhatsApp
- Proteksi usia untuk produk 18+
- SEO dasar, metadata sosial, schema bisnis lokal, dan aset indeksasi

## Teknologi

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Lucide React
- Motion

## Menjalankan Secara Lokal

1. Install dependency:
   `npm install`
2. Salin nilai yang dibutuhkan dari `.env.example`
3. Jalankan mode development:
   `npm run dev`
4. Build produksi:
   `npm run build`
5. Validasi TypeScript:
   `npm run lint`

## Environment

- `VITE_WHATSAPP_NUMBER` untuk nomor admin tujuan invoice
- `VITE_SITE_URL` untuk canonical URL dan sitemap produksi
- `VITE_ENABLE_ADMIN_PANEL` opsional, default `false`

## Catatan Deploy

Deploy direkomendasikan ke Vercel. Setelah domain aktif, set `VITE_SITE_URL` ke URL produksi agar canonical, Open Graph, dan sitemap mengarah ke domain final.
