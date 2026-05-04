import React, { useState } from 'react';

const Field = ({ label, value }) => (
  <div>
    <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>{label}</label>
    <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{value || '—'}</div>
  </div>
);

const Row = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
    {children}
  </div>
);

const YES_NO = (val) => val === 'YES' ? 'Yes' : val === 'NO' ? 'No' : val || '—';

const EDUCATION_MAP = { NO_FORMAL_EDUCATION: 'No Formal Education', PRIMARY: 'Primary', SECONDARY: 'Secondary', HIGHER_SECONDARY: 'Higher Secondary', GRADUATE: 'Graduate', OTHER: 'Other' };
const STITCHING_MAP = { NONE: 'None', BASIC: 'Basic', GOOD: 'Good', ADVANCED: 'Advanced' };
const MIGRATION_MAP = { STAY_LONG_TERM: 'Will stay long-term', MAYBE_WILL_MOVE: 'Maybe will move', LIKELY_TO_MOVE: 'Likely to move', DOES_NOT_KNOW: 'Does not know' };
const HOUSING_MAP = { RENTED: 'Rented', OWN_PUCCA: 'Own (Pucca)', OWN_KUTCHA: 'Own (Kutcha)' };
const TRACK_MAP = { TAILORING: 'Tailoring', BEAUTY_AND_GROOMING: 'Beauty & Grooming', FOOD_BUSINESS: 'Food Business', HANDICRAFT: 'Handicraft', HOME_BASED_PRODUCTION: 'Home-Based Production', OTHER: 'Other' };
const MOTIVATION_MAP = { WANT_INCOME_IMMEDIATELY: 'Want income immediately', WANT_TO_SUPPORT_FAMILY: 'Want to support family', WANT_TO_LEARN_MARKET_DEMAND_SKILLS: 'Want to learn market-demand skills', WANT_HOME_BASED_WORK: 'Want home-based work', WANT_TO_START_MICRO_ENTERPRISE: 'Want to start micro-enterprise', WANT_TO_JOIN_SHG_AFTER_PROGRAM: 'Want to join SHG after program', OTHER: 'Other' };
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

