/*
  # Set up shipping zones and dimension rates

  1. Sample Data
    - Adds shipping zones based on distance from Los Angeles
    - Adds dimension-based rate multipliers
    - Base rates increase with distance from LA (90001)
*/

-- Insert shipping zones (based on distance from LA)
INSERT INTO shipping_zones (zip_code_start, zip_code_end, base_rate) VALUES
  ('90001', '90999', 15.00),  -- LA County
  ('91000', '92999', 20.00),  -- Southern California
  ('93000', '94999', 25.00),  -- Central California
  ('95000', '96999', 30.00),  -- Northern California
  ('97000', '97999', 35.00),  -- Oregon
  ('98000', '99999', 40.00),  -- Washington
  ('00001', '89999', 45.00),  -- East Coast and Central
  ('00000', '99999', 50.00);  -- Catch-all for other areas

-- Insert dimension rates
INSERT INTO dimension_rates (min_dimension, max_dimension, rate_multiplier) VALUES
  (0, 12, 1.0),    -- Small items
  (12, 24, 1.5),   -- Medium items
  (24, 36, 2.0),   -- Large items
  (36, 48, 2.5),   -- Extra large items
  (48, 72, 3.0);   -- Oversized items