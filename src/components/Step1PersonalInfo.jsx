import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Step1PersonalInfo = ({ formData, onChange, onNext, onBack, onSaveDraft, loading }) => {
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
                name="batch"
                value={batch}
                checked={formData.batch === batch}
                onChange={(e) => onChange('batch', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{batch}</span>
            </label>
          ))}
        </div>
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
            value={formData.fullName || ''}
            onChange={(e) => onChange('fullName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 28"
            value={formData.age || ''}
            onChange={(e) => onChange('age', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          value={formData.fatherName || ''}
          onChange={(e) => onChange('fatherName', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
            value={formData.mobile || ''}
            onChange={(e) => onChange('mobile', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Alternate Number</label>
          <input
            type="text"
            placeholder="Optional"
            value={formData.alternateNumber || ''}
            onChange={(e) => onChange('alternateNumber', e.target.value)}
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
          value={formData.address || ''}
          onChange={(e) => onChange('address', e.target.value)}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
                name="localResident"
                value={option}
                checked={formData.localResident === option}
                onChange={(e) => onChange('localResident', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Aadhaar & Bank Account */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhaar Number</label>
          <input
            type="text"
            placeholder="12-digit Aadhaar number"
            value={formData.aadhaar || ''}
            onChange={(e) => onChange('aadhaar', e.target.value)}
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
                  name="bankAccount"
                  value={option}
                  checked={formData.bankAccount === option}
                  onChange={(e) => onChange('bankAccount', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
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
                name="caste"
                value={caste}
                checked={formData.caste === caste}
                onChange={(e) => onChange('caste', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{caste}</span>
            </label>
          ))}
        </div>
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
