import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import SignupFlow from './components/SignupFlow';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProductCatalog from './components/ProductCatalog';
import InquiryHistory from './components/InquiryHistory';
import CompleteProfile from './components/CompleteProfile';
import InquiryConfirmation from './components/InquiryConfirmation';
import ProtectedRoute from './components/ProtectedRoute';
import AuthGuard from './components/AuthGuard';
import Unauthorized from './components/Unauthorized';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

// Supplier Components
import SupplierLogin from './components/supplier/SupplierLogin';
import SupplierRegister from './components/supplier/SupplierRegister';
import SupplierDashboard from './components/supplier/SupplierDashboard';
import SupplierProtectedRoute from './components/supplier/SupplierProtectedRoute';

// Shipping Components
import ShippingRegister from './components/shipping/ShippingRegister';
import ShippingLogin from './components/shipping/ShippingLogin';
import ShippingDashboard from './components/shipping/ShippingDashboard';
import ProfileCompletion from './components/shipping/forms/ProfileCompletion';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthForm type="login" />} />
        <Route path="/signup" element={<SignupFlow />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard/*"
          element={
            <AuthGuard requiredRole="admin">
              <AdminDashboard />
            </AuthGuard>
          }
        />

        {/* Supplier Routes */}
        <Route path="/supplier/login" element={<SupplierLogin />} />
        <Route path="/supplier/register" element={<SupplierRegister />} />
        <Route
          path="/supplier/dashboard"
          element={
            <SupplierProtectedRoute>
              <SupplierDashboard />
            </SupplierProtectedRoute>
          }
        />

        {/* Shipping Partner Routes */}
        <Route path="/shipping/register" element={<ShippingRegister />} />
        <Route path="/shipping/login" element={<ShippingLogin />} />
        <Route path="/shipping/complete-profile" element={<ProfileCompletion />} />
        <Route
          path="/shipping/dashboard"
          element={
            <ProtectedRoute>
              <ShippingDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductCatalog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <InquiryHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inquiry-confirmation"
          element={
            <ProtectedRoute>
              <InquiryConfirmation />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}