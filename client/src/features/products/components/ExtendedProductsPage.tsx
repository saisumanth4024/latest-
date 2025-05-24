import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { selectFilters, setFilter, resetFilters } from '../productsSlice';
import { EXTENDED_PRODUCTS } from '../data/ExtendedProductData';
import { RefreshCw, Search, ShoppingCart, Heart, Star, Grid3X3, List } from 'lucide-react';

// Categories for filtering
const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'home', name: 'Home' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'sports', name: 'Sports' },
  { id: 'books', name: 'Books' },
  { id: 'toys', name: 'Toys' },
  { id: 'jewelry', name: 'Jewelry' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'grocery', name: 'Grocery' },
  { id: 'office', name: 'Office' },
  { id: 'health', name: 'Health' },
  { id: 'garden', name: 'Garden' },
  { id: 'pets', name: 'Pets' },
  { id: 'baby', name: 'Baby' }
];

// Price ranges for filtering
const priceRanges = [
  { id: 'under-50', name: 'Under $50' },
  { id: '50-100', name: '$50 - $100' },
  { id: '100-200', name: '$100 - $200' },
  { id: '200-500', name: '$200 - $500' },
  { id: '500-1000', name: '$500 - $1000' },
  { id: 'over-1000', name: 'Over $1000' }
];

// Rating options
const ratings = [
  { id: '4.5', name: '4.5 & Up' },
  { id: '4.0', name: '4.0 & Up' },
  { id: '3.5', name: '3.5 & Up' },
  { id: '3.0', name: '3.0 & Up' }
];

