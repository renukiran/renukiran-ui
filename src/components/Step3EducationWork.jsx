import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Err = ({ msg }) => msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

const Step3EducationWork = ({ register, errors, onNext, onBack, onSaveDraft, loading }) => {
  const educationLevels = [
    'No formal education', 'Primary', 'Secondary', 'Higher Secondary', 'Graduate', 'Other',
  ];

  const stitchingExperienceOptions = ['None', 'Basic', 'Good', 'Advanced'];

  const RadioGroup = ({ name, field, options, inline = true, required = false }) => (
    <>
      <div className={inline ? 'flex gap-6' : 'space-y-2'}>
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value={option}
              {...register(field, required ? { required: `Please select ${name}` } : {})}
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
        <h2 className="text-2xl font-bold text-gray-800">Education & Work Background</h2>
        <p className="text-gray-600 text-sm mt-1">
          Applicant's education level and relevant work experience.
        </p>
      </div>

      {/* Education Level */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Education Level <span className="text-red-500">*</span>
        </label>
        <RadioGroup name="education level" field="educationLevel" options={educationLevels} inline={false} required />
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Stitching Experience */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Stitching Experience <span className="text-red-500">*</span>
        </label>
        <RadioGroup name="stitching experience" field="stitchingExperience" options={stitchingExperienceOptions} required />
      </div>

      {/* Sewing Machine at Home */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Sewing Machine at Home <span className="text-red-500">*</span>
        </label>
        <RadioGroup name="sewing machine option" field="sewingMachineAtHome" options={['Yes', 'No']} required />
      </div>

      {/* Beauty / Parlour Experience */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Beauty / Parlour Experience <span className="text-red-500">*</span>
        </label>
        <RadioGroup name="beauty parlour experience" field="beautyParlourExperience" options={['Yes', 'No']} required />
      </div>

      {/* Food Business Experience */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Food Business Experience <span className="text-red-500">*</span>
        </label>
        <RadioGroup name="food business experience" field="foodBusinessExperience" options={['Yes', 'No']} required />
      </div>

      {/* Handicraft Experience */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Handicraft Experience <span className="text-red-500">*</span>
        </label>
        <RadioGroup name="handicraft experience" field="handicraftExperience" options={['Yes', 'No']} required />
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Previous Skill Training */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Previous Skill Training
        </label>
        <textarea
          placeholder="Describe any previous skill training received (optional)"
          {...register('previousSkillTraining')}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center px-5 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
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
            onClick={onNext}
            disabled={loading}
            className="flex items-center px-5 py-2 bg-blue-700 text-white rounded text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3EducationWork;
