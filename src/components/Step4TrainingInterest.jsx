import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Step4TrainingInterest = ({ formData, onChange, onNext, onBack, onSaveDraft, loading }) => {
  const enterpriseTrackOptions = [
    'Stitching / Garment Production',
    'Bag Making',
    'Beauty / Parlour Services',
    'Home-based Food Enterprise',
    'Handicraft & Decoration Work',
    'Other',
  ];

  const distanceOptions = ['< 1 km', '1 – 2 km', '> 2 km'];

  const motivationOptions = [
    'Want income immediately',
    'Want to support family',
    'Want to learn market-demand skills',
    'Want home-based work',
    'Want to start micro-enterprise',
    'Want to join SHG after program',
    'Other',
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
        <h2 className="text-2xl font-bold text-gray-800">Training Interest & Availability</h2>
        <p className="text-gray-600 text-sm mt-1">
          What training the applicant is interested in and her availability.
        </p>
      </div>

      {/* Preferred Enterprise Track */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Preferred Enterprise Track <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">Select at least one</p>
        <div className="space-y-2">
          {enterpriseTrackOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(formData.preferredEnterpriseTrack || []).includes(option)}
                onChange={() => handleCheckbox('preferredEnterpriseTrack', option)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Distance to Training Centre */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Distance to Training Centre <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          {distanceOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="distanceToTrainingCentre"
                value={option}
                checked={formData.distanceToTrainingCentre === option}
                onChange={(e) => onChange('distanceToTrainingCentre', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Motivation for Joining */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Motivation for Joining Training <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
        <div className="space-y-2">
          {motivationOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(formData.motivationForJoining || []).includes(option)}
                onChange={() => handleCheckbox('motivationForJoining', option)}
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

export default Step4TrainingInterest;
