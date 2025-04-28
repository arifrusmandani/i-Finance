import { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  geminiApiKey: string;
  profilePicture: string;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
}

const defaultProfile: ProfileData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  geminiApiKey: '',
  profilePicture: ''
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(() => {
    // Try to load profile from localStorage
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  const updateProfile = (data: Partial<ProfileData>) => {
    const newProfile = { ...profile, ...data };
    setProfile(newProfile);
    // Save to localStorage
    localStorage.setItem('profile', JSON.stringify(newProfile));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
} 