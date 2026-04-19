import React, { useEffect, useState } from 'react';
import { assessmentAPI } from '../services/api';

const AssessmentResults = ({ resultData, onNavigate }) => {
  const batchId = resultData?.batchId;
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadResults = async () => {
      if (!batchId) {
        setLoading(false);
        setError('Assessment results are not available for this batch.');
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await assessmentAPI.getAssessmentResultsPage(batchId);
        if (cancelled) return;
        setResults(data);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load assessment results', err);
          setError(err.message || 'Failed to load assessment results.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadResults();

    return () => {
      cancelled = true;
    };
  }, [batchId]);

  const handleExportCSV = () => {
    if (!results) {
      return;
    }

    const headers = ['#', 'Name', 'MCQ / 100', 'Practical / 100', 'Case Study / 100', 'Final %', 'Result'];
    const rows = (results.candidates || []).map((candidate, idx) => [
      candidate.rowNumber ?? idx + 1,
      candidate.candidateName,
      candidate.mcqScore,
      candidate.practicalScore,
      candidate.caseStudyScore,
      Number(candidate.finalPercentage ?? 0).toFixed(1),
      candidate.result,
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

  const handleBack = () => {
    if (onNavigate && resultData?.batchData) {
      onNavigate('BatchDetail', resultData.batchData);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#ffffff', padding: '28px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Assessment Results</h1>
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280', fontSize: '14px' }}>Loading assessment results...</div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div style={{ background: '#ffffff', padding: '28px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        {resultData?.batchData && (
          <button
            onClick={handleBack}
            style={{ marginBottom: '20px', border: 'none', background: 'none', color: '#2563eb', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            ← Back to Batch
          </button>
        )}
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', fontSize: '14px' }}>
          {error || 'Assessment results are not available.'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', padding: '28px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {resultData?.batchData && (
        <button
          onClick={handleBack}
          style={{ marginBottom: '20px', border: 'none', background: 'none', color: '#2563eb', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
        >
          ← Back to Batch
        </button>
      )}

      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>
        Assessment Results — {results.courseName}, {results.batchName}
      </h1>

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
        <span style={{ color: '#2563eb', fontSize: '16px' }}>i</span>
        <span style={{ fontSize: '13px', color: '#374151' }}>
          Course Weights: MCQ ({results.mcqWeight}%) | Practical ({results.practicalWeight}%) | Case Study ({results.caseStudyWeight}%) | Pass Threshold: {results.passThreshold}%
        </span>
        {results.published && (
          <span style={{ marginLeft: 'auto', background: '#dcfce7', color: '#166534', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 700 }}>
            Published
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'TOTAL ASSESSED', value: results.totalAssessed ?? 0, color: '#111827' },
          { label: 'PASS RATE', value: `${Number(results.passRate ?? 0).toFixed(1)}%`, color: '#16a34a' },
          { label: 'AVG SCORE', value: `${Number(results.averageScore ?? 0).toFixed(1)}%`, color: '#111827' },
          { label: 'HIGHEST SCORE', value: `${Number(results.highestScore ?? 0).toFixed(1)}%`, color: '#111827' },
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
          {(results.candidates || []).map((result, idx) => {
            const isPass = result.result === 'Pass';
            return (
              <tr key={`${result.rowNumber}-${result.candidateName}`} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ fontSize: '14px', color: '#6b7280', padding: '16px' }}>{result.rowNumber ?? idx + 1}</td>
                <td style={{ fontSize: '14px', fontWeight: 500, color: '#111827', padding: '16px' }}>{result.candidateName}</td>
                <td style={{ fontSize: '14px', color: '#374151', textAlign: 'center', padding: '16px' }}>{result.mcqScore}</td>
                <td style={{ fontSize: '14px', color: '#374151', textAlign: 'center', padding: '16px' }}>{result.practicalScore}</td>
                <td style={{ fontSize: '14px', color: '#374151', textAlign: 'center', padding: '16px' }}>{result.caseStudyScore}</td>
                <td style={{ fontSize: '14px', fontWeight: 700, color: '#111827', padding: '16px' }}>{Number(result.finalPercentage ?? 0).toFixed(1)}%</td>
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
                      {result.result}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
