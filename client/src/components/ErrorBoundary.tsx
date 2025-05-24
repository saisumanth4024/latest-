import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  errorComponent?: React.ComponentType<{ error: Error; reset: () => void }>;
  boundary?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enhanced ErrorBoundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the entire app.
 * 
 * Features:
 * - Detailed error reporting
 * - Custom fallback components
 * - Reset functionality
 * - Named boundaries for easier debugging
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Update state so the next render will show the fallback UI.
   * This is a static lifecycle method.
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  /**
   * Catch errors in any components below and re-render with error message
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // You could also log to an error reporting service here
    // logErrorToService(error, errorInfo, this.props.boundary);
  }

  /**
   * Reset the error boundary state
   */
  handleReset = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, errorComponent: ErrorComponent } = this.props;

    if (hasError) {
      // If a custom error component is provided, use it
      if (ErrorComponent && error) {
        return <ErrorComponent error={error} reset={this.handleReset} />;
      }
      
      // If a fallback is provided, use it
      if (fallback) {
        return fallback;
      }
      
      // Default error UI
      return (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center my-4">
          <div className="flex flex-col items-center justify-center p-4">
            <AlertTriangle className="h-10 w-10 text-red-500 dark:text-red-400 mb-2" />
            <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
              Something went wrong
            </h2>
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 mb-4">
              {error?.message || 'An unexpected error occurred'}
            </p>
            <Button 
              onClick={this.handleReset}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * Creates a component wrapped with an ErrorBoundary
 * @param Component - The component to wrap
 * @param errorBoundaryProps - Props to pass to the ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const ComponentWithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps} boundary={displayName}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  
  return ComponentWithErrorBoundary;
}

export default ErrorBoundary;