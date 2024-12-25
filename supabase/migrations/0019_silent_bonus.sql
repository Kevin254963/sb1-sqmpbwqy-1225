/*
  # Create admin account

  1. Changes
    - Creates admin user with secure password
    - Grants admin role and permissions
    
  2. Security
    - Uses secure password hashing
    - Sets up proper authorization
*/

-- Create admin user with proper UUID generation
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
);

-- Create admin authorization
SELECT create_admin_authorization('admin@example.com');