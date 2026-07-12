import React from 'react';
import { MapPin, Phone, Clock, Truck, ShieldCheck, CreditCard, ExternalLink } from 'lucide-react';
import { STORE_INFO } from '../data';

export default function StoreInformation() {
  return (
    <section className="bg-brand-cream border-t border-b border-brand-beige py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-1">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-950">
            Informasi Warung Ratih
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
            Kunjungi outlet fisik kami langsung atau hubungi kontak kami untuk pemesanan rombongan/acara khusus.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Details & Areas */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-beige shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Alamat */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-brand-red">
                  <MapPin className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">Alamat Fisik</span>
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-semibold">
                  {STORE_INFO.address}
                </p>
                <a
                  href={STORE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-orange hover:text-brand-red font-medium transition-colors"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Jam Operasional */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-brand-red">
                  <Clock className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">Jam Operasional</span>
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-semibold">
                  {STORE_INFO.hours}
                </p>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  Buka Setiap Hari
                </span>
              </div>

              {/* Kontak WA */}
              <div className="space-y-1.5 border-t border-brand-beige pt-4 sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-brand-red">
                    <Phone className="w-5 h-5 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">Nomor WhatsApp</span>
                  </div>
                  <p className="text-stone-800 text-sm font-bold">
                    +{STORE_INFO.phone}
                  </p>
                </div>
                <a
                  href={`https://wa.me/${STORE_INFO.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-whatsapp hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Kirim Pesan WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Delivery Fees card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-beige shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-brand-red border-b border-brand-beige pb-3">
                <Truck className="w-5 h-5" />
                <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
                  Tarif Jasa Pesan Antar (Delivery)
                </h3>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                Kami melayani jasa pengantaran makanan segar langsung ke tempat Anda khusus untuk radius pengantaran maksimal 5 km dari lokasi warung.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {STORE_INFO.deliveryAreas.map((area, idx) => (
                  <div key={idx} className="bg-brand-cream border border-brand-beige p-3.5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] text-stone-700 font-semibold block">{area.name.split(' (')[0]}</span>
                    <div className="flex items-baseline gap-1 mt-1.5">
                      <span className="text-sm font-bold text-brand-red font-mono">Rp{area.fee.toLocaleString('id-ID')}</span>
                      <span className="text-[9px] text-stone-400 font-mono">Flat</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column 2: Maps embed + payment badges */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Styled Maps Block */}
            <div className="bg-white rounded-3xl border border-brand-beige p-3 shadow-sm h-72 relative overflow-hidden group">
              {/* Actual Google Maps embed or visual mockup card */}
              <iframe
                title="Peta Lokasi Warung Ratih"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.515904809228!2d107.61868350000001!3d-6.893111249999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e64b85c1979d%3A0x86bb11db4237f374!2sCoblong%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1720612345678!5m2!1sen!2sid"
                className="w-full h-full border-0 rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-brand-beige shadow-sm flex items-center gap-1 pointer-events-none">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-ping" />
                <span className="text-[10px] font-bold text-stone-800">Coblong, Bandung</span>
              </div>
            </div>

            {/* Payment methods supported row */}
            <div className="bg-white rounded-3xl p-5 border border-brand-beige shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-stone-800">
                <CreditCard className="w-4.5 h-4.5 text-brand-orange" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Metode Pembayaran</h4>
              </div>
              <p className="text-[10px] text-stone-400">Kami menerima berbagai metode transaksi untuk memudahkan pemesanan Anda.</p>
              
              {/* Payment Icons list */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] bg-brand-cream border border-brand-beige text-stone-700 rounded-lg px-2.5 py-1.5 font-bold">TUNAI (COD)</span>
                <span className="text-[10px] bg-brand-cream border border-brand-beige text-stone-700 rounded-lg px-2.5 py-1.5 font-bold">TRANSFER BANK (BCA)</span>
                <span className="text-[10px] bg-brand-cream border border-brand-beige text-stone-700 rounded-lg px-2.5 py-1.5 font-bold">DANA / OVO</span>
                <span className="text-[10px] bg-brand-cream border border-brand-beige text-stone-700 rounded-lg px-2.5 py-1.5 font-bold">GOPAY / QRIS</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl mt-2 font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Transaksi aman, konfirmasi manual langsung di WhatsApp admin.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
