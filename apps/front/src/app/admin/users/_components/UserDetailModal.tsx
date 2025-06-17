import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { User } from '@/lib/types/modelTypes';

interface UserDetailsModalProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
}

const UserDetailsModal = ({ user, isOpen, onClose }: UserDetailsModalProps) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
                    <Dialog.Title className="text-2xl font-semibold mb-4">
                        User Details
                    </Dialog.Title>
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center space-x-4 border-b pb-4">
                            <Image
                                src={user.avatarUrl}
                                alt={`${user.roleData.firstName}'s profile`}
                                width={80}
                                height={80}
                                className="rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    {user.roleData.firstName} {user.roleData.lastName}
                                </h2>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Account Information</h3>
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="font-medium">Status: </span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${user.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Account Type: </span>
                                        {user.client ? 'Client' : user.serviceProvider ? 'Service Provider' : 'Administrator'}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Created: </span>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Contact Information</h3>
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="font-medium">Email: </span>
                                        {user.email}
                                    </p>
                                    {user.roleData.contactInfo && (
                                        <p className="text-sm">
                                            <span className="font-medium">Phone: </span>
                                            {user.roleData.contactInfo}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end pt-4 border-t">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default UserDetailsModal;