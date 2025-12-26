import React, { useState, useEffect } from 'react';
import { getPublishedAlbums, getAllAlbums, createAlbum, deleteAlbum, toggleAlbumPublished, updateAlbum } from '../services/albumService';
import type { Album } from '../lib/database.types';
import AlbumEditor from './AlbumEditor';

interface OrganizationProps {
  isAdmin: boolean;
  onAdminLoginRequest: () => void;
  onAdminLogout: () => void;
  onBack: () => void;
  onOpenGallery: (albumId: string) => void;
}

const Organization: React.FC<OrganizationProps> = ({ isAdmin, onAdminLoginRequest, onAdminLogout, onBack, onOpenGallery }) => {
  const [clickCount, setClickCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorState, setEditorState] = useState<{ isOpen: boolean; album: Partial<Album> | null; isNew: boolean }>({
    isOpen: false,
    album: null,
    isNew: false
  });

  useEffect(() => {
    fetchAlbums();
  }, [isAdmin]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const data = isAdmin ? await getAllAlbums() : await getPublishedAlbums();
      setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlbum = () => {
    setEditorState({
      isOpen: true,
      album: {
        title: '',
        location: '',
        event_date: new Date().toISOString().split('T')[0],
        cover_image_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop',
        is_published: false,
        display_order: albums.length + 1
      },
      isNew: true
    });
  };

  const handleEditAlbum = (e: React.MouseEvent, album: Album) => {
    e.stopPropagation();
    setEditorState({
      isOpen: true,
      album: album,
      isNew: false
    });
  };

  const handleSaveAlbum = async (updates: Partial<Album>) => {
    try {
      if (editorState.isNew) {
        await createAlbum({
          ...(updates as any),
          description: '',
          is_published: false,
          display_order: albums.length + 1
        });
      } else if (editorState.album?.id) {
        await updateAlbum(editorState.album.id, updates);
      }
      await fetchAlbums();
      setEditorState({ isOpen: false, album: null, isNew: false });
    } catch (error) {
      console.error('Error saving album:', error);
      throw error;
    }
  };

  const handleDeleteAlbum = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('¿Estás seguro de que quieres eliminar este álbum y todas sus fotos?')) return;

    try {
      await deleteAlbum(id);
      await fetchAlbums();
    } catch (error) {
      alert('Error al eliminar el álbum');
    }
  };

  const handleTogglePublish = async (e: React.MouseEvent, id: string, currentlyPublished: boolean) => {
    e.stopPropagation();
    try {
      await toggleAlbumPublished(id, !currentlyPublished);
      await fetchAlbums();
    } catch (error) {
      alert('Error al cambiar el estado de publicación');
    }
  };

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

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (album.location && album.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white items-center font-sans">
      <div className="w-full max-w-7xl">
        {/* Editor Modal */}
        {editorState.isOpen && (
          <AlbumEditor
            album={editorState.album || {}}
            isNew={editorState.isNew}
            onSave={handleSaveAlbum}
            onClose={() => setEditorState({ isOpen: false, album: null, isNew: false })}
          />
        )}

        {/* Header */}
        <header className="p-6 md:px-10 md:py-8 bg-background-dark/80 backdrop-blur-md sticky top-0 z-20 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col cursor-default select-none" onClick={handleSecretTrigger}>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Bokkyphotos</span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter">Explorar Álbumes</h1>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-3">
                <button
                  onClick={onAdminLogout}
                  className="bg-white/5 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 font-bold"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Salir
                </button>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative group max-w-2xl w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o ubicación..."
              className="w-full bg-surface-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-600 font-medium outline-none text-white"
            />
          </div>
        </header>

        {/* Album List */}
        <main className="px-6 md:px-10 space-y-8 pt-4">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                {loading ? 'Cargando...' : searchQuery ? `Resultados (${filteredAlbums.length})` : 'Tus Álbumes'}
              </h2>
              {isAdmin && (
                <button
                  onClick={handleCreateAlbum}
                  className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 hover:bg-primary/20 transition-all font-bold"
                >
                  <span className="material-symbols-outlined text-sm">create_new_folder</span>
                  Nuevo Álbum
                </button>
              )}
            </div>

            {!loading && filteredAlbums.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
                {filteredAlbums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => onOpenGallery(album.id)}
                    className="relative group rounded-[2rem] overflow-hidden bg-card-dark border border-white/5 shadow-2xl transition-all hover:translate-y-[-4px] cursor-pointer"
                  >
                    <div
                      className="aspect-[16/10] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url("${album.cover_image_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop'}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex gap-2 z-10">
                        <button
                          onClick={(e) => handleTogglePublish(e, album.id, album.is_published)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all ${album.is_published ? 'bg-emerald-500/80 text-white' : 'bg-white/10 text-white/50'}`}
                          title={album.is_published ? 'Publicado' : 'Borrador'}
                        >
                          <span className="material-symbols-outlined text-sm">{album.is_published ? 'visibility' : 'visibility_off'}</span>
                        </button>
                        <button
                          onClick={(e) => handleEditAlbum(e, album)}
                          className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-white/30 transition-all"
                          title="Editar Información"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteAlbum(e, album.id)}
                          className="w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-red-600 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center gap-3 mb-2">
                        {!album.is_published && (
                          <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-amber-500/30 font-bold">Borrador</span>
                        )}
                        <span className="text-[10px] text-white/60 font-black uppercase tracking-widest font-bold">
                          {album.event_date ? new Date(album.event_date).toLocaleDateString() : new Date(album.created_at).toLocaleDateString()}
                          {album.location && ` • ${album.location}`}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-primary transition-colors truncate">
                        {album.title}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-white/40 text-sm">image</span>
                          <span className="text-xs font-bold text-white/40">Galería</span>
                        </div>
                        <button className="bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all font-bold">Ver Álbum</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                <p className="text-lg font-bold">No se encontraron álbumes</p>
                <p className="text-sm">Prueba con otros términos o crea uno nuevo</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Organization;
