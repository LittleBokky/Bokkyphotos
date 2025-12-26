import { useState, useEffect } from 'react';
import { getPhotosByAlbum, getFeaturedPhotos } from '../services/photoService';
import type { Photo } from '../lib/database.types';

/**
 * Custom hook to fetch photos by album
 */
export function usePhotos(albumId: string | null) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!albumId) {
            setPhotos([]);
            setLoading(false);
            return;
        }

        async function fetchPhotos() {
            try {
                setLoading(true);
                setError(null);

                const data = await getPhotosByAlbum(albumId);
                setPhotos(data);
            } catch (err) {
                setError(err as Error);
                console.error('Error in usePhotos:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchPhotos();
    }, [albumId]);

    const refetch = async () => {
        if (!albumId) return;

        try {
            setLoading(true);
            setError(null);

            const data = await getPhotosByAlbum(albumId);
            setPhotos(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error refetching photos:', err);
        } finally {
            setLoading(false);
        }
    };

    return { photos, loading, error, refetch };
}

/**
 * Custom hook to fetch featured photos
 */
export function useFeaturedPhotos() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchFeaturedPhotos() {
            try {
                setLoading(true);
                setError(null);

                const data = await getFeaturedPhotos();
                setPhotos(data);
            } catch (err) {
                setError(err as Error);
                console.error('Error in useFeaturedPhotos:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchFeaturedPhotos();
    }, []);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getFeaturedPhotos();
            setPhotos(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error refetching featured photos:', err);
        } finally {
            setLoading(false);
        }
    };

    return { photos, loading, error, refetch };
}
