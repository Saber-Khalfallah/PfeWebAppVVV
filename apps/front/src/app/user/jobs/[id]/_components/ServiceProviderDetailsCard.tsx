import React, { useState } from 'react';
import Image from 'next/image';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { assignProvider, closeJob } from '@/lib/actions/jobAction';
import axios from 'axios';

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
    requestStatus?: string;
    requestId?: string;
    requestType?: 'PROVIDER_TO_CLIENT' | 'CLIENT_TO_PROVIDER';
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
  jobId: string; // Add this
  onBack: () => void;
  onSuccess?: (updatedData: any) => void;
}

const ServiceProviderDetailsCard: React.FC<ServiceProviderDetailsCardProps> = ({
  provider,
  jobId,
  onBack,
  onSuccess
}) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [messageText, setMessageText] = useState('');

  const timeframe = new Date(provider.registrationDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  const handleAcceptRequest = async () => {
    setIsAssigning(true);
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/job/requests/${provider.requestId}/respond`,
        { status: 'ACCEPTED' },
        { withCredentials: true }
      );

      if (response.data) {
        toast({
          title: "Success",
          description: "Request accepted successfully",
        });

        // Update the local provider state immediately
        const updatedProvider = {
          ...provider,
          requestStatus: 'ACCEPTED'
        };

        if (onSuccess) {
          onSuccess(response.data);
        }

        // Set the updated provider data
        provider.requestStatus = 'ACCEPTED';
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRejectRequest = async () => {
    setIsAssigning(true);
    try {
      // Call your API to reject the request
      const response = await axios.patch(
        `http://localhost:8000/api/job/requests/${provider.requestId}/respond`,
        { status: 'REJECTED' },
        { withCredentials: true }
      );

      if (response.data) {
        toast({
          title: "Success",
          description: "Request rejected successfully",
        });
        if (onSuccess) {
          onSuccess(response.data);
        }
        onBack();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };
  const handleEngageProvider = async () => {
    setIsAssigning(true);
    try {
      console.log('handleEngageProvider - Starting with:', {
        jobId,
        providerId: provider.id,
        provider
      });

      if (!jobId || !provider.id) {
        throw new Error('Missing required job ID or provider ID');
      }

      const assignResult = await assignProvider(jobId, provider.id);
      console.log('handleEngageProvider - Result:', assignResult);

      if (assignResult.ok) {
        toast({
          title: "Success",
          description: "Provider assigned successfully",
        });
        const assignedCraftsman = {
          id: provider.id,
          name: provider.name,
          avatar: provider.avatar,
          rating: provider.rating,
          email: provider.email,
          phone: provider.phone,
          location: provider.location,
          specialization: provider.specialization,
          experience: provider.experience,
          companyName: provider.companyName,
          description: provider.description,
          registrationDate: provider.registrationDate,
          isValidated: provider.isValidated
        };
        if (onSuccess) {
          onSuccess({
            ...assignResult.data,
            assignedCraftsman
          });
        }
        onBack();
      } else {
        toast({
          title: "Error",
          description: assignResult.message || "Failed to assign provider",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('handleEngageProvider - Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
      setShowConfirmDialog(false);
    }
  };
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
                  className={`w-5 h-5 ${i < provider.rating ? 'text-yellow-400' : 'text-gray-300'
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
        {provider.requestType === 'PROVIDER_TO_CLIENT' ? (
          // Provider sent request to client (Interested Craftsman)
          <>
            {provider.requestStatus === 'PENDING' ? (
              <div className="space-y-4">
                <p className="text-lg mb-4">Accept request from {provider.name}?</p>
                <div className="flex justify-center space-x-4 max-w-md mx-auto">
                  <button
                    onClick={handleAcceptRequest}
                    disabled={isAssigning}
                    className={`
                flex-1 px-6 py-2.5 
                ${isAssigning ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                text-white rounded-md transition-colors duration-200 font-medium
              `}
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={handleRejectRequest}
                    disabled={isAssigning}
                    className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ) : provider.requestStatus === 'ACCEPTED' ? (
              <>
                <p className="text-lg mb-4">Do you want to engage {provider.name}?</p>
                <div className="flex justify-center space-x-4 max-w-md mx-auto">
                  <button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isAssigning}
                    className={`
                flex-1 px-6 py-2.5 
                ${isAssigning ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                text-white rounded-md transition-colors duration-200 font-medium
              `}
                  >
                    Engage Provider
                  </button>
                  <button
                    onClick={onBack}
                    className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-600">
                <p>Request has been {provider.requestStatus?.toLowerCase()}</p>
              </div>
            )}
          </>
        ) : (
          // Client sent invitation to provider (Invited Craftsman)
          <>
            {provider.requestStatus === 'PENDING' ? (
              <div className="text-yellow-600">
                <p>Waiting for {provider.name} to respond to your invitation.</p>
              </div>
            ) : provider.requestStatus === 'ACCEPTED' ? (
              <>
                <p className="text-lg mb-4">Do you want to engage {provider.name}?</p>
                <div className="flex justify-center space-x-4 max-w-md mx-auto">
                  <button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isAssigning}
                    className={`
                flex-1 px-6 py-2.5 
                ${isAssigning ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                text-white rounded-md transition-colors duration-200 font-medium
              `}
                  >
                    Engage Provider
                  </button>
                  <button
                    onClick={onBack}
                    className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-600">
                <p>Provider has {provider.requestStatus?.toLowerCase()} your invitation</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Engagement</DialogTitle>
            <DialogDescription>
              Are you sure you want to engage {provider.name}? This will assign them to the job and close it automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleEngageProvider}
              disabled={isAssigning}
              className={`
          px-4 py-2 text-white rounded-md
          ${isAssigning ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
        `}
            >
              {isAssigning ? 'Processing...' : 'Confirm'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  `px-4 py-2 font-medium focus:outline-none ${selected
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
                        className={`w-8 h-8 ${i < userRating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your review here..."
                      className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        // Handle review submission
                        console.log({ rating: userRating, comment: reviewComment });
                      }}
                    >
                      Submit Review
                    </button>
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
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'
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
                <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                  {/* Example messages - replace with actual messages from provider.messages */}
                  <div className="flex items-start space-x-3">
                    <Image
                      src={provider.avatar}
                      alt={provider.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm font-medium text-gray-900">{provider.name}</p>
                      <p className="text-gray-700">tji tsala7 l climatiseur ?</p>
                      <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start justify-end space-x-3">
                    <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">akiiid taw taw.</p>
                      <p className="text-xs text-blue-200 mt-1">10:32 AM</p>
                    </div>
                    <Image
                      src="https://saberstorage1.blob.core.windows.net/pfefileupload/avatars/user-email-sabeur_khalfallah94_gmail_com/ee297463-f61b-4dcc-bc13-639c23971835.png" // Replace with actual user avatar
                      alt="You"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <Image
                      src={provider.avatar}
                      alt={provider.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm font-medium text-gray-900">{provider.name}</p>
                      <p className="text-gray-700">wawaw.</p>
                      <p className="text-xs text-gray-500 mt-1">10:35 AM</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full h-24 resize-none border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your message here..."
                  />
                  <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      // Handle message sending
                      console.log({ message: messageText });
                      setMessageText('');
                    }}
                  >
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