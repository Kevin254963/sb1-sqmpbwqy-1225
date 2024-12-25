import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Package, MessageSquare, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SupplierNavigation() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/supplier/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/supplier/dashboard" className="flex items-center">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Supplier Portal
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/supplier/products"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Package className="w-5 h-5 mr-1" />
              Products
            </Link>
            <Link
              to="/supplier/inquiries"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <MessageSquare className="w-5 h-5 mr-1" />
              Inquiries
            </Link>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}