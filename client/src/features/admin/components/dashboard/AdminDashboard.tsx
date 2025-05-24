import React, { useState } from 'react';
import { Resource, Action } from '../../rbac/rbacConfig';
import { PermissionGuard } from '../../rbac/PermissionGuard';
import { usePermissions } from '../../rbac/usePermissions';
import { selectAuditTrail } from '../../adminSlice';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

import {
  Activity,
  Users,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Package,
  UserX,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Clock,
  Calendar,
} from 'lucide-react';

// Mock data for the dashboard stats
// In a real app, this would come from API calls
const dashboardStats = {
  userStats: {
    total: 12567,
    active: 10234,
    newToday: 127,
    percentChange: 5.4,
  },
  orderStats: {
    total: 4329,
    processing: 342,
    shipped: 89,
    totalToday: 156,
    percentChange: 12.7,
  },
  revenueStats: {
    total: 523987.45,
    today: 12654.87,
    percentChange: 8.2,
    currency: 'USD',
  },
  productStats: {
    total: 1534,
    outOfStock: 23,
    lowStock: 45,
    newToday: 34,
    percentChange: -2.1,
  },
  systemHealth: {
    status: 'healthy',
    uptime: 99.98,
    responseTime: 120,
    errorRate: 0.05,
  },
};

