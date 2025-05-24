import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactMethodsSchema, type ContactMethodFormValues } from '../../validationSchemas';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  addContactMethod,
  updateContactMethod,
  removeContactMethod,
  markStepCompleted,
  selectContactMethods
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
  CardContent
} from '@/components/ui/card';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Trash2,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactMethodsFormProps {
  onComplete: () => void;
}

const ContactMethodsForm: React.FC<ContactMethodsFormProps> = ({ onComplete }) => {
  const dispatch = useAppDispatch();
  const contactMethods = useAppSelector(selectContactMethods);
  
  const form = useForm<{ contactMethods: ContactMethodFormValues[] }>({
    resolver: zodResolver(contactMethodsSchema.shape.contactMethods),
    defaultValues: {
      contactMethods: contactMethods.length > 0 ? contactMethods : [
        {
          type: 'email',
          value: '',
          isPrimary: true,
          label: 'Primary Email',
        }
      ]
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contactMethods",
  });

  const onSubmit = (data: { contactMethods: ContactMethodFormValues[] }) => {
    // Update each contact method in the Redux store
    data.contactMethods.forEach((method, index) => {
      dispatch(updateContactMethod({ index, method }));
    });
    
    dispatch(markStepCompleted(3));
    onComplete();
  };

  const handleAddContactMethod = (type: 'email' | 'phone' | 'social') => {
    append({
      type,
      value: '',
      isPrimary: false,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
    });
    dispatch(addContactMethod({ type }));
  };

  const handleRemoveContactMethod = (index: number) => {
    remove(index);
    dispatch(removeContactMethod(index));
  };

  const handlePrimaryChange = (index: number) => {
    // Set all contact methods to non-primary
    fields.forEach((_, i) => {
      form.setValue(`contactMethods.${i}.isPrimary`, i === index);
    });
    
    // Update the form values to reflect the changes
    form.trigger();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Your Contact Methods</h3>
          <div className="flex gap-2">
            <Button 
              type="button" 
              onClick={() => handleAddContactMethod('email')}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Email
            </Button>
            <Button 
              type="button" 
              onClick={() => handleAddContactMethod('phone')}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Phone
            </Button>
            <Button 
              type="button" 
              onClick={() => handleAddContactMethod('social')}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Social
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className={cn(
              "border",
              form.watch(`contactMethods.${index}.isPrimary`) && "border-primary"
            )}>
              <CardHeader className="py-4 px-6 flex flex-row justify-between items-center space-y-0">
                <CardTitle className="text-md font-medium flex items-center">
                  {form.watch(`contactMethods.${index}.isPrimary`) && (
                    <Star className="w-4 h-4 mr-2 text-primary fill-primary" />
                  )}
                  Contact {index + 1}
                </CardTitle>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveContactMethod(index)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove contact method {index + 1}</span>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="py-4 px-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name={`contactMethods.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select contact type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="social">Social Media</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`contactMethods.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.watch(`contactMethods.${index}.type`) === 'email' && 'Email Address'}
                          {form.watch(`contactMethods.${index}.type`) === 'phone' && 'Phone Number'}
                          {form.watch(`contactMethods.${index}.type`) === 'social' && 'Social Media Handle'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={
                              form.watch(`contactMethods.${index}.type`) === 'email' 
                                ? 'john.doe@example.com' 
                                : form.watch(`contactMethods.${index}.type`) === 'phone'
                                  ? '+1 (555) 123-4567'
                                  : '@johndoe'
                            } 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`contactMethods.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Work Email, Personal Phone" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`contactMethods.${index}.isPrimary`}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Primary Contact?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              if (value === 'true') {
                                handlePrimaryChange(index);
                              }
                            }}
                            value={field.value ? 'true' : 'false'}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="true" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="false" disabled={fields.length === 1} />
                              </FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
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

export default ContactMethodsForm;