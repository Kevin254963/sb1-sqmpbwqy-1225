/*
  # Create Admin Authorization

  This migration:
  1. Creates an admin user authorization
  2. Adds a unique constraint on user_id for authorizations
*/

-- First ensure we have a unique constraint on user_id
ALTER TABLE authorizations 
ADD CONSTRAINT authorizations_user_id_key UNIQUE (user_id);

-- Create admin authorization function
CREATE OR REPLACE FUNCTION create_admin_authorization(admin_email text)
RETURNS void AS $$
BEGIN
  INSERT INTO authorizations (
    user_id,
    role,
    permissions
  )
  SELECT 
    id,
    'admin',
    jsonb_build_object(
      'manage_verifications', true,
      'manage_users', true,
      'manage_suppliers', true
    )
  FROM auth.users
  WHERE email = admin_email
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = 'admin',
    permissions = jsonb_build_object(
      'manage_verifications', true,
      'manage_users', true,
      'manage_suppliers', true
    ),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;