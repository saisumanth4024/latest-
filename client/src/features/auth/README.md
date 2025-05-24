# Authentication System Documentation

## Authentication Flow

The application implements a comprehensive authentication system with the following flows:

### Signup Flow
1. User fills out and submits the signup form
2. Form data is validated using Zod schema (username, email, password)
3. On submission, the `signup` action is dispatched to the auth slice
4. On success:
   - User receives a "Registration successful" toast notification
   - User is redirected to the login page (NOT auto-logged in)
5. On error:
   - Error message is displayed
   - Form values are retained for correction

### Login Flow
1. User enters credentials and submits the login form
2. Form data is validated using Zod schema (email, password)
3. On submission, the `login` action is dispatched to the auth slice
4. On success:
   - User data and tokens are stored in Redux state and localStorage
   - User is redirected to the originally requested protected route or home page
   - Welcome toast notification is displayed
5. On error:
   - Error message is displayed
   - Form values are retained for correction

### Logout Flow
1. User clicks the logout button in the header
2. A fetch request is sent to the server logout endpoint to clear session
3. The `logout` action is dispatched to clear client-side state
4. All auth data is removed from Redux state and localStorage
5. User is redirected to the login page
6. "Logged out successfully" toast is displayed

### Protected Routes
1. Protected routes check authentication status through the `isAuthenticated` state
2. If a user is not authenticated and tries to access a protected route:
   - The current path is saved to session storage
   - User is redirected to the login page
3. After successful login, user is redirected to the originally requested route

### RBAC (Role-Based Access Control)
1. Routes can specify required roles for access
2. If a user doesn't have the required role, access is denied with a notification

## Error Handling

The authentication system handles various error scenarios:

1. **Network Errors**: Handled with appropriate messages
2. **Validation Errors**: Client-side validation with detailed error messages
3. **Authentication Errors**: Server-side errors (invalid credentials, etc.)
4. **Session Expiration**: Automatic logout and redirection

## Troubleshooting

Common issues and their solutions:

1. **Issue**: Not being redirected after login/logout
   **Solution**: Check that the location state is properly updated and that no race conditions are preventing the redirection

2. **Issue**: Authentication state not persisting after page refresh
   **Solution**: Ensure localStorage items are correctly set and retrieved on app initialization

3. **Issue**: Protected routes still accessible after logout
   **Solution**: Verify that the isAuthenticated state is correctly reset and that the ProtectedRoute component is checking this state

4. **Issue**: Login form shows success but user isn't authenticated
   **Solution**: Check the server response structure and ensure the auth slice correctly processes the response

## Extending the Authentication System

To add additional authentication methods:

1. Create a new async thunk in authSlice.ts
2. Add the appropriate cases to the extraReducers section
3. Create UI components for the new authentication method
4. Update the auth hook if necessary

To add new user roles:

1. Add the role to the UserRole enum/type
2. Update the RBAC configuration in rbac.ts
3. Create or update components to handle the new role permissions