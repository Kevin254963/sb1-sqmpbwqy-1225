-- Remove service_areas column from shipping_suppliers
ALTER TABLE shipping_suppliers
DROP COLUMN IF EXISTS service_areas;