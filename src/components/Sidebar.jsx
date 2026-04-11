import React from 'react';
import { Home, FileText, Users, Bookmark, Bell, BookOpen, LayoutGrid, UserCog } from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard', label: 'Dashboard', icon: LayoutGrid },
  { name: 'Courses', label: 'Courses', icon: BookOpen },
  { name: 'BatchManagement', label: 'Batches', icon: Users },
  { name: 'UserManagement', label: 'Users', icon: UserCog },
  { name: 'Notifications', label: 'Notifications', icon: Bell },
];

const OC_NAV = [
  { name: 'Dashboard', label: 'Dashboard', icon: Home },
  { name: 'CandidateList', label: 'Candidates', icon: FileText },
  { name: 'BatchManagement', label: 'Batches', icon: Users },
  { name: 'Placements', label: 'Placements', icon: Bookmark, disabled: true },
  { name: 'Notifications', label: 'Notifications', icon: Bell },
];

const TRAINER_NAV = [
  { name: 'Dashboard', label: 'Dashboard', icon: Home },
  { name: 'MyBatches', label: 'My Batches', icon: BookOpen },
  { name: 'Notifications', label: 'Notifications', icon: Bell },
];

const Sidebar = ({ activePage, onNavigate, currentUser, notificationCount = 0 }) => {
  const role = (currentUser?.role || '').toLowerCase();
  const isAdmin = role === 'admin';
  const isTrainer = role === 'trainer';
  const navLinks = isAdmin ? ADMIN_NAV : isTrainer ? TRAINER_NAV : OC_NAV;
  const roleLabel = isAdmin ? 'Admin' : isTrainer ? 'Trainer' : 'Coordinator';
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold">
          <span className="text-green-600">Renu</span>
          <span className="text-blue-600">Kiran</span>
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Learning Portal</p>
      </div>

      {/* Role */}
      <div className="px-6 py-4 border-b border-gray-200">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Role</p>
        <p className="text-sm font-bold text-gray-800">{roleLabel}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map(({ name, label, icon: Icon, disabled }) => (
          <button
            key={name}
            onClick={() => !disabled && onNavigate(name)}
            disabled={disabled}
            className={`flex items-center w-full px-4 py-2.5 text-sm rounded-sm transition-all ${
              disabled
                ? 'text-gray-300 cursor-not-allowed'
                : activePage === name
                ? 'border-l-4 border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon
              size={18}
              className={`mr-3 ${disabled ? 'text-gray-300' : activePage === name ? 'text-blue-600' : 'text-gray-400'}`}
            />
            <span className="flex-1 text-left">{label}</span>
            {name === 'Notifications' && notificationCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Avatar */}
      <div className="p-6 border-t border-gray-200 flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">{currentUser?.name || 'User'}</p>
          <p className="text-xs text-gray-500">{roleLabel}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
