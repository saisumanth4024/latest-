import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  StarHalf, 
  Loader2
} from 'lucide-react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { formatCurrency } from '@/lib/utils';

// Import our generic components and types
import GenericList from './GenericList';
import GenericSearchBar from './GenericSearchBar';
import GenericDropdown from './GenericDropdown';
import { 
  Entity, 
  Named, 
  GenericProduct, 
  SearchParams,
  ProductPricingState,
  ProductAvailabilityState,
  ResourceState
} from '../types/advancedTypes';

// Mock products data
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Ultra Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 40-hour battery life.",
    price: 299.99,
    image: "https://i.imgur.com/jNNT4LE.jpg",
    rating: 4.7,
    category: "electronics",
    brand: "SoundMax",
    inStock: true,
    discount: 15,
    tags: ["wireless", "audio", "premium"],
    reviews: 128,
    priceRange: "200-500"
  },
  {
    id: "2",
    name: "Premium Running Shoes",
    description: "Lightweight and responsive running shoes with advanced cushioning technology.",
    price: 149.95,
    image: "https://i.imgur.com/3oXaiBI.jpg",
    rating: 4.5,
    category: "clothing",
    brand: "SpeedStep",
    inStock: true,
    discount: 0,
    tags: ["running", "sports", "footwear"],
    reviews: 94,
    priceRange: "100-200"
  },
  {
    id: "3",
    name: "Smart Watch Pro",
    description: "Advanced fitness tracking with heart rate monitor and GPS.",
    price: 349.99,
    image: "https://i.imgur.com/J6MinJn.jpg",
    rating: 4.8,
    category: "electronics",
    brand: "TechFit",
    inStock: true,
    discount: 10,
    tags: ["smartwatch", "fitness", "wearable"],
    reviews: 215,
    priceRange: "200-500"
  },
  {
    id: "4",
    name: "Designer Sunglasses",
    description: "UV-protected, polarized lenses in a classic style.",
    price: 189.99,
    image: "https://i.imgur.com/KFojrGE.jpg",
    rating: 4.3,
    category: "accessories",
    brand: "VueChic",
    inStock: false,
    discount: 5,
    tags: ["sunglasses", "fashion", "summer"],
    reviews: 63,
    priceRange: "100-200"
  },
  {
    id: "5",
    name: "Wireless Earbuds",
    description: "True wireless earbuds with active noise cancellation and waterproof design.",
    price: 159.95,
    image: "https://i.imgur.com/2r1in9o.jpg",
    rating: 4.6,
    category: "electronics",
    brand: "SoundMax",
    inStock: true,
    discount: 0,
    tags: ["earbuds", "wireless", "audio"],
    reviews: 102,
    priceRange: "100-200"
  },
  {
    id: "6",
    name: "Ultrabook Laptop 15\"",
    description: "Ultra-thin and lightweight laptop with 12-hour battery life.",
    price: 1299.99,
    image: "https://i.imgur.com/D5yJDGJ.jpg",
    rating: 4.9,
    category: "electronics",
    brand: "TechBook",
    inStock: true,
    discount: 0,
    tags: ["laptop", "computer", "ultrabook"],
    reviews: 87,
    priceRange: "1000+"
  }
];

// Enhanced product interface using our advanced patterns
interface EnhancedProduct extends GenericProduct {
  image: string;
  rating: number;
  brand: string;
  discount: number;
  tags: string[];
  reviews: number;
  pricing: ProductPricingState;
  availability: ProductAvailabilityState;
}

// Sample categories for dropdown
const categories: (Entity & Named)[] = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'home', name: 'Home' }
];

// Sample sorting options for dropdown
const sortOptions: (Entity & Named)[] = [
  { id: 'relevance', name: 'Relevance' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'newest', name: 'Newest' },
  { id: 'popular', name: 'Most Popular' }
];

