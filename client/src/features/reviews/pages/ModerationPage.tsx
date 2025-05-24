import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, CheckCircle, Clock, Eye, MessageSquare, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { UserRole } from '@/types';

interface ModerationProps {
  userId: string;
}

// Mock moderation data - in a real app this would come from an API or Redux store
const mockReportedContent = [
  {
    id: 'rep1',
    contentId: 'rev123',
    contentType: 'review',
    contentText: 'This product is terrible and the company is a scam. Don\'t waste your money on this garbage!',
    authorId: 'user456',
    authorName: 'AngryShopper',
    productId: 'prod789',
    productName: 'Premium Wireless Headphones',
    reportedBy: 'user789',
    reportReason: 'inappropriate_language',
    reportedAt: '2025-05-22T14:30:00Z',
    status: 'pending',
  },
  {
    id: 'rep2',
    contentId: 'rev456',
    contentType: 'review',
    contentText: 'The seller never shipped my item and won\'t respond to messages. Complete fraud!',
    authorId: 'user123',
    authorName: 'DisappointedBuyer',
    productId: 'prod456',
    productName: 'Smart Watch Pro',
    reportedBy: 'seller123',
    reportReason: 'false_information',
    reportedAt: '2025-05-21T09:15:00Z',
    status: 'in_review',
    assignedTo: 'admin',
  },
  {
    id: 'rep3',
    contentId: 'qa789',
    contentType: 'question',
    contentText: 'Is this product compatible with iPhone? I see lots of compatibility issues reported.',
    authorId: 'user789',
    authorName: 'TechSavvy',
    productId: 'prod123',
    productName: 'Bluetooth Earbuds',
    reportedBy: 'seller456',
    reportReason: 'misinformation',
    reportedAt: '2025-05-20T16:45:00Z',
    status: 'in_review',
    assignedTo: 'admin',
  },
];

// This would normally come from the API
const totals = {
  pending: 14,
  inReview: 8,
  resolved: 126,
  actionTaken: 87,
};

const ModerationPage: React.FC<ModerationProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending</Badge>;
      case 'in_review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">In Review</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getReportReasonText = (reason: string) => {
    switch (reason) {
      case 'inappropriate_language':
        return 'Inappropriate Language';
      case 'false_information':
        return 'False Information';
      case 'misinformation':
        return 'Misinformation';
      case 'spam':
        return 'Spam';
      case 'offensive':
        return 'Offensive Content';
      default:
        return 'Other';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Moderation</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Assigned to Me
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{totals.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">In Review</p>
              <p className="text-2xl font-bold">{totals.inReview}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold">{totals.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Action Taken</p>
              <p className="text-2xl font-bold">{totals.actionTaken}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in-review">In Review</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
              
              <div className="p-4 max-h-[600px] overflow-y-auto">
                {mockReportedContent.map((item) => (
                  <div 
                    key={item.id}
                    className={`mb-3 p-3 rounded-md cursor-pointer border transition-colors ${
                      selectedItem === item.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedItem(item.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>
                            {item.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{item.authorName}</span>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                    
                    <p className="text-sm line-clamp-2 mb-2 text-gray-700 dark:text-gray-300">
                      {item.contentText}
                    </p>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(item.reportedAt).toLocaleDateString()}</span>
                      <span className="flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
                        {getReportReasonText(item.reportReason)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedItem ? (
            <Card className="p-6">
              {/* Detailed view of the selected item */}
              {(() => {
                const item = mockReportedContent.find(i => i.id === selectedItem);
                if (!item) return <p>Item not found</p>;
                
                return (
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-xl font-bold mb-1">Review Moderation</h2>
                        <p className="text-gray-500 text-sm">Content ID: {item.contentId}</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                    
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback>{item.authorName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.authorName}</p>
                            <p className="text-xs text-gray-500">
                              Posted for: {item.productName}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(item.reportedAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {item.contentText}
                      </p>
                      
                      <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>24</span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          <span>3</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>5 replies</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Report Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="text-sm text-gray-500 mb-1">Reported By</p>
                          <p className="font-medium">User #{item.reportedBy}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="text-sm text-gray-500 mb-1">Reason</p>
                          <p className="font-medium">{getReportReasonText(item.reportReason)}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="text-sm text-gray-500 mb-1">Date Reported</p>
                          <p className="font-medium">{new Date(item.reportedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="text-sm text-gray-500 mb-1">Status</p>
                          <p className="font-medium capitalize">{item.status.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Moderation Actions</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          Approve Content
                        </Button>
                        <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-300 hover:bg-yellow-50">
                          Hide Temporarily
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                          Remove Content
                        </Button>
                        <Button variant="outline" size="sm">
                          Request Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Send Warning
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Moderator Notes</h3>
                      <textarea 
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md h-24 resize-none"
                        placeholder="Add notes about this moderation case..."
                      />
                      <div className="flex justify-end mt-4">
                        <Button>Save Decision</Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="text-gray-400 mb-4">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-medium">No Content Selected</h3>
              </div>
              <p className="text-gray-500 max-w-md">
                Select an item from the list to view details and take moderation actions.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModerationPage;