import * as z from 'zod';

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must be less than 50 characters' }),
  lastName: z.string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must be less than 50 characters' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  phoneNumber: z.string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be less than 15 digits' })
    .regex(/^[0-9+\-\s()]*$/, { message: 'Please enter a valid phone number' }),
  dateOfBirth: z.string()
    .refine((date) => {
      if (!date) return false;
      
      // Check if the date is valid
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return false;
      
      // Check if the user is at least 18 years old
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      return parsedDate <= eighteenYearsAgo;
    }, { message: 'You must be at least 18 years old' }),
});

// Address Schema
export const addressSchema = z.object({
  street: z.string()
    .min(5, { message: 'Street address must be at least 5 characters' })
    .max(100, { message: 'Street address must be less than 100 characters' }),
  city: z.string()
    .min(2, { message: 'City must be at least 2 characters' })
    .max(50, { message: 'City must be less than 50 characters' }),
  state: z.string()
    .min(2, { message: 'State must be at least 2 characters' })
    .max(50, { message: 'State must be less than 50 characters' }),
  zipCode: z.string()
    .min(5, { message: 'Zip code must be at least 5 characters' })
    .max(10, { message: 'Zip code must be less than 10 characters' }),
  country: z.string()
    .min(2, { message: 'Country must be at least 2 characters' })
    .max(50, { message: 'Country must be less than 50 characters' }),
  isDefault: z.boolean().optional(),
});

// Multiple Addresses Schema
export const addressesSchema = z.array(addressSchema)
  .min(1, { message: 'At least one address is required' });

// Contact Method Schema
export const contactMethodSchema = z.object({
  type: z.enum(['email', 'phone', 'social'], {
    errorMap: () => ({ message: 'Please select a valid contact method type' }),
  }),
  value: z.string()
    .min(1, { message: 'Contact value is required' })
    .refine((val) => {
      // This is a simple check that can be extended based on the type
      return val.length > 0;
    }, { message: 'Please enter a valid value' }),
  isPrimary: z.boolean(),
  label: z.string().optional(),
});

// Multiple Contact Methods Schema
export const contactMethodsSchema = z.array(contactMethodSchema)
  .min(1, { message: 'At least one contact method is required' })
  .refine(
    (methods) => {
      // Check that there is exactly one primary contact method
      return methods.filter((method) => method.isPrimary).length === 1;
    },
    {
      message: 'Exactly one contact method must be set as primary',
    }
  );

// Account Schema
export const accountSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must be less than 20 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password must be less than 100 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean()
    .refine((val) => val === true, { message: 'You must agree to the terms and conditions' }),
  receiveNewsletters: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Export types derived from schemas
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;
export type ContactMethodFormValues = z.infer<typeof contactMethodSchema>;
export type AccountFormValues = z.infer<typeof accountSchema>;