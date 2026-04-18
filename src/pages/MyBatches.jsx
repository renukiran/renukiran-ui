import React, { useEffect, useState } from 'react';
import { trainerAPI } from '../services/api';
import { resolveTrainerIdentity } from '../utils/trainerResolution';

const getStatusBadgeStyle = (status) => {
  const styles = {
    IN_PROGRESS: { background: '#dbeafe', color: '#1d4ed8', label: 'In Progress' },
    COMPLETED: { background: '#dcfce7', color: '#166534', label: 'Completed' },
    UPCOMING: { background: '#fef3c7', color: '#92400e', label: 'Upcoming' },
  };
  return styles[status] || { background: '#f3f4f6', color: '#6b7280', label: status };
};

const deriveBatchStatus = (startDate, endDate) => {
  const today = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && today < start) return 'UPCOMING';
  if (end && today > end) return 'COMPLETED';
  return 'IN_PROGRESS';
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

const MyBatches = ({ currentUser, onNavigate }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBatch, setExpandedBatch] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchBatches = async () => {
      try {
        setLoading(true);
        setError(null);

        const resolvedTrainer = await resolveTrainerIdentity(currentUser);

        if (!resolvedTrainer) {
          if (!cancelled) {
            setBatches([]);
            setError('Trainer profile could not be resolved from the current login.');
          }
          return;
        }

        const dashboard = await trainerAPI.getDashboard(resolvedTrainer.trainerId);
        if (cancelled) return;

        const activeBatches = Array.isArray(dashboard?.activeBatches) ? dashboard.activeBatches : [];
        const trainerName = dashboard?.trainerName || resolvedTrainer.trainerName || currentUser?.name || '';

        setBatches(activeBatches.map((batch) => ({
          id: batch.batchId,
          batchId: batch.batchId,
          batchName: batch.batchName,
          courseName: batch.courseName,
          trainerId: resolvedTrainer.trainerId,
          trainerName,
          capacity: batch.capacity ?? 0,
          startDate: batch.startDate,
          endDate: batch.endDate,
          status: deriveBatchStatus(batch.startDate, batch.endDate),
          completedModules: batch.classProgressCompleted ?? 0,
          totalModules: batch.classProgressTotal ?? 1,
          progressPercentage: batch.classProgressPercentage ?? 0,
        })));
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load batches. Please try again.');
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBatches();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

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
            const totalModules = batch.totalModules || 1;
            const progress = batch.progressPercentage ?? Math.round((completedModules / totalModules) * 100);

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
                onMouseEnter={(event) => {
                  event.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                  event.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  event.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>{batch.batchName}</h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{batch.courseName}</p>
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
                    {badgeStyle.label}
                  </span>
                </div>

                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600 }}>Trainer:</span> {batch.trainerName || '—'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#374151' }}>
                    <span style={{ fontWeight: 600 }}>Duration:</span> {batch.startDate} to {batch.endDate}
                  </div>
                  <div style={{ fontSize: '13px', color: '#374151', marginTop: '4px' }}>
                    <span style={{ fontWeight: 600 }}>Progress:</span> {completedModules}/{totalModules} classes
                  </div>
                </div>

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

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '8px' }}>
                    Classes: {completedModules}/{totalModules}
                  </div>
                  <ProgressBar progress={progress} />
                </div>

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

                {isExpanded && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8' }}>
                      <div style={{ marginBottom: '8px' }}><span style={{ fontWeight: 600 }}>Batch ID:</span> {batch.id}</div>
                      <div style={{ marginBottom: '8px' }}><span style={{ fontWeight: 600 }}>Course:</span> {batch.courseName}</div>
                      <div style={{ marginBottom: '8px' }}><span style={{ fontWeight: 600 }}>Capacity:</span> {batch.capacity}</div>
                      <div><span style={{ fontWeight: 600 }}>Trainer:</span> {batch.trainerName || '—'}</div>
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