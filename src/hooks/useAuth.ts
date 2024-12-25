import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { handleAuthError } from '../utils/errorHandlers';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (signUpError) throw signUpError;
      return !!data.user;
    } catch (err) {
      setError(handleAuthError(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Get user's authorization
        const { data: authData, error: authError } = await supabase
          .from('authorizations')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (authError && authError.code !== 'PGRST116') {
          throw authError;
        }

        // Default to 'user' role if no authorization found
        const role = authData?.role || 'user';

        // Redirect based on role
        switch (role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'supplier':
            navigate('/supplier/dashboard');
            break;
          case 'shipping_supplier':
            navigate('/shipping/dashboard');
            break;
          default:
            navigate('/products');
        }
        return true;
      }
      return false;
    } catch (err) {
      setError(handleAuthError(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    signUp: handleSignUp,
    signIn: handleSignIn
  };
}