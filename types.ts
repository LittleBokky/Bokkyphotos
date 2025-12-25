
export type AppView = 'LANDING' | 'DASHBOARD' | 'ALBUMS' | 'UPLOADER' | 'GALLERY_DETAIL' | 'ADMIN_LOGIN';

export interface Gallery {
  id: string;
  name: string;
  date: string;
  status: 'ENTREGADA' | 'EN_EDICION' | 'PENDIENTE';
  photoCount: number;
  thumbnail: string;
}

export interface UploadItem {
  id: string;
  fileName: string;
  size: string;
  type: 'RAW' | 'JPG' | 'TIFF';
  progress: number;
  status: 'UPLOADING' | 'WAITING' | 'ERROR' | 'COMPLETED';
  thumbnail: string;
}
