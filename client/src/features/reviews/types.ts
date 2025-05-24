// Review System Types

// Base types
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged' | 'hidden';
export type ContentType = 'product' | 'seller' | 'order' | 'service' | 'video' | 'article' | 'app';
export type ReviewType = 'review' | 'question' | 'answer' | 'comment' | 'reply';
export type ModerationType = 'automatic' | 'community' | 'admin' | 'none';
export type ReportReason = 
  | 'inappropriate' 
  | 'spam' 
  | 'offensive' 
  | 'misleading' 
  | 'off-topic' 
  | 'private_info' 
  | 'plagiarism'
  | 'hate_speech'
  | 'harassment'
  | 'other';

// Review content interfaces
export interface RichTextContent {
  type: 'rich_text';
  blocks: {
    type: 'paragraph' | 'heading' | 'list' | 'quote' | 'image' | 'code';
    content: string;
    metadata?: Record<string, any>;
  }[];
}

export interface PlainTextContent {
  type: 'plain_text';
  text: string;
}

export interface MediaAttachment {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video' | 'document';
  contentType: string;
  filename: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  uploadedAt: string;
}

export interface ReviewRating {
  overall: number; // 1-5 stars
  aspects?: {
    [key: string]: number; // e.g., { quality: 5, value: 4, service: 3 }
  };
}

// Main Review Interface
export interface Review {
  id: string;
  title?: string;
  content: PlainTextContent | RichTextContent;
  contentType: ContentType;
  contentId: string; // ID of the product/seller/etc. being reviewed
  type: ReviewType;
  status: ReviewStatus;
  rating?: ReviewRating;
  helpfulVotes: number;
  unhelpfulVotes: number;
  totalVotes: number;
  verified: boolean; // Verified purchase or interaction
  attachments?: MediaAttachment[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    badges?: string[];
    isVerified?: boolean;
  };
  
  // Moderation info
  moderation: {
    type: ModerationType;
    status: ReviewStatus;
    moderatedAt?: string;
    moderatedBy?: string;
    reason?: string;
    notes?: string;
  };
  
  // Relationships
  parentId?: string; // For Q&A and replies
  childrenIds: string[]; // IDs of child reviews (replies, answers)
  childrenCount: number;
  
  // Reporting and abuse
  reports: ReviewReport[];
  reportsCount: number;
}

// Reporting Interface
export interface ReviewReport {
  id: string;
  reviewId: string;
  reason: ReportReason;
  description?: string;
  status: 'pending' | 'reviewed' | 'actioned' | 'dismissed';
  reportedBy: string;
  reportedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  action?: string;
}

// Seller Response Interface
export interface SellerResponse {
  id: string;
  reviewId: string;
  content: PlainTextContent | RichTextContent;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
  status: ReviewStatus;
}

// User Interaction Interface
export interface UserReviewInteraction {
  userId: string;
  reviewId: string;
  type: 'helpful' | 'unhelpful' | 'report' | 'save';
  timestamp: string;
}

// Community Moderation Interface
export interface ModerationAction {
  id: string;
  reviewId: string;
  type: 'flag' | 'approve' | 'reject' | 'hide' | 'restore';
  actorId: string;
  actorType: 'user' | 'admin' | 'system' | 'seller';
  reason?: string;
  notes?: string;
  timestamp: string;
  status: ReviewStatus; // The new status after this action
}

// Feedback Form Interface
export interface FeedbackForm {
  id: string;
  title: string;
  description?: string;
  fields: FeedbackFormField[];
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
  targetEntityType?: ContentType;
  targetEntityId?: string;
  responseCount: number;
}

export interface FeedbackFormField {
  id: string;
  formId: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'rating' | 'date';
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  order: number;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface FeedbackResponse {
  id: string;
  formId: string;
  userId?: string;
  responses: {
    fieldId: string;
    value: string | string[] | number;
  }[];
  createdAt: string;
  metadata?: {
    browserInfo?: string;
    ipAddress?: string;
    source?: string;
    referrer?: string;
  };
  status: 'submitted' | 'processing' | 'processed' | 'flagged';
}

// Filter and sorting interfaces
export interface ReviewFilters {
  contentType?: ContentType;
  contentId?: string;
  reviewType?: ReviewType;
  status?: ReviewStatus;
  rating?: number | number[];
  verified?: boolean;
  hasMedia?: boolean;
  dateRange?: {
    from?: string;
    to?: string;
  };
  authorId?: string;
  parentId?: string;
  searchTerm?: string;
  moderation?: {
    status?: ReviewStatus;
    type?: ModerationType;
  };
}

export interface ReviewSortOptions {
  field: 'createdAt' | 'updatedAt' | 'rating' | 'helpfulVotes' | 'totalVotes' | 'childrenCount';
  direction: 'asc' | 'desc';
}

// Review Analytics
export interface ReviewAnalytics {
  contentId: string;
  contentType: ContentType;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  aspectRatings?: {
    [aspect: string]: number;
  };
  verifiedReviewsPercentage: number;
  withMediaPercentage: number;
  responseRate: number; // percentage of reviews with a seller response
  reviewsOverTime: {
    period: string; // e.g., '2023-01', '2023-02'
    count: number;
    averageRating: number;
  }[];
}

// Requests/Responses for API
export interface CreateReviewRequest {
  title?: string;
  content: PlainTextContent | RichTextContent;
  contentType: ContentType;
  contentId: string;
  type: ReviewType;
  rating?: ReviewRating;
  attachments?: string[]; // List of attachment IDs that were previously uploaded
  parentId?: string; // For replies and answers
}

export interface UpdateReviewRequest {
  id: string;
  title?: string;
  content?: PlainTextContent | RichTextContent;
  rating?: ReviewRating;
  attachments?: string[]; // List of attachment IDs
}

export interface ReviewVoteRequest {
  reviewId: string;
  voteType: 'helpful' | 'unhelpful';
}

export interface ReportReviewRequest {
  reviewId: string;
  reason: ReportReason;
  description?: string;
}

export interface ModerateReviewRequest {
  reviewId: string;
  action: 'approve' | 'reject' | 'flag' | 'hide' | 'restore';
  reason?: string;
  notes?: string;
}

export interface CreateSellerResponseRequest {
  reviewId: string;
  content: PlainTextContent | RichTextContent;
}

export interface GetReviewsRequest {
  filters?: ReviewFilters;
  sorting?: ReviewSortOptions;
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface GetReviewsResponse {
  reviews: Review[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetReviewAnalyticsResponse {
  analytics: ReviewAnalytics;
}

export interface ModerationQueueFilters {
  status?: ReviewStatus;
  moderationType?: ModerationType;
  reportReason?: ReportReason;
  contentType?: ContentType;
  minReports?: number;
  dateRange?: {
    from?: string;
    to?: string;
  };
  assignedTo?: string;
}

export interface ModerationQueueItem {
  reviewId: string;
  review: Review;
  reportsCount: number;
  topReportReasons: ReportReason[];
  status: ReviewStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  addedToQueueAt: string;
}

export interface GetModerationQueueResponse {
  items: ModerationQueueItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}