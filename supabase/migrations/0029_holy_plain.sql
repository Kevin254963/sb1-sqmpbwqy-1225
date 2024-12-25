/*
  # Update product validation trigger

  1. Changes
    - Update trigger function to use correct hsCode column name
    - Add additional validation for product fields
*/

-- Drop and recreate the validation function with updated column name
CREATE OR REPLACE FUNCTION validate_product()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate price
  IF NEW.price <= 0 THEN
    RAISE EXCEPTION 'Price must be greater than 0';
  END IF;

  -- Validate stock
  IF NEW.stock < 0 THEN
    RAISE EXCEPTION 'Stock cannot be negative';
  END IF;

  -- Validate HS code format
  IF NOT NEW."hsCode" ~ '^[0-9]{4}\.[0-9]{2}$' THEN
    RAISE EXCEPTION 'Invalid HS code format. Must be in format: XXXX.XX';
  END IF;

  -- Validate required fields
  IF length(trim(NEW.name)) = 0 THEN
    RAISE EXCEPTION 'Product name cannot be empty';
  END IF;

  IF length(trim(NEW.description)) = 0 THEN
    RAISE EXCEPTION 'Product description cannot be empty';
  END IF;

  IF length(trim(NEW.dimensions)) = 0 THEN
    RAISE EXCEPTION 'Product dimensions cannot be empty';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;