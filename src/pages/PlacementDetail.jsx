import React from 'react';

const STATUS_BADGE = {
  Active: 'bg-green-100 text-green-700',
  'Left Job': 'bg-red-100 text-red-700',
  Unknown: 'bg-gray-100 text-gray-500',
};

const fmtSalary = (n) => `₹${n.toLocaleString('en-IN')}`;

const PlacementDetail = ({ placement, onNavigate }) => {
  if (!placement) {
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
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <button
        onClick={() => onNavigate && onNavigate('Placements')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
      >
        ← Back to Placements
      </button>

      <h1 className="text-2xl font-bold text-gray-900">
        {placement.name} — Placement Record
      </h1>

      {/* Header card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-5 gap-6">
          {[
            { label: 'Employer',  value: placement.employer },
            { label: 'Role',      value: placement.role },
            { label: 'Salary',    value: `${fmtSalary(placement.salary)}/month` },
            { label: 'Placed',    value: placement.placedDate },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {item.label}
              </div>
              <div className="text-base font-semibold text-gray-900">{item.value}</div>
            </div>
          ))}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Status</div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[placement.status] || 'bg-gray-100 text-gray-500'}`}>
              {placement.status}
            </span>
          </div>
        </div>
      </div>

      {/* Follow-up Timeline */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-5">Follow-up Timeline</h2>
        <div className="relative pl-8">
          {/* vertical line */}
          <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-gray-200" />

          {placement.followups.map((f, i) => (
            <div key={i} className="relative mb-8 last:mb-0">
              {/* dot */}
              <div
                className={`absolute -left-8 top-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs z-10 ${
                  f.done
                    ? 'bg-green-600 text-white'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                {f.done ? '✓' : '○'}
              </div>

              {/* header */}
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-sm font-semibold text-gray-900">{f.label}</span>
                <span className="text-xs text-gray-400">{f.date}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    f.done
                      ? 'bg-green-100 text-green-700'
                      : f.overdue
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {f.done ? 'Completed' : f.overdue ? 'Overdue' : 'Upcoming'}
                </span>
              </div>

              {/* body */}
              {f.done ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 space-y-1">
                  <p><span className="font-semibold text-gray-900">Status:</span> {f.statusAtCheck}</p>
                  <p><span className="font-semibold text-gray-900">Salary:</span> {fmtSalary(f.salaryAtCheck)}</p>
                  {f.note && (
                    <p><span className="font-semibold text-gray-900">Note:</span> {f.note}</p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic mt-1">
                  {f.overdue ? 'This follow-up is overdue — please record now.' : `Scheduled for ${f.date}`}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Candidate info */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Candidate Info</h2>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <span><span className="font-semibold text-gray-900">Course:</span> <span className="text-gray-600">{placement.course}</span></span>
            <span><span className="font-semibold text-gray-900">Batch:</span> <span className="text-gray-600">{placement.batch}</span></span>
            <span><span className="font-semibold text-gray-900">Assessment:</span> <span className="text-gray-600">{placement.assessment} (Pass)</span></span>
            <button
              onClick={() => onNavigate && onNavigate('Placements')}
              className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-800 transition"
            >
              View Full Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDetail;
