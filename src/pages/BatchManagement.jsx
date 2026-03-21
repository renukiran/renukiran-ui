import React, { useState, useEffect } from 'react';

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

const BATCH_COURSES = [
  'Stitching Basic', 'Computer Fundamentals', 'Beauty Basic',
  'Bag Making', 'Food Enterprise', 'Handicraft',
];

const BATCH_TRAINERS = ['Suman Kumar', 'Raj Patel', 'Asha Mehra', 'Priya T.'];

// ── CreateBatchModal ───────────────────────────────────────────────────────────
const CreateBatchModal = ({ onClose, onSave, nextId }) => {
  const [form, setForm] = useState({
    course: '',
    batchId: nextId,
    trainer: '',
    location: '',
    startDate: '',
    endDate: '',
    capacity: '20',
    status: 'Upcoming',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const fmtMonth = (d) => {
    if (!d) return '—';
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [, m, day] = d.split('-');
    return `${parseInt(day)} ${months[parseInt(m) - 1]}`;
  };

  const validate = () => {
    const e = {};
    if (!form.course) e.course = 'Select a course';
    if (!form.batchId.trim()) e.batchId = 'Batch ID is required';
    else if (!/^[A-Za-z0-9]+$/.test(form.batchId.trim())) e.batchId = 'Use alphanumeric code like B6';
    if (!form.trainer) e.trainer = 'Select a trainer';
    if (!form.startDate) e.startDate = 'Set a start date';
    if (!form.endDate) e.endDate = 'Set an end date';
    else if (form.startDate && form.endDate < form.startDate) e.endDate = 'End date must be after start date';
    const cap = Number(form.capacity);
    if (!form.capacity || !Number.isFinite(cap) || cap < 1 || cap > 100) e.capacity = 'Capacity must be 1–100';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [, sm] = form.startDate.split('-');
    const [ey, em] = form.endDate.split('-');
    const dates = `${months[parseInt(sm) - 1]} – ${months[parseInt(em) - 1]} ${ey}`;
    onSave({
      id: form.batchId.trim().toUpperCase(),
      course: form.course,
      trainer: form.trainer,
      dates,
      location: form.location,
      enrolled: 0,
      max: parseInt(form.capacity),
      status: form.status,
    });
    onClose();
  };

  const isValid =
    form.course && form.batchId.trim() && form.trainer &&
    form.startDate && form.endDate && form.endDate >= form.startDate &&
    Number(form.capacity) >= 1 && Number(form.capacity) <= 100;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xl">
              🗂
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">Create Batch</div>
              <div className="text-xs text-gray-500 mt-0.5">Assign course, trainer, dates and capacity for a new cohort.</div>
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
              { label: 'Batch ID', value: form.batchId || nextId },
              { label: 'Capacity', value: `${form.capacity || 20} seats` },
              { label: 'Starts', value: form.startDate ? fmtMonth(form.startDate) : '—' },
            ].map((h) => (
              <div key={h.label} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-center">
                <div className="text-xs text-gray-400">{h.label}</div>
                <div className="text-sm font-semibold text-gray-800 mt-0.5">{h.value}</div>
              </div>
            ))}
          </div>

          {/* Course + Batch ID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                value={form.course}
                onChange={(e) => set('course', e.target.value)}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 appearance-none ${
                  errors.course ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <option value="">Select course...</option>
                {BATCH_COURSES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.course && <p className="text-xs text-red-500 mt-1">{errors.course}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Batch ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.batchId}
                onChange={(e) => set('batchId', e.target.value)}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
                  errors.batchId ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.batchId ? (
                <p className="text-xs text-red-500 mt-1">{errors.batchId}</p>
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
                value={form.trainer}
                onChange={(e) => set('trainer', e.target.value)}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 appearance-none ${
                  errors.trainer ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <option value="">Select trainer...</option>
                {BATCH_TRAINERS.map((t) => <option key={t}>{t}</option>)}
              </select>
              {errors.trainer && <p className="text-xs text-red-500 mt-1">{errors.trainer}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="e.g., Garhi Centre - Room 2"
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
                  errors.startDate ? 'border-red-400' : 'border-gray-200'
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
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
                  errors.endDate ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Capacity + Status */}
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
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
                  errors.capacity ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Status</label>
              <div className="flex gap-1.5">
                {['Upcoming', 'Ongoing', 'Completed'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('status', s)}
                    className={`flex-1 h-10 text-xs font-semibold rounded-md border transition ${
                      form.status === s
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Notes for Operations</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Optional logistics notes for classroom setup, equipment, or scheduling."
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {isValid ? 'Ready to create batch.' : 'Complete all required fields to continue.'}
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
              Create Batch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BatchManagement = ({ onNavigate }) => {
  const [batches, setBatches] = useState([
    { id: 'B1', course: 'Stitching Basic', trainer: 'Suman K.', dates: 'Mar – Jun 2026', enrolled: 18, max: 20, status: 'Ongoing' },
    { id: 'B2', course: 'Computer Fund.', trainer: 'Raj P.', dates: 'Mar – May 2026', enrolled: 19, max: 20, status: 'Ongoing' },
    { id: 'B3', course: 'Beauty Basic', trainer: 'Asha M.', dates: 'Apr – Jul 2026', enrolled: 0, max: 20, status: 'Upcoming' },
    { id: 'B4', course: 'Stitching Basic', trainer: 'Suman K.', dates: 'Jan – Mar 2026', enrolled: 20, max: 20, status: 'Completed' },
    { id: 'B5', course: 'Bag Making', trainer: 'Priya T.', dates: 'May – Aug 2026', enrolled: 5, max: 20, status: 'Upcoming' },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('Course: All');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        setError(null);
        // const response = await batchAPI.getBatches();
        // setBatches(response.data);
        console.log('Fetching batches...');
      } catch (err) {
        setError('Failed to load batches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const courseOptions = ['Course: All', ...new Set(batches.map((b) => b.course))];
  const nextBatchId = `B${batches.length + 1}`;

  const handleCreateBatch = (batch) => {
    setBatches((prev) => [...prev, batch]);
  };

  const filtered = batches.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = b.id.toLowerCase().includes(q) || b.course.toLowerCase().includes(q) || b.trainer.toLowerCase().includes(q);
    const matchCourse = courseFilter === 'Course: All' || b.course === courseFilter;
    const matchStatus = statusFilter === 'Status: All' || b.status === statusFilter;
    return matchSearch && matchCourse && matchStatus;
  });

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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No batches found.</td>
                </tr>
              ) : (
                filtered.map((b) => {
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
            <span className="text-xs text-gray-500">Showing 1–{filtered.length} of {batches.length}</span>
            <div className="flex gap-1">
              {['«', '‹', '1', '2', '3', '›', '»'].map((p, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center text-xs border rounded-md transition ${
                    p === '1'
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showCreateModal && (
        <CreateBatchModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateBatch}
          nextId={nextBatchId}
        />
      )}
    </div>
  );
};

export default BatchManagement;
