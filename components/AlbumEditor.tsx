import React, { useState, useRef } from 'react';
import { Album } from '../lib/database.types';
import { uploadPhotoFile } from '../services/photoService';

interface AlbumEditorProps {
    album: Partial<Album>;
    onSave: (updates: Partial<Album>) => Promise<void>;
    onClose: () => void;
    isNew?: boolean;
}

const AlbumEditor: React.FC<AlbumEditorProps> = ({ album, onSave, onClose, isNew }) => {
    const [formData, setFormData] = useState({
        title: album.title || '',
        location: album.location || '',
        event_date: album.event_date || new Date().toISOString().split('T')[0],
        cover_image_url: album.cover_image_url || ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            // We use a special path for covers, or just the same upload logic
            // For covers, we use 'covers' as the albumId or similar if it's a new album without ID yet
            // If it exists, we use its ID.
            const albumId = album.id || 'new-album-temp';
            const url = await uploadPhotoFile(file, albumId, `cover_${Date.now()}`);
            setFormData(prev => ({ ...prev, cover_image_url: url }));
        } catch (error) {
            alert('Error al subir la imagen de portada');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return alert('El título es obligatorio');

        try {
            setIsSaving(true);
            await onSave(formData);
            onClose();
        } catch (error) {
            alert('Error al guardar el álbum');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-surface-dark border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-scale-up">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-black tracking-tight">{isNew ? 'Nuevo Álbum' : 'Editar Álbum'}</h2>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Cover Preview & Upload */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Imagen de Portada</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative aspect-[16/6] rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5 group cursor-pointer"
                        >
                            {formData.cover_image_url ? (
                                <>
                                    <img src={formData.cover_image_url} alt="Cover Preview" className="w-full h-full object-cover transition-all group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white">cloud_upload</span>
                                        <span className="ml-2 text-xs font-bold uppercase tracking-widest">Cambiar</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                    <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Subir Foto</span>
                                </div>
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Título</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white focus:ring-2 focus:ring-primary outline-none font-bold"
                                placeholder="Nombre del evento"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ubicación</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white focus:ring-2 focus:ring-primary outline-none font-bold"
                                    placeholder="Ciudad, Finca..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha</label>
                                <input
                                    type="date"
                                    value={formData.event_date}
                                    onChange={e => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white focus:ring-2 focus:ring-primary outline-none font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-14 bg-white/5 text-slate-400 font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || isUploading}
                            className="flex-[2] h-14 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSaving ? 'Guardando...' : (isNew ? 'Crear Álbum' : 'Guardar Cambios')}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
      `}</style>
        </div>
    );
};

export default AlbumEditor;
