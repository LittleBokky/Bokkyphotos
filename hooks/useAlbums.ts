import { useState, useEffect } from 'react';
import { getPublishedAlbums, getAllAlbums } from '../services/albumService';
import type { Album } from '../lib/database.types';

/**
 * Custom hook to fetch and manage albums
 * @param includeUnpublished - If true, fetches all albums (admin mode)
 */
export function useAlbums(includeUnpublished: boolean = false) {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchAlbums() {
            try {
                setLoading(true);
                setError(null);

                const data = includeUnpublished
                    ? await getAllAlbums()
                    : await getPublishedAlbums();

                setAlbums(data);
            } catch (err) {
                setError(err as Error);
                console.error('Error in useAlbums:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchAlbums();
    }, [includeUnpublished]);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = includeUnpublished
                ? await getAllAlbums()
                : await getPublishedAlbums();

            setAlbums(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error refetching albums:', err);
        } finally {
            setLoading(false);
        }
    };

    return { albums, loading, error, refetch };
}
