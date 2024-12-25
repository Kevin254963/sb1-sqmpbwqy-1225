-- Improve shipping supplier registration with better transaction handling
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
  -- Check if user already exists
  IF EXISTS (
    SELECT 1 FROM shipping_suppliers 
    WHERE email = p_email OR user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'User already registered';
  END IF;

  -- Ensure profile exists
  INSERT INTO profiles (id, email, created_at)
  VALUES (p_user_id, p_email, now())
  ON CONFLICT (id) DO NOTHING;

  WHILE v_retry_count < v_max_retries AND NOT v_success LOOP
    BEGIN
      -- Start transaction
      BEGIN
        -- Create shipping supplier profile
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

        -- Ensure authorization exists
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

        -- If we get here, all operations succeeded
        v_success := true;
        COMMIT;
      EXCEPTION
        WHEN OTHERS THEN
          -- Rollback transaction on error
          ROLLBACK;
          RAISE;
      END;
    EXCEPTION
      WHEN unique_violation THEN
        -- Don't retry on unique violations
        RAISE EXCEPTION 'User already registered';
      WHEN OTHERS THEN
        -- Retry other errors with backoff
        IF v_retry_count < v_max_retries - 1 THEN
          v_retry_count := v_retry_count + 1;
          PERFORM pg_sleep(0.1 * power(2, v_retry_count));
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