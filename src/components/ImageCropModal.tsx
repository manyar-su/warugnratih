import React, { useEffect, useMemo, useState } from 'react';
import { Crop, MoveHorizontal, MoveVertical, X, ZoomIn } from 'lucide-react';

interface ImageCropModalProps {
  aspectRatio: number;
  imageSrc: string | null;
  isOpen: boolean;
  onApply: (croppedImage: string) => void;
  onClose: () => void;
  title?: string;
}

const PREVIEW_WIDTH = 360;
const OUTPUT_WIDTH = 1600;

export default function ImageCropModal({
  aspectRatio,
  imageSrc,
  isOpen,
  onApply,
  onClose,
  title = 'Crop Gambar',
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setNaturalSize({ width: 0, height: 0 });
    }
  }, [imageSrc, isOpen]);

  const frameHeight = PREVIEW_WIDTH / aspectRatio;

  const previewMetrics = useMemo(() => {
    if (!naturalSize.width || !naturalSize.height) {
      return {
        width: PREVIEW_WIDTH,
        height: frameHeight,
        translateX: 0,
        translateY: 0,
      };
    }

    const imageRatio = naturalSize.width / naturalSize.height;
    const baseWidth =
      imageRatio > aspectRatio ? frameHeight * imageRatio : PREVIEW_WIDTH;
    const baseHeight =
      imageRatio > aspectRatio ? frameHeight : PREVIEW_WIDTH / imageRatio;
    const renderedWidth = baseWidth * zoom;
    const renderedHeight = baseHeight * zoom;
    const maxTranslateX = Math.max(0, (renderedWidth - PREVIEW_WIDTH) / 2);
    const maxTranslateY = Math.max(0, (renderedHeight - frameHeight) / 2);

    return {
      width: renderedWidth,
      height: renderedHeight,
      translateX: (panX / 100) * maxTranslateX,
      translateY: (panY / 100) * maxTranslateY,
    };
  }, [aspectRatio, frameHeight, naturalSize.height, naturalSize.width, panX, panY, zoom]);

  if (!isOpen || !imageSrc) {
    return null;
  }

  const resetControls = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleClose = () => {
    resetControls();
    onClose();
  };

  const handleApply = async () => {
    const image = new Image();
    image.src = imageSrc;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Gagal memuat gambar untuk crop.'));
    });

    const imageRatio = image.width / image.height;
    let cropWidth = image.width / zoom;
    let cropHeight = cropWidth / aspectRatio;

    if (imageRatio > aspectRatio) {
      cropHeight = image.height / zoom;
      cropWidth = cropHeight * aspectRatio;
    }

    const maxOffsetX = Math.max(0, (image.width - cropWidth) / 2);
    const maxOffsetY = Math.max(0, (image.height - cropHeight) / 2);
    const sourceX = maxOffsetX + (panX / 100) * maxOffsetX;
    const sourceY = maxOffsetY + (panY / 100) * maxOffsetY;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_WIDTH;
    canvas.height = Math.round(OUTPUT_WIDTH / aspectRatio);

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.drawImage(
      image,
      sourceX,
      sourceY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    onApply(canvas.toDataURL('image/jpeg', 0.92));
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-display text-lg font-extrabold text-stone-900">{title}</h3>
            <p className="mt-1 text-xs leading-6 text-stone-500">
              Atur zoom dan posisi supaya gambar penuh, rapi, dan tetap pas saat dipakai di web.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-stone-200 bg-stone-950/95 p-4">
              <div
                className="relative mx-auto overflow-hidden rounded-[1.35rem] border border-white/15 bg-stone-900"
                style={{ width: PREVIEW_WIDTH, height: frameHeight }}
              >
                <img
                  src={imageSrc}
                  alt="Preview crop"
                  onLoad={(event) => {
                    setNaturalSize({
                      width: event.currentTarget.naturalWidth,
                      height: event.currentTarget.naturalHeight,
                    });
                  }}
                  className="absolute left-1/2 top-1/2 max-w-none"
                  style={{
                    width: previewMetrics.width,
                    height: previewMetrics.height,
                    transform: `translate(calc(-50% + ${previewMetrics.translateX}px), calc(-50% + ${previewMetrics.translateY}px))`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-stone-150 bg-stone-50 p-4 text-[11px] leading-6 text-stone-500">
              Landscape akan dipotong otomatis agar tampil penuh. Untuk kartu menu dan promo,
              rasio dibuat lebih lebar supaya foto tidak terlihat gepeng saat dipakai.
            </div>
          </div>

          <div className="space-y-4 rounded-[1.75rem] border border-stone-150 bg-stone-50 p-5">
            <div className="flex items-center gap-2 text-stone-900">
              <Crop className="h-4 w-4 text-brand-red" />
              <span className="text-sm font-bold">Kontrol Crop</span>
            </div>

            <label className="space-y-2">
              <span className="flex items-center gap-2 text-xs font-bold uppercase text-stone-600">
                <ZoomIn className="h-4 w-4 text-brand-orange" />
                Zoom
              </span>
              <input
                type="range"
                min="1"
                max="2.8"
                step="0.05"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full accent-brand-red"
              />
            </label>

            <label className="space-y-2">
              <span className="flex items-center gap-2 text-xs font-bold uppercase text-stone-600">
                <MoveHorizontal className="h-4 w-4 text-brand-orange" />
                Geser Kiri Kanan
              </span>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={panX}
                onChange={(event) => setPanX(Number(event.target.value))}
                className="w-full accent-brand-red"
              />
            </label>

            <label className="space-y-2">
              <span className="flex items-center gap-2 text-xs font-bold uppercase text-stone-600">
                <MoveVertical className="h-4 w-4 text-brand-orange" />
                Geser Atas Bawah
              </span>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={panY}
                onChange={(event) => setPanY(Number(event.target.value))}
                className="w-full accent-brand-red"
              />
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 rounded-2xl bg-brand-red px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-red-700"
              >
                Pakai Hasil Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
