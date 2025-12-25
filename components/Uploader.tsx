
import React, { useState } from 'react';
import { UploadItem } from '../types';

interface UploaderProps {
  onBack: () => void;
  onDone: () => void;
}

const Uploader: React.FC<UploaderProps> = ({ onBack, onDone }) => {
  const [uploads] = useState<UploadItem[]>([
    {
      id: '1',
      fileName: 'IMG_2023_Wedding_001.ARW',
      size: '42.5 MB',
      type: 'RAW',
      progress: 78,
      status: 'UPLOADING',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: '2',
      fileName: 'Profile_Shot_B.JPG',
      size: '8.2 MB',
      type: 'JPG',
      progress: 100,
      status: 'COMPLETED',
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: '3',
      fileName: 'Sunset_Final.TIFF',
      size: '124 MB',
      type: 'TIFF',
      progress: 0,
      status: 'WAITING',
      thumbnail: 'https://images.unsplash.com/photo-1470252649358-96949c73e78c?q=80&w=200&auto=format&fit=crop'
    }
  ]);

  return (
    <div className="relative flex flex-col h-screen bg-background-dark text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-20 shrink-0 border-b border-slate-800 bg-background-dark/80 backdrop-blur-xl z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <h2 className="text-base font-bold tracking-widest uppercase">Cargador Pro</h2>
        <button 
          onClick={onDone}
          className="h-10 px-5 flex items-center rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          Listo
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* Dropzone */}
        <div className="p-6">
          <div className="relative flex flex-col items-center justify-center gap-6 rounded-[2.5rem] border-2 border-dashed border-slate-700 bg-card-dark px-8 py-16 transition-all hover:border-primary/50 group cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex flex-col items-center gap-4 z-10">
              <div className="w-24 h-24 flex items-center justify-center rounded-3xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-6xl">cloud_upload</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black mb-2">Sube tus archivos</h3>
                <p className="text-slate-500 text-sm font-medium max-w-[240px] mx-auto leading-relaxed">
                  Arrastra RAWs o JPEGs de alta resolución. Optimización AI automática activa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Source Bar */}
        <div className="px-6 mb-8 flex gap-3 overflow-x-auto no-scrollbar">
          {[
            { icon: 'photo_library', name: 'Carrete' },
            { icon: 'folder', name: 'Archivos' },
            { icon: 'cloud', name: 'Cloud' },
            { icon: 'camera', name: 'Cámara' }
          ].map((src, i) => (
            <button key={i} className="flex h-12 shrink-0 items-center gap-3 rounded-2xl bg-slate-800/50 px-5 border border-slate-800 hover:border-slate-600 transition-all">
              <span className="material-symbols-outlined text-slate-400 text-xl">{src.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider">{src.name}</span>
            </button>
          ))}
        </div>

        {/* Upload List */}
        <div className="px-6 pb-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black">Cola de Carga</h3>
            <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 de 128 MB</span>
          </div>

          <div className="space-y-4">
            {uploads.map((item) => (
              <div key={item.id} className="bg-card-dark p-4 rounded-3xl border border-slate-800/50 flex items-center gap-4 shadow-sm">
                <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-slate-800">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${item.thumbnail}")` }}
                  />
                  {item.status === 'COMPLETED' && (
                    <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-2xl filled">check_circle</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-black/60 px-1.5 py-0.5 rounded-tl-lg">
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">{item.type}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold truncate text-slate-200">{item.fileName}</p>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'COMPLETED' ? 'text-green-500' : 'text-primary'}`}>
                      {item.status === 'COMPLETED' ? '100%' : `${item.progress}%`}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-700 ease-out ${item.status === 'COMPLETED' ? 'bg-green-500' : 'bg-primary'}`} 
                      style={{ width: `${item.status === 'COMPLETED' ? 100 : item.progress}%` }} 
                    />
                  </div>

                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.size} • {item.status === 'UPLOADING' ? 'Cargando...' : 'Completado'}</p>
                </div>
                
                <button className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Insight */}
      <div className="absolute bottom-10 left-0 w-full px-6 pointer-events-none">
        <div className="max-w-md mx-auto bg-primary text-white rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-bounce-subtle pointer-events-auto">
          <div className="w-10 h-10 shrink-0 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <p className="text-xs font-bold leading-relaxed uppercase tracking-wide">
            Carga en segundo plano habilitada. Puedes seguir navegando.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
