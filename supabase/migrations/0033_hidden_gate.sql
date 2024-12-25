-- Drop problematic policies
DROP POLICY IF EXISTS "Anyone can register as shipping supplier" ON shipping_suppliers;
DROP POLICY IF EXISTS "Shipping suppliers can view own profile" ON shipping_suppliers;
DROP POLICY IF EXISTS "Shipping suppliers can update own profile" ON shipping_suppliers;
DROP POLICY IF EXISTS "Admins can manage shipping suppliers" ON shipping_suppliers;

-- Create simplified policies that avoid recursion
CREATE POLICY "Enable insert for authenticated users" 
  ON shipping_suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for own records"
  ON shipping_suppliers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable update for own records"
  ON shipping_suppliers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add admin policy without recursion
CREATE POLICY "Enable all access for admin users"
  ON shipping_suppliers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorizations
      WHERE authorizations.user_id = auth.uid()
      AND authorizations.role = 'admin'
    )
  );

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_shipping_suppliers_user_id
  ON shipping_suppliers(user_id);