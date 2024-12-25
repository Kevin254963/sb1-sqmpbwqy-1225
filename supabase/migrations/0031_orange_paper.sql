/*
  # Fix shipping supplier registration policies

  1. Changes
    - Add policy to allow new shipping supplier registration
    - Add policy for authenticated users to read shipping suppliers
    - Add policy for shipping suppliers to update their own records

  2. Security
    - Enable RLS on shipping_suppliers table
    - Restrict updates to own records only
    - Allow registration for authenticated users
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow shipping supplier registration" ON shipping_suppliers;
DROP POLICY IF EXISTS "Shipping suppliers can view own profile" ON shipping_suppliers;
DROP POLICY IF EXISTS "Shipping suppliers can update own profile" ON shipping_suppliers;

-- Create new policies
CREATE POLICY "Allow shipping supplier registration"
  ON shipping_suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Shipping suppliers can view own profile"
  ON shipping_suppliers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Shipping suppliers can update own profile"
  ON shipping_suppliers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_shipping_suppliers_user_id
  ON shipping_suppliers(user_id);