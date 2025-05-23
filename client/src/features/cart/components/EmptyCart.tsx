import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const EmptyCart: React.FC = () => {
  return (
    <div className="container mx-auto py-16 max-w-6xl">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
        
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Browse our products and find something you'll love.
        </p>

        <Link href="/products">
          <Button size="lg" className="gap-2">
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;