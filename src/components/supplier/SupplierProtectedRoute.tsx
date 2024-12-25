import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupplier } from '../../hooks/useSupplier';
import LoadingSpinner from '../LoadingSpinner';

interface SupplierProtectedRouteProps {
  children: React.ReactNode;
}

export default function SupplierProtectedRoute({ children }: SupplierProtectedRouteProps) {
  const { supplier, loading } = useSupplier();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!supplier) {
    return <Navigate to="/supplier/login" replace />;
  }

  return <>{children}</>;
}