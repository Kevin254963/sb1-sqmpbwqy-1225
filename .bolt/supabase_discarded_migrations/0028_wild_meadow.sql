-- Create or update admin user with proper credentials
DO $$ 
DECLARE
  admin_id uuid;
  existing_admin_id uuid;
  existing_profile_id uuid;
BEGIN
  -- First check if admin user exists
  SELECT id INTO existing_admin_id
  FROM auth.users
  WHERE email = 'admin@example.com';

  -- Check for existing profile
  SELECT id INTO existing_profile_id
  FROM profiles
  WHERE email = 'admin@example.com';

  -- If admin exists, clean up related records first
  IF existing_admin_id IS NOT NULL THEN
    DELETE FROM authorizations WHERE user_id = existing_admin_id;
    DELETE FROM auth.users WHERE id = existing_admin_id;
  END IF;

  -- If profile exists, delete it
  IF existing_profile_id IS NOT NULL THEN
    DELETE FROM profiles WHERE id = existing_profile_id;
  END IF;

  -- Create new admin user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('Admin123!@#', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO admin_id;

  -- Create profile with explicit check
  INSERT INTO profiles (id, email, full_name)
  VALUES (admin_id, 'admin@example.com', 'System Administrator')
  ON CONFLICT (id) DO UPDATE 
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name;

  -- Create admin authorization
  INSERT INTO authorizations (user_id, role, permissions)
  VALUES (
    admin_id,
    'admin',
    jsonb_build_object(
      'manage_verifications', true,
      'manage_users', true,
      'manage_suppliers', true
    )
  )
  ON CONFLICT (user_id) DO UPDATE
  SET role = EXCLUDED.role,
      permissions = EXCLUDED.permissions;

END $$;