import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import ProfileForm from './ProfileForm';
import LoadingSpinner from './LoadingSpinner';

export default function CompleteProfile() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-md max-w-md w-full">
          <h3 className="text-lg font-medium mb-2">Error Loading Profile</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // If profile is already complete, redirect to products
  if (profile?.full_name && profile?.company_name && profile?.zip_code) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
            Complete Your Profile
          </h2>
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mb-4 text-sm text-gray-600">
              Please complete your profile information to continue.
            </div>
            <ProfileForm initialData={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}