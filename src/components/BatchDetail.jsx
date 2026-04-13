import React, { useEffect, useMemo, useState } from 'react';
import { assessmentAPI, attendanceAPI, batchAPI, candidateAPI } from '../services/api';

const ATTENDANCE_SHORT = {
  PRESENT: 'P',
  ABSENT: 'A',
  LEAVE: 'L',
};

const ATTENDANCE_LONG = {
  P: 'PRESENT',
  A: 'ABSENT',
  L: 'LEAVE',
};

const getBatchId = (batchData) => {
  const rawValue = batchData?.rawId ?? batchData?.id;
  const numericValue = Number(rawValue);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const formatDate = (value) => {
  if (!value) return '—';
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '—';
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '—';
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

const formatStatus = (value) => {
  if (!value) return 'Assigned';
  return value
    .toString()
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (char) => char.toUpperCase());
};

const resolveAttendanceDateForBatch = (batch) => {
  if (!batch?.startDate || !batch?.endDate) return null;

  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];
  if (todayKey < batch.startDate) return batch.startDate;
  if (todayKey > batch.endDate) return batch.endDate;
  return todayKey;
};

const getAttendanceColor = (attendance) => {
  if (attendance >= 85) return '#16a34a';
  if (attendance >= 70) return '#d97706';
  return '#dc2626';
};

const calculateFinal = (draft, page) => {
  const mcq = Number(draft?.mcqScore ?? 0);
  const practical = Number(draft?.practicalScore ?? 0);
  const caseStudy = Number(draft?.caseStudyScore ?? 0);
  const mcqWeight = Number(page?.mcqWeight ?? 0);
  const practicalWeight = Number(page?.practicalWeight ?? 0);
  const caseStudyWeight = Number(page?.caseStudyWeight ?? 0);
  const total = (mcq * mcqWeight + practical * practicalWeight + caseStudy * caseStudyWeight) / 100;
  return Number(total.toFixed(1));
};

const buildAssessmentDraft = (page) => Object.fromEntries(
  (page?.candidates ?? []).map((candidate) => [candidate.candidateId, {
    mcqScore: candidate.mcqScore ?? 0,
    practicalScore: candidate.practicalScore ?? 0,
    caseStudyScore: candidate.caseStudyScore ?? 0,
    remarks: candidate.remarks ?? '',
  }])
);

const buildAttendanceDraft = (page) => Object.fromEntries(
  (page?.candidates ?? []).map((candidate) => [candidate.candidateId, ATTENDANCE_SHORT[candidate.todayStatus] ?? null])
);

