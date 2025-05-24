import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectReviewFilters,
  selectReviewSortOptions,
  selectCurrentContentType,
  selectCurrentContentId,
  selectUserHelpfulVotes,
  selectUserUnhelpfulVotes,
  selectUserReportedReviews,
  setCurrentContent,
  setReviewFilters, 
  setSortOptions,
  setSelectedReview,
  openReportModal
} from '../reviewsSlice';
import { 
  useGetContentReviewsQuery,
  useVoteReviewMutation
} from '../reviewsApi';
import { Review, ContentType, ReviewFilters, ReviewSortOptions } from '../types';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ThumbsUp,
  ThumbsDown,
  Flag,
  MessageSquare,
  Filter,
  SortAsc,
  SortDesc,
  Star,
  Award,
  MoreVertical,
  Image,
  Calendar,
  Check
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

// StarRating component
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

interface ReviewListProps {
  contentType: ContentType;
  contentId: string;
  initialFilters?: Partial<ReviewFilters>;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  compact?: boolean;
  maxHeight?: string;
  className?: string;
  onReviewClick?: (review: Review) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  contentType,
  contentId,
  initialFilters,
  allowSorting = true,
  allowFiltering = true,
  compact = false,
  maxHeight,
  className = '',
  onReviewClick
}) => {
  const dispatch = useDispatch();
  
  // Local state for pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Get filter and sort options from Redux
  const filters = useSelector(selectReviewFilters);
  const sortOptions = useSelector(selectReviewSortOptions);
  const currentContentType = useSelector(selectCurrentContentType);
  const currentContentId = useSelector(selectCurrentContentId);
  
  // User interactions state
  const helpfulVotes = useSelector(selectUserHelpfulVotes);
  const unhelpfulVotes = useSelector(selectUserUnhelpfulVotes);
  const reportedReviews = useSelector(selectUserReportedReviews);
  
  // Set up mutations
  const [voteReview] = useVoteReviewMutation();
  
  // Update the current content in state if it changed
  useEffect(() => {
    if (contentType !== currentContentType || contentId !== currentContentId) {
      dispatch(setCurrentContent({ contentType, contentId }));
    }
  }, [contentType, contentId, currentContentType, currentContentId, dispatch]);
  
  // Apply initial filters if provided
  useEffect(() => {
    if (initialFilters) {
      dispatch(setReviewFilters(initialFilters));
    }
  }, [initialFilters, dispatch]);
  
  // Fetch reviews with RTK Query
  const { data, isLoading, error, refetch } = useGetContentReviewsQuery({
    contentType,
    contentId,
    request: {
      filters: filters,
      sorting: sortOptions,
      pagination: {
        page,
        limit: pageSize
      }
    }
  });
  
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
  
  // Handle view review details
  const handleViewReview = (review: Review) => {
    if (onReviewClick) {
      onReviewClick(review);
    } else {
      dispatch(setSelectedReview(review.id));
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType: keyof ReviewFilters, value: any) => {
    dispatch(setReviewFilters({ [filterType]: value }));
  };
  
  // Handle sort option changes
  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    dispatch(setSortOptions({ field, direction }));
  };
  
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`} style={{ maxHeight }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-4 space-y-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-[300px]" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Error Loading Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There was a problem loading the reviews. Please try again later.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!data || data.reviews.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>No Reviews Yet</CardTitle>
          <CardDescription>Be the first to share your thoughts!</CardDescription>
        </CardHeader>
        <CardContent>
          <p>There are no reviews for this item yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  const { reviews, totalCount, totalPages } = data;
  
  // Render compact variant
  if (compact) {
    return (
      <div 
        className={`space-y-4 ${className} ${maxHeight ? 'overflow-auto pr-2' : ''}`} 
        style={maxHeight ? { maxHeight } : {}}
      >
        {allowFiltering && (
          <div className="flex justify-between mb-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{totalCount} {totalCount === 1 ? 'review' : 'reviews'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {allowSorting && (
                <Select
                  value={`${sortOptions.field}:${sortOptions.direction}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split(':');
                    handleSortChange(field, direction as 'asc' | 'desc');
                  }}
                >
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt:desc">Newest</SelectItem>
                    <SelectItem value="createdAt:asc">Oldest</SelectItem>
                    <SelectItem value="rating:desc">Highest Rated</SelectItem>
                    <SelectItem value="rating:asc">Lowest Rated</SelectItem>
                    <SelectItem value="helpfulVotes:desc">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="border-b pb-3 last:border-0"
              onClick={() => handleViewReview(review)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={review.author.avatarUrl} alt={review.author.name} />
                    <AvatarFallback>{review.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <div className="font-medium text-sm">{review.author.name}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</div>
                  </div>
                </div>
                
                {review.rating && (
                  <StarRating rating={review.rating.overall} />
                )}
              </div>
              
              {review.title && (
                <h4 className="font-medium mt-2">{review.title}</h4>
              )}
              
              <p className="text-sm mt-1 line-clamp-2">
                {(review.content.type === 'plain_text' 
                  ? review.content.text 
                  : review.content.blocks.map(b => b.content).join(' '))}
              </p>
              
              {review.attachments && review.attachments.length > 0 && (
                <div className="flex mt-2 gap-1">
                  <Badge variant="outline" className="text-xs">
                    <Image className="h-3 w-3 mr-1" />
                    {review.attachments.length} {review.attachments.length === 1 ? 'image' : 'images'}
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <ThumbsUp 
                    className={`h-3 w-3 mr-1 ${helpfulVotes.includes(review.id) ? 'fill-primary text-primary' : ''}`} 
                  />
                  {review.helpfulVotes}
                </div>
                <div className="flex items-center">
                  <ThumbsDown 
                    className={`h-3 w-3 mr-1 ${unhelpfulVotes.includes(review.id) ? 'fill-primary text-primary' : ''}`}
                  />
                  {review.unhelpfulVotes}
                </div>
                {review.childrenCount > 0 && (
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {review.childrenCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Render standard variant
  return (
    <div className={className}>
      {allowFiltering && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium">
              {totalCount} {totalCount === 1 ? 'Review' : 'Reviews'}
            </h3>
            
            {data.reviews.length > 0 && data.reviews[0].rating && (
              <div className="flex items-center ml-2">
                <StarRating rating={data.reviews.reduce((acc, review) => acc + (review.rating?.overall || 0), 0) / data.reviews.length} />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {allowFiltering && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleFilterChange('verified', true)}>
                    <Check className="h-4 w-4 mr-2" />
                    Verified Purchases
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('rating', [4, 5])}>
                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                    4+ Stars
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('hasMedia', true)}>
                    <Image className="h-4 w-4 mr-2" />
                    With Images
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleFilterChange('rating', undefined)}>
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {allowSorting && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9">
                    {sortOptions.direction === 'asc' ? (
                      <SortAsc className="h-4 w-4 mr-2" />
                    ) : (
                      <SortDesc className="h-4 w-4 mr-2" />
                    )}
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleSortChange('createdAt', 'desc')}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('createdAt', 'asc')}>
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('rating', 'desc')}>
                    Highest Rating
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('rating', 'asc')}>
                    Lowest Rating
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('helpfulVotes', 'desc')}>
                    Most Helpful
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}
      
      <div 
        className="space-y-4" 
        style={maxHeight ? { maxHeight, overflowY: 'auto', paddingRight: '8px' } : {}}
      >
        {reviews.map((review) => (
          <Card key={review.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex">
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
                    <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                
                {review.rating && (
                  <StarRating rating={review.rating.overall} />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              {review.title && (
                <h3 className="text-lg font-medium mb-2">{review.title}</h3>
              )}
              
              <div 
                className="text-sm"
                onClick={() => handleViewReview(review)}
              >
                {review.content.type === 'plain_text' 
                  ? <p>{review.content.text}</p>
                  : review.content.blocks.map((block, index) => (
                      <div key={index} className="mb-2">
                        {block.type === 'paragraph' && <p>{block.content}</p>}
                        {block.type === 'heading' && <h4 className="font-medium">{block.content}</h4>}
                        {block.type === 'list' && <ul className="list-disc pl-5"><li>{block.content}</li></ul>}
                        {block.type === 'quote' && (
                          <blockquote className="border-l-2 pl-4 italic">{block.content}</blockquote>
                        )}
                      </div>
                    ))
                }
              </div>
              
              {/* Attachment previews */}
              {review.attachments && review.attachments.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-auto pb-2">
                  {review.attachments.map((attachment, index) => (
                    attachment.type === 'image' ? (
                      <div 
                        key={attachment.id}
                        className="flex-shrink-0 w-20 h-20 rounded overflow-hidden border cursor-pointer"
                        onClick={() => handleViewReview(review)}
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
            </CardContent>
            
            <CardFooter className="pt-1 pb-3 flex justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs h-8 gap-1 ${helpfulVotes.includes(review.id) ? 'bg-primary/10 text-primary' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(review.id, 'helpful');
                  }}
                >
                  <ThumbsUp className={`h-4 w-4 ${helpfulVotes.includes(review.id) ? 'fill-primary' : ''}`} />
                  <span>Helpful ({review.helpfulVotes})</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs h-8 gap-1 ${unhelpfulVotes.includes(review.id) ? 'bg-primary/10 text-primary' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(review.id, 'unhelpful');
                  }}
                >
                  <ThumbsDown className={`h-4 w-4 ${unhelpfulVotes.includes(review.id) ? 'fill-primary' : ''}`} />
                  <span>Not Helpful ({review.unhelpfulVotes})</span>
                </Button>
                
                {review.childrenCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 gap-1"
                    onClick={() => handleViewReview(review)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Replies ({review.childrenCount})</span>
                  </Button>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewReview(review)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={reportedReviews.includes(review.id) ? 'text-muted-foreground' : ''}
                    disabled={reportedReviews.includes(review.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!reportedReviews.includes(review.id)) {
                        handleReport(review.id);
                      }
                    }}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {reportedReviews.includes(review.id) ? 'Reported' : 'Report'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center justify-center px-4 border rounded">
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};