import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Wishlist, createWishlist, setDefaultWishlist } from '../wishlistSlice';
import { useState } from 'react';

interface WishlistSelectorProps {
  wishlists: Wishlist[];
  activeWishlistId: string;
  onSelectWishlist: (id: string) => void;
}

export function WishlistSelector({ 
  wishlists, 
  activeWishlistId, 
  onSelectWishlist 
}: WishlistSelectorProps) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  const handleCreateWishlist = () => {
    if (newWishlistName.trim() === '') {
      toast({
        title: 'Name required',
        description: 'Please enter a name for your wishlist.',
        variant: 'destructive',
      });
      return;
    }
    
    // Create new wishlist
    dispatch(createWishlist({
      name: newWishlistName,
      isPublic
    }));
    
    toast({
      title: 'Wishlist created',
      description: `${newWishlistName} has been created.`,
      variant: 'success',
    });
    
    // Reset form
    setNewWishlistName('');
    setIsPublic(false);
    setOpen(false);
  };
  
  const handleSelectWishlist = (value: string) => {
    onSelectWishlist(value);
    
    // If default checkbox is checked, set this as default
    dispatch(setDefaultWishlist(value));
  };
  
  return (
    <div className="flex items-center gap-2">
      <Select 
        value={activeWishlistId} 
        onValueChange={handleSelectWishlist}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a wishlist" />
        </SelectTrigger>
        <SelectContent>
          {wishlists.map((list) => (
            <SelectItem key={list.id} value={list.id}>
              {list.name} {list.isDefault && '(Default)'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new wishlist</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My Wishlist"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="public">Make this wishlist public</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWishlist}>
              Create Wishlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WishlistSelector;