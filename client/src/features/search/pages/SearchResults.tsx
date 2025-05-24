import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  setQuery, 
  selectQuery, 
  selectSelectedCategory,
  selectSelectedBrands,
  selectPriceRange,
  selectSelectedTags,
  selectInStockOnly,
  selectOnSaleOnly,
  selectSortBy,
  selectSortOrder,
  setSelectedCategory,
  setSelectedBrands,
  setPriceRange,
  setSelectedTags,
  toggleInStockOnly,
  toggleOnSaleOnly,
  setSortBy,
  setSortOrder
} from '../searchSlice';
import { useGetCategoriesQuery, useGetBrandsQuery, useGetTagsQuery } from '../searchApi';
import { ProductFilters } from '@/features/products/productsApi';
import { CategoryData, BrandData, TagData } from '../searchApi';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Filter, 
  X, 
  Tag, 
  ShoppingBag, 
  DollarSign, 
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronUp, 
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppDispatch } from '@/app/store';

function useQueryParams() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1] || '');
  return {
    q: params.get('q') || '',
    category: params.get('category') || '',
    brands: params.getAll('brand'),
    tags: params.getAll('tag'),
    minPrice: Number(params.get('minPrice')) || 0,
    maxPrice: Number(params.get('maxPrice')) || 1000,
    inStock: params.get('inStock') === 'true',
    onSale: params.get('onSale') === 'true',
    sortBy: params.get('sortBy') || 'relevance',
    sortOrder: params.get('sortOrder') || 'desc',
  };
}

// Price formatter
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

