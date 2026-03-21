import React, { useState, useEffect } from 'react';
import { placementAPI } from '../services/api';

const Placements = () => {
  const [placements, setPlacements] = useState([
    { name: 'Priya Singh', company: 'Tech Corp', status: 'Placed' },
    { name: 'Rajesh Kumar', company: 'Global Solutions', status: 'Pending' },
    { name: 'Anjali Sharma', company: 'Innovation Labs', status: 'Placed' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        setLoading(true);
        setError(null);
        // Placeholder for API call to fetch placements
        console.log('Fetching placements...');
        // const response = await placementAPI.getPlacements();
        // setPlacements(response.data);
      } catch (err) {
        setError('Failed to load placements');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Placements</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading placements...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Candidate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-800">{row.name}</td>
                  <td className="px-6 py-3 text-gray-800">{row.company}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        row.status === 'Placed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Placements;
