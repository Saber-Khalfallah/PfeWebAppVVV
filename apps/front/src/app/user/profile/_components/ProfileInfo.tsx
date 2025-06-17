import Image from 'next/image';
import { FiEdit2, FiLock } from 'react-icons/fi';

interface ProfileInfoProps {
  user: {
    name: string;
    email: string;
    phone: string;
    location: string;
    avatar: string;
  };
  onEditProfile: () => void;
  onChangePassword: () => void;
}

export default function ProfileInfo({ user, onEditProfile, onChangePassword }: ProfileInfoProps) {
  return (
    <div className="p-8">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Image
            src={user.avatar}
            alt={user.name}
            width={128}
            height={128}
            className="rounded-full"
          />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <div className="mt-8 border-t pt-8">
        <dl className="divide-y divide-gray-200">
          <div className="py-4 flex justify-between">
            <dt className="text-gray-500">Phone Number</dt>
            <dd className="text-gray-900">{user.phone}</dd>
          </div>
          <div className="py-4 flex justify-between">
            <dt className="text-gray-500">Location</dt>
            <dd className="text-gray-900">{user.location}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col space-y-4">
        <button
          onClick={onEditProfile}
          className="flex items-center justify-center px-4 py-2 border border-transparent 
            rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <FiEdit2 className="mr-2" />
          Edit Profile
        </button>
        <button
          onClick={onChangePassword}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 
            rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FiLock className="mr-2" />
          Change Password
        </button>
      </div>
    </div>
  );
}