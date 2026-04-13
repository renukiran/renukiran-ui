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

const PlacementDetail = ({ placement, onNavigate }) => {
  const [detail, setDetail] = useState(placement ? mapPlacement(placement) : null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlacement = async () => {
      if (!placement?.id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await placementAPI.getPlacementById(placement.id);
        setDetail(mapPlacement(response));
      } catch (err) {
        setError('Failed to load placement detail');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPlacement();
  }, [placement?.id]);

  const activePlacement = detail ?? (placement ? mapPlacement(placement) : null);

  const handleDelete = async () => {
    if (!activePlacement?.id) return;
    const confirmed = window.confirm(`Delete placement record for ${activePlacement.name}?`);
    if (!confirmed) return;

    try {
      setDeleting(true);
      setError(null);
      await placementAPI.deletePlacement(activePlacement.id);
      onNavigate && onNavigate('Placements');
    } catch (err) {
      setError('Failed to delete placement');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (!activePlacement) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => onNavigate && onNavigate('Placements')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Placements
        </button>
        <p className="text-gray-500">No placement selected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate && onNavigate('Placements')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
        >
          ← Back to Placements
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="h-10 px-4 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-60"
        >
          {deleting ? 'Deleting...' : 'Delete Record'}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <h1 className="text-2xl font-bold text-gray-900">{activePlacement.name} — Placement Record</h1>

      {loading && <div className="text-sm text-gray-500">Refreshing placement detail...</div>}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-5 gap-6">
          {[
            { label: 'Employer', value: activePlacement.employer },
            { label: 'Role', value: activePlacement.role },
            { label: 'Salary', value: `${fmtSalary(activePlacement.salary)}/month` },
            { label: 'Placed', value: activePlacement.placedDate },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{item.label}</div>
              <div className="text-base font-semibold text-gray-900">{item.value}</div>
            </div>
          ))}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Status</div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[activePlacement.status] || 'bg-gray-100 text-gray-500'}`}>
              {activePlacement.status}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-5">Follow-up Timeline</h2>
        <div className="relative pl-8">
          <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-gray-200" />

          {activePlacement.followups.length === 0 ? (
            <div className="text-sm text-gray-400">No follow-ups recorded yet.</div>
          ) : (
            activePlacement.followups.map((followUp, index) => (
              <div key={followUp.id ?? index} className="relative mb-8 last:mb-0">
                <div className={`absolute -left-8 top-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs z-10 ${followUp.done ? 'bg-green-600 text-white' : 'bg-white border-2 border-gray-300 text-gray-400'}`}>
                  {followUp.done ? '✓' : '○'}
                </div>

                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-sm font-semibold text-gray-900">{followUp.label}</span>
                  <span className="text-xs text-gray-400">{followUp.date}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${followUp.done ? 'bg-green-100 text-green-700' : followUp.overdue ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                    {followUp.done ? 'Completed' : followUp.overdue ? 'Overdue' : 'Upcoming'}
                  </span>
                </div>

                {followUp.done ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 space-y-1">
                    <p><span className="font-semibold text-gray-900">Status:</span> {followUp.statusAtCheck}</p>
                    <p><span className="font-semibold text-gray-900">Salary:</span> {fmtSalary(followUp.salaryAtCheck)}</p>
                    {followUp.note && <p><span className="font-semibold text-gray-900">Note:</span> {followUp.note}</p>}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic mt-1">
                    {followUp.overdue ? 'This follow-up is overdue — please record now.' : `Scheduled for ${followUp.date}`}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Candidate Info</h2>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <span><span className="font-semibold text-gray-900">Course:</span> <span className="text-gray-600">{activePlacement.course}</span></span>
            <span><span className="font-semibold text-gray-900">Batch:</span> <span className="text-gray-600">{activePlacement.batch}</span></span>
            <span><span className="font-semibold text-gray-900">Assessment:</span> <span className="text-gray-600">{activePlacement.assessment}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDetail;