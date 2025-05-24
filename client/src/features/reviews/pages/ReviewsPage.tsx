import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useSelector } from 'react-redux';
import { selectFeatures } from '../reviewsSlice';
import { 
  ReviewList, 
  ReviewForm, 
  ReviewDetail, 
  ReportModal 
} from '../components';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Star, 
  FileQuestion, 
  Image, 
  ThumbsUp,
  SlidersHorizontal
} from 'lucide-react';

interface ReviewsPageProps {
  contentType: 'product' | 'seller' | 'order' | 'service' | 'video' | 'article' | 'app';
  contentId: string;
  title: string;
  description?: string;
  className?: string;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  contentType,
  contentId,
  title,
  description,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [showForm, setShowForm] = useState(false);
  const features = useSelector(selectFeatures);
  
  // Handle review form submission
  const handleFormSuccess = () => {
    setShowForm(false);
  };
  
  return (
    <div className={`${className} space-y-6`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="reviews" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="reviews" className="flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex items-center">
                  <FileQuestion className="h-4 w-4 mr-2" />
                  Q&A
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center">
                  <Image className="h-4 w-4 mr-2" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="most-helpful" className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Most Helpful
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden md:inline">Filter</span>
                </Button>
                
                {!showForm && (
                  <Button
                    onClick={() => setShowForm(true)}
                    size="sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>
                      {activeTab === 'reviews' 
                        ? 'Write a Review' 
                        : activeTab === 'questions' 
                          ? 'Ask a Question' 
                          : 'Leave Feedback'}
                    </span>
                  </Button>
                )}
              </div>
            </div>
            
            {showForm && (
              <div className="mb-6">
                <ReviewForm
                  reviewType={activeTab === 'reviews' ? 'review' : 'question'}
                  contentType={contentType}
                  contentId={contentId}
                  onSuccess={handleFormSuccess}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}
            
            <TabsContent value="reviews" className="space-y-4">
              <ReviewList
                contentType={contentType}
                contentId={contentId}
                initialFilters={{ 
                  contentType, 
                  contentId,
                  reviewType: 'review' 
                }}
              />
            </TabsContent>
            
            <TabsContent value="questions" className="space-y-4">
              <ReviewList
                contentType={contentType}
                contentId={contentId}
                initialFilters={{ 
                  contentType, 
                  contentId,
                  reviewType: 'question' 
                }}
              />
            </TabsContent>
            
            <TabsContent value="media" className="space-y-4">
              <ReviewList
                contentType={contentType}
                contentId={contentId}
                initialFilters={{ 
                  contentType, 
                  contentId,
                  hasMedia: true 
                }}
              />
            </TabsContent>
            
            <TabsContent value="most-helpful" className="space-y-4">
              <ReviewList
                contentType={contentType}
                contentId={contentId}
                initialFilters={{ 
                  contentType, 
                  contentId
                }}
                allowSorting={false}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Include modals */}
      <ReviewDetail />
      <ReportModal />
    </div>
  );
};