import React from 'react';
import { ImagePlus, RotateCcw, Save, Type } from 'lucide-react';
import { HERO_CONTENT_DEFAULTS } from '../data';
import { HeroContent } from '../types';
import ImageCropModal from './ImageCropModal';

interface HeroSettingsPanelProps {
  value: HeroContent;
  onChange: (value: HeroContent) => void;
  onSave: () => void;
  onReset: () => void;
}

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

function readImageAsDataUrl(
  file: File,
  onLoaded: (result: string) => void,
) {
  if (file.size > MAX_IMAGE_SIZE) {
    try {
      alert('Ukuran gambar terlalu besar. Gunakan file di bawah 3MB.');
    } catch {
      console.warn('Ukuran gambar terlalu besar. Gunakan file di bawah 3MB.');
    }
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    if (typeof reader.result === 'string') {
      onLoaded(reader.result);
    }
  };
  reader.readAsDataURL(file);
}

export default function HeroSettingsPanel({
  value,
  onChange,
  onSave,
  onReset,
}: HeroSettingsPanelProps) {
  const [cropImageSrc, setCropImageSrc] = React.useState<string | null>(null);
  const [cropAspectRatio, setCropAspectRatio] = React.useState(16 / 9);
  const [cropTarget, setCropTarget] = React.useState<'heroImage' | 'backgroundImage' | null>(null);

  const updateField = <K extends keyof HeroContent>(field: K, nextValue: HeroContent[K]) => {
    onChange({ ...value, [field]: nextValue });
  };

  const openCropUpload = (
    file: File,
    target: 'heroImage' | 'backgroundImage',
    aspectRatio: number,
  ) => {
    readImageAsDataUrl(file, (result) => {
      setCropTarget(target);
      setCropAspectRatio(aspectRatio);
      setCropImageSrc(result);
    });
  };

  const handleApplyCrop = (croppedImage: string) => {
    if (cropTarget) {
      updateField(cropTarget, croppedImage);
    }
  };

  const uploadButton = (
    label: string,
    onFile: (file: File) => void,
  ) => (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-stone-100 px-3 py-2 text-[11px] font-bold text-stone-700 transition-colors hover:bg-stone-200">
      <ImagePlus className="h-4 w-4" />
      <span>{label}</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFile(file);
          }
        }}
      />
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-150 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-extrabold text-stone-900">
              Pengaturan Hero Beranda
            </h3>
            <p className="max-w-2xl text-xs leading-6 text-stone-500">
              Ubah teks dan gambar hero utama seperti referensi. Gambar menu favorit di bawahnya tetap mengikuti data produk, jadi bisa diubah dari tab produk.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Default
            </button>
            <button
              type="button"
              onClick={onSave}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-red px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-red-700"
            >
              <Save className="h-4 w-4" />
              Simpan Hero
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 rounded-3xl border border-stone-150 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Type className="h-4 w-4 text-brand-red" />
            <h4 className="font-display text-base font-extrabold text-stone-900">
              Copy Hero
            </h4>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-bold uppercase text-stone-700">Badge Atas</span>
              <input
                type="text"
                value={value.eyebrow}
                onChange={(event) => updateField('eyebrow', event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs focus:bg-white focus:outline-none"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-bold uppercase text-stone-700">Badge Harga</span>
              <input
                type="text"
                value={value.priceBadge}
                onChange={(event) => updateField('priceBadge', event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs focus:bg-white focus:outline-none"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-bold uppercase text-stone-700">Tombol Utama</span>
              <input
                type="text"
                value={value.primaryCtaLabel}
                onChange={(event) => updateField('primaryCtaLabel', event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs focus:bg-white focus:outline-none"
              />
            </label>

            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-bold uppercase text-stone-700">Judul Bagian Awal</span>
              <input
                type="text"
                value={value.titleLead}
                onChange={(event) => updateField('titleLead', event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs focus:bg-white focus:outline-none"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-bold uppercase text-stone-700">Judul Aksen</span>
              <input
                type="text"
                value={value.titleAccent}
                onChange={(event) => updateField('titleAccent', event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs focus:bg-white focus:outline-none"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-bold uppercase text-stone-700">Tombol Kedua</span>
              <input
                type="text"
                value={value.secondaryCtaLabel}
                onChange={(event) => updateField('secondaryCtaLabel', event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs focus:bg-white focus:outline-none"
              />
            </label>

            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-bold uppercase text-stone-700">Deskripsi</span>
              <textarea
                value={value.description}
                onChange={(event) => updateField('description', event.target.value)}
                className="h-32 w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs leading-6 focus:bg-white focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-stone-150 bg-white p-5 shadow-sm sm:p-6">
            <div className="space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <h4 className="font-display text-base font-extrabold text-stone-900">
                  Gambar Hero
                </h4>
                <p className="text-[11px] leading-5 text-stone-500">
                  Default gambar diambil dari folder `assets/hero`. Anda tetap bisa upload gambar baru langsung dari pengaturan.
                </p>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase text-stone-700">Foto Utama Makanan</span>
                <img
                  src={value.heroImage}
                  alt="Preview hero"
                  className="h-52 w-full rounded-[1.5rem] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-wrap gap-2">
                  {uploadButton('Upload Foto Utama', (file) =>
                    openCropUpload(file, 'heroImage', 4 / 3),
                  )}
                  <button
                    type="button"
                    onClick={() => updateField('heroImage', HERO_CONTENT_DEFAULTS.heroImage)}
                    className="rounded-xl border border-stone-200 px-3 py-2 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Reset Foto
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase text-stone-700">Latar Hero</span>
                <img
                  src={value.backgroundImage}
                  alt="Preview latar hero"
                  className="h-36 w-full rounded-[1.5rem] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-wrap gap-2">
                  {uploadButton('Upload Latar', (file) =>
                    openCropUpload(file, 'backgroundImage', 16 / 9),
                  )}
                  <button
                    type="button"
                    onClick={() => updateField('backgroundImage', HERO_CONTENT_DEFAULTS.backgroundImage)}
                    className="rounded-xl border border-stone-200 px-3 py-2 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Reset Latar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-150 bg-white p-5 shadow-sm sm:p-6">
            <h4 className="font-display text-base font-extrabold text-stone-900">
              Stat dan Keunggulan
            </h4>
            <p className="mt-2 text-xs leading-6 text-stone-500">
              Bar rating, estimasi waktu, jumlah pesanan, dan kartu keunggulan tetap aktif untuk menjaga tampilan hero seperti contoh. Jika perlu, saya bisa lanjutkan agar bagian itu juga bisa diedit dari admin.
            </p>
          </div>
        </div>
      </div>

      <ImageCropModal
        aspectRatio={cropAspectRatio}
        imageSrc={cropImageSrc}
        isOpen={Boolean(cropImageSrc)}
        onApply={handleApplyCrop}
        onClose={() => {
          setCropImageSrc(null);
          setCropTarget(null);
        }}
        title="Crop Gambar Hero"
      />
    </div>
  );
}
