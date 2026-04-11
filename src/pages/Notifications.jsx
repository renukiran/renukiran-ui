import React, { useState, useEffect, useRef, useCallback } from 'react';
import { notificationAPI } from '../services/api';

const POLL_INTERVAL = 30_000; // 30 seconds

const Notifications = ({ onCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const intervalRef = useRef(null);

  const fetchNotifications = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const data = await notificationAPI.getNotifications();
      if (Array.isArray(data)) {
        const mapped = data.map((n) => ({
          id: n.id,
          message: n.message ?? n.title ?? '—',
          time: n.time ?? n.createdAt ?? '',
          read: n.isRead ?? n.read ?? false,
        }));
        setNotifications(mapped);
        setUnreadCount(mapped.filter((n) => !n.read).length);
        if (onCountChange) onCountChange(mapped.filter((n) => !n.read).length);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      if (!silent) setError('Failed to load notifications');
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [onCountChange]);;

  // Initial load
  useEffect(() => {
    fetchNotifications(false);
  }, [fetchNotifications]);

  // Polling every 30 s
  useEffect(() => {
    intervalRef.current = setInterval(() => fetchNotifications(true), POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      if (onCountChange) onCountChange(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      if (onCountChange) onCountChange(0);
    } catch (err) {
      setError('Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const handleCreate = async () => {
    const msg = newMessage.trim();
    if (!msg) return;
    setCreating(true);
    try {
      const created = await notificationAPI.createNotification(msg);
      const mapped = {
        id: created.id,
        message: created.message,
        time: created.time ?? 'just now',
        read: created.isRead ?? false,
      };
      setNotifications((prev) => [mapped, ...prev]);
      setUnreadCount((c) => c + 1);
      if (onCountChange) onCountChange(unreadCount + 1);
      setNewMessage('');
    } catch (err) {
      setError('Failed to create notification');
    } finally {
      setCreating(false);
    }
  };

  const formatRefreshed = (d) => {
    if (!d) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {lastRefreshed && (
            <span className="text-xs text-gray-400">Last refreshed {formatRefreshed(lastRefreshed)}</span>
          )}
          <button
            onClick={() => fetchNotifications(false)}
            className="h-9 px-3 text-xs border border-gray-200 bg-white rounded-md text-gray-600 hover:bg-gray-50 transition"
          >
            ↻ Refresh
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              className="h-9 px-3 text-xs bg-blue-700 hover:bg-blue-800 text-white rounded-md transition disabled:opacity-60"
            >
              {markingAll ? 'Marking…' : '✓ Mark all read'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Create test notification */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">🧪 Test — Create Notification</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Enter notification message…"
            className="flex-1 h-9 px-3 text-sm border border-amber-200 bg-white rounded-md outline-none focus:border-amber-400"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !newMessage.trim()}
            className="h-9 px-4 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-md transition disabled:opacity-50"
          >
            {creating ? 'Sending…' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-amber-600 mt-1.5">New notifications appear instantly. List auto-refreshes every 30 s.</p>
      </div>

      {/* Notification list */}
      {loading ? (
        <div className="text-center py-10 text-gray-400 text-sm">Loading notifications…</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">No notifications yet.</div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, idx) => (
            <div
              key={notif.id ?? idx}
              className={`bg-white rounded-lg border px-4 py-3.5 flex items-center justify-between transition ${
                notif.read ? 'border-gray-100 opacity-60' : 'border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${notif.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                <span className={`text-sm ${notif.read ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                  {notif.message}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className="text-xs text-gray-400">{notif.time}</span>
                {notif.id && !notif.read ? (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 px-2 py-0.5 rounded transition"
                  >
                    Mark read
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 italic">Read</span>
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
