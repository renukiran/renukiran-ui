const YES_NO_MAYBE = {
  Yes: 'YES',
  No: 'NO',
  Maybe: 'MAYBE',
};

const CASTE = {
  General: 'GENERAL',
  OBC: 'OBC',
  SC: 'SC',
  ST: 'ST',
};

const HOUSING = {
  Rented: 'RENTED',
  'Own (Pucca)': 'OWN_PUCCA',
  'Own (Kutcha)': 'OWN_KUCHA',
};

const MIGRATION = {
  'Will stay long-term': 'STAY_LONG_TERM',
  'Maybe will move': 'MAY_BE_WILL_MOVE',
  'Likely to move': 'LIKELY_TO_MOVE',
  'Does not know': 'DOES_NOT_KNOW',
};

const EDUCATION = {
  'No formal education': 'NO_FORMAL_EDUCATION',
  Primary: 'PRIMARY',
  Secondary: 'SECONDARY',
  'Higher Secondary': 'HIGHER_SECONDARY',
  Graduate: 'GRADUATE',
  Other: 'OTHERS',
};

const STITCHING = {
  None: 'NONE',
  Basic: 'BASIC',
  Good: 'GOOD',
  Advanced: 'ADVANCED',
};

const TRACK = {
  'Stitching / Garment Production': 'TAILORING',
  'Beauty / Parlour Services': 'BEAUTY_AND_GROOMING',
  'Home-based Food Enterprise': 'FOOD_BUSINESS',
  'Handicraft & Decoration Work': 'HANDICRAFT',
  'Bag Making': 'HANDICRAFT',
  Other: 'OTHER',
};

const MOTIVATION = {
  'Want income immediately': 'WANT_INCOME_IMMEDIATELY',
  'Want to support family': 'WANT_SUPPORT_FAMILY',
  'Want to learn market-demand skills': 'WANT_TO_LEARN_MARKET_DEMAND_SKILLS',
  'Want home-based work': 'WANT_HOME_BASED_WORK',
  'Want to start micro-enterprise': 'WANT_TO_START_MICRO_ENTERPRISE',
  'Want to join SHG after program': 'WANT_TO_JOIN_SHG_AFTER_PROGRAM',
  Other: 'OTHER',
};

const STATUS_LABELS = {
  YES: 'Yes',
  NO: 'No',
  MAYBE: 'Maybe',
};

const TRACK_LABELS = {
  TAILORING: 'Tailoring',
  BEAUTY_AND_GROOMING: 'Beauty & Grooming',
  FOOD_BUSINESS: 'Food Business',
  HANDICRAFT: 'Handicraft',
  HOME_BASED_PRODUCTION: 'Home-Based Production',
  OTHER: 'Other',
};

const EDUCATION_LABELS = {
  NO_FORMAL_EDUCATION: 'No formal education',
  PRIMARY: 'Primary',
  SECONDARY: 'Secondary',
  HIGHER_SECONDARY: 'Higher Secondary',
  GRADUATE: 'Graduate',
  OTHERS: 'Other',
};

const STITCHING_LABELS = {
  NONE: 'None',
  BASIC: 'Basic',
  GOOD: 'Good',
  ADVANCED: 'Advanced',
};

const ADMISSION_STAGE_ORDER = {
  NEW: 0,
  ASSIGNED_TO_BATCH: 1,
  TRAINING_STARTED: 2,
  TRAINING_COMPLETED: 3,
  PLACED: 4,
};

const ADMISSION_STATUS_LABELS = {
  NEW: 'New',
  ASSIGNED_TO_BATCH: 'Assigned',
  TRAINING_STARTED: 'Training',
  TRAINING_COMPLETED: 'Placement Pending',
  PLACED: 'Placed',
};

const safeArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const isSelected = (value, option) => (safeArray(value).includes(option) ? 'YES' : 'NO');

