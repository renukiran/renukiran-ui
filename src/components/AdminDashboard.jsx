import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { formatDisplayDate } from '../utils/applicationForm';

const getStatusBadgeStyle = (status) => {
  const styles = {
    New: { background: '#dbeafe', color: '#1d4ed8' },
    'Assigned To Batch': { background: '#e0e7ff', color: '#3730a3' },
    'Training Started': { background: '#cffafe', color: '#0e7490' },
    Placed: { background: '#dcfce7', color: '#166534' },
    'Training Completed': { background: '#fef3c7', color: '#92400e' },
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

const AdminDashboard = ({ currentUser, onNavigate }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardAPI.getAdminDashboard(currentUser?.name);
        setDashboard(response ?? null);
      } catch (loadError) {
        setError('Failed to load admin dashboard');
        console.error('Failed to load admin dashboard:', loadError);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [currentUser?.name]);

  const welcomeName = currentUser?.name?.split(' ')?.[0] || 'Admin';
  const welcomeText = dashboard?.welcomeMessage || `Welcome back, ${welcomeName}. Here's your operational overview.`;

  const operationalStats = [
    { label: dashboard?.totalCourses?.label ?? 'Total Courses', value: dashboard?.totalCourses?.value ?? '—', trend: dashboard?.totalCourses?.helperText ?? '', trendDir: 'flat', color: '#2563eb' },
    { label: dashboard?.activeBatches?.label ?? 'Active Batches', value: dashboard?.activeBatches?.value ?? '—', trend: dashboard?.activeBatches?.helperText ?? '', trendDir: 'flat', color: '#2563eb' },
    { label: dashboard?.candidatesEnrolled?.label ?? 'Candidates Enrolled', value: dashboard?.candidatesEnrolled?.value ?? '—', trend: dashboard?.candidatesEnrolled?.helperText ?? '', trendDir: 'up', color: '#16a34a' },
    { label: dashboard?.pendingAssignments?.label ?? 'Pending Assignments', value: dashboard?.pendingAssignments?.value ?? '—', trend: dashboard?.pendingAssignments?.helperText ?? '', trendDir: 'down', color: '#d97706' },
  ];

  const impactStats = [
    { label: dashboard?.assessmentPassRate?.label ?? 'Assessment Pass Rate', value: dashboard?.assessmentPassRate?.value ?? '—', trend: dashboard?.assessmentPassRate?.helperText ?? '', trendDir: 'up', color: '#16a34a' },
    { label: dashboard?.placementRate?.label ?? 'Placement Rate', value: dashboard?.placementRate?.value ?? '—', trend: dashboard?.placementRate?.helperText ?? '', trendDir: 'flat', color: '#d97706' },
    { label: dashboard?.jobRetention?.label ?? 'Job Retention', value: dashboard?.jobRetention?.value ?? '—', trend: dashboard?.jobRetention?.helperText ?? '', trendDir: 'up', color: '#16a34a' },
    { label: dashboard?.averageAttendance?.label ?? 'Avg Attendance', value: dashboard?.averageAttendance?.value ?? '—', trend: dashboard?.averageAttendance?.helperText ?? '', trendDir: 'up', color: '#16a34a' },
  ];

  const displayApps = dashboard?.recentApplications ?? [];
  const displayBatches = dashboard?.batchCapacityOverview ?? [];
  const attendanceAlerts = dashboard?.attendanceAlerts ?? [];

  return (
    <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{welcomeText}</p>
      </div>

      {error && <div style={{ color: '#b91c1c', marginBottom: '16px' }}>{error}</div>}
      {loading && !dashboard && <div style={{ color: '#6b7280', marginBottom: '16px' }}>Loading dashboard...</div>}

      {/* Operational Stats */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Operational Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {operationalStats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} trendDir={stat.trendDir} color={stat.color} />
          ))}
        </div>
      </div>

      {/* Impact Stats */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Impact Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {impactStats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} trendDir={stat.trendDir} color={stat.color} />
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>Recent Applications</h2>
          <button onClick={() => onNavigate && onNavigate('CandidateList')}
            style={{ fontSize: '13px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
            View All →
          </button>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                {['Name', 'Course / Track', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', padding: '12px 0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayApps.map((app, idx) => {
                const badgeStyle = getStatusBadgeStyle(app.status);
                return (
                  <tr
                    key={app.candidateId ?? idx}
                    style={{ borderBottom: idx < displayApps.length - 1 ? '1px solid #f3f4f6' : 'none', cursor: app.candidateId ? 'pointer' : 'default' }}
                    onClick={() => app.candidateId && onNavigate && onNavigate('CandidateProfile', { id: app.candidateId, name: app.candidateName })}
                  >
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{app.candidateName}</td>
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{app.courseName}</td>
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>
                      <span style={{ background: badgeStyle.background, color: badgeStyle.color, borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, display: 'inline-block' }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{formatDisplayDate(app.appliedDate)}</td>
                  </tr>
                );
              })}
              {displayApps.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ fontSize: '13.5px', color: '#6b7280', padding: '16px 0', textAlign: 'center' }}>
                    No recent applications available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Batch Capacity */}
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Batch Capacity</h3>
          <div>
            {displayBatches.map((batch, idx) => {
              const pct = batch.occupancyPercentage ?? (batch.capacity > 0 ? Math.round((batch.enrolledCount / batch.capacity) * 100) : 0);
              return (
                <div key={batch.batchId ?? idx} style={{ marginBottom: idx < displayBatches.length - 1 ? '16px' : 0, cursor: batch.batchId ? 'pointer' : 'default' }} onClick={() => batch.batchId && onNavigate && onNavigate('BatchDetail', { rawId: batch.batchId, id: batch.batchName })}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827' }}>{batch.courseName} — {batch.batchName}</span>
                    <span style={{ fontSize: '13.5px', color: '#6b7280' }}>{batch.enrolledCount}/{batch.capacity}</span>
                  </div>
                  <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: getCapacityBarColor(pct), width: `${pct}%`, transition: 'width 0.3s ease' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>{batch.batchStatus}</div>
                </div>
              );
            })}
            {displayBatches.length === 0 && <div style={{ fontSize: '13.5px', color: '#6b7280' }}>No batch capacity data available.</div>}
          </div>
        </div>

        {/* Attendance Alerts */}
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Attendance Alerts</h3>
          <div>
            {attendanceAlerts.map((alert, idx) => (
              <div
                key={alert.candidateId ?? idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#fef3c7',
                  border: '1px solid #fcd34d',
                  borderRadius: '8px',
                  marginBottom: idx < attendanceAlerts.length - 1 ? '12px' : 0,
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
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827' }}>{alert.candidateName}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{alert.courseName} — {alert.batchName}</div>
                </div>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#dc2626', flexShrink: 0 }}>{alert.attendancePercentage}%</span>
              </div>
            ))}
            {attendanceAlerts.length === 0 && <div style={{ fontSize: '13.5px', color: '#6b7280' }}>No low attendance alerts right now.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
