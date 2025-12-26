import React, { useState, useEffect, useRef } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import { getAlbumById } from '../services/albumService';
import { deletePhoto } from '../services/photoService';
import type { Album } from '../lib/database.types';

interface GalleryDetailProps {
  isAdmin: boolean;
  albumId: string | null;
  onBack: () => void;
  onAddPhotos: () => void;
}

const GalleryDetail: React.FC<GalleryDetailProps> = ({ isAdmin, albumId, onBack, onAddPhotos }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const { photos, loading, refetch } = usePhotos(albumId);

  useEffect(() => {
    if (albumId) {
      getAlbumById(albumId).then(setAlbum).catch(console.error);
    }
  }, [albumId]);

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback to direct link if fetch fails
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.click();
    }
  };

  const handleDownload = (e: React.MouseEvent | React.TouchEvent, src: string) => {
    e.stopPropagation();
    downloadFile(src, `photo-${Date.now()}.jpg`);
  };

  const togglePhotoSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedPhotos(newSelection);
    if (newSelection.size === 0) setIsSelectionMode(false);
    else setIsSelectionMode(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedPhotos.size === 0) return;
    if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedPhotos.size} fotos?`)) return;

    try {
      for (const id of Array.from(selectedPhotos)) {
        await deletePhoto(id as string);
      }
      setSelectedPhotos(new Set());
      setIsSelectionMode(false);
      refetch();
    } catch (error) {
      alert('Error al eliminar fotos');
    }
  };

  const handleDownloadSelected = async () => {
    for (const id of Array.from(selectedPhotos)) {
      const photo = photos.find(p => p.id === id);
      if (photo) {
        await downloadFile(photo.image_url, `photo-${id}.jpg`);
      }
    }
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

  if (!albumId) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white items-center">
      <div className="w-full max-w-[1920px]">
        {/* Sticky Top Nav */}
        <div className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-6 py-4 md:px-10">
            <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex-1 px-4 min-w-0 text-center md:text-left">
              <h2 className="text-sm md:text-base font-black truncate leading-tight">
                {album?.title || 'Cargando...'}
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                {photos.length} Fotos • {album?.event_date ? new Date(album.event_date).toLocaleDateString() : ''} {album?.location ? `• ${album.location}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isSelectionMode ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={handleDeleteSelected}
                      className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 md:px-6 md:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      <span className="hidden sm:inline">Eliminar ({selectedPhotos.size})</span>
                    </button>
                  )}
                  <button
                    onClick={handleDownloadSelected}
                    className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 md:px-6 md:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span className="hidden sm:inline">Bajar ({selectedPhotos.size})</span>
                  </button>
                  <button
                    onClick={() => { setSelectedPhotos(new Set()); setIsSelectionMode(false); }}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </>
              ) : (
                photos.length > 0 && (
                  <button
                    onClick={() => setIsSelectionMode(true)}
                    className="flex items-center gap-2 bg-primary px-4 py-2 md:px-6 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90 font-bold"
                  >
                    <span className="material-symbols-outlined text-sm md:text-base">checklist</span>
                    <span className="hidden sm:inline">Seleccionar</span>
                    <span className="sm:hidden">Elegir</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        {album?.cover_image_url && (
          <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${album.cover_image_url}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
          </div>
        )}

        {/* Masonry-like Grid */}
        <div className="p-1 pt-4 md:p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : photos.length > 0 ? (
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-1 md:gap-4 space-y-1 md:space-y-4">
              {photos.map((photo, i) => {
                const isSelected = selectedPhotos.has(photo.id);
                return (
                  <div
                    key={photo.id}
                    onClick={() => isSelectionMode ? togglePhotoSelection({ stopPropagation: () => { } } as any, photo.id) : setSelectedImageIndex(i)}
                    className={`relative group overflow-hidden rounded-xl bg-slate-800 break-inside-avoid shadow-lg transition-all duration-300 ${isSelected ? 'ring-4 ring-primary ring-offset-4 ring-offset-background-dark scale-95' : 'hover:scale-[1.02]'} cursor-zoom-in`}
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.title || `Photo ${i}`}
                      className={`w-full h-auto object-cover transition-all duration-700 ${isSelected ? 'opacity-50' : 'group-hover:scale-110'}`}
                      loading="lazy"
                    />

                    {/* Select Badge */}
                    <div
                      onClick={(e) => togglePhotoSelection(e, photo.id)}
                      className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all z-20 ${isSelected ? 'bg-primary border-primary text-white' : 'bg-black/20 border-white/50 text-transparent group-hover:bg-black/40'}`}
                    >
                      <span className="material-symbols-outlined text-[16px] font-black">check</span>
                    </div>

                    <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 ${isSelectionMode ? 'hidden' : ''}`}>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => handleDownload(e, photo.image_url)}
                          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <div className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 font-bold">
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          Ver Grande
                        </div>
                      </div>
                    </div>

                    {isAdmin && photo.is_featured && !isSelected && (
                      <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-[12px] text-white">star</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <span className="material-symbols-outlined text-6xl mb-4">image_not_supported</span>
              <p className="text-lg font-bold">No hay fotos en este álbum</p>
              {isAdmin && <p className="text-sm">Usa el cargador para añadir fotos</p>}
            </div>
          )}
        </div>

        {/* Admin FAB - Hidden for Public */}
        {isAdmin && !isSelectionMode && (
          <div className="fixed bottom-24 right-6 md:right-12 z-40">
            <button
              onClick={onAddPhotos}
              className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/40 hover:rotate-12 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-3xl md:text-4xl">add_a_photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImageIndex !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={() => setSelectedImageIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Controls Overlay */}
          <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-[110]">
            <span className="text-white/60 text-[10px] font-black tracking-widest uppercase bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md font-bold">
              {selectedImageIndex + 1} / {photos.length}
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => handleDownload(e, photos[selectedImageIndex].image_url)}
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
          <div className="relative w-full h-full flex items-center justify-center p-0 md:p-8 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              key={selectedImageIndex}
              src={photos[selectedImageIndex].image_url}
              alt="Preview"
              className="max-w-[95%] max-h-[90%] md:max-w-full md:max-h-full object-contain shadow-2xl shadow-black/50 animate-scale-up select-none transition-all duration-500 ease-out"
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
      `}</style>
    </div>
  );
};

export default GalleryDetail;
