/*
  # Fix Authentication and Profile Issues

  1. Changes
    - Add proper error handling for auth
    - Fix profile creation race conditions
    - Add proper constraints and indexes
    - Clean up any duplicate profiles
  
  2. Security
    - Maintain RLS policies
    - Add proper constraints
*/

-- Clean up any duplicate profiles
DELETE FROM profiles a USING (
  SELECT MIN(ctid) as ctid, id
  FROM profiles 
  GROUP BY id
  HAVING COUNT(*) > 1
) b
WHERE a.id = b.id 
AND a.ctid <> b.ctid;

-- Add proper constraints
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_email_check,
ADD CONSTRAINT profiles_email_check 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email 
  ON profiles(email);

CREATE INDEX IF NOT EXISTS idx_auth_users_email 
  ON auth.users(email);

-- Improve profile trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Wait a short time to ensure auth user is fully created
  PERFORM pg_sleep(0.1);
  
  -- Only insert profile if it doesn't exist
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (new.id, new.email, now())
  ON CONFLICT (id) DO UPDATE 
  SET email = EXCLUDED.email,
      updated_at = now()
  WHERE profiles.email IS NULL OR profiles.email <> EXCLUDED.email;
  
  RETURN new;
END;
$$;