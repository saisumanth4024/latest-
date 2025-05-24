import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  DashboardFilters, 
  DashboardLayout, 
  DashboardWidget, 
  TimeRange, 
  WidgetType 
} from '@/types/dashboard';
import { RootState } from '@/app/store';

interface DashboardState {
  filters: DashboardFilters;
  layout: DashboardLayout | null;
  isEditMode: boolean;
  isFullscreen: boolean;
  fullscreenWidgetId: string | null;
  isCustomizationOpen: boolean;
  isDateRangePickerOpen: boolean;
  selectedWidgetForCustomization: string | null;
}

const initialLayout: DashboardLayout = {
  userId: 'default',
  widgets: [
    {
      id: 'quick-stats',
      type: WidgetType.QUICK_STATS,
      title: 'Key Metrics',
      width: 'full',
      height: 'small',
      position: 0,
      roles: ['admin', 'seller'],
      visible: true,
    },
    {
      id: 'revenue-chart',
      type: WidgetType.REVENUE_CHART,
      title: 'Revenue & Expenses',
      width: 'two-thirds',
      height: 'medium',
      position: 1,
      roles: ['admin', 'seller'],
      visible: true,
      settings: {
        showLegend: true,
        showDataLabels: false,
        chartType: 'area',
      },
    },
    {
      id: 'orders-chart',
      type: WidgetType.ORDERS_CHART,
      title: 'Orders',
      width: 'third',
      height: 'medium',
      position: 2,
      roles: ['admin', 'seller'],
      visible: true,
      settings: {
        showLegend: true,
        showDataLabels: true,
        chartType: 'bar',
      },
    },
    {
      id: 'top-products',
      type: WidgetType.TOP_PRODUCTS,
      title: 'Top Products',
      width: 'half',
      height: 'medium',
      position: 3,
      roles: ['admin', 'seller'],
      visible: true,
      settings: {
        limit: 5,
        sortBy: 'revenue',
      },
    },
    {
      id: 'traffic-sources',
      type: WidgetType.TRAFFIC_SOURCES,
      title: 'Traffic Sources',
      width: 'half',
      height: 'medium',
      position: 4,
      roles: ['admin', 'seller'],
      visible: true,
      settings: {
        chartType: 'pie',
        showLegend: true,
      },
    },
    {
      id: 'user-growth',
      type: WidgetType.USER_GROWTH,
      title: 'User Growth',
      width: 'half',
      height: 'medium',
      position: 5,
      roles: ['admin'],
      visible: true,
      settings: {
        showTotalUsers: true,
        showActiveUsers: true,
        showNewUsers: true,
      },
    },
    {
      id: 'geographic-distribution',
      type: WidgetType.GEOGRAPHIC_DISTRIBUTION,
      title: 'Geographic Distribution',
      width: 'half',
      height: 'medium',
      position: 6,
      roles: ['admin'],
      visible: true,
      settings: {
        showMap: true,
        showTable: true,
        mapType: 'regions',
      },
    },
    {
      id: 'device-breakdown',
      type: WidgetType.DEVICE_BREAKDOWN,
      title: 'Device Usage',
      width: 'third',
      height: 'medium',
      position: 7,
      roles: ['admin'],
      visible: true,
      settings: {
        chartType: 'donut',
      },
    },
    {
      id: 'search-terms',
      type: WidgetType.TOP_SEARCH_TERMS,
      title: 'Top Search Terms',
      width: 'third',
      height: 'medium',
      position: 8,
      roles: ['admin', 'seller'],
      visible: true,
      settings: {
        limit: 10,
      },
    },
    {
      id: 'recent-orders',
      type: WidgetType.RECENT_ORDERS,
      title: 'Recent Orders',
      width: 'third',
      height: 'medium',
      position: 9,
      roles: ['admin', 'seller'],
      visible: true,
      settings: {
        limit: 5,
      },
    },
  ],
};

