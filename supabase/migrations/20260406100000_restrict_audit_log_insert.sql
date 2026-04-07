-- Restrict audit_log INSERT to service_role only
-- Edge Functions use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS entirely,
-- so removing the authenticated-user INSERT policy is safe.
-- This prevents clients from fabricating arbitrary audit log entries.
DROP POLICY IF EXISTS "Users can insert own audit logs" ON audit_log;
DROP POLICY IF EXISTS "Authenticated can insert audit log" ON audit_log;
