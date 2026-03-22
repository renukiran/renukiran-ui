import React, { useState } from 'react';

const CANDIDATES_DATA = [
  { id: 1, name: 'Priya S.', mcq: 85, practical: 90, caseStudy: 78, remarks: '' },
  { id: 2, name: 'Kavita R.', mcq: 60, practical: 45, caseStudy: 50, remarks: '' },
  { id: 3, name: 'Sunita M.', mcq: 70, practical: 80, caseStudy: 65, remarks: '' },
  { id: 4, name: 'Anita K.', mcq: 40, practical: 35, caseStudy: 30, remarks: 'Needs more practice with machine operation.' },
  { id: 5, name: 'Radha P.', mcq: 75, practical: 85, caseStudy: 70, remarks: '' },
];

const calculateFinal = (mcq, practical, caseStudy) => {
  const m = parseFloat(mcq) || 0;
  const p = parseFloat(practical) || 0;
  const c = parseFloat(caseStudy) || 0;
  return (m * 0.3 + p * 0.5 + c * 0.2).toFixed(1);
};

const AssessmentEntry = () => {
  const [activeTab, setActiveTab] = useState('Assessments');
  const [candidates, setCandidates] = useState(CANDIDATES_DATA);
  const [expandedRemarks, setExpandedRemarks] = useState(null);

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

  const calculateStats = () => {
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

  const stats = calculateStats();

  if (activeTab !== 'Assessments') {
    return (
      <div style={{ background: '#ffffff', padding: '28px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
          Stitching Basic — Batch 1
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
        Stitching Basic — Batch 1
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
            {['#', 'NAME', 'MCQ / 100', 'PRACTICAL / 100', 'CASE STUDY / 100', 'FINAL %', 'RESULT'].map(header => (
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
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td colSpan="7" style={{ padding: '0' }}>
                    <button
                      onClick={() => toggleRemarks(candidate.id)}
                      style={{
                        color: '#2563eb',
                        fontSize: '13px',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: '12px 16px',
                        textAlign: 'left',
                      }}
                    >
                      Remarks {isExpanded ? '▼' : ''}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                    <td colSpan="7" style={{ padding: '16px' }}>
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

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 0',
        borderTop: '1px solid #f3f4f6',
        marginTop: '16px',
      }}>
        <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
          <span style={{ color: '#16a34a', fontWeight: 700 }}>{stats.passCount} Pass</span>
          <span style={{ color: '#dc2626', fontWeight: 700 }}>{stats.failCount} Fail</span>
          <span style={{ color: '#111827', fontWeight: 700 }}>Pass Rate: {stats.passRate}%</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
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
        </div>
      </div>
    </div>
  );
};

export default AssessmentEntry;
