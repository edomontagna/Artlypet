-- Add watermarked_path column to generated_images
-- Referenced by delete-account and cleanup-expired Edge Functions for storage cleanup
ALTER TABLE generated_images ADD COLUMN IF NOT EXISTS watermarked_path TEXT;
