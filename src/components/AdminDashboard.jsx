import React, { useState, useEffect } from 'react';
import { dashboardAPI, batchAPI, applicationAPI, candidateAPI } from '../services/api';

const OPERATIONAL_STATS = [
  { label: 'Total Courses', value: '-', trend: '', trendDir: 'up', color: '#2563eb' },
  { label: 'Active Batches', value: '-', trend: '', trendDir: 'flat', color: '#2563eb' },
  { label: 'Candidates Enrolled', value: '-', trend: '', trendDir: 'up', color: '#16a34a' },
  // { label: 'Pending Assignments', value: '-', trend: 'Needs attention', trendDir: 'down', color: '#d97706' },
];

// const IMPACT_STATS = [
//   { label: 'Assessment Pass Rate', value: '78%', trend: '+5% from last batch', trendDir: 'up', color: '#16a34a' },
//   { label: 'Placement Rate', value: '62%', trend: 'Target: 70%', trendDir: 'flat', color: '#d97706' },
//   { label: 'Job Retention', value: '85%', trend: '6-month retention', trendDir: 'up', color: '#16a34a' },
//   { label: 'Avg Attendance', value: '88%', trend: 'Above 80% target', trendDir: 'up', color: '#16a34a' },
// ];

const RECENT_APPLICATIONS = [
  { name: 'Priya Sharma', course: 'Stitching Basic', status: 'New', date: '10 Mar 2026' },
  { name: 'Anita Devi', course: 'Computer Fundamentals', status: 'New', date: '10 Mar 2026' },
  { name: 'Meena Kumari', course: 'Beauty Basic', status: 'Under Review', date: '9 Mar 2026' },
  { name: 'Sunita Yadav', course: 'Stitching Basic', status: 'Selected', date: '8 Mar 2026' },
  { name: 'Rekha Patel', course: 'Computer Fundamentals', status: 'Assigned', date: '7 Mar 2026' },
];

const BATCH_CAPACITY = [
  { name: 'Stitching Basic — Batch 3', enrolled: 18, max: 20 },
  { name: 'Computer Fund. — Batch 2', enrolled: 20, max: 20 },
  { name: 'Beauty Basic — Batch 1', enrolled: 12, max: 20 },
];

const ATTENDANCE_ALERTS = [
  { name: 'Kavita Singh', batch: 'Stitching Basic — Batch 3', pct: 62 },
  { name: 'Deepa Rani', batch: 'Computer Fund. — Batch 2', pct: 68 },
];

const getStatusBadgeStyle = (status) => {
  const styles = {
    New: { background: '#dbeafe', color: '#1d4ed8' },
    'Under Review': { background: '#fef3c7', color: '#92400e' },
    Selected: { background: '#dcfce7', color: '#166534' },
    Assigned: { background: '#e0e7ff', color: '#3730a3' },
    Rejected: { background: '#fee2e2', color: '#991b1b' },
  };
  return styles[status] || { background: '#f3f4f6', color: '#374151' };
};

const getTrendColor = (dir) => {
  if (dir === 'up') return '#16a34a';
  if (dir === 'down') return '#dc2626';
  return '#6b7280';
};

const getCapacityBarColor = (pct) => {
  if (pct >= 95) return '#ef4444';
  if (pct >= 80) return '#eab308';
  return '#22c55e';
};

const StatCard = ({ label, value, trend, trendDir, color, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px 22px',
        borderLeft: `4px solid ${color}`,
        boxShadow: isHovered ? '0 10px 25px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '34px', fontWeight: 700, color, marginBottom: '8px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: getTrendColor(trendDir) }}>{trend}</div>
    </div>
  );
};

const AdminDashboard = ({ currentUser, onNavigate }) => {
  const [apiStats, setApiStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [batchCapacity, setBatchCapacity] = useState([]);
  const [attendanceAlerts, setAttendanceAlerts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [statsData, batchesData, applicationsData] = await Promise.all([
          dashboardAPI.getAdminStats().catch(err => {
            console.error('Failed to load admin stats:', err);
            return null;
          }),
          batchAPI.getBatches().catch(err => {
            console.error('Failed to load batches:', err);
            return null;
          }),
          applicationAPI.getApplications().catch(err => {
            console.error('Failed to load applications:', err);
            return null;
          }),
        ]);

        // Set admin stats
        if (statsData) {
          setApiStats(statsData);
        }

        // Process batches with candidates
        if (batchesData) {
          const list = batchesData?.content ?? (Array.isArray(batchesData) ? batchesData : []);
          const batchesWithCandidates = await Promise.all(
            list.slice(0, 4).map(async (b) => {
              let candidateCount = 0;
              if (Array.isArray(b.candidates)) {
                candidateCount = b.candidates.length;
              } else {
                try {
                  const candidates = await candidateAPI.getCandidatesByBatchId(b.id);
                  candidateCount = Array.isArray(candidates) ? candidates.length : 0;
                } catch (err) {
                  console.error(`Failed to load candidates for batch ${b.id}:`, err);
                }
              }
              return {
                name: `${b.batchName ?? b.name ?? '—'}`,
                enrolled: candidateCount,
                max: b.capacity ?? b.maxCapacity ?? 20,
              };
            })
          );
          setBatchCapacity(batchesWithCandidates);

          // Extract attendance alerts from all batches
          const alerts = [];
          list.forEach((batch) => {
            if (Array.isArray(batch.candidatesWithAttendance)) {
              batch.candidatesWithAttendance.forEach((candidate) => {
                // Find the admission for this specific batch
                const batchAdmission = candidate.admissions?.find(adm => adm.batchId === batch.id);
                const attendancePercentage = batchAdmission?.attendancePercentage ?? candidate.attendancePercentage ?? 0;
                
                if (attendancePercentage < 70) {
                  alerts.push({
                    name: candidate.name || '—',
                    batch: batch.batchName || '—',
                    pct: attendancePercentage,
                  });
                }
              });
            }
          });
          setAttendanceAlerts(alerts);
        }

        // Process applications
        if (applicationsData) {
          const list = applicationsData?.data ?? (Array.isArray(applicationsData) ? applicationsData : []);
          const formatDate = (dateStr) => {
            if (!dateStr) return '—';
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
          };
          const formatStatus = (status) => {
            if (!status) return 'New';
            return status
              .toLowerCase()
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (char) => char.toUpperCase());
          };
          setRecentApps(list.slice(0, 5).map((a) => {
            const admission = Array.isArray(a.admissions) && a.admissions.length > 0 ? a.admissions[0] : null;
            const batchCourse = admission?.batch?.course?.courseName || admission?.batch?.courseName;
            const course = batchCourse || '—';
            const status = admission ? formatStatus(admission.status) : 'New';
            
            return {
              name: a.fullName ?? a.full_name ?? '—',
              course: course,
              status: status,
              date: formatDate(a.createdDate ?? a.created_date),
            };
          }));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const welcomeName = currentUser?.name?.split(' ')?.[0] || 'Admin';

  const operationalStats = apiStats
    ? [
        { label: 'Total Courses',        value: apiStats.totalCourses        ?? '—', trend: '', trendDir: 'flat', color: '#2563eb', page: 'Courses' },
        { label: 'Active Batches',        value: apiStats.activeBatches       ?? '—', trend: '', trendDir: 'flat', color: '#2563eb', page: 'BatchManagement' },
        { label: 'Candidates Enrolled',   value: apiStats.candidatesEnrolled  ?? '—', trend: '', trendDir: 'up',   color: '#16a34a', page: 'CandidateList' },
      ]
    : OPERATIONAL_STATS.map((stat, idx) => ({
        ...stat,
        page: idx === 0 ? 'Courses' : idx === 1 ? 'BatchManagement' : 'CandidateList'
      }));

  // const impactStats = apiStats
  //   ? [
  //       { label: 'Assessment Pass Rate', value: apiStats.assessmentPassRate ?? '—', trend: '', trendDir: 'up',   color: '#16a34a' },
  //       { label: 'Placement Rate',        value: apiStats.placementRate      ?? '—', trend: `Target: 70%`,        trendDir: 'flat', color: '#d97706' },
  //       { label: 'Job Retention',         value: apiStats.jobRetention       ?? '—', trend: '6-month retention', trendDir: 'up',   color: '#16a34a' },
  //       { label: 'Avg Attendance',        value: apiStats.avgAttendance      ?? '—', trend: 'Above 80% target',  trendDir: 'up',   color: '#16a34a' },
  //     ]
  //   : IMPACT_STATS;

  const displayApps   = recentApps.length   > 0 ? recentApps   : [];
  const displayBatches = batchCapacity.length > 0 ? batchCapacity : BATCH_CAPACITY;

  return (
    <div style={{ background: '#f9fafb', padding: '32px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Welcome back, {welcomeName}. Here's your operational overview.</p>
      </div>

      {/* Operational Stats */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Operational Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {operationalStats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} trendDir={stat.trendDir} color={stat.color} onClick={() => stat.page && onNavigate && onNavigate(stat.page)} />
          ))}
        </div>
      </div>

      {/* Impact Stats */}
      {/* <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Impact Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {impactStats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} trendDir={stat.trendDir} color={stat.color} />
          ))}
        </div>
      </div> */}

      {/* Action Buttons */}
      <div style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <button onClick={() => onNavigate && onNavigate('UserManagement', { openModal: 'OC' })}
          style={{ fontSize: '14px', color: '#7c3aed', background: 'white', border: '2px solid #7c3aed', borderRadius: '8px', padding: '12px 20px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#7c3aed'; }}>
          <span style={{ fontSize: '18px', lineHeight: '1' }}>+</span>
          Add Office Coordinator
        </button>
        <button onClick={() => onNavigate && onNavigate('UserManagement', { openModal: 'Trainer' })}
          style={{ fontSize: '14px', color: '#0d9488', background: 'white', border: '2px solid #0d9488', borderRadius: '8px', padding: '12px 20px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#0d9488'; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0d9488'; }}>
          <span style={{ fontSize: '18px', lineHeight: '1' }}>+</span>
          Add Trainer
        </button>
      </div>

      {/* Recent Applications */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>Recent Applications</h2>
          <button onClick={() => onNavigate && onNavigate('CandidateList')}
            style={{ fontSize: '13px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
            View All →
          </button>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                {['Name', 'Course / Track', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', padding: '12px 0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayApps.map((app, idx) => {
                const badgeStyle = getStatusBadgeStyle(app.status);
                return (
                  <tr key={idx} style={{ borderBottom: idx < displayApps.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{app.name}</td>
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{app.course}</td>
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>
                      <span style={{ background: badgeStyle.background, color: badgeStyle.color, borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, display: 'inline-block' }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '13.5px', color: '#374151', padding: '12px 0' }}>{app.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Batch Capacity */}
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Batch Capacity</h3>
          <div>
            {displayBatches.map((batch, idx) => {
              const pct = batch.max > 0 ? Math.round((batch.enrolled / batch.max) * 100) : 0;
              return (
                <div key={idx} style={{ marginBottom: idx < displayBatches.length - 1 ? '16px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827' }}>{batch.name}</span>
                    <span style={{ fontSize: '13.5px', color: '#6b7280' }}>{batch.enrolled}/{batch.max}</span>
                  </div>
                  <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: getCapacityBarColor(pct), width: `${pct}%`, transition: 'width 0.3s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Alerts */}
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px 22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Attendance Alerts</h3>
          <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
            {attendanceAlerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '13px' }}>
                No attendance alerts. All candidates are above 70%.
              </div>
            ) : (
              attendanceAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#fef3c7',
                    border: '1px solid #fcd34d',
                    borderRadius: '8px',
                    marginBottom: idx < attendanceAlerts.length - 1 ? '12px' : 0,
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#fbbf24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#92400e',
                      fontWeight: 600,
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    ⚠
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827' }}>{alert.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{alert.batch}</div>
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#dc2626', flexShrink: 0 }}>{alert.pct}%</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


