import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_KEY;


if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Image upload will not work.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload image to Supabase Storage (S3-compatible buckets)
 * Images are uploaded to Supabase Storage buckets, and the public URL is returned.
 * This URL should then be saved to the database.
 * 
 * @param {string} uri - Local file URI from expo-image-picker
 * @param {string} bucket - Supabase storage bucket name (S3-compatible)
 * @param {string} path - Path in the bucket (e.g., 'products/product-123.jpg')
 * @returns {Promise<string>} Public URL of the uploaded image (to be saved in database)
 */
export const uploadImageToSupabase = async (uri, bucket, path) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
  }

  try {
    // Read the file as blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Upload to Supabase Storage (S3-compatible bucket)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, blob, {
        contentType: blob.type || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get public URL from Supabase Storage
    // This URL will be saved to the database
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Supabase Storage (S3-compatible buckets)
 * Images are uploaded to Supabase Storage, and public URLs are returned.
 * These URLs should then be saved to the database.
 * 
 * @param {string[]} uris - Array of local file URIs
 * @param {string} bucket - Supabase storage bucket name (S3-compatible)
 * @param {string} folder - Folder name in the bucket (e.g., 'products')
 * @param {string} prefix - Prefix for file names (e.g., 'product-123')
 * @returns {Promise<string[]>} Array of public URLs (to be saved in database)
 */
export const uploadMultipleImagesToSupabase = async (uris, bucket, folder, prefix) => {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const uploadPromises = uris.map(async (uri, index) => {
    const extension = uri.split('.').pop() || 'jpg';
    const fileName = `${prefix}-${Date.now()}-${index}.${extension}`;
    const path = `${folder}/${fileName}`;
    return uploadImageToSupabase(uri, bucket, path);
  });

  return Promise.all(uploadPromises);
};

/**
 * Delete image from Supabase Storage
 * @param {string} bucket - Supabase storage bucket name
 * @param {string} path - Path in the bucket
 */
export const deleteImageFromSupabase = async (bucket, path) => {
  if (!supabase) {
    return;
  }

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Supabase delete error:', error);
    }
  } catch (error) {
    console.error('Supabase delete error:', error);
  }
};

/**
 * Generate a unique file path for an image
 * @param {string} folder - Folder name (e.g., 'products', 'avatars', 'crop-detections')
 * @param {string} prefix - Prefix for the file name
 * @param {string} extension - File extension (default: 'jpg')
 * @returns {string} Unique file path
 */
export const generateImagePath = (folder, prefix, extension = 'jpg') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${folder}/${prefix}-${timestamp}-${random}.${extension}`;
};