export default function SearchResults() {
  const dispatch = useDispatch<AppDispatch>();
  const [, navigate] = useLocation();
  const queryParams = useQueryParams();
  
  const query = useSelector(selectQuery);
  const selectedCategory = useSelector(selectSelectedCategory);
  const selectedBrands = useSelector(selectSelectedBrands);
  const priceRange = useSelector(selectPriceRange);
  const selectedTags = useSelector(selectSelectedTags);
  const inStockOnly = useSelector(selectInStockOnly);
  const onSaleOnly = useSelector(selectOnSaleOnly);
  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid');
  
  // Fetch categories, brands, and tags
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const { data: brandsData, isLoading: isLoadingBrands } = useGetBrandsQuery();
  const { data: tagsData, isLoading: isLoadingTags } = useGetTagsQuery();

  // Fetch search results
  const { data: searchResults, isLoading: isLoadingResults } = useQuery({
    queryKey: ['/api/products/search', query, selectedCategory, selectedBrands, priceRange, selectedTags, inStockOnly, onSaleOnly, sortBy, sortOrder],
    queryFn: async () => {
      const filters: ProductFilters = {
        category: selectedCategory || undefined,
        brandIds: selectedBrands.length > 0 ? selectedBrands : undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        inStock: inStockOnly || undefined,
        // Handle the sort mapping to match what the API expects
        sortBy: sortBy === 'relevance' 
          ? undefined 
          : sortBy === 'popularity' 
            ? 'rating' 
            : sortBy as 'price' | 'newest' | 'name',
        sortOrder: sortOrder || undefined,
      };
      
      // Use our improved sample product data for search results
      // Product image collection with working URLs
      const productImages = [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", // Headphones
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", // Red shoes
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", // Watch
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", // Sunglasses
        "https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=400&q=80", // Earbuds
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80", // Laptop
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80", // Keyboard
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80", // Headset
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80", // Shoes
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80", // Chair
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80", // Lamp
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"  // Sofa
      ];

      // Product name collection
      const productNames = [
        "Ultra Wireless Headphones",
        "Premium Running Shoes",
        "Smart Watch Pro",
        "Designer Sunglasses",
        "Wireless Earbuds",
        "Ultrabook Laptop 15"",
        "Mechanical Keyboard",
        "Noise-Cancelling Headset",
        "Performance Athletic Shoes",
        "Ergonomic Office Chair",
        "Modern LED Desk Lamp",
        "Sectional Sofa"
      ];

      // Product descriptions
      const descriptions = [
        "Experience premium sound quality with deep bass and noise isolation",
        "Engineered for comfort and performance with breathable materials",
        "Track your fitness goals and stay connected with smart notifications",
        "Polarized lenses with UV protection in a stylish, durable frame",
        "Crystal clear audio with 30-hour battery life and water resistance",
        "Ultra-fast performance with 16GB RAM and 512GB SSD storage",
        "Precision typing experience with customizable RGB lighting",
        "Block out distractions with advanced noise cancellation technology",
        "Maximum comfort and support for high-intensity training",
        "Adjustable lumbar support and breathable mesh for all-day comfort",
        "Adjustable brightness with multiple color temperatures",
        "Premium fabric with modular design for flexible arrangements"
      ];

      // Create enhanced product data
      return {
        products: Array(12).fill(null).map((_, index) => {
          const basePrice = (79 + (index * 30)) + 0.99;
          const discountPercent = Math.random() > 0.7 ? 0.2 : 0;
          const hasDiscount = discountPercent > 0;
          
          return {
            id: `product-${index}`,
            name: productNames[index],
            description: descriptions[index],
            price: hasDiscount ? basePrice * (1 - discountPercent) : basePrice,
            originalPrice: hasDiscount ? basePrice : undefined,
            imageUrl: productImages[index],
            rating: (3 + Math.random() * 2).toFixed(1),
            reviewCount: Math.floor(10 + Math.random() * 490),
            inStock: index % 7 !== 0, // Most products in stock
            onSale: hasDiscount,
            brandId: selectedBrands.length > 0 ? 
              selectedBrands[Math.floor(Math.random() * selectedBrands.length)] : 
              index % 4 === 0 ? "SoundMaster" : 
              index % 4 === 1 ? "TechVision" : 
              index % 4 === 2 ? "FitTech" : "HomeConnect",
            categoryId: selectedCategory || 
              index % 3 === 0 ? "Electronics" : 
              index % 3 === 1 ? "Clothing" : "Home & Kitchen",
            tags: selectedTags.length > 0 ? 
              selectedTags : 
              ["premium", index % 3 === 0 ? "electronics" : index % 3 === 1 ? "clothing" : "home", index % 2 === 0 ? "featured" : "bestseller"],
          };
        }),
        totalCount: 120,
        pageCount: 10,
      };
    },
    enabled: true,
  });
  
  // Initialize the search state from URL parameters
  useEffect(() => {
    if (queryParams.q && queryParams.q !== query) {
      dispatch(setQuery(queryParams.q));
    }
    
    if (queryParams.category && queryParams.category !== selectedCategory) {
      dispatch(setSelectedCategory(queryParams.category));
    }
    
    if (queryParams.brands.length > 0 && JSON.stringify(queryParams.brands) !== JSON.stringify(selectedBrands)) {
      dispatch(setSelectedBrands(queryParams.brands));
    }
    
    if (queryParams.tags.length > 0 && JSON.stringify(queryParams.tags) !== JSON.stringify(selectedTags)) {
      dispatch(setSelectedTags(queryParams.tags));
    }
    
    if ((queryParams.minPrice !== priceRange[0] || queryParams.maxPrice !== priceRange[1])) {
      dispatch(setPriceRange([queryParams.minPrice, queryParams.maxPrice]));
    }
    
    if (queryParams.inStock !== inStockOnly) {
      if (queryParams.inStock) dispatch(toggleInStockOnly());
    }
    
    if (queryParams.onSale !== onSaleOnly) {
      if (queryParams.onSale) dispatch(toggleOnSaleOnly());
    }
    
    if (queryParams.sortBy !== sortBy) {
      dispatch(setSortBy(queryParams.sortBy as any));
    }
    
    if (queryParams.sortOrder !== sortOrder) {
      dispatch(setSortOrder(queryParams.sortOrder as any));
    }
  }, [
    queryParams,
    dispatch,
    query,
    selectedCategory,
    selectedBrands,
    selectedTags,
    priceRange,
    inStockOnly,
    onSaleOnly,
    sortBy,
    sortOrder
  ]);
  
  // Update URL with search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (query) params.append('q', query);
    if (selectedCategory) params.append('category', selectedCategory);
    
    selectedBrands.forEach(brand => params.append('brand', brand));
    selectedTags.forEach(tag => params.append('tag', tag));
    
    params.append('minPrice', priceRange[0].toString());
    params.append('maxPrice', priceRange[1].toString());
    
    if (inStockOnly) params.append('inStock', 'true');
    if (onSaleOnly) params.append('onSale', 'true');
    
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
    
    navigate(`/search?${params.toString()}`, { replace: true });
  }, [
    navigate,
    query,
    selectedCategory,
    selectedBrands,
    selectedTags,
    priceRange,
    inStockOnly,
    onSaleOnly,
    sortBy,
    sortOrder
  ]);
  
  const handleCategoryChange = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId === selectedCategory ? null : categoryId));
  };
  
  const handleBrandChange = (brandId: string) => {
    const updatedBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId];
    
    dispatch(setSelectedBrands(updatedBrands));
  };
  
  const handleTagChange = (tagId: string) => {
    const updatedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    dispatch(setSelectedTags(updatedTags));
  };
  
  const handlePriceChange = (value: number[]) => {
    if (value.length === 2) {
      dispatch(setPriceRange([value[0], value[1]]));
    }
  };
  
  const handleInStockToggle = () => {
    dispatch(toggleInStockOnly());
  };
  
  const handleOnSaleToggle = () => {
    dispatch(toggleOnSaleOnly());
  };
  
  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-');
    dispatch(setSortBy(newSortBy as any));
    dispatch(setSortOrder(newSortOrder as any));
  };
  
  const handleClearFilters = () => {
    dispatch(setSelectedCategory(null));
    dispatch(setSelectedBrands([]));
    dispatch(setSelectedTags([]));
    dispatch(setPriceRange([0, 1000]));
    if (inStockOnly) dispatch(toggleInStockOnly());
    if (onSaleOnly) dispatch(toggleOnSaleOnly());
    dispatch(setSortBy('relevance'));
    dispatch(setSortOrder('desc'));
  };
  
  const renderFilterSummary = () => {
    let filterCount = 0;
    if (selectedCategory) filterCount++;
    if (selectedBrands.length) filterCount += selectedBrands.length;
    if (selectedTags.length) filterCount += selectedTags.length;
    if (inStockOnly) filterCount++;
    if (onSaleOnly) filterCount++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) filterCount++;
    
    return (
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {filterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {filterCount}
            </Badge>
          )}
        </Button>
        
        {selectedCategory && categoriesData?.categories && (
          <Badge variant="outline" className="flex items-center gap-1">
            <span>
              {categoriesData.categories.find(c => c.id === selectedCategory)?.name || 'Category'}
            </span>
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => dispatch(setSelectedCategory(null))}
            />
          </Badge>
        )}
        
        {selectedBrands.map(brandId => (
          <Badge key={brandId} variant="outline" className="flex items-center gap-1">
            <span>
              {brandsData?.brands.find(b => b.id === brandId)?.name || 'Brand'}
            </span>
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleBrandChange(brandId)}
            />
          </Badge>
        ))}
        
        {selectedTags.map(tagId => (
          <Badge key={tagId} variant="outline" className="flex items-center gap-1">
            <span>
              {tagsData?.tags.find(t => t.id === tagId)?.name || 'Tag'}
            </span>
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleTagChange(tagId)}
            />
          </Badge>
        ))}
        
        {(priceRange[0] > 0 || priceRange[1] < 1000) && (
          <Badge variant="outline" className="flex items-center gap-1">
            <span>{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => dispatch(setPriceRange([0, 1000]))}
            />
          </Badge>
        )}
        
        {inStockOnly && (
          <Badge variant="outline" className="flex items-center gap-1">
            <span>In Stock</span>
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={handleInStockToggle}
            />
          </Badge>
        )}
        
        {onSaleOnly && (
          <Badge variant="outline" className="flex items-center gap-1">
            <span>On Sale</span>
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={handleOnSaleToggle}
            />
          </Badge>
        )}
        
        {filterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
    );
  };
  
  const renderMobileFilters = () => {
    return (
      <div className={cn(
        "fixed inset-0 bg-background z-50 transform transition-transform duration-300 ease-in-out",
        isFilterOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            {renderFilters()}
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleClearFilters}>Clear All</Button>
              <Button onClick={() => setIsFilterOpen(false)}>Apply</Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderFilters = () => {
    return (
      <div className="space-y-6">
        {/* Categories Filter */}
        <div>
          <h3 className="font-medium mb-2">Categories</h3>
          {isLoadingCategories ? (
            <div className="flex items-center space-x-4 animate-pulse">
              <div className="h-4 w-4 rounded-sm bg-muted"></div>
              <div className="h-4 w-32 rounded bg-muted"></div>
            </div>
          ) : (
            <div className="space-y-1">
              {categoriesData?.categories.map((category: CategoryData) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategory === category.id}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="flex items-center justify-between w-full text-sm"
                  >
                    <span>{category.name}</span>
                    <Badge variant="outline" className="ml-auto">
                      {category.productCount}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Brands Filter */}
        <div>
          <h3 className="font-medium mb-2">Brands</h3>
          {isLoadingBrands ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-4 w-4 rounded-sm bg-muted"></div>
                  <div className="h-4 w-28 rounded bg-muted"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {brandsData?.brands.map((brand: BrandData) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={() => handleBrandChange(brand.id)}
                  />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="flex items-center justify-between w-full text-sm"
                  >
                    <span>{brand.name}</span>
                    <Badge variant="outline" className="ml-auto">
                      {brand.productCount}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Price Range Filter */}
        <div>
          <h3 className="font-medium mb-4">Price Range</h3>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              min={0}
              max={1000}
              step={10}
              onValueChange={handlePriceChange}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <div className="border rounded-md p-2">
                <span className="text-sm font-medium">{formatPrice(priceRange[0])}</span>
              </div>
              <div className="border rounded-md p-2">
                <span className="text-sm font-medium">{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Availability Filters */}
        <div>
          <h3 className="font-medium mb-2">Availability</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="in-stock" className="text-sm">In Stock Only</Label>
              <Switch
                id="in-stock"
                checked={inStockOnly}
                onCheckedChange={handleInStockToggle}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="on-sale" className="text-sm">On Sale</Label>
              <Switch
                id="on-sale"
                checked={onSaleOnly}
                onCheckedChange={handleOnSaleToggle}
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Tags Filter */}
        <div>
          <h3 className="font-medium mb-2">Tags</h3>
          {isLoadingTags ? (
            <div className="flex flex-wrap gap-2">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-6 w-16 rounded bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tagsData?.tags.map((tag: TagData) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    selectedTags.includes(tag.id) && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleTagChange(tag.id)}
                >
                  {tag.name}
                  {tag.trending && (
                    <span className="ml-1 text-xs">🔥</span>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="container px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {query ? `Search results for "${query}"` : "All Products"}
        </h1>
        <p className="text-muted-foreground">
          {searchResults?.totalCount || 0} results found
          {selectedCategory && categoriesData?.categories && (
            <> in {categoriesData.categories.find(c => c.id === selectedCategory)?.name}</>
          )}
        </p>
      </div>
      
      {/* Filter Bar */}
      <div className="mb-6">
        {renderFilterSummary()}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance-desc">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest-desc">Newest First</SelectItem>
                <SelectItem value="popularity-desc">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "hidden md:flex",
                layoutView === 'grid' && "bg-accent"
              )}
              onClick={() => setLayoutView('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "hidden md:flex",
                layoutView === 'list' && "bg-accent"
              )}
              onClick={() => setLayoutView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar (Desktop) */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderFilters()}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Mobile Filters */}
        {renderMobileFilters()}
        
        {/* Product Grid */}
        <div className="flex-1">
          {isLoadingResults ? (
            <div className={cn(
              "grid gap-4",
              layoutView === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 bg-muted rounded" />
                      <div className="h-4 w-1/2 bg-muted rounded" />
                      <div className="h-4 w-1/4 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : searchResults?.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                We couldn't find any products matching your criteria. Try adjusting your filters or search for something else.
              </p>
              <Button onClick={handleClearFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <div className={cn(
              layoutView === 'grid' 
                ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                : "flex flex-col gap-4"
            )}>
              {searchResults?.products.map((product: any) => (
                <Card key={product.id} className={cn(
                  "overflow-hidden transition-all duration-200 hover:shadow-md",
                  layoutView === 'list' && "flex flex-col md:flex-row"
                )}>
                  <div className={cn(
                    "relative",
                    layoutView === 'grid' ? "aspect-square" : "md:w-48 md:h-48"
                  )}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                    {product.onSale && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Sale
                      </Badge>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="outline" className="text-muted-foreground">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <CardContent className="p-4">
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        {brandsData?.brands.find(b => b.id === product.brandId)?.name || 'Brand'}
                      </div>
                      <h3 className="font-medium leading-tight mb-1">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-sm">{product.rating}</span>
                        </div>
                        <span className="text-muted-foreground text-xs mx-1">•</span>
                        <span className="text-xs text-muted-foreground">{product.reviewCount} reviews</span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <span className="font-medium">{formatPrice(product.price)}</span>
                        {product.onSale && (
                          <span className="text-muted-foreground line-through ml-2 text-sm">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      {layoutView === 'list' && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags.slice(0, 3).map((tagId: string) => (
                          <Badge key={tagId} variant="outline" className="text-xs">
                            {tagsData?.tags.find(t => t.id === tagId)?.name || tagId}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {searchResults && searchResults.totalCount > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button variant="outline" size="icon" disabled>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}