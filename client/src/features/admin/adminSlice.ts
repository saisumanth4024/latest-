import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

// Define the admin slice state
export interface AdminState {
  activeTab: string;
  impersonatingUser: boolean;
  impersonatedUserId: string | null;
  sidebarOpen: boolean;
  logsFilter: {
    startDate: string | null;
    endDate: string | null;
    severity: 'all' | 'info' | 'warning' | 'error';
    category: string | null;
  };
  auditTrail: {
    userId: string;
    action: string;
    details: string;
    timestamp: string;
    ipAddress?: string;
    resource?: string;
  }[];
}

// Initial state
const initialState: AdminState = {
  activeTab: 'dashboard',
  impersonatingUser: false,
  impersonatedUserId: null,
  sidebarOpen: true,
  logsFilter: {
    startDate: null,
    endDate: null,
    severity: 'all',
    category: null,
  },
  auditTrail: [],
};

// Create the admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    startImpersonation: (state, action: PayloadAction<string>) => {
      state.impersonatingUser = true;
      state.impersonatedUserId = action.payload;
      // Log this action to audit trail
      state.auditTrail.push({
        userId: 'admin', // This should come from the current user ID
        action: 'USER_IMPERSONATION_START',
        details: `Started impersonating user with ID: ${action.payload}`,
        timestamp: new Date().toISOString(),
      });
    },
    stopImpersonation: (state) => {
      const impersonatedId = state.impersonatedUserId;
      state.impersonatingUser = false;
      state.impersonatedUserId = null;
      // Log this action to audit trail
      state.auditTrail.push({
        userId: 'admin', // This should come from the current user ID
        action: 'USER_IMPERSONATION_END',
        details: `Stopped impersonating user with ID: ${impersonatedId}`,
        timestamp: new Date().toISOString(),
      });
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setLogsFilter: (state, action: PayloadAction<Partial<AdminState['logsFilter']>>) => {
      state.logsFilter = { ...state.logsFilter, ...action.payload };
    },
    addAuditLog: (state, action: PayloadAction<Omit<AdminState['auditTrail'][0], 'timestamp'>>) => {
      state.auditTrail.unshift({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    clearAuditLogs: (state) => {
      state.auditTrail = [];
    },
  },
});

// Export actions
export const {
  setActiveTab,
  startImpersonation,
  stopImpersonation,
  toggleSidebar,
  setLogsFilter,
  addAuditLog,
  clearAuditLogs,
} = adminSlice.actions;

// Export selectors
export const selectActiveTab = (state: RootState) => state.admin.activeTab;
export const selectImpersonationStatus = (state: RootState) => ({
  isImpersonating: state.admin.impersonatingUser,
  impersonatedUserId: state.admin.impersonatedUserId,
});
export const selectSidebarOpen = (state: RootState) => state.admin.sidebarOpen;
export const selectLogsFilter = (state: RootState) => state.admin.logsFilter;
export const selectAuditTrail = (state: RootState) => state.admin.auditTrail;

export default adminSlice.reducer;