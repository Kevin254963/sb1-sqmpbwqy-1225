/*
  # Fix Missing Authorizations Table

  1. New Tables
    - `authorizations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (text, with role validation)
      - `permissions` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for user access
    - Add policies for admin access

  3. Functions
    - Add trigger for new user authorization
    - Add function to handle role updates
*/

-- Create authorizations table if it doesn't exist
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
ALTER TABLE authorizations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own authorization"
  ON authorizations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all authorizations"
  ON authorizations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to handle authorization updates
CREATE OR REPLACE FUNCTION handle_auth_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_authorizations_updated_at
  BEFORE UPDATE ON authorizations
  FOR EACH ROW
  EXECUTE FUNCTION handle_auth_updated_at();

-- Function to create default user authorization
CREATE OR REPLACE FUNCTION handle_new_user_authorization()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO authorizations (user_id, role, permissions)
  VALUES (NEW.id, 'user', '{}')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to create authorization on user signup
CREATE TRIGGER on_auth_user_created_authorization
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_authorization();

-- Backfill existing users with authorizations
DO $$ 
BEGIN
  INSERT INTO authorizations (user_id, role, permissions)
  SELECT 
    id,
    'user',
    '{}'::jsonb
  FROM auth.users
  WHERE id NOT IN (SELECT user_id FROM authorizations)
  ON CONFLICT DO NOTHING;
END $$;