// Sample mock product data for our enhanced components
const PRODUCT_SAMPLES = [
  {
    id: "1",
    name: "Ultra Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 40-hour battery life.",
    price: 299.99,
    image: "https://i.imgur.com/jNNT4LE.jpg",
    rating: 4.7,
    category: "electronics",
    brand: "SoundMax",
    inStock: true,
    discount: 15,
    tags: ["wireless", "audio", "premium"],
    reviews: 128,
    priceRange: "200-500"
  },
  {
    id: "2",
    name: "Premium Running Shoes",
    description: "Lightweight and responsive running shoes with advanced cushioning technology.",
    price: 149.95,
    image: "https://i.imgur.com/3oXaiBI.jpg",
    rating: 4.5,
    category: "clothing",
    brand: "SpeedStep",
    inStock: true,
    discount: 0,
    tags: ["running", "sports", "footwear"],
    reviews: 94,
    priceRange: "100-200"
  },
  {
    id: "3",
    name: "Smart Watch Pro",
    description: "Advanced fitness tracking with heart rate monitor and GPS.",
    price: 349.99,
    image: "https://i.imgur.com/J6MinJn.jpg",
    rating: 4.8,
    category: "electronics",
    brand: "TechFit",
    inStock: true,
    discount: 10,
    tags: ["smartwatch", "fitness", "wearable"],
    reviews: 215,
    priceRange: "200-500"
  },
  {
    id: "4",
    name: "Designer Sunglasses",
    description: "UV-protected, polarized lenses in a classic style.",
    price: 189.99,
    image: "https://i.imgur.com/KFojrGE.jpg",
    rating: 4.3,
    category: "accessories",
    brand: "VueChic",
    inStock: false,
    discount: 5,
    tags: ["sunglasses", "fashion", "summer"],
    reviews: 63,
    priceRange: "100-200"
  },
  {
    id: "5",
    name: "Wireless Earbuds",
    description: "True wireless earbuds with active noise cancellation and waterproof design.",
    price: 159.95,
    image: "https://i.imgur.com/2r1in9o.jpg",
    rating: 4.6,
    category: "electronics",
    brand: "SoundMax",
    inStock: true,
    discount: 0,
    tags: ["earbuds", "wireless", "audio"],
    reviews: 102,
    priceRange: "100-200"
  },
  {
    id: "6",
    name: "Ultrabook Laptop 15\"",
    description: "Ultra-thin and lightweight laptop with 12-hour battery life.",
    price: 1299.99,
    image: "https://i.imgur.com/D5yJDGJ.jpg",
    rating: 4.9,
    category: "electronics",
    brand: "TechBook",
    inStock: true,
    discount: 0,
    tags: ["laptop", "computer", "ultrabook"],
    reviews: 87,
    priceRange: "1000+"
  }
];

// Transform our sample data to enhanced structure using our advanced types
const enhancedMockProducts: EnhancedProduct[] = PRODUCT_SAMPLES.map(p => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  image: p.image,
  category: p.category,
  createdAt: new Date(Date.now() - Math.random() * 10000000000),
  updatedAt: new Date(Date.now() - Math.random() * 1000000000),
  inStock: p.inStock,
  rating: p.rating,
  brand: p.brand,
  discount: p.discount,
  tags: p.tags,
  reviews: p.reviews,
  // Using discriminated union for pricing state
  pricing: p.discount > 0 
    ? { 
        type: 'sale', 
        originalPrice: p.price, 
        salePrice: p.price * (1 - p.discount / 100), 
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
      } 
    : { 
        type: 'regular', 
        price: p.price 
      },
  // Using discriminated union for availability state
  availability: p.inStock 
    ? { 
        status: 'in-stock', 
        quantity: Math.floor(Math.random() * 50) + 10 
      }
    : { 
        status: 'out-of-stock', 
        backorderAvailable: Math.random() > 0.5, 
        expectedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
}));

interface EnhancedProductsComponentProps {
  title?: string;
  count?: number;
  columns?: number;
  filters?: {
    category?: string | null;
    priceRange?: string | null;
    rating?: string | null;
    sort?: string;
    price?: string | null;
  };
  searchQuery?: string;
}

