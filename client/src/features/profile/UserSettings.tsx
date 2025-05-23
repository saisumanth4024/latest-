import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectUserSettings,
  updateUserSettings,
  updateNestedSettings,
  initializeFromStorage
} from './profileSlice';
import { Switch } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

export default function UserSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectUserSettings);
  const toast = useToast();
  
  // Load user settings from localStorage on component mount
  useEffect(() => {
    dispatch(initializeFromStorage());
  }, [dispatch]);
  
  // Handle theme selection
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    dispatch(updateUserSettings({ theme }));
    
    toast.success({
      title: 'Theme Updated',
      description: `Theme has been changed to ${theme}.`
    });
  };
  
  // Handle language selection
  const handleLanguageChange = (language: string) => {
    dispatch(updateUserSettings({ language }));
    
    toast.success({
      title: 'Language Updated',
      description: `Language has been changed to ${language}.`
    });
  };
  
  // Handle notification settings changes
  const handleNotificationChange = (key: string, value: boolean) => {
    dispatch(updateNestedSettings({
      category: 'notifications',
      settings: { [key]: value }
    }));
  };
  
  // Handle accessibility settings changes
  const handleAccessibilityChange = (key: string, value: boolean) => {
    dispatch(updateNestedSettings({
      category: 'accessibility',
      settings: { [key]: value }
    }));
  };
  
  // Handle privacy settings changes
  const handlePrivacyChange = (key: string, value: string) => {
    dispatch(updateNestedSettings({
      category: 'privacy',
      settings: { [key]: value }
    }));
  };
  
  return (
    <div className="space-y-8">
      {/* Theme Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Theme Settings</h3>
        <div className="grid grid-cols-3 gap-4">
          <div 
            className={`p-4 rounded-md border cursor-pointer transition-colors ${
              settings.theme === 'light' 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => handleThemeChange('light')}
          >
            <div className="h-12 w-12 rounded-full bg-white border border-gray-200 mx-auto mb-2"></div>
            <p className="text-sm text-center font-medium">Light</p>
          </div>
          
          <div 
            className={`p-4 rounded-md border cursor-pointer transition-colors ${
              settings.theme === 'dark' 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => handleThemeChange('dark')}
          >
            <div className="h-12 w-12 rounded-full bg-gray-800 border border-gray-700 mx-auto mb-2"></div>
            <p className="text-sm text-center font-medium">Dark</p>
          </div>
          
          <div 
            className={`p-4 rounded-md border cursor-pointer transition-colors ${
              settings.theme === 'system' 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => handleThemeChange('system')}
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-800 mx-auto mb-2"></div>
            <p className="text-sm text-center font-medium">System</p>
          </div>
        </div>
      </div>
      
      {/* Language Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Language</h3>
        <select
          value={settings.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
        </select>
      </div>
      
      {/* Notification Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) => handleNotificationChange('email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Receive push notifications on your devices</p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked) => handleNotificationChange('push', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">In-App Notifications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Show notifications inside the application</p>
            </div>
            <Switch
              checked={settings.notifications.inApp}
              onCheckedChange={(checked) => handleNotificationChange('inApp', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Marketing Emails</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Receive marketing and promotional emails</p>
            </div>
            <Switch
              checked={settings.notifications.marketing}
              onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
            />
          </div>
        </div>
      </div>
      
      {/* Accessibility Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Accessibility</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Reduce Motion</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={settings.accessibility.reduceMotion}
              onCheckedChange={(checked) => handleAccessibilityChange('reduceMotion', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">High Contrast</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Enhance visual contrast for better readability</p>
            </div>
            <Switch
              checked={settings.accessibility.highContrast}
              onCheckedChange={(checked) => handleAccessibilityChange('highContrast', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Large Text</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Increase default text size throughout the app</p>
            </div>
            <Switch
              checked={settings.accessibility.largeText}
              onCheckedChange={(checked) => handleAccessibilityChange('largeText', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Screen Reader Optimization</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Optimize application for screen readers</p>
            </div>
            <Switch
              checked={settings.accessibility.screenReader}
              onCheckedChange={(checked) => handleAccessibilityChange('screenReader', checked)}
            />
          </div>
        </div>
      </div>
      
      {/* Privacy Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Privacy Settings</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Profile Visibility</p>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="public">Public - Anyone can view your profile</option>
              <option value="private">Private - Only you can view your profile</option>
              <option value="contacts">Contacts - Only your contacts can view your profile</option>
            </select>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Activity Visibility</p>
            <select
              value={settings.privacy.activityVisibility}
              onChange={(e) => handlePrivacyChange('activityVisibility', e.target.value)}
              className="w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="public">Public - Anyone can see your activity</option>
              <option value="private">Private - Only you can see your activity</option>
              <option value="contacts">Contacts - Only your contacts can see your activity</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}