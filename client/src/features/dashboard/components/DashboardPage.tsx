import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Pencil, 
  Save, 
  RotateCcw, 
  Plus, 
  X, 
  Maximize, 
  Minimize, 
  Settings,
  ChevronDown,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { 
  selectDashboardLayout, 
  selectIsEditMode, 
  selectIsFullscreen,
  selectFullscreenWidgetId,
  toggleEditMode,
  resetDashboard,
  toggleFullscreen,
  toggleWidgetVisibility,
  updateWidgetSettings,
  openWidgetCustomization,
  closeWidgetCustomization
} from '../dashboardSlice';
import { useGetDashboardStatsQuery } from '../dashboardApi';
import { DashboardWidget, WidgetType } from '@/types/dashboard';
import { TimeRangeSelector } from './TimeRangeSelector';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

// Widget Components - These will be imported or created later
import StatsWidget from './widgets/StatsWidget';
import RevenueChart from './widgets/RevenueChart';
import OrdersChart from './widgets/OrdersChart';
import TopProducts from './widgets/TopProducts';
import TrafficSources from './widgets/TrafficSources';
import UserGrowth from './widgets/UserGrowth';
import GeographicDistribution from './widgets/GeographicDistribution';
import DeviceBreakdown from './widgets/DeviceBreakdown';
import TopSearchTerms from './widgets/TopSearchTerms';
import RecentOrders from './widgets/RecentOrders';

// Placeholder component for widgets not yet implemented
const WidgetPlaceholder = ({ title, type }: { title: string, type: WidgetType }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-center h-[200px]">
      <div className="text-center">
        <p className="text-muted-foreground">{type} Widget</p>
        <p className="text-sm text-muted-foreground">Coming soon</p>
      </div>
    </CardContent>
  </Card>
);

// Widget container with shared functionality for all widgets
interface WidgetContainerProps {
  widget: DashboardWidget;
  children: React.ReactNode;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({ widget, children }) => {
  const dispatch = useDispatch();
  const isEditMode = useSelector(selectIsEditMode);
  const isFullscreen = useSelector(selectIsFullscreen);
  const fullscreenWidgetId = useSelector(selectFullscreenWidgetId);
  
  // Don't render if widget is not visible and not in edit mode
  if (!widget.visible && !isEditMode) {
    return null;
  }
  
  // Handle widget settings
  const handleToggleVisibility = () => {
    dispatch(toggleWidgetVisibility(widget.id));
  };
  
  const handleFullscreen = () => {
    dispatch(toggleFullscreen(isFullscreen && fullscreenWidgetId === widget.id ? null : widget.id));
  };
  
  const handleCustomize = () => {
    dispatch(openWidgetCustomization(widget.id));
  };
  
  // Determine widget size classes
  const getWidthClass = () => {
    if (isFullscreen && fullscreenWidgetId === widget.id) {
      return 'col-span-12';
    }
    
    switch (widget.width) {
      case 'full':
        return 'col-span-12';
      case 'two-thirds':
        return 'col-span-12 lg:col-span-8';
      case 'half':
        return 'col-span-12 md:col-span-6';
      case 'third':
        return 'col-span-12 md:col-span-6 lg:col-span-4';
      default:
        return 'col-span-12';
    }
  };
  
  const getHeightClass = () => {
    if (isFullscreen && fullscreenWidgetId === widget.id) {
      return 'h-[calc(100vh-200px)]';
    }
    
    switch (widget.height) {
      case 'small':
        return 'h-auto min-h-[100px]';
      case 'medium':
        return 'h-[320px]';
      case 'large':
        return 'h-[500px]';
      default:
        return 'h-auto';
    }
  };
  
  return (
    <div 
      className={`${getWidthClass()} transition-all duration-300 ease-in-out`}
      style={{ opacity: !widget.visible && isEditMode ? 0.5 : 1 }}
    >
      <Card className={`${getHeightClass()} overflow-hidden flex flex-col`}>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-base md:text-lg">{widget.title}</CardTitle>
          <div className="flex items-center space-x-1">
            {isEditMode ? (
              <Button variant="ghost" size="icon" onClick={handleToggleVisibility}>
                {widget.visible ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                )}
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleFullscreen}>
                    {isFullscreen && fullscreenWidgetId === widget.id ? (
                      <>
                        <Minimize className="mr-2 h-4 w-4" />
                        Exit Fullscreen
                      </>
                    ) : (
                      <>
                        <Maximize className="mr-2 h-4 w-4" />
                        Fullscreen
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCustomize}>
                    <Settings className="mr-2 h-4 w-4" />
                    Customize
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {}}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto pb-4">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

// Main Dashboard Component
const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector(selectDashboardLayout);
  const isEditMode = useSelector(selectIsEditMode);
  const isFullscreen = useSelector(selectIsFullscreen);
  const { data: dashboardStats, isLoading, refetch } = useGetDashboardStatsQuery();
  
  if (!layout) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Skeleton className="h-16 w-16 rounded-full" />
          <h2 className="mt-4 text-xl">Loading dashboard...</h2>
        </div>
      </div>
    );
  }
  
  // Sort widgets by position
  const sortedWidgets = [...layout.widgets].sort((a, b) => a.position - b.position);
  
  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case WidgetType.QUICK_STATS:
        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <StatsWidget />
          </WidgetContainer>
        );
        
      case WidgetType.REVENUE_CHART:
        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <RevenueChart settings={widget.settings} />
          </WidgetContainer>
        );
        
      case WidgetType.ORDERS_CHART:
        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <OrdersChart settings={widget.settings} />
          </WidgetContainer>
        );
        
      case WidgetType.TOP_PRODUCTS:
        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <TopProducts settings={widget.settings} />
          </WidgetContainer>
        );
        
      case WidgetType.TRAFFIC_SOURCES:
        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <TrafficSources settings={widget.settings} />
          </WidgetContainer>
        );
        
      case WidgetType.USER_GROWTH:
        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <UserGrowth settings={widget.settings} />
          </WidgetContainer>
        );
        
      case WidgetType.GEOGRAPHIC_DISTRIBUTION:
        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <GeographicDistribution settings={widget.settings} />
          </WidgetContainer>
        );
        
      case WidgetType.DEVICE_BREAKDOWN:
        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <DeviceBreakdown settings={widget.settings} />
          </WidgetContainer>
        );
        
      case WidgetType.TOP_SEARCH_TERMS:
        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <TopSearchTerms settings={widget.settings} />
          </WidgetContainer>
        );
        
      case WidgetType.RECENT_ORDERS:
        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <RecentOrders settings={widget.settings} />
          </WidgetContainer>
        );
        
      default:
        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <WidgetPlaceholder title={widget.title} type={widget.type} />
          </WidgetContainer>
        );
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <TimeRangeSelector />
            
            <div className="flex space-x-2">
              <Button 
                variant={isEditMode ? "secondary" : "outline"} 
                size="sm"
                onClick={() => dispatch(toggleEditMode())}
              >
                {isEditMode ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Layout
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Layout
                  </>
                )}
              </Button>
              
              {isEditMode && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => dispatch(resetDashboard())}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className={`grid grid-cols-12 gap-4 ${isEditMode ? 'bg-muted/20 p-4 rounded-lg border border-dashed' : ''}`}>
        {sortedWidgets.map(renderWidget)}
      </div>
    </div>
  );
};

export default DashboardPage;