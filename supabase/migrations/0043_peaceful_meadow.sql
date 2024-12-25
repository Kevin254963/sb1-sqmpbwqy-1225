-- First clean up existing auth-related data in the correct order
DELETE FROM verification_requests;  -- Delete child records first
DELETE FROM authorizations;
DELETE FROM shipping_suppliers;
DELETE FROM suppliers;
DELETE FROM profiles;

-- Recreate the profiles table with proper constraints
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text NOT NULL,
  full_name text,
  company_name text,
  phone text,
  zip_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$'),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Recreate authorizations table with proper constraints
CREATE TABLE IF NOT EXISTS authorizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL,
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'user', 'supplier', 'shipping_supplier')),
  CONSTRAINT unique_user_authorization UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorizations ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policies for authorizations
CREATE POLICY "Users can view own authorization"
  ON authorizations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create profile
  INSERT INTO profiles (id, email, created_at)
  VALUES (new.id, new.email, now())
  ON CONFLICT (id) DO NOTHING;
  
  -- Create authorization
  INSERT INTO authorizations (user_id, role)
  VALUES (new.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create admin user
DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- Create admin user if not exists
  INSERT INTO auth.users (
    email,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    instance_id,
    aud,
    confirmation_token
  ) VALUES (
    'admin@example.com',
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    'authenticated',
    crypt('Admin123!@#', gen_salt('bf')),
    now(),
    now(),
    now(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    encode(gen_random_bytes(32), 'hex')
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_id;

  -- Get admin id if already exists
  IF admin_id IS NULL THEN
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@example.com';
  END IF;

  -- Create admin profile
  INSERT INTO profiles (id, email, full_name)
  VALUES (admin_id, 'admin@example.com', 'System Administrator')
  ON CONFLICT (id) DO NOTHING;

  -- Create admin authorization
  INSERT INTO authorizations (user_id, role, permissions)
  VALUES (
    admin_id,
    'admin',
    jsonb_build_object(
      'manage_verifications', true,
      'manage_users', true,
      'manage_suppliers', true
    )
  )
  ON CONFLICT (user_id) DO UPDATE
  SET role = 'admin',
      permissions = jsonb_build_object(
        'manage_verifications', true,
        'manage_users', true,
        'manage_suppliers', true
      );
END $$;