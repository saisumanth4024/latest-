import React from 'react';
import { useSelector } from 'react-redux';
import { useGetDashboardStatsQuery } from '../../dashboardApi';
import { DashboardStats } from '@/types/dashboard';
import { selectDashboardFilters } from '../../dashboardSlice';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon, UsersIcon, ShoppingCartIcon, DollarSignIcon, PercentIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const StatItem = ({ 
  title, 
  value, 
  percentChange, 
  icon,
  prefix = '',
  suffix = '',
  isLoading = false
}: { 
  title: string; 
  value: string | number; 
  percentChange?: number; 
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
  isLoading?: boolean;
}) => {
  return (
    <div className="flex flex-col p-4 border rounded-lg bg-card">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="p-2 rounded-full bg-primary/10">
          {icon}
        </div>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-8 w-24 mt-1" />
      ) : (
        <div className="text-2xl font-bold">{prefix}{value}{suffix}</div>
      )}
      
      {percentChange !== undefined && !isLoading && (
        <div className="mt-1 flex items-center text-xs">
          {percentChange > 0 ? (
            <div className="flex items-center text-green-600 dark:text-green-500">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              <span>{percentChange.toFixed(1)}% increase</span>
            </div>
          ) : percentChange < 0 ? (
            <div className="flex items-center text-red-600 dark:text-red-500">
              <ArrowDownIcon className="h-3 w-3 mr-1" />
              <span>{Math.abs(percentChange).toFixed(1)}% decrease</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <span>No change</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatsWidget: React.FC = () => {
  const filters = useSelector(selectDashboardFilters);
  const { data: statsData, isLoading, error } = useGetDashboardStatsQuery();
  
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Failed to load statistics</p>
          <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
        </div>
      </div>
    );
  }
  
  // Mocked percent changes (in a real app, these would come from the API)
  const percentChanges = {
    totalRevenue: 7.2,
    ordersCount: 3.5,
    averageOrderValue: 2.1,
    conversionRate: -1.3,
    userCount: 5.8,
    newUsers: 12.4,
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatItem
        title="Total Revenue"
        value={statsData ? formatCurrency(statsData.stats.totalRevenue) : '0'}
        percentChange={percentChanges.totalRevenue}
        icon={<DollarSignIcon className="h-4 w-4 text-primary" />}
        isLoading={isLoading}
      />
      
      <StatItem
        title="Orders"
        value={statsData ? formatNumber(statsData.stats.ordersCount) : '0'}
        percentChange={percentChanges.ordersCount}
        icon={<ShoppingCartIcon className="h-4 w-4 text-primary" />}
        isLoading={isLoading}
      />
      
      <StatItem
        title="Average Order"
        value={statsData ? formatCurrency(statsData.stats.averageOrderValue) : '0'}
        percentChange={percentChanges.averageOrderValue}
        icon={<TrendingUpIcon className="h-4 w-4 text-primary" />}
        isLoading={isLoading}
      />
      
      <StatItem
        title="Conversion Rate"
        value={statsData ? statsData.stats.conversionRate : '0'}
        percentChange={percentChanges.conversionRate}
        icon={<PercentIcon className="h-4 w-4 text-primary" />}
        suffix="%"
        isLoading={isLoading}
      />
      
      <StatItem
        title="Total Users"
        value={statsData ? formatNumber(statsData.stats.userCount) : '0'}
        percentChange={percentChanges.userCount}
        icon={<UsersIcon className="h-4 w-4 text-primary" />}
        isLoading={isLoading}
      />
      
      <StatItem
        title="New Users"
        value={statsData ? formatNumber(statsData.stats.newUsers) : '0'}
        percentChange={percentChanges.newUsers}
        icon={<UsersIcon className="h-4 w-4 text-primary" />}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StatsWidget;