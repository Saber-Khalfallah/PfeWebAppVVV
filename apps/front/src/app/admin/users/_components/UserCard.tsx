// components/UserCard.jsx
import Image from 'next/image';
import { User } from '@/lib/types/modelTypes';
import { get } from 'http';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import * as Dialog from '@radix-ui/react-dialog';
import UserDetailsModal from './UserDetailModal';

interface UserCardProps {
    user: User;
    onToggleStatus: (userId: string) => void;

}
const ROLE_TYPES = {
    CLIENT: 'client',
    SERVICE_PROVIDER: 'serviceProvider',
    ADMINISTRATOR: 'administrator'
} as const;
const UserCard = ({ user, onToggleStatus }: UserCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    console.log('user : ', user.roleData.firstName);

    const handleConfirmToggle = async () => {
        try {
            await onToggleStatus(user.id);
            setIsModalOpen(false);


            toast({
                title: 'Success',
                description: `User has been ${user.isActive ? 'banned' : 'unbanned'} successfully.`,
                variant: 'default',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update user status.',
                variant: 'destructive',
            });
        }
    };
    const getDisplayName = () => {
        if (user.roleData?.firstName && user.roleData?.lastName) {
            return `${user.roleData.firstName} ${user.roleData.lastName}'s profile picture`;
        }
        return 'User profile picture'; // Default alt text
    };
    const getStatusColorClass = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800'
            case 'INACTIVE':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getUserRole = () => {
        if (user.client) return ROLE_TYPES.CLIENT;
        if (user.administrator) return ROLE_TYPES.ADMINISTRATOR;
        if (user.serviceProvider) return ROLE_TYPES.SERVICE_PROVIDER;

        return 'unknown';
    };
    const getRoleIcon = () => {
        const roleKey = Object.keys(user).find(key =>
            (key === ROLE_TYPES.CLIENT ||
                key === ROLE_TYPES.SERVICE_PROVIDER ||
                key === ROLE_TYPES.ADMINISTRATOR) &&
            user[key] !== null
        );

        switch (roleKey) {
            case ROLE_TYPES.CLIENT:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>

                );
            case ROLE_TYPES.SERVICE_PROVIDER:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">

                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 9.172l-8.486 8.486-3-3 8.486-8.486 3 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l4 4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 16l4 4m-4-4l-3 3-2-2 3-3z" />
                    </svg>


                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l7 4v6c0 5-3 8-7 10-4-2-7-5-7-10V6l7-4z" />
                        <circle cx="12" cy="12" r="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="14" x2="12" y2="16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                );
        }
    };

    const getUserTypeColorClass = (roleKey: string) => {
        switch (roleKey) {
            case ROLE_TYPES.CLIENT:
                return 'bg-blue-100 text-blue-700';
            case ROLE_TYPES.ADMINISTRATOR:
                return 'bg-orange-100 text-orange-700';
            case ROLE_TYPES.SERVICE_PROVIDER:
                return 'bg-green-100 text-green-700';

            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const roleKey = getUserRole();
    return (
        <div className="grid grid-cols-[1.5fr_2fr_1.5fr_1.2fr_1fr_1.5fr] items-center py-3 px-4 border-b border-gray-200 text-sm">
            {/* User */}
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12">
                    <Image
                        src={user.avatarUrl || '/fallback-avatar.png'}
                        alt={getDisplayName()}
                        width={32}
                        height={32}
                        className="rounded-full w-full h-full object-cover border border-gray-300"
                    />
                </div>
                <span className="font-medium text-gray-800 truncate">{user.roleData.firstName}</span>
            </div>

            {/* Email */}
            <div className="text-gray-600">{user.email}</div>

            {/* User Type */}
            <div className="flex justify-start">
                <span className={`w-35 px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getUserTypeColorClass(roleKey)}`}>
                    {getRoleIcon()}
                    {roleKey.toUpperCase()}
                </span>
            </div>

            {/* Created On */}
            <div className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</div>

            {/* Status */}
            <div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColorClass(user.isActive ? 'ACTIVE' : 'INACTIVE')
                        }`}
                >
                    {user.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 justify-center">
                <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <Dialog.Trigger asChild>
                        <button
                            className={`${user.isActive
                                ? 'bg-blue-600 hover:bg-blue-700 border border-gray-300'
                                : 'bg-sky-500 hover:bg-sky-600 border border-gray-300'
                                } text-white font-medium py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out flex items-center space-x-1`}
                        >
                            <span>{user.isActive ? 'Ban User' : 'Unban User'}</span>
                            {/* ...existing icons... */}
                        </button>
                    </Dialog.Trigger>

                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[400px] space-y-4">
                            <Dialog.Title className="text-lg font-semibold">
                                Confirm Action
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-gray-500">
                                Are you sure you want to {user.isActive ? 'ban' : 'unban'} this user?
                                {user.isActive
                                    ? ' This will prevent them from accessing the platform.'
                                    : ' This will restore their access to the platform.'}
                            </Dialog.Description>

                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmToggle}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>

                {/* View Button */}
                <button
                    onClick={() => setIsDetailsModalOpen(true)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition duration-150 ease-in-out border border-gray-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </div>

            {/* Add the UserDetailsModal */}
            <UserDetailsModal
                user={user}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
            />
        </div>
    );
};

export default UserCard;