import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Heart, 
  MoreHorizontal, 
  Trash, 
  Edit, 
  Share2, 
  ShoppingCart, 
  Plus 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Mock data for wishlists
const MOCK_WISHLISTS = [
  {
    id: '1',
    name: 'My Favorites',
    description: 'Items I want to purchase soon',
    isPublic: true,
    isDefault: true,
    createdAt: '2025-04-15T12:00:00Z',
    updatedAt: '2025-05-20T15:30:00Z',
    shareableLink: 'https://example.com/shared/wishlist/1',
    items: [
      {
        id: '101',
        productId: '1',
        name: 'Ultra Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones with 40-hour battery life.',
        price: 299.99,
        image: 'https://i.imgur.com/jNNT4LE.jpg',
        rating: 4.7,
        addedAt: '2025-05-10T09:15:00Z',
        notes: 'Waiting for sale',
        inStock: true
      },
      {
        id: '102',
        productId: '3',
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracking with heart rate monitor and GPS.',
        price: 349.99,
        image: 'https://i.imgur.com/J6MinJn.jpg',
        rating: 4.8,
        addedAt: '2025-05-12T14:20:00Z',
        notes: 'Gift idea for birthday',
        inStock: true
      }
    ]
  },
  {
    id: '2',
    name: 'Tech Gadgets',
    description: 'Cool tech I want to check out',
    isPublic: false,
    isDefault: false,
    createdAt: '2025-04-20T09:30:00Z',
    updatedAt: '2025-05-18T11:45:00Z',
    shareableLink: null,
    items: [
      {
        id: '201',
        productId: '6',
        name: 'Ultrabook Laptop 15"',
        description: 'Ultra-thin and lightweight laptop with 12-hour battery life.',
        price: 1299.99,
        image: 'https://i.imgur.com/D5yJDGJ.jpg',
        rating: 4.9,
        addedAt: '2025-05-05T16:40:00Z',
        notes: 'Compare with other models',
        inStock: true
      },
      {
        id: '202',
        productId: '12',
        name: 'Smartphone Pro Max',
        description: 'Latest flagship smartphone with advanced camera system and all-day battery.',
        price: 1099.99,
        image: 'https://i.imgur.com/hrnS6zr.jpg',
        rating: 4.9,
        addedAt: '2025-05-15T10:10:00Z',
        notes: '',
        inStock: true
      },
      {
        id: '203',
        productId: '15',
        name: 'Digital Drawing Tablet',
        description: 'Professional drawing tablet with pressure sensitivity and wireless connectivity.',
        price: 349.99,
        image: 'https://i.imgur.com/ZXBCcPX.jpg',
        rating: 4.7,
        addedAt: '2025-05-16T13:25:00Z',
        notes: 'For design work',
        inStock: true
      }
    ]
  },
  {
    id: '3',
    name: 'Gift Ideas',
    description: 'Items to buy as gifts',
    isPublic: false,
    isDefault: false,
    createdAt: '2025-05-01T08:20:00Z',
    updatedAt: '2025-05-19T17:10:00Z',
    shareableLink: null,
    items: []
  }
];

