import React, { useState } from 'react';
import { useParams, Link, useLocation } from '@/router/wouterCompat';
import {
  useGetOrderDetailsQuery,
  useSubmitReturnRequestMutation,
} from '../ordersApi';
import { ReturnReason } from '@/types/order';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ChevronsUpDown,
  ImagePlus,
  Loader2,
  Package,
  Trash2,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

// Validation schema
const returnFormSchema = z.object({
  reason: z.nativeEnum(ReturnReason, {
    errorMap: () => ({ message: 'Please select a reason for the return' }),
  }),
  description: z.string().min(10, {
    message: 'Please provide a detailed description of at least 10 characters',
  }),
  preferredRefundMethod: z.enum(['original', 'store_credit']),
  images: z.array(z.string()).optional(),
  condition: z.enum(['unopened', 'opened_unused', 'used', 'damaged']),
  returnPackaging: z.boolean().optional(),
  contactForPickup: z.boolean().optional(),
});

type ReturnFormValues = z.infer<typeof returnFormSchema>;

export default function ReturnItemForm() {
  const [, navigate] = useLocation();
  const { orderId, itemId } = useParams<{ orderId: string; itemId: string }>();
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  // Get order and item details
  const { data: orderData, isLoading: isOrderLoading } = useGetOrderDetailsQuery(orderId, {
    skip: !orderId,
  });
  
  // Find the specific item
  const orderItem = orderData?.order.items.find(item => item.id === itemId);
  
  // Submit return request mutation
  const [submitReturn, { isLoading: isSubmitting }] = useSubmitReturnRequestMutation();
  
  // Form setup
  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      reason: undefined,
      description: '',
      preferredRefundMethod: 'original',
      images: [],
      condition: 'unopened',
      returnPackaging: true,
      contactForPickup: false,
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: ReturnFormValues) => {
    try {
      // In a real app, we would upload images first and get URLs
      const imageUrls = await Promise.all(
        selectedImages.map(async (image) => {
          // Mock image upload - in a real app, this would upload to a server/cloud storage
          // and return the URL
          return URL.createObjectURL(image);
        })
      );
      
      // Submit the return request
      await submitReturn({
        orderId,
        orderItemId: itemId,
        reason: values.reason,
        description: values.description,
        images: imageUrls,
      }).unwrap();
      
      // Show success message
      toast({
        title: 'Return Request Submitted',
        description: 'Your return request has been submitted successfully. You will receive further instructions shortly.',
      });
      
      // Navigate back to order details
      navigate(`/orders/${orderId}`);
    } catch (error) {
      toast({
        title: 'Return Request Failed',
        description: 'There was an error submitting your return request. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Limit to 5 images
    if (selectedImages.length + files.length > 5) {
      toast({
        title: 'Too Many Images',
        description: 'You can upload a maximum of 5 images.',
        variant: 'destructive',
      });
      return;
    }
    
    // Create file list and preview URLs
    const newFiles = Array.from(files);
    const newUrls = newFiles.map(file => URL.createObjectURL(file));
    
    setSelectedImages(prev => [...prev, ...newFiles]);
    setImagePreviewUrls(prev => [...prev, ...newUrls]);
  };
  
  // Remove an image
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      // Revoke the URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };
  
  // Show loading state if order data is being fetched
  if (isOrderLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-full bg-muted animate-pulse"></div>
          <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
        </div>
        
        <div className="space-y-4">
          <div className="h-8 w-60 bg-muted animate-pulse rounded"></div>
          <div className="rounded-lg border h-40 p-4 space-y-4">
            <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted animate-pulse rounded"></div>
              <div className="h-3 w-3/4 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show error if item not found
  if (!orderItem) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-xl mb-2">Item Not Found</CardTitle>
            <CardDescription className="mb-4">
              The item you're looking for could not be found. Please return to your order details.
            </CardDescription>
            <Button asChild>
              <Link href={`/orders/${orderId}`}>Back to Order</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/orders/${orderId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Order
          </Link>
        </Button>
      </div>
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Return Request</h1>
        <p className="text-muted-foreground">
          Submit a return request for your item
        </p>
      </div>
      
      {/* Item to return */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Item to Return</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
              {orderItem.product.imageUrl ? (
                <img
                  src={orderItem.product.imageUrl}
                  alt={orderItem.product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{orderItem.product.name}</p>
              <p className="text-sm text-muted-foreground">
                Quantity: {orderItem.quantity} • Price: ${orderItem.unitPrice.toFixed(2)}
              </p>
              {orderItem.options && Object.keys(orderItem.options).length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {Object.entries(orderItem.options)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Return Form */}
      <Card>
        <CardHeader>
          <CardTitle>Return Details</CardTitle>
          <CardDescription>
            Please provide details about your return request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Return Reason */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Return*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Return Reasons</SelectLabel>
                          <SelectItem value={ReturnReason.DAMAGED}>
                            Damaged during shipping
                          </SelectItem>
                          <SelectItem value={ReturnReason.DEFECTIVE}>
                            Item is defective
                          </SelectItem>
                          <SelectItem value={ReturnReason.WRONG_ITEM}>
                            Received wrong item
                          </SelectItem>
                          <SelectItem value={ReturnReason.NOT_AS_DESCRIBED}>
                            Item not as described
                          </SelectItem>
                          <SelectItem value={ReturnReason.CHANGED_MIND}>
                            Changed my mind
                          </SelectItem>
                          <SelectItem value={ReturnReason.SIZE_FIT_ISSUE}>
                            Size/fit issue
                          </SelectItem>
                          <SelectItem value={ReturnReason.QUALITY_ISSUE}>
                            Quality not as expected
                          </SelectItem>
                          <SelectItem value={ReturnReason.LATE_DELIVERY}>
                            Late delivery
                          </SelectItem>
                          <SelectItem value={ReturnReason.OTHER}>
                            Other reason
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Item Condition */}
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Item Condition*</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="unopened" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Unopened in original packaging
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="opened_unused" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Opened but unused
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="used" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Used
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="damaged" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Damaged
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Detailed Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide details about your return reason..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible about why you're returning this item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Return Packaging */}
              <FormField
                control={form.control}
                name="returnPackaging"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I still have the original packaging
                      </FormLabel>
                      <FormDescription>
                        Having the original packaging makes processing returns faster.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Preferred Refund Method */}
              <FormField
                control={form.control}
                name="preferredRefundMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Preferred Refund Method*</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="original" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Refund to original payment method
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="store_credit" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Store credit (10% bonus)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Contact for Pickup */}
              <FormField
                control={form.control}
                name="contactForPickup"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I'd like to be contacted for pickup
                      </FormLabel>
                      <FormDescription>
                        We can arrange for a courier to pick up the item from your address.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Image Upload */}
              <div className="space-y-3">
                <div>
                  <Label>Images (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload up to 5 images showing the item condition or issue.
                  </p>
                </div>
                
                {/* Image preview area */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload button */}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={imagePreviewUrls.length >= 5}
                  />
                  <Label
                    htmlFor="images"
                    className={`cursor-pointer flex items-center justify-center border rounded-md p-6 w-full ${
                      imagePreviewUrls.length >= 5
                        ? 'bg-muted/50 cursor-not-allowed'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload images
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {imagePreviewUrls.length}/5 images
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href={`/orders/${orderId}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Return Request'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}