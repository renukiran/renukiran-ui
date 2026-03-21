import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [stats, setStats] = useState([
    { label: 'Total Applications', value: '24' },
    { label: 'Active Batches', value: '2' },
    { label: 'Placements This Month', value: '8' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        // Placeholder for API call to fetch dashboard stats
        console.log('Fetching dashboard stats...');
        // const response = await dashboardAPI.getStats();
        // setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, Sunita Patel! Here's your activity overview.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading stats...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
