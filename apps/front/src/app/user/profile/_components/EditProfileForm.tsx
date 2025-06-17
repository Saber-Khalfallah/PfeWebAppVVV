import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useRef } from 'react';
import Image from 'next/image';
import { FiCamera } from 'react-icons/fi';
interface FormDataBase {
    name: string;
    phone: string;
    location: string;
}

interface FormDataWithStringAvatar extends FormDataBase {
    avatar: string;
}

interface FormDataWithFileAvatar extends FormDataBase {
    avatar: File | string;
}
type EditProfileFormProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormDataWithFileAvatar) => void;
    initialData: FormDataWithStringAvatar;
};

export default function EditProfileForm({ isOpen, onClose, onSubmit, initialData }: EditProfileFormProps) {
    const [formData, setFormData] = useState<FormDataWithFileAvatar>({
        ...initialData,
        avatar: initialData.avatar
    });
    const [previewUrl, setPreviewUrl] = useState<string>(initialData.avatar);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
                setFormData(prev => ({
                    ...prev,
                    avatar: file
                }));
            };
            reader.readAsDataURL(file);
        }
    };


return (
    <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <TransitionChild
                    as="div"
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {/* Changed background to be more transparent */}
                    <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-xs" />
                </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as="div"
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            {/* Increased width of the modal */}
                            <DialogPanel className="w-full max-w-2xl transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                            <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                Edit Profile
                            </DialogTitle>

                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="space-y-6">
                                    {/* Avatar Upload Section */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative group">
                                            <div className="relative w-24 h-24 rounded-full overflow-hidden">
                                                <Image
                                                    src={previewUrl}
                                                    alt="Profile avatar"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full 
                            text-white hover:bg-blue-700 transition-colors"
                                            >
                                                <FiCamera className="w-4 h-4" />
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">Click to change avatar</p>
                                    </div>

                                    {/* Phone Number Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                          focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Location Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                          focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 
                        border border-gray-300 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                        hover:bg-blue-700 rounded-md"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </Transition>
);
}