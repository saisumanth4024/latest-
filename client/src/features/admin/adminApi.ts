import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  AdminUser, 
  CreateUserRequest, 
  UpdateUserRequest,
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  AdminProduct,
  CreateProductRequest,
  UpdateProductRequest,
  AppSettings,
  AuditLog,
  ScheduledJob
} from './types';

// Define pagination parameters
interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Define filter parameters for users
interface UserFilterParams extends PaginationParams {
  search?: string;
  status?: 'active' | 'inactive' | 'banned' | 'pending';
  role?: string;
  createdAfter?: string;
  createdBefore?: string;
}

// Define filter parameters for products
interface ProductFilterParams extends PaginationParams {
  search?: string;
  category?: string;
  status?: 'active' | 'draft' | 'archived';
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

// Define response types with pagination
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Define the admin API
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/admin' }),
  tagTypes: [
    'AdminUsers', 
    'AdminUser', 
    'Roles', 
    'Role', 
    'Permissions',
    'AdminProducts',
    'AdminProduct',
    'Settings',
    'AuditLogs',
    'ScheduledJobs'
  ],
  endpoints: (builder) => ({
    // User Management Endpoints
    getUsers: builder.query<PaginatedResponse<AdminUser>, UserFilterParams | void>({
      query: (params = {}) => {
        return {
          url: '/users',
          params: params || undefined,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'AdminUsers' as const, id })),
              { type: 'AdminUsers', id: 'LIST' },
            ]
          : [{ type: 'AdminUsers', id: 'LIST' }],
    }),
    
    getUserById: builder.query<AdminUser, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminUser', id }],
    }),
    
    createUser: builder.mutation<AdminUser, CreateUserRequest>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'AdminUsers', id: 'LIST' }],
    }),
    
    updateUser: builder.mutation<AdminUser, UpdateUserRequest>({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminUsers', id: 'LIST' },
        { type: 'AdminUser', id },
      ],
    }),
    
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminUsers', id: 'LIST' }],
    }),
    
    banUser: builder.mutation<AdminUser, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/users/${id}/ban`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminUsers', id: 'LIST' },
        { type: 'AdminUser', id },
      ],
    }),
    
    unbanUser: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/users/${id}/unban`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AdminUsers', id: 'LIST' },
        { type: 'AdminUser', id },
      ],
    }),
    
    // Role & Permission Management Endpoints
    getRoles: builder.query<Role[], void>({
      query: () => '/roles',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Roles' as const, id })),
              { type: 'Roles', id: 'LIST' },
            ]
          : [{ type: 'Roles', id: 'LIST' }],
    }),
    
    getRoleById: builder.query<Role, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),
    
    createRole: builder.mutation<Role, CreateRoleRequest>({
      query: (data) => ({
        url: '/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),
    
    updateRole: builder.mutation<Role, UpdateRoleRequest>({
      query: ({ id, ...data }) => ({
        url: `/roles/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Roles', id: 'LIST' },
        { type: 'Role', id },
      ],
    }),
    
    deleteRole: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),
    
    getPermissions: builder.query<Permission[], void>({
      query: () => '/permissions',
      providesTags: [{ type: 'Permissions', id: 'LIST' }],
    }),
    
    // Product Management Endpoints
    getProducts: builder.query<PaginatedResponse<AdminProduct>, ProductFilterParams | void>({
      query: (params = {}) => {
        return {
          url: '/products',
          params: params || undefined,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'AdminProducts' as const, id })),
              { type: 'AdminProducts', id: 'LIST' },
            ]
          : [{ type: 'AdminProducts', id: 'LIST' }],
    }),
    
    getProductById: builder.query<AdminProduct, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminProduct', id }],
    }),
    
    createProduct: builder.mutation<AdminProduct, CreateProductRequest>({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'AdminProducts', id: 'LIST' }],
    }),
    
    updateProduct: builder.mutation<AdminProduct, UpdateProductRequest>({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminProducts', id: 'LIST' },
        { type: 'AdminProduct', id },
      ],
    }),
    
    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminProducts', id: 'LIST' }],
    }),
    
    approveProduct: builder.mutation<AdminProduct, { id: string; notes?: string }>({
      query: ({ id, notes }) => ({
        url: `/products/${id}/approve`,
        method: 'POST',
        body: { notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminProducts', id: 'LIST' },
        { type: 'AdminProduct', id },
      ],
    }),
    
    rejectProduct: builder.mutation<AdminProduct, { id: string; notes: string }>({
      query: ({ id, notes }) => ({
        url: `/products/${id}/reject`,
        method: 'POST',
        body: { notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminProducts', id: 'LIST' },
        { type: 'AdminProduct', id },
      ],
    }),
    
    // Settings Management Endpoints
    getSettings: builder.query<AppSettings, void>({
      query: () => '/settings',
      providesTags: [{ type: 'Settings', id: 'GENERAL' }],
    }),
    
    updateSettings: builder.mutation<AppSettings, Partial<AppSettings>>({
      query: (data) => ({
        url: '/settings',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'Settings', id: 'GENERAL' }],
    }),
    
    // Audit Logs Endpoints
    getAuditLogs: builder.query<PaginatedResponse<AuditLog>, PaginationParams & { 
      userId?: string;
      action?: string;
      resource?: string;
      startDate?: string;
      endDate?: string;
    }>({
      query: (params = {}) => ({
        url: '/audit-logs',
        params,
      }),
      providesTags: [{ type: 'AuditLogs', id: 'LIST' }],
    }),
    
    // Scheduled Jobs Endpoints
    getScheduledJobs: builder.query<ScheduledJob[], void>({
      query: () => '/jobs',
      providesTags: [{ type: 'ScheduledJobs', id: 'LIST' }],
    }),
    
    toggleJobStatus: builder.mutation<ScheduledJob, { id: string; enabled: boolean }>({
      query: ({ id, enabled }) => ({
        url: `/jobs/${id}/toggle`,
        method: 'POST',
        body: { enabled },
      }),
      invalidatesTags: [{ type: 'ScheduledJobs', id: 'LIST' }],
    }),
    
    runJobManually: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/jobs/${id}/run`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'ScheduledJobs', id: 'LIST' }],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  // User hooks
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
  
  // Role & Permission hooks
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
  
  // Product hooks
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useApproveProductMutation,
  useRejectProductMutation,
  
  // Settings hooks
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  
  // Audit logs hooks
  useGetAuditLogsQuery,
  
  // Scheduled jobs hooks
  useGetScheduledJobsQuery,
  useToggleJobStatusMutation,
  useRunJobManuallyMutation,
} = adminApi;