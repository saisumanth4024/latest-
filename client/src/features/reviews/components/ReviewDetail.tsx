import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectSelectedReviewId, 
  selectIsReviewDetailOpen,
  selectUserHelpfulVotes,
  selectUserUnhelpfulVotes,
  selectUserReportedReviews,
  setSelectedReview,
  toggleReviewDetail,
  openReportModal
} from '../reviewsSlice';
import { 
  useGetReviewByIdQuery, 
  useGetReviewChildrenQuery,
  useVoteReviewMutation
} from '../reviewsApi';
import { Review } from '../types';
import { ReviewForm } from './ReviewForm';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Flag,
  MessageSquare,
  Calendar,
  Star,
  Award,
  Image,
  Check,
  X,
  MessageCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
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

// Badge for review status and verification
const ReviewBadge = ({ verified }: { verified: boolean }) => {
  if (!verified) return null;
  
  return (
    <Badge variant="outline" className="ml-2 text-xs flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
      <Check className="h-3 w-3" />
      Verified
    </Badge>
  );
};

export const ReviewDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const isOpen = useSelector(selectIsReviewDetailOpen);
  const selectedReviewId = useSelector(selectSelectedReviewId);
  
  // Get user interaction state
  const helpfulVotes = useSelector(selectUserHelpfulVotes);
  const unhelpfulVotes = useSelector(selectUserUnhelpfulVotes);
  const reportedReviews = useSelector(selectUserReportedReviews);
  
  // Local state for reply form
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  // Set up queries and mutations
  const [voteReview] = useVoteReviewMutation();
  
  // Get the selected review
  const { data: review, isLoading: isLoadingReview, error: reviewError } = 
    useGetReviewByIdQuery(selectedReviewId || '', { skip: !selectedReviewId || !isOpen });
  
  // Get review children (replies)
  const { data: children, isLoading: isLoadingChildren } =
    useGetReviewChildrenQuery(selectedReviewId || '', { skip: !selectedReviewId || !isOpen });
  
  // Handle close
  const handleClose = () => {
    dispatch(toggleReviewDetail(false));
    dispatch(setSelectedReview(null));
    setShowReplyForm(false);
  };
  
  // Handle vote on review
  const handleVote = (reviewId: string, voteType: 'helpful' | 'unhelpful') => {
    // Check if already voted this way
    const alreadyVotedHelpful = helpfulVotes.includes(reviewId);
    const alreadyVotedUnhelpful = unhelpfulVotes.includes(reviewId);
    
    // If already voted this way, do nothing
    if ((voteType === 'helpful' && alreadyVotedHelpful) || 
        (voteType === 'unhelpful' && alreadyVotedUnhelpful)) {
      return;
    }
    
    // Cast the vote
    voteReview({ reviewId, voteType });
  };
  
  // Handle reporting a review
  const handleReport = (reviewId: string) => {
    dispatch(openReportModal(reviewId));
  };
  
  // Handle reply form submission success
  const handleReplySuccess = () => {
    setShowReplyForm(false);
    toast({
      title: "Reply Submitted",
      description: "Your reply has been submitted successfully.",
    });
  };
  
  // Render reply item
  const renderReply = (reply: Review) => {
    return (
      <Card key={reply.id} className="mb-3">
        <CardHeader className="py-3 px-4">
          <div className="flex items-start justify-between">
            <div className="flex">
              <Avatar className="h-8 w-8">
                <AvatarImage src={reply.author.avatarUrl} alt={reply.author.name} />
                <AvatarFallback>{reply.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <div className="font-medium text-sm">{reply.author.name}</div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(reply.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="py-2 px-4">
          <div className="text-sm">
            {reply.content.type === 'plain_text' 
              ? <p>{reply.content.text}</p>
              : reply.content.blocks.map((block, index) => (
                  <div key={index} className="mb-2">
                    {block.type === 'paragraph' && <p>{block.content}</p>}
                    {block.type === 'heading' && <h4 className="font-medium">{block.content}</h4>}
                    {block.type === 'list' && <ul className="list-disc pl-5"><li>{block.content}</li></ul>}
                  </div>
                ))
            }
          </div>
        </CardContent>
        
        <CardFooter className="py-2 px-4 flex justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs h-7 px-2 gap-1 ${helpfulVotes.includes(reply.id) ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => handleVote(reply.id, 'helpful')}
            >
              <ThumbsUp className={`h-3 w-3 ${helpfulVotes.includes(reply.id) ? 'fill-primary' : ''}`} />
              <span>{reply.helpfulVotes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs h-7 px-2 gap-1 ${unhelpfulVotes.includes(reply.id) ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => handleVote(reply.id, 'unhelpful')}
            >
              <ThumbsDown className={`h-3 w-3 ${unhelpfulVotes.includes(reply.id) ? 'fill-primary' : ''}`} />
              <span>{reply.unhelpfulVotes}</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => handleReport(reply.id)}
            disabled={reportedReviews.includes(reply.id)}
          >
            <Flag className="h-3 w-3 mr-1" />
            {reportedReviews.includes(reply.id) ? 'Reported' : 'Report'}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        {isLoadingReview ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : reviewError ? (
          <div className="py-10 text-center">
            <AlertCircle className="h-10 w-10 mx-auto mb-4 text-destructive" />
            <DialogTitle className="mb-2">Error Loading Review</DialogTitle>
            <DialogDescription>
              There was a problem loading this review. Please try again later.
            </DialogDescription>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        ) : review ? (
          <>
            <DialogHeader>
              <DialogTitle>{review.title || 'Review Details'}</DialogTitle>
              <DialogDescription className="flex justify-between items-center">
                <span>by {review.author.name} • {formatDate(review.createdAt)}</span>
                {review.rating && <StarRating rating={review.rating.overall} />}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comments" className="flex items-center gap-1">
                  Comments
                  {children && children.length > 0 && (
                    <Badge variant="secondary" className="ml-1">{children.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="flex-1 overflow-hidden flex flex-col pt-2">
                <ScrollArea className="flex-1">
                  <div className="p-1">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.author.avatarUrl} alt={review.author.name} />
                        <AvatarFallback>{review.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <h4 className="font-medium">{review.author.name}</h4>
                          <ReviewBadge verified={review.verified} />
                          {review.author.badges && review.author.badges.length > 0 && (
                            <Badge variant="outline" className="ml-2 text-xs flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                              <Award className="h-3 w-3" />
                              {review.author.badges[0]}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    {review.rating && review.rating.aspects && Object.keys(review.rating.aspects).length > 0 && (
                      <div className="mb-4 bg-muted/30 rounded-md p-3">
                        <h5 className="font-medium text-sm mb-2">Ratings by Category</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(review.rating.aspects).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{key}</span>
                              <StarRating rating={value} />
                            </div>
                          ))}
                        </div>
                      </div>
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
                              {block.type === 'code' && (
                                <pre className="bg-muted p-2 rounded overflow-x-auto">{block.content}</pre>
                              )}
                            </div>
                          ))
                      }
                    </div>
                    
                    {/* Attachment previews */}
                    {review.attachments && review.attachments.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-sm mb-2">Attachments</h5>
                        <div className="grid grid-cols-3 gap-2">
                          {review.attachments.map((attachment, index) => (
                            attachment.type === 'image' ? (
                              <div 
                                key={attachment.id}
                                className="aspect-square rounded overflow-hidden border"
                              >
                                <img 
                                  src={attachment.url} 
                                  alt={`Attachment ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div key={attachment.id} className="bg-muted p-2 rounded flex items-center justify-center aspect-square">
                                <div className="text-center">
                                  <Image className="h-6 w-6 mx-auto text-muted-foreground" />
                                  <span className="text-xs block mt-1 truncate max-w-full">
                                    {attachment.filename || `File ${index + 1}`}
                                  </span>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between items-center p-1">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={helpfulVotes.includes(review.id) ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                      onClick={() => handleVote(review.id, 'helpful')}
                    >
                      <ThumbsUp className={`h-4 w-4 ${helpfulVotes.includes(review.id) ? 'fill-primary-foreground' : ''}`} />
                      <span>Helpful ({review.helpfulVotes})</span>
                    </Button>
                    
                    <Button
                      variant={unhelpfulVotes.includes(review.id) ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                      onClick={() => handleVote(review.id, 'unhelpful')}
                    >
                      <ThumbsDown className={`h-4 w-4 ${unhelpfulVotes.includes(review.id) ? 'fill-primary-foreground' : ''}`} />
                      <span>Not Helpful ({review.unhelpfulVotes})</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        setActiveTab('comments');
                        setShowReplyForm(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Reply</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleReport(review.id)}
                      disabled={reportedReviews.includes(review.id)}
                    >
                      <Flag className="h-4 w-4" />
                      <span>{reportedReviews.includes(review.id) ? 'Reported' : 'Report'}</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="comments" className="flex-1 overflow-hidden flex flex-col pt-2">
                <ScrollArea className="flex-1">
                  <div className="p-1 space-y-2">
                    {showReplyForm && (
                      <div className="mb-4">
                        <ReviewForm 
                          reviewType="reply"
                          parentId={review?.id}
                          contentType={review?.contentType}
                          contentId={review?.contentId}
                          onSuccess={handleReplySuccess}
                          onCancel={() => setShowReplyForm(false)}
                          compact
                        />
                      </div>
                    )}
                    
                    {isLoadingChildren ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : children && children.length > 0 ? (
                      children.map(reply => renderReply(reply))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-10 w-10 mx-auto mb-2" />
                        <p>No comments yet</p>
                        <p className="text-sm mt-1">Be the first to leave a comment on this review</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <Separator className="my-2" />
                
                <div className="p-1">
                  {!showReplyForm && (
                    <Button 
                      variant="outline" 
                      className="w-full gap-1"
                      onClick={() => setShowReplyForm(true)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Add a Comment</span>
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex justify-center items-center py-16">
            <p>No review selected.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};