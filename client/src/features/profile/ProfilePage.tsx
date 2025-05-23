import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectUser, fetchUserProfile } from './profileSlice';
import { UserProfile, UserRole } from '@/types';
import ProfileForm from './ProfileForm';
import AvatarUploader from './AvatarUploader';
import UserSettings from './UserSettings';
import SecuritySettings from './SecuritySettings';
import SocialAccounts from './SocialAccounts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock data for example purposes - in a real app these would be from the API
  const [mockUser] = useState<UserProfile>({
    id: '12345',
    username: 'johndoe',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    role: UserRole.USER,
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    initials: 'JD',
    permissions: ['read:profile', 'write:profile', 'read:dashboard'],
    createdAt: '2023-01-15T08:30:00Z',
    lastLoginAt: '2023-06-20T14:22:10Z'
  });
  
  // Fetch user profile
  useEffect(() => {
    if (!user) {
      // For demo purposes - in a real app we'd fetch from API
      dispatch(fetchUserProfile(mockUser.id));
    }
  }, [dispatch, user, mockUser.id]);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Account & Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your profile, preferences, security, and connected accounts.
        </p>
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
        </TabsList>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <TabsContent value="profile" className="space-y-8">
            {/* Avatar */}
            <AvatarUploader />
            
            {/* Divider */}
            <hr className="border-gray-200 dark:border-gray-700" />
            
            {/* Profile Form */}
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="settings">
            <UserSettings />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="accounts">
            <SocialAccounts />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}