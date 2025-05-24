// Content and Media Management Types

// Basic media type shared across media types
export interface Media {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  mimeType: string;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  authorName?: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  metadata?: Record<string, any>;
}

// Video-specific types
export interface VideoSource {
  quality: string; // e.g., "720p", "1080p"
  url: string;
  size?: number;
  format?: string;
}

export interface VideoSubtitle {
  language: string;
  label: string;
  url: string;
}

export interface VideoMetadata {
  duration: number;
  resolution: string;
  codec?: string;
  bitrate?: number;
  framerate?: number;
  aspectRatio?: string;
}

export interface Video extends Media {
  videoUrl: string;
  sources?: VideoSource[];
  subtitles?: VideoSubtitle[];
  videoMetadata?: VideoMetadata;
  thumbnailUrl: string;
  previewGif?: string;
  viewCount: number;
  categories?: string[];
  transcript?: string;
  isPrivate: boolean;
  isFeature: boolean;
  relatedVideos?: string[]; // IDs of related videos
}

// Banner types
export type BannerPosition = 
  | 'home_hero'
  | 'home_middle'
  | 'home_bottom'
  | 'category_top'
  | 'product_sidebar'
  | 'checkout'
  | 'profile'
  | 'custom';

export type BannerType = 'image' | 'video' | 'html' | 'carousel';

export interface Banner {
  id: string;
  title: string;
  description?: string;
  type: BannerType;
  position: BannerPosition;
  content: string | any; // URL for images, HTML for html banners, video object for video
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  link?: string;
  buttonText?: string;
  viewCount: number;
  clickCount: number;
  targetAudience?: {
    countries?: string[];
    userTypes?: string[];
    devices?: string[];
  };
  priority: number; // For ordering multiple banners in the same position
  createdAt: string;
  updatedAt: string;
}

// Content Pages
export interface PageSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'video' | 'products' | 'banner' | 'custom';
  title?: string;
  content: any; // Depends on section type
  order: number;
  settings?: Record<string, any>;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  isPublished: boolean;
  publishedAt?: string;
  sections: PageSection[];
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  authorName?: string;
  thumbnail?: string;
  type: 'landing' | 'article' | 'help' | 'policy' | 'custom';
}

// Deals/Promotions
export interface Deal {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  discount?: {
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: number;
  };
  couponCode?: string;
  products?: string[]; // IDs of products this deal applies to
  categories?: string[]; // IDs of categories this deal applies to
  conditions?: {
    minPurchase?: number;
    maxUses?: number;
    onePerUser?: boolean;
    firstTimeOnly?: boolean;
  };
  priority: number;
  createdAt: string;
  updatedAt: string;
}

// Recommendations
export interface Recommendation {
  id: string;
  title: string;
  type: 'product' | 'video' | 'banner' | 'category' | 'collection';
  items: string[]; // IDs of recommended items
  algorithm?: 'frequently_bought_together' | 'similar_items' | 'recently_viewed' | 'popular' | 'top_rated' | 'curated';
  isActive: boolean;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

// Playlists
export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  videos: string[]; // IDs of videos in this playlist
  isPublic: boolean;
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  tags?: string[];
}

// Content Collections
export interface ContentCollection {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  type: 'featured' | 'trending' | 'seasonal' | 'thematic' | 'custom';
  items: {
    id: string;
    type: 'video' | 'product' | 'banner' | 'page';
    priority: number;
  }[];
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// Filters
export interface ContentFilter {
  keywords?: string;
  categories?: string[];
  tags?: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  contentType?: string;
  status?: 'active' | 'inactive' | 'draft' | 'scheduled' | 'expired';
  author?: string;
  sortBy?: 'date' | 'title' | 'popularity' | 'relevance';
  sortDirection?: 'asc' | 'desc';
}

// Player Settings
export interface PlayerSettings {
  quality: string;
  autoplay: boolean;
  volume: number;
  playbackRate: number;
  subtitlesEnabled: boolean;
  subtitlesLanguage?: string;
  loop: boolean;
}