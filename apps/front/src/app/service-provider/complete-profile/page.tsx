// app/page.tsx
'use client'; // This directive is necessary for client-side components in Next.js App Router

import React, { useState } from 'react';
import Stepper from './_components/stepper';
import ProfessionalInformationForm from './_components/ProfessionalInformationForm';
// import VerificationDocumentsForm from './_components/VerificationDocumentsForm'; // Future step
// import PortfolioForm from './_components/PortfolioForm'; // Future step

export default function CompleteServiceProviderProfilePage() {
  const [currentStep, setCurrentStep] = useState(1); // Start at step 1

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Complete Your Service Provider Profile</h2>
        <p className="text-gray-500 mb-8">
          Finish setting up your profile to start receiving service requests from potential clients.
        </p>

        <Stepper currentStep={currentStep} totalSteps={3} />

        <div className="mt-8">
          {currentStep === 1 && <ProfessionalInformationForm onNext={handleNext} onBack={handleBack} />}
          {/*
          {currentStep === 2 && <VerificationDocumentsForm onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && <PortfolioForm onNext={handleNext} onBack={handleBack} />}
          */}
        </div>
      </div>
    </div>
  );
}