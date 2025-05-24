import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectModerationForm, 
  selectIsModerationModalOpen,
  setModerationFormField,
  closeModerationModal
} from '../reviewsSlice';
import { useGetReviewByIdQuery, useModerateReviewMutation } from '../reviewsApi';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Flag, 
  EyeOff, 
  RotateCcw,
  Calendar,
  Star,
  Loader2
} from 'lucide-react';

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

// Moderation action options
const moderationActions = [
  { 
    value: 'approve', 
    label: 'Approve', 
    description: 'Mark this content as approved',
    icon: <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
  },
  { 
    value: 'reject', 
    label: 'Reject', 
    description: 'Reject this content as it violates our policies',
    icon: <XCircle className="h-4 w-4 mr-2 text-red-500" />
  },
  { 
    value: 'flag', 
    label: 'Flag for Review', 
    description: 'Mark this content for further review',
    icon: <Flag className="h-4 w-4 mr-2 text-amber-500" />
  },
  { 
    value: 'hide', 
    label: 'Hide', 
    description: 'Temporarily hide this content while under review',
    icon: <EyeOff className="h-4 w-4 mr-2 text-slate-500" />
  },
  {
    value: 'restore', 
    label: 'Restore', 
    description: 'Restore previously hidden or rejected content',
    icon: <RotateCcw className="h-4 w-4 mr-2 text-blue-500" />
  }
];

interface ModerationModalProps {
  moderatorId: string;
}

export const ModerationModal: React.FC<ModerationModalProps> = ({ moderatorId }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const isOpen = useSelector(selectIsModerationModalOpen);
  const moderationForm = useSelector(selectModerationForm);
  
  // Get the review details
  const { data: review, isLoading: isLoadingReview } = useGetReviewByIdQuery(
    moderationForm.reviewId,
    { skip: !moderationForm.reviewId || !isOpen }
  );
  
  // Moderate review mutation
  const [moderateReview, { isLoading }] = useModerateReviewMutation();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!moderationForm.action) {
      toast({
        title: "Error",
        description: "Please select an action to take.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Submit moderation action
      await moderateReview({
        reviewId: moderationForm.reviewId,
        action: moderationForm.action,
        reason: moderationForm.reason,
        notes: moderationForm.notes
      }).unwrap();
      
      // Close modal and show success message
      dispatch(closeModerationModal());
      
      toast({
        title: "Moderation Action Applied",
        description: `The review has been ${moderationForm.action}ed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem applying the moderation action. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && dispatch(closeModerationModal())}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShieldAlert className="h-5 w-5 mr-2 text-amber-500" />
            Moderate Content
          </DialogTitle>
          <DialogDescription>
            Review and take action on this content
          </DialogDescription>
        </DialogHeader>
        
        {isLoadingReview ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : review ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 flex-1">
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted/30 p-3 flex justify-between items-start">
                  <div className="flex items-start">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.author.avatarUrl} alt={review.author.name} />
                      <AvatarFallback>{review.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="font-medium">{review.author.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {review.rating && (
                    <StarRating rating={review.rating.overall} />
                  )}
                </div>
                
                <ScrollArea className="h-[200px] p-4">
                  {review.title && (
                    <h3 className="text-lg font-medium mb-2">{review.title}</h3>
                  )}
                  
                  <div className="mb-4">
                    {review.content.type === 'plain_text' 
                      ? <p className="whitespace-pre-line">{review.content.text}</p>
                      : review.content.blocks.map((block, index) => (
                          <div key={index} className="mb-3">
                            {block.type === 'paragraph' && <p>{block.content}</p>}
                            {block.type === 'heading' && <h4 className="text-lg font-medium">{block.content}</h4>}
                            {block.type === 'list' && <ul className="list-disc pl-5"><li>{block.content}</li></ul>}
                            {block.type === 'quote' && (
                              <blockquote className="border-l-2 pl-4 italic">{block.content}</blockquote>
                            )}
                          </div>
                        ))
                    }
                  </div>
                  
                  {/* Attachment thumbnails */}
                  {review.attachments && review.attachments.length > 0 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                      {review.attachments.map((attachment, index) => (
                        attachment.type === 'image' ? (
                          <div 
                            key={attachment.id}
                            className="flex-shrink-0 w-20 h-20 rounded overflow-hidden border"
                          >
                            <img 
                              src={attachment.thumbnailUrl || attachment.url} 
                              alt={`Attachment ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : null
                      ))}
                    </div>
                  )}
                </ScrollArea>
                
                <div className="bg-muted/30 p-3">
                  <div className="text-sm">
                    <span className="font-medium mr-1">Status:</span>
                    <Badge variant="outline" className="capitalize">
                      {review.status}
                    </Badge>
                  </div>
                  
                  {review.reports && review.reports.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Reported {review.reports.length} times for:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Array.from(new Set(review.reports.map(r => r.reason))).map((reason) => (
                          <Badge key={reason} variant="secondary" className="text-xs capitalize">
                            {reason.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="action" className="text-base font-medium">Moderation Action</Label>
                <Select 
                  value={moderationForm.action} 
                  onValueChange={(value) => dispatch(setModerationFormField({ 
                    field: 'action', 
                    value: value as 'approve' | 'reject' | 'flag' | 'hide' | 'restore'
                  }))}
                >
                  <SelectTrigger id="action" className="mt-2">
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    {moderationActions.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        <div className="flex items-center">
                          {action.icon}
                          <span>{action.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {moderationActions.find(a => a.value === moderationForm.action)?.description || 
                  'Choose an action to take on this content'}
                </p>
              </div>
              
              <div>
                <Label htmlFor="reason" className="text-base font-medium">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain the reason for this moderation action"
                  value={moderationForm.reason}
                  onChange={(e) => dispatch(setModerationFormField({ 
                    field: 'reason', 
                    value: e.target.value 
                  }))}
                  className="mt-2"
                  rows={2}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This reason may be shared with the content author
                </p>
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-base font-medium">Internal Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add private notes for other moderators (not visible to users)"
                  value={moderationForm.notes}
                  onChange={(e) => dispatch(setModerationFormField({ 
                    field: 'notes', 
                    value: e.target.value 
                  }))}
                  className="mt-2"
                  rows={2}
                />
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => dispatch(closeModerationModal())}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !moderationForm.action}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Apply Moderation Action</>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-4 text-center">
            <p>Unable to load review details.</p>
            <Button 
              variant="outline" 
              onClick={() => dispatch(closeModerationModal())} 
              className="mt-4"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};