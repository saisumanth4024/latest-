import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { apiRequest } from '@/lib/queryClient';

// Define types for dashboard state
export type TimeRangeType = 'today' | 'yesterday' | '7days' | '30days' | '90days' | 'year' | 'custom';

export interface DashboardFilters {
  timeRange: TimeRangeType;
  startDate?: string;
  endDate?: string;
  category?: string;
  productId?: string | number;
  region?: string;
  channel?: string;
}

export interface DashboardWidgetSettings {
  id: string;
  type: string;
  title: string;
  settings: {
    showLegend?: boolean;
    showDataLabels?: boolean;
    chartType?: 'area' | 'line' | 'bar' | 'pie';
    dataPoints?: number;
    colorScheme?: string;
    [key: string]: any;
  };
}

export interface DashboardLayout {
  id: string;
  name: string;
  isDefault: boolean;
  widgets: {
    [widgetId: string]: {
      id: string;
      x: number;
      y: number;
      w: number;
      h: number;
      settings: any;
    };
  };
}

interface DashboardState {
  filters: DashboardFilters;
  layouts: {
    [layoutId: string]: DashboardLayout;
  };
  activeLayout: string;
  isCustomizing: boolean;
  isLoading: boolean;
  error: string | null;
}

// Define initial state
const initialState: DashboardState = {
  filters: {
    timeRange: '30days',
  },
  layouts: {},
  activeLayout: 'default',
  isCustomizing: false,
  isLoading: false,
  error: null,
};

// Define async thunks
export const fetchDashboardLayouts = createAsyncThunk(
  'dashboard/fetchLayouts',
  async () => {
    const response = await apiRequest('GET', '/api/dashboard/layouts');
    return await response.json();
  }
);

export const updateDashboardLayout = createAsyncThunk(
  'dashboard/updateLayout',
  async ({ layouts, activeLayout }: { layouts: any, activeLayout: string }) => {
    const response = await apiRequest('POST', '/api/dashboard/layouts', { layouts, activeLayout });
    return await response.json();
  }
);

// Create dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<TimeRangeType>) => {
      state.filters.timeRange = action.payload;

      // Clear custom date range if not using 'custom'
      if (action.payload !== 'custom') {
        state.filters.startDate = undefined;
        state.filters.endDate = undefined;
      }
    },
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.filters.startDate = action.payload.startDate;
      state.filters.endDate = action.payload.endDate;
      
      // Set to custom when specific dates are selected
      state.filters.timeRange = 'custom';
    },
    setFilters: (state, action: PayloadAction<Partial<DashboardFilters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setActiveLayout: (state, action: PayloadAction<string>) => {
      state.activeLayout = action.payload;
    },
    setIsCustomizing: (state, action: PayloadAction<boolean>) => {
      state.isCustomizing = action.payload;
    },
    updateWidgetSettings: (state, action: PayloadAction<{ layoutId: string; widgetId: string; settings: any }>) => {
      const { layoutId, widgetId, settings } = action.payload;
      if (state.layouts[layoutId] && state.layouts[layoutId].widgets[widgetId]) {
        state.layouts[layoutId].widgets[widgetId].settings = {
          ...state.layouts[layoutId].widgets[widgetId].settings,
          ...settings,
        };
      }
    },
    addWidget: (state, action: PayloadAction<{ layoutId: string; widget: any }>) => {
      const { layoutId, widget } = action.payload;
      if (state.layouts[layoutId]) {
        state.layouts[layoutId].widgets[widget.id] = widget;
      }
    },
    removeWidget: (state, action: PayloadAction<{ layoutId: string; widgetId: string }>) => {
      const { layoutId, widgetId } = action.payload;
      if (state.layouts[layoutId] && state.layouts[layoutId].widgets[widgetId]) {
        delete state.layouts[layoutId].widgets[widgetId];
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardLayouts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardLayouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.layouts = action.payload.layouts;
        state.activeLayout = action.payload.activeLayout;
      })
      .addCase(fetchDashboardLayouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch dashboard layouts';
      })
      .addCase(updateDashboardLayout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDashboardLayout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.layouts = action.payload.layouts;
        state.activeLayout = action.payload.activeLayout;
      })
      .addCase(updateDashboardLayout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update dashboard layout';
      });
  },
});

// Export actions
export const { 
  setTimeRange, 
  setDateRange, 
  setFilters,
  setActiveLayout,
  setIsCustomizing,
  updateWidgetSettings,
  addWidget,
  removeWidget,
  clearError,
} = dashboardSlice.actions;

// Export selectors
export const selectDashboardFilters = (state: RootState) => state.dashboard.filters;
export const selectDashboardLayouts = (state: RootState) => state.dashboard.layouts;
export const selectActiveLayout = (state: RootState) => state.dashboard.activeLayout;
export const selectActiveLayoutData = (state: RootState) => 
  state.dashboard.layouts[state.dashboard.activeLayout];
export const selectIsCustomizing = (state: RootState) => state.dashboard.isCustomizing;
export const selectDashboardLoading = (state: RootState) => state.dashboard.isLoading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer;