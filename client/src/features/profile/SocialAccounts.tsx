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
  const { toast } = useToast();

  // Handles connecting a social account
  const handleConnect = (provider: string) => {
    if (isConnected(provider)) {
      toast({
        title: "Account already connected",
        description: `Your ${providerNames[provider]} account is already connected.`,
        variant: "warning",
      });
      return;
    }

    // In a real app, this would trigger an OAuth flow
    dispatch(connectSocialAccount({
      provider,
      profileUrl: `https://${provider}.com/user123`,
      username: `user123_${provider}`,
      connected: true,
      connectedAt: new Date().toISOString()
    }));

    toast({
      title: "Account connected",
      description: `Your ${providerNames[provider]} account has been connected successfully.`,
      variant: "success",
    });
  };

  // Handles disconnecting a social account
  const handleDisconnect = (provider: string) => {
    if (!isConnected(provider)) {
      toast({
        title: "No account connected",
        description: `No ${providerNames[provider]} account is currently connected.`,
        variant: "warning",
      });
      return;
    }

    dispatch(disconnectSocialAccount(provider));

    toast({
      title: "Account disconnected",
      description: `Your ${providerNames[provider]} account has been disconnected.`,
      variant: "success",
    });
  };

  // Check if provider is connected
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Connected Accounts</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Connect your accounts to enable single sign-on and share content between platforms.
        </p>
      </div>

      <div className="space-y-4">
        {Object.keys(providerNames).map(provider => (
          <div key={provider} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                {getProviderIcon(provider)}
              </div>
              <div>
                <p className="font-medium">{providerNames[provider]}</p>
                {isConnected(provider) ? (
                  <p className="text-xs text-green-600 dark:text-green-400">Connected</p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Not connected</p>
                )}
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
                variant="outline" 
                size="sm"
                onClick={() => handleConnect(provider)}
              >
                Connect
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium mb-2">What happens when you connect an account?</h4>
        <ul className="list-disc pl-5 text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <li>You can sign in using your connected account</li>
          <li>We will never post to your accounts without your permission</li>
          <li>Your account details are securely stored and encrypted</li>
          <li>You can disconnect your accounts at any time</li>
        </ul>
      </div>
    </div>
  );
}