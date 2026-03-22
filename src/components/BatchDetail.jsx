import React, { useState } from 'react';

const CANDIDATES_DATA = [
  { id: 1, name: 'Priya S.', phone: '9876543210', status: 'Training', attendance: 93, streak: '12 days', absentNote: null, alert: null, mcq: 85, practical: 90, caseStudy: 78, remarks: '' },
  { id: 2, name: 'Kavita R.', phone: '9876543211', status: 'Training', attendance: 68, streak: '0', absentNote: '(absent 2)', alert: 'Below 70%', mcq: 60, practical: 45, caseStudy: 50, remarks: '' },
  { id: 3, name: 'Sunita M.', phone: '9876543212', status: 'Training', attendance: 85, streak: '8 days', absentNote: null, alert: null, mcq: 70, practical: 80, caseStudy: 65, remarks: '' },
  { id: 4, name: 'Anita K.', phone: '9876543213', status: 'Training', attendance: 72, streak: '1 day', absentNote: null, alert: 'At risk', mcq: 40, practical: 35, caseStudy: 30, remarks: 'Needs more practice with machine operation.' },
  { id: 5, name: 'Radha P.', phone: '9876543214', status: 'Training', attendance: 90, streak: '5 days', absentNote: null, alert: null, mcq: 75, practical: 85, caseStudy: 70, remarks: '' },
  { id: 6, name: 'Meena D.', phone: '9876543215', status: 'Training', attendance: 78, streak: '3 days', absentNote: null, alert: null, mcq: 0, practical: 0, caseStudy: 0, remarks: '' },
];

const getAttendanceColor = (attendance) => {
  if (attendance >= 85) return '#16a34a';
  if (attendance >= 70) return '#d97706';
  return '#dc2626';
};

const calculateFinal = (mcq, practical, caseStudy) => {
  const m = parseFloat(mcq) || 0;
  const p = parseFloat(practical) || 0;
  const c = parseFloat(caseStudy) || 0;
  return (m * 0.3 + p * 0.5 + c * 0.2).toFixed(1);
};

