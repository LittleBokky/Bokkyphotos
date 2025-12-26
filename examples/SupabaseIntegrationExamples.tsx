/**
 * EJEMPLO DE INTEGRACIÓN CON SUPABASE
 * 
 * Este archivo muestra cómo integrar los hooks de Supabase
 * en tus componentes existentes de Bokkyphotos.
 * 
 * NO es necesario usar este archivo, es solo un ejemplo de referencia.
 */

import React from 'react';
import { useAlbums } from '../hooks/useAlbums';
import { usePhotos } from '../hooks/usePhotos';

// ============================================
// EJEMPLO 1: Componente de Lista de Álbumes
// ============================================

export function AlbumListExample() {
    const { albums, loading, error, refetch } = useAlbums();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white">Cargando álbumes...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">
                    Error: {error.message}
                    <button onClick={refetch} className="ml-4 px-4 py-2 bg-primary rounded">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {albums.map(album => (
                <div
                    key={album.id}
                    className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
                >
                    {album.cover_image_url && (
                        <img
                            src={album.cover_image_url}
                            alt={album.title}
                            className="w-full h-48 object-cover"
                        />
                    )}
                    <div className="p-4">
                        <h3 className="text-xl font-bold text-white mb-2">
                            {album.title}
                        </h3>
                        <p className="text-slate-300 text-sm">
                            {album.description}
                        </p>
                        {!album.is_published && (
                            <span className="inline-block mt-2 px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">
                                No publicado
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============================================
// EJEMPLO 2: Componente de Galería de Fotos
// ============================================

export function PhotoGalleryExample({ albumId }: { albumId: string }) {
    const { photos, loading, error } = usePhotos(albumId);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white">Cargando fotos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">Error: {error.message}</div>
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">No hay fotos en este álbum</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {photos.map(photo => (
                <div
                    key={photo.id}
                    className="aspect-square overflow-hidden rounded-lg bg-white/5 hover:scale-105 transition-transform cursor-pointer"
                >
                    <img
                        src={photo.thumbnail_url || photo.image_url}
                        alt={photo.title || 'Photo'}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
}

// ============================================
// EJEMPLO 3: Componente de Upload de Fotos
// ============================================

import { uploadPhotoFile, createPhoto } from '../services/photoService';

export function PhotoUploadExample({ albumId }: { albumId: string }) {
    const [uploading, setUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setProgress(0);

            // 1. Subir archivo a Supabase Storage
            const imageUrl = await uploadPhotoFile(file, albumId);
            setProgress(50);

            // 2. Crear registro en la base de datos
            await createPhoto({
                album_id: albumId,
                image_url: imageUrl,
                title: file.name.replace(/\.[^/.]+$/, ''), // Nombre sin extensión
                display_order: 0,
                is_featured: false,
                description: null,
                thumbnail_url: null,
                width: null,
                height: null,
                file_size: file.size
            });
            setProgress(100);

            alert('¡Foto subida exitosamente!');
        } catch (error) {
            console.error('Error subiendo foto:', error);
            alert('Error subiendo foto: ' + (error as Error).message);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="p-6">
            <label className="block">
                <span className="text-white mb-2 block">Seleccionar foto</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="block w-full text-sm text-slate-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary/80
            disabled:opacity-50"
                />
            </label>

            {uploading && (
                <div className="mt-4">
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-sm text-slate-300 mt-2">
                        Subiendo... {progress}%
                    </p>
                </div>
            )}
        </div>
    );
}

// ============================================
// EJEMPLO 4: Integración con Organization.tsx
// ============================================

/**
 * Así es como podrías actualizar tu componente Organization.tsx:
 * 
 * 1. Importa el hook:
 *    import { useAlbums } from '../hooks/useAlbums';
 * 
 * 2. Reemplaza los datos hardcoded:
 *    const { albums, loading, error } = useAlbums(isAdmin);
 * 
 * 3. Renderiza los álbumes reales:
 *    {albums.map(album => (
 *      <AlbumCard 
 *        key={album.id}
 *        title={album.title}
 *        description={album.description}
 *        coverImage={album.cover_image_url}
 *        onClick={() => handleOpenAlbum(album.id)}
 *      />
 *    ))}
 */

// ============================================
// EJEMPLO 5: Crear un Nuevo Álbum (Admin)
// ============================================

import { createAlbum } from '../services/albumService';

export function CreateAlbumExample() {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [creating, setCreating] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setCreating(true);

            const newAlbum = await createAlbum({
                title,
                description,
                is_published: false,
                display_order: 0,
                cover_image_url: null
            });

            console.log('Álbum creado:', newAlbum);
            alert('¡Álbum creado exitosamente!');

            // Limpiar formulario
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error creando álbum:', error);
            alert('Error: ' + (error as Error).message);
        } finally {
            setCreating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-white mb-2">Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                />
            </div>

            <div>
                <label className="block text-white mb-2">Descripción</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                    rows={3}
                />
            </div>

            <button
                type="submit"
                disabled={creating}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50"
            >
                {creating ? 'Creando...' : 'Crear Álbum'}
            </button>
        </form>
    );
}
