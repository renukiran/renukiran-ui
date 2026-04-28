import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../services/api';

const TRACK_LABELS = {
  TAILORING: 'Tailoring',
  BEAUTY_AND_GROOMING: 'Beauty & Grooming',
  FOOD_BUSINESS: 'Food Business',
  HANDICRAFT: 'Handicraft',
  HOME_BASED_PRODUCTION: 'Home-Based Prod.',
  OTHER: 'Other',
};

//const UPCOMING_FOLLOWUPS = [
//   { name: 'Meena Kumari', type: '1-month follow-up', date: 'Mar 12, 2026', timing: 'Tomorrow', timingColor: '#374151' },
//   { name: 'Sunita Bai', type: '3-month follow-up', date: 'Mar 8, 2026', timing: 'Overdue!', timingColor: '#dc2626' },
//   { name: 'Kavita Joshi', type: '1-month follow-up', date: 'Mar 18, 2026', timing: 'In 7 days', timingColor: '#374151' },
// ];

const getStatusBadgeStyle = (status) => {
  const styles = {
    New: { background: '#dbeafe', color: '#1d4ed8' },
    'Under Review': { background: '#fef3c7', color: '#92400e' },
    Assigned: { background: '#dcfce7', color: '#166534' },
  };
  return styles[status] || { background: '#f3f4f6', color: '#374151' };
};

const StatCard = ({ label, value, color, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
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
  const [stats, setStats] = useState({
    new: 0,
    assignedToBatch: 0,
    trainingStarted: 0,
    trainingCompleted: 0,
  });
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    applicationAPI.getApplications()
      .then(res => {
        const list = res?.data ?? (Array.isArray(res) ? res : []);
        
        // Count admissions by status
        let newCount = 0;
        let assignedCount = 0;
        let startedCount = 0;
        let completedCount = 0;

        list.forEach(app => {
          const admissions = app.admissions || [];
          if (admissions.length === 0) {
            newCount++;
          } else {
            admissions.forEach(admission => {
              const status = admission.status;
              if (status === 'ASSIGNED_TO_BATCH') assignedCount++;
              else if (status === 'TRAINING_STARTED') startedCount++;
              else if (status === 'TRAINING_COMPLETED') completedCount++;
              else newCount++;
            });
          }
        });

        setStats({
          new: newCount,
          assignedToBatch: assignedCount,
          trainingStarted: startedCount,
          trainingCompleted: completedCount,
        });

        setRecentApps(list.slice(0, 5).map(a => ({
          name: a.fullName ?? '—',
          course: TRACK_LABELS[a.preferredExperienceTrack] ?? a.preferredExperienceTrack ?? '—',
          status: 'New',
          date: '—',
        })));
      })
      .catch(() => {});
  }, []);

  const welcomeName = currentUser?.name?.split(' ')?.[0] || 'Coordinator';

  const statCards = [
    { label: 'New',                  value: stats.new,               color: '#2563eb', status: 'New' },
    { label: 'Assigned to Batch',    value: stats.assignedToBatch,   color: '#16a34a', status: 'ASSIGNED_TO_BATCH' },
    { label: 'Training Started',     value: stats.trainingStarted,   color: '#0891b2', status: 'TRAINING_STARTED' },
    { label: 'Training Completed',   value: stats.trainingCompleted, color: '#059669', status: 'TRAINING_COMPLETED' },
  ];

  return (
    <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Welcome back, {welcomeName}. Here&apos;s your overview.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {statCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} color={card.color} onClick={() => onNavigate('CandidateList', { status: card.status })} />
        ))}
      </div>

      {/* Quick Actions */}
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

      {/* Bottom Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {/* Left Panel - Recent Applications */}
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>Recent Applications</h3>
            <button onClick={() => onNavigate && onNavigate('CandidateList')} style={{ fontSize: '13px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              View All →
            </button>
          </div>
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
              {recentApps.map((app, idx) => {
                const badgeStyle = getStatusBadgeStyle(app.status);
                return (
                  <tr key={idx} style={{ borderBottom: idx < recentApps.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
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

        {/* Right Panel - Upcoming Follow-ups */}
        {/* <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>Upcoming Follow-ups</h3>
            <button onClick={() => {}} style={{ fontSize: '13px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              View All →
            </button>
          </div>
          <div>
            {UPCOMING_FOLLOWUPS.map((followup, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: idx < UPCOMING_FOLLOWUPS.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{followup.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{followup.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>{followup.date}</div>
                  <div style={{ fontSize: '12px', color: followup.timingColor, marginBottom: '8px' }}>{followup.timing}</div>
                  <button
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
                    Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default OCDashboard;
