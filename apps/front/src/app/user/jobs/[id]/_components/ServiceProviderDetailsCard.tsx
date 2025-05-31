import React, { useState } from 'react';
import Image from 'next/image';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

interface ServiceProviderDetailsCardProps {
  provider: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    email?: string;
    phone?: string;
    location: string;
    specialization: string;
    experience: string;
    companyName: string;
    description: string;
    registrationDate: string;
    isValidated: boolean;
    specialties?: Array<{ category: { name: string } }>;
    reviews?: Array<{
      rating: number;
      comment: string;
      createdAt: string;
      user: {
        name: string;
        avatar: string;
      };
    }>;
  };
  onBack: () => void;
}

const ServiceProviderDetailsCard: React.FC<ServiceProviderDetailsCardProps> = ({
  provider,
  onBack,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [userRating, setUserRating] = useState(0);

  const timeframe = new Date(provider.registrationDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with back button */}
      <div className="p-6 border-b">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back to Project Details
        </button>
      </div>

      {/* Provider Basic Info */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={provider.avatar}
              alt={provider.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{provider.name}</h2>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < provider.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-600">({provider.rating.toFixed(1)})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Location */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-gray-900">{provider.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="text-gray-900">{provider.phone}</p>
            <p className="text-gray-900">{provider.email}</p>
          </div>
        </div>
      </div>

      {/* Engagement Question */}
      <div className="p-6 border-b text-center">
        <p className="text-lg mb-4">Have you engaged {provider.name} yet?</p>
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Yes
          </button>
          <button className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            No
          </button>
        </div>
      </div>

      {/* Availability */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-4">Availability</h3>
        <p className="text-gray-600">Available for new projects</p>
      </div>

      {/* Tabs */}
      <div className="p-6">
        <TabGroup onChange={setSelectedTab}>
          <TabList className="flex space-x-4 border-b">
            {['Profile', 'Reviews', 'Message'].map((tab, index) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `px-4 py-2 font-medium focus:outline-none ${
                    selected
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="mt-6">
            {/* Profile Tab */}
            <TabPanel>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500">Member since</p>
                  <p className="text-gray-900">{timeframe}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verification Status</p>
                  <p className="text-gray-900">
                    {provider.isValidated ? 'Verified ✓' : 'Not verified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Specialties</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                   
                      <span
                        
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        {provider.specialization}
                      </span>
                    
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">About</p>
                  <p className="text-gray-900 mt-2">{provider.description}</p>
                </div>
              </div>
            </TabPanel>

            {/* Reviews Tab */}
            <TabPanel>
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4">Your Rating</h3>
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setUserRating(i + 1)}
                        className={`w-8 h-8 ${
                          i < userRating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {provider.reviews?.map((review, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={review.user.avatar}
                          alt={review.user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-medium">{review.user.name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabPanel>

            {/* Message Tab */}
            <TabPanel>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <textarea
                    className="w-full h-32 resize-none border rounded-lg p-2"
                    placeholder="Type your message here..."
                  />
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Send Message
                  </button>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default ServiceProviderDetailsCard;