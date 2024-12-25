import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, History, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navigation() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/products" className="flex items-center text-xl font-bold text-gray-900">
              Industrial Market
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/products"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <ShoppingCart className="w-5 h-5 mr-1" />
              Products
            </Link>
            <Link
              to="/history"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <History className="w-5 h-5 mr-1" />
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