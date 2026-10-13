'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, RotateCcw, ZoomIn, ZoomOut, Crop } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  aspectRatio?: number; // e.g. 4/5 for content, 1 for profile
  aspectRatioLabel?: string; // e.g. "4:5" or "1:1"
  cropShape?: 'rect' | 'round';
  title?: string;
  onCropComplete: (croppedBlob: Blob, previewUrl: string) => void;
}

export default function ImageCropperModal({
  isOpen,
  onClose,
  imageSrc,
  aspectRatio = 4 / 5,
  aspectRatioLabel = '4:5',
  cropShape = 'rect',
  title = 'Krop Gambar',
  onCropComplete,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Ukuran viewport krop di layar
  const boxWidth = 280;
  const boxHeight = Math.round(boxWidth / aspectRatio);

  // Hitung skala minimum agar gambar selalu mengisi penuh kotak krop
  const computeMinScale = useCallback(() => {
    if (!naturalSize.width || !naturalSize.height) return 1;
    return Math.max(boxWidth / naturalSize.width, boxHeight / naturalSize.height);
  }, [naturalSize, boxWidth, boxHeight]);

  const minScale = computeMinScale();
  const currentScale = minScale * zoom;

  // Batasi posisi pan agar tidak keluar dari area krop
  const clampPan = useCallback(
    (newX: number, newY: number, customZoom?: number) => {
      if (!naturalSize.width || !naturalSize.height) return { x: 0, y: 0 };
      const scale = minScale * (customZoom ?? zoom);
      const renderedWidth = naturalSize.width * scale;
      const renderedHeight = naturalSize.height * scale;

      const minX = boxWidth - renderedWidth;
      const maxX = 0;
      const minY = boxHeight - renderedHeight;
      const maxY = 0;

      const clampedX = Math.min(maxX, Math.max(minX, newX));
      const clampedY = Math.min(maxY, Math.max(minY, newY));

      return { x: clampedX, y: clampedY };
    },
    [naturalSize, minScale, zoom, boxWidth, boxHeight]
  );

  // Inisialisasi posisi saat gambar selesai dimuat
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    setNaturalSize({ width: nw, height: nh });
    setImageLoaded(true);

    const baseScale = Math.max(boxWidth / nw, boxHeight / nh);
    const initialWidth = nw * baseScale;
    const initialHeight = nh * baseScale;
    const initialX = (boxWidth - initialWidth) / 2;
    const initialY = (boxHeight - initialHeight) / 2;

    setZoom(1);
    setPan({ x: initialX, y: initialY });
  };

  // Reset saat gambar baru dibuka
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc]);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPan(clampPan(newX, newY));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Zoom slider handler
  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.min(3, Math.max(1, newZoom));
    setZoom(clampedZoom);

    // Pusatkan zoom relatif terhadap titik tengah viewport
    const centerPoint = { x: boxWidth / 2, y: boxHeight / 2 };
    const oldScale = currentScale;
    const newScale = minScale * clampedZoom;

    const imgCenterX = (centerPoint.x - pan.x) / oldScale;
    const imgCenterY = (centerPoint.y - pan.y) / oldScale;

    const targetX = centerPoint.x - imgCenterX * newScale;
    const targetY = centerPoint.y - imgCenterY * newScale;

    setPan(clampPan(targetX, targetY, clampedZoom));
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    handleZoomChange(zoom + delta);
  };

  // Reset posisi & zoom
  const handleReset = () => {
    if (!naturalSize.width || !naturalSize.height) return;
    const baseScale = Math.max(boxWidth / naturalSize.width, boxHeight / naturalSize.height);
    const initialWidth = naturalSize.width * baseScale;
    const initialHeight = naturalSize.height * baseScale;
    setZoom(1);
    setPan({
      x: (boxWidth - initialWidth) / 2,
      y: (boxHeight - initialHeight) / 2,
    });
  };

  // Generate krop kanvas
  const handleCrop = () => {
    if (!imageRef.current || !naturalSize.width || !naturalSize.height) return;

    // Resolusi tinggi kanvas ekspor
    const targetWidth = aspectRatio === 1 ? 600 : 800;
    const targetHeight = Math.round(targetWidth / aspectRatio);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Koordinat potong dari gambar asli
    const sourceX = -pan.x / currentScale;
    const sourceY = -pan.y / currentScale;
    const sourceW = boxWidth / currentScale;
    const sourceH = boxHeight / currentScale;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      imageRef.current,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      0,
      0,
      targetWidth,
      targetHeight
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const previewUrl = URL.createObjectURL(blob);
        onCropComplete(blob, previewUrl);
        onClose();
      },
      'image/jpeg',
      0.92
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Latar gelap transparan */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md animate-fade-in-up rounded-2xl bg-white p-5 shadow-2xl overflow-hidden border border-tinta-200"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-tinta-200/70 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emas-50 text-emas-700">
              <Crop className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-tinta-900">{title}</h3>
              <p className="text-xs text-tinta-500">
                Rasio: <span className="font-semibold text-emas-700">{aspectRatioLabel}</span> • Geser & sesuaikan zoom
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-1 text-tinta-400 hover:bg-tinta-100 hover:text-tinta-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Area Viewport Krop Interaktif */}
        <div className="flex flex-col items-center justify-center bg-tinta-950 rounded-xl p-4 select-none">
          <div
            ref={containerRef}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ width: boxWidth, height: boxHeight }}
            className={`relative overflow-hidden cursor-grab active:cursor-grabbing border-2 border-emas-400 shadow-2xl bg-black ${
              cropShape === 'round' ? 'rounded-full' : 'rounded-lg'
            }`}
          >
            {/* Gambar yang di-pan dan di-zoom */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Pratinjau Krop"
              onLoad={handleImageLoad}
              draggable={false}
              style={{
                position: 'absolute',
                left: `${pan.x}px`,
                top: `${pan.y}px`,
                width: `${naturalSize.width * currentScale}px`,
                height: `${naturalSize.height * currentScale}px`,
                maxWidth: 'none',
                maxHeight: 'none',
                transformOrigin: '0 0',
              }}
              className="pointer-events-none transition-none"
            />

            {/* Garis bantu Rule of Thirds */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Panduan bulat untuk foto profil */}
            {cropShape === 'round' && (
              <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/60" />
            )}
          </div>

          <p className="mt-2 text-[11px] text-tinta-400">
            {imageLoaded ? 'Tekan dan seret untuk memindahkan • Putar roda tetikus untuk zoom' : 'Memuat gambar...'}
          </p>
        </div>

        {/* Kontrol Zoom & Reset */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <ZoomOut className="h-4 w-4 text-tinta-400 shrink-0" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-tinta-200 accent-emas-600"
            />
            <ZoomIn className="h-4 w-4 text-tinta-400 shrink-0" />
            <span className="w-12 text-right font-mono text-xs text-tinta-600">
              {zoom.toFixed(1)}x
            </span>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-tinta-200/70">
            <button
              type="button"
              onClick={handleReset}
              className="btn-garis text-xs py-2 px-3 inline-flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-garis text-xs py-2 px-3"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCrop}
                disabled={!imageLoaded}
                className="btn-utama text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" /> Terapkan & Unggah
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
