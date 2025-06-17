'use client';

import { useState } from 'react';
import EditProfileForm from './_components/EditProfileForm';
import ChangePasswordForm from './_components/ChangePasswordForm';
import ProfileInfo from './_components/ProfileInfo';

export default function ProfilePage() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  
  // Mock user data - replace with actual user data
  const user = {
    name: 'Saber Khalfallah',
    email: 'sabeur.khalfallah4@gmail.com',
    phone: '+216 25 971 082',
    location: 'MSAKEN (MESSADINE)(4013)',
    avatar: 'https://saberstorage1.blob.core.windows.net/pfefileupload/avatars/user-email-sabeur_khalfallah94_gmail_com/ee297463-f61b-4dcc-bc13-639c23971835.png'
  };

  const handleUpdateProfile = async (data: any) => {
    // Handle profile update logic here
    console.log('Updating profile:', data);
    setIsEditProfileOpen(false);
  };

  const handleChangePassword = async (data: any) => {
    // Handle password change logic here
    console.log('Changing password:', data);
    setIsChangePasswordOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <ProfileInfo 
            user={user}
            onEditProfile={() => setIsEditProfileOpen(true)}
            onChangePassword={() => setIsChangePasswordOpen(true)}
          />
        </div>
      </div>

      <EditProfileForm
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSubmit={handleUpdateProfile}
        initialData={user}
      />

      <ChangePasswordForm
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSubmit={handleChangePassword}
      />
    </div>
  );
}