import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import AdminNavigation from './AdminNavigation';
import VerificationRequests from './VerificationRequests';
import UserManagement from './UserManagement';
import SupplierManagement from './SupplierManagement';
import Overview from './Overview';
import LoadingSpinner from '../LoadingSpinner';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="verifications" replace />} />
          <Route path="verifications" element={<VerificationRequests />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="suppliers" element={<SupplierManagement />} />
          <Route path="overview" element={<Overview />} />
        </Routes>
      </div>
    </div>
  );
}