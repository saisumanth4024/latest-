import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  selectUser, 
  selectIsEditingProfile, 
  selectProfileFormErrors,
  selectProfileLoading,
  toggleEditProfile,
  updateUserProfile,
  setProfileFormErrors,
  clearProfileFormErrors
} from './profileSlice';
import { 
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui';
import { validator } from '@/utils';
import { useToast } from '@/hooks/useToast';

// Profile form validation schema
const profileSchema = z.object({
  username: validator.CommonSchemas.username.optional(),
  email: validator.CommonSchemas.email.optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  fullName: z.string().optional(),
  locale: z.string().optional(),
  timezone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isEditing = useAppSelector(selectIsEditingProfile);
  const formErrors = useAppSelector(selectProfileFormErrors);
  const isLoading = useAppSelector(selectProfileLoading);
  const toast = useToast();
  
  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      fullName: user?.fullName || '',
      locale: user?.locale || 'en',
      timezone: user?.timezone || 'UTC',
    },
  });
  
  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        fullName: user.fullName || '',
        locale: user.locale || 'en',
        timezone: user.timezone || 'UTC',
      });
    }
  }, [user, form.reset]);
  
  // Update form errors from Redux state
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      Object.entries(formErrors).forEach(([key, message]) => {
        form.setError(key as any, {
          type: 'manual',
          message,
        });
      });
    }
  }, [formErrors, form.setError]);
  
  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      dispatch(clearProfileFormErrors());
      
      // Generate full name if not provided
      if (!values.fullName && values.firstName && values.lastName) {
        values.fullName = `${values.firstName} ${values.lastName}`;
      }
      
      // Update user profile
      const resultAction = await dispatch(updateUserProfile(values));
      
      if (updateUserProfile.fulfilled.match(resultAction)) {
        toast.success({
          title: 'Profile Updated',
          description: 'Your profile information has been updated successfully.'
        });
      } else {
        toast.error({
          title: 'Update Failed',
          description: resultAction.payload as string || 'Failed to update profile'
        });
        
        // Set specific form errors if available
        if (typeof resultAction.payload === 'object' && resultAction.payload !== null) {
          dispatch(setProfileFormErrors(resultAction.payload as Record<string, string>));
        }
      }
    } catch (error: any) {
      toast.error({
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred'
      });
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    dispatch(toggleEditProfile());
    dispatch(clearProfileFormErrors());
    
    // Reset form to original values
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        fullName: user.fullName || '',
        locale: user.locale || 'en',
        timezone: user.timezone || 'UTC',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {isEditing ? 'Edit Profile Information' : 'Profile Information'}
        </h3>
        
        {!isEditing && (
          <Button 
            variant="outline" 
            onClick={() => dispatch(toggleEditProfile())}
          >
            Edit Profile
          </Button>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={!isEditing || isLoading} 
                    placeholder="Username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    disabled={!isEditing || isLoading} 
                    placeholder="Email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* First Name Field */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={!isEditing || isLoading} 
                    placeholder="First Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Last Name Field */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={!isEditing || isLoading} 
                    placeholder="Last Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Locale Field */}
          <FormField
            control={form.control}
            name="locale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={!isEditing || isLoading}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Timezone Field */}
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={!isEditing || isLoading}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    <option value="Europe/Paris">Central European Time (CET)</option>
                    <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {isEditing && (
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}