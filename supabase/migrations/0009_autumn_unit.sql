/*
  # Add customer information to inquiries

  1. Changes
    - Add customer_name and customer_email columns to inquiries table
    - Handle existing data by populating from profiles table
    - Set columns as NOT NULL after data migration

  2. Security
    - No changes to existing RLS policies needed
*/

-- First add the columns without NOT NULL constraint
ALTER TABLE inquiries 
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_email text;

-- Update any existing rows with default values
DO $$ 
BEGIN
  UPDATE inquiries i
  SET 
    customer_name = COALESCE(p.full_name, 'Unknown Customer'),
    customer_email = COALESCE(p.email, 'no-email@example.com')
  FROM profiles p
  WHERE i.user_id = p.id
  AND (i.customer_name IS NULL OR i.customer_email IS NULL);
END $$;

-- Now add NOT NULL constraints
ALTER TABLE inquiries 
ALTER COLUMN customer_name SET NOT NULL,
ALTER COLUMN customer_email SET NOT NULL;