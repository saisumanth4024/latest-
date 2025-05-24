# Enterprise React Application

A production-ready enterprise-grade React application built with TypeScript, Redux Toolkit, RTK Query, and Tailwind CSS. This application follows strict architectural principles and implements advanced React patterns for optimal performance and maintainability.

## Project Overview

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: wouter (lightweight router)
- **Form Handling**: react-hook-form with zod validation
- **API Integration**: RTK Query with optimistic updates
- **Authentication**: Custom auth with JWT and refresh tokens

### Integration Philosophy
- **Single Source of Truth**: One Redux store for all global state
- **Global UI Management**: UI state (modals, toasts) managed through Redux
- **Barrel Exports**: Organized exports through index.ts files for clean imports
- **Absolute Imports**: Configured path aliases for cleaner imports
- **Type Safety**: Comprehensive TypeScript typing throughout the codebase

## Global Folder Structure

```
client/
├── src/
│   ├── app/                    # Redux store setup, hooks
│   ├── components/             # Shared UI components
│   │   ├── ui/                 # Primitive UI components (shadcn)
│   │   └── layout/             # Layout components
│   ├── config/                 # Application configuration
│   ├── features/               # Feature modules (products, auth, cart, etc.)
│   │   ├── [feature]/
│   │   │   ├── components/     # Feature-specific components
│   │   │   ├── hooks/          # Feature-specific hooks
│   │   │   ├── [feature]Slice.ts # Redux Toolkit slice
│   │   │   └── [feature]Api.ts # RTK Query API definitions
│   ├── hooks/                  # Shared custom hooks
│   ├── lib/                    # Utility libraries
│   ├── pages/                  # Page components
│   ├── providers/              # Context providers
│   ├── types/                  # Global type definitions
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main application component
│   └── main.tsx                # Application entry point
├── public/                     # Static assets
└── package.json                # Dependencies and scripts
```

## How to Run the Project

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Features

### 1. Error Boundary System

#### Feature Overview
The error boundary system provides a robust error-handling mechanism that catches JavaScript errors anywhere in the component tree, logs those errors, and displays a fallback UI instead of crashing the entire application. This is critical for production applications to ensure that isolated errors don't bring down the entire user experience.

#### Architecture & Optimization
- **Class Component Implementation**: Uses React's error boundary lifecycle methods which are only available in class components
- **HOC Pattern**: Provides a higher-order component (withErrorBoundary) for easy wrapping of components
- **Fallback UI Customization**: Supports custom fallback UIs and error components
- **Reset Capability**: Allows users to recover from errors with a reset function
- **Boundary Naming**: Named boundaries for easier debugging and error tracking
- **Separation of Concerns**: Keeps error handling logic separate from component logic

#### Files & Folders
- **Main Component**: `client/src/components/ErrorBoundary.tsx` - The core error boundary component
- **HOC Export**: `withErrorBoundary` function for wrapping components
- **Integration**: Implemented in `App.tsx` and throughout feature components

#### Usage & Debugging Tips
- Wrap any component that might throw errors with `<ErrorBoundary>` or use the `withErrorBoundary` HOC
- Error boundaries are particularly useful around data fetching components, form submissions, and complex UI components
- Errors caught by error boundaries appear in the browser console and can be inspected
- Use different boundary names for different parts of the application to identify error sources

### 2. Product Management

#### Feature Overview
The Product Management feature allows users to browse, search, filter, and view detailed information about products. It implements advanced UI patterns for an optimal shopping experience with efficient data loading and presentation.

#### Architecture & Optimization
- **Redux State Management**: Uses Redux Toolkit slice for product state
- **RTK Query Integration**: Implements efficient data fetching with caching
- **Infinite Scrolling**: Loads products as the user scrolls for better performance
- **Debounced Search**: Optimizes API calls during user typing with debounced inputs
- **Memoization**: Uses React.memo, useMemo, and useCallback for performance optimization
- **Responsive UI**: Adapts to different screen sizes with mobile-first approach
- **Deferred Rendering**: Uses useDeferredValue for smoother UI during intensive operations
- **Non-blocking Updates**: Implements useTransition for better user experience during state updates
- **Virtualization**: Optimizes rendering of large product lists
- **Filter and Sort**: Comprehensive filtering and sorting options
- **Error Handling**: Robust error boundaries for resilient UI

#### Files & Folders
- **Redux Slice**: `client/src/features/products/productsSlice.ts` - State management
- **API Service**: `client/src/features/products/productsApi.ts` - API integration
- **UI Components**:
  - `client/src/features/products/components/ProductsPage.tsx` - Main products listing page
  - `client/src/features/products/components/ProductGrid.tsx` - Grid display of products
  - `client/src/features/products/components/ProductDetailPage.tsx` - Product details view
  - `client/src/features/products/components/SearchBar.tsx` - Enhanced search component
- **Custom Hooks**:
  - `client/src/hooks/useInfiniteScroll.ts` - For infinite scrolling functionality
  - `client/src/hooks/usePerformance.ts` - Performance optimization hooks
- **Integration**: Registered in the Redux store, routed in App.tsx

#### Usage & Debugging Tips
- Navigate to `/products` to view the product listing
- Use search bar to filter products by keyword
- Apply filters using the sidebar
- Inspect Redux state changes in Redux DevTools under the 'products' slice
- Monitor API calls and caching behavior in the Network tab
- Check React DevTools profiler for component render performance

### 3. Network and Performance Optimization

