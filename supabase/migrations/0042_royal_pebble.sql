-- Improve shipping supplier registration with better error handling and validation
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
  -- Validate input
  IF p_user_id IS NULL OR p_email IS NULL THEN
    RAISE EXCEPTION 'User ID and email are required';
  END IF;

  IF NOT p_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Check if user already exists in any capacity
  IF EXISTS (
    SELECT 1 
    FROM shipping_suppliers 
    WHERE email = p_email OR user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'User already registered';
  END IF;

  -- Ensure profile exists first
  INSERT INTO profiles (id, email, created_at)
  VALUES (p_user_id, p_email, now())
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = now();

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

        -- Ensure authorization exists with correct initial role
        INSERT INTO authorizations (
          user_id,
          role,
          permissions
        ) VALUES (
          p_user_id,
          'user',
          jsonb_build_object(
            'complete_profile', true
          )
        )
        ON CONFLICT (user_id) DO UPDATE
        SET role = 'user',
            permissions = jsonb_build_object(
              'complete_profile', true
            ),
            updated_at = now();

        v_success := true;
        COMMIT;
      EXCEPTION
        WHEN OTHERS THEN
          ROLLBACK;
          RAISE;
      END;
    EXCEPTION
      WHEN unique_violation THEN
        -- Don't retry unique violations
        RAISE EXCEPTION 'User already registered';
      WHEN OTHERS THEN
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

-- Add function to safely complete shipping profile
CREATE OR REPLACE FUNCTION complete_shipping_profile(
  p_user_id uuid,
  p_company_name text,
  p_contact_name text,
  p_phone text,
  p_address text
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validate input
  IF p_company_name IS NULL OR length(trim(p_company_name)) < 2 THEN
    RAISE EXCEPTION 'Invalid company name';
  END IF;

  IF p_contact_name IS NULL OR length(trim(p_contact_name)) < 2 THEN
    RAISE EXCEPTION 'Invalid contact name';
  END IF;

  IF p_phone IS NULL OR p_phone !~ '^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$' THEN
    RAISE EXCEPTION 'Invalid phone number format';
  END IF;

  IF p_address IS NULL OR length(trim(p_address)) < 5 THEN
    RAISE EXCEPTION 'Invalid address';
  END IF;

  -- Update profile in a transaction
  BEGIN
    -- Update shipping supplier profile
    UPDATE shipping_suppliers
    SET
      company_name = trim(p_company_name),
      contact_name = trim(p_contact_name),
      phone = p_phone,
      address = trim(p_address),
      updated_at = now()
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Shipping supplier profile not found';
    END IF;

    -- Update authorization to shipping_supplier role
    UPDATE authorizations
    SET
      role = 'shipping_supplier',
      permissions = jsonb_build_object(
        'manage_rates', true,
        'view_shipments', true
      ),
      updated_at = now()
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Authorization not found';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$;