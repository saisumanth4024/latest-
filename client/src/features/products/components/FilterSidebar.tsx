import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  selectSearchParams, 
  selectIsSidebarOpen, 
  setCategory, 
  setBrand, 
  setPriceRange, 
  setRating, 
  setFilter,
  resetFilters,
  setSidebarOpen
} from '../productsSlice';
import { useGetProductCategoriesQuery, useGetProductBrandsQuery } from '../productsApi';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Checkbox,
  Label,
  Slider,
  Badge,
  Button
} from '@/components/ui';
import { 
  Filter as FilterIcon, 
  X as CloseIcon,
  Star,
  Tags,
  Package,
  DollarSign,
  BarChart3,
  Check 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FilterSidebar = () => {
  const dispatch = useAppDispatch();
  const searchParams = useAppSelector(selectSearchParams);
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen);
  const [priceRange, setPriceRangeState] = useState<[number, number]>([0, 1000]);
  const [selectedRating, setSelectedRating] = useState<number | undefined>(searchParams.rating);
  
  // RTK Query hooks
  const { data: categories = [] } = useGetProductCategoriesQuery();
  const { data: brands = [] } = useGetProductBrandsQuery();
  
  // Sync local state with Redux state
  useEffect(() => {
    setPriceRangeState([
      searchParams.minPrice || 0,
      searchParams.maxPrice || 1000
    ]);
    setSelectedRating(searchParams.rating);
  }, [searchParams.minPrice, searchParams.maxPrice, searchParams.rating]);
  
  // Handle price range change
  const handlePriceRangeChange = (values: [number, number]) => {
    setPriceRangeState(values);
  };
  
  // Apply price range filter
  const handlePriceRangeCommit = (values: [number, number]) => {
    dispatch(setPriceRange({ min: values[0], max: values[1] }));
  };
  
  // Handle rating filter change
  const handleRatingChange = (rating: number) => {
    if (selectedRating === rating) {
      // Clear rating filter if the same rating is clicked again
      setSelectedRating(undefined);
      dispatch(setRating(undefined));
    } else {
      setSelectedRating(rating);
      dispatch(setRating(rating));
    }
  };
  
  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    const isSelected = searchParams.category === category;
    dispatch(setCategory(isSelected ? undefined : category));
  };
  
  // Handle brand filter change
  const handleBrandChange = (brand: string) => {
    const isSelected = searchParams.brand === brand;
    dispatch(setBrand(isSelected ? undefined : brand));
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };
  
  // Close sidebar on mobile
  const handleCloseSidebar = () => {
    dispatch(setSidebarOpen(false));
  };
  
  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (searchParams.category) count++;
    if (searchParams.brand) count++;
    if (searchParams.minPrice || searchParams.maxPrice) count++;
    if (searchParams.rating) count++;
    if (searchParams.filters) count += Object.keys(searchParams.filters).length;
    return count;
  };
  
  const activeFiltersCount = countActiveFilters();
  
  return (
    <div
      className={cn(
        'h-full z-40',
        'fixed inset-y-0 left-0 md:relative transition-transform duration-300 ease-in-out',
        'bg-white dark:bg-gray-900 border-r dark:border-gray-800',
        'w-80 max-w-[80vw] lg:w-72 md:w-60',
        !isSidebarOpen && 'translate-x-[-100%] md:translate-x-0'
      )}
    >
      {/* Mobile header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-800 md:hidden">
        <h2 className="text-lg font-semibold flex items-center">
          <FilterIcon className="mr-2 h-5 w-5" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </h2>
        <Button variant="ghost" size="icon" onClick={handleCloseSidebar}>
          <CloseIcon className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Filter content */}
      <div className="p-4 overflow-y-auto h-full pb-24 md:pb-0">
        {/* Title (desktop) */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <FilterIcon className="mr-2 h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </h2>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              Reset
            </Button>
          )}
        </div>
        
        {/* Accordions for different filter types */}
        <Accordion type="multiple" defaultValue={['category', 'price', 'rating']} className="space-y-2">
          {/* Categories filter */}
          <AccordionItem value="category" className="border-b-0">
            <AccordionTrigger className="py-3 px-2">
              <span className="flex items-center">
                <Tags className="mr-2 h-4 w-4" />
                Categories
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <Checkbox
                      id={`category-${category}`}
                      checked={searchParams.category === category}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm cursor-pointer flex-1"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Brands filter */}
          <AccordionItem value="brand" className="border-b-0">
            <AccordionTrigger className="py-3 px-2">
              <span className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Brands
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-2 max-h-60 overflow-y-auto">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={searchParams.brand === brand}
                      onCheckedChange={() => handleBrandChange(brand)}
                    />
                    <Label
                      htmlFor={`brand-${brand}`}
                      className="ml-2 text-sm cursor-pointer flex-1"
                    >
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Price range filter */}
          <AccordionItem value="price" className="border-b-0">
            <AccordionTrigger className="py-3 px-2">
              <span className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Price Range
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-2 pt-2 pb-6">
                <div className="flex justify-between mb-4">
                  <div className="border rounded-md p-2 w-20 text-center">
                    ${priceRange[0]}
                  </div>
                  <div className="border rounded-md p-2 w-20 text-center">
                    ${priceRange[1]}
                  </div>
                </div>
                <Slider
                  value={priceRange}
                  min={0}
                  max={1000}
                  step={5}
                  onValueChange={handlePriceRangeChange}
                  onValueCommit={handlePriceRangeCommit}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Rating filter */}
          <AccordionItem value="rating" className="border-b-0">
            <AccordionTrigger className="py-3 px-2">
              <span className="flex items-center">
                <Star className="mr-2 h-4 w-4" />
                Rating
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={cn(
                      "flex items-center w-full py-2 px-2 rounded-md",
                      selectedRating === rating 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <div className="flex mr-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4 mr-0.5",
                            i < rating 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300 dark:text-gray-600"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm">& Up</span>
                    {selectedRating === rating && (
                      <Check className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Mobile footer with clear/apply buttons */}
        <div className="fixed bottom-0 left-0 p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800 w-full md:hidden">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleResetFilters}
            >
              Reset All
            </Button>
            <Button
              className="flex-1"
              onClick={handleCloseSidebar}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;