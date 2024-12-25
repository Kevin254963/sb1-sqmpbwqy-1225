import React from 'react';
import { Shield, Users, Store } from 'lucide-react';
import type { AdminStats as AdminStatsType } from '../../../types/admin';

interface AdminStatsProps {
  stats: AdminStatsType;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const statItems = [
    { name: 'Pending Verifications', value: stats.pendingVerifications, icon: Shield },
    { name: 'Active Users', value: stats.activeUsers, icon: Users },
    { name: 'Verified Suppliers', value: stats.verifiedSuppliers, icon: Store },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}