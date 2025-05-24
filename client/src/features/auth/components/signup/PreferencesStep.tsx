import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  setPreferencesData,
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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Validation schema for preferences
const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  privacySettings: z.object({
    profileVisibility: z.enum(['public', 'private', 'connections']),
    showActivity: z.boolean(),
  }),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const PreferencesStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectSignupFormData);
  
  // Initialize form with existing data
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: formData.theme,
      emailNotifications: formData.emailNotifications,
      marketingEmails: formData.marketingEmails,
      privacySettings: {
        profileVisibility: formData.privacySettings.profileVisibility,
        showActivity: formData.privacySettings.showActivity,
      },
    },
  });

  const onSubmit = (data: PreferencesFormValues) => {
    // Dispatch preferences data to Redux store
    dispatch(setPreferencesData({
      theme: data.theme,
      emailNotifications: data.emailNotifications,
      marketingEmails: data.marketingEmails,
      privacySettings: {
        profileVisibility: data.privacySettings.profileVisibility,
        showActivity: data.privacySettings.showActivity,
      },
    }));
  };

  const goBack = () => {
    dispatch(setActiveStep('profile'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Preferences</h2>
        <p className="text-muted-foreground">
          Customize your experience
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme Preference</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose how the application looks
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacySettings.profileVisibility"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Profile Visibility</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="public" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Public - Everyone can see your profile
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="connections" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Connections - Only people you connect with can see your profile
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="private" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Private - Only you can see your profile
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Email Notifications
                    </FormLabel>
                    <FormDescription>
                      Receive notifications about activity related to your account
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingEmails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Marketing Emails
                    </FormLabel>
                    <FormDescription>
                      Receive emails about new features and promotions
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privacySettings.showActivity"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Activity Visibility
                    </FormLabel>
                    <FormDescription>
                      Allow others to see your activity on the platform
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

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

export default PreferencesStep;