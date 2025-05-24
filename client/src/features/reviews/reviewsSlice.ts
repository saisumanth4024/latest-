import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { 
  Review, 
  ReviewFilters, 
  ReviewSortOptions,
  ReportReason,
  ContentType,
  ReviewType,
  ReviewStatus,
  ModerationType,
  ModerationQueueFilters
} from './types';
import { reviewsApi } from './reviewsApi';

// Define filter presets
export const DEFAULT_FILTERS: ReviewFilters = {
  status: 'approved'
};

export const TOP_RATED_FILTERS: ReviewFilters = {
  status: 'approved',
  rating: [4, 5]
};

export const VERIFIED_FILTERS: ReviewFilters = {
  status: 'approved',
  verified: true
};

export const WITH_MEDIA_FILTERS: ReviewFilters = {
  status: 'approved',
  hasMedia: true
};

export const DEFAULT_SORT: ReviewSortOptions = {
  field: 'createdAt',
  direction: 'desc'
};

// Define review form initial state
export interface ReviewFormState {
  contentType: ContentType;
  contentId: string;
  type: ReviewType;
  title: string;
  content: string;
  rating: number;
  aspectRatings: Record<string, number>;
  attachments: string[];
  parentId?: string;
  isUploading: boolean;
  isSubmitting: boolean;
  error?: string;
}

const initialReviewForm: ReviewFormState = {
  contentType: 'product',
  contentId: '',
  type: 'review',
  title: '',
  content: '',
  rating: 0,
  aspectRatings: {},
  attachments: [],
  isUploading: false,
  isSubmitting: false
};

// Define report form initial state
export interface ReportFormState {
  reviewId: string;
  reason: ReportReason;
  description: string;
  isSubmitting: boolean;
  error?: string;
}

const initialReportForm: ReportFormState = {
  reviewId: '',
  reason: 'inappropriate',
  description: '',
  isSubmitting: false
};

// Define moderation form initial state
export interface ModerationFormState {
  reviewId: string;
  action: 'approve' | 'reject' | 'flag' | 'hide' | 'restore';
  reason: string;
  notes: string;
  isSubmitting: boolean;
  error?: string;
}

const initialModerationForm: ModerationFormState = {
  reviewId: '',
  action: 'approve',
  reason: '',
  notes: '',
  isSubmitting: false
};

// Define response form initial state
export interface ResponseFormState {
  reviewId: string;
  content: string;
  isSubmitting: boolean;
  error?: string;
}

const initialResponseForm: ResponseFormState = {
  reviewId: '',
  content: '',
  isSubmitting: false
};

// Define reviews slice state
interface ReviewsState {
  // Current entity being reviewed
  currentContentType: ContentType;
  currentContentId: string;
  
  // Selected review to display details
  selectedReviewId: string | null;
  
  // Active filters and sorting
  filters: ReviewFilters;
  sortOptions: ReviewSortOptions;
  
  // User interactions cache
  userInteractions: {
    helpful: string[];
    unhelpful: string[];
    reported: string[];
    saved: string[];
  };
  
  // Form states
  reviewForm: ReviewFormState;
  reportForm: ReportFormState;
  moderationForm: ModerationFormState;
  responseForm: ResponseFormState;
  
  // Moderation queue filters
  moderationQueueFilters: ModerationQueueFilters;
  
  // UI states
  isRichTextEditorOpen: boolean;
  isMediaGalleryOpen: boolean;
  isReportModalOpen: boolean;
  isModerationModalOpen: boolean;
  isResponseModalOpen: boolean;
  isReviewDetailOpen: boolean;
  
  // Feature flags
  features: {
    richTextEnabled: boolean;
    mediaAttachmentsEnabled: boolean;
    communityModerationEnabled: boolean;
    sellerResponsesEnabled: boolean;
    aspectRatingsEnabled: boolean;
    verifiedBadgesEnabled: boolean;
  };
}

