import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Truck, ArrowLeft, Loader2 } from 'lucide-react';
import {
  fetchDeliverySlots,
  setSelectedDeliverySlot,
  setActiveStep,
  selectDeliverySlots,
  selectSelectedDeliverySlot,
  selectCheckoutError,
} from '../checkoutSlice';
import { CheckoutStep } from '@/types/checkout';
import { formatCurrency } from '@/lib/utils';

export default function DeliverySelection() {
  const dispatch = useDispatch();
  const deliverySlots = useSelector(selectDeliverySlots);
  const selectedSlot = useSelector(selectSelectedDeliverySlot);
  const error = useSelector(selectCheckoutError);
  
  // Fetch delivery slots when component mounts
  useEffect(() => {
    if (deliverySlots.length === 0) {
      dispatch(fetchDeliverySlots());
    }
  }, [dispatch, deliverySlots.length]);
  
  // Group slots by date for better organization
  const slotsByDate = deliverySlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, typeof deliverySlots>);
  
  // Handle slot selection
  const handleSlotSelect = (slotId: string) => {
    const selectedSlot = deliverySlots.find(slot => slot.id === slotId);
    if (selectedSlot) {
      dispatch(setSelectedDeliverySlot(selectedSlot));
    }
  };
  
  // Handle continue to payment
  const handleContinue = () => {
    if (selectedSlot) {
      dispatch(setActiveStep(CheckoutStep.PAYMENT));
    }
  };
  
  // Handle back to address
  const handleBack = () => {
    dispatch(setActiveStep(CheckoutStep.ADDRESS));
  };
  
  // Loading state
  if (deliverySlots.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Delivery Options</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Loading delivery options...</p>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Delivery Options</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center max-w-md mx-auto">
            <Truck className="h-12 w-12 text-destructive mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => dispatch(fetchDeliverySlots())}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Delivery Options</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedSlot?.id} 
          onValueChange={handleSlotSelect}
          className="space-y-8"
        >
          {Object.entries(slotsByDate).map(([date, slots]) => (
            <div key={date} className="space-y-4">
              <h3 className="font-medium text-lg">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {slots.map((slot) => (
                  <div key={slot.id} className="relative">
                    <RadioGroupItem
                      value={slot.id}
                      id={slot.id}
                      className="peer sr-only"
                      disabled={!slot.available}
                    />
                    <Label
                      htmlFor={slot.id}
                      className={`flex flex-col h-full p-4 border rounded-md ${
                        !slot.available
                          ? 'bg-muted cursor-not-allowed opacity-60'
                          : 'cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {slot.startTime} - {slot.endTime}
                        </span>
                        {slot.fee ? (
                          <Badge variant="outline" className="ml-2">
                            +{formatCurrency(slot.fee)}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="ml-2">
                            Free Delivery
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {!slot.available ? (
                          <span className="text-destructive">Not available</span>
                        ) : slot.fee ? (
                          <span>Express delivery</span>
                        ) : (
                          <span>Standard delivery</span>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Address
        </Button>
        <Button onClick={handleContinue} disabled={!selectedSlot}>
          Continue to Payment
        </Button>
      </CardFooter>
    </Card>
  );
}