// Format number with commas and decimal places
const formatNumber = (num: number, decimals = 0): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Format currency with symbol
const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Component for displaying stat cards
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  subtitle?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  subtitle,
  color = 'bg-primary',
}) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${color} p-2 rounded-full text-white`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        
        <div className="flex items-center mt-4">
          <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? (
              <TrendingUp className="mr-1 h-4 w-4" />
            ) : (
              <TrendingDown className="mr-1 h-4 w-4" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
          <span className="text-xs text-muted-foreground ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for displaying recent activity
interface ActivityItemProps {
  action: string;
  details: string;
  timestamp: string;
  userId: string;
  resource?: string;
  ipAddress?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  action,
  details,
  timestamp,
  userId,
  resource,
  ipAddress,
}) => {
  // Define icon based on action type
  let icon = <Activity className="h-5 w-5 text-gray-500" />;
  let actionColor = 'text-gray-500';
  
  if (action.includes('CREATE') || action.includes('ADD')) {
    icon = <CheckCircle className="h-5 w-5 text-green-500" />;
    actionColor = 'text-green-500';
  } else if (action.includes('DELETE') || action.includes('REMOVE')) {
    icon = <AlertTriangle className="h-5 w-5 text-red-500" />;
    actionColor = 'text-red-500';
  } else if (action.includes('UPDATE') || action.includes('EDIT')) {
    icon = <FileText className="h-5 w-5 text-blue-500" />;
    actionColor = 'text-blue-500';
  } else if (action.includes('LOGIN') || action.includes('LOGOUT')) {
    icon = <Users className="h-5 w-5 text-purple-500" />;
    actionColor = 'text-purple-500';
  } else if (action.includes('IMPERSONATION')) {
    icon = <UserX className="h-5 w-5 text-orange-500" />;
    actionColor = 'text-orange-500';
  }
  
  return (
    <div className="flex py-3">
      <div className="mr-4 flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className={`font-medium ${actionColor}`}>{action}</span>
            {resource && <Badge variant="outline" className="ml-2">{resource}</Badge>}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="mr-1 h-3 w-3" />
            {format(new Date(timestamp), 'MMM d, h:mm a')}
          </div>
        </div>
        <p className="text-sm mt-1 text-muted-foreground">{details}</p>
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <span className="mr-2">User ID: {userId}</span>
          {ipAddress && <span>IP: {ipAddress}</span>}
        </div>
      </div>
    </div>
  );
};

// Component for displaying system health
interface SystemHealthCardProps {
  status: string;
  uptime: number;
  responseTime: number;
  errorRate: number;
}

const SystemHealthCard: React.FC<SystemHealthCardProps> = ({
  status,
  uptime,
  responseTime,
  errorRate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Current system status and performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Status</span>
          <Badge 
            className={status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}
          >
            {status === 'healthy' ? 'Healthy' : 'Issues Detected'}
          </Badge>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>Uptime</span>
            <span>{uptime}%</span>
          </div>
          <Progress value={uptime} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>Response Time</span>
            <span>{responseTime}ms</span>
          </div>
          <Progress 
            value={100 - (responseTime / 5)}
            className="h-2"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>Error Rate</span>
            <span>{errorRate}%</span>
          </div>
          <Progress 
            value={100 - (errorRate * 20)}
            className="h-2"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View System Logs
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main dashboard component
export const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const { can } = usePermissions();
  
  // Get audit trail from Redux store
  const auditTrail = useSelector(selectAuditTrail);
  
  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PermissionGuard
              resource={Resource.USERS}
              action={Action.READ}
            >
              <StatCard
                title="Total Users"
                value={formatNumber(dashboardStats.userStats.total)}
                subtitle={`${formatNumber(dashboardStats.userStats.newToday)} new today`}
                icon={<Users className="h-4 w-4" />}
                change={dashboardStats.userStats.percentChange}
                color="bg-blue-500"
              />
            </PermissionGuard>
            
            <PermissionGuard
              resource={Resource.ORDERS}
              action={Action.READ}
            >
              <StatCard
                title="Orders"
                value={formatNumber(dashboardStats.orderStats.total)}
                subtitle={`${formatNumber(dashboardStats.orderStats.totalToday)} today`}
                icon={<ShoppingBag className="h-4 w-4" />}
                change={dashboardStats.orderStats.percentChange}
                color="bg-green-500"
              />
            </PermissionGuard>
            
            <PermissionGuard
              resource={Resource.PAYMENTS}
              action={Action.READ}
            >
              <StatCard
                title="Revenue"
                value={formatCurrency(dashboardStats.revenueStats.total)}
                subtitle={`${formatCurrency(dashboardStats.revenueStats.today)} today`}
                icon={<DollarSign className="h-4 w-4" />}
                change={dashboardStats.revenueStats.percentChange}
                color="bg-purple-500"
              />
            </PermissionGuard>
            
            <PermissionGuard
              resource={Resource.PRODUCTS}
              action={Action.READ}
            >
              <StatCard
                title="Products"
                value={formatNumber(dashboardStats.productStats.total)}
                subtitle={`${formatNumber(dashboardStats.productStats.outOfStock)} out of stock`}
                icon={<Package className="h-4 w-4" />}
                change={dashboardStats.productStats.percentChange}
                color="bg-orange-500"
              />
            </PermissionGuard>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditTrail.length > 0 ? (
                    auditTrail.slice(0, 5).map((activity, index) => (
                      <React.Fragment key={`activity-${index}`}>
                        {index > 0 && <Separator />}
                        <ActivityItem
                          action={activity.action}
                          details={activity.details}
                          timestamp={activity.timestamp}
                          userId={activity.userId}
                          resource={activity.resource}
                          ipAddress={activity.ipAddress}
                        />
                      </React.Fragment>
                    ))
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      No recent activity found
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
            
            <PermissionGuard
              resource={Resource.SETTINGS}
              action={Action.READ}
            >
              <SystemHealthCard
                status={dashboardStats.systemHealth.status}
                uptime={dashboardStats.systemHealth.uptime}
                responseTime={dashboardStats.systemHealth.responseTime}
                errorRate={dashboardStats.systemHealth.errorRate}
              />
            </PermissionGuard>
          </div>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <PermissionGuard
              resource={Resource.ORDERS}
              action={Action.READ}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                  <CardDescription>Current status of all orders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
                      <ShoppingBag className="h-8 w-8 text-orange-500 mb-2" />
                      <span className="text-2xl font-bold">{dashboardStats.orderStats.processing}</span>
                      <span className="text-sm text-muted-foreground">Processing</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
                      <Package className="h-8 w-8 text-blue-500 mb-2" />
                      <span className="text-2xl font-bold">{dashboardStats.orderStats.shipped}</span>
                      <span className="text-sm text-muted-foreground">Shipped</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Orders
                  </Button>
                </CardFooter>
              </Card>
            </PermissionGuard>
            
            <PermissionGuard
              resource={Resource.PRODUCTS}
              action={Action.READ}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Alerts</CardTitle>
                  <CardDescription>Products requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                      <span className="text-2xl font-bold">{dashboardStats.productStats.outOfStock}</span>
                      <span className="text-sm text-muted-foreground">Out of Stock</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
                      <span className="text-2xl font-bold">{dashboardStats.productStats.lowStock}</span>
                      <span className="text-sm text-muted-foreground">Low Stock</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Manage Inventory
                  </Button>
                </CardFooter>
              </Card>
            </PermissionGuard>
          </div>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and data visualization would go here
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium">Analytics Module</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  This section would contain detailed charts, graphs, and data analysis tools
                  for visualizing business performance metrics, user engagement, and other key indicators.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and view system reports
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium">Reports Module</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  This section would contain tools for generating, downloading, and scheduling
                  various system reports such as sales reports, inventory reports, user activity reports, etc.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Activity Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>
                System activity and audit trail
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditTrail.length > 0 ? (
                <div className="space-y-2">
                  {auditTrail.map((activity, index) => (
                    <React.Fragment key={`log-${index}`}>
                      {index > 0 && <Separator />}
                      <ActivityItem
                        action={activity.action}
                        details={activity.details}
                        timestamp={activity.timestamp}
                        userId={activity.userId}
                        resource={activity.resource}
                        ipAddress={activity.ipAddress}
                      />
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No activity logs found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};