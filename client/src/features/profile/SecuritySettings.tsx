import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  select2FAStatus, 
  selectSessions,
  toggleDemo2FA,
  terminateSession,
  enable2FAMethod,
  disable2FAMethod
} from './profileSlice';
import { Button, Switch } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { formatTimeAgo } from '@/lib/utils';

export default function SecuritySettings() {
  const dispatch = useAppDispatch();
  const twoFactorAuth = useAppSelector(select2FAStatus);
  const sessions = useAppSelector(selectSessions);
  const toast = useToast();
  
  // State for the 2FA setup modal
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'sms' | 'email' | null>(null);
  
  // Toggle 2FA
  const handleToggle2FA = (enabled: boolean) => {
    dispatch(toggleDemo2FA(enabled));
    
    if (enabled) {
      toast.success({
        title: '2FA Enabled',
        description: 'Two-factor authentication has been enabled for your account.'
      });
    } else {
      toast.info({
        title: '2FA Disabled',
        description: 'Two-factor authentication has been disabled for your account.'
      });
    }
  };
  
  // Setup 2FA method
  const handleSetup2FA = (method: 'totp' | 'sms' | 'email') => {
    setSelectedMethod(method);
    setSetupModalOpen(true);
  };
  
  // Enable 2FA method (demo implementation)
  const handleEnable2FAMethod = async (method: 'totp' | 'sms' | 'email') => {
    try {
      // In a real app, this would call the API with verification codes, etc.
      // For demo purposes, we're just dispatching the action
      await dispatch(enable2FAMethod({ 
        userId: '123', // Demo user ID
        method 
      }));
      
      toast.success({
        title: `${method.toUpperCase()} Enabled`,
        description: `${method.toUpperCase()} authentication has been enabled for your account.`
      });
      
      setSetupModalOpen(false);
    } catch (error: any) {
      toast.error({
        title: 'Setup Failed',
        description: error.message || `Failed to set up ${method.toUpperCase()} authentication`
      });
    }
  };
  
  // Disable 2FA method
  const handleDisable2FAMethod = async (method: 'totp' | 'sms' | 'email') => {
    try {
      // In a real app, this would call the API
      await dispatch(disable2FAMethod({ 
        userId: '123', // Demo user ID
        method 
      }));
      
      toast.info({
        title: `${method.toUpperCase()} Disabled`,
        description: `${method.toUpperCase()} authentication has been disabled for your account.`
      });
    } catch (error: any) {
      toast.error({
        title: 'Action Failed',
        description: error.message || `Failed to disable ${method.toUpperCase()} authentication`
      });
    }
  };
  
  // Terminate session
  const handleTerminateSession = async (sessionId: string) => {
    try {
      await dispatch(terminateSession({ 
        userId: '123', // Demo user ID
        sessionId 
      }));
      
      toast.success({
        title: 'Session Terminated',
        description: 'The selected session has been terminated successfully.'
      });
    } catch (error: any) {
      toast.error({
        title: 'Action Failed',
        description: error.message || 'Failed to terminate session'
      });
    }
  };
  
  // Generate recovery keys
  const handleGenerateRecoveryKeys = () => {
    // Demo implementation - in a real app, this would call the API
    dispatch(enable2FAMethod({ 
      userId: '123', // Demo user ID
      method: 'recoveryKeys'
    }));
    
    toast.success({
      title: 'Recovery Keys Generated',
      description: 'New recovery keys have been generated. Please save them in a secure location.'
    });
  };
  
  return (
    <div className="space-y-8">
      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch
            checked={twoFactorAuth.enabled}
            onCheckedChange={handleToggle2FA}
          />
        </div>
        
        {twoFactorAuth.enabled && (
          <div className="space-y-4 pt-4">
            {/* Primary Method */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium mb-2">Primary Method</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {twoFactorAuth.primary 
                  ? `Your primary 2FA method is ${twoFactorAuth.primary.toUpperCase()}`
                  : 'You have not set a primary 2FA method yet.'}
              </p>
              
              {/* Method Selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Authenticator App */}
                <div className={`p-4 rounded-md border transition-colors ${
                  twoFactorAuth.methods.totp.enabled 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <h5 className="text-sm font-medium mb-1">Authenticator App</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Use an app like Google Authenticator or Authy
                  </p>
                  
                  {twoFactorAuth.methods.totp.enabled ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDisable2FAMethod('totp')}
                    >
                      Disable
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleSetup2FA('totp')}
                    >
                      Set Up
                    </Button>
                  )}
                </div>
                
                {/* SMS Authentication */}
                <div className={`p-4 rounded-md border transition-colors ${
                  twoFactorAuth.methods.sms.enabled 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <h5 className="text-sm font-medium mb-1">SMS Authentication</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Receive codes via text message
                  </p>
                  
                  {twoFactorAuth.methods.sms.enabled ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDisable2FAMethod('sms')}
                    >
                      Disable
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleSetup2FA('sms')}
                    >
                      Set Up
                    </Button>
                  )}
                </div>
                
                {/* Email Authentication */}
                <div className={`p-4 rounded-md border transition-colors ${
                  twoFactorAuth.methods.email.enabled 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <h5 className="text-sm font-medium mb-1">Email Authentication</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Receive codes via email
                  </p>
                  
                  {twoFactorAuth.methods.email.enabled ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDisable2FAMethod('email')}
                    >
                      Disable
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleSetup2FA('email')}
                    >
                      Set Up
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Recovery Keys */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Recovery Keys</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  twoFactorAuth.methods.recoveryKeys.enabled
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                }`}>
                  {twoFactorAuth.methods.recoveryKeys.enabled 
                    ? `${twoFactorAuth.methods.recoveryKeys.remaining} remaining` 
                    : 'Not generated'}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Recovery keys can be used to access your account if you lose access to your other 2FA methods.
              </p>
              
              <Button
                variant={twoFactorAuth.methods.recoveryKeys.enabled ? "outline" : "default"}
                onClick={handleGenerateRecoveryKeys}
                className="w-full"
              >
                {twoFactorAuth.methods.recoveryKeys.enabled ? 'Regenerate Recovery Keys' : 'Generate Recovery Keys'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Active Sessions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Active Sessions</h3>
        <div className="space-y-2">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.id} className="p-4 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{session.device}</span>
                    {session.isCurrent && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.browser} on {session.os} • {session.ip}
                    {session.location && ` • ${session.location}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last active {formatTimeAgo(new Date(session.lastActive))}
                  </p>
                </div>
                
                {!session.isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTerminateSession(session.id)}
                  >
                    Terminate
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No active sessions found.
            </p>
          )}
        </div>
      </div>
      
      {/* Demo data */}
      {sessions.length === 0 && (
        <div className="border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 p-4 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            This is a demo. In a real application, you would see your active sessions here.
          </p>
        </div>
      )}
      
      {/* Password Change */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Password</h3>
        <Button>Change Password</Button>
      </div>
      
      {/* Danger Zone */}
      <div className="space-y-4 rounded-md border border-red-200 dark:border-red-900/30 p-4">
        <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Actions here are irreversible. Please proceed with caution.
        </p>
        
        <div className="space-y-2">
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30">
            Delete All Data
          </Button>
          
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}