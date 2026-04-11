import React, { useState, useEffect } from 'react';
import { batchAPI } from '../services/api';

const getStatusBadgeStyle = (status) => {
  const styles = {
    'IN_PROGRESS': { background: '#dbeafe', color: '#1d4ed8', label: 'In Progress' },
    'COMPLETED': { background: '#dcfce7', color: '#166534', label: 'Completed' },
    'UPCOMING': { background: '#fef3c7', color: '#92400e', label: 'Upcoming' },
  };
  return styles[status] || { background: '#f3f4f6', color: '#6b7280', label: status };
};

const ProgressBar = ({ progress }) => (
  <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
    <div
      style={{
        height: '100%',
        background: progress >= 100 ? '#16a34a' : progress >= 50 ? '#d97706' : '#2563eb',
        width: `${Math.min(progress, 100)}%`,
        transition: 'width 0.3s ease',
      }}
    />
  </div>
);

const MyBatches = ({ onNavigate }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBatch, setExpandedBatch] = useState(null);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with getBatches() when API supports fetching all batches for a trainer
        const data = await batchAPI.getBatchById(1);
        setBatches(data ? [data] : []);
      } catch (err) {
        setError('Failed to load batches. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, []);

  if (loading) {
    return (
      <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading batches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>My Batches</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>View your enrolled training batches and progress.</p>
      </div>

      {batches.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '14px' }}>No batches found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {batches.map((batch) => {
            const badgeStyle = getStatusBadgeStyle(batch.status);
            const isExpanded = expandedBatch === batch.id;
            const completedModules = batch.completedModules ?? 0;
            const totalModules = batch.totalModules ?? batch.capacity ?? 1;
            const progress = Math.round((completedModules / totalModules) * 100);

            return (
              <div
                key={batch.id}
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '20px 22px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
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
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>{batch.batchName}</h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{batch.course}</p>
                  </div>
                  <span style={{
                    background: badgeStyle.background,
                    color: badgeStyle.color,
                    borderRadius: '12px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>
                    {badgeStyle.label}
                  </span>
                </div>

                {/* Trainer & Dates */}
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600 }}>Trainer:</span> {batch.trainer?.name || '—'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#374151' }}>
                    <span style={{ fontWeight: 600 }}>Duration:</span> {batch.startDate} to {batch.endDate}
                  </div>
                  <div style={{ fontSize: '13px', color: '#374151', marginTop: '4px' }}>
                    <span style={{ fontWeight: 600 }}>Timing:</span> {batch.timing || '—'}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>Capacity</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>{batch.capacity ?? '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>Progress</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a' }}>{progress}%</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '8px' }}>
                    Modules: {completedModules}/{totalModules}
                  </div>
                  <ProgressBar progress={progress} />
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
                    }}
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
                    }}
                  >
                    Open Batch
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8' }}>
                      <div style={{ marginBottom: '8px' }}><span style={{ fontWeight: 600 }}>Batch ID:</span> {batch.id}</div>
                      <div style={{ marginBottom: '8px' }}><span style={{ fontWeight: 600 }}>Course:</span> {batch.course}</div>
                      <div style={{ marginBottom: '8px' }}><span style={{ fontWeight: 600 }}>Capacity:</span> {batch.capacity}</div>
                      <div><span style={{ fontWeight: 600 }}>Timing:</span> {batch.timing || '—'}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBatches;
