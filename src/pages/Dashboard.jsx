import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import OCDashboard from '../components/OCDashboard';
import TrainerDashboard from '../components/TrainerDashboard';

const Dashboard = ({ currentUser, onNavigate }) => {
  if (!currentUser) {
    return <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>;
  }

  if (currentUser.role === 'admin') {
    return <AdminDashboard />;
  } else if (currentUser.role === 'trainer') {
    return <TrainerDashboard />;
  } else {
    return <OCDashboard onNavigate={onNavigate} />;
  }
};

export default Dashboard;
