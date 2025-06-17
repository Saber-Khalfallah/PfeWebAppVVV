"use client";

import { useToast } from "@/hooks/use-toast";
import { fetchCategories } from "@/lib/actions/categoriesAction";
import { Job, ServiceCategory } from "@/lib/types/modelTypes";
import Image from "next/image";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SubmitButton from "@/components/SubmitButton";
import { JobFormState } from "@/lib/types/formState";

import { getDelegations, type DelegationData } from "@/lib/actions/locations";

import { cn } from "@/lib/utils";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
const LocationField = ({ defaultLocation, state }: {
    defaultLocation?: string,
    state: any
}) => {
    const [delegations, setDelegations] = useState<DelegationData[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<DelegationData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        if (defaultLocation && delegations.length > 0) {
            const found = delegations.find(d => d.delegation === defaultLocation);
            if (found) {
                setSelectedLocation(found);
            }
        }
    }, [defaultLocation, delegations]);
    useEffect(() => {
        const fetchDelegations = async () => {
            try {
                const data = await getDelegations();
                if (Array.isArray(data)) {
                    setDelegations(data);
                } else {
                    console.error('Invalid delegation data format');
                    setDelegations([]);
                }
            } catch (error) {
                console.error('Failed to fetch delegations:', error);
                setDelegations([]);
            }
        };

        fetchDelegations();
    }, []);
    const getLocationErrors = () => {
        const errors = [];
        if (state?.errors?.postalCode) errors.push(...state.errors.postalCode);
        if (state?.errors?.governorate) errors.push(...state.errors.governorate);
        if (state?.errors?.delegation) errors.push(...state.errors.delegation);
        return errors;
    };
    // Filter delegations based on postal code input
    const filteredDelegations = React.useMemo(() => {
        if (!delegations?.length) return [];
        const search = searchQuery.trim();
        if (!search) return [];

        return delegations.filter(delegation => {
            const postalCode = delegation?.postalCode;
            if (!postalCode) return false;
            return postalCode.toString().startsWith(search);
        }).slice(0, 5);
    }, [delegations, searchQuery]);

    return (
        <div className="flex flex-col space-y-2 relative">
            <Label>Location (Search by postal code)</Label>
            <div className="relative">
                <Input
                    type="text"
                    placeholder={selectedLocation ? `${selectedLocation.delegation} (${selectedLocation.postalCode})` : "Type postal code..."}
                    value={selectedLocation ? `${selectedLocation.delegation} (${selectedLocation.postalCode})` : searchQuery}
                    onChange={(e) => {
                        if (selectedLocation) {
                            setSelectedLocation(null);
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setSearchQuery(value);
                        } else {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setSearchQuery(value);
                        }
                        setShowOptions(true);
                    }}
                    onFocus={() => {
                        if (selectedLocation) {
                            setSelectedLocation(null);
                            setSearchQuery('');
                        }
                        setShowOptions(true);
                    }}
                    className={cn(
                        "w-full",
                        selectedLocation && "text-blue-600 font-medium",
                        (state?.errors?.postalCode ||
                            state?.errors?.governorate ||
                            state?.errors?.delegation) && "border-red-500"
                    )}
                    readOnly={selectedLocation ? true : false}
                />

                {showOptions && searchQuery && !selectedLocation && (
                    <div className="absolute w-full mt-1 bg-white rounded-md border shadow-lg z-50 max-h-[200px] overflow-y-auto">
                        {filteredDelegations.length > 0 ? (
                            filteredDelegations.map((delegation) => (
                                <button
                                    key={delegation.delegation}
                                    type="button"
                                    className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center space-x-2"
                                    onClick={() => {
                                        setSelectedLocation(delegation);
                                        setSearchQuery('');
                                        setShowOptions(false);
                                    }}
                                >
                                    <span>{delegation.delegation} ({delegation.postalCode})</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">
                                No matching postal code found
                            </div>
                        )}
                    </div>
                )}
            </div>

            <input type="hidden" name="postalCode" value={selectedLocation?.postalCode || ""} />
            <input type="hidden" name="governorate" value={selectedLocation?.governorate || ""} />
            <input type="hidden" name="governorateAr" value={selectedLocation?.governorateAr || ""} />
            <input type="hidden" name="delegation" value={selectedLocation?.delegation || ""} />
            <input type="hidden" name="delegationAr" value={selectedLocation?.delegationAr || ""} />
            <input type="hidden" name="latitude" value={String(selectedLocation?.latitude || "")} />
            <input type="hidden" name="longitude" value={String(selectedLocation?.longitude || "")} />

            {getLocationErrors().length > 0 && (
                <div className="text-red-500 text-sm">
                    {getLocationErrors().map((err: string, index: number) => (
                        <p key={index}>{err}</p>
                    ))}
                </div>
            )}
        </div>
    );
};
interface EditProjectCardProps {
    project: Job; // Fixed: Added missing project prop
    state: JobFormState;
    onSave: (updatedProject: FormData, removedImages: string[]) => Promise<any>; // Fixed: Changed to FormData and made async
    onCancel: () => void;
    onSuccess: (updatedData: any) => void; // Add this new prop

}

const EditProjectCard: React.FC<EditProjectCardProps> = ({ project, state, onSave, onCancel, onSuccess }) => {
    const [imageUrls, setImageUrls] = useState<string[]>(project.media?.map((m) => m.mediaUrl) || []);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [removedImages, setRemovedImages] = useState<string[]>([]);  // Store removed images' URLs
    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [selectedBudget, setSelectedBudget] = useState(project.estimatedCost || 1000);
    const [validationErrors, setValidationErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(project.requestedDatetime ? new Date(project.requestedDatetime) : null);

    const { toast } = useToast();
    // Fixed: Added state effect handling like in UpsertJobForm
    useEffect(() => {
        if (state?.message)
            toast({
                title: state?.ok ? "Success" : "Oops",
                description: state?.message,
            });
    }, [state]);

    useEffect(() => {
        fetchCategories()
            .then((categories) => setServiceCategories(categories))
            .catch(() =>
                toast({
                    title: "Error",
                    description: "Failed to load service categories",
                    variant: "destructive",
                }),
            );
    }, [toast]);

    // Fixed: Added effect to handle state data like in UpsertJobForm
    useEffect(() => {
        if (state?.data?.requestedDatetime) {
            setSelectedDate(new Date(state.data.requestedDatetime));
        }
    }, [state?.data?.requestedDatetime]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);

            // Check file count limit
            if (selectedFiles.length + filesArray.length > 20) {
                toast({
                    title: "Error",
                    description: `Cannot add ${filesArray.length} images. Maximum 20 images allowed. Current: ${selectedFiles.length}`,
                    variant: "destructive",
                });
                return;
            }

            // Check file sizes (10MB limit)
            const oversizedFiles = filesArray.filter(file => file.size > 10 * 1024 * 1024);
            if (oversizedFiles.length > 0) {
                toast({
                    title: "Error",
                    description: "Some files exceed 10MB limit. Please choose smaller files.",
                    variant: "destructive",
                });
                return;
            }

            // Update both files and preview URLs
            const newUrls = filesArray.map((file) => URL.createObjectURL(file));
            setSelectedFiles(prev => [...prev, ...filesArray]);
            setImageUrls(prev => [...prev, ...newUrls]);
        }
    };

    // Remove an image (update both imageUrls and selectedFiles)
    const removeImage = (index: number) => {
        // If it's an existing image (from the project), remove it from imageUrls and add to removedImages
        const imageToRemove = imageUrls[index];
        if (imageToRemove) {
            setImageUrls(prev => prev.filter((_, i) => i !== index));  // Remove from the list
            setRemovedImages(prev => [...prev, imageToRemove]);  // Add to removedImages list
        }
    };

    // Handle form submission logic
    // Inside the component where the form is submitted

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setValidationErrors({});

        try {
            const formData = new FormData();
            const form = event.currentTarget;
            const formElements = new FormData(form);

            // Append form fields (excluding images as we handle them separately)
            for (let [key, value] of formElements.entries()) {
                if (key !== 'images') {
                    formData.append(key, value);
                }
            }
            
            // Send the removed images (if any)
            if (removedImages.length > 0) {
                console.log("removed images", removedImages);
                formData.append('removedImages', JSON.stringify(removedImages)); // Add removed images to FormData
            }

            // Add new files (images) if any
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file) => {
                    formData.append('images', file);
                });
            }
            
            // Add date and budget
            if (selectedDate) {
                formData.set('requestedDatetime', selectedDate.toISOString());
            }

            formData.set('estimatedCost', selectedBudget.toString());
            formData.append('id', project.id);

            const result = await onSave(formData,removedImages);  // onSave refers to your API call
            console.log("formData data", result);
            if (result?.ok) {
                setValidationErrors({});
                toast({
                    title: "Success",
                    description: "Project updated successfully!",
                });
                if (onSuccess) onSuccess(result.data);
                onCancel();
            } else {
                if (result?.errors) {
                    setValidationErrors(result.errors);
                }
                toast({
                    title: "Error",
                    description: "Please check the form for errors",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update project. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    // Helper function to get error message (checks both client and server errors)
    const getErrorMessage = (fieldName: string) => {
        return validationErrors[fieldName] || state?.errors?.[fieldName];
    };

    return (
        <form className="container mx-auto p-4 md:p-8 max-w-4xl" onSubmit={handleSubmit}>
            {/* Project Details Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5">
                    Project Details
                </h3>

                {/* Project Title */}
                <div className="mb-4">
                    <label htmlFor="project-title" className="block text-gray-700 text-sm font-bold mb-2">
                        Project Title*
                    </label>
                    <input
                        type="text"
                        id="project-title"
                        name="title"
                        placeholder="Enter a descriptive title for your project"
                        defaultValue={project.title}
                        className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {getErrorMessage('title') && (
                        <p className="text-red-500 text-sm mt-1 animate-shake">
                            {Array.isArray(getErrorMessage('title'))
                                ? getErrorMessage('title')[0]
                                : getErrorMessage('title')
                            }
                        </p>
                    )}
                </div>

                {/* Project Description */}
                <div className="mb-4">
                    <label htmlFor="project-description" className="block text-gray-700 text-sm font-bold mb-2">
                        Project Description*
                    </label>
                    <textarea
                        id="project-description"
                        name="description"
                        placeholder="Describe your project in detail including requirements and expectations"
                        defaultValue={project.description}
                        className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28 resize-y"
                    />
                    {getErrorMessage('description') && (
                        <p className="text-red-500 text-sm mt-1 animate-shake">
                            {Array.isArray(getErrorMessage('description'))
                                ? getErrorMessage('description')[0]
                                : getErrorMessage('description')
                            }
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Service Type */}
                    <div>
                        <label htmlFor="service-type" className="block text-gray-700 text-sm font-bold mb-2">
                            Service Type*
                        </label>
                        <select
                            id="service-type"
                            name="categoryId"
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            defaultValue={project.category?.id || ""}
                        >
                            <option value="">Select service type</option>
                            {serviceCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {getErrorMessage('categoryId') && (
                            <p className="text-red-500 text-sm mt-1 animate-shake">
                                {Array.isArray(getErrorMessage('categoryId'))
                                    ? getErrorMessage('categoryId')[0]
                                    : getErrorMessage('categoryId')
                                }
                            </p>
                        )}
                    </div>

                    {/* Budget Range */}
                    <div>
                        <label htmlFor="budget-range" className="block text-gray-700 text-sm font-bold mb-2">
                            Estimated Budget*
                        </label>
                        <input
                            type="range"
                            id="budget-range"
                            name="estimatedCost"
                            min="50"
                            max="10000"
                            step="100"
                            value={selectedBudget}
                            onChange={(e) => setSelectedBudget(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>DT {selectedBudget}</span>
                        </div>
                        {getErrorMessage('estimatedCost') && (
                            <p className="text-red-500 text-sm mt-1 animate-shake">
                                {Array.isArray(getErrorMessage('estimatedCost'))
                                    ? getErrorMessage('estimatedCost')[0]
                                    : getErrorMessage('estimatedCost')
                                }
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Location & Timing Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5">
                    Location & Timing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LocationField defaultLocation={project.delegation} state={state} />

                    {/* Expected Completion Date */}
                    <div>
                        <label htmlFor="expected-completion-date" className="block text-gray-700 text-sm font-bold mb-2">
                            Expected Completion Date
                        </label>
                        <div className="relative">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date | null) => setSelectedDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select completion date"
                                minDate={new Date()}
                                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                wrapperClassName="w-full"
                                showPopperArrow={false}
                                popperClassName="react-datepicker-popper z-50"
                                calendarClassName="shadow-lg border rounded-lg"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                📅
                            </span>
                        </div>
                        {getErrorMessage('requestedDatetime') && (
                            <p className="text-red-500 text-sm mt-1 animate-shake">
                                {Array.isArray(getErrorMessage('requestedDatetime'))
                                    ? getErrorMessage('requestedDatetime')[0]
                                    : getErrorMessage('requestedDatetime')
                                }
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Project Images Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center border-b pb-3 mb-5">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Project Images
                    </h3>
                    <span className="text-sm text-gray-600">
                        {selectedFiles.length}/20 images
                    </span>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center bg-gray-50 hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                    <div className="mb-4">
                        <span className="text-blue-500 text-5xl">☁️</span>
                    </div>
                    <p className="text-gray-600 mb-3">Drag and drop files here or</p>
                    <input
                        type="file"
                        id="file-upload"
                        name="images"
                        multiple
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {/* Display selected images */}
                    {imageUrls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                            {imageUrls.map((src, idx) => (
                                <div key={idx} className="relative w-full h-32 overflow-hidden rounded border">
                                    <Image
                                        src={src}
                                        alt={`Image ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        aria-label={`Remove image ${idx + 1}`}
                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold focus:outline-none"
                                        type="button"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <label
                        htmlFor="file-upload"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer inline-block"
                    >
                        Browse Files
                    </label>
                    <p className="text-gray-500 text-xs mt-4">
                        Maximum file size: 10MB per image. Maximum 20 images. Supported formats: JPG, PNG
                    </p>
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                    Cancel
                </button>
                <SubmitButton
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </SubmitButton>
            </div>
        </form>
    );
};

export default EditProjectCard;