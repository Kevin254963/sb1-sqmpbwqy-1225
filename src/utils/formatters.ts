export function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Return empty string if no numbers
  if (numbers.length === 0) return '';
  
  // Format number as user types
  if (numbers.length <= 3) {
    return `(${numbers}`;
  }
  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 3)})${numbers.slice(3)}`;
  }
  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 3)})${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }
  
  // Limit to 10 digits
  return `(${numbers.slice(0, 3)})${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
}

export function formatPrice(price: number): string {
  return price.toFixed(2);
}

export function formatHsCode(code: string): string {
  const cleaned = code.replace(/\D/g, '');
  if (cleaned.length <= 4) return cleaned;
  return `${cleaned.slice(0, 4)}.${cleaned.slice(4, 6)}`;
}

export function formatZipCode(value: string): string {
  // Remove all non-numeric characters and limit to 5 digits
  return value.replace(/\D/g, '').slice(0, 5);
}