import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    'Personal Information',
    'Household & Socio-Economic',
    'Education & Work',
    'Training Interest',
    'Need Assessment',
  ];

  const getStepState = (index) => {
    if (index < currentStep - 1) return 'completed';
    if (index === currentStep - 1) return 'active';
    return 'upcoming';
  };

  const getLineColor = (index) => {
    if (index < currentStep - 1) return 'bg-green-500';
    return 'bg-gray-300';
  };

  const getStepLabelColor = (index) => {
    if (index < currentStep - 1) return 'text-green-600';
    if (index === currentStep - 1) return 'text-blue-600';
    return 'text-gray-400';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            {/* Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all flex-shrink-0 ${
                getStepState(index) === 'completed'
                  ? 'bg-green-500 text-white'
                  : getStepState(index) === 'active'
                  ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                  : 'bg-white border-2 border-gray-300 text-gray-600'
              }`}
            >
              {getStepState(index) === 'completed' ? (
                <Check size={12} />
              ) : (
                index + 1
              )}
            </div>

            {/* Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${getLineColor(index)}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step names */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center">
            <p
              className={`text-xs font-semibold transition-all ${getStepLabelColor(index)}`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
