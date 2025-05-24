import React from 'react';
import { Link } from 'wouter';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function EmptyCart() {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center py-12 px-4 text-center">
        <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <ShoppingCart className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Looks like you haven't added any items to your cart yet.
          Browse our products and find something you'll love!
        </p>
        
        <Button asChild>
          <Link href="/products">
            <span className="flex items-center">
              Browse products
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default EmptyCart;