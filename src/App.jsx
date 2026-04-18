import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CandidateList from './components/CandidateList';
import CandidateProfile from './components/CandidateProfile';
import Applications from './pages/Applications';
import MyBatches from './pages/MyBatches';
import BatchDetail from './components/BatchDetail';
import BatchManagement from './pages/BatchManagement';
import Courses from './pages/Courses';
import UserManagement from './pages/UserManagement';
import Placements from './pages/Placements';
import PlacementDetail from './pages/PlacementDetail';
import Notifications from './pages/Notifications';
import { notificationAPI } from './services/api';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('Dashboard');
  const [pageData, setPageData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const pollRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationAPI.getUnreadCount();
      setNotificationCount(data?.count ?? 0);
    } catch (_) {}
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchUnreadCount();
    pollRef.current = setInterval(fetchUnreadCount, 30_000);
    return () => clearInterval(pollRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActivePage('Dashboard');
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
      case 'Dashboard':
        return <Dashboard currentUser={currentUser} onNavigate={handleNavigate} />;
      case 'CandidateList':
        return <CandidateList onNavigate={handleNavigate} />;
      case 'CandidateProfile':
        return <CandidateProfile candidateData={pageData} onNavigate={handleNavigate} />;
      case 'MyBatches':
        return <MyBatches currentUser={currentUser} onNavigate={handleNavigate} />;
      case 'BatchDetail':
        return <BatchDetail batchData={pageData} onNavigate={handleNavigate} />;
      case 'Courses':
        return <Courses onNavigate={handleNavigate} />;
      case 'BatchManagement':
        return <BatchManagement onNavigate={handleNavigate} />;
      case 'UserManagement':
        return <UserManagement />;
      case 'Applications':
        return <Applications onNavigate={handleNavigate} />;
      case 'Placements':
        return <Placements onNavigate={handleNavigate} />;
      case 'PlacementDetail':
        return <PlacementDetail placement={pageData} onNavigate={handleNavigate} />;
      case 'Notifications':
        return <Notifications onCountChange={setNotificationCount} />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('rememberMe');
    setCurrentUser(null);
    setActivePage('Dashboard');
    setPageData(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} currentUser={currentUser} notificationCount={notificationCount} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>{currentUser?.name}</span>
          <button
            onClick={handleLogout}
            style={{ fontSize: '13px', color: '#dc2626', background: 'none', border: '1px solid #dc2626', borderRadius: '6px', padding: '5px 14px', cursor: 'pointer', fontWeight: 600 }}
          >
            Logout
          </button>
        </div>
        <main className="flex-1 overflow-auto">
          {(activePage === 'Dashboard' || activePage === 'MyBatches' || activePage === 'BatchDetail') ? renderPage() : <div className="p-8">{renderPage()}</div>}
        </main>
      </div>
    </div>
  );
};

export default App;
