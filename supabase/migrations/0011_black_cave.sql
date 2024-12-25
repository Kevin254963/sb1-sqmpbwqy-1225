/*
  # Add supplier authorization system

  1. Changes
    - Add admin_users table for managing supplier approvals
    - Add verification request table for tracking supplier verification status
    - Add policies for admin access
    - Add functions for supplier verification workflow

  2. Security
    - Enable RLS on all new tables
    - Add policies for admin access
    - Add policies for supplier access to verification status
*/

-- Create admin_users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create verification_requests table
CREATE TABLE verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  submitted_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  processed_by uuid REFERENCES admin_users,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can do everything"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage verification requests"
  ON verification_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Supplier policies for verification requests
CREATE POLICY "Suppliers can view own verification requests"
  ON verification_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM suppliers
      WHERE suppliers.id = verification_requests.supplier_id
      AND suppliers.user_id = auth.uid()
    )
  );

-- Function to create verification request on supplier creation
CREATE OR REPLACE FUNCTION create_verification_request()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO verification_requests (supplier_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create verification request
CREATE TRIGGER on_supplier_created
  AFTER INSERT ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION create_verification_request();

-- Function to update supplier verification status
CREATE OR REPLACE FUNCTION process_verification_request(
  request_id uuid,
  new_status text,
  notes text
)
RETURNS void AS $$
BEGIN
  -- Update verification request
  UPDATE verification_requests
  SET 
    status = new_status,
    admin_notes = notes,
    processed_at = now(),
    processed_by = auth.uid()
  WHERE id = request_id;

  -- Update supplier verified status
  UPDATE suppliers
  SET verified = (new_status = 'approved')
  WHERE id = (
    SELECT supplier_id 
    FROM verification_requests 
    WHERE id = request_id
  );
END;
$$ LANGUAGE plpgsql;