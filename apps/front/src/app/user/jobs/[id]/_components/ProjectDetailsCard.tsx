// user/job/[id]/_components/ProjectDetailsCard.tsx
import React, { useRef, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import Image from "next/image";
interface JobMmedia {
  id: string;
  jobId: string;
  mediaUrl: string;
}
interface ProjectDetailsCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    location: string;
    requestedDatetime: string;
    status: string;
    estimatedCost: string | null;
    actualCost: string | null;
    createdAt: string;
    updatedAt: string;
    media: JobMmedia[];
    client: {
      userId: string;
      firstName: string;
      lastName: string;
      contactInfo: string;
      location: string;
      registrationDate: string;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        email: string;
        avatarUrl: string;
        createdAt: string;
        updatedAt: string;
      };
    };

    category: {
      id: string;
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    };

    jobRequests?: Array<{
      id: string;
      jobId: string;
      requesterId: string;
      targetId: string;
      type: string;
      status: string;
      message: string | null;
      createdAt: string;
      updatedAt: string;
      respondedAt: string | null;
      requester: {
        id: string;
        email: string;
        avatarUrl: string;
        createdAt: string;
        updatedAt: string;
      };
      target: {
        id: string;
        email: string;
        avatarUrl: string;
        createdAt: string;
        updatedAt: string;
      };
    }>;

    messages?: any[]; // You can refine this based on your message object schema
  };
}

const ProjectDetailsCard: React.FC<ProjectDetailsCardProps> = ({ project }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.media.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === project.media.length - 1 ? 0 : prev + 1
    );
  };
  const scrollImages = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = 150; // Adjust based on image width + gap
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const truncateDescription = (text: string, maxLength: number = 300) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Project Details</h2>
        
      </div>

      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-2xl font-bold text-gray-800">
            {new Intl.DateTimeFormat("en-CA").format(
              new Date(project.createdAt),
            )}
          </p>
          <p className="text-sm text-gray-500">Date Posted</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-2xl font-bold text-gray-800">{project.location}</p>
          <p className="text-sm text-gray-500">Location</p>
        </div>
      </div>

      <div className={`space-y-3 text-gray-700 text-sm mb-6 ${!isExpanded ? 'max-h-[300px] overflow-hidden relative' : ''}`}>
        <div className="space-y-3">
          <p>
            <span className="font-medium">Project ID:</span> #{project.id}
          </p>
          <p>
            <span className="font-medium">Service Category:</span>{" "}
            {project.category.name}
          </p>
          <p>
            <span className="font-medium">Location:</span> {project.location}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-2">Description</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {isExpanded ? project.description : truncateDescription(project.description)}
          </p>
        </div>

        {/* Gradient Overlay when collapsed */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-600 text-sm font-medium hover:underline mb-4 block w-full text-center"
      >
        {isExpanded ? 'Show Less' : 'View More Details'}
      </button>
      {project.media && project.media.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-800 mb-2">Project Images</h3>
          <div className="relative">
            <div
              ref={scrollContainer}
              className="flex gap-2 overflow-x-hidden scroll-smooth"
            >
              {project.media.map((media, index) => (
                <div
                  key={media.id}
                  className="flex-none cursor-pointer relative w-[120px] h-[120px] overflow-hidden rounded-lg hover:opacity-90 border border-gray-200"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsOpen(true);
                  }}
                >
                  <Image
                    src={media.mediaUrl}
                    alt={`Project image ${index + 1}`}
                    width={120}
                    height={120}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            
            {/* Scroll Buttons */}
            {project.media.length > 3 && (
              <>
                <button
                  onClick={() => scrollImages('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollImages('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {/* Image Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative max-w-4xl w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {project.media && project.media.length > 0 && (
              <div className="relative aspect-video">
                <img
                  src={project.media[currentImageIndex]?.mediaUrl}
                  alt={`Project image ${currentImageIndex + 1}`}
                  className="object-contain w-full h-full"
                />

                {project.media.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProjectDetailsCard;
