/*
  # Fix HS Code column name

  1. Changes
    - Rename hs_code column to hsCode for consistency
    - Add check constraint for HS code format
*/

-- Rename the column
ALTER TABLE products 
RENAME COLUMN hs_code TO "hsCode";

-- Add check constraint for HS code format
ALTER TABLE products
ADD CONSTRAINT valid_hs_code 
CHECK ("hsCode" ~ '^[0-9]{4}\.[0-9]{2}$');