import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const ROLE_CONFIG = {
  ADMIN: { className: 'bg-blue-100 text-blue-700', label: 'Admin' },
  TRAINER: { className: 'bg-teal-100 text-teal-700', label: 'Trainer' },
  COORDINATOR: { className: 'bg-purple-100 text-purple-700', label: 'Coordinator' },
};

const AVATAR_COLORS = ['bg-blue-700', 'bg-teal-600', 'bg-purple-600', 'bg-amber-600', 'bg-indigo-600'];

// ── helpers ─────────────────────────────────────────────────────────────────
const genPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const OC_PERMISSIONS = [
  { can: true, text: 'Enter candidate applications' },
  { can: true, text: 'Assign candidates to batches' },
  { can: true, text: 'Update candidate status' },
  { can: true, text: 'Manage training progress' },
  { can: true, text: 'Track placements & follow-ups' },
  { can: true, text: 'View operational dashboard' },
  { can: false, text: 'Configure courses' },
  { can: false, text: 'Manage users' },
];

const TRAINER_PERMISSIONS = [
  { can: true, text: 'Record attendance' },
  { can: true, text: 'Enter assessment results' },
  { can: true, text: 'View assigned batch candidates' },
  { can: true, text: 'View in-app notifications' },
  { can: false, text: 'Enter applications' },
  { can: false, text: 'Assign batches' },
  { can: false, text: 'Track placements' },
  { can: false, text: 'Configure courses' },
  { can: false, text: 'Manage users' },
  { can: false, text: 'Access reports' },
];

const TRAINER_COURSES = [
  { id: 'stitching', label: 'Stitching', icon: '🧵' },
  { id: 'computers', label: 'Computers', icon: '💻' },
  { id: 'beauty', label: 'Beauty', icon: '💄' },
  { id: 'bagmaking', label: 'Bag Making', icon: '👜' },
  { id: 'food', label: 'Food Enterprise', icon: '🍲' },
  { id: 'handicraft', label: 'Handicraft', icon: '🎨' },
];

// ── EditUserModal ───────────────────────────────────────────────────────
const EditUserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({ name: user.name || '', email: user.email || '', phone: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(user.id, { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password.trim() || null });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="text-lg font-bold text-gray-900">Edit User &mdash; {user.name}</div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 text-xl">&times;</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Full Name <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
              className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email <span className="text-red-500">*</span></label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="9876543210"
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">New Password <span className="text-xs font-normal text-gray-400">(leave blank to keep current)</span></label>
            <div className="flex gap-2">
              <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)}
                placeholder="Enter new password"
                className="flex-1 h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600" />
              <button type="button" onClick={() => { set('password', genPassword()); setShowPwd(true); }}
                className="h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-100">&uarr; Gen</button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="h-10 px-5 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="h-10 px-5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// ── UserFormModal ─────────────────────────────────────────────────────────────
