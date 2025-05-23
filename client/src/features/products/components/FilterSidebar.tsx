import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ProductFilters } from '../productsApi';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  filters: ProductFilters;
  onUpdateFilters: (filters: Partial<ProductFilters>) => void;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  brands,
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
        
        {/* Availability */}
        <div className="pt-2">
          <div className="flex items-center">
            <Checkbox
              id="in-stock"
              checked={filters.inStock || false}
              onCheckedChange={(checked) => 
                handleInStockChange(checked === true)
              }
            />
            <Label
              htmlFor="in-stock"
              className="ml-2 text-sm cursor-pointer"
            >
              In Stock Only
            </Label>
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