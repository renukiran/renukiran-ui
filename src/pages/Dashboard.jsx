import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import OCDashboard from '../components/OCDashboard';
import TrainerDashboard from '../components/TrainerDashboard';

const Dashboard = ({ currentUser, onNavigate }) => {
  if (!currentUser) {
    return <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>;
  }

  const role = (currentUser.role || '').toUpperCase();
  if (role === 'ADMIN') {
    return <AdminDashboard currentUser={currentUser} onNavigate={onNavigate} />;
  } else if (role === 'TRAINER') {
    return <TrainerDashboard currentUser={currentUser} onNavigate={onNavigate} />;
  } else {
    return <OCDashboard currentUser={currentUser} onNavigate={onNavigate} />;
  }
};

export default Dashboard;
