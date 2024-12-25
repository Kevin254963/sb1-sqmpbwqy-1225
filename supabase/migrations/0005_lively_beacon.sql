/*
  # Add inquiries table

  1. New Tables
    - `inquiries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `items` (jsonb, stores cart items)
      - `total` (numeric, total amount)
      - `message` (text, optional notes)
      - `status` (text, inquiry status)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `inquiries` table
    - Add policies for authenticated users to read and create their own inquiries
*/

CREATE TABLE inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  items jsonb NOT NULL,
  total numeric NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own inquiries"
  ON inquiries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own inquiries"
  ON inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);