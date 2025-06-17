// app/_components/Stepper.tsx
import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { name: 'Professional Information', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    )},
    { name: 'Verification Documents', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2H2.25c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h16.5c.621 0 1.125-.504 1.125-1.125V6.75a1.125 1.125 0 0 0-1.125-1.125h-5.25A2.25 2.25 0 0 1 12 3.375v-1.5Z" />
      </svg>
    )},
    { name: 'Portfolio', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V9.75m-8.25 6h7.5" />
      </svg>
    )},
  ];

  return (
    <div className="flex justify-between items-center relative mb-8">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 mx-6" />

      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step.name} className="flex flex-col items-center flex-1 z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${isCompleted ? 'bg-blue-600 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              {isCompleted ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                step.icon
              )}
            </div>
            <p
              className={`text-sm mt-2 text-center transition-colors duration-300
                ${isActive ? 'font-semibold text-gray-800' : 'text-gray-500'}`}
            >
              {step.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;