const initialState: ReviewsState = {
  // Current entity being reviewed
  currentContentType: 'product',
  currentContentId: '',
  
  // Selected review
  selectedReviewId: null,
  
  // Active filters and sorting
  filters: DEFAULT_FILTERS,
  sortOptions: DEFAULT_SORT,
  
  // User interactions cache
  userInteractions: {
    helpful: [],
    unhelpful: [],
    reported: [],
    saved: []
  },
  
  // Form states
  reviewForm: initialReviewForm,
  reportForm: initialReportForm,
  moderationForm: initialModerationForm,
  responseForm: initialResponseForm,
  
  // Moderation queue filters
  moderationQueueFilters: {
    status: 'pending'
  },
  
  // UI states
  isRichTextEditorOpen: false,
  isMediaGalleryOpen: false,
  isReportModalOpen: false,
  isModerationModalOpen: false,
  isResponseModalOpen: false,
  isReviewDetailOpen: false,
  
  // Feature flags
  features: {
    richTextEnabled: true,
    mediaAttachmentsEnabled: true,
    communityModerationEnabled: true,
    sellerResponsesEnabled: true,
    aspectRatingsEnabled: true,
    verifiedBadgesEnabled: true
  }
};

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    // Set current content being reviewed
    setCurrentContent: (state, action: PayloadAction<{ contentType: ContentType; contentId: string }>) => {
      const { contentType, contentId } = action.payload;
      state.currentContentType = contentType;
      state.currentContentId = contentId;
      
      // Reset review form with new content info
      state.reviewForm = {
        ...initialReviewForm,
        contentType,
        contentId
      };
    },
    
    // Set selected review
    setSelectedReview: (state, action: PayloadAction<string | null>) => {
      state.selectedReviewId = action.payload;
      state.isReviewDetailOpen = !!action.payload;
    },
    
    // Filter and sort actions
    setReviewFilters: (state, action: PayloadAction<Partial<ReviewFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    resetReviewFilters: (state) => {
      state.filters = DEFAULT_FILTERS;
    },
    
    applyFilterPreset: (state, action: PayloadAction<'default' | 'top-rated' | 'verified' | 'with-media'>) => {
      switch (action.payload) {
        case 'default':
          state.filters = DEFAULT_FILTERS;
          break;
        case 'top-rated':
          state.filters = TOP_RATED_FILTERS;
          break;
        case 'verified':
          state.filters = VERIFIED_FILTERS;
          break;
        case 'with-media':
          state.filters = WITH_MEDIA_FILTERS;
          break;
      }
    },
    
    setSortOptions: (state, action: PayloadAction<ReviewSortOptions>) => {
      state.sortOptions = action.payload;
    },
    
    // Review form actions
    setReviewFormField: (state, action: PayloadAction<{ field: keyof ReviewFormState; value: any }>) => {
      const { field, value } = action.payload;
      (state.reviewForm as any)[field] = value;
    },
    
    resetReviewForm: (state) => {
      state.reviewForm = {
        ...initialReviewForm,
        contentType: state.currentContentType,
        contentId: state.currentContentId
      };
    },
    
    setReviewFormParent: (state, action: PayloadAction<{ parentId: string; type: ReviewType }>) => {
      state.reviewForm.parentId = action.payload.parentId;
      state.reviewForm.type = action.payload.type;
    },
    
    // Attachment actions for review form
    addAttachment: (state, action: PayloadAction<string>) => {
      state.reviewForm.attachments.push(action.payload);
    },
    
    removeAttachment: (state, action: PayloadAction<string>) => {
      state.reviewForm.attachments = state.reviewForm.attachments.filter(id => id !== action.payload);
    },
    
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.reviewForm.isUploading = action.payload;
    },
    
    // Report form actions
    openReportModal: (state, action: PayloadAction<string>) => {
      state.reportForm.reviewId = action.payload;
      state.isReportModalOpen = true;
    },
    
    closeReportModal: (state) => {
      state.isReportModalOpen = false;
      state.reportForm = initialReportForm;
    },
    
    setReportFormField: (state, action: PayloadAction<{ field: keyof ReportFormState; value: any }>) => {
      const { field, value } = action.payload;
      (state.reportForm as any)[field] = value;
    },
    
    // Moderation form actions
    openModerationModal: (state, action: PayloadAction<string>) => {
      state.moderationForm.reviewId = action.payload;
      state.isModerationModalOpen = true;
    },
    
    closeModerationModal: (state) => {
      state.isModerationModalOpen = false;
      state.moderationForm = initialModerationForm;
    },
    
    setModerationFormField: (state, action: PayloadAction<{ field: keyof ModerationFormState; value: any }>) => {
      const { field, value } = action.payload;
      (state.moderationForm as any)[field] = value;
    },
    
    // Response form actions
    openResponseModal: (state, action: PayloadAction<string>) => {
      state.responseForm.reviewId = action.payload;
      state.isResponseModalOpen = true;
    },
    
    closeResponseModal: (state) => {
      state.isResponseModalOpen = false;
      state.responseForm = initialResponseForm;
    },
    
    setResponseFormField: (state, action: PayloadAction<{ field: keyof ResponseFormState; value: any }>) => {
      const { field, value } = action.payload;
      (state.responseForm as any)[field] = value;
    },
    
    // Moderation queue filter actions
    setModerationQueueFilters: (state, action: PayloadAction<Partial<ModerationQueueFilters>>) => {
      state.moderationQueueFilters = { ...state.moderationQueueFilters, ...action.payload };
    },
    
    resetModerationQueueFilters: (state) => {
      state.moderationQueueFilters = {
        status: 'pending'
      };
    },
    
    // UI state actions
    toggleRichTextEditor: (state) => {
      state.isRichTextEditorOpen = !state.isRichTextEditorOpen;
    },
    
    toggleMediaGallery: (state) => {
      state.isMediaGalleryOpen = !state.isMediaGalleryOpen;
    },
    
    toggleReviewDetail: (state, action: PayloadAction<boolean | undefined>) => {
      state.isReviewDetailOpen = action.payload !== undefined ? action.payload : !state.isReviewDetailOpen;
    },
    
    // Feature flag actions
    setFeatureFlag: (state, action: PayloadAction<{ feature: keyof ReviewsState['features']; enabled: boolean }>) => {
      const { feature, enabled } = action.payload;
      state.features[feature] = enabled;
    }
  },
  extraReducers: (builder) => {
    // Handle review creation success
    builder.addMatcher(
      reviewsApi.endpoints.createReview.matchFulfilled,
      (state) => {
        // Reset form state after successful submission
        state.reviewForm = {
          ...initialReviewForm,
          contentType: state.currentContentType,
          contentId: state.currentContentId
        };
      }
    );
    
    // Handle review voting - update local cache for optimistic UI
    builder.addMatcher(
      reviewsApi.endpoints.voteReview.matchFulfilled,
      (state, { payload, meta }) => {
        const voteType = meta.arg.originalArgs.voteType;
        const reviewId = meta.arg.originalArgs.reviewId;
        
        if (voteType === 'helpful') {
          // Add to helpful list if not already there
          if (!state.userInteractions.helpful.includes(reviewId)) {
            state.userInteractions.helpful.push(reviewId);
          }
          // Remove from unhelpful list if there
          state.userInteractions.unhelpful = state.userInteractions.unhelpful.filter(id => id !== reviewId);
        } else if (voteType === 'unhelpful') {
          // Add to unhelpful list if not already there
          if (!state.userInteractions.unhelpful.includes(reviewId)) {
            state.userInteractions.unhelpful.push(reviewId);
          }
          // Remove from helpful list if there
          state.userInteractions.helpful = state.userInteractions.helpful.filter(id => id !== reviewId);
        }
      }
    );
    
    // Handle report success
    builder.addMatcher(
      reviewsApi.endpoints.reportReview.matchFulfilled,
      (state, { meta }) => {
        const reviewId = meta.arg.originalArgs.reviewId;
        
        // Add to reported list if not already there
        if (!state.userInteractions.reported.includes(reviewId)) {
          state.userInteractions.reported.push(reviewId);
        }
        
        // Close report modal
        state.isReportModalOpen = false;
        state.reportForm = initialReportForm;
      }
    );
    
    // Handle moderation success
    builder.addMatcher(
      reviewsApi.endpoints.moderateReview.matchFulfilled,
      (state) => {
        // Close moderation modal
        state.isModerationModalOpen = false;
        state.moderationForm = initialModerationForm;
      }
    );
    
    // Handle seller response success
    builder.addMatcher(
      reviewsApi.endpoints.createSellerResponse.matchFulfilled,
      (state) => {
        // Close response modal
        state.isResponseModalOpen = false;
        state.responseForm = initialResponseForm;
      }
    );
    
    // Sync user interactions from server
    builder.addMatcher(
      reviewsApi.endpoints.getUserReviewInteractions.matchFulfilled,
      (state, { payload, meta }) => {
        const interactionType = meta.arg.originalArgs.type;
        
        // Update the appropriate interaction list
        switch (interactionType) {
          case 'helpful':
            state.userInteractions.helpful = payload;
            break;
          case 'unhelpful':
            state.userInteractions.unhelpful = payload;
            break;
          case 'report':
            state.userInteractions.reported = payload;
            break;
          case 'save':
            state.userInteractions.saved = payload;
            break;
        }
      }
    );
  }
});

// Export actions
export const {
  // Content and review selection
  setCurrentContent,
  setSelectedReview,
  
  // Filters and sorting
  setReviewFilters,
  resetReviewFilters,
  applyFilterPreset,
  setSortOptions,
  
  // Review form
  setReviewFormField,
  resetReviewForm,
  setReviewFormParent,
  addAttachment,
  removeAttachment,
  setIsUploading,
  
  // Report form
  openReportModal,
  closeReportModal,
  setReportFormField,
  
  // Moderation form
  openModerationModal,
  closeModerationModal,
  setModerationFormField,
  
  // Response form
  openResponseModal,
  closeResponseModal,
  setResponseFormField,
  
  // Moderation queue
  setModerationQueueFilters,
  resetModerationQueueFilters,
  
  // UI states
  toggleRichTextEditor,
  toggleMediaGallery,
  toggleReviewDetail,
  
  // Feature flags
  setFeatureFlag
} = reviewsSlice.actions;

// Selectors
export const selectCurrentContentType = (state: RootState) => state.reviews.currentContentType;
export const selectCurrentContentId = (state: RootState) => state.reviews.currentContentId;
export const selectSelectedReviewId = (state: RootState) => state.reviews.selectedReviewId;
export const selectReviewFilters = (state: RootState) => state.reviews.filters;
export const selectReviewSortOptions = (state: RootState) => state.reviews.sortOptions;
export const selectUserHelpfulVotes = (state: RootState) => state.reviews.userInteractions.helpful;
export const selectUserUnhelpfulVotes = (state: RootState) => state.reviews.userInteractions.unhelpful;
export const selectUserReportedReviews = (state: RootState) => state.reviews.userInteractions.reported;
export const selectUserSavedReviews = (state: RootState) => state.reviews.userInteractions.saved;
export const selectReviewForm = (state: RootState) => state.reviews.reviewForm;
export const selectReportForm = (state: RootState) => state.reviews.reportForm;
export const selectModerationForm = (state: RootState) => state.reviews.moderationForm;
export const selectResponseForm = (state: RootState) => state.reviews.responseForm;
export const selectModerationQueueFilters = (state: RootState) => state.reviews.moderationQueueFilters;
export const selectIsRichTextEditorOpen = (state: RootState) => state.reviews.isRichTextEditorOpen;
export const selectIsMediaGalleryOpen = (state: RootState) => state.reviews.isMediaGalleryOpen;
export const selectIsReportModalOpen = (state: RootState) => state.reviews.isReportModalOpen;
export const selectIsModerationModalOpen = (state: RootState) => state.reviews.isModerationModalOpen;
export const selectIsResponseModalOpen = (state: RootState) => state.reviews.isResponseModalOpen;
export const selectIsReviewDetailOpen = (state: RootState) => state.reviews.isReviewDetailOpen;
export const selectFeatures = (state: RootState) => state.reviews.features;

// Helper selectors
export const selectHasUserVotedHelpful = (reviewId: string) => (state: RootState) => 
  state.reviews.userInteractions.helpful.includes(reviewId);

export const selectHasUserVotedUnhelpful = (reviewId: string) => (state: RootState) => 
  state.reviews.userInteractions.unhelpful.includes(reviewId);

export const selectHasUserReported = (reviewId: string) => (state: RootState) => 
  state.reviews.userInteractions.reported.includes(reviewId);

export const selectHasUserSaved = (reviewId: string) => (state: RootState) => 
  state.reviews.userInteractions.saved.includes(reviewId);

export default reviewsSlice.reducer;