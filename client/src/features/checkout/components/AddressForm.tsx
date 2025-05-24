import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { MapPin, Loader2 } from 'lucide-react';
import { Address } from '@/types/cart';
import {
  setBillingAddress,
  setShippingAddress,
  toggleSameAddress,
  setActiveStep,
  selectBillingAddress,
  selectShippingAddress,
  selectSameAddress,
} from '../checkoutSlice';
import { CheckoutStep } from '@/types/checkout';

// Countries options (simplified for demo)
const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
];

// States options (US only, simplified for demo)
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  // Add more as needed
];

// Address validation schema
const addressSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  company: z.string().optional(),
  address1: z.string().min(1, { message: 'Address is required' }),
  address2: z.string().optional(),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State/Province is required' }),
  postcode: z.string().min(1, { message: 'ZIP/Postal code is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  phone: z.string().min(10, { message: 'Phone number is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  isDefault: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function AddressForm() {
  const dispatch = useDispatch();
  const billingAddress = useSelector(selectBillingAddress);
  const shippingAddress = useSelector(selectShippingAddress);
  const sameAddress = useSelector(selectSameAddress);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [addressType, setAddressType] = useState<'billing' | 'shipping'>('billing');

  // Setup form
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: billingAddress?.firstName || '',
      lastName: billingAddress?.lastName || '',
      company: billingAddress?.company || '',
      address1: billingAddress?.address1 || '',
      address2: billingAddress?.address2 || '',
      city: billingAddress?.city || '',
      state: billingAddress?.state || '',
      postcode: billingAddress?.postcode || '',
      country: billingAddress?.country || 'US',
      phone: billingAddress?.phone || '',
      email: billingAddress?.email || '',
      isDefault: billingAddress?.isDefault || false,
    },
  });

  // When billing address changes, update form for billing
  useEffect(() => {
    if (billingAddress && addressType === 'billing') {
      form.reset({
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        company: billingAddress.company || '',
        address1: billingAddress.address1,
        address2: billingAddress.address2 || '',
        city: billingAddress.city,
        state: billingAddress.state,
        postcode: billingAddress.postcode,
        country: billingAddress.country,
        phone: billingAddress.phone || '',
        email: billingAddress.email || '',
        isDefault: billingAddress.isDefault || false,
      });
    }
  }, [billingAddress, addressType, form]);

  // When shipping address changes, update form for shipping
  useEffect(() => {
    if (shippingAddress && addressType === 'shipping') {
      form.reset({
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        company: shippingAddress.company || '',
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        postcode: shippingAddress.postcode,
        country: shippingAddress.country,
        phone: shippingAddress.phone || '',
        email: shippingAddress.email || '',
        isDefault: shippingAddress.isDefault || false,
      });
    }
  }, [shippingAddress, addressType, form]);

  // Handle address type change
  const handleAddressTypeChange = (value: 'billing' | 'shipping') => {
    setAddressType(value);
    
    // Update form values based on the selected address type
    if (value === 'billing' && billingAddress) {
      form.reset({
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        company: billingAddress.company || '',
        address1: billingAddress.address1,
        address2: billingAddress.address2 || '',
        city: billingAddress.city,
        state: billingAddress.state,
        postcode: billingAddress.postcode,
        country: billingAddress.country,
        phone: billingAddress.phone || '',
        email: billingAddress.email || '',
        isDefault: billingAddress.isDefault || false,
      });
    } else if (value === 'shipping' && shippingAddress) {
      form.reset({
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        company: shippingAddress.company || '',
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        postcode: shippingAddress.postcode,
        country: shippingAddress.country,
        phone: shippingAddress.phone || '',
        email: shippingAddress.email || '',
        isDefault: shippingAddress.isDefault || false,
      });
    }
  };

  // Handle same address toggle
  const handleSameAddressToggle = (checked: boolean) => {
    dispatch(toggleSameAddress(checked));
  };

  // Auto-fill address (simulated for demo)
  const handleAutoFill = async () => {
    setIsAutoFilling(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data from "geolocation" service
    form.setValue('address1', '123 Main Street');
    form.setValue('city', 'New York');
    form.setValue('state', 'NY');
    form.setValue('postcode', '10001');
    form.setValue('country', 'US');
    
    setIsAutoFilling(false);
  };

  // Form submission
  const onSubmit = (values: AddressFormValues) => {
    const addressData: Address = {
      ...values,
    };
    
    if (addressType === 'billing') {
      dispatch(setBillingAddress(addressData));
      
      // If same address is checked, also set as shipping address
      if (sameAddress) {
        dispatch(setShippingAddress(addressData));
        // Move to delivery step
        dispatch(setActiveStep(CheckoutStep.DELIVERY));
      } else if (!shippingAddress) {
        // If shipping address not filled, switch to shipping form
        setAddressType('shipping');
      } else {
        // Both addresses filled, move to delivery step
        dispatch(setActiveStep(CheckoutStep.DELIVERY));
      }
    } else {
      // Shipping address
      dispatch(setShippingAddress(addressData));
      // Move to delivery step
      dispatch(setActiveStep(CheckoutStep.DELIVERY));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Delivery Information</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Address Type Tabs */}
        <RadioGroup
          value={addressType}
          onValueChange={(value) => handleAddressTypeChange(value as 'billing' | 'shipping')}
          className="flex flex-col space-y-1 mb-6 sm:flex-row sm:space-y-0 sm:space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="billing" id="billing" />
            <FormLabel htmlFor="billing" className="font-medium cursor-pointer">
              Billing Address
            </FormLabel>
          </div>
          {!sameAddress && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shipping" id="shipping" />
              <FormLabel htmlFor="shipping" className="font-medium cursor-pointer">
                Shipping Address
              </FormLabel>
            </div>
          )}
        </RadioGroup>

        {/* Same Address Checkbox */}
        <div className="flex items-center space-x-2 mb-6">
          <Checkbox
            id="same-address"
            checked={sameAddress}
            onCheckedChange={handleSameAddressToggle}
          />
          <label
            htmlFor="same-address"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Shipping address same as billing
          </label>
        </div>

        {/* Auto-fill Button */}
        <Button
          variant="outline"
          className="w-full sm:w-auto mb-6"
          onClick={handleAutoFill}
          disabled={isAutoFilling}
        >
          {isAutoFilling ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="mr-2 h-4 w-4" />
          )}
          Auto-fill with current location
        </Button>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Company (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Line 1 */}
              <FormField
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Address Line 1 *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Line 2 */}
              <FormField
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Apartment, suite, unit, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State/Province */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province *</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="" disabled>
                          Select a state
                        </option>
                        {US_STATES.map((state) => (
                          <option key={state.value} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ZIP/Postal Code */}
              <FormField
                control={form.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP/Postal Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="" disabled>
                          Select a country
                        </option>
                        {COUNTRIES.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="sm:col-span-2 my-2" />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Save as Default */}
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 sm:col-span-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Save this address for future orders</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="flex justify-between px-0">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Continue to Delivery</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}