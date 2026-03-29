import React, { useState, useEffect } from 'react';
import { placementAPI } from '../services/api';

const STATUS_BADGE = {
  Active: 'bg-green-100 text-green-700',
  'Left Job': 'bg-red-100 text-red-700',
  Unknown: 'bg-gray-100 text-gray-500',
};

const PLACEMENTS = [
  { id: 1, name: 'Priya Sharma',  employer: 'ABC Textiles Ltd',      role: 'Tailor',               salary: 8000,  placedDate: 'Feb 15, 2026', status: 'Active',   course: 'Stitching Basic',       batch: 'B1', assessment: '86.1%', followups: [
    { label: '1 Month',  date: 'Mar 15, 2026', done: true,  note: 'Doing well, learning new patterns', statusAtCheck: 'Active', salaryAtCheck: 8000 },
    { label: '3 Months', date: 'May 15, 2026', done: false },
    { label: '6 Months', date: 'Aug 15, 2026', done: false },
  ]},
  { id: 2, name: 'Meena Devi',   employer: 'Lakshmi Garments',      role: 'Machine Operator',     salary: 7500,  placedDate: 'Jan 20, 2026', status: 'Active',   course: 'Stitching Basic',       batch: 'B1', assessment: '79.4%', followups: [
    { label: '1 Month',  date: 'Feb 20, 2026', done: true,  note: 'Settled in, team supportive', statusAtCheck: 'Active', salaryAtCheck: 7500 },
    { label: '3 Months', date: 'Apr 20, 2026', done: false },
    { label: '6 Months', date: 'Jul 20, 2026', done: false },
  ]},
  { id: 3, name: 'Geeta Kumari', employer: 'Ravi Data Services',    role: 'Data Entry Operator',  salary: 10000, placedDate: 'Dec 10, 2025', status: 'Active',   course: 'Computer Fundamentals', batch: 'B2', assessment: '91.2%', followups: [
    { label: '1 Month',  date: 'Jan 10, 2026', done: true, note: 'Good performance, promoted to senior', statusAtCheck: 'Active', salaryAtCheck: 10000 },
    { label: '3 Months', date: 'Mar 10, 2026', done: true, note: 'Salary increment received', statusAtCheck: 'Active', salaryAtCheck: 11000 },
    { label: '6 Months', date: 'Jun 10, 2026', done: false },
  ]},
  { id: 4, name: 'Anjali Patel', employer: 'Shree Beauty Parlour',  role: 'Beautician',           salary: 5000,  placedDate: 'Nov 5, 2025',  status: 'Left Job', course: 'Beauty Basic',          batch: 'B3', assessment: '73.8%', followups: [
    { label: '1 Month',  date: 'Dec 5, 2025',  done: false, overdue: true },
    { label: '3 Months', date: 'Feb 5, 2026',  done: false, overdue: true },
    { label: '6 Months', date: 'May 5, 2026',  done: false },
  ]},
  { id: 5, name: 'Rekha Yadav',  employer: 'Bharat Fashions Pvt',  role: 'Assistant Tailor',     salary: 12000, placedDate: 'Jan 8, 2026',  status: 'Unknown',  course: 'Stitching Basic',       batch: 'B4', assessment: '68.5%', followups: [
    { label: '1 Month',  date: 'Feb 8, 2026',  done: false, overdue: true },
    { label: '3 Months', date: 'Apr 8, 2026',  done: false },
    { label: '6 Months', date: 'Jul 8, 2026',  done: false },
  ]},
];

const fmtSalary = (n) => `₹${n.toLocaleString('en-IN')}`;

const Placements = ({ onNavigate }) => {
  // eslint-disable-next-line no-unused-vars
  const [placements, setPlacements] = useState(PLACEMENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        setLoading(true);
        const data = await placementAPI.getPlacements();
        if (data && data.length > 0) {
          setPlacements(data.map((p) => ({
            id: p.id,
            name: p.candidateName ?? p.name ?? '—',
            employer: p.employer ?? '—',
            role: p.jobTitle ?? p.role ?? '—',
            salary: p.salary ?? 0,
            placedDate: p.placedDate ?? '—',
            status: p.status ?? 'Active',
            course: p.course ?? '—',
            batch: p.batchCode ?? p.batch ?? '—',
            assessment: p.assessmentScore ?? '—',
            followups: p.followups ?? [],
          })));
        }
      } catch (err) {
        setError('Failed to load placements');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlacements();
  }, []);

  const courses = ['All Courses', ...new Set(placements.map((p) => p.course))];

  const filtered = placements.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.employer.toLowerCase().includes(q) || p.role.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All Statuses' || p.status === statusFilter;
    const matchCourse = courseFilter === 'All Courses' || p.course === courseFilter;
    return matchSearch && matchStatus && matchCourse;
  });

  const stats = [
    { label: 'Placed Total',      value: placements.length,                              color: 'text-gray-900' },
    { label: 'Active Jobs',       value: placements.filter((p) => p.status === 'Active').length,   color: 'text-green-600' },
    { label: 'Left Job',          value: placements.filter((p) => p.status === 'Left Job').length,  color: 'text-red-600' },
    { label: 'Pending Follow-up', value: placements.reduce((acc, p) => acc + p.followups.filter((f) => !f.done && !f.overdue).length, 0), color: 'text-yellow-600' },
  ];

  const overdueFollowups = placements.flatMap((p) =>
    p.followups.filter((f) => !f.done && f.overdue).map((f) => ({ ...f, candidateName: p.name, placement: p }))
  );
  const upcomingFollowups = placements.flatMap((p) =>
    p.followups.filter((f) => !f.done && !f.overdue).map((f) => ({ ...f, candidateName: p.name, placement: p }))
  );
  const allFollowups = [...overdueFollowups, ...upcomingFollowups];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Placement Tracking</h1>
        <button className="inline-flex items-center gap-1.5 h-11 px-5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-md transition">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Record Placement
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{s.label}</div>
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 pr-8 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 appearance-none cursor-pointer"
        >
          {['All Statuses', 'Active', 'Left Job', 'Unknown'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="h-10 px-3 pr-8 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 appearance-none cursor-pointer"
        >
          {courses.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">Loading placements...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['#', 'Name', 'Employer', 'Role', 'Salary', 'Placed On', 'Status'].map((h) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 ${
                      ['Salary', 'Placed On', 'Status'].includes(h) ? 'text-center' : ''
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">No placements found.</td></tr>
              ) : (
                filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => onNavigate && onNavigate('PlacementDetail', p)}
                  >
                    <td className="px-4 py-3.5 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{p.name}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{p.employer}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{p.role}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 text-center">{fmtSalary(p.salary)}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 text-center">{p.placedDate}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[p.status] || 'bg-gray-100 text-gray-500'}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Follow-ups */}
      {allFollowups.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Upcoming Follow-ups</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {allFollowups.map((f, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-5 py-3.5 border-b border-gray-100 last:border-0 ${
                  f.overdue ? 'bg-yellow-50' : ''
                }`}
              >
                <span className="text-sm font-semibold text-gray-900 min-w-[140px]">{f.candidateName}</span>
                <span className="text-sm text-gray-500 min-w-[120px]">{f.label} check</span>
                <span className="text-sm text-gray-400 min-w-[120px]">{f.date}</span>
                {f.overdue && (
                  <span className="text-xs font-bold text-red-600">Overdue!</span>
                )}
                <button
                  onClick={() => onNavigate && onNavigate('PlacementDetail', f.placement)}
                  className="ml-auto h-8 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-md transition"
                >
                  Record
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Placements;
