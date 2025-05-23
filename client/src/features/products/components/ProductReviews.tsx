import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Star, ThumbsUp, ThumbsDown, Flag, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock data for reviews
interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  upvotes: number;
  downvotes: number;
  userUpvoted: boolean;
  userDownvoted: boolean;
  isVerifiedPurchase: boolean;
  replies: ReviewReply[];
}

interface ReviewReply {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  comment: string;
  date: string;
  isSellerResponse: boolean;
}

interface ProductReviewsProps {
  productId: number;
  initialCount: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, initialCount }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // State for reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      userId: 101,
      userName: "John D.",
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      title: "Excellent product, exceeded expectations",
      comment: "I've been using this for a month now and it's amazing. The quality is top-notch and it works exactly as described. Would definitely recommend to anyone looking for a reliable product.",
      date: "2023-03-15",
      upvotes: 24,
      downvotes: 2,
      userUpvoted: false,
      userDownvoted: false,
      isVerifiedPurchase: true,
      replies: [
        {
          id: 101,
          userId: 999,
          userName: "Seller Support",
          comment: "Thank you for your kind review! We're thrilled that you're enjoying the product. Feel free to reach out if you have any questions.",
          date: "2023-03-16",
          isSellerResponse: true,
        }
      ]
    },
    {
      id: 2,
      userId: 102,
      userName: "Sarah M.",
      userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      title: "Great value for money",
      comment: "Really happy with my purchase. The product is well-made and functions as expected. The only reason I'm not giving 5 stars is that the setup instructions could be clearer. Other than that, it's perfect!",
      date: "2023-02-28",
      upvotes: 15,
      downvotes: 1,
      userUpvoted: false,
      userDownvoted: false,
      isVerifiedPurchase: true,
      replies: []
    },
    {
      id: 3,
      userId: 103,
      userName: "Michael T.",
      rating: 3,
      title: "Good but has some issues",
      comment: "The product works well most of the time, but I've encountered a few issues. Customer service was helpful in resolving them, but it was inconvenient. The product itself is decent quality for the price point.",
      date: "2023-02-10",
      upvotes: 8,
      downvotes: 3,
      userUpvoted: false,
      userDownvoted: false,
      isVerifiedPurchase: true,
      replies: []
    }
  ]);
  
  // State for new review
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  
  // State for review reply
  const [replyText, setReplyText] = useState('');
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  
  // State for sorting and filtering
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  
  // State for abuse report
  const [reportingReviewId, setReportingReviewId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState('');
  
  // Handle rating change on new review
  const handleRatingChange = (value: number) => {
    setNewReview({ ...newReview, rating: value });
  };
  
  // Submit new review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and comment for your review.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new review
    const review: Review = {
      id: Date.now(),
      userId: 999, // Current user ID (mock)
      userName: "You",
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      upvotes: 0,
      downvotes: 0,
      userUpvoted: false,
      userDownvoted: false,
      isVerifiedPurchase: true,
      replies: []
    };
    
    // Add to reviews
    setReviews([review, ...reviews]);
    
    // Reset form
    setNewReview({
      rating: 5,
      title: '',
      comment: '',
    });
    
    // Show success toast
    toast({
      title: "Review submitted",
      description: "Thank you for sharing your feedback!",
      variant: "default",
    });
    
    // TODO: In a real app, dispatch an action to save to backend
    // dispatch(addReview({ productId, review }));
  };
  
  // Handle voting on reviews
  const handleVote = (reviewId: number, isUpvote: boolean) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        if (isUpvote) {
          // If already upvoted, remove upvote
          if (review.userUpvoted) {
            return {
              ...review,
              upvotes: review.upvotes - 1,
              userUpvoted: false
            };
          }
          // If downvoted, switch vote
          else if (review.userDownvoted) {
            return {
              ...review,
              upvotes: review.upvotes + 1,
              downvotes: review.downvotes - 1,
              userUpvoted: true,
              userDownvoted: false
            };
          }
          // Normal upvote
          else {
            return {
              ...review,
              upvotes: review.upvotes + 1,
              userUpvoted: true
            };
          }
        } else {
          // If already downvoted, remove downvote
          if (review.userDownvoted) {
            return {
              ...review,
              downvotes: review.downvotes - 1,
              userDownvoted: false
            };
          }
          // If upvoted, switch vote
          else if (review.userUpvoted) {
            return {
              ...review,
              upvotes: review.upvotes - 1,
              downvotes: review.downvotes + 1,
              userUpvoted: false,
              userDownvoted: true
            };
          }
          // Normal downvote
          else {
            return {
              ...review,
              downvotes: review.downvotes + 1,
              userDownvoted: true
            };
          }
        }
      }
      return review;
    }));
    
    // Show toast
    toast({
      title: isUpvote ? "Review upvoted" : "Review downvoted",
      description: "Thank you for your feedback!",
      variant: "default",
    });
    
    // TODO: In a real app, dispatch an action to update the vote in the backend
    // dispatch(voteReview({ reviewId, isUpvote }));
  };
  
  // Handle replying to reviews
  const handleReply = (reviewId: number) => {
    if (!replyText.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // Add reply to the review
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        const newReply: ReviewReply = {
          id: Date.now(),
          userId: 999, // Current user ID (mock)
          userName: "You",
          comment: replyText,
          date: new Date().toISOString().split('T')[0],
          isSellerResponse: false
        };
        
        return {
          ...review,
          replies: [...review.replies, newReply]
        };
      }
      return review;
    }));
    
    // Reset form and state
    setReplyText('');
    setReplyingToId(null);
    
    // Show success toast
    toast({
      title: "Reply posted",
      description: "Your reply has been added to the review.",
      variant: "default",
    });
    
    // TODO: In a real app, dispatch an action to save the reply to backend
    // dispatch(addReviewReply({ reviewId, reply }));
  };
  
  // Handle reporting a review for abuse
  const handleReportReview = () => {
    if (!reportReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for reporting this review.",
        variant: "destructive",
      });
      return;
    }
    
    // TODO: In a real app, dispatch an action to report the review
    // dispatch(reportReview({ reviewId: reportingReviewId, reason: reportReason }));
    
    // Reset state
    setReportingReviewId(null);
    setReportReason('');
    
    // Show success toast
    toast({
      title: "Report submitted",
      description: "Thank you for helping us maintain a respectful community. We'll review this report promptly.",
      variant: "default",
    });
  };
  
  // Get filtered and sorted reviews
  const getProcessedReviews = () => {
    let processedReviews = [...reviews];
    
    // Filter by rating
    if (filterRating !== 'all') {
      const ratingFilter = parseInt(filterRating);
      processedReviews = processedReviews.filter(review => review.rating === ratingFilter);
    }
    
    // Sort reviews
    switch (sortBy) {
      case 'newest':
        processedReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        processedReviews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        processedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        processedReviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'most-helpful':
        processedReviews.sort((a, b) => b.upvotes - a.upvotes);
        break;
    }
    
    return processedReviews;
  };
  
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  // Count of each star rating
  const ratingCounts = reviews.reduce((counts, review) => {
    counts[review.rating - 1]++;
    return counts;
  }, [0, 0, 0, 0, 0]);
  
  // Calculate percentage for rating bars
  const ratingPercentages = ratingCounts.map(count => 
    reviews.length > 0 ? (count / reviews.length) * 100 : 0
  );
  
  // Render star rating component
  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            className={interactive ? "focus:outline-none" : undefined}
            onClick={interactive ? () => handleRatingChange(star) : undefined}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              } ${interactive ? "cursor-pointer" : ""}`}
            />
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div>
      {/* Review summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex items-center mb-4">
            <h3 className="text-2xl font-bold mr-4">{averageRating.toFixed(1)}</h3>
            <div>
              <div className="flex mb-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Based on {reviews.length} reviews
              </p>
            </div>
          </div>
          
          {/* Rating breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center">
                <span className="w-12 text-sm">{star} star</span>
                <div className="flex-1 mx-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${ratingPercentages[star - 1]}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right text-sm text-gray-500 dark:text-gray-400">
                  {ratingCounts[star - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Write a review */}
        <div>
          <h3 className="font-semibold mb-4">Share your thoughts</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="mt-1">{renderStars(newReview.rating, true)}</div>
              </div>
              
              <div>
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  placeholder="Summarize your experience"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="comment">Review</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this product..."
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <Button type="submit">Submit Review</Button>
            </div>
          </form>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {/* Reviews filtering and sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="font-semibold">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </h3>
        
        <div className="flex flex-wrap gap-3">
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
              <SelectItem value="most-helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Reviews list */}
      <div className="space-y-6">
        {getProcessedReviews().length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              {filterRating !== 'all' 
                ? `No ${filterRating}-star reviews yet.` 
                : 'No reviews yet. Be the first to share your thoughts!'}
            </p>
          </div>
        ) : (
          getProcessedReviews().map((review) => (
            <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                    {review.userAvatar ? (
                      <img 
                        src={review.userAvatar} 
                        alt={review.userName} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                        {review.userName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{review.userName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{review.date}</div>
                  </div>
                </div>
                <div>
                  {renderStars(review.rating)}
                </div>
              </div>
              
              {/* Review verified badge */}
              {review.isVerifiedPurchase && (
                <div className="mt-2">
                  <span className="inline-flex items-center text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified Purchase
                  </span>
                </div>
              )}
              
              {/* Review content */}
              <h4 className="font-semibold mt-3">{review.title}</h4>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{review.comment}</p>
              
              {/* Review actions */}
              <div className="flex flex-wrap gap-2 mt-4 text-sm">
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <button 
                    className={`flex items-center hover:text-gray-700 dark:hover:text-gray-200 ${
                      review.userUpvoted ? 'text-green-600 dark:text-green-400' : ''
                    }`}
                    onClick={() => handleVote(review.id, true)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{review.upvotes}</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <button 
                    className={`flex items-center hover:text-gray-700 dark:hover:text-gray-200 ${
                      review.userDownvoted ? 'text-red-600 dark:text-red-400' : ''
                    }`}
                    onClick={() => handleVote(review.id, false)}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    <span>{review.downvotes}</span>
                  </button>
                </div>
                
                <button 
                  className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => setReplyingToId(review.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>Reply</span>
                </button>
                
                <Dialog open={reportingReviewId === review.id} onOpenChange={(open) => !open && setReportingReviewId(null)}>
                  <DialogTrigger asChild>
                    <button 
                      className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => setReportingReviewId(review.id)}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      <span>Report</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Review</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="report-reason">Reason for reporting</Label>
                      <Select value={reportReason} onValueChange={setReportReason}>
                        <SelectTrigger id="report-reason" className="mt-2">
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                          <SelectItem value="spam">Spam or misleading</SelectItem>
                          <SelectItem value="offensive">Offensive language</SelectItem>
                          <SelectItem value="not-relevant">Not relevant to product</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {reportReason === 'other' && (
                        <div className="mt-4">
                          <Label htmlFor="report-details">Additional details</Label>
                          <Textarea
                            id="report-details"
                            placeholder="Please explain why you're reporting this review..."
                            className="mt-2"
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleReportReview}>Submit Report</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Reply form */}
              {replyingToId === review.id && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <Label htmlFor={`reply-${review.id}`}>Your Reply</Label>
                  <Textarea
                    id={`reply-${review.id}`}
                    placeholder="Write your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="mt-2"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => setReplyingToId(null)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => handleReply(review.id)}>
                      Post Reply
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Review replies */}
              {review.replies.length > 0 && (
                <div className="mt-4 space-y-3">
                  {review.replies.map((reply) => (
                    <div 
                      key={reply.id} 
                      className={`pl-4 border-l-2 ${
                        reply.isSellerResponse 
                          ? 'border-primary bg-primary/5 p-3 rounded-r-md' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-2">
                          {reply.userAvatar ? (
                            <img 
                              src={reply.userAvatar} 
                              alt={reply.userName} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium text-xs">
                              {reply.userName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className={`font-medium ${reply.isSellerResponse ? 'text-primary' : ''}`}>
                            {reply.userName} {reply.isSellerResponse && "(Seller)"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 sm:ml-2">
                            {reply.date}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm">{reply.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;