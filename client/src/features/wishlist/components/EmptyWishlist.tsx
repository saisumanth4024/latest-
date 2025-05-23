import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Plus } from 'lucide-react';

interface EmptyWishlistProps {
  onCreateWishlist: () => void;
}

const EmptyWishlist: React.FC<EmptyWishlistProps> = ({ onCreateWishlist }) => {
  return (
    <div className="container mx-auto py-16 max-w-6xl">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h1 className="text-3xl font-bold mb-3">Your wishlist is empty</h1>
        
        <p className="text-muted-foreground mb-8 max-w-md">
          Create your first wishlist to save products you love and share with friends and family.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={onCreateWishlist} size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Wishlist
          </Button>
          
          <Link href="/products">
            <Button variant="outline" size="lg" className="gap-2">
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyWishlist;