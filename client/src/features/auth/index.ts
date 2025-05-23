// Auth Feature Barrel Export

// Main components
export { default as LoginForm } from './LoginForm';
export { default as SignupForm } from './SignupForm';
export { default as AuthProvider } from './AuthProvider';
export { default as ProtectedRoute } from './ProtectedRoute';

// Hooks
export { useAuth, useAuthRedirect } from './authHooks';

// Redux slice and actions
export {
  // Slice reducer (default export)
  default as authReducer,
  
  // Actions
  login,
  logout,
  signup,
  refreshToken,
  googleLogin,
  githubLogin,
  getUserSessions,
  revokeSession,
  setFormError,
  clearError,
  setAuthState,
  checkTokenExpiration,
  
  // Selectors
  selectUser,
  selectToken,
  selectAuthStatus,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectFormError,
  selectSessions,
  selectUserRole,
  selectIsAdmin,
  selectIsSeller,
} from './authSlice';

// RBAC types and functions
export {
  canAccessRoute,
  hasPermissions,
  hasRole,
  getPermissionsForRole,
} from './rbac';

export type { Permission } from './rbac';