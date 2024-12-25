-- Improve shipping supplier registration with better error handling
CREATE OR REPLACE FUNCTION register_shipping_supplier(
  p_user_id uuid,
  p_email text
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_retry_count int := 0;
  v_max_retries int := 3;
  v_success boolean := false;
BEGIN
  WHILE v_retry_count < v_max_retries AND NOT v_success LOOP
    BEGIN
      -- Create shipping supplier profile with pending status
      INSERT INTO shipping_suppliers (
        user_id,
        email,
        company_name,
        contact_name,
        phone,
        address,
        verified
      ) VALUES (
        p_user_id,
        p_email,
        'Pending Setup',
        'Pending Setup',
        'Pending',
        'Pending',
        false
      );

      -- Set initial authorization
      INSERT INTO authorizations (
        user_id,
        role,
        permissions
      ) VALUES (
        p_user_id,
        'user',
        '{}'::jsonb
      )
      ON CONFLICT (user_id) DO UPDATE
      SET role = 'user',
          permissions = '{}'::jsonb,
          updated_at = now();

      v_success := true;
    EXCEPTION
      WHEN unique_violation THEN
        -- Handle case where user already exists
        RAISE EXCEPTION 'User already registered';
      WHEN OTHERS THEN
        -- Retry on other errors
        IF v_retry_count < v_max_retries - 1 THEN
          v_retry_count := v_retry_count + 1;
          PERFORM pg_sleep(0.1 * power(2, v_retry_count)); -- Exponential backoff
          CONTINUE;
        ELSE
          RAISE;
        END IF;
    END;
  END LOOP;

  IF NOT v_success THEN
    RAISE EXCEPTION 'Failed to register shipping supplier after % attempts', v_max_retries;
  END IF;
END;
$$;