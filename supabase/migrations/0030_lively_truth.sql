/*
  # Shipping Supplier System

  1. New Tables
    - `shipping_suppliers`
      - Basic supplier information
      - Contact details
      - Service areas
    - `shipping_rates`
      - Zone-based pricing
      - Weight/dimension based rates
      - Special handling fees
    
  2. Security
    - Enable RLS on all tables
    - Add policies for shipping suppliers
*/

-- Create shipping suppliers table
CREATE TABLE shipping_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  service_areas text[] NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_shipping_user UNIQUE (user_id)
);

-- Create shipping rates table
CREATE TABLE shipping_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES shipping_suppliers NOT NULL,
  zone_name text NOT NULL,
  zip_start text NOT NULL,
  zip_end text NOT NULL,
  base_rate numeric NOT NULL CHECK (base_rate >= 0),
  per_kg_rate numeric NOT NULL CHECK (per_kg_rate >= 0),
  dimension_factor numeric NOT NULL CHECK (dimension_factor >= 0),
  min_charge numeric NOT NULL CHECK (min_charge >= 0),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_zip_range CHECK (zip_start <= zip_end)
);

-- Enable RLS
ALTER TABLE shipping_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;

-- Policies for shipping suppliers
CREATE POLICY "Shipping suppliers can view own profile"
  ON shipping_suppliers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Shipping suppliers can update own profile"
  ON shipping_suppliers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for shipping rates
CREATE POLICY "Anyone can view active shipping rates"
  ON shipping_rates
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Shipping suppliers can manage own rates"
  ON shipping_rates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shipping_suppliers
      WHERE shipping_suppliers.id = shipping_rates.supplier_id
      AND shipping_suppliers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shipping_suppliers
      WHERE shipping_suppliers.id = shipping_rates.supplier_id
      AND shipping_suppliers.user_id = auth.uid()
    )
  );

-- Add shipping supplier role handling
CREATE OR REPLACE FUNCTION handle_new_shipping_supplier()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE authorizations
  SET role = 'shipping_supplier',
      permissions = jsonb_build_object(
        'manage_rates', true,
        'view_shipments', true
      )
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for shipping supplier role
CREATE TRIGGER on_shipping_supplier_created
  AFTER INSERT ON shipping_suppliers
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_shipping_supplier();

-- Add timestamp handling
CREATE TRIGGER update_shipping_supplier_timestamp
  BEFORE UPDATE ON shipping_suppliers
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_shipping_rate_timestamp
  BEFORE UPDATE ON shipping_rates
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();