const initialState: DashboardState = {
  filters: {
    timeRange: TimeRange.MONTH,
  },
  layout: initialLayout,
  isEditMode: false,
  isFullscreen: false,
  fullscreenWidgetId: null,
  isCustomizationOpen: false,
  isDateRangePickerOpen: false,
  selectedWidgetForCustomization: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Update time range filter
    setTimeRange: (state, action: PayloadAction<TimeRange>) => {
      state.filters.timeRange = action.payload;
      if (action.payload !== TimeRange.CUSTOM) {
        // Clear custom date range when selecting a predefined range
        state.filters.dateRange = undefined;
      }
    },
    
    // Set custom date range
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.filters.timeRange = TimeRange.CUSTOM;
      state.filters.dateRange = action.payload;
    },
    
    // Set comparison time range
    setComparisonTimeRange: (state, action: PayloadAction<TimeRange | undefined>) => {
      state.filters.compareWith = action.payload;
      if (!action.payload) {
        state.filters.compareDateRange = undefined;
      }
    },
    
    // Set comparison date range
    setComparisonDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string } | undefined>) => {
      state.filters.compareDateRange = action.payload;
    },
    
    // Toggle date range picker visibility
    toggleDateRangePicker: (state) => {
      state.isDateRangePickerOpen = !state.isDateRangePickerOpen;
    },
    
    // Set dashboard layout
    setDashboardLayout: (state, action: PayloadAction<DashboardLayout>) => {
      state.layout = action.payload;
    },
    
    // Toggle dashboard edit mode
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
      // Close customization when exiting edit mode
      if (!state.isEditMode) {
        state.isCustomizationOpen = false;
        state.selectedWidgetForCustomization = null;
      }
    },
    
    // Toggle widget visibility
    toggleWidgetVisibility: (state, action: PayloadAction<string>) => {
      if (!state.layout) return;
      
      const widget = state.layout.widgets.find(w => w.id === action.payload);
      if (widget) {
        widget.visible = !widget.visible;
      }
    },
    
    // Update widget position
    updateWidgetPosition: (state, action: PayloadAction<{ id: string; position: number }>) => {
      if (!state.layout) return;
      
      const { id, position } = action.payload;
      const widgets = [...state.layout.widgets];
      const widgetIndex = widgets.findIndex(w => w.id === id);
      
      if (widgetIndex === -1) return;
      
      const widget = widgets[widgetIndex];
      widgets.splice(widgetIndex, 1);
      widgets.splice(position, 0, widget);
      
      // Update all position values
      widgets.forEach((w, idx) => {
        w.position = idx;
      });
      
      state.layout.widgets = widgets;
    },
    
    // Update widget size
    updateWidgetSize: (
      state, 
      action: PayloadAction<{ 
        id: string; 
        width?: 'full' | 'half' | 'third' | 'two-thirds'; 
        height?: 'small' | 'medium' | 'large' 
      }>
    ) => {
      if (!state.layout) return;
      
      const { id, width, height } = action.payload;
      const widget = state.layout.widgets.find(w => w.id === id);
      
      if (widget) {
        if (width) widget.width = width;
        if (height) widget.height = height;
      }
    },
    
    // Update widget settings
    updateWidgetSettings: (
      state, 
      action: PayloadAction<{ 
        id: string; 
        settings: Record<string, any> 
      }>
    ) => {
      if (!state.layout) return;
      
      const { id, settings } = action.payload;
      const widget = state.layout.widgets.find(w => w.id === id);
      
      if (widget) {
        widget.settings = {
          ...widget.settings,
          ...settings
        };
      }
    },
    
    // Update widget title
    updateWidgetTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      if (!state.layout) return;
      
      const { id, title } = action.payload;
      const widget = state.layout.widgets.find(w => w.id === id);
      
      if (widget) {
        widget.title = title;
      }
    },
    
    // Enter/exit fullscreen for a widget
    toggleFullscreen: (state, action: PayloadAction<string | null>) => {
      // If null, exit fullscreen
      if (action.payload === null) {
        state.isFullscreen = false;
        state.fullscreenWidgetId = null;
      } else {
        // Enter fullscreen for the specified widget
        state.isFullscreen = true;
        state.fullscreenWidgetId = action.payload;
      }
    },
    
    // Add a new widget to the dashboard
    addWidget: (state, action: PayloadAction<Omit<DashboardWidget, 'position'>>) => {
      if (!state.layout) return;
      
      const newWidget: DashboardWidget = {
        ...action.payload,
        position: state.layout.widgets.length,
      };
      
      state.layout.widgets.push(newWidget);
    },
    
    // Remove a widget from the dashboard
    removeWidget: (state, action: PayloadAction<string>) => {
      if (!state.layout) return;
      
      const index = state.layout.widgets.findIndex(w => w.id === action.payload);
      if (index !== -1) {
        state.layout.widgets.splice(index, 1);
        
        // Update positions of remaining widgets
        state.layout.widgets.forEach((w, idx) => {
          w.position = idx;
        });
      }
    },
    
    // Open customization panel for a widget
    openWidgetCustomization: (state, action: PayloadAction<string>) => {
      state.isCustomizationOpen = true;
      state.selectedWidgetForCustomization = action.payload;
    },
    
    // Close customization panel
    closeWidgetCustomization: (state) => {
      state.isCustomizationOpen = false;
      state.selectedWidgetForCustomization = null;
    },
    
    // Reset dashboard to default layout
    resetDashboard: (state) => {
      state.layout = initialLayout;
    },
  },
});

// Selectors
export const selectDashboardFilters = (state: RootState) => state.dashboard.filters;
export const selectDashboardLayout = (state: RootState) => state.dashboard.layout;
export const selectIsEditMode = (state: RootState) => state.dashboard.isEditMode;
export const selectIsFullscreen = (state: RootState) => state.dashboard.isFullscreen;
export const selectFullscreenWidgetId = (state: RootState) => state.dashboard.fullscreenWidgetId;
export const selectIsCustomizationOpen = (state: RootState) => state.dashboard.isCustomizationOpen;
export const selectIsDateRangePickerOpen = (state: RootState) => state.dashboard.isDateRangePickerOpen;
export const selectSelectedWidgetForCustomization = (state: RootState) => state.dashboard.selectedWidgetForCustomization;

// Actions
export const {
  setTimeRange,
  setDateRange,
  setComparisonTimeRange,
  setComparisonDateRange,
  toggleDateRangePicker,
  setDashboardLayout,
  toggleEditMode,
  toggleWidgetVisibility,
  updateWidgetPosition,
  updateWidgetSize,
  updateWidgetSettings,
  updateWidgetTitle,
  toggleFullscreen,
  addWidget,
  removeWidget,
  openWidgetCustomization,
  closeWidgetCustomization,
  resetDashboard
} = dashboardSlice.actions;

export default dashboardSlice.reducer;