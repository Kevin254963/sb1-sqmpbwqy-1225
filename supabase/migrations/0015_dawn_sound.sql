-- Add function to handle supplier role assignment
CREATE OR REPLACE FUNCTION handle_new_supplier_authorization()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's authorization to supplier role
  UPDATE authorizations
  SET role = 'supplier',
      permissions = jsonb_build_object(
        'manage_products', true,
        'view_inquiries', true
      )
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for supplier role assignment
CREATE TRIGGER on_supplier_created_authorization
  AFTER INSERT ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_supplier_authorization();

-- Add policy for supplier registration
CREATE POLICY "Allow supplier registration"
  ON suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorizations
      WHERE user_id = auth.uid()
      AND role = 'user'
    )
  );