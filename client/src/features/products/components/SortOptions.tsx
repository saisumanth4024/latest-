import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowDownAZ, ArrowUpAZ, Flame, Star, DollarSign } from 'lucide-react';

interface SortOptionsProps {
  sortBy: 'price' | 'name' | 'rating' | 'newest';
  sortOrder: 'asc' | 'desc';
  onChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  sortBy,
  sortOrder,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSortChange = (value: string) => {
    // Format is "field:order"
    const [newSortBy, newSortOrder] = value.split(':');
    onChange(newSortBy, newSortOrder as 'asc' | 'desc');
  };
  
  const getSortIcon = () => {
    switch (sortBy) {
      case 'name':
        return sortOrder === 'asc' ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />;
      case 'price':
        return <DollarSign className="h-4 w-4" />;
      case 'rating':
        return <Star className="h-4 w-4" />;
      case 'newest':
        return <Flame className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getSortLabel = () => {
    switch (sortBy) {
      case 'name':
        return `Name (${sortOrder === 'asc' ? 'A-Z' : 'Z-A'})`;
      case 'price':
        return `Price (${sortOrder === 'asc' ? 'Low to High' : 'High to Low'})`;
      case 'rating':
        return `Rating (${sortOrder === 'asc' ? 'Low to High' : 'High to Low'})`;
      case 'newest':
        return 'Newest First';
      default:
        return 'Sort By';
    }
  };
  
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
        <Select 
          value={`${sortBy}:${sortOrder}`} 
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue>
              <div className="flex items-center gap-2">
                {getSortIcon()}
                <span>{getSortLabel()}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest:desc">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                <span>Newest First</span>
              </div>
            </SelectItem>
            <SelectItem value="price:asc">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Price: Low to High</span>
              </div>
            </SelectItem>
            <SelectItem value="price:desc">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Price: High to Low</span>
              </div>
            </SelectItem>
            <SelectItem value="rating:desc">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Highest Rated</span>
              </div>
            </SelectItem>
            <SelectItem value="name:asc">
              <div className="flex items-center gap-2">
                <ArrowDownAZ className="h-4 w-4" />
                <span>Name: A to Z</span>
              </div>
            </SelectItem>
            <SelectItem value="name:desc">
              <div className="flex items-center gap-2">
                <ArrowUpAZ className="h-4 w-4" />
                <span>Name: Z to A</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SortOptions;