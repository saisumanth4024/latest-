# Enterprise React Application

A production-ready, enterprise-grade React application with TypeScript, Redux Toolkit, and a comprehensive component library. This application includes robust error handling, test coverage, and performance optimizations.

## Features

- **Comprehensive Component Library** - Built with shadcn/ui and Tailwind CSS
- **State Management** - Redux Toolkit with RTK Query for data fetching
- **Type Safety** - Full TypeScript implementation with strict typing
- **Error Handling** - Error boundaries with reset functionality and detailed reporting
- **Performance Optimizations** - React memoization, debounced inputs, and optimized rendering
- **Network Status Detection** - Offline mode indicators and graceful degradation
- **Dark Mode Support** - System preference detection with manual toggle
- **Role-Based Access Control** - Granular permissions with role-based navigation
- **Test Coverage** - Unit and integration tests for components and utilities

## Getting Started

### For Local Development

To run this application locally without any Replit dependencies:

1. Clone this repository
2. Set up your environment by running:
   ```
   node scripts/local-setup.js
   ```
3. Start the development server:
   ```
   npm run dev
   ```

The application will be available at http://localhost:5000.

### Environment Setup

The application uses environment variables for configuration. Copy the example environment file:

```
cp .env.example .env
```

Then update it with your local settings.

## Offline Usage

This application can run completely offline once set up. You have two options:

1. **With PostgreSQL**: Set up a local PostgreSQL database and update your `.env` file
2. **Without PostgreSQL**: Use the in-memory storage option by modifying `server/storage.ts`

For detailed instructions, see [LOCAL_SETUP.md](LOCAL_SETUP.md).

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Run the production build
- `npm test` - Run tests
- `npm run setup` - Interactive setup for local development
- `node scripts/make-portable.js` - Configure the app for offline use

## Project Structure

```
├── client/               # React frontend application
│   ├── src/
│   │   ├── app/          # Redux store setup
│   │   ├── components/   # Reusable UI components
│   │   ├── features/     # Feature-specific components and logic
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── providers/    # Context providers
├── server/               # Express API backend
│   ├── routes/           # API route handlers
│   ├── db.ts             # Database connection
│   ├── storage.ts        # Data storage implementation
│   └── vite.ts           # Vite server integration
├── shared/               # Shared code between frontend and backend
│   └── schema.ts         # Database schema and types
└── scripts/              # Utility scripts for setup and deployment
```

## Testing

The application includes comprehensive tests for components, hooks, and utilities. Run tests with:

```
npm test
```

## Deployment

To deploy this application to a production environment:

1. Build the application:
   ```
   npm run build
   ```

2. Copy the contents of the `dist` directory to your server

3. Install dependencies and start the server:
   ```
   npm install
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.