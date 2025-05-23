import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  
  if (!user) {
    return <div>Loading profile...</div>;
  }
  
  // Create user initials for avatar fallback
  const getInitials = () => {
    return user.initials || 
      (user.username ? user.username.substring(0, 2).toUpperCase() : 'U');
  };
  
  // Get role name for display
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.SELLER:
        return 'Seller';
      case UserRole.USER:
        return 'User';
      default:
        return 'Guest';
    }
  };
  
  // Get role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case UserRole.SELLER:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case UserRole.USER:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">{user.username}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <Badge className={`mt-2 ${getRoleBadgeColor(user.role)}`}>
              {getRoleName(user.role)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                <p>{user.fullName || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</h3>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => logout()}
            >
              Sign Out
            </Button>
          </CardFooter>
        </Card>
        
        {/* Account Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your profile and account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                <p>{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {user.emailVerified 
                    ? 'Your email has been verified.'
                    : 'Please verify your email address.'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Security</h3>
                <div className="mt-2 space-y-2">
                  <Button variant="outline" size="sm">Change Password</Button>
                  <Button variant="outline" size="sm" className="ml-2">Two-Factor Authentication</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Login Sessions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage your active login sessions across devices
                </p>
                <div className="mt-2">
                  <Button variant="outline" size="sm">Manage Sessions</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Preferences</h3>
                <div className="mt-2 space-y-2">
                  <Button variant="outline" size="sm">Notification Settings</Button>
                  <Button variant="outline" size="sm" className="ml-2">Privacy Settings</Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="default">Save Changes</Button>
            <Button variant="destructive">Delete Account</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}