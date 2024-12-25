export interface ShippingSupplier {
  id: string;
  user_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingRegistrationData {
  email: string;
  password: string;
}

export interface ShippingRate {
  id: string;
  supplier_id: string;
  zone_name: string;
  zip_start: string;
  zip_end: string;
  base_rate: number;
  per_kg_rate: number;
  dimension_factor: number;
  min_charge: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileCompletionData {
  company_name: string;
  contact_name: string;
  phone: string;
  address: string;
}