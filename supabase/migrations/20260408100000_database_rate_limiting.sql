-- Database-backed rate limiting (replaces in-memory per-isolate limiter)

CREATE TABLE IF NOT EXISTS public.rate_limits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No user-facing policies — only service_role accesses this table

CREATE INDEX idx_rate_limits_lookup ON public.rate_limits (user_id, endpoint, created_at DESC);

-- Atomic rate limit check: cleans old entries, counts recent, inserts if allowed
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_endpoint TEXT,
  p_max_requests INT DEFAULT 5,
  p_window_seconds INT DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INT;
  v_cutoff TIMESTAMPTZ := now() - (p_window_seconds || ' seconds')::INTERVAL;
BEGIN
  -- Delete expired entries for this user+endpoint
  DELETE FROM public.rate_limits
  WHERE user_id = p_user_id AND endpoint = p_endpoint AND created_at < v_cutoff;

  -- Count recent requests
  SELECT COUNT(*) INTO v_count
  FROM public.rate_limits
  WHERE user_id = p_user_id AND endpoint = p_endpoint AND created_at >= v_cutoff;

  IF v_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;

  -- Record this request
  INSERT INTO public.rate_limits (user_id, endpoint) VALUES (p_user_id, p_endpoint);
  RETURN TRUE;
END;
$$;
