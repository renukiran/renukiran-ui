import React, { useState } from 'react';

const BATCHES = [
  {
    id: 1,
    title: 'Stitching Basic — Batch 1',
    candidates: 18,
    period: 'Mar 1 – Jun 30, 2026',
    classProgress: { done: 15, total: 48 },
    avgAttendance: 84,
    attendanceMarked: false,
  },
  {
    id: 2,
    title: 'Computer Fund. — Batch 2',
    candidates: 19,
    period: 'Mar 1 – May 31, 2026',
    classProgress: { done: 22, total: 40 },
    avgAttendance: 91,
    attendanceMarked: true,
  },
];

const LOW_ATTENDANCE_ALERTS = [
  { name: 'Kavita R.', batch: 'Stitching B1', attendance: 68 },
  { name: 'Anita K.', batch: 'Stitching B1', attendance: 72 },
];

const TrainerDashboard = () => {
  const [batches, setBatches] = useState(BATCHES);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const markAttendance = (batchId) => {
    setBatches(batches.map(batch =>
      batch.id === batchId ? { ...batch, attendanceMarked: true } : batch
    ));
  };

  if (currentPage === 'batchDetail') {
    return (
      <div style={{ padding: '60px', textAlign: 'center', minHeight: '100vh', background: '#f9fafb' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>Batch Detail</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>This page is under construction.</p>
        <button
          onClick={() => setCurrentPage('dashboard')}
          style={{
            marginTop: '24px',
            background: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Page Header */}
      <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '28px' }}>
        Welcome, Suman!
      </h1>

      {/* My Active Batches */}
      <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
        My Active Batches
      </h2>
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
                <span style={{ fontWeight: 700 }}>{batch.candidates}</span> candidates
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{batch.period}</div>
            </div>

            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '13px', color: '#6b7280', width: '120px' }}>Class Progress</div>
              <div style={{ flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '8px',
                    background: '#2563eb',
                    borderRadius: '4px',
                    width: `${(batch.classProgress.done / batch.classProgress.total) * 100}%`,
                  }}
                />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', width: '48px', textAlign: 'right' }}>
                {Math.round((batch.classProgress.done / batch.classProgress.total) * 100)}%
              </div>
            </div>

            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '13px', color: '#6b7280', width: '120px' }}>Avg Attendance</div>
              <div style={{ flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '8px',
                    background: '#16a34a',
                    borderRadius: '4px',
                    width: `${batch.avgAttendance}%`,
                  }}
                />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', width: '48px', textAlign: 'right' }}>
                {batch.avgAttendance}%
              </div>
            </div>

            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '16px',
                color: batch.attendanceMarked ? '#16a34a' : '#d97706',
              }}
            >
              Today's attendance: {batch.attendanceMarked ? '✓ Marked' : 'Not yet marked'}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {!batch.attendanceMarked && (
                <button
                  onClick={() => markAttendance(batch.id)}
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
                onClick={() => setCurrentPage('batchDetail')}
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
        {LOW_ATTENDANCE_ALERTS.map((alert, index) => (
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
