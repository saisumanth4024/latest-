import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { 
  TimeRange,
  selectDashboardFilters, 
  setTimeRange, 
  setDateRange,
  toggleDateRangePicker,
  selectIsDateRangePickerOpen 
} from '../dashboardSlice';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export const TimeRangeSelector: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectDashboardFilters);
  const isDateRangePickerOpen = useSelector(selectIsDateRangePickerOpen);
  
  const [date, setDate] = useState<Date | undefined>(
    filters.dateRange ? new Date(filters.dateRange.startDate) : undefined
  );
  const [dateRange, setLocalDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: filters.dateRange ? new Date(filters.dateRange.startDate) : new Date(),
    to: filters.dateRange ? new Date(filters.dateRange.endDate) : new Date(),
  });

  const handleTimeRangeChange = (value: string) => {
    dispatch(setTimeRange(value as TimeRange));
  };

  const handleDateRangeSelect = (range: { from: Date; to?: Date }) => {
    setLocalDateRange(range);
    
    if (range.from && range.to) {
      dispatch(setDateRange({
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString()
      }));
    }
  };

  const getTimeRangeLabel = () => {
    switch (filters.timeRange) {
      case TimeRange.TODAY:
        return 'Today';
      case TimeRange.YESTERDAY:
        return 'Yesterday';
      case TimeRange.WEEK:
        return 'This Week';
      case TimeRange.MONTH:
        return 'This Month';
      case TimeRange.QUARTER:
        return 'This Quarter';
      case TimeRange.YEAR:
        return 'This Year';
      case TimeRange.CUSTOM:
        if (filters.dateRange) {
          const start = new Date(filters.dateRange.startDate);
          const end = new Date(filters.dateRange.endDate);
          return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
        }
        return 'Custom Range';
      default:
        return 'Select Range';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select
        defaultValue={filters.timeRange}
        onValueChange={handleTimeRangeChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range">
            {getTimeRangeLabel()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TimeRange.TODAY}>Today</SelectItem>
          <SelectItem value={TimeRange.YESTERDAY}>Yesterday</SelectItem>
          <SelectItem value={TimeRange.WEEK}>This Week</SelectItem>
          <SelectItem value={TimeRange.MONTH}>This Month</SelectItem>
          <SelectItem value={TimeRange.QUARTER}>This Quarter</SelectItem>
          <SelectItem value={TimeRange.YEAR}>This Year</SelectItem>
          <SelectItem value={TimeRange.CUSTOM}>Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {filters.timeRange === TimeRange.CUSTOM && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={handleDateRangeSelect as any}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};