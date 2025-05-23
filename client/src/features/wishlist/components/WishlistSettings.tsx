import React, { useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { 
  updateWishlist,
  deleteWishlist,
  regenerateShareableLink
} from '../wishlistSlice';
import { Wishlist } from '../wishlistSlice';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Trash2, 
  RefreshCw,
  Link as LinkIcon,
  Copy
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WishlistSettingsProps {
  wishlist: Wishlist;
  isOpen: boolean;
  onClose: () => void;
}

const WishlistSettings: React.FC<WishlistSettingsProps> = ({
  wishlist,
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState(wishlist.name);
  const [isPublic, setIsPublic] = useState(wishlist.isPublic);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Handle saving changes
  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Wishlist name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await dispatch(updateWishlist({
        wishlistId: wishlist.id as string,
        name,
        isPublic,
      }));
      
      toast({
        title: 'Settings saved',
        description: 'Your wishlist settings have been updated.',
        variant: 'default',
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update wishlist settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete wishlist
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this wishlist? This action cannot be undone.')) {
      dispatch(deleteWishlist(wishlist.id as string));
      
      toast({
        title: 'Wishlist deleted',
        description: 'Your wishlist has been permanently deleted.',
        variant: 'default',
      });
      
      onClose();
    }
  };

  // Handle copy link
  const handleCopyLink = () => {
    if (wishlist.shareableLink) {
      navigator.clipboard.writeText(wishlist.shareableLink)
        .then(() => {
          toast({
            title: 'Link copied',
            description: 'The shareable link has been copied to your clipboard.',
            variant: 'default',
          });
        })
        .catch(() => {
          toast({
            title: 'Copy failed',
            description: 'Failed to copy link to clipboard.',
            variant: 'destructive',
          });
        });
    }
  };

  // Handle regenerate link
  const handleRegenerateLink = () => {
    dispatch(regenerateShareableLink(wishlist.id as string));
    
    toast({
      title: 'Link regenerated',
      description: 'A new shareable link has been generated.',
      variant: 'default',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Wishlist Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Wishlist Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter wishlist name"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public">Public Wishlist</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to view this wishlist with a link
              </p>
            </div>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          
          {isPublic && (
            <>
              <Separator />
              
              <div className="space-y-2">
                <Label>Shareable Link</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      value={wishlist.shareableLink || 'No link available'}
                      readOnly
                      className="pl-10 pr-20 text-sm text-muted-foreground"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-7"
                      onClick={handleCopyLink}
                      disabled={!wishlist.shareableLink}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleRegenerateLink}
                    disabled={!isPublic}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Regenerating a link will invalidate the previous one.
                </p>
              </div>
            </>
          )}
          
          <Separator />
          
          <div>
            <Label className="text-destructive">Danger Zone</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Permanently delete this wishlist and all its items.
            </p>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Wishlist
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistSettings;