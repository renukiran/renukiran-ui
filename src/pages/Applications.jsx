import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import StepIndicator from '../components/StepIndicator';
import Step1PersonalInfo from '../components/Step1PersonalInfo';
import Step2Household from '../components/Step2Household';
import Step3EducationWork from '../components/Step3EducationWork';
import Step4TrainingInterest from '../components/Step4TrainingInterest';
import Step5NeedAssessment from '../components/Step5NeedAssessment';
import { applicationAPI } from '../services/api';
import { toApplicationPayload } from '../utils/applicationForm';

const APPLICATION_DRAFT_KEY = 'renukiran.applicationDraft';

const Applications = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
      batch: '',
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

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(APPLICATION_DRAFT_KEY);
      if (!savedDraft) {
        return;
      }

      reset(JSON.parse(savedDraft));
      setSuccess('Loaded saved draft.');
    } catch (draftError) {
      console.error('Failed to restore saved draft', draftError);
    }
  }, [reset]);

  const stepValidationRules = {
    1: ['batch', 'fullName', 'age', 'fatherName', 'mobile', 'address', 'localResident', 'bankAccount', 'caste'],
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
      setSuccess(null);
      localStorage.setItem(APPLICATION_DRAFT_KEY, JSON.stringify(getValues()));
      setSuccess('Draft saved locally.');
    } catch (err) {
      setError('Failed to save draft');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const response = await applicationAPI.submitApplication(toApplicationPayload(data));
      const savedApplication = response?.data ?? response;
      localStorage.removeItem(APPLICATION_DRAFT_KEY);
      reset();
      setCurrentStep(1);
      if (savedApplication?.id) {
        onNavigate('CandidateProfile', {
          id: savedApplication.id,
          name: savedApplication.fullName,
        });
        return;
      }

      setSuccess('Application submitted successfully.');
      onNavigate('CandidateList');
    } catch (err) {
      setError(err?.message || 'Failed to submit application');
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

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
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
