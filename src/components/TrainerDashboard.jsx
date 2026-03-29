import React, { useState, useEffect } from 'react';
import { batchAPI } from '../services/api';

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const TrainerDashboard = ({ currentUser, onNavigate }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    batchAPI.getBatches()
      .then(data => {
        const list = data?.content ?? (Array.isArray(data) ? data : []);
        setBatches(list.map(b => ({
          id: b.id,
          title: b.courseName ? `${b.courseName} — ${b.batchName}` : b.batchName,
          candidates: b.capacity ?? 0,
          period: `${fmtDate(b.startDate)} – ${fmtDate(b.endDate)}`,
          status: b.status ?? 'ACTIVE',
          attendanceMarked: false,
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const welcomeName = currentUser?.name?.split(' ')?.[0] || 'Trainer';

  return (
    <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Page Header */}
      <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '28px' }}>
        Welcome, {welcomeName}!
      </h1>

      {/* My Active Batches */}
      <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
        My Active Batches
      </h2>
      {loading && <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Loading batches…</p>}
      {!loading && batches.length === 0 && <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>No batches assigned.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '36px' }}>
        {batches.map(batch => (
          <div
            key={batch.id}
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

            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                <span style={{ fontWeight: 700 }}>{batch.candidates}</span> seats
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{batch.period}</div>
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
                  onClick={() => setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, attendanceMarked: true } : b))}
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
                onClick={() => onNavigate && onNavigate('MyBatches')}
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

      {/* Low Attendance Alerts */}
      <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
        Low Attendance Alerts
      </h2>
      <div>
        {[].map((alert, index) => (
          <div
            key={index}
            style={{
              background: '#fefce8',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '16px 20px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#d97706', fontSize: '16px', marginRight: '12px' }}>⚠</span>
              <span>
                <span style={{ fontWeight: 700, color: '#111827' }}>{alert.name}</span>
                <span style={{ color: '#374151' }}> — {alert.batch}</span>
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#d97706' }}>
              {alert.attendance}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerDashboard;
