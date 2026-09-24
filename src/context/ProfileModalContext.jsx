import React, { createContext, useContext, useState } from 'react';
import { UserProfileModal } from '../components/profile/UserProfileModal';

const ProfileModalContext = createContext();

export function ProfileModalProvider({ children, onStartChat }) {
  const [targetUser, setTargetUser] = useState(null);

  const openUserProfile = (user) => {
    if (!user) return;
    setTargetUser(user);
  };

  const closeUserProfile = () => {
    setTargetUser(null);
  };

  return (
    <ProfileModalContext.Provider value={{ openUserProfile, closeUserProfile }}>
      {children}
      <UserProfileModal
        user={targetUser}
        isOpen={Boolean(targetUser)}
        onClose={closeUserProfile}
        onStartChat={onStartChat}
      />
    </ProfileModalContext.Provider>
  );
}

export function useProfileModal() {
  const context = useContext(ProfileModalContext);
  if (!context) {
    return {
      openUserProfile: () => {},
      closeUserProfile: () => {}
    };
  }
  return context;
}
