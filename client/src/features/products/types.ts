// Product interfaces
export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  brand: string;
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isNew: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Search parameters for filtering products
export interface SearchParams {
  query?: string | null;
  category?: string | null;
  brand?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  rating?: number | null;
  sort?: SortOption | null;
  page: number;
  limit: number;
}

// Sort options
export type SortOption = 
  | 'relevance' 
  | 'price-asc' 
  | 'price-desc' 
  | 'rating-desc' 
  | 'newest' 
  | 'bestselling'
  | 'discount';

// Search history item
export interface SearchHistoryItem {
  query: string;
  timestamp: string;
}

// Product list response from API
export interface ProductListResponse {
  products: Product[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}