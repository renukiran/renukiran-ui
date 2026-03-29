import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { courseAPI } from '../services/api';

const ACCENT_COLORS = { yellow: '#EAB308', blue: '#2B5EA7', pink: '#EC4899' };
const ACCENT_KEYS = ['yellow', 'blue', 'pink', 'green', 'purple'];

const STATUS_BADGE = {
  Active: 'bg-green-100 text-green-700',
  Upcoming: 'bg-blue-100 text-blue-700',
  Closed: 'bg-gray-100 text-gray-500',
};

const CATEGORIES = ['Stitching', 'Computers', 'Beauty', 'Bag Making', 'Food Enterprise', 'Handicraft', 'Other'];

const EMPTY_FORM = {
  name: '',
  category: '',
  duration: '',
  maxPerBatch: '20',
  description: '',
  mcq: '30',
  practical: '50',
  caseStudy: '20',
  status: 'Active',
};

const AddCourseModal = ({ onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialData ? {
    name: initialData.name || '',
    category: initialData.category || '',
    duration: String(initialData.durationRaw || ''),
    maxPerBatch: String(initialData.maxPerBatch || '20'),
    description: initialData.description || '',
    mcq: String(initialData.mcq || '30'),
    practical: String(initialData.practical || '50'),
    caseStudy: String(initialData.caseStudy || '20'),
    status: initialData.status || 'Active',
  } : EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const total = (parseInt(form.mcq) || 0) + (parseInt(form.practical) || 0) + (parseInt(form.caseStudy) || 0);
  const totalOk = total === 100;

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Course name is required.';
    if (!form.category) e.category = 'Please select a category.';
    if (!form.duration || parseInt(form.duration) < 1) e.duration = 'Enter a valid duration.';
    if (!form.maxPerBatch || parseInt(form.maxPerBatch) < 1) e.maxPerBatch = 'Enter a valid max batch size.';
    if (!totalOk) e.weights = 'Assessment weights must total exactly 100%.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{initialData ? 'Edit Course' : 'Add New Course'}</h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Course Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Advanced Stitching"
              className={`w-full h-11 px-3.5 text-sm bg-gray-50 border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className={`w-full h-11 px-3.5 text-sm bg-gray-50 border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer appearance-none transition ${errors.category ? 'border-red-400' : 'border-gray-200'}`}
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
          </div>

          {/* Duration + Max per Batch */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Duration (months)</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
                placeholder="e.g. 3"
                min="1" max="24"
                className={`w-full h-11 px-3.5 text-sm bg-gray-50 border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition ${errors.duration ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.duration && <p className="text-xs text-red-600 mt-1">{errors.duration}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Max per Batch</label>
              <input
                type="number"
                value={form.maxPerBatch}
                onChange={(e) => set('maxPerBatch', e.target.value)}
                min="1" max="100"
                className={`w-full h-11 px-3.5 text-sm bg-gray-50 border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition ${errors.maxPerBatch ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.maxPerBatch && <p className="text-xs text-red-600 mt-1">{errors.maxPerBatch}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief course description..."
              rows={3}
              className="w-full px-3.5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition resize-vertical"
            />
          </div>

          {/* Assessment Weights */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Assessment Weights</p>
            <div className="grid grid-cols-3 gap-3 mb-2">
              {[{ label: 'MCQ', key: 'mcq' }, { label: 'Practical', key: 'practical' }, { label: 'Case Study', key: 'caseStudy' }].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form[key]}
                      onChange={(e) => set(key, e.target.value)}
                      min="0" max="100"
                      className="w-full h-10 pl-3 pr-7 text-sm bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className={`text-xs font-semibold flex items-center gap-1 ${totalOk ? 'text-green-600' : 'text-red-600'}`}>
              {totalOk ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              )}
              Total: {total}% {!totalOk && '— must equal 100%'}
            </p>
            {errors.weights && <p className="text-xs text-red-600 mt-1">{errors.weights}</p>}
          </div>

          {/* Status */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Status</p>
            <div className="flex gap-5">
              {['Active', 'Upcoming', 'Closed'].map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="courseStatus"
                    value={s}
                    checked={form.status === s}
                    onChange={() => set('status', s)}
                    className="w-4 h-4 accent-blue-700 cursor-pointer"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="h-11 px-5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={handleSave} className="h-11 px-6 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition">
            {initialData ? 'Update Course' : 'Save Course'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Courses = ({ onNavigate }) => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'Stitching Basic',
      status: 'Active',
      duration: '3 months',
      maxPerBatch: 20,
      activeBatches: 2,
      assessments: [
        { label: 'MCQ', weight: 30 },
        { label: 'Practical', weight: 50 },
        { label: 'Case Study', weight: 20 },
      ],
      accent: 'yellow',
    },
    {
      id: 2,
      name: 'Computer Fundamentals',
      status: 'Active',
      duration: '2 months',
      maxPerBatch: 20,
      activeBatches: 1,
      assessments: [
        { label: 'MCQ', weight: 40 },
        { label: 'Practical', weight: 40 },
        { label: 'Case Study', weight: 20 },
      ],
      accent: 'blue',
    },
    {
      id: 3,
      name: 'Beauty Basic',
      status: 'Upcoming',
      duration: '3 months',
      maxPerBatch: 20,
      startDate: '1 Apr 2026',
      assessments: [
        { label: 'MCQ', weight: 20 },
        { label: 'Practical', weight: 60 },
        { label: 'Case Study', weight: 20 },
      ],
      accent: 'pink',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await courseAPI.getCourses();
        if (data && data.length > 0) {
          setCourses(data.map((c, i) => ({
            id: c.id,
            name: c.courseName,
            status: c.status || 'Active',
            duration: c.duration ? `${c.duration} months` : '—',
            durationRaw: c.duration,
            maxPerBatch: c.maxBatchSize || 20,
            category: c.category || '',
            description: c.description || '',
            mcq: parseInt(c.mcqAssessment) || 30,
            practical: parseInt(c.practicalAssessment) || 50,
            caseStudy: parseInt(c.caseStudyAssessment) || 20,
            activeBatches: 0,
            assessments: [
              { label: 'MCQ', weight: parseInt(c.mcqAssessment) || 30 },
              { label: 'Practical', weight: parseInt(c.practicalAssessment) || 50 },
              { label: 'Case Study', weight: parseInt(c.caseStudyAssessment) || 20 },
            ],
            accent: ACCENT_KEYS[i % ACCENT_KEYS.length],
          })));
        }
      } catch (err) {
        setError('Failed to load courses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSaveCourse = async (form) => {
    try {
      const payload = {
        courseName: form.name,
        category: form.category,
        duration: parseInt(form.duration) || 0,
        maxBatchSize: parseInt(form.maxPerBatch) || 20,
        description: form.description,
        status: form.status || 'Active',
        mcqAssessment: String(form.mcq || 30),
        practicalAssessment: String(form.practical || 50),
        caseStudyAssessment: String(form.caseStudy || 20),
        instructor: '',
      };
      if (editingCourse) {
        await courseAPI.updateCourse(editingCourse.id, payload);
        const accent = editingCourse.accent;
        setCourses((prev) => prev.map((c) => c.id === editingCourse.id ? {
          ...c,
          name: form.name,
          status: form.status || 'Active',
          duration: form.duration ? `${form.duration} months` : '—',
          durationRaw: parseInt(form.duration) || 0,
          maxPerBatch: parseInt(form.maxPerBatch) || 20,
          category: form.category,
          description: form.description,
          mcq: parseInt(form.mcq) || 30,
          practical: parseInt(form.practical) || 50,
          caseStudy: parseInt(form.caseStudy) || 20,
          assessments: [
            { label: 'MCQ', weight: parseInt(form.mcq) || 30 },
            { label: 'Practical', weight: parseInt(form.practical) || 50 },
            { label: 'Case Study', weight: parseInt(form.caseStudy) || 20 },
          ],
          accent,
        } : c));
        setEditingCourse(null);
      } else {
        const saved = await courseAPI.createCourse(payload);
        const nextAccent = ACCENT_KEYS[courses.length % ACCENT_KEYS.length];
        setCourses((prev) => [
        ...prev,
        {
          id: saved.id,
          name: saved.courseName,
          status: form.status,
          duration: `${form.duration} month${parseInt(form.duration) !== 1 ? 's' : ''}`,
          maxPerBatch: parseInt(form.maxPerBatch),
          activeBatches: 0,
          assessments: [
            { label: 'MCQ', weight: parseInt(form.mcq) },
            { label: 'Practical', weight: parseInt(form.practical) },
            { label: 'Case Study', weight: parseInt(form.caseStudy) },
          ],
          accent: nextAccent,
          ...(form.status === 'Upcoming' ? { startDate: 'TBD' } : {}),
        },
      ]);
      setShowModal(false);
    }
  } catch (err) {
      setError('Failed to save course');
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try {
      await courseAPI.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError('Failed to delete course');
      console.error(err);
    }
  };

  const filtered = courses.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 h-11 px-5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-md transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Course
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 pr-8 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 appearance-none cursor-pointer"
        >
          {['All Status', 'Active', 'Upcoming', 'Closed'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">Loading courses...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">No courses found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex hover:shadow-md transition-shadow">
              <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: ACCENT_COLORS[course.accent] }} />
              <div className="flex-1 p-5">
                {/* Title row */}
                <div className="flex items-center gap-2.5 mb-2">
                  <h3 className="text-base font-semibold text-gray-900">{course.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[course.status]}`}>
                    {course.status}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex gap-5 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    Duration: {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    </svg>
                    Max: {course.maxPerBatch}/batch
                  </span>
                  {course.activeBatches !== undefined ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      {course.activeBatches} active batch{course.activeBatches !== 1 ? 'es' : ''}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Starts {course.startDate}
                    </span>
                  )}
                </div>

                {/* Assessments */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span className="font-medium text-gray-700">Assessments:</span>
                  {course.assessments.map((a) => (
                    <span key={a.label} className="bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-600">
                      {a.label} {a.weight}%
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingCourse(course); setShowModal(false); }}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('BatchManagement')}
                    className="h-9 px-3.5 text-xs font-medium text-blue-700 bg-white border border-blue-700 rounded-md hover:bg-blue-50 transition"
                  >
                    View Batches
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-md hover:bg-red-50 hover:text-red-600 transition text-base"
                    title="Delete course"
                  >
                    &hellip;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddCourseModal onClose={() => setShowModal(false)} onSave={handleSaveCourse} />
      )}
      {editingCourse && (
        <AddCourseModal initialData={editingCourse} onClose={() => setEditingCourse(null)} onSave={handleSaveCourse} />
      )}
    </div>
  );
};

export default Courses;