const BatchDetail = ({ batchData, onNavigate }) => {
  const batchId = getBatchId(batchData);

  const [activeTab, setActiveTab] = useState('Candidates');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [batch, setBatch] = useState(null);
  const [batchCandidates, setBatchCandidates] = useState([]);
  const [attendancePage, setAttendancePage] = useState(null);
  const [attendanceDraft, setAttendanceDraft] = useState({});
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [assessmentPage, setAssessmentPage] = useState(null);
  const [assessmentDraft, setAssessmentDraft] = useState({});
  const [assessmentMessage, setAssessmentMessage] = useState('');
  const [savingAssessment, setSavingAssessment] = useState(false);
  const [publishingAssessment, setPublishingAssessment] = useState(false);

  const loadAttendancePage = async (attendanceDate) => {
    if (!batchId) return;
    const targetDate = attendanceDate || resolveAttendanceDateForBatch(batch);
    const response = await attendanceAPI.getAttendancePage(batchId, targetDate);
    setAttendancePage(response);
    setAttendanceDraft(buildAttendanceDraft(response));
  };

  const loadAssessmentPage = async () => {
    if (!batchId) return;
    const response = await assessmentAPI.getAssessmentPage(batchId);
    setAssessmentPage(response);
    setAssessmentDraft(buildAssessmentDraft(response));
  };

  useEffect(() => {
    const loadBatchDetail = async () => {
      if (!batchId) return;

      try {
        setLoading(true);
        setError(null);
        setAttendanceMessage('');
        setAssessmentMessage('');

        const batchResponse = await batchAPI.getBatchById(batchId);
        const initialAttendanceDate = resolveAttendanceDateForBatch(batchResponse);

        const [candidatesResult, attendanceResult, assessmentResult] = await Promise.allSettled([
          candidateAPI.getCandidatesByBatch(batchId),
          attendanceAPI.getAttendancePage(batchId, initialAttendanceDate),
          assessmentAPI.getAssessmentPage(batchId),
        ]);
        const candidatesResponse = candidatesResult.status === 'fulfilled' ? candidatesResult.value : null;
        const candidateList = candidatesResponse?.data ?? (Array.isArray(candidatesResponse) ? candidatesResponse : []);

        setBatch(batchResponse);
        setBatchCandidates(Array.isArray(candidateList) ? candidateList : []);

        if (attendanceResult.status === 'fulfilled') {
          setAttendancePage(attendanceResult.value);
          setAttendanceDraft(buildAttendanceDraft(attendanceResult.value));
        } else {
          setAttendancePage(null);
          setAttendanceDraft({});
        }

        if (assessmentResult.status === 'fulfilled') {
          setAssessmentPage(assessmentResult.value);
          setAssessmentDraft(buildAssessmentDraft(assessmentResult.value));
        } else {
          setAssessmentPage(null);
          setAssessmentDraft({});
        }
      } catch (err) {
        setError('Failed to load batch detail');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBatchDetail();
  }, [batchId]);

  const candidates = useMemo(() => {
    const attendanceById = new Map((attendancePage?.candidates ?? []).map((candidate) => [candidate.candidateId, candidate]));
    const sourceCandidates = batchCandidates.length > 0
      ? batchCandidates
      : (batch?.candidates ?? []).map((candidateId) => ({ candidateId }));

    return sourceCandidates.map((candidate, index) => {
      const candidateId = candidate.candidateId ?? candidate.id;
      const attendanceCandidate = attendanceById.get(candidateId);

      return {
        id: candidateId,
        rowNumber: attendanceCandidate?.rowNumber ?? index + 1,
        name: candidate.name ?? attendanceCandidate?.candidateName ?? `Candidate ${candidateId}`,
        phone: String(candidate.mobile ?? attendanceCandidate?.mobileNumber ?? '—'),
        status: formatStatus(candidate.status),
        attendancePercentage: attendanceCandidate?.attendancePercentage ?? 0,
        streakDays: attendanceCandidate?.streakDays ?? 0,
        alertLabel: attendanceCandidate?.alertLabel ?? null,
      };
    });
  }, [attendancePage, batch, batchCandidates]);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return candidates;
    return candidates.filter((candidate) =>
      candidate.name.toLowerCase().includes(query) || candidate.phone.toLowerCase().includes(query)
    );
  }, [candidates, search]);

  const assessmentSummary = useMemo(() => {
    const rows = assessmentPage?.candidates ?? [];
    if (rows.length === 0) {
      return { passCount: 0, failCount: 0, passRate: 0 };
    }

    let passCount = 0;
    let failCount = 0;
    rows.forEach((candidate) => {
      const finalScore = calculateFinal(assessmentDraft[candidate.candidateId], assessmentPage);
      if (finalScore >= Number(assessmentPage?.passThreshold ?? 50)) {
        passCount += 1;
      } else {
        failCount += 1;
      }
    });

    return {
      passCount,
      failCount,
      passRate: rows.length > 0 ? Number(((passCount / rows.length) * 100).toFixed(1)) : 0,
    };
  }, [assessmentDraft, assessmentPage]);

  const handleAttendanceChange = (candidateId, status) => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [candidateId]: prev[candidateId] === status ? null : status,
    }));
  };

  const handleMarkAllPresent = () => {
    const nextDraft = {};
    (attendancePage?.candidates ?? []).forEach((candidate) => {
      nextDraft[candidate.candidateId] = 'P';
    });
    setAttendanceDraft(nextDraft);
  };

  const handleSaveAttendance = async () => {
    if (!attendancePage?.candidates?.length) return;

    const entries = attendancePage.candidates
      .map((candidate) => {
        const currentStatus = attendanceDraft[candidate.candidateId] ?? ATTENDANCE_SHORT[candidate.todayStatus] ?? null;
        return currentStatus
          ? { candidateId: candidate.candidateId, attendanceStatus: ATTENDANCE_LONG[currentStatus] }
          : null;
      })
      .filter(Boolean);

    if (entries.length === 0) {
      setError('Mark attendance before saving.');
      return;
    }

    try {
      setSavingAttendance(true);
      setError(null);
      await attendanceAPI.saveAttendance(batchId, {
        attendanceDate: attendancePage.attendanceDate,
        entries,
      });
      await loadAttendancePage(attendancePage.attendanceDate);
      setAttendanceMessage('Attendance saved successfully.');
    } catch (err) {
      setError('Failed to save attendance');
      console.error(err);
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleScoreChange = (candidateId, field, value) => {
    const nextValue = value === '' ? '' : Math.max(0, Math.min(100, Number(value)));
    setAssessmentDraft((prev) => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        [field]: nextValue,
      },
    }));
  };

  const handleRemarksChange = (candidateId, value) => {
    setAssessmentDraft((prev) => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        remarks: value,
      },
    }));
  };

  const handleSaveAssessments = async () => {
    if (!assessmentPage?.candidates?.length) return;

    try {
      setSavingAssessment(true);
      setError(null);
      await assessmentAPI.saveAssessments(batchId, {
        entries: assessmentPage.candidates.map((candidate) => ({
          candidateId: candidate.candidateId,
          mcqScore: Number(assessmentDraft[candidate.candidateId]?.mcqScore ?? 0),
          practicalScore: Number(assessmentDraft[candidate.candidateId]?.practicalScore ?? 0),
          caseStudyScore: Number(assessmentDraft[candidate.candidateId]?.caseStudyScore ?? 0),
          remarks: assessmentDraft[candidate.candidateId]?.remarks ?? '',
        })),
      });
      await loadAssessmentPage();
      setAssessmentMessage('Assessments saved successfully.');
    } catch (err) {
      setError('Failed to save assessments');
      console.error(err);
    } finally {
      setSavingAssessment(false);
    }
  };

  const handlePublishResults = async () => {
    try {
      setPublishingAssessment(true);
      setError(null);
      await assessmentAPI.publishAssessments(batchId);
      await loadAssessmentPage();
      setAssessmentMessage('Results published successfully.');
    } catch (err) {
      setError('Failed to publish results');
      console.error(err);
    } finally {
      setPublishingAssessment(false);
    }
  };

  if (!batchId) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => onNavigate && onNavigate('BatchManagement')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Batches
        </button>
        <p className="text-gray-500">No batch selected.</p>
      </div>
    );
  }

  const enrolledCount = batch?.candidates?.length ?? candidates.length;
  const capacity = batch?.capacity ?? batchData?.max ?? 0;
  const occupancyPercent = capacity > 0 ? Math.round((enrolledCount / capacity) * 100) : 0;

  return (
    <div className="space-y-6">
      <button
        onClick={() => onNavigate && onNavigate('BatchManagement')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        ← Back to Batches
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{batch?.courseName || batchData?.course || 'Batch'} — {batch?.batchName || batchData?.id || batchId}</h1>
        <p className="text-sm text-gray-500 mt-1">Live batch detail, attendance, and assessment data.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-5 flex flex-wrap gap-10 items-center">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Trainer</p>
          <p className="text-sm font-semibold text-gray-900">{batch?.trainerName || batchData?.trainer || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Period</p>
          <p className="text-sm font-semibold text-gray-900">{formatDateRange(batch?.startDate, batch?.endDate) || batchData?.dates || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Capacity</p>
          <div className="flex items-center gap-2.5 mt-0.5">
            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(occupancyPercent, 100)}%` }} />
            </div>
            <span className="text-sm font-semibold text-gray-900">{enrolledCount}/{capacity || '—'}</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            {formatStatus(batch?.status || batchData?.status || 'Ongoing')}
          </span>
        </div>
      </div>

      <div className="flex gap-0 border-b-2 border-gray-200">
        {['Candidates', 'Attendance', 'Assessments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 -mb-0.5 transition ${
              activeTab === tab
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center text-gray-500 text-sm">Loading batch detail...</div>
      ) : activeTab === 'Candidates' ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-gray-500">Assigned candidates are loaded from the batch candidate and attendance APIs.</div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-72 h-10 px-3 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['#', 'Name', 'Phone', 'Status', 'Attendance %', 'Action'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">No candidates found for this batch.</td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3.5 text-sm text-gray-400">{candidate.rowNumber}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{candidate.name}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{candidate.phone}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: getAttendanceColor(candidate.attendancePercentage) }}>
                        {candidate.attendancePercentage}%
                        {candidate.alertLabel && <span className="ml-2 text-xs font-medium text-red-600">{candidate.alertLabel}</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => onNavigate && onNavigate('CandidateProfile', { id: candidate.id, name: candidate.name })}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : activeTab === 'Attendance' ? (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => attendancePage?.previousDate && loadAttendancePage(attendancePage.previousDate)}
                disabled={!attendancePage?.previousDate}
                className="w-9 h-9 border border-gray-200 rounded-md bg-white disabled:opacity-40"
              >
                ‹
              </button>
              <div className="text-base font-semibold text-gray-900 min-w-[220px]">{formatDate(attendancePage?.attendanceDate)}</div>
              <button
                onClick={() => attendancePage?.nextDate && loadAttendancePage(attendancePage.nextDate)}
                disabled={!attendancePage?.nextDate}
                className="w-9 h-9 border border-gray-200 rounded-md bg-white disabled:opacity-40"
              >
                ›
              </button>
            </div>
            <button
              onClick={handleMarkAllPresent}
              className="h-10 px-4 border border-blue-600 text-blue-600 bg-white rounded-md text-sm font-semibold"
            >
              Mark All Present
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 flex justify-between gap-3 flex-wrap">
            <span>Class {attendancePage?.classNumber ?? 0} of {attendancePage?.totalClasses ?? 0}</span>
            <span>Marked: {Object.values(attendanceDraft).filter(Boolean).length} / {attendancePage?.enrolledCount ?? 0}</span>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Attendance %', 'Today', 'Streak', 'Alert'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(attendancePage?.candidates ?? []).map((candidate) => {
                  const attendanceColor = getAttendanceColor(candidate.attendancePercentage ?? 0);
                  const todayStatus = attendanceDraft[candidate.candidateId];
                  return (
                    <tr key={candidate.candidateId} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{candidate.candidateName}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: attendanceColor }}>
                        {candidate.attendancePercentage ?? 0}%
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-2">
                          {['P', 'A', 'L'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleAttendanceChange(candidate.candidateId, status)}
                              className="w-9 h-9 rounded-full border text-xs font-bold"
                              style={{
                                borderColor: todayStatus === status ? 'transparent' : '#d1d5db',
                                background: todayStatus === status
                                  ? status === 'P'
                                    ? '#16a34a'
                                    : status === 'A'
                                    ? '#dc2626'
                                    : '#d97706'
                                  : '#ffffff',
                                color: todayStatus === status ? '#ffffff' : '#6b7280',
                              }}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{candidate.streakDays ?? 0} days</td>
                      <td className="px-4 py-3.5 text-sm text-red-600">{candidate.alertLabel || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm text-green-700 font-semibold">{attendanceMessage}</div>
            <button
              onClick={handleSaveAttendance}
              disabled={savingAttendance}
              className="h-10 px-5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-md disabled:opacity-60"
            >
              {savingAttendance ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-gray-700">
            Course weights: MCQ ({assessmentPage?.mcqWeight ?? 0}%) | Practical ({assessmentPage?.practicalWeight ?? 0}%) | Case Study ({assessmentPage?.caseStudyWeight ?? 0}%) | Pass threshold: {assessmentPage?.passThreshold ?? 50}%
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['#', 'Name', 'MCQ', 'Practical', 'Case Study', 'Final %', 'Result', 'Remarks'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(assessmentPage?.candidates ?? []).map((candidate, index) => {
                  const draft = assessmentDraft[candidate.candidateId] ?? {
                    mcqScore: 0,
                    practicalScore: 0,
                    caseStudyScore: 0,
                    remarks: '',
                  };
                  const finalScore = calculateFinal(draft, assessmentPage);
                  const isPass = finalScore >= Number(assessmentPage?.passThreshold ?? 50);

                  return (
                    <tr key={candidate.candidateId} className="border-b border-gray-100 last:border-0 align-top">
                      <td className="px-4 py-3.5 text-sm text-gray-400">{candidate.rowNumber ?? index + 1}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{candidate.candidateName}</td>
                      {['mcqScore', 'practicalScore', 'caseStudyScore'].map((field) => (
                        <td key={field} className="px-4 py-3.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={draft[field]}
                            onChange={(e) => handleScoreChange(candidate.candidateId, field, e.target.value)}
                            className="w-20 h-10 px-2 text-sm text-center border border-gray-200 rounded-md outline-none focus:border-blue-600"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{finalScore.toFixed(1)}%</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isPass ? 'Pass' : 'Fail'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <textarea
                          value={draft.remarks}
                          onChange={(e) => handleRemarksChange(candidate.candidateId, e.target.value)}
                          className="w-full min-w-[220px] h-20 px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-4 text-sm font-semibold">
              <span className="text-green-700">{assessmentSummary.passCount} Pass</span>
              <span className="text-red-700">{assessmentSummary.failCount} Fail</span>
              <span className="text-gray-900">Pass Rate: {assessmentSummary.passRate}%</span>
              {assessmentPage?.published && <span className="text-blue-700">Published</span>}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-green-700 font-semibold">{assessmentMessage}</span>
              <button
                onClick={handleSaveAssessments}
                disabled={savingAssessment}
                className="h-10 px-5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-md disabled:opacity-60"
              >
                {savingAssessment ? 'Saving...' : 'Save Assessments'}
              </button>
              <button
                onClick={handlePublishResults}
                disabled={publishingAssessment}
                className="h-10 px-5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-md disabled:opacity-60"
              >
                {publishingAssessment ? 'Publishing...' : 'Publish Results'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BatchDetail;