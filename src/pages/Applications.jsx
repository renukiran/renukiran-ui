import React, { useState } from 'react';
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
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      setError(null);
      // Placeholder for save draft API call
      console.log('Saving draft with data:', formData);
      // const response = await applicationAPI.updateApplication(id, formData);
      alert('Draft saved successfully!');
    } catch (err) {
      setError('Failed to save draft');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      // Placeholder for submit application API call
      console.log('Submitting application with data:', formData);
      // const response = await applicationAPI.submitApplication(formData);
      alert('Application submitted successfully!');
      setCurrentStep(1);
      setFormData({});
      onNavigate('Dashboard');
    } catch (err) {
      setError('Failed to submit application');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <ArrowLeft
          size={20}
          className="mr-2 text-gray-600 cursor-pointer hover:text-gray-800"
          onClick={() => onNavigate('Dashboard')}
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
          formData={formData}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          loading={loading}
        />
      )}
      {currentStep === 2 && (
        <Step2Household
          formData={formData}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          loading={loading}
        />
      )}
      {currentStep === 3 && (
        <Step3EducationWork
          formData={formData}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          loading={loading}
        />
      )}
      {currentStep === 4 && (
        <Step4TrainingInterest
          formData={formData}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          loading={loading}
        />
      )}
      {currentStep === 5 && (
        <Step5NeedAssessment
          formData={formData}
          onChange={handleChange}
          onBack={handleBack}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Applications;
