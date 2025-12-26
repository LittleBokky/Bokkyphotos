import { supabase } from '../lib/supabase';
import type { Photo, PhotoInsert, PhotoUpdate } from '../lib/database.types';

/**
 * Photo Service - Handles all photo-related operations with Supabase
 */

/**
 * Get all photos from a specific album
 */
export async function getPhotosByAlbum(albumId: string): Promise<Photo[]> {
    const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('album_id', albumId)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching photos:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get all featured photos
 */
export async function getFeaturedPhotos(): Promise<Photo[]> {
    const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching featured photos:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get a single photo by ID
 */
export async function getPhotoById(id: string): Promise<Photo | null> {
    const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching photo:', error);
        throw error;
    }

    return data;
}

/**
 * Create a new photo
 */
export async function createPhoto(photo: PhotoInsert): Promise<Photo> {
    const { data, error } = await supabase
        .from('photos')
        .insert(photo)
        .select()
        .single();

    if (error) {
        console.error('Error creating photo:', error);
        throw error;
    }

    return data;
}

/**
 * Update an existing photo
 */
export async function updatePhoto(id: string, updates: PhotoUpdate): Promise<Photo> {
    const { data, error } = await supabase
        .from('photos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating photo:', error);
        throw error;
    }

    return data;
}

/**
 * Delete a photo
 */
export async function deletePhoto(id: string): Promise<void> {
    const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting photo:', error);
        throw error;
    }
}

/**
 * Upload a photo file to Supabase Storage
 */
export async function uploadPhotoFile(
    file: File,
    albumId: string,
    fileName?: string
): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const filePath = `${albumId}/${fileName || Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading photo:', error);
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(data.path);

    return publicUrl;
}

/**
 * Delete a photo file from Supabase Storage
 */
export async function deletePhotoFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage
        .from('photos')
        .remove([filePath]);

    if (error) {
        console.error('Error deleting photo file:', error);
        throw error;
    }
}

/**
 * Toggle photo featured status
 */
export async function togglePhotoFeatured(id: string, isFeatured: boolean): Promise<Photo> {
    return updatePhoto(id, { is_featured: isFeatured });
}
