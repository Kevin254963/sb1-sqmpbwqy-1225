import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import AuthForm from './AuthForm';
import ProfileForm from './ProfileForm';
import LoadingSpinner from './LoadingSpinner';

export default function SignupFlow() {
  const [step, setStep] = useState<'auth' | 'profile'>('auth');
  const navigate = useNavigate();
  const { loading, reloadProfile } = useProfile();

  const handleSignupComplete = async () => {
    await reloadProfile();
    setStep('profile');
  };

  const handleProfileComplete = () => {
    navigate('/products');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'auth' ? (
        <AuthForm type="signup" onComplete={handleSignupComplete} />
      ) : (
        <div className="py-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
              Complete Your Profile
            </h2>
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <ProfileForm onComplete={handleProfileComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}