export const toApplicationPayload = (values) => ({
  fullName: values.fullName?.trim() || '',
  age: Number(values.age) || 0,
  fatherOrHusbandName: values.fatherName?.trim() || '',
  mobileNumber: values.mobile?.trim() || '',
  alternateMobileNumber: values.alternateNumber?.trim() || '',
  fullAddress: values.address?.trim() || '',
  isLocalResidentOfGarhi: YES_NO_MAYBE[values.localResident] || null,
  aadharNumber: values.aadhaar?.trim() || '',
  isBankAccountAvailable: YES_NO_MAYBE[values.bankAccount] || null,
  casteCategory: CASTE[values.caste] || null,
  totalFamilyMembers: Number(values.totalFamilyMembers) || 0,
  workingFamilyMembers: Number(values.workingMembers) || 0,
  monthlyHouseholdIncome: Number(values.monthlyHouseholdIncome) || 0,
  primarySourceOfIncome: values.primarySourceOfIncome?.trim() || '',
  housingType: HOUSING[values.housingType] || null,
  govtSchemeRationCardAvailed: isSelected(values.governmentSchemes, 'Ration Card'),
  govtSchemeWidowPensionAvailed: isSelected(values.governmentSchemes, 'Widow Pension'),
  govtSchemeOldAgePensionAvailed: isSelected(values.governmentSchemes, 'Old Age Pension'),
  govtSchemeJanDhanAccountAvailed: isSelected(values.governmentSchemes, 'Jan Dhan Account'),
  govtSchemeUjjawalaAvailed: isSelected(values.governmentSchemes, 'Ujjwala'),
  govtSchemeAnyOtherGovernmentSchemeAvailed: isSelected(values.governmentSchemes, 'Other'),
  govtSchemeOtherDetails: isSelected(values.governmentSchemes, 'Other'),
  migrationRisk: MIGRATION[values.migrationRisk] || null,
  educationLevel: EDUCATION[values.educationLevel] || null,
  stitchingExperience: STITCHING[values.stitchingExperience] || null,
  sewingMachineAtHome: YES_NO_MAYBE[values.sewingMachineAtHome] || null,
  beautyParlorExperience: YES_NO_MAYBE[values.beautyParlourExperience] || null,
  foodBusinessExperience: YES_NO_MAYBE[values.foodBusinessExperience] || null,
  HandicraftExperience: YES_NO_MAYBE[values.handicraftExperience] || null,
  previousSkillTraining: values.previousSkillTraining?.trim() || '',
  preferredExperienceTrack: TRACK[safeArray(values.preferredEnterpriseTrack)[0]] || 'OTHER',
  distanceTrainingCenter: values.distanceToTrainingCentre?.trim() || '',
  motivationForJoiningTraining: MOTIVATION[safeArray(values.motivationForJoining)[0]] || 'OTHER',
  motivationForJoiningTrainingDetailsOthersReason: safeArray(values.motivationForJoining).includes('Other') ? 'Other' : '',
  ecoSituExtremeLowIncome: safeArray(values.economicSituation).includes('Extremely low income') ? 'EXTREME_LOW_INCOME' : null,
  ecoSituSingleMotherOrWidow: isSelected(values.economicSituation, 'Single mother / widow'),
  ecoSituNoStableIncome: isSelected(values.economicSituation, 'No stable income'),
  ecoSituHighFinancialStress: isSelected(values.economicSituation, 'High financial stress'),
  ecoSituFamilyDependentOnHer: isSelected(values.economicSituation, 'Family dependent on her'),
  ecoSituOther: isSelected(values.economicSituation, 'Other'),
  ecoSituOtherDetails: safeArray(values.economicSituation).includes('Other') ? 'Other' : '',
  learningFoundationLevelTraining: isSelected(values.learningSkillNeeds, 'Foundation-level training'),
  learningMachineSupportNeeded: isSelected(values.learningSkillNeeds, 'Machine support needed'),
  learningConfidenceBuilding: safeArray(values.learningSkillNeeds).includes('Confidence building') ? 'Confidence building' : '',
  learningSpeedImprovement: isSelected(values.learningSkillNeeds, 'Speed improvement'),
  learningFinishingOrQualityControl: isSelected(values.learningSkillNeeds, 'Finishing / Quality control'),
  learningBusinessBasics: isSelected(values.learningSkillNeeds, 'Business basics'),
  learningOther: isSelected(values.learningSkillNeeds, 'Other'),
  learningOtherDetails: safeArray(values.learningSkillNeeds).includes('Other') ? 'Other' : '',
  aspirationStartHomeKitchen: isSelected(values.enterpriseAspirations, 'Start home kitchen'),
  aspirationWorkMobileParlor: isSelected(values.enterpriseAspirations, 'Work in mobile parlour'),
  aspirationJoinGarmentJobWork: isSelected(values.enterpriseAspirations, 'Join garment job-work'),
  aspirationStartBoutiqueOrHomeStitching: isSelected(values.enterpriseAspirations, 'Start boutique / home stitching'),
  aspirationJoinHandicraftWork: isSelected(values.enterpriseAspirations, 'Join handicraft work'),
  aspirationStartMicroEnterprise: isSelected(values.enterpriseAspirations, 'Start micro-enterprise'),
  aspirationJoinSHGAfter6Months: isSelected(values.enterpriseAspirations, 'Join SHG after 6 months'),
  aspirationOther: isSelected(values.enterpriseAspirations, 'Other'),
  aspirationOtherDetails: safeArray(values.enterpriseAspirations).includes('Other') ? 'Other' : '',
  willingToParticipateInProduction: YES_NO_MAYBE[values.willingToParticipate] || null,
});

export const formatTrackLabel = (value) => TRACK_LABELS[value] || value || 'N/A';

export const formatEducation = (value) => EDUCATION_LABELS[value] || value || 'N/A';

export const formatStitching = (value) => STITCHING_LABELS[value] || value || 'N/A';

export const formatYesNoMaybe = (value) => STATUS_LABELS[value] || value || 'N/A';

export const formatEnumLabel = (value) => (value
  ? value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/(^|\s)\S/g, (char) => char.toUpperCase())
  : 'N/A');

export const getPrimaryAdmission = (application) => safeArray(application?.admissions)
  .filter(Boolean)
  .sort((left, right) => (ADMISSION_STAGE_ORDER[left?.status] ?? -1) - (ADMISSION_STAGE_ORDER[right?.status] ?? -1))
  .at(-1) || null;

export const getCandidateStageKey = (application) => getPrimaryAdmission(application)?.status || 'NEW';

export const getCandidateStageIndex = (application) => ADMISSION_STAGE_ORDER[getCandidateStageKey(application)] ?? 0;

export const formatCandidateStatus = (applicationOrStatus) => {
  const statusKey = typeof applicationOrStatus === 'string'
    ? applicationOrStatus
    : getCandidateStageKey(applicationOrStatus);
  return ADMISSION_STATUS_LABELS[statusKey] || formatEnumLabel(statusKey);
};

export const resolveCandidateCourse = (application) => {
  const batchCourseName = getPrimaryAdmission(application)?.batch?.course?.courseName;
  return batchCourseName || formatTrackLabel(application?.preferredExperienceTrack);
};

export const formatDisplayDate = (value) => {
  if (!value) return 'N/A';

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};