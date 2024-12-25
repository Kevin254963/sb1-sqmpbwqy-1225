import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import LoadingSpinner from './LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'supplier';
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}