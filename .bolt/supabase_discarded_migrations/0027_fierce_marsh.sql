/*
  # Create Admin Account

  1. Changes
    - Creates admin user if not exists
    - Sets up admin profile and authorization
    - Handles potential duplicate key issues
  
  2. Security
    - Uses secure password hashing
    - Sets up proper admin permissions
*/

DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- First check if admin user exists
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'admin2@example.com';

  -- If admin doesn't exist, create them
  IF admin_id IS NULL THEN
    -- Create admin user
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
      'admin2@example.com',
      '{"provider":"email","providers":["email"]}',
      '{}',
      false,
      'authenticated',
      crypt('AdminPass456!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      encode(gen_random_bytes(32), 'hex')
    )
    RETURNING id INTO admin_id;

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

    -- The profile will be created automatically by the handle_new_user trigger
    
    RAISE NOTICE 'Admin account created successfully';
  END IF;
END $$;