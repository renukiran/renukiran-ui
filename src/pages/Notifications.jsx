import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { message: 'New application submitted', time: '2 hrs ago' },
    { message: 'Batch 1 starts in 5 days', time: '1 day ago' },
    { message: 'Placement offer received', time: '3 days ago' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        // Placeholder for API call to fetch notifications
        console.log('Fetching notifications...');
        // const response = await notificationAPI.getNotifications();
        // setNotifications(response.data);
      } catch (err) {
        setError('Failed to load notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
              <p className="text-gray-800">{notif.message}</p>
              <p className="text-gray-500 text-sm">{notif.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
