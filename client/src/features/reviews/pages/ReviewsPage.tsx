import React, { useState } from 'react';
import { useParams } from '@/router/wouterCompat';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Star, MessageSquare, HelpCircle, Filter, SortDesc } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserRole } from '@/types';

interface ReviewsPageProps {
  contentType?: string;
  contentId?: string;
  title?: string;
  description?: string;
}

// Mock review data - in a real app this would come from an API or Redux store
const mockReviews = [
  {
    id: 'rev1',
    productId: '1',
    title: 'Outstanding quality and comfort',
    content: 'These headphones have completely transformed my listening experience. The noise cancellation is outstanding, and the sound quality is crystal clear with deep bass. Battery life is impressive - I\'ve used them for a week of commutes without recharging. Very comfortable for long periods too.',
    rating: 5,
    authorId: 'user123',
    authorName: 'AudioEnthusiast',
    createdAt: '2025-05-15T10:30:00Z',
    helpfulVotes: 42,
    totalVotes: 45,
    verified: true,
    images: ['/images/review1.jpg', '/images/review2.jpg'],
    replies: [
      {
        id: 'rep1',
        authorId: 'seller1',
        authorName: 'SoundMasters Support',
        isSeller: true,
        content: 'Thank you for your kind words! We\'re thrilled to hear you\'re enjoying the headphones. Feel free to reach out if you have any questions about features or settings.',
        createdAt: '2025-05-16T14:20:00Z',
      }
    ]
  },
  {
    id: 'rev2',
    productId: '1',
    title: 'Good, but not perfect',
    content: 'Sound quality is excellent, and noise cancellation works well in most environments. My only complaints are that the ear cups get a bit warm after extended use, and the app occasionally disconnects. Still, I\'m happy with the purchase overall and would recommend them.',
    rating: 4,
    authorId: 'user456',
    authorName: 'TechReviewer',
    createdAt: '2025-05-10T15:45:00Z',
    helpfulVotes: 28,
    totalVotes: 30,
    verified: true,
    images: [],
    replies: []
  },
  {
    id: 'rev3',
    productId: '1',
    title: 'Disappointing battery life',
    content: 'While the sound quality is good, I\'m very disappointed with the battery life. The product claims 30 hours, but I\'m only getting about 15-18 hours on a single charge. The noise cancellation is also not as effective as advertised. Customer service was responsive but couldn\'t resolve my issues.',
    rating: 2,
    authorId: 'user789',
    authorName: 'MusicLover22',
    createdAt: '2025-05-05T09:15:00Z',
    helpfulVotes: 15,
    totalVotes: 22,
    verified: true,
    images: ['/images/battery-stats.jpg'],
    replies: [
      {
        id: 'rep2',
        authorId: 'seller1',
        authorName: 'SoundMasters Support',
        isSeller: true,
        content: 'We\'re sorry to hear about your battery life issues. This is unusual for our product. Please contact our support team again so we can troubleshoot further or arrange a replacement if needed.',
        createdAt: '2025-05-06T11:30:00Z',
      }
    ]
  }
];

// Mock Q&A data
const mockQAs = [
  {
    id: 'qa1',
    productId: '1',
    question: 'Are these headphones compatible with iPhone 15?',
    authorId: 'user123',
    authorName: 'PotentialBuyer',
    createdAt: '2025-05-12T14:20:00Z',
    answers: [
      {
        id: 'ans1',
        authorId: 'seller1',
        authorName: 'SoundMasters Support',
        isSeller: true,
        content: 'Yes, these headphones are fully compatible with all iPhone models including the iPhone 15. They connect via Bluetooth 5.2 for optimal performance.',
        createdAt: '2025-05-12T16:45:00Z',
        helpfulVotes: 12,
      },
      {
        id: 'ans2',
        authorId: 'user456',
        authorName: 'AppleUser',
        isSeller: false,
        content: 'I\'ve been using them with my iPhone 15 Pro for a month with no issues. Pairing is quick and connection is stable.',
        createdAt: '2025-05-13T09:30:00Z',
        helpfulVotes: 8,
      }
    ]
  },
  {
    id: 'qa2',
    productId: '1',
    question: 'How well do they work for phone calls in noisy environments?',
    authorId: 'user789',
    authorName: 'BusyCommuter',
    createdAt: '2025-05-08T08:15:00Z',
    answers: [
      {
        id: 'ans3',
        authorId: 'user101',
        authorName: 'DailyUser',
        isSeller: false,
        content: 'I use them for calls while walking on busy streets and in coffee shops. The noise cancellation for your ears is excellent, and the microphone does a good job of isolating your voice, though not perfect in very loud environments.',
        createdAt: '2025-05-08T10:20:00Z',
        helpfulVotes: 15,
      }
    ]
  }
];

