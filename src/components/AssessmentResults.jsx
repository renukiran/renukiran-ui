import React, { useState } from 'react';

const RESULTS_DATA = [
  { id: 1, name: 'Priya S.', mcq: 85, practical: 90, caseStudy: 78, final: 86.1 },
  { id: 2, name: 'Kavita R.', mcq: 60, practical: 45, caseStudy: 50, final: 50.0 },
  { id: 3, name: 'Sunita M.', mcq: 70, practical: 80, caseStudy: 65, final: 74.0 },
  { id: 4, name: 'Anita K.', mcq: 40, practical: 35, caseStudy: 30, final: 35.0 },
  { id: 5, name: 'Radha P.', mcq: 75, practical: 85, caseStudy: 70, final: 79.0 },
];

const AssessmentResults = () => {
  const [results] = useState(RESULTS_DATA);

  const calculateStats = () => {
    let passCount = 0;
    let failCount = 0;
    let totalScore = 0;
    let highestScore = 0;

    results.forEach(r => {
      if (r.final >= 50) passCount++;
      else failCount++;
      totalScore += r.final;
      if (r.final > highestScore) highestScore = r.final;
    });

    const avgScore = (totalScore / results.length).toFixed(1);
    const passRate = ((passCount / results.length) * 100).toFixed(0);

    return { passCount, failCount, avgScore, passRate, highestScore };
  };

  const stats = calculateStats();

  const handleExportCSV = () => {
    const headers = ['#', 'Name', 'MCQ / 100', 'Practical / 100', 'Case Study / 100', 'Final %', 'Result'];
    const rows = results.map((r, idx) => [
      idx + 1,
      r.name,
      r.mcq,
      r.practical,
      r.caseStudy,
      r.final.toFixed(1),
      r.final >= 50 ? 'Pass' : 'Fail',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assessment_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: '#ffffff', padding: '28px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>
        Assessment Results — Stitching Basic, Batch 1
      </h1>

      {/* Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'TOTAL ASSESSED', value: results.length, color: '#111827' },
          { label: 'PASS RATE', value: `${stats.passRate}%`, color: '#16a34a' },
          { label: 'AVG SCORE', value: `${stats.avgScore}%`, color: '#111827' },
          { label: 'HIGHEST SCORE', value: `${stats.highestScore.toFixed(1)}%`, color: '#111827' },
        ].map((card, idx) => (
          <div
            key={idx}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '20px 22px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 600 }}>
              {card.label}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Results Table */}
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
          {results.map((result, idx) => {
            const isPass = result.final >= 50;
            return (
              <tr key={result.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ fontSize: '14px', color: '#6b7280', padding: '16px' }}>{idx + 1}</td>
                <td style={{ fontSize: '14px', fontWeight: 500, color: '#111827', padding: '16px' }}>{result.name}</td>
                <td style={{ fontSize: '14px', color: '#374151', textAlign: 'center', padding: '16px' }}>{result.mcq}</td>
                <td style={{ fontSize: '14px', color: '#374151', textAlign: 'center', padding: '16px' }}>{result.practical}</td>
                <td style={{ fontSize: '14px', color: '#374151', textAlign: 'center', padding: '16px' }}>{result.caseStudy}</td>
                <td style={{ fontSize: '14px', fontWeight: 700, color: '#111827', padding: '16px' }}>{result.final.toFixed(1)}%</td>
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
            );
          })}
        </tbody>
      </table>

      {/* Export Button */}
      <div style={{ marginTop: '24px' }}>
        <button
          onClick={handleExportCSV}
          style={{
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#374151',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          📥 Export CSV
        </button>
      </div>
    </div>
  );
};

export default AssessmentResults;
