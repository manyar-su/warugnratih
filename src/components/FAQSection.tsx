import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data';
import { motion, AnimatePresence } from '../lib/motion';

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Title */}
      <div className="text-center space-y-1.5 mb-8">
        <div className="inline-flex p-2.5 bg-brand-cream text-brand-orange border border-brand-beige rounded-full shadow-xs">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-950">
          Pertanyaan Umum (FAQ)
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
          Temukan jawaban cepat untuk beberapa pertanyaan yang paling sering ditanyakan oleh pelanggan kami.
        </p>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3.5" id="faq-list">
        {FAQ_ITEMS.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              id={`faq-item-${faq.id}`}
              className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? 'bg-brand-cream border-brand-orange/40 shadow-xs' 
                  : 'bg-white border-brand-beige hover:bg-brand-cream/40 hover:border-brand-orange/30'
              }`}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-stone-800 text-xs sm:text-sm cursor-pointer select-none"
                aria-expanded={isOpen}
              >
                <span className="leading-tight">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-brand-orange shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-dashed border-brand-beige">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </section>
  );
}
