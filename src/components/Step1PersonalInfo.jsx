import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Err = ({ msg }) => msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;
const inputCls = (hasErr) =>
  `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasErr ? 'border-red-500' : 'border-gray-300'}`;

const Step1PersonalInfo = ({ register, errors, onNext, onBack, onSaveDraft, loading }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
        <p className="text-gray-600 text-sm mt-1">
          Basic details of the applicant. Fields marked with <span className="text-red-500">*</span> are required.
        </p>
      </div>

      {/* Batch */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Batch <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          {['Batch 1', 'Batch 2'].map((batch) => (
            <label key={batch} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={batch}
                {...register('batch', { required: 'Please select a batch' })}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{batch}</span>
            </label>
          ))}
        </div>
        <Err msg={errors.batch?.message} />
      </div>

      {/* Full Name & Age */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter full name"
            {...register('fullName', { required: 'Full name is required' })}
            className={inputCls(errors.fullName)}
          />
          <Err msg={errors.fullName?.message} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 28"
            {...register('age', { required: 'Age is required' })}
            className={inputCls(errors.age)}
          />
          <Err msg={errors.age?.message} />
        </div>
      </div>

      {/* Father / Husband Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Father / Husband Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter father or husband name"
          {...register('fatherName', { required: 'Father / Husband name is required' })}
          className={inputCls(errors.fatherName)}
        />
        <Err msg={errors.fatherName?.message} />
      </div>

      {/* Mobile & Alternate */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 9876543210"
            {...register('mobile', { required: 'Mobile number is required' })}
            className={inputCls(errors.mobile)}
          />
          <Err msg={errors.mobile?.message} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Alternate Number</label>
          <input
            type="text"
            placeholder="Optional"
            {...register('alternateNumber')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Full Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Full Address <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="House no., street, locality, city, pin code"
          {...register('address', { required: 'Address is required' })}
          rows="3"
          className={inputCls(errors.address)}
        />
        <Err msg={errors.address?.message} />
      </div>

      {/* Local Resident */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Local Resident of Garhi? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          {['Yes', 'No'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={option}
                {...register('localResident', { required: 'Please select an option' })}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        <Err msg={errors.localResident?.message} />
      </div>

      {/* Aadhaar & Bank Account */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhaar Number</label>
          <input
            type="text"
            placeholder="12-digit Aadhaar number"
            {...register('aadhaar')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Bank Account Available <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            {['Yes', 'No'].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={option}
                  {...register('bankAccount', { required: 'Please select an option' })}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          <Err msg={errors.bankAccount?.message} />
        </div>
      </div>

      {/* Caste Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Caste Category <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          {['General', 'OBC', 'SC', 'ST'].map((caste) => (
            <label key={caste} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={caste}
                {...register('caste', { required: 'Please select a caste category' })}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{caste}</span>
            </label>
          ))}
        </div>
        <Err msg={errors.caste?.message} />
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={true}
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

export default Step1PersonalInfo;
