import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  setCategory, 
  setBrand, 
  setPriceRange, 
  setRating, 
  resetFilters,
  selectSearchParams
} from '../productsSlice';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Label,
  Slider 
} from '@/components/ui';
import { Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const FilterSidebar = () => {
  const dispatch = useAppDispatch();
  const { category, brand, minPrice, maxPrice, rating } = useAppSelector(selectSearchParams);
  
  // Local state for price range slider
  const [priceRange, setPriceRangeLocal] = useState<[number, number]>([
    minPrice || 0,
    maxPrice || 1000
  ]);
  
  // Update local state when Redux state changes
  useEffect(() => {
    setPriceRangeLocal([
      minPrice || 0,
      maxPrice || 1000
    ]);
  }, [minPrice, maxPrice]);
  
  // Handle price range change
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRangeLocal(values as [number, number]);
  };
  
  // Apply price range filter when slider stops
  const handlePriceRangeCommit = (values: number[]) => {
    dispatch(setPriceRange({
      minPrice: values[0],
      maxPrice: values[1]
    }));
  };
  
  // Handle category change
  const handleCategoryChange = (categoryName: string) => {
    dispatch(setCategory(category === categoryName ? null : categoryName));
  };
  
  // Handle brand change
  const handleBrandChange = (brandName: string) => {
    dispatch(setBrand(brand === brandName ? null : brandName));
  };
  
  // Handle rating change
  const handleRatingChange = (ratingValue: number) => {
    dispatch(setRating(rating === ratingValue ? null : ratingValue));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    dispatch(resetFilters());
  };
  
  // Sample category and brand data
  const categories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home & Kitchen' },
    { id: 'beauty', name: 'Beauty & Personal Care' },
    { id: 'books', name: 'Books' },
    { id: 'toys', name: 'Toys & Games' }
  ];
  
  const brands = [
    { id: 'apple', name: 'Apple' },
    { id: 'samsung', name: 'Samsung' },
    { id: 'nike', name: 'Nike' },
    { id: 'adidas', name: 'Adidas' },
    { id: 'sony', name: 'Sony' },
    { id: 'lg', name: 'LG' }
  ];
  
  const ratings = [5, 4, 3, 2, 1];
  
  // Render stars for rating
  const renderStars = (count: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star 
            key={index} 
            className={cn(
              "h-4 w-4", 
              index < count 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            )} 
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">& Up</span>
      </div>
    );
  };
  
  return (
    <Card className="sticky top-4">
      <CardHeader className="px-4 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 px-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-4">
        <Accordion type="multiple" defaultValue={['price', 'category', 'brand', 'rating']} className="space-y-2">
          {/* Price Range */}
          <AccordionItem value="price" className="border rounded-md px-3">
            <AccordionTrigger className="py-2 hover:no-underline">
              Price Range
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="px-2">
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  onValueCommit={handlePriceRangeCommit}
                  className="my-6"
                />
                <div className="flex justify-between items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
                    ${priceRange[0]}
                  </div>
                  <div className="text-sm text-gray-500">to</div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
                    ${priceRange[1]}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Categories */}
          <AccordionItem value="category" className="border rounded-md px-3">
            <AccordionTrigger className="py-2 hover:no-underline">
              Categories
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${cat.id}`} 
                      checked={category === cat.id}
                      onCheckedChange={() => handleCategoryChange(cat.id)}
                    />
                    <Label 
                      htmlFor={`category-${cat.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {cat.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Brands */}
          <AccordionItem value="brand" className="border rounded-md px-3">
            <AccordionTrigger className="py-2 hover:no-underline">
              Brands
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-2">
                {brands.map((b) => (
                  <div key={b.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`brand-${b.id}`} 
                      checked={brand === b.id}
                      onCheckedChange={() => handleBrandChange(b.id)}
                    />
                    <Label 
                      htmlFor={`brand-${b.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {b.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Ratings */}
          <AccordionItem value="rating" className="border rounded-md px-3">
            <AccordionTrigger className="py-2 hover:no-underline">
              Ratings
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-2">
                {ratings.map((r) => (
                  <div key={r} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`rating-${r}`} 
                      checked={rating === r}
                      onCheckedChange={() => handleRatingChange(r)}
                    />
                    <Label 
                      htmlFor={`rating-${r}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {renderStars(r)}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;