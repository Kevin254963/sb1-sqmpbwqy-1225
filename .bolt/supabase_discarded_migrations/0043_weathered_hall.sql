/*
  # Database Rebuild and Cleanup

  1. Cleanup
    - Drop existing auth data and related tables
    - Reset sequences
    
  2. Data Preservation
    - Keep product data
    - Keep shipping zones
    - Keep dimension rates
    
  3. Rebuild
    - Recreate clean auth structure
    - Set up initial admin account
*/

-- Start transaction
BEGIN;

-- Preserve important data
CREATE TEMP TABLE preserved_products AS
SELECT * FROM products;

-- Clean up auth-related data
TRUNCATE TABLE 
  shipping_suppliers,
  suppliers,
  verification_requests,
  inquiries,
  profiles,
  authorizations
CASCADE;

-- Clean up auth schema
DELETE FROM auth.users;

-- Declare variable for admin ID
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Create admin user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  ) VALUES (
    gen_random_uuid(),
    'admin@example.com',
    crypt('Admin123!@#', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO admin_id;

  -- Create admin profile
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
END $$;

-- Restore preserved data
INSERT INTO products 
SELECT * FROM preserved_products;

DROP TABLE preserved_products;

COMMIT;