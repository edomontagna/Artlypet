-- Fix add_credits: use plan_type enum instead of app_role
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id UUID, p_amount INT, p_plan_upgrade TEXT DEFAULT NULL)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance INT;
BEGIN
  IF p_plan_upgrade = 'premium' THEN
    UPDATE profiles
    SET credit_balance = credit_balance + p_amount,
        plan_type = 'premium',
        premium_purchased_at = now(),
        updated_at = now()
    WHERE user_id = p_user_id
    RETURNING credit_balance INTO v_new_balance;
  ELSE
    UPDATE profiles
    SET credit_balance = credit_balance + p_amount,
        updated_at = now()
    WHERE user_id = p_user_id
    RETURNING credit_balance INTO v_new_balance;
  END IF;

  IF NOT FOUND THEN
    RETURN -1;
  END IF;

  RETURN v_new_balance;
END;
$$;
