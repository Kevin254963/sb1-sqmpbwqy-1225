/*
  # Fix shipping registration policies

  1. Changes
    - Drop existing restrictive policies
    - Add new policies to allow registration
    - Add policy for admin access
  
  2. Security
    - Enable RLS
    - Add proper policies for registration and management
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow shipping supplier registration" ON shipping_suppliers;
DROP POLICY IF EXISTS "Shipping suppliers can view own profile" ON shipping_suppliers;
DROP POLICY IF EXISTS "Shipping suppliers can update own profile" ON shipping_suppliers;

-- Create new policies with proper access control
CREATE POLICY "Anyone can register as shipping supplier"
  ON shipping_suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Ensure user doesn't already have a shipping supplier profile
    NOT EXISTS (
      SELECT 1 FROM shipping_suppliers
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shipping suppliers can view own profile"
  ON shipping_suppliers
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM authorizations
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Shipping suppliers can update own profile"
  ON shipping_suppliers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add admin access policy
CREATE POLICY "Admins can manage shipping suppliers"
  ON shipping_suppliers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorizations
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );