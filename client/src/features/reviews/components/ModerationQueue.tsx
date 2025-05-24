import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectModerationQueueFilters,
  setModerationQueueFilters,
  resetModerationQueueFilters,
  openModerationModal,
} from '../reviewsSlice';
import { useGetModerationQueueQuery, useAssignModerationItemMutation } from '../reviewsApi';
import { ModerationQueueItem, ModerationQueueFilters, ReviewStatus, ModerationType, ReportReason, ContentType } from '../types';
import { ModerationModal } from './ModerationModal';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Filter, 
  RefreshCcw, 
  Eye, 
  User, 
  CheckCircle,
  XCircle,
  Flag,
  ShieldAlert,
  Clock,
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

// Badge component for review status
const StatusBadge = ({ status }: { status: ReviewStatus }) => {
  const statusConfigs = {
    'pending': { variant: 'outline', className: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Clock className="h-3 w-3 mr-1" /> },
    'approved': { variant: 'outline', className: 'bg-green-50 text-green-700 border-green-200', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
    'rejected': { variant: 'outline', className: 'bg-red-50 text-red-700 border-red-200', icon: <XCircle className="h-3 w-3 mr-1" /> },
    'flagged': { variant: 'outline', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Flag className="h-3 w-3 mr-1" /> },
    'hidden': { variant: 'outline', className: 'bg-slate-50 text-slate-700 border-slate-200', icon: <ShieldAlert className="h-3 w-3 mr-1" /> }
  };
  
  const config = statusConfigs[status] || statusConfigs.pending;
  
  return (
    <Badge variant="outline" className={`${config.className} flex items-center`}>
      {config.icon}
      <span className="capitalize">{status}</span>
    </Badge>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: 'low' | 'medium' | 'high' | 'urgent' }) => {
  const priorityConfigs = {
    'low': { className: 'bg-blue-50 text-blue-700 border-blue-200' },
    'medium': { className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    'high': { className: 'bg-orange-50 text-orange-700 border-orange-200' },
    'urgent': { className: 'bg-red-50 text-red-700 border-red-200' }
  };
  
  const config = priorityConfigs[priority];
  
  return (
    <Badge variant="outline" className={`${config.className} capitalize`}>
      {priority}
    </Badge>
  );
};

interface ModerationQueueProps {
  userId: string;
  className?: string;
}

export const ModerationQueue: React.FC<ModerationQueueProps> = ({ userId, className = '' }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const filters = useSelector(selectModerationQueueFilters);
  
  // Query the moderation queue
  const { data, isLoading, error, refetch } = useGetModerationQueueQuery({
    filters: {
      ...filters,
      status: activeTab !== 'all' ? activeTab as ReviewStatus : undefined
    },
    page,
    limit: pageSize
  });
  
  // Assign item mutation
  const [assignItem, { isLoading: isAssigning }] = useAssignModerationItemMutation();
  
  // Handle filter changes
  const handleFilterChange = (key: keyof ModerationQueueFilters, value: any) => {
    dispatch(setModerationQueueFilters({ [key]: value }));
  };
  
  // Handle assigning a review to the current user
  const handleAssignToMe = async (item: ModerationQueueItem) => {
    try {
      await assignItem({
        reviewId: item.reviewId,
        userId
      }).unwrap();
      
      toast({
        title: "Review Assigned",
        description: "The review has been assigned to you for moderation.",
      });
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "There was a problem assigning this review to you.",
        variant: "destructive",
      });
    }
  };
  
  // Handle opening the moderation modal
  const handleModerate = (item: ModerationQueueItem) => {
    dispatch(openModerationModal(item.reviewId));
  };
  
  // Render content based on loading and error states
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
          <CardDescription>Loading moderation items...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
          <CardDescription>There was a problem loading the moderation queue.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-center mb-4">
              We encountered an error while loading the moderation queue. Please try again later.
            </p>
            <Button onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Moderation Queue</CardTitle>
            <CardDescription>
              Manage and moderate reported content. {data?.totalCount || 0} items requiring attention.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filter Controls */}
        <div className="mb-4 flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[180px]">
            <Label htmlFor="moderationType" className="text-xs mb-1 block">Moderation Type</Label>
            <Select 
              value={filters.moderationType || ''} 
              onValueChange={value => handleFilterChange('moderationType', value || undefined)}
            >
              <SelectTrigger id="moderationType">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[180px]">
            <Label htmlFor="reportReason" className="text-xs mb-1 block">Report Reason</Label>
            <Select 
              value={filters.reportReason || ''} 
              onValueChange={value => handleFilterChange('reportReason', value || undefined)}
            >
              <SelectTrigger id="reportReason">
                <SelectValue placeholder="All reasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All reasons</SelectItem>
                <SelectItem value="inappropriate">Inappropriate</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="offensive">Offensive</SelectItem>
                <SelectItem value="misleading">Misleading</SelectItem>
                <SelectItem value="off-topic">Off-topic</SelectItem>
                <SelectItem value="private_info">Private Info</SelectItem>
                <SelectItem value="plagiarism">Plagiarism</SelectItem>
                <SelectItem value="hate_speech">Hate Speech</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[180px]">
            <Label htmlFor="contentType" className="text-xs mb-1 block">Content Type</Label>
            <Select 
              value={filters.contentType || ''} 
              onValueChange={value => handleFilterChange('contentType', value || undefined)}
            >
              <SelectTrigger id="contentType">
                <SelectValue placeholder="All content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All content</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="app">App</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[180px]">
            <Label htmlFor="minReports" className="text-xs mb-1 block">Min Reports</Label>
            <Input
              id="minReports"
              type="number"
              min={1}
              value={filters.minReports || ''}
              onChange={e => handleFilterChange('minReports', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Any number"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => dispatch(resetModerationQueueFilters())}
            className="mb-px"
          >
            <Filter className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
        
        {/* Tabs for different statuses */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Moderation Queue Table */}
        {data && data.items.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Reports</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.reviewId}>
                    <TableCell className="align-top">
                      <div>
                        <div className="font-medium mb-1 truncate max-w-[230px]">
                          {item.review.title || "Review #" + item.reviewId.substring(0, 8)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                          <User className="h-3 w-3" />
                          {item.review.author.name}
                        </div>
                        <p className="text-xs line-clamp-2">
                          {item.review.content.type === 'plain_text' 
                            ? item.review.content.text 
                            : item.review.content.blocks.map(b => b.content).join(' ')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={item.priority} />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{item.reportsCount}</span> reports
                      </div>
                      {item.topReportReasons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.topReportReasons.slice(0, 2).map((reason) => (
                            <Badge key={reason} variant="secondary" className="text-xs">
                              {reason.replace('_', ' ')}
                            </Badge>
                          ))}
                          {item.topReportReasons.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.topReportReasons.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="text-sm text-muted-foreground">
                            {formatDate(item.addedToQueueAt).split(",")[0]}
                          </TooltipTrigger>
                          <TooltipContent>
                            {formatDate(item.addedToQueueAt)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleModerate(item)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        
                        {!item.assignedTo && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAssignToMe(item)}
                            disabled={isAssigning}
                          >
                            {isAssigning ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>Assign To Me</>
                            )}
                          </Button>
                        )}
                        
                        {item.assignedTo === userId && (
                          <Badge className="bg-primary text-primary-foreground">
                            Assigned to you
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">Queue is Empty</h3>
            <p className="text-muted-foreground max-w-md">
              There are no items in the moderation queue that match your filters. 
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </CardContent>
      
      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <CardFooter className="flex justify-between items-center border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, data.totalCount)} of {data.totalCount} items
          </div>
          
          <div className="flex space-x-2">
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
              onClick={() => setPage(prev => Math.min(prev + 1, data.totalPages))}
              disabled={page === data.totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      )}
      
      {/* Moderation Modal */}
      <ModerationModal moderatorId={userId} />
    </Card>
  );
};