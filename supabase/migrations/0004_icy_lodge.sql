/*
  # Update phone number format

  1. Changes
    - Add phone number format validation
*/

-- Add check constraint for phone number format
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS phone_format;

ALTER TABLE profiles
ADD CONSTRAINT phone_format
CHECK (
  phone IS NULL OR 
  phone ~ '^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$'
);