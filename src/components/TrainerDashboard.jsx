import React, { useEffect, useState } from 'react';
import { trainerAPI } from '../services/api';
import { resolveTrainerIdentity } from '../utils/trainerResolution';

const fmtDate = (dateValue) => {
  if (!dateValue) return '—';
  return new Date(dateValue).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const mapBatchForNavigation = (batch, trainer) => ({
  id: batch.batchId,
  batchId: batch.batchId,
  batchName: batch.batchName,
  courseName: batch.courseName,
  trainer: trainer?.trainerName || '—',
  trainerId: trainer?.trainerId ?? null,
  capacity: batch.capacity ?? batch.enrolledCandidatesCount ?? 0,
  startDate: batch.startDate,
  endDate: batch.endDate,
});

const TrainerDashboard = ({ currentUser, onNavigate }) => {
  const [batches, setBatches] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const resolvedTrainer = await resolveTrainerIdentity(currentUser);

        if (!resolvedTrainer) {
          if (!cancelled) {
            setBatches([]);
            setAlerts([]);
            setError('Trainer profile could not be resolved from the current login.');
          }
          return;
        }

        const dashboard = await trainerAPI.getDashboard(resolvedTrainer.trainerId);
        if (cancelled) return;

        const activeBatches = Array.isArray(dashboard?.activeBatches) ? dashboard.activeBatches : [];
        const trainerContext = {
          trainerId: resolvedTrainer.trainerId,
          trainerName: dashboard?.trainerName || resolvedTrainer.trainerName || currentUser?.name || '',
        };

        setBatches(activeBatches.map((batch) => ({
          ...mapBatchForNavigation(batch, trainerContext),
          title: batch.courseName ? `${batch.courseName} — ${batch.batchName}` : batch.batchName,
          candidates: batch.enrolledCandidatesCount ?? 0,
          period: `${fmtDate(batch.startDate)} – ${fmtDate(batch.endDate)}`,
          attendanceMarked: Boolean(batch.attendanceMarkedToday),
          averageAttendancePercentage: batch.averageAttendancePercentage ?? 0,
        })));
        setAlerts(Array.isArray(dashboard?.lowAttendanceAlerts) ? dashboard.lowAttendanceAlerts : []);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load trainer dashboard', err);
          setBatches([]);
          setAlerts([]);
          setError('Failed to load trainer dashboard.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const welcomeName = currentUser?.name?.split(' ')?.[0] || 'Trainer';
  const batchLookup = {};
  batches.forEach((batch) => {
    batchLookup[batch.batchId] = batch;
  });

  return (
    <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '28px' }}>
        Welcome, {welcomeName}!
      </h1>

      <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
        My Active Batches
      </h2>
      {loading && <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Loading batches…</p>}
      {!loading && error && <p style={{ fontSize: '14px', color: '#dc2626', marginBottom: '16px' }}>{error}</p>}
      {!loading && !error && batches.length === 0 && <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>No batches assigned.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '36px' }}>
        {batches.map((batch) => (
          <div
            key={batch.batchId}
            style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '24px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>
              {batch.title}
            </h3>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                <span style={{ fontWeight: 700 }}>{batch.candidates}</span> enrolled
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Capacity: <span style={{ fontWeight: 700 }}>{batch.capacity}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{batch.period}</div>
            </div>

            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
              Avg attendance: <span style={{ fontWeight: 700 }}>{batch.averageAttendancePercentage}%</span>
            </div>

            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '16px',
                color: batch.attendanceMarked ? '#16a34a' : '#d97706',
              }}
            >
              Today&apos;s attendance: {batch.attendanceMarked ? '✓ Marked' : 'Not yet marked'}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {!batch.attendanceMarked && (
                <button
                  onClick={() => onNavigate && onNavigate('BatchDetail', { ...batch, initialTab: 'Attendance' })}
                  style={{
                    background: '#16a34a',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '9px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Mark Attendance
                </button>
              )}
              <button
                onClick={() => onNavigate && onNavigate('BatchDetail', batch)}
                style={{
                  background: '#fff',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                View Batch
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
        Low Attendance Alerts
      </h2>
      {alerts.length === 0 ? (
        <p style={{ fontSize: '14px', color: '#6b7280' }}>No low attendance alerts.</p>
      ) : (
        <div>
          {alerts.map((alert) => {
            const linkedBatch = batchLookup[alert.batchId];
            return (
              <button
                key={`${alert.batchId}-${alert.candidateId}`}
                onClick={() => linkedBatch && onNavigate && onNavigate('BatchDetail', { ...linkedBatch, initialTab: 'Attendance' })}
                style={{
                  width: '100%',
                  background: '#fefce8',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: linkedBatch ? 'pointer' : 'default',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#d97706', fontSize: '16px', marginRight: '12px' }}>!</span>
                  <span>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{alert.candidateName}</span>
                    <span style={{ color: '#374151' }}> — {alert.batchName}</span>
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#d97706' }}>
                  {alert.attendancePercentage}%
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
