/*
  # Fix supplier registration policy

  1. Changes
    - Add INSERT policy for suppliers table to allow self-registration
    - Add policy for suppliers to create their own verification requests

  2. Security
    - Maintain RLS security while allowing registration
    - Ensure suppliers can only create their own records
*/

-- Add policy to allow suppliers to register
CREATE POLICY "Suppliers can register themselves"
  ON suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add policy to allow suppliers to create verification requests
CREATE POLICY "Suppliers can create verification requests"
  ON verification_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM suppliers
      WHERE suppliers.id = supplier_id
      AND suppliers.user_id = auth.uid()
    )
  );