import React, { useState, useMemo } from 'react';

const CANDIDATES = [
  { initials: 'PS', name: 'Priya Sharma', phone: '9876543210', course: 'Stitching', status: 'New', date: 'Mar 10, 2026', avatarColor: '#7c3aed' },
  { initials: 'KR', name: 'Kavita Rani', phone: '9876543211', course: 'Computers', status: 'Under Review', date: 'Mar 9, 2026', avatarColor: '#db2777' },
  { initials: 'SM', name: 'Sunita Mehra', phone: '9876543212', course: 'Beauty', status: 'Assigned', date: 'Mar 8, 2026', avatarColor: '#16a34a' },
  { initials: 'AK', name: 'Anita Kumari', phone: '9876543213', course: 'Stitching', status: 'Training', date: 'Mar 7, 2026', avatarColor: '#0891b2' },
  { initials: 'RP', name: 'Radha Patel', phone: '9876543214', course: 'Handicraft', status: 'Placed', date: 'Mar 5, 2026', avatarColor: '#ea580c' },
  { initials: 'MD', name: 'Meena Devi', phone: '9876543215', course: 'Computers', status: 'Draft', date: 'Mar 10, 2026', avatarColor: '#d97706' },
  { initials: 'LK', name: 'Lakshmi K.', phone: '9876543216', course: 'Food Enterprise', status: 'Selected', date: 'Mar 6, 2026', avatarColor: '#0284c7' },
  { initials: 'NB', name: 'Neha Banerjee', phone: '9876543217', course: 'Bag Making', status: 'Not Placed', date: 'Mar 3, 2026', avatarColor: '#9333ea' },
];

const STATUS_BADGE_STYLES = {
  New: { background: '#dbeafe', color: '#1d4ed8' },
  'Under Review': { background: '#fef3c7', color: '#92400e' },
  Assigned: { background: '#dcfce7', color: '#166534' },
  Training: { background: '#ccfbf1', color: '#0f766e' },
  Placed: { background: '#d1fae5', color: '#065f46' },
  Draft: { background: '#f3f4f6', color: '#6b7280' },
  Selected: { background: '#cffafe', color: '#0e7490' },
  'Not Placed': { background: '#fee2e2', color: '#b91c1c' },
};

const STATUS_OPTIONS = ['All Status', 'New', 'Under Review', 'Assigned', 'Training', 'Placed', 'Draft', 'Selected', 'Not Placed'];
const COURSE_OPTIONS = ['All Courses', 'Stitching', 'Computers', 'Beauty', 'Handicraft', 'Food Enterprise', 'Bag Making'];

const CandidateList = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return CANDIDATES.filter((candidate) => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || candidate.phone.includes(searchTerm);
      const matchesStatus = selectedStatus === 'All Status' || candidate.status === selectedStatus;
      const matchesCourse = selectedCourse === 'All Courses' || candidate.course === selectedCourse;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [searchTerm, selectedStatus, selectedCourse]);

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
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
          {STATUS_OPTIONS.map((status) => (
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
          {COURSE_OPTIONS.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
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
            {paginatedCandidates.map((candidate, idx) => {
              const badgeStyle = STATUS_BADGE_STYLES[candidate.status] || { background: '#f3f4f6', color: '#6b7280' };
              return (
                <tr
                  key={idx}
                  onClick={() => onNavigate('CandidateProfile', candidate)}
                  style={{
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: candidate.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {candidate.initials}
                      </div>
                      <span style={{ fontWeight: 500, color: '#111827' }}>{candidate.name}</span>
                    </div>
                  </td>
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
          </tbody>
        </table>
      </div>

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
