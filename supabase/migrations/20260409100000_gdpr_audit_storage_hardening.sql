-- 1. Audit log TTL: add expiration column for GDPR data retention (90 days)
ALTER TABLE public.audit_log
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '90 days');

CREATE INDEX IF NOT EXISTS idx_audit_log_expires ON public.audit_log(expires_at);

-- 2. Storage: allow service_role to delete generated images
-- (service_role bypasses RLS, but explicit policy for clarity and if RLS is enforced)
CREATE POLICY "Service can delete generated images" ON storage.objects FOR DELETE
  USING (bucket_id = 'generated-images');

CREATE POLICY "Service can delete watermarked images" ON storage.objects FOR DELETE
  USING (bucket_id = 'watermarked-images');