// WishlistItem component
const WishlistItem = ({ item, onRemove, onAddToCart, onEdit }: any) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/4 h-40 sm:h-auto">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "https://placehold.co/400x300/e2e8f0/1e293b?text=Product+Image";
            }}
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-lg">{item.name}</h3>
              <p className="text-2xl font-bold mt-1">${item.price.toFixed(2)}</p>
              <div className="flex items-center mt-1 space-x-1">
                {Array.from({ length: Math.floor(item.rating) }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-500 ml-1">{item.rating}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Notes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddToCart(item)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onRemove(item)} 
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {item.notes && (
            <div className="mt-2 p-2 bg-muted rounded-md">
              <p className="text-sm italic">{item.notes}</p>
            </div>
          )}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Added on {new Date(item.addedAt).toLocaleDateString()}
            </span>
            <Button variant="secondary" size="sm" onClick={() => onAddToCart(item)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// WishlistSelector component
const WishlistSelector = ({ wishlists, activeWishlistId, onSelectWishlist }: any) => {
  return (
    <Tabs defaultValue={activeWishlistId} onValueChange={onSelectWishlist}>
      <TabsList>
        {wishlists.map((list: any) => (
          <TabsTrigger key={list.id} value={list.id} className="relative">
            {list.name}
            {list.isDefault && (
              <span className="absolute -top-1 -right-1">
                <Heart className="h-3 w-3 fill-current text-primary" />
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

// EmptyWishlist component
const EmptyWishlist = ({ onCreateWishlist }: any) => (
  <div className="container mx-auto py-8 max-w-6xl">
    <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
      <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Heart className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-medium mb-2">Your wishlist is empty</h2>
      <p className="text-muted-foreground mb-6">
        Start creating wishlists to save products you love.
      </p>
      <Button onClick={onCreateWishlist}>
        <Plus className="mr-2 h-4 w-4" />
        Create Your First Wishlist
      </Button>
    </div>
  </div>
);

// MockWishlistPage component
const MockWishlistPage: React.FC = () => {
  const { toast } = useToast();
  const [wishlists, setWishlists] = useState(MOCK_WISHLISTS);
  const [activeWishlistId, setActiveWishlistId] = useState(MOCK_WISHLISTS[0].id);
  const activeWishlist = wishlists.find(list => list.id === activeWishlistId);
  
  // Handle creating new wishlist
  const handleCreateWishlist = () => {
    const name = prompt('Enter a name for your new wishlist:');
    if (name) {
      const newWishlist = {
        id: `${Date.now()}`,
        name,
        description: '',
        isPublic: false,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shareableLink: null,
        items: []
      };
      
      setWishlists([...wishlists, newWishlist]);
      setActiveWishlistId(newWishlist.id);
      
      toast({
        title: 'Wishlist created',
        description: `Your new wishlist "${name}" has been created.`,
        variant: 'default',
      });
    }
  };

  // Handle removing item from wishlist
  const handleRemoveItem = (item: any) => {
    if (!activeWishlist) return;
    
    const updatedWishlists = wishlists.map(list => {
      if (list.id === activeWishlistId) {
        return {
          ...list,
          items: list.items.filter(i => i.id !== item.id),
          updatedAt: new Date().toISOString()
        };
      }
      return list;
    });
    
    setWishlists(updatedWishlists);
    
    toast({
      title: 'Item removed',
      description: `${item.name} has been removed from your wishlist.`,
      variant: 'default',
    });
  };

  // Handle adding item to cart
  const handleAddToCart = (item: any) => {
    toast({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart.`,
      variant: 'default',
    });
  };

  // Handle editing item notes
  const handleEditNotes = (item: any) => {
    const notes = prompt('Add notes about this item:', item.notes || '');
    
    if (notes !== null) {
      const updatedWishlists = wishlists.map(list => {
        if (list.id === activeWishlistId) {
          return {
            ...list,
            items: list.items.map(i => {
              if (i.id === item.id) {
                return { ...i, notes };
              }
              return i;
            }),
            updatedAt: new Date().toISOString()
          };
        }
        return list;
      });
      
      setWishlists(updatedWishlists);
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

    // Copy to clipboard
    navigator.clipboard.writeText(activeWishlist.shareableLink || window.location.href)
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
  };

  // If there are no wishlists
  if (wishlists.length === 0) {
    return <EmptyWishlist onCreateWishlist={handleCreateWishlist} />;
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Wishlists</h1>
          <p className="text-muted-foreground">
            Manage your wishlists and saved items
          </p>
        </div>
        <Button onClick={handleCreateWishlist}>
          <Plus className="mr-2 h-4 w-4" />
          New Wishlist
        </Button>
      </div>
      
      {/* Wishlist selector */}
      <div className="mb-6">
        <WishlistSelector 
          wishlists={wishlists}
          activeWishlistId={activeWishlistId}
          onSelectWishlist={setActiveWishlistId}
        />
      </div>
      
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
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleShareWishlist}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Badge variant="outline">
                  {activeWishlist.items.length} {activeWishlist.items.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>
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
                    onRemove={handleRemoveItem}
                    onAddToCart={handleAddToCart}
                    onEdit={handleEditNotes}
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
    </div>
  );
};

export default MockWishlistPage;