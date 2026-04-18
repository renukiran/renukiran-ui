import React, { useEffect, useState } from 'react';
import { attendanceAPI, batchAPI, candidateAPI, courseAPI, trainerAPI } from '../services/api';
import { CreateBatchModal } from '../pages/BatchManagement';

const ATTENDANCE_CODES = ['P', 'A', 'L'];
const API_TO_UI_STATUS = {
  PRESENT: 'P',
  ABSENT: 'A',
  LEAVE: 'L',
};
const UI_TO_API_STATUS = {
  P: 'PRESENT',
  A: 'ABSENT',
  L: 'LEAVE',
};

const getAttendanceColor = (attendance) => {
  if (attendance >= 85) return '#16a34a';
  if (attendance >= 70) return '#d97706';
  return '#dc2626';
};

const calculateFinal = (mcq, practical, caseStudy) => {
  const mcqValue = parseFloat(mcq) || 0;
  const practicalValue = parseFloat(practical) || 0;
  const caseStudyValue = parseFloat(caseStudy) || 0;
  return (mcqValue * 0.3 + practicalValue * 0.5 + caseStudyValue * 0.2).toFixed(1);
};

const formatApiDate = (date) => {
  if (!(date instanceof Date)) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseApiDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const getInitialAttendanceDate = (attendanceDateValue, startDateValue, endDateValue) => {
  const requestedDate = parseApiDate(attendanceDateValue);
  if (requestedDate) return requestedDate;

  const today = new Date();
  const startDate = parseApiDate(startDateValue);
  const endDate = parseApiDate(endDateValue);

  if (startDate && today < startDate) return startDate;
  if (endDate && today > endDate) return endDate;
  return today;
};

const formatLongDate = (date) => {
  if (!(date instanceof Date)) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCandidateStatus = (status) => {
  if (!status) return '—';
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const mapAttendanceRows = (rows) => rows.map((row) => ({
  id: row.candidateId,
  name: row.candidateName ?? '—',
  phone: row.mobileNumber ?? '—',
  attendance: row.attendancePercentage ?? 0,
  streak: row.streakDays != null ? `${row.streakDays} day${row.streakDays === 1 ? '' : 's'}` : '—',
  absentNote: null,
  alert: row.alertLabel ?? null,
  apiStatus: row.todayStatus ?? null,
}));

const buildAttendanceSelection = (rows) => {
  const nextSelection = {};
  rows.forEach((row) => {
    nextSelection[row.id] = row.apiStatus ? API_TO_UI_STATUS[row.apiStatus] ?? null : null;
  });
  return nextSelection;
};

const BatchDetail = ({ batchData, onNavigate }) => {
  const batchId = batchData?.rawId ?? batchData?.id ?? batchData?.batchId;
  const [activeTab, setActiveTab] = useState(batchData?.initialTab ?? 'Candidates');
  const [currentDate, setCurrentDate] = useState(() => getInitialAttendanceDate(batchData?.attendanceDate, batchData?.startDate, batchData?.endDate));
  const [attendance, setAttendance] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [candidateError, setCandidateError] = useState('');
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState('');
  const [attendanceMeta, setAttendanceMeta] = useState({
    attendanceDate: null,
    previousDate: null,
    nextDate: null,
    classNumber: null,
    totalClasses: null,
    markedCount: 0,
    enrolledCount: 0,
  });
  const [expandedRemarks, setExpandedRemarks] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [publishMessage, setPublishMessage] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [profileLoadingId, setProfileLoadingId] = useState(null);
  const [savingAttendance, setSavingAttendance] = useState(false);

  useEffect(() => {
    setActiveTab(batchData?.initialTab ?? 'Candidates');
    setCurrentDate(getInitialAttendanceDate(batchData?.attendanceDate, batchData?.startDate, batchData?.endDate));
  }, [batchId, batchData?.attendanceDate, batchData?.initialTab, batchData?.startDate, batchData?.endDate]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([trainerAPI.getTrainers(), courseAPI.getCourses()])
      .then(([trainerData, courseData]) => {
        if (cancelled) return;
        setTrainers(Array.isArray(trainerData) ? trainerData : []);
        setCourses(Array.isArray(courseData) ? courseData : []);
      })
      .catch((err) => console.error('Failed to load trainers/courses', err));

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!batchId) {
      setCandidates([]);
      setCandidatesLoading(false);
      setCandidateError('Batch details are not available.');
      return undefined;
    }

    const loadCandidates = async () => {
      try {
        setCandidatesLoading(true);
        setCandidateError('');
        const data = await candidateAPI.getCandidatesByBatchId(batchId);
        if (cancelled) return;

        const list = Array.isArray(data) ? data : [];
        setCandidates(list.map((candidate) => ({
          id: candidate.candidateId,
          name: candidate.name ?? '—',
          phone: candidate.mobile ?? '—',
          status: formatCandidateStatus(candidate.status),
          mcq: 0,
          practical: 0,
          caseStudy: 0,
          remarks: '',
        })));
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load batch candidates', err);
          setCandidates([]);
          setCandidateError('Failed to load candidates for this batch.');
        }
      } finally {
        if (!cancelled) setCandidatesLoading(false);
      }
    };

    loadCandidates();

    return () => {
      cancelled = true;
    };
  }, [batchId]);

  useEffect(() => {
    let cancelled = false;

    if (!batchId) {
      setAttendanceRows([]);
      setAttendanceLoading(false);
      setAttendanceError('Batch details are not available.');
      return undefined;
    }

    const loadAttendance = async () => {
      const requestedDate = formatApiDate(currentDate);

      try {
        setAttendanceLoading(true);
        setAttendanceError('');
        const data = await attendanceAPI.getAttendancePage(batchId, requestedDate);
        if (cancelled) return;

        const rows = mapAttendanceRows(Array.isArray(data?.candidates) ? data.candidates : []);
        setAttendanceRows(rows);
        setAttendance(buildAttendanceSelection(rows));
        setAttendanceMeta({
          attendanceDate: data?.attendanceDate ?? requestedDate,
          previousDate: data?.previousDate ?? null,
          nextDate: data?.nextDate ?? null,
          classNumber: data?.classNumber ?? null,
          totalClasses: data?.totalClasses ?? null,
          markedCount: data?.markedCount ?? 0,
          enrolledCount: data?.enrolledCount ?? rows.length,
        });

        if (data?.attendanceDate && data.attendanceDate !== requestedDate) {
          const resolvedDate = parseApiDate(data.attendanceDate);
          if (resolvedDate) setCurrentDate(resolvedDate);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load attendance page', err);
          setAttendanceRows([]);
          setAttendance({});
          setAttendanceError(err.message || 'Failed to load attendance.');
        }
      } finally {
        if (!cancelled) setAttendanceLoading(false);
      }
    };

    loadAttendance();

    return () => {
      cancelled = true;
    };
  }, [batchId, currentDate]);

  const attendanceByCandidateId = {};
  attendanceRows.forEach((row) => {
    attendanceByCandidateId[row.id] = row;
  });

  const handlePrevDay = () => {
    if (attendanceMeta.previousDate) {
      const previousDate = parseApiDate(attendanceMeta.previousDate);
      if (previousDate) setCurrentDate(previousDate);
    }
  };

  const handleNextDay = () => {
    if (attendanceMeta.nextDate) {
      const nextDate = parseApiDate(attendanceMeta.nextDate);
      if (nextDate) setCurrentDate(nextDate);
    }
  };

  const handleAttendanceChange = (candidateId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [candidateId]: previous[candidateId] === status ? null : status,
    }));
  };

  const handleMarkAllPresent = () => {
    const nextAttendance = {};
    attendanceRows.forEach((candidate) => {
      nextAttendance[candidate.id] = 'P';
    });
    setAttendance(nextAttendance);
    setAttendanceError('');
  };

  const handleSaveAttendance = async () => {
    if (!batchId) {
      setAttendanceError('Batch details are not available.');
      return;
    }

    const missingStatuses = attendanceRows.filter((candidate) => !attendance[candidate.id]);
    if (missingStatuses.length > 0) {
      setAttendanceError('Mark attendance for all candidates before saving.');
      return;
    }

    const request = {
      attendanceDate: formatApiDate(currentDate),
      entries: attendanceRows.map((candidate) => ({
        candidateId: candidate.id,
        attendanceStatus: UI_TO_API_STATUS[attendance[candidate.id]],
      })),
    };

    try {
      setSavingAttendance(true);
      setAttendanceError('');
      setSaveMessage('');

      const response = await attendanceAPI.saveAttendance(batchId, request);
      const refreshedPage = await attendanceAPI.getAttendancePage(batchId, request.attendanceDate);
      const refreshedRows = mapAttendanceRows(Array.isArray(refreshedPage?.candidates) ? refreshedPage.candidates : []);

      setAttendanceRows(refreshedRows);
      setAttendance(buildAttendanceSelection(refreshedRows));
      setAttendanceMeta({
        attendanceDate: refreshedPage?.attendanceDate ?? request.attendanceDate,
        previousDate: refreshedPage?.previousDate ?? null,
        nextDate: refreshedPage?.nextDate ?? null,
        classNumber: refreshedPage?.classNumber ?? null,
        totalClasses: refreshedPage?.totalClasses ?? null,
        markedCount: refreshedPage?.markedCount ?? response?.markedCount ?? 0,
        enrolledCount: refreshedPage?.enrolledCount ?? response?.enrolledCount ?? refreshedRows.length,
      });
      setSaveMessage(response?.message || 'Attendance saved successfully');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (err) {
      console.error('Failed to save attendance', err);
      setAttendanceError(err.message || 'Failed to save attendance.');
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleViewProfile = async (candidateId) => {
    try {
      setProfileLoadingId(candidateId);
      setCandidateError('');
      const data = await candidateAPI.getCandidateById(candidateId);
      if (onNavigate) onNavigate('CandidateProfile', data);
    } catch (err) {
      console.error('Failed to load candidate profile', err);
      setCandidateError('Failed to load candidate profile.');
    } finally {
      setProfileLoadingId(null);
    }
  };

  const handleScoreChange = (id, field, value) => {
    setCandidates((previous) => previous.map((candidate) => (
      candidate.id === id ? { ...candidate, [field]: value } : candidate
    )));
  };

  const handleRemarksChange = (id, value) => {
    setCandidates((previous) => previous.map((candidate) => (
      candidate.id === id ? { ...candidate, remarks: value } : candidate
    )));
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

    candidates.forEach((candidate) => {
      const finalScore = parseFloat(calculateFinal(candidate.mcq, candidate.practical, candidate.caseStudy));
      if (finalScore >= 50) passCount += 1;
      else failCount += 1;
    });

    const passRate = candidates.length > 0 ? ((passCount / candidates.length) * 100).toFixed(1) : 0;
    return { passCount, failCount, passRate };
  };

  const markedCount = attendanceRows.filter((candidate) => attendance[candidate.id]).length;
  const enrolledCount = attendanceMeta.enrolledCount || attendanceRows.length;
  const assessmentStats = calculateAssessmentStats();
  const pageTitle = batchData?.courseName
    ? `${batchData.courseName} — ${batchData?.batchName ?? batchData?.id ?? 'Batch'}`
    : batchData?.batchName ?? batchData?.id ?? 'Batch';

  return (
    <div style={{ background: '#ffffff', padding: '28px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>
          {pageTitle}
        </h1>
        <button
          onClick={() => setShowAssignModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: '#fff', border: '1px solid #2563eb', color: '#2563eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
        >
          Assign Trainer
        </button>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
        {['Candidates', 'Attendance', 'Assessments'].map((tab) => {
          const isDisabled = tab === 'Assessments';
          return (
            <button
              key={tab}
              onClick={() => !isDisabled && setActiveTab(tab)}
              disabled={isDisabled}
              style={{
                padding: '12px 16px',
                fontSize: '14px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                border: 'none',
                background: 'none',
                color: isDisabled ? '#d1d5db' : activeTab === tab ? '#2563eb' : '#6b7280',
                borderBottom: activeTab === tab && !isDisabled ? '2px solid #2563eb' : 'none',
                fontWeight: activeTab === tab && !isDisabled ? 600 : 400,
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === 'Candidates' && (
        <>
          {candidateError && (
            <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '8px', background: '#fef2f2', color: '#b91c1c', fontSize: '14px' }}>
              {candidateError}
            </div>
          )}
          {candidatesLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '14px' }}>Loading candidates...</div>
          ) : candidates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '14px' }}>No candidates found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['#', 'NAME', 'PHONE', 'STATUS', 'ATTENDANCE %', 'ACTION'].map((header) => (
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
                  const attendanceCandidate = attendanceByCandidateId[candidate.id];
                  const attendancePercentage = attendanceCandidate?.attendance ?? 0;

                  return (
                    <tr key={candidate.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ fontSize: '14px', color: '#6b7280', padding: '14px 16px' }}>{index + 1}</td>
                      <td style={{ fontSize: '14px', fontWeight: 500, color: '#111827', padding: '14px 16px' }}>{candidate.name}</td>
                      <td style={{ fontSize: '14px', color: '#374151', padding: '14px 16px' }}>{candidate.phone}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: '#ccfbf1', color: '#0f766e', borderRadius: '12px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>
                          {candidate.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '14px', fontWeight: 600, color: getAttendanceColor(attendancePercentage), padding: '14px 16px' }}>
                        {attendancePercentage}%
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => handleViewProfile(candidate.id)}
                          disabled={profileLoadingId === candidate.id}
                          style={{ color: '#2563eb', fontSize: '13px', cursor: 'pointer', background: 'none', border: 'none', padding: 0, opacity: profileLoadingId === candidate.id ? 0.6 : 1 }}
                        >
                          {profileLoadingId === candidate.id ? 'Loading...' : 'View Profile'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === 'Attendance' && (
        <>
          {attendanceError && (
            <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '8px', background: '#fef2f2', color: '#b91c1c', fontSize: '14px' }}>
              {attendanceError}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={handlePrevDay}
              disabled={!attendanceMeta.previousDate}
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                background: '#fff',
                cursor: attendanceMeta.previousDate ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                opacity: attendanceMeta.previousDate ? 1 : 0.5,
              }}
            >
              ‹
            </button>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827', minWidth: '220px' }}>
              {formatLongDate(currentDate)}
            </div>
            <button
              onClick={handleNextDay}
              disabled={!attendanceMeta.nextDate}
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                background: '#fff',
                cursor: attendanceMeta.nextDate ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                opacity: attendanceMeta.nextDate ? 1 : 0.5,
              }}
            >
              ›
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 20px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              marginBottom: '20px',
              background: '#fff',
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                Class {attendanceMeta.classNumber ?? '—'} of {attendanceMeta.totalClasses ?? '—'}
              </span>
              <span style={{ color: '#6b7280' }}>|</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Marked: {markedCount} / {enrolledCount}</span>
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

          {attendanceLoading && attendanceRows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '14px' }}>Loading attendance...</div>
          ) : attendanceRows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '14px' }}>No attendance candidates found.</div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead>
                  <tr>
                    {['NAME', 'ATTENDANCE %', 'TODAY', 'STREAK', 'ALERT'].map((header) => (
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
                  {attendanceRows.map((candidate) => {
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
                            {ATTENDANCE_CODES.map((status) => (
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {[
                    { label: 'P Present', color: '#16a34a' },
                    { label: 'A Absent', color: '#dc2626' },
                    { label: 'L Leave', color: '#d97706' },
                  ].map((item) => (
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
                    disabled={savingAttendance || attendanceRows.length === 0}
                    style={{
                      background: '#1e3a5f',
                      color: 'white',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: savingAttendance ? 'not-allowed' : 'pointer',
                      border: 'none',
                      opacity: savingAttendance ? 0.7 : 1,
                    }}
                  >
                    {savingAttendance ? 'Saving...' : 'Save Attendance'}
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
        </>
      )}

      {activeTab === 'Assessments' && (
        <>
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '12px 18px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#2563eb', fontSize: '16px' }}>i</span>
            <span style={{ fontSize: '13px', color: '#374151' }}>
              Course Weights: MCQ (30%) | Practical (50%) | Case Study (20%) | Pass Threshold: 50%
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr>
                {['#', 'NAME', 'MCQ / 100', 'PRACTICAL / 100', 'CASE STUDY / 100', 'FINAL %', 'RESULT', 'REMARKS'].map((header) => (
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
                          onChange={(event) => handleScoreChange(candidate.id, 'mcq', event.target.value)}
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
                          onChange={(event) => handleScoreChange(candidate.id, 'practical', event.target.value)}
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
                          onChange={(event) => handleScoreChange(candidate.id, 'caseStudy', event.target.value)}
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
                          {isPass ? 'Pass' : 'Fail'}
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
                              onChange={(event) => handleRemarksChange(candidate.id, event.target.value)}
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 0',
              borderTop: '1px solid #f3f4f6',
              marginTop: '16px',
            }}
          >
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

      {showAssignModal && (
        <CreateBatchModal
          mode="assign"
          onClose={() => setShowAssignModal(false)}
          onSave={async (data) => {
            try {
              await batchAPI.updateBatch(batchId, {
                batchName: data.batchName,
                courseId: data.courseId,
                trainerId: data.trainerId,
                startDate: data.startDate,
                endDate: data.endDate,
                capacity: data.capacity,
              });
              const assignedTrainer = trainers.find((trainer) => trainer.trainerId === data.trainerId);
              if (assignedTrainer && batchData) {
                batchData.trainerId = data.trainerId;
                batchData.trainer = assignedTrainer.name;
              }
              setShowAssignModal(false);
            } catch (err) {
              console.error('Failed to assign trainer', err);
            }
          }}
          nextId={batchData?.id ?? batchData?.batchId ?? ''}
          courses={courses}
          trainers={trainers}
          batch={batchData}
        />
      )}
    </div>
  );
};

export default BatchDetail;