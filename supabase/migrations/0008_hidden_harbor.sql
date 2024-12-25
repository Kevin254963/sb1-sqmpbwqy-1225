/*
  # Add customer information to inquiries table

  1. Changes
    - Add customer_name and customer_email columns to inquiries table
    - Set default values to prevent NULL values
    - Add NOT NULL constraints after setting defaults

  2. Security
    - No changes to RLS policies needed
*/

-- First add the columns without NOT NULL constraint
ALTER TABLE inquiries 
ADD COLUMN customer_name text,
ADD COLUMN customer_email text;

-- Update any existing rows with default values
UPDATE inquiries 
SET 
  customer_name = COALESCE(
    (SELECT full_name FROM profiles WHERE profiles.id = inquiries.user_id),
    'Unknown Customer'
  ),
  customer_email = COALESCE(
    (SELECT email FROM profiles WHERE profiles.id = inquiries.user_id),
    'no-email@example.com'
  )
WHERE customer_name IS NULL OR customer_email IS NULL;

-- Now add NOT NULL constraints
ALTER TABLE inquiries 
ALTER COLUMN customer_name SET NOT NULL,
ALTER COLUMN customer_email SET NOT NULL;