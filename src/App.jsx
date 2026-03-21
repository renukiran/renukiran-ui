import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Batches from './pages/Batches';
import BatchManagement from './pages/BatchManagement';
import BatchDetail from './pages/BatchDetail';
import Courses from './pages/Courses';
import UserManagement from './pages/UserManagement';
import Placements from './pages/Placements';
import PlacementDetail from './pages/PlacementDetail';
import Notifications from './pages/Notifications';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('AdminDashboard');
  const [pageData, setPageData] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActivePage(user.role === 'admin' ? 'AdminDashboard' : 'Dashboard');
  };

  const handleNavigate = (page, data = null) => {
    setActivePage(page);
    setPageData(data);
  };

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'AdminDashboard':
        return <AdminDashboard />;
      case 'Courses':
        return <Courses onNavigate={handleNavigate} />;
      case 'BatchManagement':
        return <BatchManagement onNavigate={handleNavigate} />;
      case 'BatchDetail':
        return <BatchDetail batch={pageData} onNavigate={handleNavigate} />;
      case 'UserManagement':
        return <UserManagement />;
      case 'Dashboard':
        return <Dashboard />;
      case 'Applications':
        return <Applications onNavigate={handleNavigate} />;
      case 'Batches':
        return <Batches />;
      case 'Placements':
        return <Placements onNavigate={handleNavigate} />;
      case 'PlacementDetail':
        return <PlacementDetail placement={pageData} onNavigate={handleNavigate} />;
      case 'Notifications':
        return <Notifications />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} currentUser={currentUser} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{renderPage()}</div>
      </main>
    </div>
  );
};

export default App;
