// Common content types for the CMS system

// Media types
export type MediaType = 'image' | 'video' | 'document' | 'audio';

export interface Media {
  id: string;
  type: MediaType;
  url: string;
  title: string;
  description?: string;
  altText?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  width?: number;
  height?: number;
  duration?: number; // in seconds for video/audio
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  uploadedBy: string;
  metadata?: Record<string, any>;
}

// Video specific types
export interface VideoMetadata {
  duration: number;
  resolution: string;
  codec: string;
  bitrate: number;
  fps?: number;
  hdrEnabled?: boolean;
}

export interface VideoSource {
  url: string;
  quality: '240p' | '360p' | '480p' | '720p' | '1080p' | '1440p' | '2160p';
  bitrate: number;
  type: string; // mime type: 'video/mp4', 'video/webm', etc.
}

export interface Video extends Media {
  type: 'video';
  sources: VideoSource[];
  videoMetadata: VideoMetadata;
  videoUrl: string;
  subtitles?: {
    language: string;
    url: string;
    label: string;
  }[];
  chapters?: {
    start: number; // in seconds
    end: number; // in seconds
    title: string;
  }[];
  relatedVideos?: string[]; // IDs of related videos
  viewCount?: number;
  likeCount?: number;
}

// Banner types
export type BannerPosition = 
  | 'home_hero' 
  | 'home_secondary' 
  | 'category_top' 
  | 'product_sidebar'
  | 'deals_page' 
  | 'checkout_confirmation';

export type BannerType = 'image' | 'video' | 'carousel' | 'html';

export interface Banner {
  id: string;
  title: string;
  type: BannerType;
  position: BannerPosition;
  content: string | Media | Media[]; // URL, Media object, or array of Media for carousel
  link?: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number; // For ordering multiple banners in the same position
  targetAudience?: string[]; // user segments to target
  createdAt: string;
  updatedAt: string;
  viewCount: number; // analytics
  clickCount: number; // analytics
  conversionCount: number; // analytics
}

// Page types
export type PageType = 'landing' | 'category' | 'static' | 'legal' | 'custom';

export interface Page {
  id: string;
  title: string;
  slug: string;
  type: PageType;
  content: string; // HTML content
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: Media;
  sections: PageSection[];
  isPublished: boolean;
  publishDate?: string;
  lastModified: string;
  author: string;
  tags: string[];
  relatedPages?: string[]; // IDs of related pages
}

export interface PageSection {
  id: string;
  title: string;
  type: 'text' | 'image' | 'video' | 'carousel' | 'products' | 'testimonials' | 'features' | 'cta' | 'custom';
  content: string | Media | Media[] | string[]; // Content can be HTML, Media, Media[] for carousels, or string[] for product IDs
  order: number;
  backgroundColor?: string;
  textColor?: string;
  settings?: Record<string, any>; // Additional settings for the section
}

// Deal types
export interface Deal {
  id: string;
  title: string;
  description: string;
  image?: Media;
  startDate: string;
  endDate: string;
  isActive: boolean;
  discountPercentage?: number;
  discountAmount?: number;
  minimumPurchase?: number;
  products: string[]; // Product IDs
  categories?: string[]; // Category IDs
  couponCode?: string;
  termsAndConditions?: string;
  viewCount: number; // analytics
  useCount: number; // analytics
}

// Recommendation types
export type RecommendationType = 
  | 'trending' 
  | 'personalized' 
  | 'similar_products' 
  | 'frequently_bought_together'
  | 'recently_viewed' 
  | 'top_rated';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description?: string;
  productIds: string[];
  position: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  algorithm?: string; // The algorithm used for recommendations
  viewCount: number; // analytics
  clickCount: number; // analytics
  conversionCount: number; // analytics
}

// Content search and filtering
export interface ContentFilter {
  keywords?: string;
  contentType?: 'video' | 'image' | 'banner' | 'page' | 'deal';
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  tags?: string[];
  categories?: string[];
  status?: 'active' | 'inactive' | 'scheduled' | 'expired' | 'draft';
  sortBy?: 'date' | 'popularity' | 'title' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

// Video player settings
export interface PlayerSettings {
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
  preload: 'auto' | 'metadata' | 'none';
  poster?: string;
  playbackRate: number;
  volume: number;
  quality: string;
  subtitlesEnabled: boolean;
  subtitlesLanguage?: string;
}

// Video playlist
export interface Playlist {
  id: string;
  title: string;
  description?: string;
  videos: string[]; // Video IDs
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublic: boolean;
  viewCount: number;
}

// Content collection for homepage, category pages, etc.
export interface ContentCollection {
  id: string;
  title: string;
  description?: string;
  type: 'banners' | 'videos' | 'products' | 'deals' | 'recommendations' | 'mixed';
  items: string[]; // IDs of content items
  position: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  maxItems?: number;
  viewCount: number;
}