import { Product } from './product';
import { UserProfile } from './user';
import { Order } from './order';

/**
 * Enum for search result types
 */
export enum SearchResultType {
  PRODUCT = 'product',
  USER = 'user',
  ORDER = 'order',
  CATEGORY = 'category',
  PAGE = 'page',
  BLOG = 'blog',
  CUSTOM = 'custom',
}

/**
 * Interface for search filters
 */
export interface SearchFilter {
  /** Filter field name */
  field: string;
  /** Filter display label */
  label: string;
  /** Filter type */
  type: 'checkbox' | 'radio' | 'range' | 'select' | 'text';
  /** Available options for select-type filters */
  options?: Array<{
    /** Option value */
    value: string | number | boolean;
    /** Option label */
    label: string;
    /** Option count */
    count?: number;
  }>;
  /** Min and max for range-type filters */
  range?: {
    /** Minimum value */
    min: number;
    /** Maximum value */
    max: number;
    /** Step size */
    step?: number;
    /** Unit of measurement */
    unit?: string;
  };
  /** Whether this filter is applied */
  isApplied: boolean;
  /** Applied values */
  values?: Array<string | number | boolean>;
}

/**
 * Interface for search sorting options
 */
export interface SearchSortOption {
  /** Sort field */
  field: string;
  /** Sort direction */
  direction: 'asc' | 'desc';
  /** Display label */
  label: string;
}

/**
 * Interface for search pagination
 */
export interface SearchPagination {
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a previous page */
  hasPrevious: boolean;
  /** Whether there is a next page */
  hasNext: boolean;
}

/**
 * Interface for base search result item
 */
export interface BaseSearchResult {
  /** Unique identifier for the search result */
  id: string | number;
  /** Search result type */
  type: SearchResultType;
  /** Result title */
  title: string;
  /** Result description */
  description?: string;
  /** Result URL */
  url?: string;
  /** Result image URL */
  imageUrl?: string;
  /** Search result score/relevance */
  score?: number;
  /** Highlighted text snippets */
  highlights?: Array<{
    /** Field that was highlighted */
    field: string;
    /** Highlighted text */
    snippet: string;
  }>;
  /** Result metadata */
  metadata?: Record<string, any>;
}

/**
 * Interface for product search result
 */
export interface ProductSearchResult extends BaseSearchResult {
  /** Search result type */
  type: SearchResultType.PRODUCT;
  /** Product data */
  data: Partial<Product>;
}

/**
 * Interface for user search result
 */
export interface UserSearchResult extends BaseSearchResult {
  /** Search result type */
  type: SearchResultType.USER;
  /** User data */
  data: Partial<UserProfile>;
}

/**
 * Interface for order search result
 */
export interface OrderSearchResult extends BaseSearchResult {
  /** Search result type */
  type: SearchResultType.ORDER;
  /** Order data */
  data: Partial<Order>;
}

/**
 * Interface for category search result
 */
export interface CategorySearchResult extends BaseSearchResult {
  /** Search result type */
  type: SearchResultType.CATEGORY;
  /** Category data */
  data: {
    /** Category ID */
    id: string | number;
    /** Category name */
    name: string;
    /** Category description */
    description?: string;
    /** Category image URL */
    imageUrl?: string;
    /** Category slug */
    slug: string;
    /** Product count in this category */
    productCount?: number;
  };
}

/**
 * Interface for page search result
 */
export interface PageSearchResult extends BaseSearchResult {
  /** Search result type */
  type: SearchResultType.PAGE;
  /** Page data */
  data: {
    /** Page ID */
    id: string | number;
    /** Page title */
    title: string;
    /** Page slug */
    slug: string;
    /** Page content snippet */
    contentSnippet?: string;
    /** Last updated timestamp */
    updatedAt: string | Date;
  };
}

/**
 * Interface for blog post search result
 */
export interface BlogSearchResult extends BaseSearchResult {
  /** Search result type */
  type: SearchResultType.BLOG;
  /** Blog post data */
  data: {
    /** Post ID */
    id: string | number;
    /** Post title */
    title: string;
    /** Post slug */
    slug: string;
    /** Author name */
    author?: string;
    /** Post content snippet */
    contentSnippet?: string;
    /** Post publication date */
    publishedAt: string | Date;
    /** Featured image URL */
    featuredImageUrl?: string;
    /** Post tags */
    tags?: string[];
  };
}

/**
 * Interface for custom search result
 */
export interface CustomSearchResult extends BaseSearchResult {
  /** Search result type */
  type: SearchResultType.CUSTOM;
  /** Custom data */
  data: Record<string, any>;
}

/**
 * Union type for all search result types
 */
export type SearchResult =
  | ProductSearchResult
  | UserSearchResult
  | OrderSearchResult
  | CategorySearchResult
  | PageSearchResult
  | BlogSearchResult
  | CustomSearchResult;

/**
 * Interface for search request parameters
 */
export interface SearchParams {
  /** Search query */
  query: string;
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Result types to include */
  types?: SearchResultType[];
  /** Filters to apply */
  filters?: Record<string, any>;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Search context */
  context?: Record<string, any>;
}

/**
 * Interface for search response
 */
export interface SearchResponse {
  /** Search results */
  results: SearchResult[];
  /** Pagination information */
  pagination: SearchPagination;
  /** Available filters */
  filters: SearchFilter[];
  /** Available sort options */
  sortOptions: SearchSortOption[];
  /** Related search terms */
  relatedQueries?: string[];
  /** Search timing information */
  timings?: {
    /** Total time taken for the search in milliseconds */
    total: number;
    /** Time taken for query parsing in milliseconds */
    parsing?: number;
    /** Time taken for execution in milliseconds */
    execution?: number;
  };
  /** Original search query */
  query: string;
  /** Whether the search was successful */
  success: boolean;
  /** Error message if the search failed */
  error?: string;
}