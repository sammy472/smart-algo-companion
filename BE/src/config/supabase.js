import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Image upload will not work.');
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Helper function to upload image to Supabase Storage (S3-compatible buckets)
 * Note: In this application, image uploads are handled on the frontend.
 * This backend function is available if needed for server-side uploads.
 * The frontend uploads to Supabase Storage and sends the URL to the backend to save in the database.
 * 
 * @param {string|Buffer} file - File data (base64 string or buffer)
 * @param {string} bucket - Supabase storage bucket name (S3-compatible)
 * @param {string} path - Path in the bucket
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export const uploadImageToSupabase = async (file, bucket, path) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  }

  try {
    // Convert base64 or file buffer to blob
    let fileData;
    if (typeof file === 'string') {
      // If it's a base64 string
      const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      fileData = buffer;
    } else {
      fileData = file;
    }

    // Upload to Supabase Storage (S3-compatible bucket)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileData, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get public URL from Supabase Storage
    // This URL should be saved to the database
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }
};

// Helper function to delete image from Supabase Storage
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

