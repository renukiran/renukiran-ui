import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { applicationAPI } from '../services/api';

const AVATAR_COLORS = ['bg-blue-700', 'bg-purple-600', 'bg-green-600', 'bg-amber-600', 'bg-teal-600'];

const attendanceClass = (pct) => {
  if (pct < 70) return 'text-red-600 font-semibold';
  if (pct < 80) return 'text-yellow-600 font-semibold';
  return 'text-green-600 font-semibold';
};

const AttendanceLabel = ({ pct }) => {
  if (pct < 70) return <span className="ml-1.5 text-xs font-medium px-1.5 py-0.5 rounded bg-red-100 text-red-700">Below threshold</span>;
  if (pct < 80) return <span className="ml-1.5 text-xs font-medium px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">At risk</span>;
  return null;
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
};

const BatchDetail = ({ batch, onNavigate }) => {
  const batchData = batch || {
    id: 'B1',
    course: 'Stitching Basic',
    name: 'Batch 1',
    trainer: 'Suman K.',
    period: 'Mar 1 – Jun 30, 2026',
    enrolled: 18,
    max: 20,
    status: 'Ongoing',
  };

  const [activeTab, setActiveTab] = useState('Candidates');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    applicationAPI.getApplications()
      .then(data => {
        const list = Array.isArray(data) ? data
          : Array.isArray(data?.content) ? data.content
          : Array.isArray(data?.data) ? data.data
          : [];
        setCandidates(list.map(c => ({
          id: c.id,
          initials: getInitials(c.fullName),
          name: c.fullName ?? '—',
          phone: c.mobileNumber ?? '—',
          status: c.applicationStatus ?? '—',
          attendance: c.attendancePercentage ?? 0,
        })));
      })
      .catch(err => {
        setError('Failed to load candidates');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleCandidate = (id) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = (e) => {
    setSelectedCandidates(e.target.checked ? candidates.map((c) => c.id) : []);
  };

  const pct = Math.round((batchData.enrolled / batchData.max) * 100);
  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <button
        onClick={() => onNavigate && onNavigate('BatchManagement')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
      >
        <ArrowLeft size={16} />
        Back to Batches
      </button>

      <h1 className="text-2xl font-bold text-gray-900">
        {batchData.course} — {batchData.name || batchData.id}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm p-5 flex flex-wrap gap-10 items-center">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Trainer</p>
          <p className="text-sm font-semibold text-gray-900">{batchData.trainer}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Period</p>
          <p className="text-sm font-semibold text-gray-900">{batchData.period || batchData.dates}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Capacity</p>
          <div className="flex items-center gap-2.5 mt-0.5">
            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm font-semibold text-gray-900">{batchData.enrolled}/{batchData.max}</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            {batchData.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Candidates Tab */}
      {activeTab === 'Candidates' && (
        <>
          <div className="flex items-center justify-between gap-3">
            <button className="inline-flex items-center gap-1.5 h-10 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-md transition">
              + Assign Candidates
            </button>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-72 h-10 pl-9 pr-3 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500 text-sm">Loading candidates...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 w-10 border-b border-gray-200">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-700 cursor-pointer"
                        onChange={toggleAll}
                        checked={candidates.length > 0 && selectedCandidates.length === candidates.length}
                      />
                    </th>
                    <th className="px-4 py-3 w-10 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">#</th>
                    {['Name', 'Phone', 'Status', 'Attendance %', 'Action'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((c, i) => (
                    <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-blue-700 cursor-pointer"
                          checked={selectedCandidates.includes(c.id)}
                          onChange={() => toggleCandidate(c.id)}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                            {c.initials}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{c.phone}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{c.status}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm">
                        <span className={attendanceClass(c.attendance)}>{c.attendance}%</span>
                        <AttendanceLabel pct={c.attendance} />
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => onNavigate && onNavigate('CandidateProfile', c.raw)}
                          className="text-sm font-medium text-blue-700 hover:text-blue-900"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
                <button
                  disabled={selectedCandidates.length === 0}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold text-red-600 bg-white border border-gray-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-red-50 enabled:hover:border-red-300 transition"
                >
                  Remove Selected
                </button>
                <span className="text-xs text-gray-400">Select candidates to enable actions</span>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'Attendance' && (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center text-gray-400 text-sm">
          Attendance view — coming soon.
        </div>
      )}

      {activeTab === 'Assessments' && (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center text-gray-400 text-sm">
          Assessments view — coming soon.
        </div>
      )}
    </div>
  );
};

export default BatchDetail;
