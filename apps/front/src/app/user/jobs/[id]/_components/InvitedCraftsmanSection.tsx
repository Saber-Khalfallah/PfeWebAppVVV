// user/job/[id]/_components/InvitedCraftsmenSection.tsx
import React, { useState } from "react";
import Image from "next/image"; // Import Image component
import { Dialog, DialogPanel } from "@headlessui/react";
import { Craftsman } from "@/lib/types/modelTypes";



interface InvitedCraftsmenSectionProps {
  craftsmen: Craftsman[];
  onProviderSelect: (provider: Craftsman) => void;
}

const InvitedCraftsmenSection: React.FC<InvitedCraftsmenSectionProps> = ({
  craftsmen,
  onProviderSelect

}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCraftsman, setSelectedCraftsman] = useState<Craftsman | null>(null);

  const openModal = (craftsman: Craftsman) => {
    setSelectedCraftsman(craftsman);
    setIsModalOpen(true);
  };
  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Invited Craftsmen</h2>
        {craftsmen?.length === 0 ? (
          <div className="text-gray-600">No craftsmen invited yet.</div>
        ) : (
          <div className="space-y-4">
            {craftsmen?.map((craftsman) => (
              <div
                key={craftsman.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    {/* Using next/image for optimized images. Replace with actual image paths */}
                    <Image
                      src={craftsman.avatar || "/images/default-avatar.png"} // Fallback avatar
                      alt={craftsman.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{craftsman.name}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(craftsman.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1">
                        ({craftsman.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openModal(craftsman)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
                  title="View Provider Details"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
            {selectedCraftsman && (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={selectedCraftsman.avatar || "/images/default-avatar.png"}
                        alt={selectedCraftsman.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedCraftsman.name}
                      </h3>
                      <p className="text-gray-500">{selectedCraftsman.specialization}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Company</h4>
                      <p className="text-gray-900">{selectedCraftsman.companyName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                      <p className="text-gray-900">{selectedCraftsman.experience}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Rate</h4>
                      <p className="text-gray-900">{selectedCraftsman.hourlyRate}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Location</h4>
                      <p className="text-gray-900">{selectedCraftsman.location}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                      <p className="text-gray-900">{selectedCraftsman.phone}</p>
                      <p className="text-gray-900">{selectedCraftsman.email}</p>
                    </div>
                  </div>
                </div>

                {selectedCraftsman.description && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">About</h4>
                    <p className="text-gray-900">{selectedCraftsman.description}</p>
                  </div>
                )}

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default InvitedCraftsmenSection;
