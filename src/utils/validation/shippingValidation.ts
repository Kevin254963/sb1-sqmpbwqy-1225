import type { ShippingRegistrationData, ProfileCompletionData } from '../../types/shipping';

export function validateShippingRegistration(data: ShippingRegistrationData): string | null {
  if (!data.email || !data.email.includes('@')) {
    return 'Please enter a valid email address';
  }

  if (!data.password) {
    return 'Password is required';
  }

  return null;
}

export function validateProfileCompletion(data: ProfileCompletionData): string | null {
  if (!data.company_name || data.company_name.trim().length < 2) {
    return 'Company name is required';
  }

  if (!data.contact_name || data.contact_name.trim().length < 2) {
    return 'Contact name is required';
  }

  if (!data.phone || !/^\(\d{3}\)\d{3}-\d{4}$/.test(data.phone)) {
    return 'Please enter a valid phone number';
  }

  if (!data.address || data.address.trim().length < 5) {
    return 'Please enter a valid address';
  }

  return null;
}