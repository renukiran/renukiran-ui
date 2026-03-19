import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Batches from './pages/Batches';
import Placements from './pages/Placements';
import Notifications from './pages/Notifications';

const App = () => {
  const [activePage, setActivePage] = useState('Applications');

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Applications':
        return <Applications onNavigate={setActivePage} />;
      case 'Batches':
        return <Batches />;
      case 'Placements':
        return <Placements />;
      case 'Notifications':
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{renderPage()}</div>
      </main>
    </div>
  );
};

export default App;
