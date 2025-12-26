# 🎉 Integración de Supabase - Bokkyphotos

## ✅ Estado de la Configuración

**Proyecto Supabase:** Bokkyphotos  
**ID:** `dlnqdvjkkhwcdvksravv`  
**Región:** EU Central 1 (Frankfurt)  
**Estado:** 🟢 ACTIVE_HEALTHY  
**URL:** https://dlnqdvjkkhwcdvksravv.supabase.co

---

## 📦 Instalación Completada

✅ Paquete `@supabase/supabase-js` instalado  
✅ Cliente de Supabase configurado en `lib/supabase.ts`  
✅ Variables de entorno creadas en `.env.local`  
✅ Esquema de base de datos aplicado

---

## 🗄️ Estructura de la Base de Datos

### Tablas Creadas

#### 1. **albums** (3 registros de ejemplo)
- `id` (UUID) - Primary Key
- `title` (TEXT) - Título del álbum
- `description` (TEXT) - Descripción
- `cover_image_url` (TEXT) - URL de la imagen de portada
- `created_at` (TIMESTAMPTZ) - Fecha de creación
- `updated_at` (TIMESTAMPTZ) - Fecha de actualización
- `is_published` (BOOLEAN) - Estado de publicación
- `display_order` (INTEGER) - Orden de visualización

**RLS Habilitado:** ✅  
**Políticas:**
- Público puede ver álbumes publicados
- Usuarios autenticados pueden gestionar todos los álbumes

#### 2. **photos** (0 registros)
- `id` (UUID) - Primary Key
- `album_id` (UUID) - Foreign Key a albums
- `title` (TEXT) - Título de la foto
- `description` (TEXT) - Descripción
- `image_url` (TEXT) - URL de la imagen
- `thumbnail_url` (TEXT) - URL del thumbnail
- `width` (INTEGER) - Ancho en píxeles
- `height` (INTEGER) - Alto en píxeles
- `file_size` (INTEGER) - Tamaño del archivo
- `created_at` (TIMESTAMPTZ) - Fecha de creación
- `updated_at` (TIMESTAMPTZ) - Fecha de actualización
- `display_order` (INTEGER) - Orden de visualización
- `is_featured` (BOOLEAN) - Foto destacada

**RLS Habilitado:** ✅  
**Políticas:**
- Público puede ver fotos de álbumes publicados
- Usuarios autenticados pueden gestionar todas las fotos

#### 3. **admin_users** (0 registros)
- `id` (UUID) - Primary Key
- `email` (TEXT UNIQUE) - Email del administrador
- `created_at` (TIMESTAMPTZ) - Fecha de creación
- `last_login` (TIMESTAMPTZ) - Último inicio de sesión

**RLS Habilitado:** ✅  
**Políticas:**
- Solo usuarios autenticados pueden ver admin_users

---

## 🔐 Seguridad (Row Level Security)

Todas las tablas tienen **RLS habilitado** con políticas que:
- Permiten acceso público de **solo lectura** a contenido publicado
- Requieren **autenticación** para operaciones de escritura
- Protegen datos sensibles de administradores

---

## 📁 Storage Bucket

Se debe crear manualmente el bucket `photos` en Supabase Dashboard:
1. Ve a **Storage** en el dashboard
2. Crea un nuevo bucket llamado `photos`
3. Márcalo como **público**

**Políticas de Storage (a aplicar):**
- Público puede ver fotos
- Usuarios autenticados pueden subir/actualizar/eliminar

---

## 🚀 Álbumes de Ejemplo Creados

1. **Portfolio Destacado** - Colección de nuestros mejores trabajos
2. **Eventos Corporativos** - Fotografía profesional de eventos
3. **Deportes y Acción** - Capturando momentos dinámicos

---

## 🔧 Uso del Cliente Supabase

```typescript
import { supabase } from './lib/supabase';

// Obtener álbumes publicados
const { data: albums } = await supabase
  .from('albums')
  .select('*')
  .eq('is_published', true)
  .order('display_order');

// Obtener fotos de un álbum
const { data: photos } = await supabase
  .from('photos')
  .select('*')
  .eq('album_id', albumId)
  .order('display_order');

// Subir una foto al storage
const { data, error } = await supabase.storage
  .from('photos')
  .upload(`album-${albumId}/${fileName}`, file);
```

---

## � Próximos Pasos

1. **Configurar Autenticación:**
   - Habilitar proveedores de auth en Supabase Dashboard
   - Implementar login/logout en la aplicación

2. **Crear Storage Bucket:**
   - Ir a Storage en el dashboard
   - Crear bucket `photos` público

3. **Integrar con Componentes:**
   - Conectar `Organization.tsx` con la tabla `albums`
   - Conectar `GalleryDetail.tsx` con la tabla `photos`
   - Actualizar `Uploader.tsx` para subir a Supabase Storage

4. **Implementar Funcionalidades:**
   - CRUD de álbumes
   - CRUD de fotos
   - Upload de imágenes
   - Generación de thumbnails

---

## 🔗 Enlaces Útiles

- **Dashboard:** https://supabase.com/dashboard/project/dlnqdvjkkhwcdvksravv
- **API Docs:** https://supabase.com/docs/reference/javascript/introduction
- **Storage Docs:** https://supabase.com/docs/guides/storage

---

## ⚠️ Importante

- El archivo `.env.local` contiene credenciales y **NO** debe subirse a Git
- Ya está incluido en `.gitignore` (patrón `*.local`)
- La `ANON_KEY` es pública y segura para usar en el frontend
- Para operaciones sensibles, usa la `SERVICE_ROLE_KEY` (solo backend)