const UserFormModal = ({ role, onClose, onSave }) => {
  const isOC = role === 'COORDINATOR';
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: genPassword() });
  const [showPwd, setShowPwd] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
  const toggleCourse = (id) =>
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password.trim()) e.password = 'Password is required';
    if (!isOC && selectedCourses.length === 0) e.courses = 'Select at least one course';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const words = form.name.trim().split(/\s+/);
    const initials = ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase();
    onSave({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password, role, initials, active: true });
    onClose();
  };

  const btnClass = isOC ? 'bg-purple-700 hover:bg-purple-800' : 'bg-teal-700 hover:bg-teal-800';
  const iconBg = isOC ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700';
  const permBg = isOC ? 'bg-purple-50 border-purple-200' : 'bg-teal-50 border-teal-200';
  const permTitle = isOC ? 'text-purple-700' : 'text-teal-700';
  const permissions = isOC ? OC_PERMISSIONS : TRAINER_PERMISSIONS;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${iconBg}`}>
              {isOC ? '📋' : '🎓'}
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {isOC ? 'Add Office Coordinator' : 'Add Trainer'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {isOC ? 'Data entry, batch assignment & placement tracking' : 'Attendance recording & assessment entry'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-xl transition"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Details</p>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder={isOC ? 'e.g., Rekha Patel' : 'e.g., Suman Kumar'}
              className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
                errors.name ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder={isOC ? 'rekha@rwf.org' : 'suman@rwf.org'}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.email ? (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Used for login</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="9876543210"
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                className={`w-full h-10 pl-3 pr-10 text-sm border rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-mono tracking-wider ${
                  errors.password ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPwd ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-gray-400">Auto-generated</span>
              <button
                type="button"
                onClick={() => set('password', genPassword())}
                className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded transition"
              >
                ↻ Regenerate
              </button>
            </div>
            {errors.password ? (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">Share securely. User must change on first login.</p>
            )}
          </div>

          {/* Trainer: course chips */}
          {!isOC && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Course Assignment</p>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Courses this trainer can teach <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2.5">The trainer will only see batches for these courses.</p>
              <div className="flex flex-wrap gap-2">
                {TRAINER_COURSES.map((c) => {
                  const sel = selectedCourses.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCourse(c.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                        sel
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-teal-400'
                      }`}
                    >
                      {sel && <span className="text-xs font-bold">✓</span>}
                      <span>{c.icon}</span>
                      {c.label}
                    </button>
                  );
                })}
              </div>
              {errors.courses && <p className="text-xs text-red-500 mt-1.5">{errors.courses}</p>}
            </div>
          )}

          {/* Permissions */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Permissions for this role</p>
            <div className={`rounded-lg border p-3.5 ${permBg}`}>
              <p className={`text-xs font-bold mb-2.5 ${permTitle}`}>
                {isOC ? '📋 Office Coordinator can:' : '🎓 Trainer can:'}
              </p>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                {permissions.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    {p.can ? (
                      <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                    ) : (
                      <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                    )}
                    <span className={p.can ? 'text-gray-600' : 'text-gray-400'}>{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="h-10 px-5 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`h-10 px-5 text-sm font-semibold text-white rounded-md transition ${btnClass}`}
          >
            {isOC ? 'Create Office Coordinator' : 'Create Trainer'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = ({ pageData }) => {
  const [users, setUsers] = useState([
    { id: 1, initials: 'VA', name: 'Vinay Adalath', email: 'vinay@rwf.org', role: 'ADMIN', active: true },
    { id: 2, initials: 'SK', name: 'Suman Kumar', email: 'suman@rwf.org', role: 'TRAINER', active: true },
    { id: 3, initials: 'RP', name: 'Rekha Patel', email: 'rekha@rwf.org', role: 'COORDINATOR', active: true },
    { id: 4, initials: 'AM', name: 'Asha Mehra', email: 'asha@rwf.org', role: 'TRAINER', active: true },
    { id: 5, initials: 'PK', name: 'Pradeep K.', email: 'pradeep@rwf.org', role: 'COORDINATOR', active: false },
  ]);

  const [showOCModal, setShowOCModal] = useState(false);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Role: All');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userAPI.getUsers();
        if (data && data.length > 0) {
          setUsers(data.map((u) => ({
            id: u.id,
            initials: (u.firstName && u.lastName && u.firstName !== u.lastName
              ? (u.firstName[0] + u.lastName[0])
              : (u.firstName?.[0] ?? u.lastName?.[0] ?? u.username?.[0] ?? '?')).toUpperCase(),
                name: (u.firstName && u.lastName && u.firstName !== u.lastName
              ? `${u.firstName} ${u.lastName}`
              : u.firstName || u.lastName || '').trim() || u.username,
            email: u.email,
            role: u.userType ?? 'TRAINER',
            active: u.active ?? true,
          })));
        }
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

    if (pageData?.openModal === 'OC') {
      setShowOCModal(true);
    } else if (pageData?.openModal === 'Trainer') {
      setShowTrainerModal(true);
    }
  }, [pageData]);

  const toggleStatus = async (id) => {
    try {
      const updated = await userAPI.toggleUserStatus(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: updated.active } : u)));
    } catch (err) {
      setError('Failed to update user status');
      console.error(err);
    }
  };

  const handleAddUser = async (user) => {
    try {
      const [firstName = '', ...rest] = user.name.trim().split(/\s+/);
      const lastName = rest.join(' ') || '';
      const rawUserName = user.email.split('@')[0].replace(/[^A-Za-z0-9]/g, '');
      const padded = rawUserName.length >= 4 ? rawUserName : rawUserName.padEnd(4, '0');
      const userName = padded.substring(0, 20);
      let phone = null;
      if (user.phone && user.phone.trim()) {
        const digits = user.phone.trim().replace(/^\+91/, '').replace(/\D/g, '').slice(0, 10);
        if (digits.length === 10) phone = `+91${digits}`;
      }
      const payload = {
        userName,
        password: user.password || 'TempPass@123',
        email: user.email,
        phone,
        firstName,
        lastName,
        skills: null,
        userType: user.role === 'COORDINATOR' ? 'COORDINATOR' : 'TRAINER',
      };
      const saved = await userAPI.createUser(payload);
      const words = user.name.trim().split(/\s+/);
      const initials = ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase() || words[0]?.[0]?.toUpperCase() || '?';
      setUsers((prev) => [
        ...prev,
        {
          id: saved.id,
          initials,
          name: user.name.trim(),
          email: user.email,
          role: user.role,
          active: true,
        },
      ]);
      setShowOCModal(false);
      setShowTrainerModal(false);
    } catch (err) {
      const msg = err?.message || 'Unknown error';
      setError(`Failed to create user: ${msg}`);
      console.error('createUser error:', err);
    }
  };

  const handleEditUser = async (id, changes) => {
    try {
      const target = users.find((u) => u.id === id);
      const [firstName = '', ...rest] = changes.name.trim().split(/\s+/);
      const lastName = rest.join(' ') || '';
      const rawUserName = changes.email.split('@')[0];
      const userName = rawUserName.length >= 4 ? rawUserName : rawUserName.padEnd(4, '0');
      let phone = null;
      if (changes.phone && changes.phone.trim()) {
        const digits = changes.phone.trim().replace(/^\+91/, '').replace(/\D/g, '').slice(0, 10);
        if (digits.length === 10) phone = `+91${digits}`;
      }
      const payload = {
        userName,
        ...(changes.password ? { password: changes.password } : {}),
        email: changes.email,
        phone,
        firstName,
        lastName,
        skills: null,
        userType: target?.role === 'COORDINATOR' ? 'COORDINATOR' : 'TRAINER',
      };
      await userAPI.updateUser(id, payload);
      const words = changes.name.trim().split(/\s+/);
      const initials = ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase();
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, name: changes.name, email: changes.email, initials } : u));
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Unknown error';
      setError(`Failed to update user: ${msg}`);
      console.error('updateUser error:', err);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === 'Role: All' || u.role === roleFilter;
    const matchStatus =
      statusFilter === 'Status: All' ||
      (statusFilter === 'Active' ? u.active : !u.active);
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Staff Accounts</h1>
        <div className="flex gap-2.5">
          <button onClick={() => setShowOCModal(true)} className="inline-flex items-center gap-1.5 h-11 px-4 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold rounded-md transition">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Office Coordinator
          </button>
          <button onClick={() => setShowTrainerModal(true)} className="inline-flex items-center gap-1.5 h-11 px-4 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-md transition">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Trainer
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-3 pr-8 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 appearance-none cursor-pointer"
        >
          {['Role: All', 'ADMIN', 'TRAINER', 'COORDINATOR'].map((r) => <option key={r}>{r}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 pr-8 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 appearance-none cursor-pointer"
        >
          {['Status: All', 'Active', 'Inactive'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">Loading users...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 ${h === 'Actions' ? 'w-24' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No users found.</td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={u.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                          {u.initials}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_CONFIG[u.role]?.className || 'bg-gray-100 text-gray-600'}`}>
                        {ROLE_CONFIG[u.role]?.label || u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${u.active ? 'text-green-700' : 'text-gray-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${u.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {u.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditUser(u)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition text-sm"
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className={`w-8 h-8 flex items-center justify-center border rounded-md bg-white transition text-sm ${
                            u.active
                              ? 'border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                              : 'border-gray-200 text-green-600 hover:bg-green-50 hover:border-green-300'
                          }`}
                          title={u.active ? 'Deactivate' : 'Activate'}
                        >
                          {u.active ? '⏸' : '▶'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {showOCModal && (
        <UserFormModal role="COORDINATOR" onClose={() => setShowOCModal(false)} onSave={handleAddUser} />
      )}
      {showTrainerModal && (
        <UserFormModal role="TRAINER" onClose={() => setShowTrainerModal(false)} onSave={handleAddUser} />
      )}
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={handleEditUser} />
      )}
    </div>
  );
};

export default UserManagement;
