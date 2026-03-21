import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';

const Err = ({ msg }) => msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

const Step5NeedAssessment = ({ register, errors, onBack, onSubmit, onSaveDraft, loading }) => {
  const economicSituationOptions = [
    'Extremely low income', 'Single mother / widow', 'No stable income',
    'High financial stress', 'Family dependent on her', 'Other',
  ];

  const learningSkillNeedsOptions = [
    'Foundation-level training', 'Machine support needed', 'Confidence building',
    'Speed improvement', 'Finishing / Quality control', 'Business basics', 'Other',
  ];

  const enterpriseAspirationsOptions = [
    'Start home kitchen', 'Work in mobile parlour', 'Join garment job-work',
    'Start boutique / home stitching', 'Join handicraft work', 'Start micro-enterprise',
    'Join SHG after 6 months', 'Other',
  ];

  const CheckboxGroup = ({ field, options, required = false }) => (
    <>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              value={option}
              {...register(field, required ? {
                validate: (value) => (value && value.length > 0) || 'Please select at least one option',
              } : {})}
              className="w-4 h-4"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
      <Err msg={errors[field]?.message} />
    </>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Need-Based Assessment</h2>
        <p className="text-gray-600 text-sm mt-1">
          Assessment of the applicant's needs, skills gaps, and aspirations.
        </p>
      </div>

      {/* Economic Situation */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Economic Situation <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
        <CheckboxGroup field="economicSituation" options={economicSituationOptions} required />
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Learning & Skill Needs */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Learning & Skill Needs <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
        <CheckboxGroup field="learningSkillNeeds" options={learningSkillNeedsOptions} required />
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Enterprise Aspirations */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Enterprise Aspirations <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
        <CheckboxGroup field="enterpriseAspirations" options={enterpriseAspirationsOptions} required />
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Willing to Participate in Production */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Willing to Participate in Production <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          {['Yes', 'No', 'Maybe'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={option}
                {...register('willingToParticipate', { required: 'Please select an option' })}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        <Err msg={errors.willingToParticipate?.message} />
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center px-5 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={onSaveDraft}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex items-center px-5 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            <Check size={16} className="mr-2" />
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5NeedAssessment;