const ExtendedProductsPage = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const { toast } = useToast();
  
  // Local state for search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [displayCount, setDisplayCount] = useState(24);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter products based on selected filters and search
  const filteredProducts = useMemo(() => {
    return EXTENDED_PRODUCTS.filter(product => {
      // Apply category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Apply price range filter
      if (filters.priceRange && product.priceRange !== filters.priceRange) {
        return false;
      }

      // Apply rating filter
      if (filters.rating && parseFloat(product.rating) < parseFloat(filters.rating)) {
        return false;
      }

      // Apply search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [filters.category, filters.priceRange, filters.rating, debouncedSearch]);

  // Sort products based on selected sort option
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    
    switch(filters.sort) {
      case 'price-low-high':
        return products.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return products.sort((a, b) => b.price - a.price);
      case 'rating':
        return products.sort((a, b) => b.rating - a.rating);
      case 'popularity':
        return products.sort((a, b) => b.reviews - a.reviews);
      case 'newest':
      default:
        return products.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
  }, [filteredProducts, filters.sort]);

  // Use infinite scroll for lazy loading
  const { loadMore, lastElementRef } = useInfiniteScroll({
    initialPage: 1,
    threshold: 300,
    onLoadMore: async (page) => {
      const itemsPerPage = 24;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      
      if (end >= sortedProducts.length) {
        setDisplayCount(sortedProducts.length);
        return false;
      }
      
      setDisplayCount(end);
      return true;
    }
  });

  // Reset pagination when filters or search changes
  useEffect(() => {
    setDisplayCount(24);
  }, [filters, debouncedSearch]);

  // Handle resetting all filters
  const handleResetFilters = () => {
    dispatch(resetFilters());
    setSearchQuery('');
  };

  // Add to cart handler
  const handleAddToCart = (productId: string) => {
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart.",
      variant: "success",
    });
  };

  // Add to wishlist handler
  const handleAddToWishlist = (productId: string) => {
    toast({
      title: "Added to wishlist",
      description: "Item has been added to your wishlist.",
      variant: "success",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Browse our extended catalog of {EXTENDED_PRODUCTS.length} products
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView('grid')}
            className={view === 'grid' ? 'bg-primary/20' : ''}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-primary/20' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Select
            value={filters.sort}
            onValueChange={(value) => dispatch(setFilter({ key: 'sort', value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Search Products</h3>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="price">Price</TabsTrigger>
              <TabsTrigger value="rating">Rating</TabsTrigger>
            </TabsList>
            <TabsContent value="categories" className="pt-4">
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`}
                      checked={filters.category === category.id}
                      onCheckedChange={(checked) => {
                        dispatch(setFilter({ 
                          key: 'category', 
                          value: checked ? category.id : null 
                        }));
                      }}
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="price" className="pt-4">
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div key={range.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`price-${range.id}`}
                      checked={filters.priceRange === range.id}
                      onCheckedChange={(checked) => {
                        dispatch(setFilter({ 
                          key: 'priceRange', 
                          value: checked ? range.id : null 
                        }));
                      }}
                    />
                    <label
                      htmlFor={`price-${range.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {range.name}
                    </label>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="rating" className="pt-4">
              <div className="space-y-2">
                {ratings.map((rating) => (
                  <div key={rating.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`rating-${rating.id}`}
                      checked={filters.rating === rating.id}
                      onCheckedChange={(checked) => {
                        dispatch(setFilter({ 
                          key: 'rating', 
                          value: checked ? rating.id : null 
                        }));
                      }}
                    />
                    <label
                      htmlFor={`rating-${rating.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {rating.name}
                    </label>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < parseFloat(rating.id)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Active filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.category && (
              <Badge variant="secondary" className="px-3 py-1">
                {categories.find(c => c.id === filters.category)?.name}
                <button 
                  className="ml-2"
                  onClick={() => dispatch(setFilter({ key: 'category', value: null }))}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.priceRange && (
              <Badge variant="secondary" className="px-3 py-1">
                {priceRanges.find(p => p.id === filters.priceRange)?.name}
                <button 
                  className="ml-2"
                  onClick={() => dispatch(setFilter({ key: 'priceRange', value: null }))}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.rating && (
              <Badge variant="secondary" className="px-3 py-1">
                {ratings.find(r => r.id === filters.rating)?.name}
                <button 
                  className="ml-2"
                  onClick={() => dispatch(setFilter({ key: 'rating', value: null }))}
                >
                  ×
                </button>
              </Badge>
            )}
            {(filters.category || filters.priceRange || filters.rating || searchQuery) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleResetFilters}
                className="h-7 gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </Button>
            )}
          </div>
        </div>
        
        {/* Products grid */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
              <Button onClick={handleResetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {Math.min(displayCount, sortedProducts.length)} of {sortedProducts.length} products
              </p>
              
              {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.slice(0, displayCount).map((product) => (
                    <Card key={product.id} className="overflow-hidden h-full flex flex-col">
                      <div className="relative pb-[56.25%] bg-gray-100 dark:bg-gray-800">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {product.discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-red-500">
                            {product.discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : i < product.rating
                                  ? "text-yellow-400 fill-yellow-400 opacity-50"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                            ({product.reviews})
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                          {product.description}
                        </p>
                        <div className="flex gap-1 flex-wrap mb-2">
                          {product.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-lg font-bold">
                                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                              </span>
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-0">
                        <Button 
                          onClick={() => handleAddToCart(product.id)}
                          className="flex-1 gap-1"
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAddToWishlist(product.id)}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedProducts.slice(0, displayCount).map((product) => (
                    <Card key={product.id}>
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-48 h-48 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {product.discount > 0 && (
                            <Badge className="absolute top-2 right-2 bg-red-500">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col flex-grow p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{product.name}</h3>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : i < product.rating
                                      ? "text-yellow-400 fill-yellow-400 opacity-50"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                                ({product.reviews})
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {product.description}
                          </p>
                          <div className="flex gap-1 flex-wrap mb-2">
                            {product.tags.slice(0, 5).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div>
                              {product.discount > 0 ? (
                                <div className="flex items-center">
                                  <span className="text-lg font-bold">
                                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                  </span>
                                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                                    ${product.price.toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                              )}
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {product.inStock ? "In Stock" : "Out of Stock"}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleAddToCart(product.id)}
                                className="gap-1"
                                disabled={!product.inStock}
                              >
                                <ShoppingCart className="h-4 w-4" />
                                Add to Cart
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleAddToWishlist(product.id)}
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              
              {displayCount < sortedProducts.length && (
                <div className="mt-8 text-center">
                  <Button onClick={loadMore} variant="outline">
                    Load More Products
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtendedProductsPage;