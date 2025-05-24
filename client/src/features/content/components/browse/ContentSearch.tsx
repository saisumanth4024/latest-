import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setContentFilters, 
  resetContentFilters, 
  setSearchQuery,
  selectContentFilters,
  selectSearchQuery,
  selectSelectedContentType,
  selectSelectedCategory,
  setSelectedContentType,
  setSelectedCategory,
  selectContentSort,
  setContentSort
} from '../../contentSlice';
import { useSearchContentQuery } from '../../contentApi';
import { ContentFilter } from '../../types';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Tag,
  Calendar,
  Video,
  Image,
  FileText,
  Tag as TagIcon,
  ShoppingBag
} from 'lucide-react';

// Helper function for date formatting
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Content types available for filtering
const contentTypes = [
  { id: 'video', label: 'Videos', icon: <Video className="h-4 w-4" /> },
  { id: 'image', label: 'Images', icon: <Image className="h-4 w-4" /> },
  { id: 'banner', label: 'Banners', icon: <FileText className="h-4 w-4" /> },
  { id: 'page', label: 'Pages', icon: <FileText className="h-4 w-4" /> },
  { id: 'deal', label: 'Deals', icon: <ShoppingBag className="h-4 w-4" /> }
];

// Sample categories (in a real app, these would come from the API)
const categories = [
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'education', label: 'Education' },
  { id: 'sports', label: 'Sports' },
  { id: 'technology', label: 'Technology' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'news', label: 'News' },
  { id: 'music', label: 'Music' },
  { id: 'gaming', label: 'Gaming' }
];

// Sample tags (in a real app, these would come from the API)
const popularTags = [
  'tutorial', 'trending', 'new', 'featured', 'best-seller', 
  'popular', 'top-rated', 'discount', 'exclusive', 'premium'
];

interface ContentSearchProps {
  initialFilters?: Partial<ContentFilter>;
  onResultsChange?: (results: any) => void;
  showTagsFilter?: boolean;
  showCategoriesFilter?: boolean;
  showDateFilter?: boolean;
  showStatusFilter?: boolean;
  showTypeFilter?: boolean;
  showSortOptions?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
}

export const ContentSearch: React.FC<ContentSearchProps> = ({
  initialFilters,
  onResultsChange,
  showTagsFilter = true,
  showCategoriesFilter = true,
  showDateFilter = true,
  showStatusFilter = true,
  showTypeFilter = true,
  showSortOptions = true,
  className = '',
  variant = 'default'
}) => {
  const dispatch = useDispatch();
  
  // Get content filters from Redux
  const filters = useSelector(selectContentFilters);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedContentType = useSelector(selectSelectedContentType);
  const selectedCategory = useSelector(selectSelectedCategory);
  const sortOptions = useSelector(selectContentSort);
  
  // Local state
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || []);
  const [dateRange, setDateRange] = useState({
    startDate: filters.dateRange?.startDate || '',
    endDate: filters.dateRange?.endDate || ''
  });
  const [statusFilter, setStatusFilter] = useState(filters.status || 'active');
  
  // Apply initial filters on component mount
  useEffect(() => {
    if (initialFilters) {
      dispatch(setContentFilters(initialFilters));
    }
  }, [dispatch, initialFilters]);
  
  // For some reason, the API query needs to be outside this component in a real app
  // This is just a stub to demonstrate how it would work
  const { data, isLoading, error } = { data: null, isLoading: false, error: null };
  
  // Handle search
  const handleSearch = () => {
    dispatch(setSearchQuery(localSearchQuery));
    
    // Apply filters
    const newFilters: Partial<ContentFilter> = {
      ...filters,
      keywords: localSearchQuery,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      dateRange: (dateRange.startDate || dateRange.endDate) ? dateRange : undefined,
      status: statusFilter !== 'all' ? statusFilter as any : undefined,
      contentType: selectedContentType || undefined,
      categories: selectedCategory ? [selectedCategory] : undefined
    };
    
    dispatch(setContentFilters(newFilters));
  };
  
  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    setLocalSearchQuery('');
    setSelectedTags([]);
    setDateRange({ startDate: '', endDate: '' });
    setStatusFilter('active');
    dispatch(setSelectedContentType(null));
    dispatch(setSelectedCategory(null));
    dispatch(resetContentFilters());
    dispatch(setSearchQuery(''));
  };
  
  // Handle sort change
  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    dispatch(setContentSort({ field, direction }));
  };
  
  // Effect to push results up to parent if needed
  useEffect(() => {
    if (onResultsChange && data) {
      onResultsChange(data);
    }
  }, [data, onResultsChange]);
  
  // Inline variant (just a search bar with minimal filters)
  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pl-8 pr-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {localSearchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setLocalSearchQuery('');
                dispatch(setSearchQuery(''));
              }}
              className="absolute right-1 top-1.5 h-6 w-6 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {showTypeFilter && (
          <Select
            value={selectedContentType || 'all'}
            onValueChange={(value) => dispatch(setSelectedContentType(value === 'all' ? null : value))}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {contentTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex items-center">
                    {type.icon}
                    <span className="ml-2">{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {showSortOptions && (
          <Select
            value={`${sortOptions.field}:${sortOptions.direction}`}
            onValueChange={(value) => {
              const [field, direction] = value.split(':');
              handleSortChange(field, direction as 'asc' | 'desc');
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date:desc">Newest</SelectItem>
              <SelectItem value="date:asc">Oldest</SelectItem>
              <SelectItem value="popularity:desc">Most Popular</SelectItem>
              <SelectItem value="title:asc">A-Z</SelectItem>
              <SelectItem value="title:desc">Z-A</SelectItem>
              <SelectItem value="relevance:desc">Relevance</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <Button onClick={handleSearch}>
          Search
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {(selectedTags.length > 0 || dateRange.startDate || dateRange.endDate) && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>
        
        {showFilters && (
          <Card className="absolute right-0 top-full mt-2 z-10 w-[300px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Advanced Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showCategoriesFilter && (
                <div className="space-y-2">
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={selectedCategory || 'all'}
                    onValueChange={(value) => dispatch(setSelectedCategory(value === 'all' ? null : value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {showDateFilter && (
                <div className="space-y-2">
                  <FormLabel>Date Range</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <FormLabel className="text-xs">From</FormLabel>
                      <Input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <FormLabel className="text-xs">To</FormLabel>
                      <Input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {showTagsFilter && (
                <div className="space-y-2">
                  <FormLabel>Popular Tags</FormLabel>
                  <div className="flex flex-wrap gap-1">
                    {popularTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {showStatusFilter && (
                <div className="space-y-2">
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset
              </Button>
              <Button size="sm" onClick={() => {
                handleSearch();
                setShowFilters(false);
              }}>
                Apply
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    );
  }
  
  // Compact variant (horizontal layout with fewer options)
  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-8"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            {showTypeFilter && (
              <Select
                value={selectedContentType || 'all'}
                onValueChange={(value) => dispatch(setSelectedContentType(value === 'all' ? null : value))}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {contentTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center">
                        {type.icon}
                        <span className="ml-1">{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {showCategoriesFilter && (
              <Select
                value={selectedCategory || 'all'}
                onValueChange={(value) => dispatch(setSelectedCategory(value === 'all' ? null : value))}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <div className="flex gap-2">
              <Button onClick={handleSearch}>
                Search
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                <span>Filters</span>
                {(selectedTags.length > 0 || dateRange.startDate || dateRange.endDate || statusFilter !== 'active') && (
                  <Badge className="ml-1">
                    {selectedTags.length + (dateRange.startDate ? 1 : 0) + (dateRange.endDate ? 1 : 0) + (statusFilter !== 'active' ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {showDateFilter && (
                  <div>
                    <FormLabel>Date Range</FormLabel>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        placeholder="From"
                      />
                      <Input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        placeholder="To"
                      />
                    </div>
                  </div>
                )}
                
                {showStatusFilter && (
                  <div>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {showSortOptions && (
                  <div>
                    <FormLabel>Sort By</FormLabel>
                    <Select
                      value={`${sortOptions.field}:${sortOptions.direction}`}
                      onValueChange={(value) => {
                        const [field, direction] = value.split(':');
                        handleSortChange(field, direction as 'asc' | 'desc');
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date:desc">Newest</SelectItem>
                        <SelectItem value="date:asc">Oldest</SelectItem>
                        <SelectItem value="popularity:desc">Most Popular</SelectItem>
                        <SelectItem value="title:asc">A-Z</SelectItem>
                        <SelectItem value="title:desc">Z-A</SelectItem>
                        <SelectItem value="relevance:desc">Relevance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              {showTagsFilter && (
                <div className="mt-4">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {popularTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={handleResetFilters} className="mr-2">
                  Reset
                </Button>
                <Button onClick={() => {
                  handleSearch();
                  setShowFilters(false);
                }}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Default variant (full-featured with sidebar)
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      {/* Filters sidebar */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showTypeFilter && (
            <div className="space-y-2">
              <FormLabel>Content Type</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {contentTypes.map(type => (
                  <div
                    key={type.id}
                    className={`flex items-center p-2 rounded-md border cursor-pointer ${
                      selectedContentType === type.id ? 'bg-primary/10 border-primary' : 'border-border'
                    }`}
                    onClick={() => dispatch(setSelectedContentType(
                      selectedContentType === type.id ? null : type.id
                    ))}
                  >
                    {type.icon}
                    <span className="ml-2 text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {showCategoriesFilter && (
            <Accordion type="single" collapsible defaultValue="categories">
              <AccordionItem value="categories">
                <AccordionTrigger>Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategory === category.id}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              dispatch(setSelectedCategory(category.id));
                            } else {
                              dispatch(setSelectedCategory(null));
                            }
                          }}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {category.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          
          {showTagsFilter && (
            <Accordion type="single" collapsible defaultValue="tags">
              <AccordionItem value="tags">
                <AccordionTrigger>Tags</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 pt-2">
                    <div className="flex flex-wrap gap-1">
                      {popularTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          
          {showDateFilter && (
            <Accordion type="single" collapsible defaultValue="date">
              <AccordionItem value="date">
                <AccordionTrigger>Date Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <FormLabel className="text-xs">From</FormLabel>
                      <Input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <FormLabel className="text-xs">To</FormLabel>
                      <Input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          
          {showStatusFilter && (
            <Accordion type="single" collapsible defaultValue="status">
              <AccordionItem value="status">
                <AccordionTrigger>Status</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button onClick={handleSearch}>
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Search results */}
      <div className="md:col-span-3 space-y-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap md:flex-nowrap gap-2">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="pl-8"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              {showSortOptions && (
                <Select
                  value={`${sortOptions.field}:${sortOptions.direction}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split(':');
                    handleSortChange(field, direction as 'asc' | 'desc');
                  }}
                >
                  <SelectTrigger className="w-[140px] flex-shrink-0">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date:desc">Newest</SelectItem>
                    <SelectItem value="date:asc">Oldest</SelectItem>
                    <SelectItem value="popularity:desc">Most Popular</SelectItem>
                    <SelectItem value="title:asc">A-Z</SelectItem>
                    <SelectItem value="title:desc">Z-A</SelectItem>
                    <SelectItem value="relevance:desc">Relevance</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Button onClick={handleSearch} className="flex-shrink-0">
                Search
              </Button>
            </div>
            
            {/* Active filters display */}
            {(selectedTags.length > 0 || dateRange.startDate || dateRange.endDate || 
              statusFilter !== 'active' || selectedContentType || selectedCategory) && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm font-medium">Active Filters:</span>
                
                {selectedContentType && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {contentTypes.find(t => t.id === selectedContentType)?.icon}
                    <span>{contentTypes.find(t => t.id === selectedContentType)?.label}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 ml-1"
                      onClick={() => dispatch(setSelectedContentType(null))}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <span>{categories.find(c => c.id === selectedCategory)?.label}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 ml-1"
                      onClick={() => dispatch(setSelectedCategory(null))}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                
                {statusFilter !== 'active' && statusFilter !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <span>Status: {statusFilter}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 ml-1"
                      onClick={() => setStatusFilter('active')}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                
                {dateRange.startDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>From: {dateRange.startDate}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 ml-1"
                      onClick={() => setDateRange({ ...dateRange, startDate: '' })}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                
                {dateRange.endDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>To: {dateRange.endDate}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 ml-1"
                      onClick={() => setDateRange({ ...dateRange, endDate: '' })}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    <TagIcon className="h-3 w-3" />
                    <span>{tag}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 ml-1"
                      onClick={() => handleTagToggle(tag)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="ml-auto text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* This is where the search results would be rendered */}
        {/* For now we just show a placeholder since we don't have a real API */}
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              {isLoading ? 'Loading results...' : 
                data ? `Found ${data.total} results` : 
                'Enter search terms and apply filters to find content'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-20 w-32 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Error loading results. Please try again.
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Search results will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};