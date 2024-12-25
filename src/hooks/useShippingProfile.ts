import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseQuery } from '../lib/supabase';
import { validateProfileCompletion } from '../utils/validation/shippingValidation';
import { handleDatabaseError } from '../utils/errorHandlers';
import type { ProfileCompletionData } from '../types/shipping';

export function useShippingProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateProfile = async (data: ProfileCompletionData) => {
    setLoading(true);
    setError('');

    try {
      // Validate data
      const validationError = validateProfileCompletion(data);
      if (validationError) {
        setError(validationError);
        return;
      }

      const { data: { user } } = await supabaseQuery(() => 
        supabase.auth.getUser()
      );
      
      if (!user) throw new Error('Not authenticated');

      // Update shipping supplier profile
      const { error: updateError } = await supabaseQuery(() =>
        supabase
          .from('shipping_suppliers')
          .update({
            company_name: data.company_name.trim(),
            contact_name: data.contact_name.trim(),
            phone: data.phone,
            address: data.address.trim()
          })
          .eq('user_id', user.id)
      );

      if (updateError) throw updateError;

      navigate('/shipping/dashboard', {
        replace: true,
        state: { message: 'Profile completed successfully! Waiting for verification.' }
      });
    } catch (err) {
      console.error('Profile update error:', err);
      setError(handleDatabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateProfile
  };
}