// Our component using the generic components and advanced types
const EnhancedProductsComponent: React.FC<EnhancedProductsComponentProps> = ({
  title = "Products",
  count = 12,
  columns = 4,
  filters = {},
  searchQuery = "",
}) => {
  // State using ResourceState discriminated union
  const [productsState, setProductsState] = useState<ResourceState<EnhancedProduct[]>>({ 
    status: 'loading' 
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || 'all');
  const [selectedSort, setSelectedSort] = useState<string>(filters.sort || 'relevance');
  const [query, setQuery] = useState<string>(searchQuery);
  const [, setLocation] = useLocation();
  const productsPerPage = 8;
  
  // Load products with filter logic
  useEffect(() => {
    setProductsState({ status: 'loading' });
    
    // Simulate API call
    setTimeout(() => {
      try {
        let result = [...enhancedMockProducts];
        
        // Apply search query filter
        if (query) {
          const searchTerm = query.toLowerCase();
          result = result.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          );
        }
        
        // Apply category filter
        if (selectedCategory && selectedCategory !== 'all') {
          result = result.filter(product => product.category === selectedCategory);
        }
        
        // Apply sorting
        switch(selectedSort) {
          case 'price-low':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            result.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            result.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            break;
          case 'popular':
          case 'relevance':
            result.sort((a, b) => b.reviews - a.reviews);
            break;
        }
        
        // Limit to count if needed
        if (count > 0 && count < result.length) {
          result = result.slice(0, count);
        }
        
        setProductsState({ 
          status: 'success', 
          data: result 
        });
      } catch (error) {
        setProductsState({ 
          status: 'error', 
          error: 'Failed to load products. Please try again later.' 
        });
      }
    }, 600);
  }, [query, selectedCategory, selectedSort, count]);
  
  // Handle search change using our generic search component
  const handleSearch = useCallback((params: SearchParams<EnhancedProduct>) => {
    setQuery(params.query || '');
  }, []);
  
  // Handle category change using our generic dropdown
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);
  
  // Handle sort change using our generic dropdown
  const handleSortChange = useCallback((value: string) => {
    setSelectedSort(value);
  }, []);
  
  // Handle product click
  const handleProductClick = useCallback((product: EnhancedProduct) => {
    setLocation(`/products/${product.id}`);
  }, [setLocation]);
  
  // Render product card - this will be passed to our generic list
  const renderProductItem = useCallback((product: EnhancedProduct) => {
    return (
      <div className="p-2">
        <Card className="overflow-hidden flex flex-col h-full">
          <div className="relative aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-800">
            <img 
              src={product.image} 
              alt={product.name}
              className="object-cover w-full h-48"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = "https://placehold.co/400x300/e2e8f0/1e293b?text=Product+Image";
              }}
            />
            {product.pricing.type === 'sale' && (
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                -{product.discount}%
              </Badge>
            )}
          </div>
          
          <CardContent className="flex-grow p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center mb-2">
              {renderRating(product.rating)}
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                ({product.reviews})
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {product.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="mt-2">
              {product.pricing.type === 'sale' ? (
                <div className="flex items-center">
                  <span className="text-lg font-bold">
                    {formatCurrency(product.pricing.salePrice)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                    {formatCurrency(product.pricing.originalPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            
            {/* Availability indicator using discriminated union pattern */}
            <div className="mt-2 text-sm">
              {product.availability.status === 'in-stock' ? (
                <span className="text-green-600 dark:text-green-400">
                  In stock ({product.availability.quantity} available)
                </span>
              ) : product.availability.status === 'out-of-stock' && product.availability.backorderAvailable ? (
                <span className="text-orange-600 dark:text-orange-400">
                  Available on backorder
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">
                  Out of stock
                </span>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex justify-between gap-2">
            <Button 
              className="w-full text-xs" 
              disabled={product.availability.status === 'out-of-stock' && !product.availability.backorderAvailable}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }, []);
  
  // Render rating stars
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  // Content based on state using discriminated union pattern
  const renderContent = () => {
    switch(productsState.status) {
      case 'loading':
        return (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">Loading products...</span>
          </div>
        );
      
      case 'error':
        return (
          <div className="p-8 text-red-500 bg-red-50 rounded-md">
            <p className="font-semibold">Error</p>
            <p>{productsState.error}</p>
          </div>
        );
      
      case 'success':
        return (
          <GenericList<EnhancedProduct>
            items={productsState.data}
            renderItem={renderProductItem}
            onItemClick={handleProductClick}
            emptyMessage="No products found. Try adjusting your filters or search criteria."
            header={
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Showing {productsState.data.length} products
              </p>
            }
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      <div className="mb-6 space-y-4">
        {/* Search bar using our generic component */}
        <GenericSearchBar<EnhancedProduct>
          onSearch={handleSearch}
          initialQuery={query}
          placeholder="Search products..."
          className="mb-4"
          autoSearch={true}
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category dropdown using our generic component */}
          <GenericDropdown<Entity & Named>
            items={categories}
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Select Category"
            label="Category"
            className="w-full sm:w-1/3"
          />
          
          {/* Sort dropdown using our generic component */}
          <GenericDropdown<Entity & Named>
            items={sortOptions}
            value={selectedSort}
            onChange={handleSortChange}
            placeholder="Sort By"
            label="Sort"
            className="w-full sm:w-1/3"
          />
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

// Mock products data

const ADDITIONAL_PRODUCTS = [
  {
    id: "1",
    name: "Ultra Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 40-hour battery life.",
    price: 299.99,
    image: "https://i.imgur.com/jNNT4LE.jpg",
    rating: 4.7,
    category: "electronics",
    brand: "SoundMax",
    inStock: true,
    discount: 15,
    tags: ["wireless", "audio", "premium"],
    reviews: 128,
    priceRange: "200-500"
  },
  {
    id: "2",
    name: "Premium Running Shoes",
    description: "Lightweight and responsive running shoes with advanced cushioning technology.",
    price: 149.95,
    image: "https://i.imgur.com/3oXaiBI.jpg",
    rating: 4.5,
    category: "clothing",
    brand: "SpeedStep",
    inStock: true,
    discount: 0,
    tags: ["running", "sports", "footwear"],
    reviews: 94,
    priceRange: "100-200"
  },
  {
    id: "3",
    name: "Smart Watch Pro",
    description: "Advanced fitness tracking with heart rate monitor and GPS.",
    price: 349.99,
    image: "https://i.imgur.com/J6MinJn.jpg",
    rating: 4.8,
    category: "electronics",
    brand: "TechFit",
    inStock: true,
    discount: 10,
    tags: ["smartwatch", "fitness", "wearable"],
    reviews: 215,
    priceRange: "200-500"
  },
  {
    id: "4",
    name: "Designer Sunglasses",
    description: "UV-protected, polarized lenses in a classic style.",
    price: 189.99,
    image: "https://i.imgur.com/KFojrGE.jpg",
    rating: 4.3,
    category: "accessories",
    brand: "VueChic",
    inStock: false,
    discount: 5,
    tags: ["sunglasses", "fashion", "summer"],
    reviews: 63,
    priceRange: "100-200"
  },
  {
    id: "5",
    name: "Wireless Earbuds",
    description: "True wireless earbuds with active noise cancellation and waterproof design.",
    price: 159.95,
    image: "https://i.imgur.com/2r1in9o.jpg",
    rating: 4.6,
    category: "electronics",
    brand: "SoundMax",
    inStock: true,
    discount: 0,
    tags: ["earbuds", "wireless", "audio"],
    reviews: 102,
    priceRange: "100-200"
  },
  {
    id: "6",
    name: "Ultrabook Laptop 15\"",
    description: "Ultra-thin and lightweight laptop with 12-hour battery life.",
    price: 1299.99,
    image: "https://i.imgur.com/D5yJDGJ.jpg",
    rating: 4.9,
    category: "electronics",
    brand: "TechBook",
    inStock: true,
    discount: 0,
    tags: ["laptop", "computer", "ultrabook"],
    reviews: 87,
    priceRange: "1000+"
  }
];

export default EnhancedProductsComponent;