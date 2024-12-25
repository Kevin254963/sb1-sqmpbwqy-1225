/*
  # Add product validation

  1. Changes
    - Add product validation trigger
    - Add HS code format validation
    - Add price and stock validation

  2. Security
    - Ensure data integrity for products
*/

-- Add product validation trigger
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

  -- Validate HS code format (basic check)
  IF NOT NEW.hs_code ~ '^[0-9]{4}\.[0-9]{2}$' THEN
    RAISE EXCEPTION 'Invalid HS code format. Must be in format: XXXX.XX';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_product_trigger ON products;

-- Create new trigger
CREATE TRIGGER validate_product_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION validate_product();