import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectSocialAccounts,
  connectSocialAccount,
  disconnectSocialAccount
} from './profileSlice';
import { Button } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { SiGoogle, SiGithub, SiFacebook, SiLinkedin } from 'react-icons/si';
import { FaTwitter } from 'react-icons/fa';

export default function SocialAccounts() {
  const dispatch = useAppDispatch();
  const socialAccounts = useAppSelector(selectSocialAccounts);
  const toast = useToast();
  
  // Handle connecting a social account
  const handleConnect = async (provider: string) => {
    try {
      // In a real app, this would redirect to OAuth flow
      // For demo purposes, we're just dispatching the action with a mock code
      await dispatch(connectSocialAccount({
        userId: '123', // Demo user ID
        provider,
        code: 'mock-auth-code'
      }));
      
      toast.success({
        title: 'Account Connected',
        description: `Your ${provider} account has been connected successfully.`
      });
    } catch (error: any) {
      toast.error({
        title: 'Connection Failed',
        description: error.message || `Failed to connect ${provider} account`
      });
    }
  };
  
  // Handle disconnecting a social account
  const handleDisconnect = async (provider: string) => {
    try {
      await dispatch(disconnectSocialAccount({
        userId: '123', // Demo user ID
        provider
      }));
      
      toast.info({
        title: 'Account Disconnected',
        description: `Your ${provider} account has been disconnected.`
      });
    } catch (error: any) {
      toast.error({
        title: 'Disconnection Failed',
        description: error.message || `Failed to disconnect ${provider} account`
      });
    }
  };
  
  // Get account status
  const isConnected = (provider: string) => {
    return socialAccounts.some(account => account.provider === provider && account.connected);
  };
  
  // Get provider icon
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <SiGoogle className="h-5 w-5" />;
      case 'github':
        return <SiGithub className="h-5 w-5" />;
      case 'facebook':
        return <SiFacebook className="h-5 w-5" />;
      case 'twitter':
        return <FaTwitter className="h-5 w-5" />;
      case 'linkedin':
        return <SiLinkedin className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  // Provider display names
  const providerNames: Record<string, string> = {
    google: 'Google',
    github: 'GitHub',
    facebook: 'Facebook',
    twitter: 'Twitter',
    linkedin: 'LinkedIn'
  };
  
  // List of providers to display
  const providers = ['google', 'github', 'facebook', 'twitter', 'linkedin'];
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Connected Accounts</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Connect your social accounts to enable single sign-on and access additional features.
        </p>
      </div>
      
      <div className="space-y-4">
        {providers.map((provider) => (
          <div 
            key={provider}
            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-md"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 h-10 w-10 rounded-md">
                {getProviderIcon(provider)}
              </div>
              <div>
                <h4 className="text-sm font-medium">{providerNames[provider]}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isConnected(provider)
                    ? `Connected to ${providerNames[provider]}`
                    : `Not connected to ${providerNames[provider]}`
                  }
                </p>
              </div>
            </div>
            
            {isConnected(provider) ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDisconnect(provider)}
              >
                Disconnect
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => handleConnect(provider)}
              >
                Connect
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-2">
        <h4 className="text-sm font-medium">Benefits of Connecting Accounts</h4>
        <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc list-inside space-y-1">
          <li>Sign in with a single click using your connected accounts</li>
          <li>Share content directly to your social media profiles</li>
          <li>Import your contacts and connections</li>
          <li>Access platform-specific features and integrations</li>
        </ul>
      </div>
    </div>
  );
}