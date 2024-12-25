export function handleAuthError(error: unknown): string {
  if (!error) return 'An unknown error occurred';

  const err = error as { message?: string; code?: string };
  
  switch (err.code) {
    case 'user_already_exists':
      return 'An account with this email already exists. Please sign in instead.';
    case 'invalid_credentials':
      return 'Invalid email or password';
    case 'unexpected_failure':
      return 'Registration failed. Please try again in a few moments.';
    case '23505': // unique violation
      return 'An account with this email already exists';
    case 'PGRST301':
      return 'Service temporarily unavailable. Please try again.';
    default:
      if (err.message?.includes('Database error saving')) {
        return 'Registration service is temporarily unavailable. Please try again in a few moments.';
      }
      return err.message || 'An error occurred during authentication';
  }
}

export function handleDatabaseError(error: unknown): string {
  if (!error) return 'An unknown error occurred';
  
  const err = error as { message?: string; code?: string };
  
  switch (err.code) {
    case '23505': // unique_violation
      return 'This record already exists';
    case '23503': // foreign_key_violation
      return 'Invalid reference to another record';
    case 'PGRST301':
      return 'Database connection error. Please try again.';
    default:
      return err.message || 'A database error occurred';
  }
}