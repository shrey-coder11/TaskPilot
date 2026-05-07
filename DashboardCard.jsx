import React from 'react';

const DashboardCard = ({ title, count, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${colorClasses[color]} rounded-full p-3 mr-4`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{count}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
