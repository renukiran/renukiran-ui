import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Step2Household = ({ formData, onChange, onNext, onBack, onSaveDraft, loading }) => {
  const governmentSchemeOptions = [
    'Ration Card',
    'Widow Pension',
    'Old Age Pension',
    'Jan Dhan Account',
    'Ujjwala',
    'Other',
  ];

  const migrationRiskOptions = [
    'Will stay long-term',
    'Maybe will move',
    'Likely to move',
    'Does not know',
  ];

  const handleCheckbox = (field, value) => {
    const current = formData[field] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange(field, updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Household & Socio-Economic Details</h2>
        <p className="text-gray-600 text-sm mt-1">
          Information about the applicant's household and economic background.
        </p>
      </div>

      {/* Total Family Members & Working Members */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Total Family Members <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 5"
            value={formData.totalFamilyMembers || ''}
            onChange={(e) => onChange('totalFamilyMembers', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Working Members <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 2"
            value={formData.workingMembers || ''}
            onChange={(e) => onChange('workingMembers', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Monthly Household Income & Primary Source */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monthly Household Income ₹ <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 8000"
            value={formData.monthlyHouseholdIncome || ''}
            onChange={(e) => onChange('monthlyHouseholdIncome', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Primary Source of Income <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Daily wage labour"
            value={formData.primarySourceOfIncome || ''}
            onChange={(e) => onChange('primarySourceOfIncome', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Housing Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Housing Type <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          {['Rented', 'Own (Pucca)', 'Own (Kutcha)'].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="housingType"
                value={type}
                checked={formData.housingType === type}
                onChange={(e) => onChange('housingType', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Government Schemes Availed */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Government Schemes Availed
        </label>
        <div className="grid grid-cols-2 gap-4">
          {governmentSchemeOptions.map((scheme) => (
            <label key={scheme} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(formData.governmentSchemes || []).includes(scheme)}
                onChange={() => handleCheckbox('governmentSchemes', scheme)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{scheme}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Migration Risk */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Migration Risk (Next 6 Months) <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {migrationRiskOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="migrationRisk"
                value={option}
                checked={formData.migrationRisk === option}
                onChange={(e) => onChange('migrationRisk', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
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

export default Step2Household;
