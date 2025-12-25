
import React, { useState } from 'react';

interface OrganizationProps {
  isAdmin: boolean;
  onAdminLoginRequest: () => void;
  onAdminLogout: () => void;
  onBack: () => void;
  onOpenGallery: () => void;
}

interface GalleryItem {
  id: string;
  name: string;
  date: string;
  category: string;
  photoCount: number;
  thumbnail: string;
  color: string;
}

const Organization: React.FC<OrganizationProps> = ({ isAdmin, onAdminLoginRequest, onAdminLogout, onBack, onOpenGallery }) => {
  const [clickCount, setClickCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const galleries: GalleryItem[] = [
    {
      id: '1',
      name: 'Ana & Juan • Finca Real',
      date: '12 OCT 2023',
      category: 'Boda',
      photoCount: 450,
      thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
      color: 'bg-primary'
    },
    {
      id: '2',
      name: 'Sesión Corporativa Tech',
      date: '05 OCT 2023',
      category: 'Retrato',
      photoCount: 50,
      thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
      color: 'bg-emerald-500'
    },
    {
      id: '3',
      name: 'Moda Urbana • Madrid',
      date: '22 SEP 2023',
      category: 'Editorial',
      photoCount: 120,
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      color: 'bg-purple-500'
    },
    {
      id: '4',
      name: 'XV Años Valentina',
      date: '15 AGO 2023',
      category: 'Evento',
      photoCount: 320,
      thumbnail: 'https://images.unsplash.com/photo-1519222970733-f546218fa6d7?q=80&w=800&auto=format&fit=crop',
      color: 'bg-amber-500'
    }
  ];

  const handleSecretTrigger = () => {
    const newCount = clickCount + 1;
    if (newCount >= 3) {
      setClickCount(0);
      onAdminLoginRequest();
    } else {
      setClickCount(newCount);
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  const filteredGalleries = galleries.filter(gallery => 
    gallery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gallery.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gallery.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white items-center">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <header className="p-6 md:px-10 md:py-8 bg-background-dark/80 backdrop-blur-md sticky top-0 z-20 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col cursor-default select-none" onClick={handleSecretTrigger}>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Bokkyphotos</span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter">Explorar Álbumes</h1>
            </div>
            {isAdmin && (
              <button 
                onClick={onAdminLogout}
                className="bg-primary/20 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/30 hover:bg-primary/30 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Salir Admin
              </button>
            )}
          </div>
          
          {/* Search */}
          <div className="relative group max-w-2xl w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, fecha o categoría..." 
              className="w-full bg-surface-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-600 font-medium outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
        </header>

        {/* Album List */}
        <main className="px-6 md:px-10 space-y-8 pt-4">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                {searchQuery ? `Resultados (${filteredGalleries.length})` : 'Recientes'}
              </h2>
              {isAdmin && (
                 <button className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 hover:bg-primary/20 transition-all">
                  <span className="material-symbols-outlined text-sm">create_new_folder</span>
                  Nuevo Álbum
                 </button>
              )}
            </div>
            
            {filteredGalleries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredGalleries.map((gallery) => (
                  <div 
                    key={gallery.id}
                    onClick={onOpenGallery}
                    className="relative group rounded-[2rem] overflow-hidden bg-card-dark border border-white/5 shadow-2xl transition-all hover:translate-y-[-4px] cursor-pointer"
                  >
                    <div 
                      className="aspect-[16/10] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url("${gallery.thumbnail}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`${gallery.color} px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] text-white`}>
                          {gallery.category}
                        </span>
                        <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">{gallery.date}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-primary transition-colors truncate">
                        {gallery.name}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                         <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-white/40 text-sm">image</span>
                          <span className="text-xs font-bold text-white/40">{gallery.photoCount} Fotos</span>
                         </div>
                         <button className="bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">Ver Galería</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                <p className="text-lg font-bold">No se encontraron álbumes</p>
                <p className="text-sm">Prueba con otros términos de búsqueda</p>
              </div>
            )}
          </section>

          {/* Categories section */}
          {!searchQuery && (
            <section className="pb-32">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Categorías</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div onClick={() => setSearchQuery('Boda')} className="h-32 rounded-3xl bg-surface-dark border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-primary group-hover:scale-110 transition-all">favorite</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Bodas</span>
                </div>
                <div onClick={() => setSearchQuery('Retrato')} className="h-32 rounded-3xl bg-surface-dark border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-emerald-500/10 transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-emerald-500 group-hover:scale-110 transition-all">face</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Retratos</span>
                </div>
                <div onClick={() => setSearchQuery('Exterior')} className="h-32 rounded-3xl bg-surface-dark border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-amber-500/10 transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-amber-500 group-hover:scale-110 transition-all">landscape</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Exterior</span>
                </div>
                <div onClick={() => setSearchQuery('Evento')} className="h-32 rounded-3xl bg-surface-dark border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-purple-500/10 transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-purple-500 group-hover:scale-110 transition-all">movie</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Eventos</span>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Organization;
