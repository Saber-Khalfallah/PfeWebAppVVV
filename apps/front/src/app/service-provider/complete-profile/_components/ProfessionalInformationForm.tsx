// app/_components/ProfessionalInformationForm.tsx
'use client';

import React, { useState } from 'react';

interface ProfessionalInformationFormProps {
  onNext: () => void;
  onBack: () => void;
}

const ProfessionalInformationForm: React.FC<ProfessionalInformationFormProps> = ({ onNext, onBack }) => {
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState<string>('0.00');
  const [yearsOfExperience, setYearsOfExperience] = useState(5);
  const [interventionZoneType, setInterventionZoneType] = useState<'radius' | 'state' | 'country'>('radius');
  const [radius, setRadius] = useState(20);
  const [selectedState, setSelectedState] = useState('');

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSpecialties((prev) =>
      checked ? [...prev, value] : prev.filter((s) => s !== value)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      bio,
      specialties,
      hourlyRate,
      yearsOfExperience,
      interventionZoneType,
      radius: interventionZoneType === 'radius' ? radius : undefined,
      selectedState: interventionZoneType === 'state' ? selectedState : undefined,
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h3>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          Bio <span className="text-red-500">*</span>
        </label>
        <textarea
          id="bio"
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Tell potential clients about yourself, your background, and expertise..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          minLength={100}
          maxLength={500}
          required
        ></textarea>
        <p className="mt-2 text-xs text-gray-500">
          Minimum 100 characters, maximum 500 characters
        </p>
      </div>

      {/* Specialties */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specialties <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-4">
          {[
            'Plumbing', 'Carpentry', 'Cleaning',
            'Tutoring', 'Electrical Work', 'Pet Care',
            'Gardening', 'Painting', 'Other'
          ].map((specialty) => (
            <div key={specialty} className="flex items-center">
              <input
                id={`specialty-${specialty}`}
                name="specialties"
                type="checkbox"
                value={specialty}
                checked={specialties.includes(specialty)}
                onChange={handleSpecialtyChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor={`specialty-${specialty}`} className="ml-2 text-sm text-gray-700">
                {specialty}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Rate and Intervention Zone - Arranged side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hourly Rate */}
        <div>
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
            Hourly Rate <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="hourlyRate"
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="0.00"
              value={hourlyRate}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0)) {
                  setHourlyRate(value);
                }
              }}
              step="0.01"
              min="0"
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">/hr</span>
            </div>
          </div>
        </div>

        {/* Intervention Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intervention Zone <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="zone-radius"
                name="interventionZone"
                type="radio"
                value="radius"
                checked={interventionZoneType === 'radius'}
                onChange={() => setInterventionZoneType('radius')}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="zone-radius" className="ml-2 block text-sm text-gray-700">
                Radius
              </label>
            </div>
            {interventionZoneType === 'radius' && (
              <div className="flex items-center space-x-3 ml-6">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-700 w-12 text-right">{radius} km</span>
              </div>
            )}

            <div className="flex items-center">
              <input
                id="zone-state"
                name="interventionZone"
                type="radio"
                value="state"
                checked={interventionZoneType === 'state'}
                onChange={() => setInterventionZoneType('state')}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="zone-state" className="ml-2 block text-sm text-gray-700">
                State/Region
              </label>
            </div>
            {interventionZoneType === 'state' && (
              <div className="relative ml-6">
                <select
                  id="selectState"
                  className="mt-1 block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required={interventionZoneType === 'state'}
                >
                  <option value="">Select a state</option>
                  <option value="NY">New York</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                  </svg>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <input
                id="zone-country"
                name="interventionZone"
                type="radio"
                value="country"
                checked={interventionZoneType === 'country'}
                onChange={() => setInterventionZoneType('country')}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="zone-country" className="ml-2 block text-sm text-gray-700">
                Entire Country
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Years of Experience - Now as a separate section */}
      <div>
        <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-3 mt-2">
          <input
            type="range"
            id="yearsOfExperience"
            min="0"
            max="30"
            step="1"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-gray-700 w-12 text-right">{yearsOfExperience} years</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={true}
        >
          Back
        </button>
        <span className="text-sm text-gray-600">Step 1 of 3</span>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default ProfessionalInformationForm;