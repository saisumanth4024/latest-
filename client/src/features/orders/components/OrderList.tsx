import React, { useState } from 'react';
import { Link } from '@/router/wouterCompat';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  CalendarIcon,
  ChevronDown,
  Package,
  Search,
  SlidersHorizontal,
  X,
  GripVertical,
} from 'lucide-react';
import { useGetOrdersQuery } from '../ordersApi';
import { Order, OrderStatus } from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { DraggableOrderList } from './DraggableOrderList';

// Helper function to get status badge
const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case OrderStatus.PROCESSING:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500';
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case OrderStatus.CANCELED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      case OrderStatus.RETURNED:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500';
      case OrderStatus.REFUNDED:
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <Badge className={`font-medium ${getStatusStyles(status)}`} variant="outline">
      {statusLabel}
    </Badge>
  );
};

// Filter component
interface FilterProps {
  onFilterChange: (filters: {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) => void;
}

const OrderFilters: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (value: string) => {
    const newStatus = value ? (value as OrderStatus) : undefined;
    setStatus(newStatus);
    onFilterChange({ status: newStatus, startDate, endDate, search });
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
      onFilterChange({ status, startDate: value, endDate, search });
    } else {
      setEndDate(value);
      onFilterChange({ status, startDate, endDate: value, search });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ status, startDate, endDate, search: value });
  };

  const clearFilters = () => {
    setStatus(undefined);
    setStartDate('');
    setEndDate('');
    setSearch('');
    onFilterChange({});
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order #"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>
        
        {(status || startDate || endDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/40 rounded-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
                <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                <SelectItem value={OrderStatus.CANCELED}>Canceled</SelectItem>
                <SelectItem value={OrderStatus.RETURNED}>Returned</SelectItem>
                <SelectItem value={OrderStatus.REFUNDED}>Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main OrderList component
export default function OrderList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<{
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
  }>({});
  
  const { data, isLoading, error } = useGetOrdersQuery({
    page,
    pageSize,
    ...filters,
  });
  
  const { toast } = useToast();
  
  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    // Reset to first page when filters change
    setPage(1);
    setFilters(newFilters);
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  // Handle error state with useEffect to avoid render loops
  React.useEffect(() => {
    if (error && (error as any)?.status !== 401) {
      toast({
        title: 'Error loading orders',
        description: 'There was a problem fetching your orders. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  
  // Empty state
  const renderEmptyState = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <CardTitle className="text-xl mb-2">No orders found</CardTitle>
        <CardDescription className="mb-4 max-w-md">
          {filters.status || filters.startDate || filters.endDate || filters.search
            ? "No orders match your filters. Try adjusting your search criteria."
            : "You haven't placed any orders yet. Browse our products and place your first order."}
        </CardDescription>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </CardContent>
    </Card>
  );
  
  // Loading state
  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-8 w-full max-w-sm" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border-t p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">
            View and manage all your orders in one place
          </p>
        </div>
      </div>
      
      <OrderFilters onFilterChange={handleFilterChange} />
      
      {isLoading ? (
        renderLoadingState()
      ) : !data || data.orders.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <DraggableOrderList 
                  orders={data.orders} 
                  onOrdersReordered={(reorderedOrders) => {
                    // Here we could save the reordered list to backend if needed
                    toast({
                      title: "Order prioritization saved",
                      description: "Your orders have been rearranged successfully.",
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          {data.totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  {page === 1 ? (
                    <span className="cursor-not-allowed opacity-50">
                      <PaginationPrevious />
                    </span>
                  ) : (
                    <PaginationPrevious 
                      onClick={() => handlePageChange(page - 1)}
                    />
                  )}
                </PaginationItem>
                
                {[...Array(Math.min(5, data.totalPages))].map((_, i) => {
                  const pageNumber =
                    data.totalPages <= 5
                      ? i + 1
                      : page <= 3
                      ? i + 1
                      : page >= data.totalPages - 2
                      ? data.totalPages - 4 + i
                      : page - 2 + i;
                      
                  return pageNumber <= data.totalPages ? (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={page === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null;
                })}
                
                {data.totalPages > 5 && page < data.totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(data.totalPages)}
                      >
                        {data.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  {page === data.totalPages ? (
                    <span className="cursor-not-allowed opacity-50">
                      <PaginationNext />
                    </span>
                  ) : (
                    <PaginationNext 
                      onClick={() => handlePageChange(page + 1)}
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}