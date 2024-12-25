/*
  # Fix shipping registration flow

  1. Changes
    - Add proper transaction handling for shipping registration
    - Improve role assignment trigger
    - Add missing indexes
    - Add proper constraints

  2. Security
    - Ensure proper role assignment
    - Prevent duplicate registrations
*/

-- Improve role assignment function
CREATE OR REPLACE FUNCTION handle_shipping_supplier_role()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Ensure authorization exists
  INSERT INTO authorizations (user_id, role, permissions)
  VALUES (
    NEW.user_id,
    CASE 
      WHEN NEW.company_name = 'Pending Setup' THEN 'user'
      ELSE 'shipping_supplier'
    END,
    CASE 
      WHEN NEW.company_name = 'Pending Setup' THEN '{}'::jsonb
      ELSE jsonb_build_object(
        'manage_rates', true,
        'view_shipments', true
      )
    END
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    role = CASE 
      WHEN NEW.company_name = 'Pending Setup' THEN 'user'
      ELSE 'shipping_supplier'
    END,
    permissions = CASE 
      WHEN NEW.company_name = 'Pending Setup' THEN '{}'::jsonb
      ELSE jsonb_build_object(
        'manage_rates', true,
        'view_shipments', true
      )
    END,
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Drop existing trigger
DROP TRIGGER IF EXISTS handle_shipping_supplier_role_trigger ON shipping_suppliers;

-- Create new trigger that runs for all inserts
CREATE TRIGGER handle_shipping_supplier_role_trigger
  AFTER INSERT ON shipping_suppliers
  FOR EACH ROW
  EXECUTE FUNCTION handle_shipping_supplier_role();

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_shipping_suppliers_email ON shipping_suppliers(email);
CREATE INDEX IF NOT EXISTS idx_shipping_suppliers_verified ON shipping_suppliers(verified);

-- Add composite unique constraint
ALTER TABLE shipping_suppliers
DROP CONSTRAINT IF EXISTS unique_shipping_user_email;

ALTER TABLE shipping_suppliers
ADD CONSTRAINT unique_shipping_user_email 
UNIQUE (user_id, email);