import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setTimeRange,
  setFilters,
  selectDashboardFilters 
} from '../dashboardSlice';
import { 
  useGetDashboardDataQuery,
  useGetDashboardLayoutQuery,
  useUpdateDashboardLayoutMutation
} from '../dashboardApi';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  LayoutGrid, 
  Plus, 
  RefreshCw, 
  Save
} from 'lucide-react';
import RevenueChart from './widgets/RevenueChart';

export const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector(selectDashboardFilters);
  const { data: dashboardData, isLoading: isDashboardLoading, refetch } = useGetDashboardDataQuery(currentFilters);
  const { data: layoutData, isLoading: isLayoutLoading } = useGetDashboardLayoutQuery();
  const [updateLayout, { isLoading: isUpdatingLayout }] = useUpdateDashboardLayoutMutation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCustomizingLayout, setIsCustomizingLayout] = useState(false);
  
  // This would be based on user permissions in a real app
  const userRole = 'admin'; // Could be 'user', 'seller', 'admin'
  
  const handleTimeRangeChange = (value: string) => {
    dispatch(setTimeRange(value));
  };
  
  const handleSaveLayout = async () => {
    if (!layoutData) return;
    
    // In a real implementation, we would gather the current layout state
    // and send it to the server via the updateLayout mutation
    await updateLayout({
      layouts: layoutData.layouts,
      activeLayout: layoutData.activeLayout
    });
    
    setIsCustomizingLayout(false);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your business performance and insights
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            defaultValue={currentFilters.timeRange}
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => refetch()}
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          {userRole === 'admin' && (
            <Button 
              variant={isCustomizingLayout ? "default" : "outline"}
              onClick={() => setIsCustomizingLayout(!isCustomizingLayout)}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              {isCustomizingLayout ? "Done" : "Customize"}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales & Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {isCustomizingLayout ? (
            <div className="bg-muted/40 p-4 rounded-lg flex justify-between items-center">
              <p className="text-sm">
                Drag and resize widgets to customize your dashboard layout
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsCustomizingLayout(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveLayout} disabled={isUpdatingLayout}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Layout
                </Button>
              </div>
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Revenue Summary Card */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">Revenue</CardTitle>
                  <CardDescription>
                    {currentFilters.timeRange === 'today' 
                      ? 'Today\'s revenue'
                      : currentFilters.timeRange === 'yesterday'
                      ? 'Yesterday\'s revenue'
                      : `Revenue for the last ${
                          currentFilters.timeRange === '7days' ? '7 days' :
                          currentFilters.timeRange === '30days' ? '30 days' :
                          currentFilters.timeRange === '90days' ? '90 days' : 'selected period'
                        }`
                    }
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2 h-80">
                {isDashboardLoading ? (
                  <div className="space-y-4 h-full">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : (
                  <RevenueChart 
                    settings={{
                      showLegend: true,
                      showDataLabels: false,
                      chartType: 'area'
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {/* Order Statistics Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">Order Statistics</CardTitle>
                  <CardDescription>
                    Overview of order status
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                {isDashboardLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Pending</p>
                        <p className="text-sm text-muted-foreground">Awaiting processing</p>
                      </div>
                      <p className="text-2xl font-bold">{dashboardData?.orderStats?.pending || 0}</p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Processing</p>
                        <p className="text-sm text-muted-foreground">In preparation</p>
                      </div>
                      <p className="text-2xl font-bold">{dashboardData?.orderStats?.processing || 0}</p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Delivered</p>
                        <p className="text-sm text-muted-foreground">Completed orders</p>
                      </div>
                      <p className="text-2xl font-bold">{dashboardData?.orderStats?.delivered || 0}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">Top Products</CardTitle>
                  <CardDescription>
                    Best selling items for this period
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                {isDashboardLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData?.topProducts?.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold">#{index + 1}</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${product.revenue.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{product.units} units</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Acquisition */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">Customer Acquisition</CardTitle>
                  <CardDescription>
                    New customers in period
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                {isDashboardLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold">
                      {dashboardData?.customerStats?.newCustomers || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {dashboardData?.customerStats?.percentChange >= 0 ? '+' : ''}
                      {dashboardData?.customerStats?.percentChange || 0}% vs previous period
                    </p>
                    <div className="pt-4">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Mobile:</span>
                          <span className="font-medium">{dashboardData?.customerStats?.sources?.mobile || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Desktop:</span>
                          <span className="font-medium">{dashboardData?.customerStats?.sources?.desktop || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Social:</span>
                          <span className="font-medium">{dashboardData?.customerStats?.sources?.social || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Referral:</span>
                          <span className="font-medium">{dashboardData?.customerStats?.sources?.referral || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Add Widget Button (when customizing) */}
          {isCustomizingLayout && (
            <Button variant="outline" className="w-full h-20 border-dashed">
              <Plus className="h-5 w-5 mr-2" />
              Add Widget
            </Button>
          )}
        </TabsContent>
        
        <TabsContent value="sales">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales & Revenue Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of your sales performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This section will contain more detailed revenue reports and sales analytics
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="customers">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>
                  Demographics, behavior, and retention metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This section will contain detailed customer analytics and segmentation
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>
                  Inventory and product analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This section will contain detailed product performance metrics
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;