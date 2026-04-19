import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import StepIndicator from '../components/StepIndicator';
import Step1PersonalInfo from '../components/Step1PersonalInfo';
import Step2Household from '../components/Step2Household';
import Step3EducationWork from '../components/Step3EducationWork';
import Step4TrainingInterest from '../components/Step4TrainingInterest';
import Step5NeedAssessment from '../components/Step5NeedAssessment';
import { applicationAPI } from '../services/api';

const Applications = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    reset,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      age: '',
      fatherName: '',
      mobile: '',
      alternateNumber: '',
      address: '',
      localResident: '',
      aadhaar: '',
      bankAccount: '',
      caste: '',
      totalFamilyMembers: '',
      workingMembers: '',
      monthlyHouseholdIncome: '',
      primarySourceOfIncome: '',
      housingType: '',
      governmentSchemes: [],
      migrationRisk: '',
      educationLevel: '',
      stitchingExperience: '',
      sewingMachineAtHome: '',
      beautyParlourExperience: '',
      foodBusinessExperience: '',
      handicraftExperience: '',
      previousSkillTraining: '',
      preferredEnterpriseTrack: [],
      distanceToTrainingCentre: '',
      motivationForJoining: [],
      economicSituation: [],
      learningSkillNeeds: [],
      enterpriseAspirations: [],
      willingToParticipate: '',
    },
  });

  // const formValues = watch(); // TODO: use when needed

  const stepValidationRules = {
    1: [ 'fullName', 'age', 'fatherName', 'mobile', 'address', 'localResident', 'bankAccount', 'caste'],
    2: ['totalFamilyMembers', 'workingMembers', 'monthlyHouseholdIncome', 'primarySourceOfIncome', 'housingType', 'migrationRisk'],
    3: ['educationLevel', 'stitchingExperience', 'sewingMachineAtHome', 'beautyParlourExperience', 'foodBusinessExperience', 'handicraftExperience'],
    4: ['preferredEnterpriseTrack', 'distanceToTrainingCentre', 'motivationForJoining'],
    5: ['economicSituation', 'learningSkillNeeds', 'enterpriseAspirations', 'willingToParticipate'],
  };

  const handleNext = async () => {
    const fieldsToValidate = stepValidationRules[currentStep];
    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Uncomment when save draft API is ready
      // await applicationAPI.saveDraft(getValues());
      console.log('Saving draft with data:', getValues());
      alert('Draft saved successfully!');
    } catch (err) {
      setError('Failed to save draft');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const mapFormDataToPayload = (data) => {
    const yesNo = (val) => val === 'Yes' ? 'YES' : 'NO';

    const govtSchemes = data.governmentSchemes || [];

    const educationMap = {
      'No formal education': 'NO_FORMAL_EDUCATION',
      'Primary': 'PRIMARY',
      'Secondary': 'SECONDARY',
      'Higher Secondary': 'HIGHER_SECONDARY',
      'Graduate': 'GRADUATE',
      'Other': 'OTHERS',
    };

    const stitchingMap = {
      'None': 'NONE',
      'Basic': 'BASIC',
      'Good': 'GOOD',
      'Advanced': 'ADVANCED',
    };

    const migrationMap = {
      'Will stay long-term': 'STAY_LONG_TERM',
      'Maybe will move': 'MAY_BE_WILL_MOVE',
      'Likely to move': 'LIKELY_TO_MOVE',
      'Does not know': 'DOES_NOT_KNOW',
    };

    const casteMap = {
      'General': 'GENERAL',
      'OBC': 'OBC',
      'SC': 'SC',
      'ST': 'ST',
    };

    const housingMap = {
      'Rented': 'RENTED',
      'Own (Pucca)': 'OWN_PUCCA',
      'Own (Kutcha)': 'OWN_KUCHA',
    };

    const motivationMap = {
      'Want income immediately': 'WANT_INCOME_IMMEDIATELY',
      'Want to support family': 'WANT_SUPPORT_FAMILY',
      'Want to learn market-demand skills': 'WANT_TO_LEARN_MARKET_DEMAND_SKILLS',
      'Want home-based work': 'WANT_HOME_BASED_WORK',
      'Want to start micro-enterprise': 'WANT_TO_START_MICRO_ENTERPRISE',
      'Want to join SHG after program': 'WANT_TO_JOIN_SHG_AFTER_PROGRAM',
      'Other': 'OTHER',
    };

    const trackMap = {
      'Stitching / Garment Production': 'TAILORING',
      'Bag Making': 'TAILORING',
      'Beauty / Parlour Services': 'BEAUTY_AND_GROOMING',
      'Home-based Food Enterprise': 'FOOD_BUSINESS',
      'Handicraft & Decoration Work': 'HANDICRAFT',
      'Other': 'OTHER',
    };

    const tracks = Array.isArray(data.preferredEnterpriseTrack) ? data.preferredEnterpriseTrack : [data.preferredEnterpriseTrack];
    const preferredTrack = trackMap[tracks[0]] || 'TAILORING';

    const motivations = Array.isArray(data.motivationForJoining) ? data.motivationForJoining : [data.motivationForJoining];
    const primaryMotivation = motivationMap[motivations[0]] || 'WANT_INCOME_IMMEDIATELY';

    const economicSituation = Array.isArray(data.economicSituation) ? data.economicSituation : [];
    const learningSkillNeeds = Array.isArray(data.learningSkillNeeds) ? data.learningSkillNeeds : [];
    const enterpriseAspirations = Array.isArray(data.enterpriseAspirations) ? data.enterpriseAspirations : [];

    return {
      appliedCourse: null,
      fullName: data.fullName,
      age: parseInt(data.age) || 0,
      fatherOrHusbandName: data.fatherName,
      mobileNumber: data.mobile,
      alternateMobileNumber: data.alternateNumber || '',
      fullAddress: data.address,
      isLocalResidentOfGarhi: yesNo(data.localResident),
      aadharNumber: data.aadhaar || '',
      isBankAccountAvailable: yesNo(data.bankAccount),
      casteCategory: casteMap[data.caste] || 'GENERAL',
      totalFamilyMembers: parseInt(data.totalFamilyMembers) || 0,
      workingFamilyMembers: parseInt(data.workingMembers) || 0,
      monthlyHouseholdIncome: parseInt(data.monthlyHouseholdIncome) || 0,
      primarySourceOfIncome: data.primarySourceOfIncome,
      housingType: housingMap[data.housingType] || 'RENTED',
      govtSchemeRationCardAvailed: govtSchemes.includes('Ration Card') ? 'YES' : 'NO',
      govtSchemeWidowPensionAvailed: govtSchemes.includes('Widow Pension') ? 'YES' : 'NO',
      govtSchemeOldAgePensionAvailed: govtSchemes.includes('Old Age Pension') ? 'YES' : 'NO',
      govtSchemeJanDhanAccountAvailed: govtSchemes.includes('Jan Dhan Account') ? 'YES' : 'NO',
      govtSchemeUjjawalaAvailed: govtSchemes.includes('Ujjwala') ? 'YES' : 'NO',
      govtSchemeAnyOtherGovernmentSchemeAvailed: govtSchemes.includes('Other') ? 'YES' : 'NO',
      govtSchemeOtherDetails: govtSchemes.includes('Other') ? 'YES' : 'NO',
      migrationRisk: migrationMap[data.migrationRisk] || 'STAY_LONG_TERM',
      educationLevel: educationMap[data.educationLevel] || 'NO_FORMAL_EDUCATION',
      stitchingExperience: stitchingMap[data.stitchingExperience] || 'NONE',
      sewingMachineAtHome: yesNo(data.sewingMachineAtHome),
      beautyParlorExperience: yesNo(data.beautyParlourExperience),
      foodBusinessExperience: yesNo(data.foodBusinessExperience),
      handicraftExperience: yesNo(data.handicraftExperience),
      previousSkillTraining: data.previousSkillTraining || '',
      preferredExperienceTrack: preferredTrack,
      distanceTrainingCenter: data.distanceToTrainingCentre || '',
      motivationForJoiningTraining: primaryMotivation,
      motivationForJoiningTrainingDetailsOthersReason: '',
      ecoSituExtremeLowIncome: economicSituation.includes('Extremely low income') ? 'EXTREME_LOW_INCOME' : null,
      ecoSituSingleMotherOrWidow: economicSituation.includes('Single mother / widow') ? 'YES' : 'NO',
      ecoSituNoStableIncome: economicSituation.includes('No stable income') ? 'YES' : 'NO',
      ecoSituHighFinancialStress: economicSituation.includes('High financial stress') ? 'YES' : 'NO',
      ecoSituFamilyDependentOnHer: economicSituation.includes('Family dependent on her') ? 'YES' : 'NO',
      ecoSituOther: economicSituation.includes('Other') ? 'YES' : 'NO',
      ecoSituOtherDetails: '',
      learningFoundationLevelTraining: learningSkillNeeds.includes('Foundation-level training') ? 'YES' : 'NO',
      learningMachineSupportNeeded: learningSkillNeeds.includes('Machine support needed') ? 'YES' : 'NO',
      learningConfidenceBuilding: learningSkillNeeds.includes('Confidence building') ? 'YES' : 'NO',
      learningSpeedImprovement: learningSkillNeeds.includes('Speed improvement') ? 'YES' : 'NO',
      learningFinishingOrQualityControl: learningSkillNeeds.includes('Finishing / Quality control') ? 'YES' : 'NO',
      learningBusinessBasics: learningSkillNeeds.includes('Business basics') ? 'YES' : 'NO',
      learningOther: learningSkillNeeds.includes('Other') ? 'YES' : 'NO',
      learningOtherDetails: '',
      aspirationStartHomeKitchen: enterpriseAspirations.includes('Start home kitchen') ? 'YES' : 'NO',
      aspirationWorkMobileParlor: enterpriseAspirations.includes('Work in mobile parlour') ? 'YES' : 'NO',
      aspirationJoinGarmentJobWork: enterpriseAspirations.includes('Join garment job-work') ? 'YES' : 'NO',
      aspirationStartBoutiqueOrHomeStitching: enterpriseAspirations.includes('Start boutique / home stitching') ? 'YES' : 'NO',
      aspirationJoinHandicraftWork: enterpriseAspirations.includes('Join handicraft work') ? 'YES' : 'NO',
      aspirationStartMicroEnterprise: enterpriseAspirations.includes('Start micro-enterprise') ? 'YES' : 'NO',
      aspirationJoinSHGAfter6Months: enterpriseAspirations.includes('Join SHG after 6 months') ? 'YES' : 'NO',
      aspirationOther: enterpriseAspirations.includes('Other') ? 'YES' : 'NO',
      aspirationOtherDetails: '',
      willingToParticipateInProduction: data.willingToParticipate === 'Yes' ? 'YES' : data.willingToParticipate === 'Maybe' ? 'MAYBE' : 'NO',
      applicationStatus: 'DRAFT',
      createdDate: new Date().toISOString().split('T')[0],
      admissions: [],
    };
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const payload = mapFormDataToPayload(data);
      await applicationAPI.submitApplication(payload);
      reset();
      setCurrentStep(1);
      onNavigate('CandidateList');
    } catch (err) {
      setError('Failed to submit application');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClick = async () => {
    const fieldsToValidate = stepValidationRules[5];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <ArrowLeft
          size={20}
          className="mr-2 text-gray-600 cursor-pointer hover:text-gray-800"
          onClick={() => onNavigate('CandidateList')}
        />
        <h1 className="text-xl font-semibold text-gray-800">New Application</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <Step1PersonalInfo
          register={register}
          errors={errors}
          onNext={handleNext}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          loading={loading}
        />
      )}
      {currentStep === 2 && (
        <Step2Household
          register={register}
          errors={errors}
          onNext={handleNext}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          loading={loading}
        />
      )}
      {currentStep === 3 && (
        <Step3EducationWork
          register={register}
          errors={errors}
          onNext={handleNext}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          loading={loading}
        />
      )}
      {currentStep === 4 && (
        <Step4TrainingInterest
          register={register}
          errors={errors}
          onNext={handleNext}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          loading={loading}
        />
      )}
      {currentStep === 5 && (
        <Step5NeedAssessment
          register={register}
          errors={errors}
          onBack={handleBack}
          onSubmit={handleSubmitClick}
          onSaveDraft={handleSaveDraft}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Applications;
