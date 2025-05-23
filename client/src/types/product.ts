/**
 * Interface for product categories
 */
export interface ProductCategory {
  /** Unique identifier for the category */
  id: string | number;
  /** Category name */
  name: string;
  /** Category description */
  description?: string;
  /** Category image URL */
  imageUrl?: string;
  /** Parent category ID for hierarchical categories */
  parentId?: string | number;
  /** Whether the category is active */
  isActive: boolean;
  /** Category slug for URLs */
  slug: string;
  /** Custom attributes for the category */
  attributes?: Record<string, any>;
  /** Creation timestamp */
  createdAt: string | Date;
  /** Last update timestamp */
  updatedAt: string | Date;
}

/**
 * Interface for product tags
 */
export interface ProductTag {
  /** Unique identifier for the tag */
  id: string | number;
  /** Tag name */
  name: string;
  /** Tag slug for URLs */
  slug: string;
  /** Creation timestamp */
  createdAt: string | Date;
}

/**
 * Enum for product inventory status
 */
export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  BACK_ORDER = 'back_order',
  DISCONTINUED = 'discontinued',
}

/**
 * Interface for product variant options
 */
export interface ProductVariantOption {
  /** Option name (e.g., "Color", "Size") */
  name: string;
  /** Option value (e.g., "Red", "Large") */
  value: string;
  /** Additional price modifier for this option */
  priceModifier?: number;
  /** Image URL specific to this option */
  imageUrl?: string;
}

/**
 * Interface for product variants
 */
export interface ProductVariant {
  /** Unique identifier for the variant */
  id: string | number;
  /** Variant SKU (Stock Keeping Unit) */
  sku: string;
  /** Variant-specific price (overrides base product price) */
  price?: number;
  /** Variant-specific sale price */
  salePrice?: number;
  /** Variant-specific inventory count */
  inventoryCount?: number;
  /** Variant-specific inventory status */
  inventoryStatus?: InventoryStatus;
  /** Variant options (e.g., Color: Red, Size: Large) */
  options: ProductVariantOption[];
  /** Variant-specific image URL */
  imageUrl?: string;
  /** Variant weight for shipping calculations */
  weight?: number;
  /** Variant dimensions for shipping calculations */
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  /** Whether this variant is active */
  isActive: boolean;
}

/**
 * Interface for product reviews
 */
export interface ProductReview {
  /** Unique identifier for the review */
  id: string | number;
  /** Product ID this review belongs to */
  productId: string | number;
  /** User ID who wrote the review */
  userId: string | number;
  /** User name who wrote the review */
  userName: string;
  /** User avatar URL */
  userAvatar?: string;
  /** Review rating (1-5) */
  rating: number;
  /** Review title */
  title?: string;
  /** Review content */
  content: string;
  /** Whether the review has been verified */
  isVerified: boolean;
  /** Whether the review has been approved */
  isApproved: boolean;
  /** Creation timestamp */
  createdAt: string | Date;
  /** Last update timestamp */
  updatedAt: string | Date;
  /** Helpfulness votes */
  helpfulCount?: number;
  /** Unhelpfulness votes */
  unhelpfulCount?: number;
  /** Review response from seller */
  sellerResponse?: {
    content: string;
    createdAt: string | Date;
  };
}

/**
 * Interface for product pricing
 */
export interface ProductPricing {
  /** Base product price */
  price: number;
  /** Discounted sale price */
  salePrice?: number;
  /** Whether the product is currently on sale */
  onSale?: boolean;
  /** Sale start date */
  saleStartDate?: string | Date;
  /** Sale end date */
  saleEndDate?: string | Date;
  /** Product cost (for internal use) */
  cost?: number;
  /** Profit margin percentage */
  marginPercent?: number;
  /** Bulk pricing tiers */
  bulkPricing?: Array<{
    /** Minimum quantity for this tier */
    quantity: number;
    /** Price for this tier */
    price: number;
  }>;
  /** Currency code (e.g., USD, EUR) */
  currency: string;
  /** Tax information */
  tax?: {
    /** Whether the product is taxable */
    taxable: boolean;
    /** Tax category */
    taxCategory?: string;
    /** Tax rate percentage */
    taxRate?: number;
  };
}

/**
 * Interface for product metadata and SEO
 */
export interface ProductMetadata {
  /** SEO title */
  metaTitle?: string;
  /** SEO description */
  metaDescription?: string;
  /** SEO keywords */
  metaKeywords?: string[];
  /** Custom URL canonical */
  canonicalUrl?: string;
  /** Open Graph image URL */
  ogImageUrl?: string;
  /** Structured data (JSON-LD) */
  structuredData?: Record<string, any>;
}

/**
 * Interface for product media
 */
export interface ProductMedia {
  /** Unique identifier for the media item */
  id: string | number;
  /** Media type */
  type: 'image' | 'video' | '3d_model' | 'document';
  /** Media URL */
  url: string;
  /** Media alt text */
  alt?: string;
  /** Media title */
  title?: string;
  /** Media caption */
  caption?: string;
  /** Whether this is the primary media item */
  isPrimary: boolean;
  /** Display order */
  displayOrder: number;
  /** Media thumbnail URL */
  thumbnailUrl?: string;
  /** Creation timestamp */
  createdAt: string | Date;
}

/**
 * Interface for complete product information
 */
export interface Product {
  /** Unique identifier for the product */
  id: string | number;
  /** Product name */
  name: string;
  /** Product slug for URLs */
  slug: string;
  /** Product SKU (Stock Keeping Unit) */
  sku: string;
  /** Short product description */
  shortDescription?: string;
  /** Full product description (may contain HTML) */
  description: string;
  /** Product pricing information */
  pricing: ProductPricing;
  /** Product inventory status */
  inventoryStatus: InventoryStatus;
  /** Product inventory count */
  inventoryCount?: number;
  /** Whether inventory is tracked for this product */
  trackInventory: boolean;
  /** Minimum purchase quantity */
  minPurchaseQuantity?: number;
  /** Maximum purchase quantity */
  maxPurchaseQuantity?: number;
  /** Whether the product is featured */
  isFeatured: boolean;
  /** Whether the product is active */
  isActive: boolean;
  /** Whether the product is published */
  isPublished: boolean;
  /** Product categories */
  categories: ProductCategory[];
  /** Product tags */
  tags: ProductTag[];
  /** Product variants */
  variants: ProductVariant[];
  /** Product media */
  media: ProductMedia[];
  /** Primary product image URL */
  primaryImageUrl?: string;
  /** Product brand */
  brand?: {
    id: string | number;
    name: string;
    logoUrl?: string;
  };
  /** Product metadata and SEO information */
  metadata?: ProductMetadata;
  /** Product reviews */
  reviews?: ProductReview[];
  /** Average review rating */
  averageRating?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Product attributes */
  attributes?: Record<string, string | number | boolean>;
  /** Product specifications */
  specifications?: Record<string, string | number>;
  /** Related product IDs */
  relatedProductIds?: Array<string | number>;
  /** Product weight for shipping calculations */
  weight?: number;
  /** Product dimensions for shipping calculations */
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  /** Whether the product is free shipping eligible */
  freeShipping?: boolean;
  /** Product shipping class */
  shippingClass?: string;
  /** Product warranty information */
  warranty?: string;
  /** Creation timestamp */
  createdAt: string | Date;
  /** Last update timestamp */
  updatedAt: string | Date;
  /** Seller ID (for marketplace models) */
  sellerId?: string | number;
}