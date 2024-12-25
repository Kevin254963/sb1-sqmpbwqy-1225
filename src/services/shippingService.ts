import { supabase, supabaseQuery } from '../lib/supabase';
import { handleAuthError } from '../utils/errorHandlers';
import type { ShippingRegistrationData, ProfileCompletionData } from '../types/shipping';

export async function registerShippingSupplier(data: ShippingRegistrationData) {
  try {
    // First check if user exists
    const { data: existingUser } = await supabase
      .from('shipping_suppliers')
      .select('id')
      .eq('email', data.email)
      .maybeSingle();

    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    // Create auth user with retries
    const { data: authData, error: signUpError } = await supabaseQuery(
      () => supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/shipping/complete-profile`
        }
      }),
      3 // max retries
    );

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('Registration failed');

    // Register shipping supplier using RPC function with retries
    const { error: rpcError } = await supabaseQuery(
      () => supabase.rpc('register_shipping_supplier', {
        p_user_id: authData.user.id,
        p_email: data.email
      }),
      3
    );

    if (rpcError) {
      // Clean up on error
      await supabase.auth.signOut();
      throw rpcError;
    }

    return authData.user;
  } catch (error) {
    // Clean up and rethrow with proper error handling
    await supabase.auth.signOut();
    throw handleAuthError(error);
  }
}