import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectReviewForm,
  setReviewFormField,
  resetReviewForm,
  addAttachment,
  removeAttachment,
  setIsUploading
} from '../reviewsSlice';
import { useCreateReviewMutation } from '../reviewsApi';
import { ReviewType } from '../types';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Paperclip, X, Image, SendHorizontal, Loader2, AlertCircle } from 'lucide-react';

// Star rating component
const StarRatingInput = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className={`h-6 w-6 transition-all ${
              (hoverRating || value) >= star
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium">{value}/5</span>
      )}
    </div>
  );
};

interface ReviewFormProps {
  className?: string;
  reviewType?: ReviewType;
  parentId?: string;
  contentType?: string;
  contentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  compact?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  className = '',
  reviewType,
  parentId,
  contentType,
  contentId,
  onSuccess,
  onCancel,
  compact = false
}) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const reviewForm = useSelector(selectReviewForm);
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [activeTab, setActiveTab] = useState<string>('write');
  
  // Initialize form with props if provided
  React.useEffect(() => {
    if (reviewType) {
      dispatch(setReviewFormField({ field: 'type', value: reviewType }));
    }
    if (parentId) {
      dispatch(setReviewFormField({ field: 'parentId', value: parentId }));
    }
    if (contentType) {
      dispatch(setReviewFormField({ field: 'contentType', value: contentType }));
    }
    if (contentId) {
      dispatch(setReviewFormField({ field: 'contentId', value: contentId }));
    }
  }, [reviewType, parentId, contentType, contentId, dispatch]);
  
  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    dispatch(setIsUploading(true));
    
    try {
      // In a real implementation, this would upload the file to a server
      // For now, we'll just simulate an upload and add the "ID" to our state
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add a fake attachment ID to the state
        const fakeAttachmentId = `attachment-${Date.now()}-${i}`;
        dispatch(addAttachment(fakeAttachmentId));
      }
      
      // Reset the file input
      event.target.value = '';
      
      toast({
        title: "Files Uploaded Successfully",
        description: "Your files have been uploaded and attached to the review.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your files.",
        variant: "destructive",
      });
    } finally {
      dispatch(setIsUploading(false));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!reviewForm.contentId) {
      toast({
        title: "Error",
        description: "Content ID is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (reviewForm.type === 'review' && !reviewForm.rating) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating for your review.",
        variant: "destructive",
      });
      return;
    }
    
    if (!reviewForm.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please write something for your review.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create the review
      await createReview({
        contentType: reviewForm.contentType,
        contentId: reviewForm.contentId,
        type: reviewForm.type,
        title: reviewForm.title,
        content: {
          type: 'plain_text',
          text: reviewForm.content
        },
        rating: reviewForm.type === 'review' ? {
          overall: reviewForm.rating,
          aspects: reviewForm.aspectRatings
        } : undefined,
        attachments: reviewForm.attachments,
        parentId: reviewForm.parentId
      }).unwrap();
      
      // Reset the form
      dispatch(resetReviewForm());
      
      // Show success message
      toast({
        title: "Success",
        description: `Your ${reviewForm.type} has been submitted successfully.`,
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your review. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Remove an attachment
  const handleRemoveAttachment = (attachmentId: string) => {
    dispatch(removeAttachment(attachmentId));
  };
  
  if (compact) {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit}>
          {reviewForm.type === 'review' && (
            <div className="mb-3">
              <StarRatingInput
                value={reviewForm.rating}
                onChange={(rating) => dispatch(setReviewFormField({ field: 'rating', value: rating }))}
              />
            </div>
          )}
          
          <div className="flex items-start gap-2">
            <Textarea
              placeholder={`Write your ${reviewForm.type}...`}
              value={reviewForm.content}
              onChange={(e) => dispatch(setReviewFormField({ field: 'content', value: e.target.value }))}
              className="resize-none min-h-[80px]"
            />
            
            <div className="flex flex-col gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 shrink-0"
                      onClick={() => document.getElementById('file-upload-compact')?.click()}
                      disabled={reviewForm.isUploading}
                    >
                      {reviewForm.isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Paperclip className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Attach files
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-9 w-9 shrink-0"
                      disabled={isLoading || reviewForm.isUploading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SendHorizontal className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Submit
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <input
              type="file"
              id="file-upload-compact"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={reviewForm.isUploading}
            />
          </div>
          
          {reviewForm.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {reviewForm.attachments.map((id) => (
                <div key={id} className="relative bg-muted rounded p-1 pl-2 pr-6 text-xs flex items-center">
                  <Image className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-[150px]">Attachment</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(id)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {reviewForm.type === 'review' ? 'Write a Review' : 
          reviewForm.type === 'question' ? 'Ask a Question' :
          reviewForm.type === 'answer' ? 'Answer this Question' :
          reviewForm.type === 'comment' ? 'Leave a Comment' : 'Reply'}
        </CardTitle>
        <CardDescription>
          {reviewForm.type === 'review' ? 'Share your experience with this product' :
          reviewForm.type === 'question' ? 'Ask about this product' :
          reviewForm.type === 'answer' ? 'Share your knowledge' :
          reviewForm.type === 'comment' ? 'Comment on this review' : 'Reply to this message'}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {reviewForm.type === 'review' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="rating">Your Rating</Label>
                <StarRatingInput
                  value={reviewForm.rating}
                  onChange={(rating) => dispatch(setReviewFormField({ field: 'rating', value: rating }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  placeholder="Summarize your experience"
                  value={reviewForm.title}
                  onChange={(e) => dispatch(setReviewFormField({ field: 'title', value: e.target.value }))}
                />
              </div>
            </>
          )}
          
          {reviewForm.type === 'question' && (
            <div className="space-y-2">
              <Label htmlFor="title">Question</Label>
              <Input
                id="title"
                placeholder="Ask a specific question"
                value={reviewForm.title}
                onChange={(e) => dispatch(setReviewFormField({ field: 'title', value: e.target.value }))}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="content">
              {reviewForm.type === 'review' ? 'Your Review' :
              reviewForm.type === 'question' ? 'Details (Optional)' :
              reviewForm.type === 'answer' ? 'Your Answer' :
              reviewForm.type === 'comment' ? 'Your Comment' : 'Your Reply'}
            </Label>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="write" className="space-y-4">
                <Textarea
                  id="content"
                  value={reviewForm.content}
                  onChange={(e) => dispatch(setReviewFormField({ field: 'content', value: e.target.value }))}
                  placeholder={`${
                    reviewForm.type === 'review' ? 'What did you like or dislike? How was your experience?' :
                    reviewForm.type === 'question' ? 'Provide more details about your question...' :
                    reviewForm.type === 'answer' ? 'Share your answer here...' :
                    reviewForm.type === 'comment' ? 'Add your thoughts...' : 'Write your reply here...'
                  }`}
                  className="min-h-[150px] resize-y"
                />
                
                <div>
                  <Label htmlFor="file-upload" className="block mb-2">Attachments</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={reviewForm.isUploading}
                      className="flex items-center gap-2"
                    >
                      {reviewForm.isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Paperclip className="h-4 w-4" />
                      )}
                      {reviewForm.isUploading ? 'Uploading...' : 'Attach Files'}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Supported formats: JPG, PNG, GIF (max 5MB each)
                    </span>
                  </div>
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={reviewForm.isUploading}
                  />
                </div>
                
                {reviewForm.attachments.length > 0 && (
                  <div className="border rounded-md p-3 space-y-2">
                    <Label>Attached Files ({reviewForm.attachments.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {reviewForm.attachments.map((id) => (
                        <div key={id} className="relative bg-muted rounded p-2 pl-3 pr-8 text-sm flex items-center">
                          <Image className="h-4 w-4 mr-2" />
                          <span className="truncate max-w-[200px]">Attachment</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="preview">
                <div className="border rounded-md p-4 min-h-[200px]">
                  {reviewForm.content ? (
                    <div className="prose max-w-none">
                      <p>{reviewForm.content}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Nothing to preview yet
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={isLoading || reviewForm.isUploading || !reviewForm.content.trim()}
            className={onCancel ? '' : 'ml-auto'}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};