import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Clock, Shield, Store, ShieldCheck, Truck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Main Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            Industrial Materials Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Your trusted source for premium industrial materials. Quick ordering, competitive prices, and reliable delivery.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign up Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <ShoppingBag className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Easy Ordering</h3>
            <p className="text-gray-600">Quick and simple ordering process for all your industrial needs</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Market Prices</h3>
            <p className="text-gray-600">Competitive prices updated regularly to match market trends</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Clock className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick processing and reliable shipping to your location</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-600">Your data and transactions are always protected</p>
          </div>
        </div>
      </div>

      {/* Supplier Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Store className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Are you a Supplier?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our marketplace to reach more customers and grow your business. We provide the platform, you provide the products.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/supplier/register"
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
              >
                <Store className="w-5 h-5 mr-2" />
                Become a Supplier
              </Link>
              <Link
                to="/supplier/login"
                className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold border border-green-600 hover:bg-green-50 transition-colors"
              >
                Supplier Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Partner Section */}
      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Truck className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shipping Partners
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Are you a shipping company? Join our network of trusted shipping partners and expand your business reach.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/shipping/register"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center"
              >
                <Truck className="w-5 h-5 mr-2" />
                Register as Shipping Partner
              </Link>
              <Link
                to="/shipping/login"
                className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold border border-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Partner Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShieldCheck className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Administrator Access
            </h2>
            <p className="text-gray-600 mb-6">
              Access the admin portal to manage suppliers and verify accounts.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <Shield className="w-5 h-5 mr-2" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}