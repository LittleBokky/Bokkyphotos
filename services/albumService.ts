import { supabase } from '../lib/supabase';
import type { Album, AlbumInsert, AlbumUpdate } from '../lib/database.types';

/**
 * Album Service - Handles all album-related operations with Supabase
 */

/**
 * Get all published albums ordered by display_order
 */
export async function getPublishedAlbums(): Promise<Album[]> {
    const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching published albums:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get all albums (admin only)
 */
export async function getAllAlbums(): Promise<Album[]> {
    const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching all albums:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get a single album by ID
 */
export async function getAlbumById(id: string): Promise<Album | null> {
    const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching album:', error);
        throw error;
    }

    return data;
}

/**
 * Create a new album
 */
export async function createAlbum(album: AlbumInsert): Promise<Album> {
    const { data, error } = await supabase
        .from('albums')
        .insert(album)
        .select()
        .single();

    if (error) {
        console.error('Error creating album:', error);
        throw error;
    }

    return data;
}

/**
 * Update an existing album
 */
export async function updateAlbum(id: string, updates: AlbumUpdate): Promise<Album> {
    const { data, error } = await supabase
        .from('albums')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating album:', error);
        throw error;
    }

    return data;
}

/**
 * Delete an album
 */
export async function deleteAlbum(id: string): Promise<void> {
    const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting album:', error);
        throw error;
    }
}

/**
 * Toggle album published status
 */
export async function toggleAlbumPublished(id: string, isPublished: boolean): Promise<Album> {
    return updateAlbum(id, { is_published: isPublished });
}
