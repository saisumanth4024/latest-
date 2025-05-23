import React from 'react';
import { Wishlist } from '../wishlistSlice';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WishlistSelectorProps {
  wishlists: Wishlist[];
  activeWishlistId: string | null;
  onSelectWishlist: (id: string) => void;
}

const WishlistSelector: React.FC<WishlistSelectorProps> = ({
  wishlists,
  activeWishlistId,
  onSelectWishlist,
}) => {
  return (
    <Tabs
      value={activeWishlistId || undefined}
      onValueChange={onSelectWishlist}
      className="w-full"
    >
      <TabsList className="w-full justify-start overflow-x-auto">
        {wishlists.map((wishlist) => (
          <TabsTrigger
            key={wishlist.id}
            value={wishlist.id as string}
            className="min-w-[120px] flex items-center justify-center"
          >
            <span className="truncate max-w-[180px]">{wishlist.name}</span>
            <span className="ml-2 text-xs rounded-full bg-muted px-2 py-0.5">
              {wishlist.items.length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default WishlistSelector;