import React, { useState } from 'react';

const STEPS = ['New', 'Under Review', 'Selected', 'Assigned', 'Training', 'Completed', 'Placed'];
const ACTIVE_STEP_INDEX = 3;

const PERSONAL_INFO = {
  batch: 'Batch 1',
  fullName: 'Priya Sharma',
  age: '24',
  fatherName: 'Ram Sharma',
  mobile: '9876543210',
  alternateNumber: '9876543211',
  address: 'Tilpat, Faridabad, HR-121003',
  aadhaar: '4321 5678 1234',
  bankAccount: 'Yes',
  localResident: 'Yes',
  caste: 'OBC',
};

const BATCH_INFO = {
  batch: 'Stitching B1',
  trainer: 'Suman K.',
  period: 'Mar 1 – Jun 30',
  attendance: '93%',
};

const STATUS_HISTORY = [
  { date: 'Mar 13, 2026', status: 'Assigned to Batch B1', by: 'by Rekha P.' },
  { date: 'Mar 12, 2026', status: 'Selected', by: 'by Vinay A.' },
  { date: 'Mar 11, 2026', status: 'Under Review', by: 'by Vinay A.' },
  { date: 'Mar 10, 2026', status: 'New Application', by: 'by Rekha P.' },
];

const TABS = ['Personal', 'Household', 'Education', 'Training', 'Need Assessment'];

const PlaceholderPage = ({ title, onBack }) => (
  <div style={{ padding: '60px', textAlign: 'center', minHeight: '100vh', background: '#f3f4f6' }}>
    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h1>
    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>This page is under construction.</p>
    <button
      onClick={onBack}
      style={{
        marginTop: '24px',
        background: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 0.3s ease',
      }}
      onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
      onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
    >
      ← Go Back
    </button>
  </div>
);

