/*
  # Add admin authorization

  1. Changes
    - Creates admin authorization for admin@example.com
    - Adds necessary permissions for admin role
*/

-- Create admin authorization if not exists
DO $$ 
BEGIN
  -- Check if admin authorization already exists
  IF NOT EXISTS (
    SELECT 1 FROM authorizations a
    INNER JOIN auth.users u ON u.id = a.user_id
    WHERE u.email = 'admin@example.com' AND a.role = 'admin'
  ) THEN
    -- Create admin authorization
    PERFORM create_admin_authorization('admin@example.com');
  END IF;
END $$;