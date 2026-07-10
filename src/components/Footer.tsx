import React from 'react';
import { Heart } from 'lucide-react';
import { STORE_INFO } from '../data';
import { logoWarungRatihImage } from '../assets';

export default function Footer() {
  return (
    <footer className="bg-brand-text text-stone-300 border-t-2 border-brand-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <img
              src={logoWarungRatihImage}
              alt="Logo Warung Ratih"
              className="w-9 h-9 rounded-full object-cover border border-white/10 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-display font-bold text-white leading-tight">
                Warung Ratih
              </h4>
              <p className="text-[9px] text-stone-500 font-mono tracking-widest -mt-0.5 uppercase">
                Seblak & Snack Modern
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
            Menyajikan aneka pilihan seblak pedas level 0-4, cemilan basreng daun jeruk, kopi kental nikmat, rokok, dan aneka minuman segar dengan pemesanan WhatsApp praktis, murah, dan cepat.
          </p>
          <div className="text-[10px] text-stone-500 font-mono pt-1">
            Mangunreja, Kabupaten Tasikmalaya, Jawa Barat, Indonesia.
          </div>
        </div>

        <div className="md:col-span-4 space-y-3.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Jam Operasional
          </h4>
          <div className="space-y-1 text-xs text-stone-400">
            <p className="font-semibold text-stone-300">{STORE_INFO.hours}</p>
            <p className="text-[10px]">Melayani Pembelian Langsung & Pesan Antar</p>
            <p className="text-[10px] leading-relaxed mt-1 text-stone-500">
              *Pesanan lewat dari jam 21.45 WIB akan dikonfirmasi esok harinya oleh admin.
            </p>
          </div>
        </div>

        <div className="md:col-span-3 space-y-3.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Keunggulan Kami
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              <span>Bahan-bahan segar higienis</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              <span>Kencur asli melimpah</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              <span>Pemesanan instan tanpa antre</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              <span>Kemasan take-away tebal anti tumpah</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-black/15 text-stone-500 text-[10px] sm:text-xs py-5 px-4 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; 2026 <span className="text-stone-300 font-semibold">Warung Ratih Tasikmalaya</span>. Semua Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-brand-red fill-current" />
            <span>untuk kuliner nusantara berkualitas</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
