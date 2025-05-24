import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the entire app.
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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  /**
   * Reset the error boundary state
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      return this.props.fallback || (
        <Alert variant="destructive" className="my-4">
          <div className="flex items-start justify-between">
            <div>
              <AlertTitle className="text-lg font-semibold">Something went wrong</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  An error occurred in this component. Try refreshing the page or contact support if the problem persists.
                </p>
                {process.env.NODE_ENV !== 'production' && this.state.error && (
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto max-h-40">
                    <p className="font-mono text-xs text-red-600 dark:text-red-400">
                      {this.state.error.toString()}
                    </p>
                  </div>
                )}
              </AlertDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={this.handleReset} 
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        </Alert>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;