const ReviewsPage: React.FC<ReviewsPageProps> = ({ 
  contentType: propsContentType, 
  contentId: propsContentId,
  title = 'Reviews',
  description
}) => {
  const params = useParams();
  const contentType = propsContentType || params.contentType || 'product';
  const contentId = propsContentId || params.contentId || '1';
  
  const [activeTab, setActiveTab] = useState('reviews');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'helpful', or 'rating'
  
  // Filter reviews based on rating filter
  const filteredReviews = mockReviews.filter(review => {
    if (ratingFilter === null) return true;
    return review.rating === ratingFilter;
  });
  
  // Sort reviews based on sort option
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'helpful') {
      return b.helpfulVotes - a.helpfulVotes;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });
  
  // Calculate average rating
  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
  
  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockReviews.filter(review => review.rating === rating).length,
    percentage: (mockReviews.filter(review => review.rating === rating).length / mockReviews.length) * 100
  }));

  return (
    <div className="container mx-auto px-4 py-6">
      {title && <h1 className="text-2xl font-bold mb-2">{title}</h1>}
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with rating summary */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Customer Feedback</h2>
            
            <div className="flex items-center mb-3">
              <div className="text-3xl font-bold mr-3">{averageRating.toFixed(1)}</div>
              <div>
                <div className="flex text-yellow-500 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i <= Math.round(averageRating) ? 'fill-yellow-500' : ''}`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">{mockReviews.length} reviews</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              {ratingDistribution.map(dist => (
                <div key={dist.rating} className="flex items-center text-sm">
                  <button 
                    className={`flex items-center min-w-[60px] hover:text-primary ${ratingFilter === dist.rating ? 'font-semibold text-primary' : ''}`}
                    onClick={() => setRatingFilter(dist.rating === ratingFilter ? null : dist.rating)}
                  >
                    {dist.rating} stars
                  </button>
                  <div className="flex-1 mx-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${dist.percentage}%` }} 
                    />
                  </div>
                  <span className="text-gray-500 min-w-[30px] text-right">{dist.count}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setRatingFilter(null)}>
                <Filter className="w-4 h-4 mr-2" />
                {ratingFilter === null ? 'All Ratings' : 'Clear Filter'}
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant={sortBy === 'recent' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSortBy('recent')}
                  className="flex-1"
                >
                  Newest
                </Button>
                <Button 
                  variant={sortBy === 'helpful' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSortBy('helpful')}
                  className="flex-1"
                >
                  Most Helpful
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="reviews" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="reviews" className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="questions" className="flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                Questions & Answers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="reviews">
              {/* Review submission CTA */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Share your experience</h3>
                    <p className="text-sm text-gray-500">Help other shoppers by leaving a review</p>
                  </div>
                  <Button className="mt-3 sm:mt-0">
                    Write a Review
                  </Button>
                </div>
              </div>
              
              {/* Reviews list */}
              {sortedReviews.length > 0 ? (
                <div className="space-y-6">
                  {sortedReviews.map(review => (
                    <Card key={review.id} className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{review.title}</h3>
                          <div className="flex items-center text-sm mt-1 space-x-2">
                            <div className="flex text-yellow-500">
                              {[1, 2, 3, 4, 5].map(i => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i <= review.rating ? 'fill-yellow-500' : ''}`} 
                                />
                              ))}
                            </div>
                            <span className="text-gray-500">|</span>
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            {review.verified && (
                              <>
                                <span className="text-gray-500">|</span>
                                <span className="text-green-600">Verified Purchase</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">{review.authorName}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{review.content}</p>
                      
                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {review.images.map((image, idx) => (
                            <div key={idx} className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                              <span className="text-xs text-gray-500">Image</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <button className="text-gray-500 hover:text-gray-700 flex items-center">
                            <span className="mr-1">Helpful</span> ({review.helpfulVotes})
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Reply
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            Report
                          </button>
                        </div>
                      </div>
                      
                      {/* Seller responses */}
                      {review.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                          {review.replies.map(reply => (
                            <div key={reply.id} className="mt-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                              <div className="flex items-center mb-2">
                                <span className="font-medium">{reply.authorName}</span>
                                {reply.isSeller && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    Seller
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No reviews matching your filter criteria. Try adjusting your filters or be the first to leave a review.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="questions">
              {/* Q&A submission CTA */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Have a question?</h3>
                    <p className="text-sm text-gray-500">Ask the community or the seller</p>
                  </div>
                  <Button className="mt-3 sm:mt-0">
                    Ask a Question
                  </Button>
                </div>
              </div>
              
              {/* Questions list */}
              <div className="space-y-6">
                {mockQAs.map(qa => (
                  <Card key={qa.id} className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium mb-1">Q: {qa.question}</div>
                        <div className="text-xs text-gray-500">
                          Asked by {qa.authorName} on {new Date(qa.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {qa.answers.map((answer, idx) => (
                      <div key={answer.id} className={`ml-11 p-3 ${idx === 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'} rounded-md mb-2`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-sm flex items-center">
                            {answer.authorName}
                            {answer.isSeller && (
                              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                Seller
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(answer.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm mb-2">{answer.content}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <button className="hover:text-gray-700">
                            Helpful ({answer.helpfulVotes})
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="ml-11 mt-2">
                      <Button variant="ghost" size="sm">
                        Answer this question
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;