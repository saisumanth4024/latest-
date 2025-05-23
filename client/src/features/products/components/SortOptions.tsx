import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectSearchParams, setSort, setViewMode, selectViewMode } from '../productsSlice';
import { SortOption } from '../types';
import { 
  LayoutGrid, 
  List as ListIcon,
  SortAsc, 
  ChevronDown 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  ToggleGroup,
  ToggleGroupItem
} from '@/components/ui';
import { cn } from '@/lib/utils';

interface SortOptionsProps {
  className?: string;
}

const SortOptions = ({ className }: SortOptionsProps) => {
  const dispatch = useAppDispatch();
  const { sort } = useAppSelector(selectSearchParams);
  const viewMode = useAppSelector(selectViewMode);

  // Handle sort change
  const handleSortChange = (value: string) => {
    dispatch(setSort(value as SortOption));
  };

  // Handle view mode change
  const handleViewModeChange = (value: string) => {
    if (value) {
      dispatch(setViewMode(value as 'grid' | 'list'));
    }
  };

  // Sort options with human-readable labels
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'bestselling', label: 'Best Selling' },
    { value: 'discount', label: 'Biggest Discount' }
  ];

  return (
    <div className={cn('flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3', className)}>
      {/* Sort selection */}
      <div className="flex items-center">
        <SortAsc className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
        <span className="hidden sm:inline text-sm mr-2 text-gray-600 dark:text-gray-400">
          Sort by:
        </span>
        <Select
          value={sort}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Select a sort option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* View mode toggle */}
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={handleViewModeChange}
        className="border rounded-md"
      >
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <ListIcon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default SortOptions;