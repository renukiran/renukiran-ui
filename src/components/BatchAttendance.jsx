import React, { useState } from 'react';

const CANDIDATES = [
  { id: 1, name: 'Priya S.', attendance: 93, streak: '12 days', absentNote: null, alert: null },
  { id: 2, name: 'Kavita R.', attendance: 68, streak: '0', absentNote: '(absent 2)', alert: 'Below 70%' },
  { id: 3, name: 'Sunita M.', attendance: 85, streak: '8 days', absentNote: null, alert: null },
  { id: 4, name: 'Anita K.', attendance: 72, streak: '1 day', absentNote: null, alert: 'At risk' },
  { id: 5, name: 'Radha P.', attendance: 90, streak: '5 days', absentNote: null, alert: null },
  { id: 6, name: 'Meena D.', attendance: 78, streak: '3 days', absentNote: null, alert: null },
];

const getAttendanceColor = (attendance) => {
  if (attendance >= 85) return '#16a34a';
  if (attendance >= 70) return '#d97706';
  return '#dc2626';
};

const BatchAttendance = () => {
  const [activeTab, setActiveTab] = useState('Attendance');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 11));
  const [attendance, setAttendance] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handlePrevDay = () => {
    setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
  };

  const handleNextDay = () => {
    setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
  };

  const handleAttendanceChange = (candidateId, status) => {
    setAttendance(prev => ({
      ...prev,
      [candidateId]: prev[candidateId] === status ? null : status,
    }));
  };

  const handleMarkAllPresent = () => {
    const newAttendance = {};
    CANDIDATES.forEach(candidate => {
      newAttendance[candidate.id] = 'P';
    });
    setAttendance(newAttendance);
  };

  const handleSaveAttendance = () => {
    setSaveMessage('Attendance saved!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const markedCount = Object.values(attendance).filter(v => v !== null && v !== undefined).length;

  if (activeTab === 'Candidates' || activeTab === 'Assessments') {
    return (
      <div style={{ background: '#ffffff', padding: '28px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
          Stitching Basic – Batch 1
        </h1>
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
          {['Candidates', 'Attendance', 'Assessments'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                color: activeTab === tab ? '#2563eb' : '#6b7280',
                borderBottom: activeTab === tab ? '2px solid #2563eb' : 'none',
                fontWeight: activeTab === tab ? 600 : 400,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', padding: '60px' }}>
          {activeTab} section coming soon.
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', padding: '28px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header & Tabs */}
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
        Stitching Basic – Batch 1
      </h1>
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
        {['Candidates', 'Attendance', 'Assessments'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              color: activeTab === tab ? '#2563eb' : '#6b7280',
              borderBottom: activeTab === tab ? '2px solid #2563eb' : 'none',
              fontWeight: activeTab === tab ? 600 : 400,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Date Navigator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={handlePrevDay}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            background: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ‹
        </button>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827', minWidth: '150px' }}>
          {formatDate(currentDate)}
        </div>
        <button
          onClick={handleNextDay}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            background: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ›
        </button>
        <button
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            background: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ▦
        </button>
      </div>

      {/* Summary Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '20px',
        background: '#fff',
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>Class 15 of 48</span>
          <span style={{ color: '#6b7280' }}>|</span>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Marked: {markedCount} / 18</span>
        </div>
        <button
          onClick={handleMarkAllPresent}
          style={{
            border: '1px solid #2563eb',
            color: '#2563eb',
            background: '#fff',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Mark All Present
        </button>
      </div>

      {/* Attendance Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr>
            {['NAME', 'ATTENDANCE %', 'TODAY', 'STREAK', 'ALERT'].map(header => (
              <th
                key={header}
                style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '10px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CANDIDATES.map(candidate => {
            const color = getAttendanceColor(candidate.attendance);
            const todayStatus = attendance[candidate.id];
            return (
              <tr key={candidate.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ fontSize: '14px', fontWeight: 500, color: '#111827', padding: '14px 16px' }}>
                  {candidate.name}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                    <div style={{ width: '80px', height: '6px', borderRadius: '3px', background: '#e5e7eb', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: color, width: `${candidate.attendance}%` }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color }}>{candidate.attendance}%</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['P', 'A', 'L'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleAttendanceChange(candidate.id, status)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: todayStatus === status ? 'none' : '1.5px solid #d1d5db',
                          background: todayStatus === status ? (status === 'P' ? '#16a34a' : status === 'A' ? '#dc2626' : '#d97706') : '#fff',
                          color: todayStatus === status ? '#fff' : '#9ca3af',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
                <td style={{ fontSize: '13px', color: '#374151', padding: '14px 16px' }}>
                  <div>{candidate.streak}</div>
                  {candidate.absentNote && (
                    <div style={{ fontSize: '11px', color: '#dc2626' }}>{candidate.absentNote}</div>
                  )}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {candidate.alert ? (
                    <span
                      style={{
                        background: candidate.alert === 'Below 70%' ? '#fee2e2' : '#fef9c3',
                        color: candidate.alert === 'Below 70%' ? '#b91c1c' : '#92400e',
                        borderRadius: '12px',
                        padding: '3px 10px',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {candidate.alert}
                    </span>
                  ) : (
                    <span style={{ color: '#9ca3af' }}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {[
            { label: 'P Present', color: '#16a34a' },
            { label: 'A Absent', color: '#dc2626' },
            { label: 'L Leave', color: '#d97706' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {item.label[0]}
              </div>
              <span style={{ fontSize: '13px', color: '#374151' }}>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleSaveAttendance}
            style={{
              background: '#1e3a5f',
              color: 'white',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
            }}
          >
            ✓ Save Attendance
          </button>
          {saveMessage && (
            <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>
              {saveMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchAttendance;
