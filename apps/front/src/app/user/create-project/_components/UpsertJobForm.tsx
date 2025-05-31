"use client";

import SubmitButton from "@/components/SubmitButton";
import { useToast } from "@/hooks/use-toast";
import { fetchCategories } from "@/lib/actions/categoriesAction";
import { createJob } from "@/lib/actions/jobAction";
import { JobFormState } from "@/lib/types/formState";
import { ServiceCategory } from "@/lib/types/modelTypes";
import { jobSchema } from "@/lib/zodSchemas/jobFormSchema";
import Image from "next/image";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
    state: JobFormState;
    formAction: (payload: FormData) => void;
};

const UpsertJobForm = ({ state, formAction }: Props) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Store actual files
    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [selectedBudget, setSelectedBudget] = useState(1000);
    const [validationErrors, setValidationErrors] = useState<any>({}); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { toast } = useToast();

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

    useEffect(() => {
        if (state?.data?.requestedDatetime) {
            setSelectedDate(new Date(state.data.requestedDatetime));
        }
    }, [state?.data?.requestedDatetime]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setValidationErrors({});

        // Create a fresh FormData object
        const formData = new FormData();
        
        // Get form data from the form
        const form = event.currentTarget;
        const formElements = new FormData(form);
        
        // Add all form fields except files
        for (let [key, value] of formElements.entries()) {
            if (key !== 'images') {
                formData.append(key, value);
            }
        }
        
        // Add the selected files explicitly
        selectedFiles.forEach((file) => {
            formData.append('images', file);
        });

        // Add the selected date if present
        if (selectedDate) {
            const isoDateString = selectedDate.toISOString();
            formData.set('requestedDatetime', isoDateString);
        }

        // Ensure estimatedCost is set correctly
        formData.set('estimatedCost', selectedBudget.toString());

        // Create validation data for Zod (without files)
        const validationData: any = {};
        for (let [key, value] of formData.entries()) {
            if (key !== 'images' && !(value instanceof File)) {
                validationData[key] = value;
            }
        }

        const validation = jobSchema.safeParse(validationData);
        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            console.error("Validation errors:", fieldErrors);
            setValidationErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            console.log("FormData contents before sending:");
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File - ${value.name} (${value.size} bytes, type: ${value.type})`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }

            const result = await createJob(state, formData);
            console.log("createJob result:", result);

            if (result?.ok) {
                setValidationErrors({});
                // Reset form
                setImageUrls([]);
                setSelectedFiles([]);
                setSelectedDate(null);
                setSelectedBudget(1000);
                
                // Reset form fields
                form.reset();
                
                toast({
                    title: "Success",
                    description: "Project created successfully!",
                });
            }
        } catch (error) {
            console.error("Error creating job:", error);
            toast({
                title: "Error",
                description: "Failed to create job. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const removeImage = (index: number) => {
        // Revoke the URL to prevent memory leaks
        URL.revokeObjectURL(imageUrls[index]);
        
        // Remove from both arrays
        setImageUrls(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Helper function to get error message (checks both client and server errors)
    const getErrorMessage = (fieldName: string) => {
        return validationErrors[fieldName] || state?.errors?.[fieldName];
    };

    return (
        <form
            className="container mx-auto p-4 md:p-8 max-w-4xl"
            onSubmit={onSubmit}
        >
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5">
                    Project Details
                </h3>

                {/* Project Title */}
                <div className="mb-4">
                    
                    <label
                        htmlFor="project-title"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Project Title*
                    </label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter a descriptive title for your project"
                        defaultValue={state?.data?.title}
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
                    <label
                        htmlFor="project-description"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Project Description*
                    </label>
                    <textarea
                        id="project-description"
                        name="description"
                        placeholder="Describe your project in detail including requirements and expectations"
                        className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28 resize-y"
                        defaultValue={state?.data?.description}
                    ></textarea>
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
                        <label
                            htmlFor="service-type"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Service Type*
                        </label>
                        <select
                            id="service-type"
                            name="categoryId"
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            defaultValue={state?.data?.categoryId || ""}
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
                    <div className="w-full">
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

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5">
                    Location & Timing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Project Location */}
                    <div>
                        <label
                            htmlFor="project-location"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Project Location*
                        </label>
                        <input
                            type="text"
                            id="project-location"
                            name="location"
                            placeholder="Enter address or location"
                            defaultValue={state?.data?.location || ''}
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {(getErrorMessage('location')) && (
                            <p className="text-red-500 text-sm mt-1 animate-shake">
                                {Array.isArray(getErrorMessage('location'))
                                    ? (getErrorMessage('location'))[0]
                                    : (getErrorMessage('location'))
                                }
                            </p>
                        )}
                    </div>

                    {/* Expected Completion Date */}
                    <div>
                        <label
                            htmlFor="expected-completion-date"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
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
                                <div
                                    key={idx}
                                    className="relative w-full h-32 overflow-hidden rounded border"
                                >
                                    <Image
                                        src={src}
                                        alt={`Selected image ${idx + 1}`}
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

                    {/* Display existing images from state */}
                    {imageUrls.length === 0 && Array.isArray(state?.data?.Media) && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                            {state.data.Media.map((media: any, idx: number) =>
                                media.url ? (
                                    <div key={idx} className="relative w-full h-32 overflow-hidden rounded border">
                                        <Image
                                            src={media.url}
                                            alt={`Existing image ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : null,
                            )}
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
                {(getErrorMessage('images')) && (
                    <p className="text-red-500 text-sm mt-1 animate-shake">
                        {Array.isArray(getErrorMessage('images'))
                            ? getErrorMessage('images')[0]
                            : getErrorMessage('images')
                        }
                    </p>
                )}
            </div>

            <SubmitButton
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Creating Project...' : 'Create Project'}
            </SubmitButton>
        </form>
    );
};

export default UpsertJobForm;