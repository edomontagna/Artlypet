-- =============================================================================
-- Scheduled cleanup of expired images via pg_cron + pg_net
-- =============================================================================
-- This migration sets up a daily cron job that invokes the cleanup-expired
-- Edge Function to remove expired image_originals and their linked
-- generated_images (both DB records and storage files).
--
-- Prerequisites:
--   1. pg_cron and pg_net extensions must be enabled in Supabase Dashboard
--      (Database > Extensions). pg_cron is available on Pro plans and above.
--   2. The following app settings must be configured via SQL or Dashboard:
--        ALTER DATABASE postgres SET app.settings.supabase_url = 'https://<project-ref>.supabase.co';
--        ALTER DATABASE postgres SET app.settings.cleanup_secret = '<your-secret>';
--   3. The CLEANUP_SECRET Edge Function secret must match app.settings.cleanup_secret.
--
-- If pg_cron is not available on your plan, you can trigger the Edge Function
-- from an external cron service (e.g., cron-job.org, GitHub Actions schedule)
-- by sending a POST request with the x-cleanup-secret header.
-- =============================================================================

-- Enable required extensions (no-op if already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule cleanup to run daily at 3 AM UTC
SELECT cron.schedule(
  'cleanup-expired-images',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/cleanup-expired',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cleanup-secret', current_setting('app.settings.cleanup_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);
