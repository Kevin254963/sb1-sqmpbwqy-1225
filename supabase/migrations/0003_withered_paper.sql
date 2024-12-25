/*
  # Add zip code to profiles

  1. Changes
    - Add `zip_code` column to profiles table
    - Update profile completion check to include zip_code
*/

ALTER TABLE profiles
ADD COLUMN zip_code text;