/*
  # Add shipping rates tables

  1. New Tables
    - `shipping_zones`
      - `id` (uuid, primary key)
      - `zip_code_start` (text, start of zip code range)
      - `zip_code_end` (text, end of zip code range)
      - `base_rate` (numeric, base shipping rate)
      - `created_at` (timestamp)

    - `dimension_rates`
      - `id` (uuid, primary key) 
      - `min_dimension` (numeric, minimum dimension in inches)
      - `max_dimension` (numeric, maximum dimension in inches)
      - `rate_multiplier` (numeric, multiplier for base rate)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read shipping rates
*/

CREATE TABLE shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zip_code_start text NOT NULL,
  zip_code_end text NOT NULL,
  base_rate numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_zip_range CHECK (zip_code_start <= zip_code_end)
);

CREATE TABLE dimension_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  min_dimension numeric NOT NULL,
  max_dimension numeric NOT NULL,
  rate_multiplier numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dimension_range CHECK (min_dimension <= max_dimension)
);

ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shipping zones"
  ON shipping_zones
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read dimension rates"
  ON dimension_rates
  FOR SELECT
  TO authenticated
  USING (true);