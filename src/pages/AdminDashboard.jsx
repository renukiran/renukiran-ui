import React, { useState, useEffect } from 'react';

const iconBg = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-50 text-green-700',
  yellow: 'bg-yellow-50 text-yellow-700',
  red: 'bg-red-50 text-red-700',
};

const trendClass = { up: 'text-green-600', down: 'text-red-600', flat: 'text-gray-500' };

const statusBadgeMap = {
  New: 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-yellow-100 text-yellow-800',
  Selected: 'bg-green-100 text-green-700',
  Assigned: 'bg-indigo-100 text-indigo-700',
  Rejected: 'bg-red-100 text-red-700',
};

const capacityBarColor = (pct) => {
  if (pct >= 95) return 'bg-red-500';
  if (pct >= 80) return 'bg-yellow-400';
  return 'bg-green-500';
};

const AdminDashboard = () => {
  const [operationalStats] = useState([
    { label: 'Total Courses', value: '8', trend: '+2 this quarter', trendDir: 'up', iconColor: 'blue' },
    { label: 'Active Batches', value: '5', trend: 'Across 4 courses', trendDir: 'flat', iconColor: 'blue' },
    { label: 'Candidates Enrolled', value: '142', trend: '+18 this month', trendDir: 'up', iconColor: 'green' },
    { label: 'Pending Assignments', value: '23', trend: 'Needs attention', trendDir: 'down', iconColor: 'yellow' },
  ]);

  const [impactStats] = useState([
    { label: 'Assessment Pass Rate', value: '78%', trend: '+5% from last batch', trendDir: 'up', iconColor: 'green', valueClass: 'text-green-600' },
    { label: 'Placement Rate', value: '62%', trend: 'Target: 70%', trendDir: 'flat', iconColor: 'yellow', valueClass: 'text-yellow-600' },
    { label: 'Job Retention', value: '85%', trend: '6-month retention', trendDir: 'up', iconColor: 'green', valueClass: 'text-green-600' },
    { label: 'Avg Attendance', value: '88%', trend: 'Above 80% target', trendDir: 'up', iconColor: 'green', valueClass: 'text-green-600' },
  ]);

  const [recentApplications] = useState([
    { name: 'Priya Sharma', course: 'Stitching Basic', status: 'New', date: '10 Mar 2026' },
    { name: 'Anita Devi', course: 'Computer Fundamentals', status: 'New', date: '10 Mar 2026' },
    { name: 'Meena Kumari', course: 'Beauty Basic', status: 'Under Review', date: '9 Mar 2026' },
    { name: 'Sunita Yadav', course: 'Stitching Basic', status: 'Selected', date: '8 Mar 2026' },
    { name: 'Rekha Patel', course: 'Computer Fundamentals', status: 'Assigned', date: '7 Mar 2026' },
  ]);

  const [batchCapacity] = useState([
    { name: 'Stitching Basic — Batch 3', enrolled: 18, max: 20 },
    { name: 'Computer Fund. — Batch 2', enrolled: 20, max: 20 },
    { name: 'Beauty Basic — Batch 1', enrolled: 12, max: 20 },
  ]);

  const [attendanceAlerts] = useState([
    { name: 'Kavita Singh', batch: 'Stitching Basic — Batch 3', pct: 62 },
    { name: 'Deepa Rani', batch: 'Computer Fund. — Batch 2', pct: 68 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        // const data = await dashboardAPI.getAdminStats();
        // populate state from data...
        console.log('Fetching admin dashboard data...');
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500 text-sm">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, Vijaya. Here's your operational overview.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Operational Stats */}
      <div className="grid grid-cols-4 gap-4">
        {operationalStats.map((s, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-3 ${iconBg[s.iconColor]}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className={`text-xs mt-1 ${trendClass[s.trendDir]}`}>{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-4 gap-4">
        {impactStats.map((s, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-3 ${iconBg[s.iconColor]}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.valueClass}`}>{s.value}</p>
            <p className={`text-xs mt-1 ${trendClass[s.trendDir]}`}>{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Recent Applications</h2>
          <button className="text-sm text-blue-700 hover:underline font-medium">View all</button>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Course', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((a, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.course}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadgeMap[a.status] || 'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-5">
        {/* Batch Capacity */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Batch Capacity</h3>
          <div className="space-y-4">
            {batchCapacity.map((b, i) => {
              const pct = Math.round((b.enrolled / b.max) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-800">{b.name}</span>
                    <span className="text-gray-500">{b.enrolled}/{b.max}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${capacityBarColor(pct)}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Attendance Alerts</h3>
          <div className="space-y-3">
            {attendanceAlerts.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 flex-shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.batch}</p>
                </div>
                <span className="text-sm font-bold text-red-600">{a.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
