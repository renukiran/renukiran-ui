import React, { useState, useEffect } from 'react';
import { batchAPI, courseAPI, trainerAPI, candidateAPI } from '../services/api';

const STATUS_BADGE = {
  Ongoing: 'bg-green-100 text-green-700',
  Upcoming: 'bg-blue-100 text-blue-700',
  Completed: 'bg-gray-100 text-gray-500',
};

const capacityBarColor = (pct) => {
  if (pct >= 95) return 'bg-red-500';
  if (pct >= 80) return 'bg-yellow-400';
  return 'bg-green-500';
};

const computeBatchStatus = (startDate, endDate) => {
  if (!startDate) return 'Upcoming';
  const today = new Date().toISOString().split('T')[0];
  if (startDate > today) return 'Upcoming';
  if (endDate && endDate < today) return 'Completed';
  return 'Ongoing';
};

const formatDateRange = (s, e) => {
  if (!s || !e) return '—';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [, sm] = s.split('-');
  const [ey, em] = e.split('-');
  return `${months[parseInt(sm) - 1]} – ${months[parseInt(em) - 1]} ${ey}`;
};

// ── CreateBatchModal ───────────────────────────────────────────────────────────
export const CreateBatchModal = ({ onClose, onSave, nextId, courses, trainers, mode = 'create', batch = null }) => {
  const isAssign = mode === 'assign';

  console.log('CreateBatchModal - mode:', mode);
  console.log('CreateBatchModal - batch:', batch);
  console.log('CreateBatchModal - courses:', courses);
  console.log('CreateBatchModal - trainers:', trainers);

  // Resolve courseId and trainerId from form or defaults
  const resolvedCourseId = batch?.courseId || '';
  const resolvedTrainerId = batch?.trainerId || '';

  console.log('Resolved courseId:', resolvedCourseId);
  console.log('Resolved trainerId:', resolvedTrainerId);

  const [form, setForm] = useState({
    courseId: resolvedCourseId,
    batchName: batch?.batchName || batch?.id || nextId,
    trainerId: resolvedTrainerId,
    location: batch?.location || '',
    startDate: batch?.startDate || '',
    endDate: batch?.endDate || '',
    capacity: batch?.max?.toString() || batch?.capacity?.toString() || '20',
  });
  const [errors, setErrors] = useState({});

  // Re-resolve trainerId once trainers list loads (async)
  React.useEffect(() => {
    if (isAssign && !form.trainerId && trainers.length > 0 && batch?.trainerId) {
      setForm(prev => ({ ...prev, trainerId: batch.trainerId }));
    }
  }, [trainers]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-resolve courseId once courses list loads (async)
  React.useEffect(() => {
    if (isAssign && !form.courseId && courses.length > 0 && batch?.courseId) {
      setForm(prev => ({ ...prev, courseId: batch.courseId }));
    }
  }, [courses]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const fmtMonth = (d) => {
    if (!d) return '—';
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [, m, day] = d.split('-');
    return `${parseInt(day)} ${months[parseInt(m) - 1]}`;
  };

  const validate = () => {
    const e = {};
    if (isAssign) {
      if (!form.trainerId) e.trainerId = 'Select a trainer';
    } else {
      if (!form.courseId) e.courseId = 'Select a course';
      if (!form.batchName.trim()) e.batchName = 'Batch name is required';
      if (!form.trainerId) e.trainerId = 'Select a trainer';
      if (!form.startDate) e.startDate = 'Set a start date';
      if (!form.endDate) e.endDate = 'Set an end date';
      else if (form.startDate && form.endDate < form.startDate) e.endDate = 'End date must be after start date';
      const cap = Number(form.capacity);
      if (!form.capacity || !Number.isFinite(cap) || cap < 1 || cap > 100) e.capacity = 'Capacity must be 1–100';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    console.log('Form data before submit:', form);
    console.log('Course ID type:', typeof form.courseId, 'Value:', form.courseId);
    console.log('Trainer ID type:', typeof form.trainerId, 'Value:', form.trainerId);
    
    const trainerId = form.trainerId ? Number(form.trainerId) : null;
    const courseId = form.courseId ? Number(form.courseId) : null;
    
    if (!courseId || isNaN(courseId)) {
      console.error('Invalid course ID:', form.courseId);
      setErrors({ courseId: 'Invalid course selected' });
      return;
    }
    
    if (!trainerId || isNaN(trainerId)) {
      console.error('Invalid trainer ID:', form.trainerId);
      setErrors({ trainerId: 'Invalid trainer selected' });
      return;
    }
    
    if (isAssign) {
      onSave({
        batchId: batch?.rawId,
        batchName: form.batchName,
        courseId: courseId,
        trainerId: trainerId,
        startDate: form.startDate,
        endDate: form.endDate,
        capacity: parseInt(form.capacity),
      });
    } else {
      const payload = {
        batchName: form.batchName.trim(),
        courseId: courseId,
        trainerId: trainerId,
        startDate: form.startDate,
        endDate: form.endDate,
        capacity: parseInt(form.capacity),
      };
      console.log('Payload being sent:', payload);
      onSave(payload);
    }
    onClose();
  };

  const isValid = isAssign
    ? !!form.trainerId
    : form.courseId && form.batchName.trim() && form.trainerId &&
      form.startDate && form.endDate && form.endDate >= form.startDate &&
      Number(form.capacity) >= 1 && Number(form.capacity) <= 100;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xl">
              {isAssign ? '👤' : '🗂'}
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{isAssign ? 'Assign Trainer' : 'Create Batch'}</div>
              <div className="text-xs text-gray-500 mt-0.5">{isAssign ? 'Assign a trainer to this batch.' : 'Assign course, trainer, dates and capacity for a new cohort.'}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-xl transition"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Batch Setup</p>

          {/* Summary strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Batch Name', value: form.batchName || nextId },
              { label: 'Capacity', value: `${form.capacity || 20} seats` },
              { label: 'Starts', value: form.startDate ? fmtMonth(form.startDate) : '—' },
            ].map((h) => (
              <div key={h.label} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-center">
                <div className="text-xs text-gray-400">{h.label}</div>
                <div className="text-sm font-semibold text-gray-800 mt-0.5">{h.value}</div>
              </div>
            ))}
          </div>

          {/* Course + Batch Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                value={form.courseId}
                onChange={(e) => {
                  console.log('Course selected:', e.target.value);
                  set('courseId', e.target.value);
                }}
                disabled={isAssign}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 appearance-none ${
                  isAssign ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : errors.courseId ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <option value="">Select course...</option>
                {(courses || []).map((c) => {
                  console.log('Course option:', c);
                  return <option key={c.id} value={c.id}>{c.courseName}</option>;
                })}
              </select>
              {errors.courseId && <p className="text-xs text-red-500 mt-1">{errors.courseId}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Batch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.batchName}
                onChange={(e) => set('batchName', e.target.value)}
                disabled={isAssign}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
                  isAssign ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : errors.batchName ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.batchName ? (
                <p className="text-xs text-red-500 mt-1">{errors.batchName}</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Auto-filled, editable before save.</p>
              )}
            </div>
          </div>

          {/* Trainer + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Trainer <span className="text-red-500">*</span>
              </label>
              <select
                value={form.trainerId}
                onChange={(e) => {
                  console.log('Trainer selected:', e.target.value);
                  set('trainerId', e.target.value);
                }}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 appearance-none ${
                  errors.trainerId ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <option value="">Select trainer...</option>
                {(trainers || []).map((t) => {
                  console.log('Trainer option:', t);
                  return <option key={t.userId} value={t.userId}>{t.name || t.firstName || t.username}</option>;
                })}
              </select>
              {errors.trainerId && <p className="text-xs text-red-500 mt-1">{errors.trainerId}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="e.g., Garhi Centre - Room 2"
                disabled={isAssign}
                className={`w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
                  isAssign ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          {/* Start + End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
                disabled={isAssign}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
                  isAssign ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : errors.startDate ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
                disabled={isAssign}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
                  isAssign ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : errors.endDate ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Capacity only (status computed from dates) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Max Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => set('capacity', e.target.value)}
                min="1"
                max="100"
                disabled={isAssign}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
                  isAssign ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : errors.capacity ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Notes for Operations</label>
            <textarea
              value={form.notes || ''}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Optional logistics notes for classroom setup, equipment, or scheduling."
              rows={3}
              disabled={isAssign}
              className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none ${
                isAssign ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {isValid ? (isAssign ? 'Ready to save trainer.' : 'Ready to create batch.') : (isAssign ? 'Select a trainer to continue.' : 'Complete all required fields to continue.')}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="h-10 px-5 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`h-10 px-5 text-sm font-semibold rounded-md transition ${
                isValid
                  ? 'bg-blue-700 hover:bg-blue-800 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isAssign ? 'Save Trainer' : 'Create Batch'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BatchManagement = ({ onNavigate }) => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('Course: All');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await batchAPI.getBatches();
        const list = data?.content ?? (Array.isArray(data) ? data : []);
        const batchesWithCandidates = await Promise.all(
          list.map(async (b) => {
            let enrolled = 0;
            try {
              const candidates = await candidateAPI.getCandidatesByBatchId(b.id);
              enrolled = Array.isArray(candidates) ? candidates.length : 0;
            } catch (err) {
              console.error(`Failed to fetch candidates for batch ${b.id}:`, err);
            }
            return {
              rawId: b.id,
              id: b.batchName,
              course: b.courseName || '',
              courseId: b.courseId,
              trainer: b.trainerName || '',
              trainerId: b.trainerId,
              dates: formatDateRange(b.startDate, b.endDate),
              startDate: b.startDate || '',
              endDate: b.endDate || '',
              enrolled,
              max: b.capacity || 0,
              capacity: b.capacity || 0,
              status: b.status || computeBatchStatus(b.startDate, b.endDate),
            };
          })
        );
        setBatches(batchesWithCandidates);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.response?.data?.error || err.response?.data?.details?.[0] || err.message || 'Failed to load batches';
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchCoursesAndTrainers = async () => {
      try {
        const [cd, td] = await Promise.all([
          courseAPI.getCourses(),
          trainerAPI.getTrainers(),
        ]);
        console.log('Courses from API:', cd);
        console.log('Trainers from API:', td);
        setCourses(Array.isArray(cd) ? cd : []);
        setTrainers(Array.isArray(td) ? td : []);
      } catch (err) {
        console.error('Failed to load courses/trainers', err);
      }
    };
    fetchBatches();
    fetchCoursesAndTrainers();
  }, []);

  const courseOptions = ['Course: All', ...courses.map(c => c.courseName)];
  const nextBatchId = `B${batches.length + 1}`;

  const handleCreateBatch = async (batch) => {
    try {
      setError(null);
      setSuccess(null);
      const payload = {
        batchName: batch.batchName,
        courseId: batch.courseId,
        trainerId: batch.trainerId,
        startDate: batch.startDate,
        endDate: batch.endDate,
        capacity: batch.capacity,
      };
      const saved = await batchAPI.createBatch(payload);
      setBatches((prev) => [
        ...prev,
        {
          rawId: saved.id,
          id: saved.batchName,
          course: saved.courseName || '',
          courseId: saved.courseId || batch.courseId,
          trainer: saved.trainerName || '',
          trainerId: saved.trainerId || batch.trainerId,
          dates: formatDateRange(saved.startDate, saved.endDate),
          startDate: saved.startDate || batch.startDate,
          endDate: saved.endDate || batch.endDate,
          enrolled: 0,
          max: saved.capacity || batch.capacity,
          capacity: saved.capacity || batch.capacity,
          status: saved.status || computeBatchStatus(saved.startDate, saved.endDate),
        },
      ]);
      setSuccess('Batch created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.response?.data?.details?.[0] || err.message || 'Failed to create batch';
      setError(errorMessage);
      console.error(err);
    }
  };

  const filtered = batches.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = b.id.toLowerCase().includes(q) || b.course.toLowerCase().includes(q) || b.trainer.toLowerCase().includes(q);
    const matchCourse = courseFilter === 'Course: All' || b.course === courseFilter;
    const matchStatus = statusFilter === 'Status: All' || b.status === statusFilter;
    return matchSearch && matchCourse && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedBatches = filtered.slice(startIdx, startIdx + itemsPerPage);

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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 h-11 px-5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-md transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Batch
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="h-10 px-3 pr-8 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 appearance-none cursor-pointer"
        >
          {courseOptions.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 pr-8 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 appearance-none cursor-pointer"
        >
          {['Status: All', 'Ongoing', 'Upcoming', 'Completed'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">Loading batches...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Batch ID', 'Course', 'Trainer', 'Dates', 'Capacity', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedBatches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No batches found.</td>
                </tr>
              ) : (
                paginatedBatches.map((b) => {
                  const pct = Math.round((b.enrolled / b.max) * 100);
                  return (
                    <tr
                      key={b.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => onNavigate && onNavigate('BatchDetail', b)}
                    >
                      <td className="px-4 py-3.5 text-sm font-bold text-gray-900">{b.id}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{b.course}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{b.trainer}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{b.dates}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${capacityBarColor(pct)}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-sm text-gray-600 font-medium">{b.enrolled}/{b.max}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[b.status] || 'bg-gray-100 text-gray-500'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Showing {filtered.length === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + itemsPerPage, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center text-xs border rounded-md transition ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                ‹
              </button>
              {getPaginationButtons().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                  className={`w-8 h-8 flex items-center justify-center text-xs border rounded-md transition ${
                    currentPage === page
                      ? 'bg-blue-700 text-white border-blue-700'
                      : page === '...'
                      ? 'bg-white text-gray-400 border-gray-200 cursor-default'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`w-8 h-8 flex items-center justify-center text-xs border rounded-md transition ${
                  currentPage === totalPages || totalPages === 0
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
      {showCreateModal && (
        <CreateBatchModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateBatch}
          nextId={nextBatchId}
          courses={courses}
          trainers={trainers}
        />
      )}
    </div>
  );
};

export default BatchManagement;
