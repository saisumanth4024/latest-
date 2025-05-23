/**
 * Interface for product variant option
 */
export interface ProductVariantOption {
  name: string;
  value: string;
}

/**
 * Interface for product variant
 */
export interface ProductVariant {
  id: string | number;
  productId: string | number;
  sku: string;
  price: number;
  compareAtPrice?: number;
  options: ProductVariantOption[];
  inventory: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  imageUrl?: string;
  isDefault?: boolean;
}

/**
 * Interface for product image
 */
export interface ProductImage {
  id: string | number;
  productId: string | number;
  url: string;
  alt?: string;
  position: number;
  isDefault: boolean;
}

/**
 * Interface for product category
 */
export interface ProductCategory {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | number;
  imageUrl?: string;
  level: number;
  path: string;
  children?: ProductCategory[];
}

/**
 * Interface for product brand
 */
export interface ProductBrand {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
}

/**
 * Interface for product
 */
export interface Product {
  /** Unique identifier for the product */
  id: string | number;
  /** Product name */
  name: string;
  /** Product slug (URL-friendly version of name) */
  slug: string;
  /** Product description (may contain HTML) */
  description: string;
  /** Short description (plain text) */
  shortDescription?: string;
  /** Product SKU (stock keeping unit) */
  sku: string;
  /** Regular price */
  price: number;
  /** Sales price (if on sale) */
  salePrice?: number;
  /** Compare at price (original price for showing discounts) */
  compareAtPrice?: number;
  /** Cost price (for internal use) */
  costPrice?: number;
  /** Whether the product is on sale */
  onSale: boolean;
  /** Whether the product is in stock */
  inStock: boolean;
  /** Current inventory level */
  inventory: number;
  /** Low stock threshold */
  lowStockThreshold?: number;
  /** Whether to track inventory */
  trackInventory: boolean;
  /** Whether the product is featured */
  featured: boolean;
  /** Whether the product is a bestseller */
  bestseller: boolean;
  /** Whether the product is new */
  isNew: boolean;
  /** Product rating (1-5) */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Categories */
  categories: ProductCategory[];
  /** Tags */
  tags: string[];
  /** Brand */
  brand?: ProductBrand;
  /** Main product image */
  imageUrl: string;
  /** All product images */
  images: ProductImage[];
  /** Product variants */
  variants: ProductVariant[];
  /** SEO metadata */
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  /** Whether the product is a digital product */
  isDigital: boolean;
  /** Whether the product requires shipping */
  requiresShipping: boolean;
  /** Product weight */
  weight?: number;
  /** Product dimensions */
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  /** Whether the product is tax exempt */
  isTaxExempt: boolean;
  /** Product attributes (color, size, material, etc.) */
  attributes?: Record<string, string | string[]>;
  /** Creation timestamp */
  createdAt: string | Date;
  /** Last update timestamp */
  updatedAt: string | Date;
  /** Product seller/vendor */
  seller?: {
    id: string | number;
    name: string;
    rating?: number;
  };
  /** Additional product metadata */
  metadata?: Record<string, any>;
}

/**
 * Interface for a simpler product item, used in listings
 */
export interface ProductListItem {
  id: string | number;
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  onSale: boolean;
  inStock: boolean;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  categories: Pick<ProductCategory, 'id' | 'name' | 'slug'>[];
  isNew: boolean;
  featured: boolean;
  brand?: Pick<ProductBrand, 'id' | 'name' | 'slug'>;
}

/**
 * Interface for product filters
 */
export interface ProductFilters {
  search?: string;
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  onSale?: boolean;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  tags?: string[];
  attributes?: Record<string, string[]>;
}

/**
 * Interface for product sorting options
 */
export type ProductSortOption = 
  | 'newest'
  | 'price_low'
  | 'price_high'
  | 'name_asc'
  | 'name_desc'
  | 'popular'
  | 'rating';