
import React, { useState, useEffect, useRef } from 'react';

interface GalleryDetailProps {
  isAdmin: boolean;
  onBack: () => void;
}

const GalleryDetail: React.FC<GalleryDetailProps> = ({ isAdmin, onBack }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const photos = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470252649358-96949c73e78c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465495910483-34c1b27d4953?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
  ];

  const handleDownload = (e: React.MouseEvent, src: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = src;
    link.download = `photo-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nextImage = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % photos.length);
    }
  };

  const prevImage = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + photos.length) % photos.length);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setSelectedImageIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white items-center">
      <div className="w-full max-w-[1920px]">
        {/* Sticky Top Nav */}
        <div className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-6 py-4 md:px-10">
            <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex-1 px-4 min-w-0">
              <h2 className="text-sm md:text-base font-black truncate leading-tight">Boda de Ana y Juan</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Finca Real • 450 Fotos</p>
            </div>
            <button className="flex items-center gap-2 bg-primary px-4 py-2 md:px-6 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90">
              <span className="material-symbols-outlined text-sm md:text-base">download_for_offline</span>
              <span className="hidden sm:inline">Descargar Todo</span>
              <span className="sm:hidden">Descargar</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
        </div>

        {/* Masonry-like Grid */}
        <div className="p-1 pt-4 md:p-4">
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-1 md:gap-4 space-y-1 md:space-y-4">
            {photos.map((src, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedImageIndex(i)}
                className="relative group overflow-hidden rounded-xl bg-slate-800 break-inside-avoid shadow-lg cursor-zoom-in"
              >
                <img 
                  src={src} 
                  alt={`Photo ${i}`} 
                  className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                      <span className="material-symbols-outlined text-sm">favorite</span>
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      Ver Grande
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="absolute top-3 left-3 w-5 h-5 rounded-full border-2 border-white/50 bg-black/20" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Admin FAB - Hidden for Public */}
        {isAdmin && (
          <div className="fixed bottom-24 right-6 md:right-12 z-40">
            <button className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/40 hover:rotate-12 transition-all">
              <span className="material-symbols-outlined text-3xl md:text-4xl">add_a_photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={() => setSelectedImageIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Controls Overlay */}
          <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-[110]">
            <span className="text-white/60 text-[10px] font-black tracking-widest uppercase bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
              {selectedImageIndex + 1} / {photos.length}
            </span>
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => handleDownload(e, photos[selectedImageIndex])}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-all backdrop-blur-md border border-white/10"
                title="Descargar Foto"
              >
                <span className="material-symbols-outlined">download</span>
              </button>
              <button 
                onClick={() => setSelectedImageIndex(null)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md border border-white/10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevImage}
            className="absolute left-4 md:left-6 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-all z-[110] backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-3xl md:text-4xl">chevron_left</span>
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 md:right-6 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-all z-[110] backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-3xl md:text-4xl">chevron_right</span>
          </button>

          {/* Large Image Container */}
          <div className="relative w-full h-full p-2 md:p-12 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              key={selectedImageIndex} 
              src={photos[selectedImageIndex]} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain shadow-2xl animate-scale-up pointer-events-none select-none transition-all duration-300"
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0.5; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default GalleryDetail;