const StepperCircle = ({ step, index, isCompleted, isActive }) => {
  let bgColor = '#fff';
  let borderColor = '#d1d5db';
  let textColor = '#9ca3af';
  let content = '';

  if (isCompleted) {
    bgColor = '#16a34a';
    borderColor = '#16a34a';
    textColor = '#16a34a';
    content = '✓';
  } else if (isActive) {
    bgColor = '#1e3a5f';
    borderColor = '#1e3a5f';
    textColor = '#1e3a5f';
    content = '●';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: bgColor,
          border: `2px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '16px',
          fontWeight: 700,
          marginBottom: '8px',
        }}
      >
        {content}
      </div>
      <span style={{ fontSize: '12px', color: textColor, fontWeight: isActive ? 700 : 600, textAlign: 'center' }}>
        {step}
      </span>
    </div>
  );
};

const CandidateProfile = ({ candidateData, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('Personal');
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState('profile');

  const candidateName = candidateData?.name || 'Priya Sharma';

  if (currentPage === 'editCandidate') {
    return <PlaceholderPage title="Edit Candidate" onBack={() => setCurrentPage('profile')} />;
  }
  if (currentPage === 'batchDetail') {
    return <PlaceholderPage title="Batch Detail" onBack={() => setCurrentPage('profile')} />;
  }
  if (currentPage === 'trainerProfile') {
    return <PlaceholderPage title="Trainer Profile" onBack={() => setCurrentPage('profile')} />;
  }

  return (
    <div style={{ background: '#f3f4f6', padding: '28px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => onNavigate('CandidateList')}
            style={{ fontSize: '18px', color: '#374151', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>{candidateName}</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
          <button
            onClick={() => setCurrentPage('editCandidate')}
            style={{
              border: '1px solid #e5e7eb',
              background: 'white',
              color: '#374151',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#f9fafb')}
            onMouseLeave={(e) => (e.target.style.background = 'white')}
          >
            ✎ Edit
          </button>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              border: '1px solid #e5e7eb',
              background: 'white',
              color: '#374151',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#f9fafb')}
            onMouseLeave={(e) => (e.target.style.background = 'white')}
          >
            ⋯
          </button>
          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginTop: '4px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
              }}
            >
              <button
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 16px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.target.style.background = 'none')}
              >
                Delete Candidate
              </button>
              <button
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 16px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151',
                  borderTop: '1px solid #f3f4f6',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.target.style.background = 'none')}
              >
                Export PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Progress Stepper */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '24px 32px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {STEPS.map((step, idx) => (
          <React.Fragment key={idx}>
            <StepperCircle step={step} index={idx} isCompleted={idx < ACTIVE_STEP_INDEX} isActive={idx === ACTIVE_STEP_INDEX} />
            {idx < STEPS.length - 1 && (
              <div
                style={{
                  height: '2px',
                  flex: 1,
                  background: idx < ACTIVE_STEP_INDEX ? '#16a34a' : '#d1d5db',
                  marginBottom: '24px',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tab Navigation */}
      <div style={{ background: '#fff', borderRadius: '10px', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', padding: '0 24px' }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '14px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                color: activeTab === tab ? '#2563eb' : '#6b7280',
                borderBottom: activeTab === tab ? '2px solid #2563eb' : 'none',
                fontWeight: activeTab === tab ? 600 : 400,
                transition: 'all 0.3s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px', background: '#fff' }}>
          {activeTab === 'Personal' ? (
            <div>
              {/* Batch */}
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>
                  Batch
                </label>
                <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{PERSONAL_INFO.batch}</div>
              </div>

              {/* Full Name & Age */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>
                    Full Name
                  </label>
                  <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{PERSONAL_INFO.fullName}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>
                    Age
                  </label>
                  <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{PERSONAL_INFO.age}</div>
                </div>
              </div>

              {/* Father Name */}
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>
                  Father / Husband Name
                </label>
                <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{PERSONAL_INFO.fatherName}</div>
              </div>

              {/* Mobile & Alternate */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>
                    Mobile
                  </label>
                  <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{PERSONAL_INFO.mobile}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>
                    Alternate Mobile
                  </label>
                  <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{PERSONAL_INFO.alternateNumber}</div>
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>
                  Address
                </label>
                <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{PERSONAL_INFO.address}</div>
              </div>

              {/* Aadhaar & Bank Account */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>
                    Aadhaar Number
                  </label>
                  <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    {showAadhaar ? PERSONAL_INFO.aadhaar : 'XXXX XXXX 1234'}
                    <button
                      onClick={() => setShowAadhaar(!showAadhaar)}
                      style={{
                        marginLeft: '8px',
                        color: '#2563eb',
                        fontSize: '13px',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        fontWeight: 600,
                      }}
                    >
                      {showAadhaar ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>
                    Bank Account
                  </label>
                  <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{PERSONAL_INFO.bankAccount}</div>
                </div>
              </div>

              {/* Local Resident & Caste */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>
                    Local Resident
                  </label>
                  <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{PERSONAL_INFO.localResident}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>
                    Caste Category
                  </label>
                  <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{PERSONAL_INFO.caste}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '14px' }}>
              {activeTab} section coming soon.
            </div>
          )}
        </div>
      </div>

      {/* Batch Assignment Card */}
      <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '20px 24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e40af', marginBottom: '16px', margin: 0 }}>Batch Assignment</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Batch
            </label>
            <button
              onClick={() => setCurrentPage('batchDetail')}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left',
              }}
            >
              {BATCH_INFO.batch}
            </button>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Trainer
            </label>
            <button
              onClick={() => setCurrentPage('trainerProfile')}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left',
              }}
            >
              {BATCH_INFO.trainer}
            </button>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Period
            </label>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>{BATCH_INFO.period}</div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Attendance
            </label>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#16a34a' }}>{BATCH_INFO.attendance}</div>
          </div>
        </div>
      </div>

      {/* Status History */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '20px', margin: '0 0 20px 0' }}>Status History</h3>
        <div>
          {STATUS_HISTORY.map((entry, idx) => (
            <div key={idx} style={{ display: 'flex', marginBottom: idx < STATUS_HISTORY.length - 1 ? '24px' : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: idx === 0 ? '#2563eb' : 'white',
                    border: idx === 0 ? 'none' : '2px solid #d1d5db',
                    marginBottom: '8px',
                  }}
                />
                {idx < STATUS_HISTORY.length - 1 && (
                  <div style={{ width: '2px', height: '28px', background: '#e5e7eb', marginTop: '8px' }} />
                )}
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{entry.date}</div>
                <div style={{ fontSize: '14px', color: '#111827', fontWeight: 600, marginTop: '4px' }}>{entry.status}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{entry.by}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
