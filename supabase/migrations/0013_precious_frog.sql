/*
  # Add authorization tables and policies

  1. New Tables
    - `authorizations` - Stores user authorization records
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (text) - User role (admin, user, etc)
      - `permissions` (jsonb) - Specific permissions
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on authorizations table
    - Add policies for admins to manage authorizations
    - Add policies for users to read their own authorizations
*/

-- Create authorizations table
CREATE TABLE authorizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL,
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'user', 'supplier'))
);

-- Enable RLS
ALTER TABLE authorizations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own authorization"
  ON authorizations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all authorizations"
  ON authorizations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorizations
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

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
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO authorizations (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create authorization on user signup
CREATE TRIGGER on_auth_user_created_authorization
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_authorization();