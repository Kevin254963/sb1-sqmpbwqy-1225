-- Ensure authorizations are created for all users
DO $$ 
BEGIN
  -- Create authorizations for users who don't have one
  INSERT INTO authorizations (user_id, role, permissions)
  SELECT 
    users.id,
    'user',
    '{}'::jsonb
  FROM auth.users
  LEFT JOIN authorizations ON users.id = authorizations.user_id
  WHERE authorizations.id IS NULL;

  -- Update shipping suppliers' role
  UPDATE authorizations a
  SET role = 'shipping_supplier'
  FROM shipping_suppliers s
  WHERE s.user_id = a.user_id;

  -- Update suppliers' role
  UPDATE authorizations a
  SET role = 'supplier'
  FROM suppliers s
  WHERE s.user_id = a.user_id;
END $$;

-- Add trigger to ensure authorization always exists
CREATE OR REPLACE FUNCTION ensure_user_authorization()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO authorizations (user_id, role, permissions)
  VALUES (NEW.id, 'user', '{}'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS ensure_user_authorization_trigger ON auth.users;
CREATE TRIGGER ensure_user_authorization_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_authorization();