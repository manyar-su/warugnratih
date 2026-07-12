import React, { useState } from 'react';
import { ShoppingBag, MapPin, Truck, Store, CreditCard, ChevronRight, CheckSquare, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';
import { STORE_INFO } from '../data';

interface CheckoutFormProps {
  cartItems: CartItem[];
  onSubmitOrder: (customerData: {
    name: string;
    phone: string;
    deliveryMethod: 'Ambil Sendiri' | 'Pesan Antar';
    address?: string;
    landmark?: string;
    deliveryFee: number;
    paymentMethod: 'Tunai' | 'Transfer Bank' | 'E-wallet';
    notes?: string;
  }) => void;
  onCancel: () => void;
}

export default function CheckoutForm({
  cartItems,
  onSubmitOrder,
  onCancel
}: CheckoutFormProps) {
  // Form values
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'Ambil Sendiri' | 'Pesan Antar'>('Ambil Sendiri');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [selectedAreaIndex, setSelectedAreaIndex] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'Transfer Bank' | 'E-wallet'>('Tunai');
  const [notes, setNotes] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Validation States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  // Helper pricing calculations
  const calculateItemPrice = (item: CartItem) => {
    const base = item.product.price;
    const toppings = item.selectedToppings.reduce((acc, t) => acc + t.price, 0);
    return base + toppings;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + calculateItemPrice(item) * item.quantity,
    0
  );

  const deliveryFee = deliveryMethod === 'Pesan Antar' ? STORE_INFO.deliveryAreas[selectedAreaIndex].fee : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors: { [key: string]: string } = {};

    // Validate inputs
    if (name.trim() === '') tempErrors.name = 'Nama lengkap wajib diisi.';
    
    // Simple Indo phone validation (e.g. 08xx or +62xx)
    const cleanedPhone = phone.replace(/[^0-9+]/g, '');
    if (phone.trim() === '') {
      tempErrors.phone = 'Nomor WhatsApp wajib diisi.';
    } else if (cleanedPhone.length < 9) {
      tempErrors.phone = 'Nomor WhatsApp tidak valid (minimal 9 digit).';
    }

    if (deliveryMethod === 'Pesan Antar' && address.trim() === '') {
      tempErrors.address = 'Alamat pengiriman lengkap wajib diisi.';
    }

    if (!isConfirmed) {
      tempErrors.confirmation = 'Anda harus mengonfirmasi bahwa data pesanan dan alamat sudah benar.';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      // Scroll to top of form or errors
      const errorEl = document.getElementById('checkout-errors-anchor');
      if (errorEl) errorEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setErrors({});

    // Submit validated data
    onSubmitOrder({
      name: name.trim(),
      phone: cleanedPhone,
      deliveryMethod,
      address: deliveryMethod === 'Pesan Antar' ? address.trim() : undefined,
      landmark: deliveryMethod === 'Pesan Antar' && landmark.trim() !== '' ? landmark.trim() : undefined,
      deliveryFee,
      paymentMethod,
      notes: notes.trim() !== '' ? notes.trim() : undefined
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8 pb-20">
      
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-950">
          Halaman Checkout
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm">
          Selesaikan detail pemesanan Anda untuk diteruskan ke WhatsApp Warung Ratih.
        </p>
      </div>

      <div id="checkout-errors-anchor" />

      {/* Errors Summary banner */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 text-rose-800 text-xs leading-relaxed">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <p className="font-bold mb-1">Terdapat kesalahan pengisian data:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Grid: 1. Form Inputs vs 2. Order Preview Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 bg-white p-5 sm:p-6 rounded-3xl border border-brand-beige shadow-sm">
          
          <h3 className="font-display font-bold text-base text-stone-900 border-b border-brand-beige pb-3 flex items-center gap-2">
            <span className="w-5 h-5 bg-brand-red text-white rounded-full flex items-center justify-center font-mono text-[10px] font-bold">1</span>
            Data Pemesan
          </h3>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="checkout-name" className="text-xs font-bold text-stone-700 block uppercase tracking-wide">
                Nama Lengkap <span className="text-brand-red">*</span>
              </label>
              <input
                id="checkout-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Ratna Kartika"
                className={`w-full bg-brand-cream border rounded-xl p-3 text-sm focus:bg-white focus:outline-none transition-all ${
                  errors.name ? 'border-rose-300 focus:ring-1 focus:ring-rose-500' : 'border-brand-beige focus:ring-1 focus:ring-brand-red'
                }`}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="checkout-phone" className="text-xs font-bold text-stone-700 block uppercase tracking-wide">
                Nomor WhatsApp <span className="text-brand-red">*</span>
              </label>
              <input
                id="checkout-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                className={`w-full bg-brand-cream border rounded-xl p-3 text-sm focus:bg-white focus:outline-none transition-all ${
                  errors.phone ? 'border-rose-300 focus:ring-1 focus:ring-rose-500' : 'border-brand-beige focus:ring-1 focus:ring-brand-red'
                }`}
              />
              <span className="text-[10px] text-stone-400 block leading-tight font-mono">
                Gunakan nomor aktif untuk kemudahan pengiriman invoice dan konfirmasi admin.
              </span>
            </div>
          </div>

          {/* Delivery Configuration */}
          <h3 className="font-display font-bold text-base text-stone-900 border-b border-brand-beige pb-3 pt-4 flex items-center gap-2">
            <span className="w-5 h-5 bg-brand-red text-white rounded-full flex items-center justify-center font-mono text-[10px] font-bold">2</span>
            Metode Penerimaan
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('Ambil Sendiri')}
                id="btn-method-pickup"
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  deliveryMethod === 'Ambil Sendiri'
                    ? 'bg-red-50/50 border-brand-red text-brand-red font-bold ring-1 ring-brand-red/10'
                    : 'bg-brand-cream border-brand-beige text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Store className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm block">Ambil Sendiri</span>
                  <span className="text-[10px] text-stone-500 font-mono block font-normal mt-0.5">Ambil di Warung (Rp0)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('Pesan Antar')}
                id="btn-method-delivery"
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  deliveryMethod === 'Pesan Antar'
                    ? 'bg-red-50/50 border-brand-red text-brand-red font-bold ring-1 ring-brand-red/10'
                    : 'bg-brand-cream border-brand-beige text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Truck className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm block">Pesan Antar</span>
                  <span className="text-[10px] text-stone-500 font-mono block font-normal mt-0.5">Kirim ke Rumah Anda</span>
                </div>
              </button>
            </div>

            {/* Conditional fields for Delivery */}
            {deliveryMethod === 'Pesan Antar' && (
              <div className="p-4 bg-brand-cream rounded-2xl border border-brand-beige space-y-4 animate-fadeIn">
                
                {/* Area Selector */}
                <div className="space-y-1.5">
                  <label htmlFor="delivery-area-select" className="text-[11px] font-bold text-stone-700 block uppercase tracking-wide">
                    Pilih Area Jarak Pengantaran
                  </label>
                  <select
                    id="delivery-area-select"
                    value={selectedAreaIndex}
                    onChange={(e) => setSelectedAreaIndex(Number(e.target.value))}
                    className="w-full bg-white border border-brand-beige rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red"
                  >
                    {STORE_INFO.deliveryAreas.map((area, idx) => (
                      <option key={area.name} value={idx}>
                        {area.name} — Biaya: {formatRupiah(area.fee)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Full Address */}
                <div className="space-y-1.5">
                  <label htmlFor="checkout-address" className="text-[11px] font-bold text-stone-700 block uppercase tracking-wide">
                    Alamat Lengkap Pengiriman <span className="text-brand-red">*</span>
                  </label>
                  <textarea
                    id="checkout-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Perumahan Indah Blok C No. 12, Coblong, Bandung"
                    className={`w-full h-20 bg-white border rounded-xl p-3 text-sm focus:outline-none transition-all resize-none ${
                      errors.address ? 'border-rose-300 focus:ring-1 focus:ring-rose-500' : 'border-brand-beige focus:ring-1 focus:ring-brand-red'
                    }`}
                  />
                </div>

                {/* Landmark */}
                <div className="space-y-1.5">
                  <label htmlFor="checkout-landmark" className="text-[11px] font-bold text-stone-700 block uppercase tracking-wide">
                    Patokan Alamat (Opsional)
                  </label>
                  <input
                    id="checkout-landmark"
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Contoh: Depan Masjid Al-Ikhlas / Samping Warung Kelontong"
                    className="w-full bg-white border border-brand-beige rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Payment Configuration */}
          <h3 className="font-display font-bold text-base text-stone-900 border-b border-brand-beige pb-3 pt-4 flex items-center gap-2">
            <span className="w-5 h-5 bg-brand-red text-white rounded-full flex items-center justify-center font-mono text-[10px] font-bold">3</span>
            Metode Pembayaran
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Tunai COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Tunai')}
                id="pay-cash"
                className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                  paymentMethod === 'Tunai'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold ring-1 ring-amber-500/10'
                    : 'bg-brand-cream border-brand-beige text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Store className="w-4.5 h-4.5 shrink-0" />
                <span className="text-xs">Tunai (COD)</span>
              </button>

              {/* Transfer Bank */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Transfer Bank')}
                id="pay-bank"
                className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                  paymentMethod === 'Transfer Bank'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold ring-1 ring-amber-500/10'
                    : 'bg-brand-cream border-brand-beige text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-4.5 h-4.5 shrink-0" />
                <span className="text-xs">Transfer Bank</span>
              </button>

              {/* E-wallet */}
              <button
                type="button"
                onClick={() => setPaymentMethod('E-wallet')}
                id="pay-ewallet"
                className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                  paymentMethod === 'E-wallet'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold ring-1 ring-amber-500/10'
                    : 'bg-brand-cream border-brand-beige text-stone-600 hover:bg-stone-50'
                }`}
              >
                <ShoppingBag className="w-4.5 h-4.5 shrink-0" />
                <span className="text-xs">DANA / E-Wallet</span>
              </button>

            </div>

            {/* Help guidelines about payments */}
            {paymentMethod === 'Transfer Bank' && (
              <div className="bg-amber-50/55 p-3 rounded-xl text-[11px] text-amber-800 leading-normal border border-amber-100">
                <p className="font-bold">Informasi Transfer Bank:</p>
                <p className="mt-1">
                  Pembayaran ditransfer ke rekening resmi Warung Ratih:
                  <br />
                  <span className="font-mono font-bold">BCA: 777-123-4567</span> a.n Ratih Kartika.
                  <br />
                  Silakan kirim bukti transfer ke WhatsApp admin bersamaan dengan kirim invoice.
                </p>
              </div>
            )}

            {paymentMethod === 'E-wallet' && (
              <div className="bg-amber-50/55 p-3 rounded-xl text-[11px] text-amber-800 leading-normal border border-amber-100">
                <p className="font-bold">Informasi Pembayaran DANA / E-Wallet:</p>
                <p className="mt-1">
                  Transfer DANA atau digital wallet lainnya (GoPay/OVO) ke nomor berikut:
                  <br />
                  <span className="font-mono font-bold text-base text-brand-red">DANA: 0819-3201-8669</span> a.n Ratih Kartika.
                  <br />
                  <span className="font-mono font-bold">GoPay/OVO: 0819-3201-8669</span> a.n Ratih Kartika.
                  <br />
                  Screenshot transaksi sukses Anda sebagai bukti pembayaran untuk dikirimkan ke WhatsApp admin.
                </p>
              </div>
            )}
          </div>

          {/* Seller notes */}
          <div className="space-y-1.5 pt-2">
            <label htmlFor="checkout-seller-notes" className="text-xs font-bold text-stone-700 block uppercase tracking-wide">
              Catatan Khusus untuk Penjual (Opsional)
            </label>
            <textarea
              id="checkout-seller-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Kopi dipisah esnya, seblak ceker dikasih jeruk nipis..."
              className="w-full h-14 bg-brand-cream border border-brand-beige rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red transition-all resize-none"
              maxLength={200}
            />
          </div>

          {/* Core Checkbox Confirmation */}
          <div className="pt-4 border-t border-brand-beige">
            <label className="flex items-start gap-2.5 text-xs text-stone-600 font-medium cursor-pointer select-none">
              <input
                id="chk-confirm-details"
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mt-0.5 rounded-md border-brand-beige text-brand-red focus:ring-brand-red h-4.5 w-4.5 cursor-pointer"
              />
              <span>
                Saya memastikan data pesanan, nomor telepon, dan alamat yang diisi sudah benar dan siap melakukan pemesanan.
              </span>
            </label>
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-beige mt-6">
            <button
              type="button"
              onClick={onCancel}
              id="btn-checkout-cancel"
              className="w-full py-3.5 bg-brand-cream hover:bg-stone-100 border border-brand-beige text-stone-600 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer text-center"
            >
              Kembali ke Menu
            </button>
            <button
              type="submit"
              id="btn-checkout-submit"
              className="w-full py-3.5 bg-brand-red hover:bg-red-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-brand-red/10 cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <CheckSquare className="w-4.5 h-4.5" />
              <span>Buat Pesanan</span>
            </button>
          </div>

        </form>

        {/* Order Preview Summary Card */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-brand-beige shadow-sm space-y-5 sticky top-20">
          <h3 className="font-display font-extrabold text-sm text-stone-900 border-b border-brand-beige pb-3 uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-brand-red" />
            Ringkasan Belanja Anda
          </h3>

          {/* Product Items Table */}
          <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
            {cartItems.map((item) => {
              const itemPrice = calculateItemPrice(item);
              const itemTotal = itemPrice * item.quantity;
              return (
                <div key={item.id} className="flex gap-2.5 items-start justify-between text-xs pb-3 border-b border-brand-beige/50 last:border-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-stone-900 leading-snug truncate">
                      {item.product.name}
                    </p>
                    
                    {/* Level or Coffee tags */}
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {item.selectedLevel && (
                        <span className="text-[9px] bg-brand-cream text-brand-red font-medium px-1 rounded-sm">
                          {item.selectedLevel.split(' — ')[0]}
                        </span>
                      )}
                      {item.selectedTemp && (
                        <span className="text-[9px] bg-brand-cream text-amber-800 font-medium px-1 rounded-sm">
                          {item.selectedTemp}
                        </span>
                      )}
                      {item.selectedSweetness && (
                        <span className="text-[9px] bg-brand-cream text-stone-500 font-medium px-1 rounded-sm">
                          {item.selectedSweetness}
                        </span>
                      )}
                    </div>

                    {/* Toppings list */}
                    {item.selectedToppings.length > 0 && (
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        <span className="font-semibold">Topping:</span>{' '}
                        {item.selectedToppings.map((t) => t.name).join(', ')}
                      </p>
                    )}

                    {/* Qty indicator */}
                    <p className="text-[10px] font-mono text-stone-400 mt-0.5 font-medium">
                      {item.quantity} x {formatRupiah(itemPrice)}
                    </p>
                  </div>
                  
                  <span className="font-mono font-bold text-stone-900 text-right shrink-0">
                    {formatRupiah(itemTotal)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Totals Breakdown Column */}
          <div className="pt-4 border-t border-brand-beige space-y-2.5">
            
            {/* Subtotal */}
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span>Subtotal Belanja</span>
              <span className="font-mono text-stone-900 font-medium">{formatRupiah(subtotal)}</span>
            </div>

            {/* Delivery fee info */}
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span>Biaya Pengantaran</span>
              <span className="font-mono text-stone-900 font-medium">
                {deliveryMethod === 'Pesan Antar' ? formatRupiah(deliveryFee) : 'Rp0 (Ambil Sendiri)'}
              </span>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center pt-3 border-t border-brand-beige">
              <span className="text-xs font-bold text-stone-900 uppercase">Total Pembayaran</span>
              <span 
                id="checkout-grand-total"
                className="font-mono font-extrabold text-base text-brand-red"
              >
                {formatRupiah(grandTotal)}
              </span>
            </div>

          </div>

          {/* Delivery Area Warning for awareness */}
          {deliveryMethod === 'Pesan Antar' && (
            <div className="bg-brand-cream border border-brand-beige rounded-2xl p-3 text-[10px] leading-normal text-stone-500">
              <span className="font-bold text-stone-700 block mb-0.5">⚠️ Catatan Antar:</span>
              Warung Ratih hanya mengirimkan seblak dan pesanan khusus area sekitar warung (maksimal radius 5 km).
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
