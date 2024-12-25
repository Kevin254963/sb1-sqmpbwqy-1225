/*
  # Fix shipping registration and profile completion

  1. Changes
    - Add proper constraints for shipping suppliers
    - Improve RLS policies
    - Add validation functions
    - Fix authorization handling

  2. Security
    - Enable RLS
    - Add proper policies for profile management
*/

-- Add constraints to shipping_suppliers
ALTER TABLE shipping_suppliers
ADD CONSTRAINT valid_phone_format 
  CHECK (phone ~ '^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$' OR phone = 'Pending'),
ADD CONSTRAINT valid_email_format
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON shipping_suppliers;
DROP POLICY IF EXISTS "Enable read access for own records" ON shipping_suppliers;
DROP POLICY IF EXISTS "Enable update for own records" ON shipping_suppliers;
DROP POLICY IF EXISTS "Enable all access for admin users" ON shipping_suppliers;

-- Create new policies
CREATE POLICY "Allow new shipping supplier registration"
  ON shipping_suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    NOT EXISTS (
      SELECT 1 FROM shipping_suppliers
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Allow shipping suppliers to view own profile"
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

CREATE POLICY "Allow shipping suppliers to update own profile"
  ON shipping_suppliers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to validate shipping supplier data
CREATE OR REPLACE FUNCTION validate_shipping_supplier()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate required fields when not in pending state
  IF NEW.company_name != 'Pending Setup' THEN
    IF length(trim(NEW.company_name)) < 2 THEN
      RAISE EXCEPTION 'Company name is too short';
    END IF;
    
    IF length(trim(NEW.contact_name)) < 2 THEN
      RAISE EXCEPTION 'Contact name is too short';
    END IF;
    
    IF NEW.phone = 'Pending' THEN
      RAISE EXCEPTION 'Phone number is required';
    END IF;
    
    IF length(trim(NEW.address)) < 5 THEN
      RAISE EXCEPTION 'Address is too short';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_shipping_supplier_trigger ON shipping_suppliers;
CREATE TRIGGER validate_shipping_supplier_trigger
  BEFORE INSERT OR UPDATE ON shipping_suppliers
  FOR EACH ROW
  EXECUTE FUNCTION validate_shipping_supplier();

-- Function to handle shipping supplier role
CREATE OR REPLACE FUNCTION handle_shipping_supplier_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Update authorization role
  UPDATE authorizations
  SET role = 'shipping_supplier',
      permissions = jsonb_build_object(
        'manage_rates', true,
        'view_shipments', true
      ),
      updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role management
DROP TRIGGER IF EXISTS handle_shipping_supplier_role_trigger ON shipping_suppliers;
CREATE TRIGGER handle_shipping_supplier_role_trigger
  AFTER INSERT OR UPDATE ON shipping_suppliers
  FOR EACH ROW
  WHEN (NEW.company_name != 'Pending Setup')
  EXECUTE FUNCTION handle_shipping_supplier_role();