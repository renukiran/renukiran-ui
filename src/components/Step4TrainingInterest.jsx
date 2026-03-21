import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Err = ({ msg }) => msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

const Step4TrainingInterest = ({ register, errors, onNext, onBack, onSaveDraft, loading }) => {
  const enterpriseTrackOptions = [
    'Stitching / Garment Production', 'Bag Making', 'Beauty / Parlour Services',
    'Home-based Food Enterprise', 'Handicraft & Decoration Work', 'Other',
  ];

  const distanceOptions = ['< 1 km', '1 – 2 km', '> 2 km'];

  const motivationOptions = [
    'Want income immediately', 'Want to support family', 'Want to learn market-demand skills',
    'Want home-based work', 'Want to start micro-enterprise', 'Want to join SHG after program', 'Other',
  ];

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
                value={option}
                {...register('preferredEnterpriseTrack', {
                  validate: (value) => (value && value.length > 0) || 'Please select at least one option',
                })}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        <Err msg={errors.preferredEnterpriseTrack?.message} />
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
                value={option}
                {...register('distanceToTrainingCentre', { required: 'Please select distance' })}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        <Err msg={errors.distanceToTrainingCentre?.message} />
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
                value={option}
                {...register('motivationForJoining', {
                  validate: (value) => (value && value.length > 0) || 'Please select at least one option',
                })}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        <Err msg={errors.motivationForJoining?.message} />
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
