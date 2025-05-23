import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  initializeWishlists, 
  selectWishlists, 
  selectActiveWishlistId,
  selectActiveWishlist,
  selectIsWishlistLoading,
  selectWishlistError,
  setActiveWishlist,
  createWishlist
} from '../wishlistSlice';
import WishlistItem from './WishlistItem';
import EmptyWishlist from './EmptyWishlist';
import WishlistSelector from './WishlistSelector';
import { Button } from '@/components/ui/button';
import { Plus, Share2, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import WishlistSettings from './WishlistSettings';
import { useState } from 'react';

const WishlistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const wishlists = useAppSelector(selectWishlists);
  const activeWishlistId = useAppSelector(selectActiveWishlistId);
  const activeWishlist = useAppSelector(selectActiveWishlist);
  const isLoading = useAppSelector(selectIsWishlistLoading);
  const error = useAppSelector(selectWishlistError);
  const { toast } = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize wishlists if needed
  useEffect(() => {
    dispatch(initializeWishlists());
  }, [dispatch]);

  // Handle creating new wishlist
  const handleCreateWishlist = () => {
    const name = prompt('Enter a name for your new wishlist:');
    if (name) {
      dispatch(createWishlist({ name }));
      toast({
        title: 'Wishlist created',
        description: `Your new wishlist "${name}" has been created.`,
        variant: 'default',
      });
    }
  };

  // Handle share wishlist
  const handleShareWishlist = () => {
    if (!activeWishlist) return;

    if (!activeWishlist.isPublic) {
      toast({
        title: 'Cannot share private wishlist',
        description: 'You need to make this wishlist public before sharing.',
        variant: 'destructive',
      });
      return;
    }

    if (activeWishlist.shareableLink) {
      // Copy to clipboard
      navigator.clipboard.writeText(activeWishlist.shareableLink)
        .then(() => {
          toast({
            title: 'Share link copied to clipboard',
            description: 'You can now share this link with others.',
            variant: 'default',
          });
        })
        .catch(() => {
          toast({
            title: 'Failed to copy link',
            description: 'Please try again or copy it manually.',
            variant: 'destructive',
          });
        });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading wishlists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg p-6 my-4">
          <h2 className="text-red-800 dark:text-red-300 text-lg font-medium">Error loading wishlists</h2>
          <p className="text-red-700 dark:text-red-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (wishlists.length === 0) {
    return <EmptyWishlist onCreateWishlist={handleCreateWishlist} />;
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Wishlist header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">My Wishlists</h1>
          <p className="text-muted-foreground mt-1">
            Manage your favorite products and share your wishlists with others.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCreateWishlist}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Wishlist
          </Button>
          {activeWishlist && (
            <>
              <Button
                variant="outline"
                onClick={handleShareWishlist}
                disabled={!activeWishlist.isPublic || !activeWishlist.shareableLink}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Wishlist selector */}
      {wishlists.length > 1 && (
        <div className="mb-6">
          <WishlistSelector
            wishlists={wishlists}
            activeWishlistId={activeWishlistId}
            onSelectWishlist={(id) => dispatch(setActiveWishlist(id))}
          />
        </div>
      )}
      
      {/* Active wishlist */}
      {activeWishlist ? (
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">
                {activeWishlist.name}
                {activeWishlist.isPublic && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Public
                  </span>
                )}
              </h2>
              <span className="text-sm text-muted-foreground">
                {activeWishlist.items.length} {activeWishlist.items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            
            <Separator className="mb-4" />
            
            {activeWishlist.items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">This wishlist is empty.</p>
                <Button variant="outline" size="sm">Browse Products</Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {activeWishlist.items.map((item) => (
                  <WishlistItem
                    key={item.id}
                    item={item}
                    wishlistId={activeWishlist.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-muted rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Please select a wishlist to view its contents.</p>
        </div>
      )}
      
      {/* Wishlist settings modal */}
      {activeWishlist && (
        <WishlistSettings
          wishlist={activeWishlist}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default WishlistPage;