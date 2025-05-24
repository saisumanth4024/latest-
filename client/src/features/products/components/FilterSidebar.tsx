import React, { useState, useEffect } from 'react';
import { X, Tag, Percent, CircleDot } from 'lucide-react';
import { ProductFilters } from '../productsSlice';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  colors?: string[];
  tags?: string[];
  priceRanges?: string[];
  filters: ProductFilters;
  onUpdateFilters: (filters: Partial<ProductFilters>) => void;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  brands,
  colors = [],
  tags = [],
  priceRanges = ["0-50", "50-100", "100-200", "200-500", "500+"],
  filters,
  onUpdateFilters,
  onClose,
}) => {
  // State for price range slider
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 2000,
  ]);
  
  // State for rating filter
  const [rating, setRating] = useState<number>(filters.minRating || 0);
  
  // Handle category selection
  const handleCategoryChange = (category: string) => {
    onUpdateFilters({
      category: filters.category === category ? undefined : category
    });
  };
  
  // Handle brand selection
  const handleBrandChange = (brand: string, checked: boolean) => {
    // Create a new array of brands based on current selection
    let newBrands: string[] = filters.brand ? [...filters.brand] : [];
    
    if (checked) {
      newBrands.push(brand);
    } else {
      newBrands = newBrands.filter(b => b !== brand);
    }
    
    onUpdateFilters({ brand: newBrands.length ? newBrands : undefined });
  };
  
  // Handle price range changes
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  // Apply price filter when slider stops
  const handlePriceChangeCommitted = () => {
    onUpdateFilters({
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    });
  };
  
  // Handle rating filter
  const handleRatingChange = (value: number[]) => {
    const newRating = value[0];
    setRating(newRating);
    onUpdateFilters({ minRating: newRating > 0 ? newRating : undefined });
  };
  
  // Handle in-stock filter
  const handleInStockChange = (checked: boolean) => {
    onUpdateFilters({ inStock: checked || undefined });
  };
  
  // Handle discount filter
  const handleDiscountChange = (checked: boolean) => {
    onUpdateFilters({ discount: checked || undefined });
  };
  
  // Handle price range selection using predefined ranges
  const handlePriceRangeSelect = (range: string) => {
    onUpdateFilters({ 
      priceRange: filters.priceRange === range ? undefined : range 
    });
  };
  
  // Handle color selection
  const handleColorChange = (color: string, checked: boolean) => {
    let newColors: string[] = filters.colors ? [...filters.colors] : [];
    
    if (checked) {
      newColors.push(color);
    } else {
      newColors = newColors.filter(c => c !== color);
    }
    
    onUpdateFilters({ colors: newColors.length ? newColors : undefined });
  };
  
  // Handle tag selection
  const handleTagChange = (tag: string, checked: boolean) => {
    let newTags: string[] = filters.tags ? [...filters.tags] : [];
    
    if (checked) {
      newTags.push(tag);
    } else {
      newTags = newTags.filter(t => t !== tag);
    }
    
    onUpdateFilters({ tags: newTags.length ? newTags : undefined });
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-6 overflow-y-auto flex-grow">
        {/* Categories */}
        <Accordion type="single" collapsible defaultValue="categories">
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.category === category}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Brands */}
        <Accordion type="single" collapsible defaultValue="brands">
          <AccordionItem value="brands">
            <AccordionTrigger>Brands</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={filters.brand?.includes(brand) || false}
                      onCheckedChange={(checked) => 
                        handleBrandChange(brand, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`brand-${brand}`}
                      className="ml-2 text-sm cursor-pointer"
                    >
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Price Range */}
        <Accordion type="single" collapsible defaultValue="price">
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 px-2">
                <Slider 
                  min={0}
                  max={2000}
                  step={50}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  onValueCommit={handlePriceChangeCommitted}
                  className="mb-6"
                />
                <div className="flex justify-between text-sm">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Rating */}
        <Accordion type="single" collapsible defaultValue="rating">
          <AccordionItem value="rating">
            <AccordionTrigger>Rating</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 px-2">
                <Slider 
                  min={0}
                  max={5}
                  step={0.5}
                  value={[rating]}
                  onValueChange={handleRatingChange}
                  className="mb-6"
                />
                <div className="flex justify-between text-sm">
                  <span>{rating === 0 ? 'Any' : `${rating}+ stars`}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Colors */}
        <Accordion type="single" collapsible defaultValue="colors">
          <AccordionItem value="colors">
            <AccordionTrigger>Colors</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {colors.map((color) => (
                  <div key={color} className="flex items-center">
                    <Checkbox
                      id={`color-${color}`}
                      checked={filters.colors?.includes(color) || false}
                      onCheckedChange={(checked) => 
                        handleColorChange(color, checked === true)
                      }
                    />
                    <div className="flex items-center ml-2">
                      <div 
                        className="w-4 h-4 rounded-full mr-1.5" 
                        style={{ 
                          backgroundColor: color.toLowerCase(),
                          border: '1px solid #e2e8f0'
                        }}
                      />
                      <Label
                        htmlFor={`color-${color}`}
                        className="text-sm cursor-pointer"
                      >
                        {color}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Popular Tags */}
        <Accordion type="single" collapsible defaultValue="tags">
          <AccordionItem value="tags">
            <AccordionTrigger>Popular Tags</AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[180px] pr-3">
                <div className="space-y-2 pt-2">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={filters.tags?.includes(tag) || false}
                        onCheckedChange={(checked) => 
                          handleTagChange(tag, checked === true)
                        }
                      />
                      <Label
                        htmlFor={`tag-${tag}`}
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Price Ranges */}
        <Accordion type="single" collapsible defaultValue="priceRanges">
          <AccordionItem value="priceRanges">
            <AccordionTrigger>Price Ranges</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {priceRanges.map((range) => (
                  <div key={range} className="flex items-center">
                    <Checkbox
                      id={`price-${range}`}
                      checked={filters.priceRange === range}
                      onCheckedChange={() => handlePriceRangeSelect(range)}
                    />
                    <Label
                      htmlFor={`price-${range}`}
                      className="ml-2 text-sm cursor-pointer"
                    >
                      ${range}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Special Filters */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <Label htmlFor="discount-filter" className="text-sm">On Sale Items</Label>
            </div>
            <Switch
              id="discount-filter"
              checked={filters.discount || false}
              onCheckedChange={handleDiscountChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CircleDot className="h-4 w-4" />
              <Label htmlFor="stock-filter" className="text-sm">In Stock Only</Label>
            </div>
            <Switch
              id="stock-filter"
              checked={filters.inStock || false}
              onCheckedChange={handleInStockChange}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t mt-6">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => onUpdateFilters({})}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;