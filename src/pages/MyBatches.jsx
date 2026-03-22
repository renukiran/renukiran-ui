import React, { useState } from 'react';

const BATCHES = [
  {
    id: 1,
    name: 'Stitching Basic - Batch 1',
    course: 'Stitching',
    trainer: 'Suman Kumar',
    startDate: 'Mar 1, 2026',
    endDate: 'Jun 30, 2026',
    status: 'In Progress',
    attendance: '92%',
    progress: '65%',
    modules: 5,
    completedModules: 3,
  },
  {
    id: 2,
    name: 'Computer Fundamentals - Batch 2',
    course: 'Computers',
    trainer: 'Rajesh Singh',
    startDate: 'Feb 15, 2026',
    endDate: 'May 31, 2026',
    status: 'Completed',
    attendance: '95%',
    progress: '100%',
    modules: 4,
    completedModules: 4,
  },
  {
    id: 3,
    name: 'Beauty Basic - Batch 1',
    course: 'Beauty',
    trainer: 'Priya Verma',
    startDate: 'Apr 1, 2026',
    endDate: 'Jul 31, 2026',
    status: 'Upcoming',
    attendance: '0%',
    progress: '0%',
    modules: 6,
    completedModules: 0,
  },
];

const getStatusBadgeStyle = (status) => {
  const styles = {
    'In Progress': { background: '#dbeafe', color: '#1d4ed8' },
    Completed: { background: '#dcfce7', color: '#166534' },
    Upcoming: { background: '#fef3c7', color: '#92400e' },
  };
  return styles[status] || { background: '#f3f4f6', color: '#6b7280' };
};

const ProgressBar = ({ progress }) => (
  <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
    <div
      style={{
        height: '100%',
        background: progress >= 100 ? '#16a34a' : progress >= 50 ? '#d97706' : '#2563eb',
        width: `${progress}%`,
        transition: 'width 0.3s ease',
      }}
    />
  </div>
);

const MyBatches = ({ onNavigate }) => {
  const [expandedBatch, setExpandedBatch] = useState(null);

  return (
    <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>My Batches</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>View your enrolled training batches and progress.</p>
      </div>

      {/* Batches Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {BATCHES.map((batch) => {
          const badgeStyle = getStatusBadgeStyle(batch.status);
          const isExpanded = expandedBatch === batch.id;

          return (
            <div
              key={batch.id}
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '20px 22px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>{batch.name}</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{batch.course}</p>
                </div>
                <span
                  style={{
                    background: badgeStyle.background,
                    color: badgeStyle.color,
                    borderRadius: '12px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {batch.status}
                </span>
              </div>

              {/* Trainer & Dates */}
              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Trainer:</span> {batch.trainer}
                </div>
                <div style={{ fontSize: '13px', color: '#374151' }}>
                  <span style={{ fontWeight: 600 }}>Duration:</span> {batch.startDate} to {batch.endDate}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>
                    Attendance
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a' }}>{batch.attendance}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>
                    Progress
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>{batch.progress}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '8px' }}>
                  Modules: {batch.completedModules}/{batch.modules}
                </div>
                <ProgressBar progress={(batch.completedModules / batch.modules) * 100} />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setExpandedBatch(isExpanded ? null : batch.id)}
                  style={{
                    flex: 1,
                    background: '#fff',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = '#f3f4f6')}
                  onMouseLeave={(e) => (e.target.style.background = '#fff')}
                >
                  {isExpanded ? 'Hide Details' : 'View Details'}
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('BatchDetail', batch)}
                  style={{
                    flex: 1,
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
                  onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
                >
                  Open Batch
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600 }}>Batch ID:</span> BATCH-{batch.id.toString().padStart(3, '0')}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600 }}>Total Modules:</span> {batch.modules}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600 }}>Completed:</span> {batch.completedModules}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600 }}>Remaining:</span> {batch.modules - batch.completedModules}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBatches;
