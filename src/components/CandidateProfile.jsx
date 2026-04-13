import React, { useEffect, useMemo, useState } from 'react';
import { candidateAPI } from '../services/api';
import {
  formatCandidateStatus,
  formatDisplayDate,
  formatEducation,
  formatEnumLabel,
  formatStitching,
  formatTrackLabel,
  formatYesNoMaybe,
  getCandidateStageIndex,
  getPrimaryAdmission,
  resolveCandidateCourse,
} from '../utils/applicationForm';

const TABS = ['Personal', 'Household', 'Education', 'Training', 'Need Assessment'];
const STEPS = ['New', 'Assigned', 'Training', 'Placement Pending', 'Placed'];

const InfoGrid = ({ rows }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px' }}>
    {rows.map((row) => (
      <div key={row.label}>
        <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{row.label}</div>
        <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{row.value || 'N/A'}</div>
      </div>
    ))}
  </div>
);

const CandidateProfile = ({ candidateData, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('Personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null);

  const applicationId = candidateData?.id ?? candidateData?.candidateId;

  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await candidateAPI.getCandidateById(applicationId);
        setApplication(response ?? null);
      } catch (loadError) {
        setError(loadError?.message || 'Failed to load candidate profile.');
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  const activeAdmission = getPrimaryAdmission(application);
  const currentStepIndex = getCandidateStageIndex(application);

  const personalRows = useMemo(() => ([
    { label: 'Full Name', value: application?.fullName },
    { label: 'Age', value: application?.age },
    { label: 'Father / Husband Name', value: application?.fatherOrHusbandName },
    { label: 'Mobile', value: application?.mobileNumber },
    { label: 'Alternate Mobile', value: application?.alternateMobileNumber },
    { label: 'Address', value: application?.fullAddress },
    { label: 'Local Resident', value: formatYesNoMaybe(application?.isLocalResidentOfGarhi) },
    { label: 'Aadhaar', value: application?.aadharNumber },
    { label: 'Bank Account', value: formatYesNoMaybe(application?.isBankAccountAvailable) },
    { label: 'Caste Category', value: formatEnumLabel(application?.casteCategory) },
    { label: 'Created Date', value: formatDisplayDate(application?.createdDate) },
    { label: 'Candidate ID', value: application?.id },
  ]), [application]);

  const householdRows = useMemo(() => ([
    { label: 'Family Members', value: application?.totalFamilyMembers },
    { label: 'Working Members', value: application?.workingFamilyMembers },
    { label: 'Monthly Income', value: application?.monthlyHouseholdIncome ? `Rs ${application.monthlyHouseholdIncome}` : 'N/A' },
    { label: 'Primary Income Source', value: application?.primarySourceOfIncome },
    { label: 'Housing Type', value: formatEnumLabel(application?.housingType) },
    { label: 'Migration Risk', value: formatEnumLabel(application?.migrationRisk) },
    { label: 'Ration Card', value: formatYesNoMaybe(application?.govtSchemeRationCardAvailed) },
    { label: 'Widow Pension', value: formatYesNoMaybe(application?.govtSchemeWidowPensionAvailed) },
    { label: 'Jan Dhan Account', value: formatYesNoMaybe(application?.govtSchemeJanDhanAccountAvailed) },
    { label: 'Ujjwala', value: formatYesNoMaybe(application?.govtSchemeUjjawalaAvailed) },
  ]), [application]);

  const educationRows = useMemo(() => ([
    { label: 'Education Level', value: formatEducation(application?.educationLevel) },
    { label: 'Stitching Experience', value: formatStitching(application?.stitchingExperience) },
    { label: 'Sewing Machine At Home', value: formatYesNoMaybe(application?.sewingMachineAtHome) },
    { label: 'Beauty Experience', value: formatYesNoMaybe(application?.beautyParlorExperience) },
    { label: 'Food Business Experience', value: formatYesNoMaybe(application?.foodBusinessExperience) },
    { label: 'Handicraft Experience', value: formatYesNoMaybe(application?.HandicraftExperience) },
    { label: 'Previous Skill Training', value: application?.previousSkillTraining },
  ]), [application]);

  const trainingRows = useMemo(() => ([
    { label: 'Current Status', value: formatCandidateStatus(application) },
    { label: 'Preferred Track', value: formatTrackLabel(application?.preferredExperienceTrack) },
    { label: 'Assigned Course', value: resolveCandidateCourse(application) },
    { label: 'Admission Number', value: activeAdmission?.admissionNumber },
    { label: 'Assigned Batch', value: activeAdmission?.batch?.batchName },
    { label: 'Batch Timing', value: activeAdmission?.batch?.timing },
    {
      label: 'Batch Period',
      value: activeAdmission?.batch?.startDate && activeAdmission?.batch?.endDate
        ? `${formatDisplayDate(activeAdmission.batch.startDate)} to ${formatDisplayDate(activeAdmission.batch.endDate)}`
        : 'N/A',
    },
    { label: 'Trainer', value: activeAdmission?.batch?.trainer?.name },
  ]), [activeAdmission, application]);

  const needRows = useMemo(() => ([
    { label: 'Economic Situation', value: formatEnumLabel(application?.ecoSituExtremeLowIncome) },
    { label: 'Single Mother / Widow', value: formatYesNoMaybe(application?.ecoSituSingleMotherOrWidow) },
    { label: 'No Stable Income', value: formatYesNoMaybe(application?.ecoSituNoStableIncome) },
    { label: 'High Financial Stress', value: formatYesNoMaybe(application?.ecoSituHighFinancialStress) },
    { label: 'Family Dependent On Her', value: formatYesNoMaybe(application?.ecoSituFamilyDependentOnHer) },
    { label: 'Foundation Training Needed', value: formatYesNoMaybe(application?.learningFoundationLevelTraining) },
    { label: 'Machine Support Needed', value: formatYesNoMaybe(application?.learningMachineSupportNeeded) },
    { label: 'Confidence Building', value: application?.learningConfidenceBuilding },
    { label: 'Business Basics', value: formatYesNoMaybe(application?.learningBusinessBasics) },
    { label: 'Production Participation', value: formatYesNoMaybe(application?.willingToParticipateInProduction) },
  ]), [application]);

  const rowsByTab = {
    Personal: personalRows,
    Household: householdRows,
    Education: educationRows,
    Training: trainingRows,
    'Need Assessment': needRows,
  };

  return (
    <div style={{ background: '#f3f4f6', padding: '28px 36px', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => onNavigate('CandidateList')} style={{ fontSize: '18px', color: '#374151', border: 'none', background: 'none', cursor: 'pointer' }}>
            {'<'}
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>{application?.fullName || candidateData?.name || 'Candidate Profile'}</h1>
        </div>
        <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: 700 }}>
          {formatCandidateStatus(application)}
        </span>
      </div>

      {error && <div style={{ color: '#b91c1c', marginBottom: '16px' }}>{error}</div>}
      {loading && <div style={{ color: '#6b7280', marginBottom: '16px' }}>Loading candidate profile...</div>}

      <div style={{ background: '#fff', borderRadius: '10px', padding: '24px 32px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {STEPS.map((step, index) => (
          <React.Fragment key={step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: index < currentStepIndex ? '#16a34a' : index === currentStepIndex ? '#1e3a5f' : '#fff',
                  border: `2px solid ${index < currentStepIndex || index === currentStepIndex ? (index < currentStepIndex ? '#16a34a' : '#1e3a5f') : '#d1d5db'}`,
                  color: index < currentStepIndex || index === currentStepIndex ? '#fff' : '#9ca3af',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                {index < currentStepIndex ? 'v' : index === currentStepIndex ? '*' : ''}
              </div>
              <span style={{ fontSize: '12px', color: index <= currentStepIndex ? '#111827' : '#9ca3af', fontWeight: index === currentStepIndex ? 700 : 600, textAlign: 'center' }}>{step}</span>
            </div>
            {index < STEPS.length - 1 && <div style={{ height: '2px', flex: 1, background: index < currentStepIndex ? '#16a34a' : '#d1d5db', marginBottom: '24px' }} />}
          </React.Fragment>
        ))}
      </div>

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
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ padding: '24px' }}>
          <InfoGrid rows={rowsByTab[activeTab]} />
        </div>
      </div>

      <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '20px 24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e40af', margin: '0 0 16px 0' }}>Batch Assignment</h3>
        {activeAdmission ? (
          <InfoGrid rows={trainingRows.slice(3)} />
        ) : (
          <div style={{ color: '#6b7280', fontSize: '14px' }}>This candidate is not assigned to a batch yet.</div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
