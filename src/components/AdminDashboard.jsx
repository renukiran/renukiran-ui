import React, { useState } from 'react';

const OPERATIONAL_STATS = [
  { label: 'Total Courses', value: 8, trend: '+2 this quarter', trendDir: 'up', color: '#2563eb' },
  { label: 'Active Batches', value: 5, trend: 'Across 4 courses', trendDir: 'flat', color: '#2563eb' },
  { label: 'Candidates Enrolled', value: 142, trend: '+18 this month', trendDir: 'up', color: '#16a34a' },
  { label: 'Pending Assignments', value: 23, trend: 'Needs attention', trendDir: 'down', color: '#d97706' },
];

const IMPACT_STATS = [
  { label: 'Assessment Pass Rate', value: '78%', trend: '+5% from last batch', trendDir: 'up', color: '#16a34a' },
  { label: 'Placement Rate', value: '62%', trend: 'Target: 70%', trendDir: 'flat', color: '#d97706' },
  { label: 'Job Retention', value: '85%', trend: '6-month retention', trendDir: 'up', color: '#16a34a' },
  { label: 'Avg Attendance', value: '88%', trend: 'Above 80% target', trendDir: 'up', color: '#16a34a' },
];

const RECENT_APPLICATIONS = [
  { name: 'Priya Sharma', course: 'Stitching Basic', status: 'New', date: '10 Mar 2026' },
  { name: 'Anita Devi', course: 'Computer Fundamentals', status: 'New', date: '10 Mar 2026' },
  { name: 'Meena Kumari', course: 'Beauty Basic', status: 'Under Review', date: '9 Mar 2026' },
  { name: 'Sunita Yadav', course: 'Stitching Basic', status: 'Selected', date: '8 Mar 2026' },
  { name: 'Rekha Patel', course: 'Computer Fundamentals', status: 'Assigned', date: '7 Mar 2026' },
];

const BATCH_CAPACITY = [
  { name: 'Stitching Basic — Batch 3', enrolled: 18, max: 20 },
  { name: 'Computer Fund. — Batch 2', enrolled: 20, max: 20 },
  { name: 'Beauty Basic — Batch 1', enrolled: 12, max: 20 },
];

const ATTENDANCE_ALERTS = [
  { name: 'Kavita Singh', batch: 'Stitching Basic — Batch 3', pct: 62 },
  { name: 'Deepa Rani', batch: 'Computer Fund. — Batch 2', pct: 68 },
];

const getStatusBadgeStyle = (status) => {
  const styles = {
    New: { background: '#dbeafe', color: '#1d4ed8' },
    'Under Review': { background: '#fef3c7', color: '#92400e' },
    Selected: { background: '#dcfce7', color: '#166534' },
    Assigned: { background: '#e0e7ff', color: '#3730a3' },
    Rejected: { background: '#fee2e2', color: '#991b1b' },
  };
  return styles[status] || { background: '#f3f4f6', color: '#374151' };
};

const getTrendColor = (dir) => {
  if (dir === 'up') return '#16a34a';
  if (dir === 'down') return '#dc2626';
  return '#6b7280';
};

const getCapacityBarColor = (pct) => {
  if (pct >= 95) return '#ef4444';
  if (pct >= 80) return '#eab308';
  return '#22c55e';
};

const StatCard = ({ label, value, trend, trendDir, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px 22px',
        borderLeft: `4px solid ${color}`,
        boxShadow: isHovered ? '0 10px 25px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '34px', fontWeight: 700, color, marginBottom: '8px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: getTrendColor(trendDir) }}>{trend}</div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Welcome back, Vijaya. Here's your operational overview.</p>
      </div>

      {/* Operational Stats */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Operational Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {OPERATIONAL_STATS.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} trendDir={stat.trendDir} color={stat.color} />
          ))}
        </div>
      </div>

      {/* Impact Stats */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Impact Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {IMPACT_STATS.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} trendDir={stat.trendDir} color={stat.color} />
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>Recent Applications</h2>
          <a href="#" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', cursor: 'pointer' }}>
            View All →
          </a>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', padding: '12px 0' }}>
                  Name
                </th>
                <th style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', padding: '12px 0' }}>
                  Course
                </th>
                <th style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', padding: '12px 0' }}>
                  Status
                </th>
                <th style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', padding: '12px 0' }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {RECENT_APPLICATIONS.map((app, idx) => {
                const badgeStyle = getStatusBadgeStyle(app.status);
                return (
                  <tr key={idx} style={{ borderBottom: idx < RECENT_APPLICATIONS.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{app.name}</td>
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{app.course}</td>
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>
                      <span
                        style={{
                          background: badgeStyle.background,
                          color: badgeStyle.color,
                          borderRadius: '12px',
                          padding: '3px 10px',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'inline-block',
                        }}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{app.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Batch Capacity */}
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Batch Capacity</h3>
          <div style={{ space: '16px' }}>
            {BATCH_CAPACITY.map((batch, idx) => {
              const pct = Math.round((batch.enrolled / batch.max) * 100);
              return (
                <div key={idx} style={{ marginBottom: idx < BATCH_CAPACITY.length - 1 ? '16px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827' }}>{batch.name}</span>
                    <span style={{ fontSize: '13.5px', color: '#6b7280' }}>
                      {batch.enrolled}/{batch.max}
                    </span>
                  </div>
                  <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        background: getCapacityBarColor(pct),
                        width: `${pct}%`,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Alerts */}
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Attendance Alerts</h3>
          <div>
            {ATTENDANCE_ALERTS.map((alert, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#fef3c7',
                  border: '1px solid #fcd34d',
                  borderRadius: '8px',
                  marginBottom: idx < ATTENDANCE_ALERTS.length - 1 ? '12px' : 0,
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#92400e',
                    fontWeight: 600,
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  ⚠
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827' }}>{alert.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{alert.batch}</div>
                </div>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#dc2626', flexShrink: 0 }}>{alert.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
