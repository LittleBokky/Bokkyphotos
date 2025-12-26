import React, { useState, useRef } from 'react';
import { UploadItem } from '../types';
import { uploadPhotoFile, createPhoto } from '../services/photoService';

interface UploaderProps {
  albumId: string | null;
  onBack: () => void;
  onDone: () => void;
}

const Uploader: React.FC<UploaderProps> = ({ albumId, onBack, onDone }) => {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList) => {
    if (!albumId) {
      alert('Por favor, selecciona un álbum primero.');
      return;
    }

    const filesArray = Array.from(files);
    setIsUploading(true);

    for (const file of filesArray) {
      const uploadId = Math.random().toString(36).substring(7);

      const newItem: UploadItem = {
        id: uploadId,
        fileName: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: (file.name.split('.').pop()?.toUpperCase() as any) || 'JPG',
        progress: 10,
        status: 'UPLOADING',
        thumbnail: URL.createObjectURL(file)
      };

      setUploads(prev => [newItem, ...prev]);

      try {
        // 1. Upload to storage
        const publicUrl = await uploadPhotoFile(file, albumId);

        // 2. Create entry in Database
        await createPhoto({
          album_id: albumId,
          image_url: publicUrl,
          title: file.name,
          display_order: 0,
          is_featured: false,
          thumbnail_url: publicUrl,
          description: '',
          width: 0, // Should ideally be calculated
          height: 0,
          file_size: file.size
        });

        setUploads(prev => prev.map(item =>
          item.id === uploadId ? { ...item, progress: 100, status: 'COMPLETED' } : item
        ));
      } catch (error) {
        console.error('Upload failed:', error);
        setUploads(prev => prev.map(item =>
          item.id === uploadId ? { ...item, status: 'ERROR' } : item
        ));
      }
    }
    setIsUploading(false);
  };

  return (
    <div className="relative flex flex-col h-screen bg-background-dark text-white overflow-hidden font-sans">
      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />

      {/* Header */}
      <header className="flex items-center justify-between px-6 h-20 shrink-0 border-b border-slate-800 bg-background-dark/80 backdrop-blur-xl z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-black tracking-widest uppercase">Cargando Fotos</h2>
          <span className="text-[10px] text-primary font-bold uppercase tracking-widest">En Álbum: {albumId?.slice(0, 8)}...</span>
        </div>
        <button
          onClick={onDone}
          className="h-10 px-6 flex items-center rounded-full bg-primary text-white font-black text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
        >
          Finalizar
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* Dropzone */}
        <div className="p-6">
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-6 rounded-[2.5rem] border-2 border-dashed border-slate-700 bg-card-dark px-8 py-16 transition-all hover:border-primary/50 group cursor-pointer overflow-hidden ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex flex-col items-center gap-4 z-10 text-center">
              <div className="w-24 h-24 flex items-center justify-center rounded-3xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-6xl">cloud_upload</span>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">Seleccionar Imágenes</h3>
                <p className="text-slate-500 text-sm font-bold max-w-[300px] mx-auto leading-relaxed uppercase tracking-tight">
                  Toca aquí para elegir las fotos que quieres subir a este álbum.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload List */}
        <div className="px-6 pb-32">
          {uploads.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black">Cola de Carga</h3>
                <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {uploads.filter(u => u.status === 'COMPLETED').length} de {uploads.length} listas
                </span>
              </div>

              <div className="space-y-4">
                {uploads.map((item) => (
                  <div key={item.id} className="bg-card-dark p-4 rounded-3xl border border-white/5 flex items-center gap-4 shadow-sm">
                    <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-white/5">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url("${item.thumbnail}")` }}
                      />
                      {item.status === 'COMPLETED' && (
                        <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-2xl">check_circle</span>
                        </div>
                      )}
                      {item.status === 'ERROR' && (
                        <div className="absolute inset-0 bg-red-500/40 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-2xl">error</span>
                        </div>
                      )}
                      {item.status === 'UPLOADING' && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold truncate text-slate-200">{item.fileName}</p>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'COMPLETED' ? 'text-emerald-500' : item.status === 'ERROR' ? 'text-red-500' : 'text-primary'}`}>
                          {item.status === 'COMPLETED' ? '100%' : item.status === 'ERROR' ? 'ERROR' : `${item.progress}%`}
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ease-out ${item.status === 'COMPLETED' ? 'bg-emerald-500' : item.status === 'ERROR' ? 'bg-red-500' : 'bg-primary'}`}
                          style={{ width: `${item.status === 'COMPLETED' ? 100 : item.progress}%` }}
                        />
                      </div>

                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {item.size} • {item.status === 'UPLOADING' ? 'Cargando...' : item.status === 'COMPLETED' ? 'Completado' : item.status === 'ERROR' ? 'Fallo' : 'Esperando...'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <span className="material-symbols-outlined text-6xl mb-4">image</span>
              <p className="text-lg font-bold">No hay archivos en cola</p>
              <p className="text-xs uppercase tracking-widest font-bold mt-2">Selecciona fotos para empezar</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Insight */}
      {isUploading && (
        <div className="absolute bottom-10 left-0 w-full px-6 pointer-events-none">
          <div className="max-w-md mx-auto bg-primary text-white rounded-2xl p-4 shadow-2xl flex items-center gap-4 pointer-events-auto animate-bounce-subtle">
            <div className="w-10 h-10 shrink-0 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined animate-spin">sync</span>
            </div>
            <p className="text-[10px] font-black leading-relaxed uppercase tracking-wider">
              Subiendo archivos... Mantén esta pestaña abierta para asegurar el éxito.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Uploader;
