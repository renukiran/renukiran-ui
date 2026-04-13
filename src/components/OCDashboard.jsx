import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';

const getStatusBadgeStyle = (status) => {
  const styles = {
    New: { background: '#dbeafe', color: '#1d4ed8' },
    'Under Review': { background: '#fef3c7', color: '#92400e' },
    Assigned: { background: '#dcfce7', color: '#166534' },
    'Training Completed': { background: '#e0e7ff', color: '#3730a3' },
  };
  return styles[status] || { background: '#f3f4f6', color: '#374151' };
};

const formatDate = (value) => {
  if (!value) return '—';
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const StatCard = ({ label, value, color }) => {
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
      <div style={{ fontSize: '34px', fontWeight: 700, color }}>{value}</div>
    </div>
  );
};

const OCDashboard = ({ currentUser, onNavigate }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardAPI.getOCDashboard(currentUser?.name);
        setDashboard(response);
      } catch (err) {
        setError('Failed to load dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [currentUser?.name]);

  const welcomeName = currentUser?.name?.split(' ')?.[0] || 'Coordinator';
  const welcomeText = dashboard?.welcomeMessage || `Welcome back, ${welcomeName}. Here's your overview.`;

  const statCards = [
    { label: dashboard?.newApplications?.label || 'New Applications', value: dashboard?.newApplications?.value ?? '—', color: '#2563eb' },
    { label: dashboard?.underReview?.label || 'Under Review', value: dashboard?.underReview?.value ?? '—', color: '#d97706' },
    { label: dashboard?.assignedToBatch?.label || 'Assigned to Batch', value: dashboard?.assignedToBatch?.value ?? '—', color: '#16a34a' },
    { label: dashboard?.pendingPlacement?.label || 'Pending Placement', value: dashboard?.pendingPlacement?.value ?? '—', color: '#ea580c' },
  ];

  const recentApps = dashboard?.recentApplications ?? [];
  const followUps = dashboard?.upcomingFollowUps ?? [];

  return (
    <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{welcomeText}</p>
      </div>

      {error && (
        <div style={{ marginBottom: '24px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '12px 16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {statCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} color={card.color} />
        ))}
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <button
            onClick={() => onNavigate('Applications')}
            style={{
              background: 'white',
              border: '1.5px solid #2563eb',
              color: '#2563eb',
              borderRadius: '8px',
              padding: '18px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#eff6ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
            }}
          >
            + New Application
          </button>
          <button
            onClick={() => onNavigate('BatchManagement')}
            style={{
              background: 'white',
              border: '1.5px solid #2563eb',
              color: '#2563eb',
              borderRadius: '8px',
              padding: '18px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#eff6ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
            }}
          >
            → Assign to Batches
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>Recent Applications</h3>
            <button onClick={() => onNavigate && onNavigate('Applications')} style={{ fontSize: '13px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              View All →
            </button>
          </div>
          {loading && recentApps.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: '14px', padding: '24px 0', textAlign: 'center' }}>Loading applications...</div>
          ) : recentApps.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: '14px', padding: '24px 0', textAlign: 'center' }}>No applications found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  {['Name', 'Course', 'Status', 'Date'].map((header) => (
                    <th key={header} style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', padding: '12px 0' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentApps.map((application, index) => {
                  const badgeStyle = getStatusBadgeStyle(application.status);
                  return (
                    <tr key={application.candidateId ?? index} style={{ borderBottom: index < recentApps.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{application.candidateName}</td>
                      <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{application.courseName}</td>
                      <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>
                        <span style={{ background: badgeStyle.background, color: badgeStyle.color, borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, display: 'inline-block' }}>
                          {application.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{formatDate(application.appliedDate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>Upcoming Follow-ups</h3>
          </div>
          {loading && followUps.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: '14px', padding: '24px 0', textAlign: 'center' }}>Loading follow-ups...</div>
          ) : followUps.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: '14px', padding: '24px 0', textAlign: 'center' }}>No follow-ups pending.</div>
          ) : (
            <div>
              {followUps.map((followUp, index) => (
                <div
                  key={followUp.followUpId ?? index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 0',
                    borderBottom: index < followUps.length - 1 ? '1px solid #f3f4f6' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{followUp.candidateName}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{followUp.followUpType}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>{formatDate(followUp.dueDate)}</div>
                    <div style={{ fontSize: '12px', color: followUp.dueLabel === 'Overdue' ? '#dc2626' : '#374151', marginBottom: '8px' }}>{followUp.dueLabel}</div>
                    <button
                      onClick={() => onNavigate && onNavigate('CandidateProfile', { id: followUp.candidateId, name: followUp.candidateName })}
                      style={{
                        background: '#1e3a5f',
                        color: 'white',
                        borderRadius: '6px',
                        padding: '7px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#152d47';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#1e3a5f';
                      }}
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCDashboard;