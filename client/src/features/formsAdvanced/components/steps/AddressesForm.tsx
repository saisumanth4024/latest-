import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressesSchema, addressSchema, type AddressFormValues } from '../../validationSchemas';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  addAddress,
  updateAddress,
  removeAddress,
  markStepCompleted,
  selectAddresses
} from '../../store/formsAdvancedSlice';

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
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Checkbox 
} from '@/components/ui/checkbox';
import { 
  Plus, 
  Trash2, 
  Home 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddressesFormProps {
  onComplete: () => void;
}

const AddressesForm: React.FC<AddressesFormProps> = ({ onComplete }) => {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddresses);
  
  const form = useForm<{ addresses: AddressFormValues[] }>({
    resolver: zodResolver(addressesSchema.shape.addresses),
    defaultValues: {
      addresses: addresses.length > 0 ? addresses : [
        {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          isDefault: true,
        }
      ]
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const onSubmit = (data: { addresses: AddressFormValues[] }) => {
    // Update each address in the Redux store
    data.addresses.forEach((address, index) => {
      dispatch(updateAddress({ index, address }));
    });
    
    dispatch(markStepCompleted(2));
    onComplete();
  };

  const handleAddAddress = () => {
    append({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
    });
    dispatch(addAddress());
  };

  const handleRemoveAddress = (index: number) => {
    remove(index);
    dispatch(removeAddress(index));
  };

  const handleDefaultChange = (index: number, checked: boolean) => {
    // If this address is being set as default, set all others to non-default
    if (checked) {
      fields.forEach((field, i) => {
        if (i !== index) {
          form.setValue(`addresses.${i}.isDefault`, false);
        }
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Your Addresses</h3>
          <Button 
            type="button" 
            onClick={handleAddAddress}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </Button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className={cn(
              "border",
              form.watch(`addresses.${index}.isDefault`) && "border-primary"
            )}>
              <CardHeader className="py-4 px-6 flex flex-row justify-between items-center space-y-0">
                <CardTitle className="text-md font-medium flex items-center">
                  {form.watch(`addresses.${index}.isDefault`) && (
                    <Home className="w-4 h-4 mr-2 text-primary" />
                  )}
                  Address {index + 1}
                </CardTitle>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAddress(index)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove address {index + 1}</span>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="py-4 px-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name={`addresses.${index}.street`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.city`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.state`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.zipCode`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip/Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.country`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`addresses.${index}.isDefault`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              handleDefaultChange(index, checked as boolean);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Set as default address
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">Save and Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddressesForm;