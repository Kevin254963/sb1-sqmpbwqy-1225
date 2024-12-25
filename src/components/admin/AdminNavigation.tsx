import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Users, Store, LogOut, CheckSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path) ? 'text-blue-600' : 'text-gray-600';
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/admin/dashboard" className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Admin Portal
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/dashboard/verifications"
              className={`hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('verifications')}`}
            >
              <CheckSquare className="w-5 h-5 mr-1" />
              Verifications
            </Link>
            <Link
              to="/admin/dashboard/users"
              className={`hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('users')}`}
            >
              <Users className="w-5 h-5 mr-1" />
              Users
            </Link>
            <Link
              to="/admin/dashboard/suppliers"
              className={`hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('suppliers')}`}
            >
              <Store className="w-5 h-5 mr-1" />
              Suppliers
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