import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CandidateList from './components/CandidateList';
import CandidateProfile from './components/CandidateProfile';
import Applications from './pages/Applications';
import MyBatches from './pages/MyBatches';
import BatchDetail from './components/BatchDetail';
import Batches from './pages/Batches';
import BatchManagement from './pages/BatchManagement';
import Courses from './pages/Courses';
import UserManagement from './pages/UserManagement';
import Placements from './pages/Placements';
import PlacementDetail from './pages/PlacementDetail';
import Notifications from './pages/Notifications';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('Dashboard');
  const [pageData, setPageData] = useState(null);

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
        return <MyBatches onNavigate={handleNavigate} />;
      case 'BatchDetail':
        return <BatchDetail batchData={pageData} />;
      case 'Courses':
        return <UserManagement />;
      case 'Applications':
        return <Applications onNavigate={handleNavigate} />;
      case 'Placements':
        return <Placements onNavigate={handleNavigate} />;
      case 'PlacementDetail':
        return <PlacementDetail placement={pageData} onNavigate={handleNavigate} />;
      case 'Notifications':
        return <Notifications />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} currentUser={currentUser} />
      <main className="flex-1 overflow-auto">
        {(activePage === 'Dashboard' || activePage === 'MyBatches' || activePage === 'BatchDetail') ? renderPage() : <div className="p-8">{renderPage()}</div>}
      </main>
    </div>
  );
};

export default App;
