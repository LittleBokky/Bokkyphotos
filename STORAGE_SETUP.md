# 📸 Configuración del Storage Bucket - Bokkyphotos

## ⚠️ ACCIÓN REQUERIDA

Para poder subir fotos a tu aplicación, **DEBES** crear manualmente el bucket de storage en Supabase.

---

## 🔧 Pasos para Crear el Bucket

### 1. Accede al Dashboard de Storage

Ve a: **https://supabase.com/dashboard/project/dlnqdvjkkhwcdvksravv/storage/buckets**

### 2. Crear Nuevo Bucket

1. Click en el botón **"New bucket"** (esquina superior derecha)
2. Completa el formulario:
   - **Name:** `photos` (exactamente así, en minúsculas)
   - **Public bucket:** ✅ **Activar** (muy importante)
   - **File size limit:** Puedes dejarlo por defecto o ajustarlo
   - **Allowed MIME types:** Puedes dejarlo vacío o especificar: `image/jpeg,image/png,image/webp,image/gif`

3. Click en **"Create bucket"**

### 3. Verificar la Creación

Deberías ver el bucket `photos` en la lista con:
- 🟢 Estado: Public
- 📁 0 objects (por ahora)

---

## 🔐 Políticas de Storage (Opcional)

Las políticas de storage ya están definidas en el schema SQL, pero si necesitas aplicarlas manualmente:

### 1. Ve a la pestaña "Policies" del bucket `photos`

### 2. Crea estas políticas:

#### Política 1: Public can view photos
```sql
CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');
```

#### Política 2: Authenticated users can upload photos
```sql
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
);
```

#### Política 3: Authenticated users can update photos
```sql
CREATE POLICY "Authenticated users can update photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
);
```

#### Política 4: Authenticated users can delete photos
```sql
CREATE POLICY "Authenticated users can delete photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
);
```

---

## 📂 Estructura de Carpetas Recomendada

Las fotos se organizarán automáticamente por álbum:

```
photos/
├── {album-id-1}/
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── photo3.jpg
├── {album-id-2}/
│   ├── photo1.jpg
│   └── photo2.jpg
└── {album-id-3}/
    └── photo1.jpg
```

Esto se hace automáticamente con la función `uploadPhotoFile()` en `services/photoService.ts`.

---

## ✅ Verificar que Funciona

Una vez creado el bucket, puedes probar subir una foto:

```typescript
import { uploadPhotoFile } from './services/photoService';

// En tu componente
const handleUpload = async (file: File) => {
  try {
    const url = await uploadPhotoFile(file, 'album-id-aqui');
    console.log('Foto subida:', url);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

Si ves un URL como este, ¡funciona! ✅
```
https://dlnqdvjkkhwcdvksravv.supabase.co/storage/v1/object/public/photos/album-id/1234567890.jpg
```

---

## 🆘 Troubleshooting

### Error: "Bucket not found"
- Verifica que el bucket se llame exactamente `photos` (minúsculas)
- Verifica que esté marcado como **Public**

### Error: "new row violates row-level security policy"
- Necesitas estar autenticado para subir fotos
- O ajusta las políticas para permitir uploads anónimos (no recomendado)

### Las fotos no se ven
- Verifica que el bucket sea **Public**
- Verifica que la política "Public can view photos" esté activa

---

## 🎯 Próximo Paso

Una vez creado el bucket, puedes:

1. **Integrar el uploader** en `Uploader.tsx`
2. **Mostrar fotos** en `GalleryDetail.tsx`
3. **Crear álbumes** con portadas

Ver ejemplos en: `examples/SupabaseIntegrationExamples.tsx`

---

## 📚 Recursos

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Upload Files](https://supabase.com/docs/guides/storage/uploads)
