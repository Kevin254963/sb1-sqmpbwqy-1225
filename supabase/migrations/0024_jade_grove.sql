/*
  # Create Admin Account

  1. Creates an admin user account with proper credentials
  2. Sets up required profile and authorization records
  3. Handles existing records gracefully
  4. Uses proper error handling and transaction management
*/

DO $$ 
DECLARE
  admin_id uuid;
  existing_profile_id uuid;
BEGIN
  -- Start by checking for existing admin user
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'admin@example.com';

  -- Also check for existing profile to avoid conflicts
  SELECT id INTO existing_profile_id
  FROM profiles
  WHERE email = 'admin@example.com';

  -- If profile exists but no admin user, clean up the profile
  IF existing_profile_id IS NOT NULL AND admin_id IS NULL THEN
    DELETE FROM profiles WHERE id = existing_profile_id;
  END IF;

  -- If admin doesn't exist, create the full account
  IF admin_id IS NULL THEN
    -- Create the admin user
    INSERT INTO auth.users (
      id,
      email,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      instance_id,
      aud,
      confirmation_token
    ) VALUES (
      gen_random_uuid(),
      'admin@example.com',
      '{"provider":"email","providers":["email"]}',
      '{}',
      false,
      'authenticated',
      crypt('AdminPass123!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      encode(gen_random_bytes(32), 'hex')
    )
    RETURNING id INTO admin_id;

    -- Create the required profile
    INSERT INTO profiles (
      id,
      email,
      full_name,
      created_at,
      updated_at
    ) VALUES (
      admin_id,
      'admin@example.com',
      'System Administrator',
      now(),
      now()
    );

    -- Create admin authorization
    INSERT INTO authorizations (
      user_id,
      role,
      permissions
    ) VALUES (
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
    -- Update existing admin's authorization
    INSERT INTO authorizations (
      user_id,
      role,
      permissions
    ) VALUES (
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

    RAISE NOTICE 'Admin authorization updated successfully';
  END IF;
END $$;