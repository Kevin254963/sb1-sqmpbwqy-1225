import React from 'react';
import VerificationRequests from '../VerificationRequests';
import UserManagement from '../UserManagement';
import SupplierManagement from '../SupplierManagement';
import Overview from '../Overview';

interface AdminContentProps {
  activeTab: string;
}

export default function AdminContent({ activeTab }: AdminContentProps) {
  switch (activeTab) {
    case 'verifications':
      return <VerificationRequests />;
    case 'users':
      return <UserManagement />;
    case 'suppliers':
      return <SupplierManagement />;
    default:
      return <Overview />;
  }
}