#### Feature Overview
The Network and Performance optimization features enhance the application's responsiveness, loading speed, and resilience to network issues. These optimizations ensure a smooth user experience even on slower connections or when offline.

#### Architecture & Optimization
- **Code Splitting**: Uses React.lazy and Suspense for on-demand loading
- **Lazy Loading**: Defers loading of non-critical components
- **Online/Offline Detection**: Provides feedback and functionality during connectivity issues
- **Connection Quality Detection**: Adjusts experience based on connection speed
- **Performance Monitoring**: Custom hooks to detect performance issues
- **Throttling and Debouncing**: Prevents excessive function calls
- **Transition Management**: Enhanced version of React's useTransition for smoother UI updates
- **Deferred Values**: Uses useDeferredValue to prevent UI blocking during intensive operations
- **Render Warning**: Development utility to detect excessive re-renders

#### Files & Folders
- **Lazy Loading Utility**: `client/src/utils/lazyLoad.tsx` - Enhanced lazy loading with error boundaries
- **Network Status Hooks**: `client/src/hooks/useNetworkStatus.ts` - Online/offline detection
- **Performance Hooks**: `client/src/hooks/usePerformance.ts` - Performance optimization hooks
- **UI Components**:
  - `client/src/components/OfflineIndicator.tsx` - Offline status notification
- **Integration**: Used throughout the application, especially in App.tsx and feature components

#### Usage & Debugging Tips
- Test offline functionality by disconnecting from the internet
- Use Chrome DevTools' Network tab and set throttling to simulate slow connections
- Look for the offline indicator when connectivity is lost
- Monitor performance in React DevTools Profiler
- Check render counts in development console for render warning logs

### 4. Authentication System

#### Feature Overview
The Authentication system provides secure user authentication and authorization, supporting features like login, registration, session management, and role-based access control. It ensures that only authorized users can access protected resources.

#### Architecture & Optimization
- **Redux State Management**: Uses Redux Toolkit slice for auth state
- **JWT Authentication**: Implements JWT tokens with refresh token functionality
- **Persistent Sessions**: Maintains user sessions across browser sessions
- **Role-Based Access Control**: Restricts access based on user roles
- **Protected Routes**: Prevents unauthorized access to protected pages
- **Form Validation**: Comprehensive validation with zod and react-hook-form
- **Secure Storage**: Properly stores authentication tokens
- **Auto-Refresh**: Automatically refreshes tokens before expiration
- **Loading States**: Provides feedback during authentication operations

#### Files & Folders
- **Redux Slice**: `client/src/features/auth/authSlice.ts` - Authentication state
- **API Service**: `client/src/features/auth/authApi.ts` - Authentication API integration
- **UI Components**:
  - `client/src/features/auth/components/LoginForm.tsx` - Login form
  - `client/src/features/auth/components/SignupForm.tsx` - Registration form
- **Custom Hooks**:
  - `client/src/hooks/useAuth.ts` - Authentication status and utilities
- **Integration**: Protected routes in App.tsx, auth state in Redux store

#### Usage & Debugging Tips
- Navigate to `/login` to access the login page
- Use Redux DevTools to inspect the 'auth' slice
- Check localStorage for token storage (in dev environment only)
- Test protected routes by logging in/out
- Monitor network requests for auth API calls

### 5. UI Component System

#### Feature Overview
The UI Component System provides a comprehensive set of reusable, accessible, and customizable UI components that maintain consistent design language throughout the application. These components follow best practices for accessibility, responsiveness, and performance.

#### Architecture & Optimization
- **Composition Pattern**: Components designed for composition and flexibility
- **Theme Customization**: Supports light/dark mode and custom theming
- **Accessibility**: ARIA attributes and keyboard navigation
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Atomic Design**: Organized by atoms, molecules, organisms, and templates
- **Memoization**: Performance optimized with React.memo
- **CSS-in-JS**: Uses Tailwind CSS for styling with theme variables
- **Variant System**: Components support multiple variants and sizes

#### Files & Folders
- **UI Primitives**: `client/src/components/ui/` - Base UI components
- **Layout Components**: `client/src/components/layout/` - Layout structure components
- **Theme Provider**: `client/src/providers/ThemeProvider.tsx` - Theme management
- **Utils**: `client/src/lib/utils.ts` - UI utility functions
- **Integration**: Used throughout the application for consistent UI

#### Usage & Debugging Tips
- Inspect component props in React DevTools
- Use the theme toggle to test dark/light mode
- Check responsive behavior with browser dev tools responsive mode
- Test keyboard navigation for accessibility
- Look at the component examples in storybook (if available)

## Dev Best Practices

### Code Quality
- **TypeScript Strict Mode**: Enabled for maximum type safety
- **ESLint & Prettier**: Configured for code quality and consistency
- **Git Hooks**: Prevents committing code with issues
- **Code Reviews**: Required for all changes

### Performance
- **Bundle Size Monitoring**: Tracks bundle size changes
- **Lazy Loading**: Implements code splitting
- **Memoization**: Uses memoization techniques for expensive operations
- **Virtual Rendering**: For large lists and data sets

### Accessibility
- **ARIA Attributes**: Properly implemented for screen readers
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Color Contrast**: Meets WCAG standards
- **Focus Management**: Proper focus handling for modals and dialogs

### Testing
- **Unit Tests**: For isolated component and logic testing
- **Integration Tests**: For feature interaction testing
- **E2E Tests**: For full user flow testing
- **Visual Regression Tests**: For UI changes

## Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)