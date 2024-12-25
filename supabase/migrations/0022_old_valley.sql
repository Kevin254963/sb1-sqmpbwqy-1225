-- Create admin user with specified credentials
DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- First check if admin user exists
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'admin@example.com';

  -- If admin doesn't exist, create them
  IF admin_id IS NULL THEN
    INSERT INTO auth.users (
      email,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      instance_id
    ) VALUES (
      'admin@example.com',
      '{"provider":"email","providers":["email"]}',
      '{}',
      false,
      'authenticated',
      crypt('SuperSecretPassword', gen_salt('bf')),
      now(),
      now(),
      now(),
      '00000000-0000-0000-0000-000000000000'
    )
    RETURNING id INTO admin_id;

    -- Create admin authorization
    INSERT INTO authorizations (
      user_id,
      role,
      permissions
    )
    VALUES (
      admin_id,
      'admin',
      jsonb_build_object(
        'manage_verifications', true,
        'manage_users', true,
        'manage_suppliers', true
      )
    );

    RAISE NOTICE 'Admin account created successfully';
  ELSE
    -- Update existing admin's password if needed
    UPDATE auth.users
    SET encrypted_password = crypt('SuperSecretPassword', gen_salt('bf'))
    WHERE id = admin_id;

    -- Ensure admin authorization exists with correct permissions
    INSERT INTO authorizations (
      user_id,
      role,
      permissions
    )
    VALUES (
      admin_id,
      'admin',
      jsonb_build_object(
        'manage_verifications', true,
        'manage_users', true,
        'manage_suppliers', true
      )
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      role = 'admin',
      permissions = jsonb_build_object(
        'manage_verifications', true,
        'manage_users', true,
        'manage_suppliers', true
      ),
      updated_at = now();

    RAISE NOTICE 'Admin account updated successfully';
  END IF;
END $$;