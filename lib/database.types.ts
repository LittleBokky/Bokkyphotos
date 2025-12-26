// Supabase Database Types for Bokkyphotos

export interface Album {
    id: string;
    title: string;
    description: string | null;
    cover_image_url: string | null;
    created_at: string;
    updated_at: string;
    is_published: boolean;
    display_order: number;
    location: string | null;
    event_date: string;
}

export interface Photo {
    id: string;
    album_id: string | null;
    title: string | null;
    description: string | null;
    image_url: string;
    thumbnail_url: string | null;
    width: number | null;
    height: number | null;
    file_size: number | null;
    created_at: string;
    updated_at: string;
    display_order: number;
    is_featured: boolean;
}

export interface AdminUser {
    id: string;
    email: string;
    created_at: string;
    last_login: string | null;
}

// Insert types (without auto-generated fields)
export type AlbumInsert = Omit<Album, 'id' | 'created_at' | 'updated_at'>;
export type PhotoInsert = Omit<Photo, 'id' | 'created_at' | 'updated_at'>;
export type AdminUserInsert = Omit<AdminUser, 'id' | 'created_at' | 'last_login'>;

// Update types (all fields optional except id)
export type AlbumUpdate = Partial<Omit<Album, 'id' | 'created_at'>>;
export type PhotoUpdate = Partial<Omit<Photo, 'id' | 'created_at'>>;
export type AdminUserUpdate = Partial<Omit<AdminUser, 'id' | 'created_at'>>;

// Database schema type
export interface Database {
    public: {
        Tables: {
            albums: {
                Row: Album;
                Insert: AlbumInsert;
                Update: AlbumUpdate;
            };
            photos: {
                Row: Photo;
                Insert: PhotoInsert;
                Update: PhotoUpdate;
            };
            admin_users: {
                Row: AdminUser;
                Insert: AdminUserInsert;
                Update: AdminUserUpdate;
            };
        };
    };
}