const CandidateProfile = ({ candidateData, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('Personal');
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [currentPage, setCurrentPage] = useState('profile');

  const candidateName = candidateData?.fullName || candidateData?.name || 'Candidate';
  const admissions = candidateData?.admissions || [];

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
        {/* <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
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
        </div> */}
      </div>

      {/* Status Progress Stepper */}
      {/* <div style={{ background: '#fff', borderRadius: '10px', padding: '24px 32px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
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
      </div> */}

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
              <Row>
                <Field label="Full Name" value={candidateData?.fullName} />
                <Field label="Age" value={candidateData?.age} />
              </Row>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <Field label="Father / Husband Name" value={candidateData?.fatherOrHusbandName} />
              </div>
              <Row>
                <Field label="Mobile" value={candidateData?.mobileNumber} />
                <Field label="Alternate Mobile" value={candidateData?.alternateMobileNumber} />
              </Row>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <Field label="Address" value={candidateData?.fullAddress} />
              </div>
              <Row>
                <div>
                  <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>Aadhaar Number</label>
                  <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    {showAadhaar ? (candidateData?.aadharNumber || '—') : 'XXXX XXXX ' + (candidateData?.aadharNumber?.slice(-4) || '****')}
                    <button onClick={() => setShowAadhaar(!showAadhaar)} style={{ marginLeft: '8px', color: '#2563eb', fontSize: '13px', cursor: 'pointer', border: 'none', background: 'none', fontWeight: 600 }}>
                      {showAadhaar ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <Field label="Bank Account" value={YES_NO(candidateData?.isBankAccountAvailable)} />
              </Row>
              <Row>
                <Field label="Local Resident of Garhi" value={YES_NO(candidateData?.isLocalResidentOfGarhi)} />
                <Field label="Caste Category" value={candidateData?.casteCategory} />
              </Row>
            </div>
          ) : activeTab === 'Household' ? (
            <div>
              <Row>
                <Field label="Total Family Members" value={candidateData?.totalFamilyMembers} />
                <Field label="Working Family Members" value={candidateData?.workingFamilyMembers} />
              </Row>
              <Row>
                <Field label="Monthly Household Income" value={candidateData?.monthlyHouseholdIncome ? `₹${candidateData.monthlyHouseholdIncome}` : '—'} />
                <Field label="Primary Source of Income" value={candidateData?.primarySourceOfIncome} />
              </Row>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <Field label="Housing Type" value={HOUSING_MAP[candidateData?.housingType] || candidateData?.housingType} />
              </div>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Government Schemes Availed</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: 'Ration Card', val: candidateData?.govtSchemeRationCardAvailed },
                    { label: 'Widow Pension', val: candidateData?.govtSchemeWidowPensionAvailed },
                    { label: 'Old Age Pension', val: candidateData?.govtSchemeOldAgePensionAvailed },
                    { label: 'Jan Dhan Account', val: candidateData?.govtSchemeJanDhanAccountAvailed },
                    { label: 'Ujjwala', val: candidateData?.govtSchemeUjjawalaAvailed },
                    { label: 'Other', val: candidateData?.govtSchemeAnyOtherGovernmentSchemeAvailed },
                  ].filter(s => s.val === 'YES').map(s => (
                    <span key={s.label} style={{ background: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>{s.label}</span>
                  ))}
                  {!['govtSchemeRationCardAvailed','govtSchemeWidowPensionAvailed','govtSchemeOldAgePensionAvailed','govtSchemeJanDhanAccountAvailed','govtSchemeUjjawalaAvailed','govtSchemeAnyOtherGovernmentSchemeAvailed'].some(k => candidateData?.[k] === 'YES') && <span style={{ color: '#9ca3af', fontSize: '14px' }}>None</span>}
                </div>
              </div>
              <Field label="Migration Risk" value={MIGRATION_MAP[candidateData?.migrationRisk] || candidateData?.migrationRisk} />
            </div>
          ) : activeTab === 'Education' ? (
            <div>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <Field label="Education Level" value={EDUCATION_MAP[candidateData?.educationLevel] || candidateData?.educationLevel} />
              </div>
              <Row>
                <Field label="Stitching Experience" value={STITCHING_MAP[candidateData?.stitchingExperience] || candidateData?.stitchingExperience} />
                <Field label="Sewing Machine at Home" value={YES_NO(candidateData?.sewingMachineAtHome)} />
              </Row>
              <Row>
                <Field label="Beauty / Parlour Experience" value={YES_NO(candidateData?.beautyParlorExperience)} />
                <Field label="Food Business Experience" value={YES_NO(candidateData?.foodBusinessExperience)} />
              </Row>
              <Row>
                <Field label="Handicraft Experience" value={YES_NO(candidateData?.handicraftExperience)} />
              </Row>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <Field label="Previous Skill Training" value={candidateData?.previousSkillTraining} />
              </div>
            </div>
          ) : activeTab === 'Training' ? (
            <div>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <Field label="Preferred Experience Track" value={TRACK_MAP[candidateData?.preferredExperienceTrack] || candidateData?.preferredExperienceTrack} />
              </div>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <Field label="Distance to Training Centre" value={candidateData?.distanceTrainingCenter} />
              </div>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <Field label="Motivation for Joining" value={MOTIVATION_MAP[candidateData?.motivationForJoiningTraining] || candidateData?.motivationForJoiningTraining} />
              </div>
            </div>
          ) : activeTab === 'Need Assessment' ? (
            <div>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Economic Situation</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: 'Extreme Low Income', val: candidateData?.ecoSituExtremeLowIncome === 'EXTREME_LOW_INCOME' },
                    { label: 'Single Mother / Widow', val: candidateData?.ecoSituSingleMotherOrWidow === 'YES' },
                    { label: 'No Stable Income', val: candidateData?.ecoSituNoStableIncome === 'YES' },
                    { label: 'High Financial Stress', val: candidateData?.ecoSituHighFinancialStress === 'YES' },
                    { label: 'Family Dependent on Her', val: candidateData?.ecoSituFamilyDependentOnHer === 'YES' },
                    { label: 'Other', val: candidateData?.ecoSituOther === 'YES' },
                  ].filter(s => s.val).map(s => (
                    <span key={s.label} style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>{s.label}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Learning & Skill Needs</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: 'Foundation-level Training', val: candidateData?.learningFoundationLevelTraining === 'YES' },
                    { label: 'Machine Support Needed', val: candidateData?.learningMachineSupportNeeded === 'YES' },
                    { label: 'Confidence Building', val: candidateData?.learningConfidenceBuilding === 'YES' },
                    { label: 'Speed Improvement', val: candidateData?.learningSpeedImprovement === 'YES' },
                    { label: 'Finishing / Quality Control', val: candidateData?.learningFinishingOrQualityControl === 'YES' },
                    { label: 'Business Basics', val: candidateData?.learningBusinessBasics === 'YES' },
                    { label: 'Other', val: candidateData?.learningOther === 'YES' },
                  ].filter(s => s.val).map(s => (
                    <span key={s.label} style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: '12px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>{s.label}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <label style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Enterprise Aspirations</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: 'Start Home Kitchen', val: candidateData?.aspirationStartHomeKitchen === 'YES' },
                    { label: 'Work Mobile Parlour', val: candidateData?.aspirationWorkMobileParlor === 'YES' },
                    { label: 'Join Garment Job-Work', val: candidateData?.aspirationJoinGarmentJobWork === 'YES' },
                    { label: 'Start Boutique / Home Stitching', val: candidateData?.aspirationStartBoutiqueOrHomeStitching === 'YES' },
                    { label: 'Join Handicraft Work', val: candidateData?.aspirationJoinHandicraftWork === 'YES' },
                    { label: 'Start Micro-Enterprise', val: candidateData?.aspirationStartMicroEnterprise === 'YES' },
                    { label: 'Join SHG After 6 Months', val: candidateData?.aspirationJoinSHGAfter6Months === 'YES' },
                    { label: 'Other', val: candidateData?.aspirationOther === 'YES' },
                  ].filter(s => s.val).map(s => (
                    <span key={s.label} style={{ background: '#ccfbf1', color: '#0f766e', borderRadius: '12px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>{s.label}</span>
                  ))}
                </div>
              </div>
              <Field label="Willing to Participate in Production" value={YES_NO(candidateData?.willingToParticipateInProduction)} />
            </div>
          ) : (
            <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '14px' }}>
              {activeTab} section coming soon.
            </div>
          )}
        </div>
      </div>

      {/* Batch Assignment Card */}
      {admissions.length > 0 && (
        <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '20px 24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e40af', marginBottom: '16px', margin: '0 0 16px 0' }}>Batch Assignment</h3>
          {admissions.map((admission, idx) => {
            const batch = admission?.batch;
            const course = batch?.course;
            const trainer = batch?.trainer;
            return (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px', marginBottom: idx < admissions.length - 1 ? '20px' : '0', paddingBottom: idx < admissions.length - 1 ? '20px' : '0', borderBottom: idx < admissions.length - 1 ? '1px solid #bfdbfe' : 'none' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Batch
                  </label>
                  <button
                    onClick={() => onNavigate && onNavigate('BatchDetail', batch)}
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
                    {batch?.batchName || '—'}
                  </button>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Trainer
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                    {trainer?.name || batch?.trainerName || trainer?.firstName || trainer?.username || course?.instructor || '—'}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Period
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                    {batch?.startDate || '—'} – {batch?.endDate || '—'}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Status
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#16a34a' }}>{admission?.status || '—'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Attendance
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#16a34a' }}>
                    {admission?.attendancePercentage !== undefined && admission?.attendancePercentage !== null 
                      ? `${admission.attendancePercentage}%` 
                      : '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Status History */}
      {/* <div style={{ background: '#fff', borderRadius: '10px', padding: '24px', marginBottom: '20px' }}>
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
      </div> */}
    </div>
  );
};

export default CandidateProfile;
