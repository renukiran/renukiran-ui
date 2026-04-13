import React, { useEffect, useMemo, useState } from 'react';
import { candidateAPI } from '../services/api';
import {
  formatCandidateStatus,
  formatDisplayDate,
} from '../utils/applicationForm';

const STATUS_BADGE_STYLES = {
  New: { background: '#dbeafe', color: '#1d4ed8' },
  Assigned: { background: '#dcfce7', color: '#166534' },
  Training: { background: '#ccfbf1', color: '#0f766e' },
  'Placement Pending': { background: '#fef3c7', color: '#92400e' },
  Placed: { background: '#d1fae5', color: '#065f46' },
};

const CandidateList = ({ onNavigate }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await candidateAPI.getCandidates();
        const list = Array.isArray(response) ? response : [];
        setCandidates(list.map((candidate) => ({
          id: candidate.candidateId,
          name: candidate.name || 'N/A',
          phone: candidate.mobile || 'N/A',
          course: candidate.courseName || 'N/A',
          status: formatCandidateStatus(candidate.status),
          date: formatDisplayDate(candidate.createdDate),
        })));
      } catch (loadError) {
        setError(loadError?.message || 'Failed to load candidates.');
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const statusOptions = ['All Status', ...new Set(candidates.map((candidate) => candidate.status).filter(Boolean))];
  const courseOptions = ['All Courses', ...new Set(candidates.map((candidate) => candidate.course).filter(Boolean))];

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || candidate.phone.includes(searchTerm);
      const matchesStatus = selectedStatus === 'All Status' || candidate.status === selectedStatus;
      const matchesCourse = selectedCourse === 'All Courses' || candidate.course === selectedCourse;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [candidates, searchTerm, selectedStatus, selectedCourse]);

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 7;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(1);
      if (currentPage > 3) buttons.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!buttons.includes(i)) buttons.push(i);
      }
      if (currentPage < totalPages - 2) buttons.push('...');
      buttons.push(totalPages);
    }
    return buttons;
  };

  return (
    <div style={{ background: '#ffffff', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 }}>Candidates</h1>
        <button
          onClick={() => onNavigate('Applications')}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
          onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
        >
          + New Application
        </button>
      </div>

      {error && <div style={{ color: '#b91c1c', marginBottom: '16px' }}>{error}</div>}

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '320px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '16px' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: '100%',
              padding: '9px 14px 9px 36px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '9px 32px 9px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            background: 'white',
            fontFamily: 'inherit',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            paddingRight: '32px',
          }}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Course Dropdown */}
        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '9px 32px 9px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            background: 'white',
            fontFamily: 'inherit',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            paddingRight: '32px',
          }}
        >
          {courseOptions.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ color: '#6b7280' }}>Loading candidates...</div>
      ) : (
        <div style={{ overflowX: 'auto', marginBottom: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <th style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', fontWeight: 600, padding: '10px 16px', textAlign: 'left', textTransform: 'uppercase' }}>
                  Name
                </th>
                <th style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', fontWeight: 600, padding: '10px 16px', textAlign: 'left', textTransform: 'uppercase' }}>
                  Phone
                </th>
                <th style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', fontWeight: 600, padding: '10px 16px', textAlign: 'left', textTransform: 'uppercase' }}>
                  Course
                </th>
                <th style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', fontWeight: 600, padding: '10px 16px', textAlign: 'left', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', fontWeight: 600, padding: '10px 16px', textAlign: 'left', textTransform: 'uppercase' }}>
                  Date Applied
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCandidates.map((candidate) => {
                const badgeStyle = STATUS_BADGE_STYLES[candidate.status] || { background: '#f3f4f6', color: '#6b7280' };
                return (
                  <tr
                    key={candidate.id}
                    onClick={() => onNavigate('CandidateProfile', { id: candidate.id, name: candidate.name })}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#111827', fontWeight: 600 }}>{candidate.name}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>{candidate.phone}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>{candidate.course}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>
                      <span
                        style={{
                          background: badgeStyle.background,
                          color: badgeStyle.color,
                          borderRadius: '12px',
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'inline-block',
                        }}
                      >
                        {candidate.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>{candidate.date}</td>
                  </tr>
                );
              })}
              {paginatedCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '24px 16px', color: '#6b7280', textAlign: 'center' }}>
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          Showing {filteredCandidates.length === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length} candidates
        </span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              fontSize: '13px',
              border: '1px solid #e5e7eb',
              background: 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              fontFamily: 'inherit',
            }}
          >
            ‹
          </button>
          {getPaginationButtons().map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                fontSize: '13px',
                border: currentPage === page ? 'none' : '1px solid #e5e7eb',
                background: currentPage === page ? '#2563eb' : 'white',
                color: currentPage === page ? 'white' : '#374151',
                cursor: page === '...' ? 'default' : 'pointer',
                fontFamily: 'inherit',
                fontWeight: currentPage === page ? 600 : 400,
              }}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              fontSize: '13px',
              border: '1px solid #e5e7eb',
              background: 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              fontFamily: 'inherit',
            }}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
