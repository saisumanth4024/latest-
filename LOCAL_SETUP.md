# Local Setup Guide

This guide will help you set up and run the Enterprise App locally without any external dependencies.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup Steps

1. Clone the repository to your local machine:
   ```
   git clone [repository-url]
   cd enterprise-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   # Base configuration
   NODE_ENV=development
   PORT=3000
   
   # Disable external dependencies
   USE_MOCK_DATA=true
   OFFLINE_MODE=true
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. The application should now be running at http://localhost:3000

## Running in Offline Mode

The application has been configured to work completely offline with mock data. Key features available offline:

- Product browsing and search
- User authentication (with mock credentials)
- Orders and order history
- Admin dashboard with mock metrics

## Mock Credentials

Use these credentials to log in to the application:

- **Admin User**:
  - Email: admin@example.com
  - Password: admin123

- **Regular User**:
  - Email: user@example.com
  - Password: user123

## Project Structure

- `/client` - Frontend React application
- `/server` - Express backend server
- `/shared` - Shared types and utilities

## Customizing Mock Data

You can modify the mock data in these files:
- `client/src/features/products/components/SimpleProductGrid.tsx` - Product data
- `client/src/features/auth/data/mockUsers.ts` - User data
- `client/src/features/orders/data/mockOrders.ts` - Order data

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Make sure all dependencies are installed: `npm install`
   - Try cleaning the cache: `npm cache clean --force`

2. **Rendering issues**
   - The application uses mock data in offline mode, which might differ from the expected API responses
   - Check the console for any specific errors

3. **Authentication problems**
   - In offline mode, only the mock credentials listed above will work
   - Session data is stored in localStorage and will persist between browser sessions

If you encounter any other issues, please check the error console in your browser's developer tools for more specific information.