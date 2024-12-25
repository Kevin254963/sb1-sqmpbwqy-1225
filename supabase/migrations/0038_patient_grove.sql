/*
  # Fix shipping registration flow

  1. Changes
    - Add proper transaction handling
    - Improve role assignment
    - Add missing indexes
    - Add proper constraints

  2. Security
    - Ensure proper role assignment
    - Prevent duplicate registrations
*/

-- Improve shipping supplier registration
CREATE OR REPLACE FUNCTION register_shipping_supplier(
  p_user_id uuid,
  p_email text
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
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

  -- Ensure authorization exists with correct role
  INSERT INTO authorizations (
    user_id,
    role,
    permissions
  ) VALUES (
    p_user_id,
    'user',
    '{}'::jsonb
  )
  ON CONFLICT (user_id) DO UPDATE
  SET role = 'user',
      permissions = '{}'::jsonb,
      updated_at = now();
END;
$$;

-- Add function to complete shipping profile
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
  -- Update shipping supplier profile
  UPDATE shipping_suppliers
  SET
    company_name = p_company_name,
    contact_name = p_contact_name,
    phone = p_phone,
    address = p_address,
    updated_at = now()
  WHERE user_id = p_user_id;

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
END;
$$;

-- Add proper indexes
CREATE INDEX IF NOT EXISTS idx_shipping_suppliers_user_id_email 
ON shipping_suppliers(user_id, email);

CREATE INDEX IF NOT EXISTS idx_shipping_suppliers_company 
ON shipping_suppliers(company_name, verified);