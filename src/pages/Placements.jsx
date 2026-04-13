import React, { useEffect, useState } from 'react';
import { placementAPI } from '../services/api';

const STATUS_BADGE = {
  Active: 'bg-green-100 text-green-700',
  'Left Job': 'bg-red-100 text-red-700',
  Unknown: 'bg-gray-100 text-gray-500',
};

const fmtSalary = (value) => `₹${Number(value ?? 0).toLocaleString('en-IN')}`;

const mapPlacement = (placement) => ({
  id: placement.id,
  name: placement.name ?? placement.candidateName ?? '—',
  employer: placement.employer ?? '—',
  role: placement.role ?? placement.jobTitle ?? '—',
  salary: Number(placement.salary ?? 0),
  placedDate: placement.placedDate ?? '—',
  status: placement.status ?? 'Unknown',
  course: placement.course ?? '—',
  batch: placement.batch ?? placement.batchCode ?? '—',
  assessment: placement.assessment ?? placement.assessmentScore ?? '—',
  followups: Array.isArray(placement.followups) ? placement.followups : [],
});

const CreatePlacementModal = ({ onClose, onSave, saving }) => {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    name: '',
    employer: '',
    role: '',
    salary: '',
    placedDate: today,
    status: 'Active',
    course: '',
    batch: '',
    assessment: '',
  });
  const [error, setError] = useState(null);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError('Candidate name is required.');
      return;
    }

    const numericSalary = form.salary === '' ? 0 : Number(form.salary);
    if (!Number.isFinite(numericSalary) || numericSalary < 0) {
      setError('Salary must be zero or greater.');
      return;
    }

    onSave({
      name: form.name.trim(),
      employer: form.employer.trim(),
      role: form.role.trim(),
      salary: numericSalary,
      placedDate: form.placedDate,
      status: form.status,
      course: form.course.trim(),
      batch: form.batch.trim(),
      assessment: form.assessment.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <div className="text-lg font-bold text-gray-900">Record Placement</div>
            <div className="text-xs text-gray-500 mt-0.5">Create a placement record using the live placement API.</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 text-xl">×</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Candidate Name</label>
              <input value={form.name} onChange={(e) => updateField('name', e.target.value)} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Employer</label>
              <input value={form.employer} onChange={(e) => updateField('employer', e.target.value)} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Role</label>
              <input value={form.role} onChange={(e) => updateField('role', e.target.value)} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Salary</label>
              <input type="number" min="0" value={form.salary} onChange={(e) => updateField('salary', e.target.value)} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Placed Date</label>
              <input type="date" value={form.placedDate} onChange={(e) => updateField('placedDate', e.target.value)} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600">
                {['Active', 'Left Job', 'Unknown'].map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Course</label>
              <input value={form.course} onChange={(e) => updateField('course', e.target.value)} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Batch</label>
              <input value={form.batch} onChange={(e) => updateField('batch', e.target.value)} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Assessment</label>
            <input value={form.assessment} onChange={(e) => updateField('assessment', e.target.value)} placeholder="e.g. 82.5%" className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600" />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="h-10 px-5 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="h-10 px-5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md disabled:opacity-60">
            {saving ? 'Saving...' : 'Create Placement'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Placements = ({ onNavigate }) => {
  const [placements, setPlacements] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await placementAPI.getPlacements();
        setPlacements(Array.isArray(data) ? data.map(mapPlacement) : []);
      } catch (err) {
        setError('Failed to load placements');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  const handleCreatePlacement = async (payload) => {
    try {
      setSaving(true);
      setError(null);
      const created = await placementAPI.createPlacement(payload);
      setPlacements((prev) => [mapPlacement(created), ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      setError('Failed to create placement');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const courses = ['All Courses', ...new Set(placements.map((placement) => placement.course).filter(Boolean))];

  const filtered = placements.filter((placement) => {
    const query = search.toLowerCase();
    const matchSearch = placement.name.toLowerCase().includes(query) || placement.employer.toLowerCase().includes(query) || placement.role.toLowerCase().includes(query);
    const matchStatus = statusFilter === 'All Statuses' || placement.status === statusFilter;
    const matchCourse = courseFilter === 'All Courses' || placement.course === courseFilter;
    return matchSearch && matchStatus && matchCourse;
  });

  const stats = [
    { label: 'Placed Total', value: placements.length, color: 'text-gray-900' },
    { label: 'Active Jobs', value: placements.filter((placement) => placement.status === 'Active').length, color: 'text-green-600' },
    { label: 'Left Job', value: placements.filter((placement) => placement.status === 'Left Job').length, color: 'text-red-600' },
    { label: 'Pending Follow-up', value: placements.reduce((count, placement) => count + placement.followups.filter((followUp) => !followUp.done && !followUp.overdue).length, 0), color: 'text-yellow-600' },
  ];

  const overdueFollowups = placements.flatMap((placement) =>
    placement.followups.filter((followUp) => !followUp.done && followUp.overdue).map((followUp) => ({ ...followUp, candidateName: placement.name, placement }))
  );
  const upcomingFollowups = placements.flatMap((placement) =>
    placement.followups.filter((followUp) => !followUp.done && !followUp.overdue).map((followUp) => ({ ...followUp, candidateName: placement.name, placement }))
  );
  const allFollowups = [...overdueFollowups, ...upcomingFollowups];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Placement Tracking</h1>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-1.5 h-11 px-5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-md transition">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Record Placement
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{stat.label}</div>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 px-3 pr-8 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 appearance-none cursor-pointer">
          {['All Statuses', 'Active', 'Left Job', 'Unknown'].map((status) => <option key={status}>{status}</option>)}
        </select>
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="h-10 px-3 pr-8 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 appearance-none cursor-pointer">
          {courses.map((course) => <option key={course}>{course}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">Loading placements...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['#', 'Name', 'Employer', 'Role', 'Salary', 'Placed On', 'Status'].map((header) => (
                  <th key={header} className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 ${['Salary', 'Placed On', 'Status'].includes(header) ? 'text-center' : ''}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">No placements found.</td></tr>
              ) : (
                filtered.map((placement, index) => (
                  <tr key={placement.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer" onClick={() => onNavigate && onNavigate('PlacementDetail', placement)}>
                    <td className="px-4 py-3.5 text-sm text-gray-400">{index + 1}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{placement.name}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{placement.employer}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{placement.role}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 text-center">{fmtSalary(placement.salary)}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 text-center">{placement.placedDate}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[placement.status] || 'bg-gray-100 text-gray-500'}`}>
                        {placement.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {allFollowups.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Upcoming Follow-ups</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {allFollowups.map((followUp, index) => (
              <div key={`${followUp.id ?? followUp.label}-${index}`} className={`flex items-center gap-4 px-5 py-3.5 border-b border-gray-100 last:border-0 ${followUp.overdue ? 'bg-yellow-50' : ''}`}>
                <span className="text-sm font-semibold text-gray-900 min-w-[140px]">{followUp.candidateName}</span>
                <span className="text-sm text-gray-500 min-w-[120px]">{followUp.label} check</span>
                <span className="text-sm text-gray-400 min-w-[120px]">{followUp.date}</span>
                {followUp.overdue && <span className="text-xs font-bold text-red-600">Overdue!</span>}
                <button onClick={() => onNavigate && onNavigate('PlacementDetail', followUp.placement)} className="ml-auto h-8 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-md transition">
                  Record
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreatePlacementModal onClose={() => setShowCreateModal(false)} onSave={handleCreatePlacement} saving={saving} />
      )}
    </div>
  );
};

export default Placements;