const BatchDetail = () => {
  const [activeTab, setActiveTab] = useState('Candidates');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 11));
  const [attendance, setAttendance] = useState({});
  const [candidates, setCandidates] = useState(CANDIDATES_DATA);
  const [expandedRemarks, setExpandedRemarks] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [publishMessage, setPublishMessage] = useState('');

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
    candidates.forEach(candidate => {
      newAttendance[candidate.id] = 'P';
    });
    setAttendance(newAttendance);
  };

  const handleSaveAttendance = () => {
    setSaveMessage('Attendance saved!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleScoreChange = (id, field, value) => {
    setCandidates(prev =>
      prev.map(c => c.id === id ? { ...c, [field]: value } : c)
    );
  };

  const handleRemarksChange = (id, value) => {
    setCandidates(prev =>
      prev.map(c => c.id === id ? { ...c, remarks: value } : c)
    );
  };

  const toggleRemarks = (id) => {
    setExpandedRemarks(expandedRemarks === id ? null : id);
  };

  const handleSaveAssessments = () => {
    setSaveMessage('Saved!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handlePublishResults = () => {
    setPublishMessage('Results published successfully!');
    setTimeout(() => setPublishMessage(''), 2000);
  };

  const calculateAssessmentStats = () => {
    let passCount = 0;
    let failCount = 0;
    candidates.forEach(c => {
      const final = parseFloat(calculateFinal(c.mcq, c.practical, c.caseStudy));
      if (final >= 50) passCount++;
      else failCount++;
    });
    const passRate = candidates.length > 0 ? ((passCount / candidates.length) * 100).toFixed(1) : 0;
    return { passCount, failCount, passRate };
  };

  const markedCount = Object.values(attendance).filter(v => v !== null && v !== undefined).length;
  const assessmentStats = calculateAssessmentStats();

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

      {/* TAB 1: CANDIDATES */}
      {activeTab === 'Candidates' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['#', 'NAME', 'PHONE', 'STATUS', 'ATTENDANCE %', 'ACTION'].map(header => (
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
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, idx) => (
              <tr key={candidate.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ fontSize: '14px', color: '#6b7280', padding: '14px 16px' }}>{idx + 1}</td>
                <td style={{ fontSize: '14px', fontWeight: 500, color: '#111827', padding: '14px 16px' }}>{candidate.name}</td>
                <td style={{ fontSize: '14px', color: '#374151', padding: '14px 16px' }}>{candidate.phone}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: '#ccfbf1', color: '#0f766e', borderRadius: '12px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>
                    {candidate.status}
                  </span>
                </td>
                <td style={{ fontSize: '14px', fontWeight: 600, color: getAttendanceColor(candidate.attendance), padding: '14px 16px' }}>
                  {candidate.attendance}%
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button
                    onClick={() => alert(`View profile for ${candidate.name}`)}
                    style={{
                      color: '#2563eb',
                      fontSize: '13px',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                    }}
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* TAB 2: ATTENDANCE */}
      {activeTab === 'Attendance' && (
        <>
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
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Marked: {markedCount} / {candidates.length}</span>
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
              {candidates.map(candidate => {
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

          {/* Attendance Footer */}
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
        </>
      )}

      {/* TAB 3: ASSESSMENTS */}
      {activeTab === 'Assessments' && (
        <>
          {/* Course Weights Info Bar */}
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '12px 18px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ color: '#2563eb', fontSize: '16px' }}>ℹ</span>
            <span style={{ fontSize: '13px', color: '#374151' }}>
              Course Weights: MCQ (30%) | Practical (50%) | Case Study (20%) | Pass Threshold: 50%
            </span>
          </div>

          {/* Assessment Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr>
                {['#', 'NAME', 'MCQ / 100', 'PRACTICAL / 100', 'CASE STUDY / 100', 'FINAL %', 'RESULT', 'REMARKS'].map(header => (
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
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => {
                const final = parseFloat(calculateFinal(candidate.mcq, candidate.practical, candidate.caseStudy));
                const isPass = final >= 50;
                const isExpanded = expandedRemarks === candidate.id;

                return (
                  <React.Fragment key={candidate.id}>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ fontSize: '14px', color: '#6b7280', padding: '16px' }}>{index + 1}</td>
                      <td style={{ fontSize: '14px', fontWeight: 500, color: '#111827', padding: '16px' }}>{candidate.name}</td>
                      <td style={{ padding: '16px' }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={candidate.mcq}
                          onChange={(e) => handleScoreChange(candidate.id, 'mcq', e.target.value)}
                          style={{
                            width: '70px',
                            padding: '8px 10px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            textAlign: 'center',
                          }}
                        />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={candidate.practical}
                          onChange={(e) => handleScoreChange(candidate.id, 'practical', e.target.value)}
                          style={{
                            width: '70px',
                            padding: '8px 10px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            textAlign: 'center',
                          }}
                        />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={candidate.caseStudy}
                          onChange={(e) => handleScoreChange(candidate.id, 'caseStudy', e.target.value)}
                          style={{
                            width: '70px',
                            padding: '8px 10px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            textAlign: 'center',
                          }}
                        />
                      </td>
                      <td style={{ fontSize: '14px', fontWeight: 700, color: '#111827', padding: '16px' }}>
                        {final.toFixed(1)}%
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            background: isPass ? '#dcfce7' : '#fee2e2',
                            color: isPass ? '#166534' : '#b91c1c',
                            borderRadius: '12px',
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          {isPass ? '✓ Pass' : '✗ Fail'}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button
                          onClick={() => toggleRemarks(candidate.id)}
                          style={{
                            color: '#2563eb',
                            fontSize: '13px',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                          }}
                        >
                          Remarks {isExpanded ? '▼' : ''}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                        <td colSpan="8" style={{ padding: '16px' }}>
                          <div>
                            <label style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                              REMARKS FOR {candidate.name.toUpperCase()}
                            </label>
                            <textarea
                              value={candidate.remarks}
                              onChange={(e) => handleRemarksChange(candidate.id, e.target.value)}
                              style={{
                                width: '500px',
                                height: '80px',
                                padding: '10px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontFamily: "'Segoe UI', system-ui, sans-serif",
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {/* Assessment Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 0',
            borderTop: '1px solid #f3f4f6',
            marginTop: '16px',
          }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>{assessmentStats.passCount} Pass</span>
              <span style={{ color: '#dc2626', fontWeight: 700 }}>{assessmentStats.failCount} Fail</span>
              <span style={{ color: '#111827', fontWeight: 700 }}>Pass Rate: {assessmentStats.passRate}%</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={handleSaveAssessments}
                style={{
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  color: '#374151',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Save Assessments
              </button>
              <button
                onClick={handlePublishResults}
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
                Publish Results
              </button>
              {saveMessage && (
                <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
          {publishMessage && (
            <div style={{ marginTop: '16px', fontSize: '14px', color: '#16a34a', fontWeight: 600 }}>
              {publishMessage}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BatchDetail;
