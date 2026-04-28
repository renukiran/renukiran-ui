import React, { useState, useMemo, useEffect } from 'react';
import { applicationAPI, batchAPI, admissionsAPI } from '../services/api';

const AVATAR_COLORS = ['#7c3aed', '#db2777', '#16a34a', '#0891b2', '#ea580c', '#d97706', '#0284c7', '#9333ea', '#be185d', '#0f766e'];

const TRACK_LABELS = {
  TAILORING: 'Tailoring',
  BEAUTY_AND_GROOMING: 'Beauty & Grooming',
  FOOD_BUSINESS: 'Food Business',
  HANDICRAFT: 'Handicraft',
  HOME_BASED_PRODUCTION: 'Home-Based Prod.',
  OTHER: 'Other',
};

const getInitials = (name) => {
  if (!name) return 'NA';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
};

const getAvatarColor = (index) => AVATAR_COLORS[index % AVATAR_COLORS.length];

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const STATUS_BADGE_STYLES = {
  New: { background: '#dbeafe', color: '#1d4ed8' },
  TRAINING_COMPLETED: { background: '#d1fae5', color: '#065f46' },
  ASSIGNED_TO_BATCH: { background: '#dcfce7', color: '#166534' },
  TRAINING_STARTED: { background: '#ccfbf1', color: '#0f766e' },
};

const STATUS_OPTIONS = ['All Status', 'New', 'ASSIGNED_TO_BATCH', 'TRAINING_STARTED', 'TRAINING_COMPLETED'];

const CandidateList = ({ onNavigate, filterData }) => {
  const [candidates, setCandidates] = useState([]);
  const [courseOptions, setCourseOptions] = useState(['All Courses']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(filterData?.status || 'All Status');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [assignCandidateId, setAssignCandidateId] = useState('');
  const [assignBatchId, setAssignBatchId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignStatus, setAssignStatus] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await applicationAPI.getApplications();
        const list = Array.isArray(res) ? res : res?.data ?? [];
        const mapped = [];
        let colorIdx = 0;
        list.forEach((a) => {
          const admissions = Array.isArray(a.admissions) && a.admissions.length > 0 ? a.admissions : [null];
          admissions.forEach((admission) => {
            const batchCourse = admission?.batch?.course?.courseName || admission?.batch?.courseName;
            mapped.push({
              id: admission?.id ?? a.id,
              candidateId: a.id,
              initials: getInitials(a.fullName),
              name: a.fullName ?? '—',
              phone: a.mobileNumber ?? '—',
              course: batchCourse || TRACK_LABELS[a.preferredExperienceTrack] || a.preferredExperienceTrack || '—',
              status: admission ? (admission.status ?? 'New') : 'New',
              date: formatDate(admission?.createdDate ?? a.createdDate),
              avatarColor: getAvatarColor(colorIdx++),
              raw: a,
              admission: admission,
            });
          });
        });
        setCandidates(mapped);
        const uniqueCourses = ['All Courses', ...new Set(mapped.map(c => c.course).filter(c => c !== '—'))];
        setCourseOptions(uniqueCourses);
      } catch (err) {
        setError('Failed to load candidates.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();

    batchAPI.getBatches()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.content ?? [];
        setBatches(list);
      })
      .catch(err => console.error('Failed to load batches', err));
  }, []);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || candidate.phone.includes(searchTerm);
      const matchesStatus = selectedStatus === 'All Status' || candidate.status === selectedStatus;
      const matchesCourse = selectedCourse === 'All Courses' || candidate.course === selectedCourse;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [candidates, searchTerm, selectedStatus, selectedCourse]);

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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => { setAssignCandidateId(''); setAssignBatchId(''); setAssignStatus(null); setShowAssignModal(true); }}
            style={{ background: '#fff', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Assign to Batch
          </button>
          <button
            onClick={() => onNavigate('Applications')}
            style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
            onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
          >
            + New Application
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280', fontSize: '14px' }}>Loading candidates...</div>
      ) : (
        <>
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
          {courseOptions.map((course) => (
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
                  onClick={() => onNavigate('CandidateProfile', candidate.raw)}
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
      </>
      )}

      {/* Assign to Batch Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Assign to Batch</h2>
              <button onClick={() => setShowAssignModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#9ca3af', cursor: 'pointer' }}>×</button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Candidate <span style={{ color: '#dc2626' }}>*</span></label>
                <select
                  value={assignCandidateId}
                  onChange={(e) => setAssignCandidateId(e.target.value)}
                  style={{ width: '100%', height: '40px', padding: '0 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                >
                  <option value="">Select candidate...</option>
                  {Array.from(new Map(candidates.map(c => [c.candidateId, c])).values()).map(c => (
                    <option key={c.candidateId} value={c.candidateId}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Batch <span style={{ color: '#dc2626' }}>*</span></label>
                <select
                  value={assignBatchId}
                  onChange={(e) => setAssignBatchId(e.target.value)}
                  style={{ width: '100%', height: '40px', padding: '0 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                >
                  <option value="">Select batch...</option>
                  {batches.map(b => (
                    <option key={b.id ?? b.rawId} value={b.id ?? b.rawId}>{b.batchName ?? b.id}</option>
                  ))}
                </select>
              </div>
              {assignStatus && (
                <p style={{ fontSize: '13px', fontWeight: 600, color: assignStatus.type === 'success' ? '#16a34a' : '#dc2626', margin: 0 }}>
                  {assignStatus.type === 'success' ? '✓ ' : '✗ '}{assignStatus.message}
                </p>
              )}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid #f3f4f6' }}>
              <button
                onClick={() => setShowAssignModal(false)}
                style={{ height: '38px', padding: '0 20px', fontSize: '14px', color: '#374151', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!assignCandidateId || !assignBatchId) {
                    setAssignStatus({ type: 'error', message: 'Please select both candidate and batch.' });
                    return;
                  }
                  setAssigning(true);
                  setAssignStatus(null);
                  try {
                    await admissionsAPI.assignToBatch(Number(assignCandidateId), Number(assignBatchId));
                    setAssignStatus({ type: 'success', message: 'Candidate assigned to batch successfully!' });
                  } catch (err) {
                    setAssignStatus({ type: 'error', message: err?.message || 'Failed to assign candidate.' });
                  } finally {
                    setAssigning(false);
                  }
                }}
                disabled={assigning}
                style={{ height: '38px', padding: '0 20px', fontSize: '14px', fontWeight: 600, color: '#fff', background: assigning ? '#93c5fd' : '#2563eb', border: 'none', borderRadius: '6px', cursor: assigning ? 'not-allowed' : 'pointer' }}
              >
                {assigning ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateList;
