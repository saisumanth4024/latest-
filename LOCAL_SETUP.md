# Local Setup Guide for Enterprise App

This guide will help you set up and run the Enterprise App on your local machine without any dependency on Replit.

## Prerequisites

1. Node.js (v18.x or later)
2. PostgreSQL (v14.x or later)
3. Git

## Setup Instructions

### 1. Database Setup

First, set up a PostgreSQL database:

```bash
# Create a new database
createdb enterprise_app

# Or using psql
psql -U postgres
CREATE DATABASE enterprise_app;
\q
```

### 2. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/enterprise_app"
   SESSION_SECRET="your-strong-random-secret-key"
   ```

### 3. Installation

Install all required dependencies:

```bash
npm install
```

### 4. Database Migration

Initialize the database schema:

```bash
npm run db:push
```

### 5. Starting the Application

Run the development server:

```bash
npm run dev
```

The application should now be running at `http://localhost:5000`.

## Application Structure

- `client/` - React frontend application
- `server/` - Express API backend
- `shared/` - Shared code and types between frontend and backend
- `server/routes/` - API route handlers including mock data endpoints

## Using Without a Database

If you want to run the application without setting up PostgreSQL:

1. Open `server/db.ts` and comment out the database connection logic
2. Modify `server/storage.ts` to use `MemStorage` instead of `DatabaseStorage`

Example modification for `server/db.ts`:

```typescript
// Comment out or replace with mock implementation
export const pool = {
  connect: () => console.log('Using mock database'),
};
export const db = {
  // Mock implementation
};
```

## Running Tests

```bash
npm test
```

## Common Issues and Solutions

### Database Connection Issues

If you see errors connecting to the database:

1. Verify your PostgreSQL service is running
2. Check your credentials in the `.env` file
3. Ensure the database exists and is accessible

### Port Conflicts

If port 5000 is already in use:

1. Change the PORT in the `.env` file:
   ```
   PORT=3000
   ```

### Authentication Issues

The app uses a demo authentication system. If you encounter authentication issues:

1. Check session configuration in `server/auth.ts`
2. Ensure the SESSION_SECRET is properly set in `.env`

## Running in Production

For production builds:

```bash
npm run build
npm start
```

This will create optimized builds and serve them with better performance.

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev/)