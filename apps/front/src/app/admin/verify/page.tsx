// app/page.tsx
import ServiceProvidersList from './_components/ServiceProvidersList';
import SearchBar from './_components/SearchBar';
import NoServiceProvider from './_components/NoServiceProvider'; // Assuming this is for when there are no providers to display after filtering/search
import React from 'react';

export default function PendingVerificationsPage() {
  const serviceProviders = [
    {
      id: '1',
      providerName: "John's Electrical Services",
      email: 'john@electricalservices.com',
      serviceCategory: 'Electrician',
      registrationDate: 'May 15, 2023',
      location: 'New York, NY',
      status: 'Pending Review',
      avatar: 'https://via.placeholder.com/40'
    },
    {
      id: '2',
      providerName: 'Clean Home Services',
      email: 'info@cleanhome.com',
      serviceCategory: 'Cleaner',
      registrationDate: 'May 14, 2023',
      location: 'Los Angeles, CA',
      status: 'Pending Review',
      avatar: 'https://via.placeholder.com/40'
    },
    {
      id: '3',
      providerName: "Mike's Plumbing Solutions",
      email: 'mike@plumbingsolutions.com',
      serviceCategory: 'Plumber',
      registrationDate: 'May 13, 2023',
      location: 'Chicago, IL',
      status: 'Pending Review',
      avatar: 'https://via.placeholder.com/40'
    },
    {
      id: '4',
      providerName: 'Smart Tutoring',
      email: 'contact@smarttutoring.com',
      serviceCategory: 'Tutor',
      registrationDate: 'May 12, 2023',
      location: 'Houston, TX',
      status: 'Pending Review',
      avatar: 'https://via.placeholder.com/40'
    },
    {
      id: '5',
      providerName: 'Handy Man Services',
      email: 'info@handyman.com',
      serviceCategory: 'Handyman',
      registrationDate: 'May 11, 2023',
      location: 'Phoenix, AZ',
      status: 'Pending Review',
      avatar: 'https://via.placeholder.com/40'
    },
    {
      id: '6',
      providerName: "Sarah's Dog Walking",
      email: 'sarah@dogwalking.com',
      serviceCategory: 'Pet Care',
      registrationDate: 'May 10, 2023',
      location: 'Boston, MA',
      status: 'Pending Review',
      avatar: 'https://via.placeholder.com/40'
    },
  ];

  const totalPending = 24;
  const showNoServiceProvider = serviceProviders.length === 0;

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pending Verifications</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <span className="text-sm font-semibold">Total pending:</span>
          <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">{totalPending}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">Review and verify service provider applications</p>

      <SearchBar />

      {showNoServiceProvider ? (
        <NoServiceProvider message="No service providers found matching your criteria." />
      ) : (
        <ServiceProvidersList providers={serviceProviders} />
      )}
    </div>
  );
}