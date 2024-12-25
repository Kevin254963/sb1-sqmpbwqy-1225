/*
  # Fix Authorization Policies and Functions

  1. Changes
    - Remove problematic policies
    - Add proper security policies
    - Fix function security settings
    
  2. Security
    - Recreate functions with SECURITY DEFINER
    - Update policies for proper access control
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all authorizations" ON authorizations;
DROP POLICY IF EXISTS "Users can view own authorization" ON authorizations;

-- Create new policies with proper role checks
CREATE POLICY "Anyone can read own authorization"
  ON authorizations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service account can manage authorizations"
  ON authorizations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_authorizations_user_id
  ON authorizations(user_id);

-- Recreate functions with SECURITY DEFINER
CREATE OR REPLACE FUNCTION handle_new_user_authorization()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO authorizations (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION handle_new_supplier_authorization()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE authorizations
  SET role = 'supplier',
      permissions = jsonb_build_object(
        'manage_products', true,
        'view_inquiries', true
      )
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION create_admin_authorization(admin_email text)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
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
$$;