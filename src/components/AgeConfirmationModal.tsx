import React from 'react';
import { ShieldAlert, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from '../lib/motion';

interface AgeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AgeConfirmationModal({
  isOpen,
  onClose,
  onConfirm
}: AgeConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-brand-beige z-10 space-y-6"
            id="age-confirmation-modal"
          >
            {/* Warning Icon */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shadow-inner">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-stone-900">
                Peringatan Batas Usia!
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Produk rokok hanya diperuntukkan bagi pelanggan yang telah berusia{' '}
                <span className="text-purple-600 font-extrabold font-mono">18 tahun ke atas</span>{' '}
                sesuai ketentuan hukum yang berlaku di Indonesia.
              </p>
            </div>

            {/* Warning Message Box */}
            <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-mono font-bold text-purple-700 block uppercase tracking-wider">
                Pernyataan Pelanggan
              </span>
              <p className="text-[11px] text-purple-600 mt-1">
                "Saya menyatakan bahwa saya adalah pembeli sah yang berusia minimal 18 tahun."
              </p>
            </div>

            {/* Confirm Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={onClose}
                id="btn-age-decline"
                className="py-3 px-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 font-semibold text-xs rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Batal / Di Bawah 18</span>
              </button>
              <button
                onClick={onConfirm}
                id="btn-age-confirm"
                className="py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-600/15 transition-all cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Ya, Saya Berusia 18+</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
