import React from 'react';
import { useStats } from '../../hooks/useStats';
import AdminStats from './Dashboard/AdminStats';
import LoadingSpinner from '../LoadingSpinner';

export default function Overview() {
  const { stats, loading, error } = useStats();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-lg">
        Error loading dashboard data: {error}
      </div>
    );
  }

  return (
    <div>
      <AdminStats stats={stats} />
      {/* Add more overview components here */}
    </div>
  );
}