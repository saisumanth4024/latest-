import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  setProfileData,
  setActiveStep,
  selectSignupFormData 
} from './signupWizardSlice';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Validation schema for profile information
const profileSchema = z.object({
  firstName: z.string()
    .min(1, { message: 'First name is required' })
    .max(50, { message: 'First name must be less than 50 characters' }),
  lastName: z.string()
    .min(1, { message: 'Last name is required' })
    .max(50, { message: 'Last name must be less than 50 characters' }),
  displayName: z.string()
    .min(3, { message: 'Display name must be at least 3 characters' })
    .max(50, { message: 'Display name must be less than 50 characters' }),
  bio: z.string()
    .max(500, { message: 'Bio must be less than 500 characters' })
    .optional()
    .or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectSignupFormData);
  
  // Initialize form with existing data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      displayName: formData.displayName || formData.username, // Default to username if no display name set
      bio: formData.bio,
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // Dispatch profile data to Redux store
    dispatch(setProfileData({
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      bio: data.bio || '',
    }));
  };

  const goBack = () => {
    dispatch(setActiveStep('account'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <p className="text-muted-foreground">
          Tell us more about yourself
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your first name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your display name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is how other users will see you on the platform
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional: Share your interests, experience, or anything else you'd like others to know
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
            >
              Back
            </Button>
            <Button type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileStep;