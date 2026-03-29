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
        const data = await notificationAPI.getNotifications();
        if (data && data.length > 0) {
          setNotifications(data.map((n) => ({
            id: n.id,
            message: n.message ?? n.title ?? '—',
            time: n.createdAt ?? n.time ?? '',
            read: n.read ?? false,
          })));
        }
      } catch (err) {
        setError('Failed to load notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    if (!id) return;
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

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
            <div
              key={notif.id ?? idx}
              className={`bg-white p-4 rounded-lg border flex justify-between items-center ${notif.read ? 'border-gray-100 opacity-60' : 'border-gray-200'}`}
            >
              <p className="text-gray-800">{notif.message}</p>
              <div className="flex items-center gap-3">
                <p className="text-gray-500 text-sm">{notif.time}</p>
                {notif.id && !notif.read && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 px-2 py-0.5 rounded transition"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
