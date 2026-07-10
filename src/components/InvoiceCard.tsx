import React, { useRef } from 'react';
import { CheckCircle, Copy, Printer, Share2, Send, ArrowLeft, Landmark, Check } from 'lucide-react';
import { Order } from '../types';
import { STORE_INFO } from '../data';
import { motion } from 'motion/react';

interface InvoiceCardProps {
  order: Order;
  onBackToMenu: () => void;
}

export default function InvoiceCard({ order, onBackToMenu }: InvoiceCardProps) {
  const [copied, setCopied] = React.useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  const calculateItemPrice = (item: any) => {
    const base = item.product.price;
    const toppings = item.selectedToppings.reduce((acc: number, t: any) => acc + t.price, 0);
    return base + toppings;
  };

  // Build structured message for WhatsApp
  const generateWhatsAppMessage = () => {
    let text = `Halo Warung Ratih, saya ingin melakukan pemesanan.\n\n`;
    text += `*Nomor Pesanan:* ${order.id}\n\n`;
    text += `*Nama:* ${order.customerName}\n`;
    text += `*Nomor WhatsApp:* ${order.customerPhone}\n`;
    text += `*Metode Pesanan:* ${order.deliveryMethod}\n`;
    
    if (order.deliveryMethod === 'Pesan Antar') {
      text += `*Alamat:* ${order.address}\n`;
      if (order.landmark) {
        text += `*Patokan:* ${order.landmark}\n`;
      }
    }
    
    text += `\n*Detail Pesanan:*\n`;
    
    order.items.forEach((item, index) => {
      const itemPrice = calculateItemPrice(item);
      const sub = itemPrice * item.quantity;
      text += `${index + 1}. *${item.product.name}*\n`;
      
      const details = [];
      if (item.selectedLevel) details.push(item.selectedLevel.split(' — ')[0]);
      if (item.selectedTemp) details.push(item.selectedTemp);
      if (item.selectedSweetness) details.push(`Gula ${item.selectedSweetness}`);
      if (item.selectedToppings && item.selectedToppings.length > 0) {
        details.push(`Topping: ${item.selectedToppings.map((t) => t.name).join(' & ')}`);
      }
      
      if (details.length > 0) {
        text += `   _${details.join(', ')}_\n`;
      }
      
      text += `   ${item.quantity} x ${formatRupiah(itemPrice)} = ${formatRupiah(sub)}\n\n`;
    });
    
    text += `*Subtotal:* ${formatRupiah(order.subtotal)}\n`;
    text += `*Biaya Antar:* ${formatRupiah(order.deliveryFee)}\n`;
    text += `*Total:* ${formatRupiah(order.total)}\n\n`;
    text += `*Pembayaran:* ${order.paymentMethod}\n`;
    
    if (order.notes) {
      text += `*Catatan:* ${order.notes}\n`;
    }
    
    text += `\nMohon konfirmasi ketersediaan dan estimasi waktu pesanan. Terima kasih.`;
    
    return encodeURIComponent(text);
  };

  const handleCopy = () => {
    const rawInvoiceText = `WARUNG RATIH\n` +
      `Nomor Pesanan: ${order.id}\n` +
      `Tanggal: ${order.date}\n` +
      `Waktu: ${order.time} WIB\n\n` +
      `Pelanggan: ${order.customerName} (${order.customerPhone})\n` +
      `Metode: ${order.deliveryMethod}\n` +
      (order.address ? `Alamat: ${order.address}\n` : '') +
      (order.landmark ? `Patokan: ${order.landmark}\n` : '') +
      `\nItems:\n` +
      order.items.map((item, idx) => {
        const itemPrice = calculateItemPrice(item);
        const tags = [item.selectedLevel, item.selectedTemp, item.selectedSweetness, item.selectedToppings?.map((t) => t.name).join(',')].filter(Boolean).join(' | ');
        return `${idx+1}. ${item.product.name} (${tags}) - ${item.quantity}x - Subtotal: ${formatRupiah(itemPrice*item.quantity)}`;
      }).join('\n') +
      `\n\nSubtotal: ${formatRupiah(order.subtotal)}\n` +
      `Biaya Antar: ${formatRupiah(order.deliveryFee)}\n` +
      `Total Pembayaran: ${formatRupiah(order.total)}\n` +
      `Metode Pembayaran: ${order.paymentMethod}\n` +
      (order.notes ? `Catatan: ${order.notes}\n` : '');

    navigator.clipboard.writeText(rawInvoiceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappNumber = (import.meta as any).env.VITE_WHATSAPP_NUMBER || 
                         STORE_INFO.phone;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      
      {/* Visual Success Confirmation header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-emerald-50 text-emerald-500 rounded-full shadow-inner">
          <CheckCircle className="w-12 h-12 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-extrabold text-2xl text-stone-950">
            Pesanan Berhasil Dibuat!
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Pesanan Anda telah disimpan. Silakan kirim invoice ke WhatsApp Warung Ratih agar pesanan segera dikonfirmasi.
          </p>
        </div>
      </div>

      {/* Actual Printable Invoice Card */}
      <div 
        ref={invoiceRef}
        id="invoice-print-area"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-lg space-y-6 relative overflow-hidden"
      >
        {/* Aesthetic background watermark */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full -mr-16 -mt-16 pointer-events-none" />

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-dashed border-stone-200 pb-5">
          <div>
            <span className="text-[10px] bg-brand-red/10 text-brand-red font-mono font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
              Official Receipt
            </span>
            <h1 className="font-display font-extrabold text-xl text-stone-900 mt-2">
              WARUNG RATIH
            </h1>
            <p className="text-[11px] text-stone-500 max-w-xs mt-1">
              {STORE_INFO.address}
            </p>
          </div>
          <div className="text-left sm:text-right font-mono">
            <p className="text-xs text-stone-400">Nomor Invoice</p>
            <p className="text-sm font-bold text-stone-950" id="invoice-id-display">{order.id}</p>
            <div className="text-[10px] text-stone-500 mt-1 space-y-0.5">
              <p>Tanggal: {order.date}</p>
              <p>Waktu: {order.time} WIB</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-3 bg-stone-50/70 p-4 rounded-2xl border border-stone-100">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
            Data Pelanggan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <p className="text-stone-400">Nama Lengkap</p>
              <p className="font-semibold text-stone-800">{order.customerName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-stone-400">WhatsApp</p>
              <p className="font-semibold text-stone-800">{order.customerPhone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-stone-400">Metode Penerimaan</p>
              <p className="font-semibold text-stone-800">{order.deliveryMethod}</p>
            </div>
            {order.deliveryMethod === 'Pesan Antar' && (
              <div className="col-span-1 sm:col-span-2 space-y-1 border-t border-stone-150/40 pt-2">
                <p className="text-stone-400">Alamat Pengiriman</p>
                <p className="font-semibold text-stone-800 leading-normal">{order.address}</p>
                {order.landmark && (
                  <p className="text-stone-500 italic mt-0.5">Patokan: {order.landmark}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Details list */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide border-b border-stone-100 pb-2">
            Detail Item Pesanan
          </h3>
          <div className="space-y-3">
            {order.items.map((item, index) => {
              const itemUnitPrice = calculateItemPrice(item);
              const itemSubtotal = itemUnitPrice * item.quantity;

              return (
                <div key={item.id} className="flex justify-between items-start gap-4 text-xs pb-3 border-b border-stone-50 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-bold text-stone-900">
                      {index + 1}. {item.product.name}
                    </p>
                    
                    {/* Preferences / Customizations tags */}
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {item.selectedLevel && (
                        <span className="text-[9px] bg-red-50 text-brand-red font-semibold px-1 rounded-sm">
                          {item.selectedLevel}
                        </span>
                      )}
                      {item.selectedTemp && (
                        <span className="text-[9px] bg-amber-50 text-amber-800 font-semibold px-1 rounded-sm">
                          {item.selectedTemp}
                        </span>
                      )}
                      {item.selectedSweetness && (
                        <span className="text-[9px] bg-stone-100 text-stone-600 font-semibold px-1 rounded-sm">
                          Gula: {item.selectedSweetness}
                        </span>
                      )}
                    </div>

                    {/* Toppings lists */}
                    {item.selectedToppings && item.selectedToppings.length > 0 && (
                      <p className="text-[10px] text-stone-500 mt-1 leading-tight">
                        Topping: {item.selectedToppings.map((t: any) => t.name).join(', ')}
                      </p>
                    )}

                    {/* Price details line */}
                    <p className="text-[10px] font-mono text-stone-400 mt-0.5">
                      {item.quantity} x {formatRupiah(itemUnitPrice)}
                    </p>
                  </div>

                  <span className="font-mono font-bold text-stone-900 shrink-0 text-right">
                    {formatRupiah(itemSubtotal)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing breakdown summary */}
        <div className="border-t border-stone-150/80 pt-4 space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-500">
            <span>Subtotal Produk</span>
            <span className="font-mono text-stone-950 font-medium">{formatRupiah(order.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-stone-500">
            <span>Biaya Pengantaran</span>
            <span className="font-mono text-stone-950 font-medium">{formatRupiah(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-stone-500">
            <span>Diskon</span>
            <span className="font-mono text-stone-950 font-medium">-{formatRupiah(order.discount)}</span>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-dashed border-stone-200">
            <span className="text-xs font-bold text-stone-900 uppercase">Total Pembayaran</span>
            <span className="font-mono font-extrabold text-lg text-brand-red">
              {formatRupiah(order.total)}
            </span>
          </div>
        </div>

        {/* Payment info & Seller note block */}
        <div className="border-t border-stone-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p className="text-stone-400">Metode Pembayaran</p>
            <p className="font-bold text-stone-800 flex items-center gap-1.5">
              <Landmark className="w-4.5 h-4.5 text-stone-500" />
              {order.paymentMethod}
            </p>
          </div>
          {order.notes && (
            <div className="space-y-1">
              <p className="text-stone-400">Catatan Pemesan</p>
              <p className="font-semibold text-stone-700 italic">"{order.notes}"</p>
            </div>
          )}
        </div>

        {/* Status Confirmation Stamp */}
        <div className="border-t border-stone-100 pt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-800 font-bold animate-pulse-subtle">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Menunggu konfirmasi Warung Ratih
          </div>
        </div>

      </div>

      {/* Invoice Functional Action Controls */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleCopy}
          id="btn-invoice-copy"
          className="flex-1 py-3.5 bg-white border border-stone-200 hover:border-stone-300 text-stone-800 font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600">Disalin ke Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Salin Teks Invoice</span>
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          id="btn-invoice-print"
          className="flex-1 py-3.5 bg-white border border-stone-200 hover:border-stone-300 text-stone-800 font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Unduh PDF</span>
        </button>
      </div>

      {/* Primary Call to Action - WhatsApp redirection */}
      <div className="space-y-3 bg-emerald-50/50 border border-emerald-150 p-5 rounded-3xl">
        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider text-center">
          👉 Langkah Terakhir!
        </h4>
        <p className="text-stone-600 text-xs text-center leading-relaxed">
          Sistem telah mengemas invoice di atas secara rapi. Klik tombol hijau di bawah untuk mengirimkan pesanan secara otomatis ke WhatsApp Warung Ratih agar pesanan segera dibuat dan dikirim.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          id="btn-invoice-whatsapp"
          className="w-full py-4 bg-whatsapp hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base rounded-2xl transition-all shadow-lg shadow-emerald-500/10 hover:shadow-xl text-center flex items-center justify-center gap-2 cursor-pointer group"
        >
          <Send className="w-5 h-5 fill-current" />
          <span>Kirim Pesanan ke WhatsApp Warung Ratih</span>
        </a>
      </div>

      {/* Back to Home action */}
      <div className="text-center">
        <button
          onClick={onBackToMenu}
          id="btn-invoice-done"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-brand-red text-xs font-semibold cursor-pointer py-2 px-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda & Menu</span>
        </button>
      </div>

    </div>
  );
}
