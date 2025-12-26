# 🚀 Guía Rápida de Uso - Supabase Integration

## 📦 Archivos Creados

### Configuración
- ✅ `.env.local` - Variables de entorno (no se sube a Git)
- ✅ `lib/supabase.ts` - Cliente de Supabase configurado
- ✅ `lib/database.types.ts` - Tipos TypeScript de la BD
- ✅ `vite-env.d.ts` - Tipos de variables de entorno

### Servicios
- ✅ `services/albumService.ts` - CRUD de álbumes
- ✅ `services/photoService.ts` - CRUD de fotos + upload

### Hooks de React
- ✅ `hooks/useAlbums.ts` - Hook para obtener álbumes
- ✅ `hooks/usePhotos.ts` - Hooks para obtener fotos

---

## 🎯 Ejemplos de Uso

### 1. Obtener Álbumes en un Componente

```typescript
import { useAlbums } from '../hooks/useAlbums';

function MyComponent() {
  const { albums, loading, error, refetch } = useAlbums();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {albums.map(album => (
        <div key={album.id}>
          <h3>{album.title}</h3>
          <p>{album.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Obtener Fotos de un Álbum

```typescript
import { usePhotos } from '../hooks/usePhotos';

function GalleryComponent({ albumId }: { albumId: string }) {
  const { photos, loading, error } = usePhotos(albumId);

  if (loading) return <div>Cargando fotos...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map(photo => (
        <img 
          key={photo.id} 
          src={photo.thumbnail_url || photo.image_url} 
          alt={photo.title || 'Photo'} 
        />
      ))}
    </div>
  );
}
```

### 3. Crear un Nuevo Álbum (Admin)

```typescript
import { createAlbum } from '../services/albumService';

async function handleCreateAlbum() {
  try {
    const newAlbum = await createAlbum({
      title: 'Mi Nuevo Álbum',
      description: 'Descripción del álbum',
      is_published: false,
      display_order: 0,
      cover_image_url: null
    });
    
    console.log('Álbum creado:', newAlbum);
  } catch (error) {
    console.error('Error creando álbum:', error);
  }
}
```

### 4. Subir una Foto

```typescript
import { uploadPhotoFile, createPhoto } from '../services/photoService';

async function handleUploadPhoto(file: File, albumId: string) {
  try {
    // 1. Subir el archivo a Storage
    const imageUrl = await uploadPhotoFile(file, albumId);
    
    // 2. Crear el registro en la BD
    const photo = await createPhoto({
      album_id: albumId,
      image_url: imageUrl,
      title: file.name,
      display_order: 0,
      is_featured: false,
      description: null,
      thumbnail_url: null,
      width: null,
      height: null,
      file_size: file.size
    });
    
    console.log('Foto subida:', photo);
  } catch (error) {
    console.error('Error subiendo foto:', error);
  }
}
```

### 5. Actualizar un Álbum

```typescript
import { updateAlbum } from '../services/albumService';

async function handlePublishAlbum(albumId: string) {
  try {
    const updated = await updateAlbum(albumId, {
      is_published: true
    });
    
    console.log('Álbum publicado:', updated);
  } catch (error) {
    console.error('Error publicando álbum:', error);
  }
}
```

### 6. Eliminar una Foto

```typescript
import { deletePhoto, deletePhotoFile } from '../services/photoService';

async function handleDeletePhoto(photoId: string, imageUrl: string) {
  try {
    // 1. Eliminar el registro de la BD
    await deletePhoto(photoId);
    
    // 2. Eliminar el archivo del Storage (opcional)
    // Extraer el path del URL
    const path = imageUrl.split('/storage/v1/object/public/photos/')[1];
    if (path) {
      await deletePhotoFile(path);
    }
    
    console.log('Foto eliminada');
  } catch (error) {
    console.error('Error eliminando foto:', error);
  }
}
```

---

## 🔐 Autenticación (Próximo Paso)

Para habilitar las funciones de admin, necesitas implementar autenticación:

```typescript
import { supabase } from '../lib/supabase';

// Login
async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
}

// Logout
async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Check current user
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
```

---

## ⚠️ Importante: Storage Bucket

**Debes crear el bucket manualmente:**

1. Ve a https://supabase.com/dashboard/project/dlnqdvjkkhwcdvksravv/storage/buckets
2. Click en "New bucket"
3. Nombre: `photos`
4. Marca como **Public**
5. Click en "Create bucket"

Luego aplica las políticas de storage (ya están en el schema SQL).

---

## 📊 Estado Actual de la Base de Datos

### Álbumes (3 registros de ejemplo)
1. Portfolio Destacado
2. Eventos Corporativos
3. Deportes y Acción

### Fotos (0 registros)
Listo para empezar a subir fotos.

---

## 🔄 Próximos Pasos Recomendados

1. **Crear el bucket de Storage** (ver arriba)
2. **Configurar autenticación** en Supabase Dashboard
3. **Integrar hooks en componentes existentes:**
   - `Organization.tsx` → usar `useAlbums()`
   - `GalleryDetail.tsx` → usar `usePhotos(albumId)`
   - `Uploader.tsx` → usar `uploadPhotoFile()` y `createPhoto()`
4. **Implementar UI de admin** para CRUD de álbumes/fotos
5. **Añadir generación de thumbnails** (opcional)

---

## 🆘 Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que `.env.local` existe
- Reinicia el servidor de desarrollo: `npm run dev`

### Error: "relation does not exist"
- Verifica que las migraciones se aplicaron correctamente
- Revisa el SQL Editor en Supabase Dashboard

### Error: "new row violates row-level security policy"
- Necesitas estar autenticado para crear/editar
- O ajusta las políticas RLS según tus necesidades

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
