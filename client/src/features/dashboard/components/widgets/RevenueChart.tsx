import React from 'react';
import { useSelector } from 'react-redux';
import { useGetRevenueDataQuery } from '../../dashboardApi';
import { selectDashboardFilters } from '../../dashboardSlice';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface RevenueChartProps {
  settings?: {
    showLegend?: boolean;
    showDataLabels?: boolean;
    chartType?: 'area' | 'line' | 'bar';
  };
}

const RevenueChart: React.FC<RevenueChartProps> = ({ settings }) => {
  const filters = useSelector(selectDashboardFilters);
  const { data, isLoading, error } = useGetRevenueDataQuery(filters);
  
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="space-y-3 w-full max-w-md">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-64 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Failed to load revenue data</p>
          <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
        </div>
      </div>
    );
  }
  
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <p>No revenue data available for the selected time period</p>
          <p className="text-sm text-muted-foreground mt-1">Try selecting a different time range</p>
        </div>
      </div>
    );
  }
  
  // Format the data for chart display
  const chartData = data.data.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: item.revenue,
    expenses: item.expenses,
    profit: item.profit
  }));
  
  // Calculate percent change for display
  const percentChangeText = data.percentChange !== undefined 
    ? (data.percentChange >= 0 
      ? `+${data.percentChange.toFixed(1)}%` 
      : `${data.percentChange.toFixed(1)}%`)
    : '';
  
  const percentChangeColor = data.percentChange !== undefined
    ? (data.percentChange >= 0 ? 'text-green-500' : 'text-red-500')
    : '';
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold">{formatCurrency(data.total)}</span>
          {data.percentChange !== undefined && (
            <span className={`ml-2 text-sm ${percentChangeColor}`}>
              {percentChangeText} 
              <span className="text-muted-foreground ml-1">vs previous</span>
            </span>
          )}
        </div>
        {data.previousTotal !== undefined && (
          <div className="text-sm text-muted-foreground">
            Previous: {formatCurrency(data.previousTotal)}
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value, undefined, false)}
              width={80}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), '']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            {settings?.showLegend && <Legend />}
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stackId="1"
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.5}
              name="Revenue"
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stackId="2"
              stroke="#82ca9d" 
              fill="#82ca9d" 
              fillOpacity={0.5}
              name="Expenses"
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              stackId="3"
              stroke="#ffc658" 
              fill="#ffc658" 
              fillOpacity={0.5}
              name="Profit"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;