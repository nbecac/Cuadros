/**
 * Cloud Image Service — uploads images to Supabase Storage.
 * Falls back to base64 data URLs when Supabase is not configured.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { compressImage } from './imageService';

const BUCKET_NAME = 'catalog-images';

/**
 * Compress a File via canvas, then either upload to Supabase Storage
 * (returning a public URL) or fall back to returning a data URL.
 */
export const uploadImage = async (file: File): Promise<string> => {
  // Always compress first using existing imageService logic
  const compressedDataUrl = await compressImage(file);

  if (!isSupabaseConfigured() || !supabase) {
    // Fallback: return base64 data URL (localStorage mode)
    return compressedDataUrl;
  }

  // Check session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No hay sesión de administrador.');
  }

  // Convert data URL → Blob for Supabase upload
  const response = await fetch(compressedDataUrl);
  const blob = await response.blob();

  const extension = blob.type === 'image/webp' ? 'webp' : 'jpg';
  const filePath = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, blob, { contentType: blob.type, upsert: false });

  if (uploadError) {
    throw new Error(`Error subiendo imagen al bucket catalog-images: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
};

/**
 * Remove an image from Supabase Storage (by its public URL or path).
 * No-op in localStorage mode.
 */
export const removeImage = async (urlOrPath: string): Promise<void> => {
  if (!isSupabaseConfigured() || !supabase) return;

  // Extract path from full URL
  let filePath = urlOrPath;
  const bucketSegment = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const idx = urlOrPath.indexOf(bucketSegment);
  if (idx !== -1) {
    filePath = urlOrPath.substring(idx + bucketSegment.length);
  }

  // Skip data URLs — they were never uploaded to the cloud
  if (filePath.startsWith('data:')) return;

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
  if (error) console.error('Error removing image:', error);
};
