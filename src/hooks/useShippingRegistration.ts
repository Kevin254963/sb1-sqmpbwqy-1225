import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerShippingSupplier } from '../services/shippingService';
import { validateShippingRegistration } from '../utils/validation/shippingValidation';
import { handleAuthError } from '../utils/errorHandlers';
import type { ShippingRegistrationData } from '../types/shipping';

const initialFormData: ShippingRegistrationData = {
  email: '',
  password: ''
};

export function useShippingRegistration(onSuccess: () => void) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ShippingRegistrationData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const validationError = validateShippingRegistration(formData);
      if (validationError) {
        setError(validationError);
        return;
      }

      await registerShippingSupplier(formData);

      navigate('/shipping/complete-profile', {
        replace: true,
        state: { message: 'Registration successful! Please complete your profile.' }
      });
      
      onSuccess();
    } catch (err) {
      console.error('Registration error:', err);
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ShippingRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user makes changes
  };

  return {
    formData,
    loading,
    error,
    handleSubmit,
    handleChange
  };
}