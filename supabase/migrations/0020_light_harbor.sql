/*
  # Fix admin authentication and create admin account

  1. Changes
    - Creates admin user with proper authentication
    - Sets up admin authorization
    - Ensures proper role assignment
    
  2. Security
    - Uses secure password hashing
    - Sets up proper authorization
*/

-- Create admin user if not exists
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
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '00000000-0000-0000-0000-000000000000'
    )
    RETURNING id INTO admin_id;
  END IF;

  -- Ensure admin authorization exists
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
END $$;