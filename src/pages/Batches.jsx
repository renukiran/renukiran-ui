import React, { useState, useEffect } from 'react';

const Batches = () => {
  // eslint-disable-next-line no-unused-vars
  const [batches, setBatches] = useState([
    { name: 'Batch 1', date: '01 Apr 2026' },
    { name: 'Batch 2', date: '15 Apr 2026' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        setError(null);
        // Placeholder for API call to fetch batches
        console.log('Fetching batches...');
        // const response = await batchAPI.getBatches();
        // setBatches(response.data);
      } catch (err) {
        setError('Failed to load batches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Batches</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading batches...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {batches.map((batch, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800">{batch.name}</h3>
              <p className="text-gray-600 text-sm mt-2">Start Date: {batch.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Batches;
