import React from 'react';
import { Home, FileText, Users, Bookmark, Bell } from 'lucide-react';

const Sidebar = ({ activePage, onNavigate }) => {
  const navLinks = [
    { name: 'Dashboard', icon: Home },
    { name: 'Applications', icon: FileText },
    { name: 'Batches', icon: Users },
    { name: 'Placements', icon: Bookmark },
    { name: 'Notifications', icon: Bell },
  ];

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
        <p className="text-sm font-bold text-gray-800">Office Coordinator</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => onNavigate(name)}
            className={`flex items-center w-full px-4 py-2.5 text-sm rounded-sm transition-all ${
              activePage === name
                ? 'border-l-4 border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon
              size={18}
              className={`mr-3 ${activePage === name ? 'text-blue-600' : 'text-gray-400'}`}
            />
            {name}
          </button>
        ))}
      </nav>

      {/* Avatar */}
      <div className="p-6 border-t border-gray-200 flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          SP
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">Sunita Patel</p>
          <p className="text-xs text-gray-500">Office Coordinator</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
