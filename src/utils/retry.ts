export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      
      // Don't retry if it's not a retryable error
      if (!isRetryableError(lastError)) {
        throw lastError;
      }
      
      // Wait before retrying with exponential backoff
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}

function isRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase();
  
  // Don't retry auth errors or validation errors
  if (message.includes('already exists') || 
      message.includes('invalid') ||
      message.includes('required')) {
    return false;
  }

  return (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('connection') ||
    message.includes('database error saving') ||
    message.includes('unexpected_failure') ||
    message.includes('too many requests')
  );
}