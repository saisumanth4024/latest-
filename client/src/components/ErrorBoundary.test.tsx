import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary, { withErrorBoundary } from './ErrorBoundary';

// Component that throws an error for testing purposes
const ErrorComponent = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Custom fallback component for testing
const CustomFallback = ({ error, reset }) => (
  <div>
    <h2>Custom Error UI</h2>
    <p>Error message: {error.message}</p>
    <button onClick={reset}>Reset</button>
  </div>
);

describe('ErrorBoundary Component', () => {
  // Suppress console.error during tests since we're intentionally throwing errors
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child-component">Child Component</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child-component')).toBeInTheDocument();
  });

  it('should render fallback UI when an error occurs', () => {
    // Since errors can only be caught in component lifecycle,
    // we need to use ErrorComponent that conditionally throws
    const { rerender } = render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    // Verify initial render without error
    expect(screen.getByText('No error')).toBeInTheDocument();

    // Force a re-render with an error
    rerender(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Default fallback should include "Something went wrong"
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should render custom fallback component when provided', () => {
    // Render with custom fallback
    const { rerender } = render(
      <ErrorBoundary 
        fallback={<div>Custom fallback</div>}
      >
        <ErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    // Force a re-render with an error
    rerender(
      <ErrorBoundary 
        fallback={<div>Custom fallback</div>}
      >
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Custom fallback should be shown
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('should use errorComponent prop when provided', () => {
    // Render with custom error component
    const { rerender } = render(
      <ErrorBoundary 
        errorComponent={CustomFallback}
      >
        <ErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    // Force a re-render with an error
    rerender(
      <ErrorBoundary 
        errorComponent={CustomFallback}
      >
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Custom error component should be shown with the error message
    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.getByText('Error message: Test error')).toBeInTheDocument();
  });

  it('should call onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    // Render with custom reset handler
    const { rerender } = render(
      <ErrorBoundary 
        onReset={onReset}
      >
        <ErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    // Force a re-render with an error
    rerender(
      <ErrorBoundary 
        onReset={onReset}
      >
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Click the reset button
    const resetButton = screen.getByRole('button', { name: /try again/i });
    await user.click(resetButton);

    // onReset should have been called
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});

describe('withErrorBoundary HOC', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should wrap component with error boundary', () => {
    // Create a wrapped component
    const WrappedComponent = withErrorBoundary(ErrorComponent, {
      boundary: 'test-boundary'
    });

    // Render the wrapped component (should not throw)
    const { rerender } = render(<WrappedComponent />);

    // Verify initial render
    expect(screen.getByText('No error')).toBeInTheDocument();

    // Force an error by updating props
    rerender(<WrappedComponent shouldThrow={true} />);

    // Error boundary should catch the error and render fallback UI
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('should pass props to the wrapped component', () => {
    // Create a test component that displays its props
    const TestComponent = ({ message }: { message: string }) => (
      <div>Message: {message}</div>
    );

    // Wrap the component
    const WrappedComponent = withErrorBoundary(TestComponent);

    // Render with props
    render(<WrappedComponent message="Hello world" />);

    // Props should be passed through
    expect(screen.getByText('Message: Hello world')).toBeInTheDocument();
  });

  it('should use custom error boundary props', () => {
    // Create a wrapped component with custom error boundary props
    const WrappedComponent = withErrorBoundary(ErrorComponent, {
      errorComponent: CustomFallback,
      boundary: 'custom-boundary'
    });

    // Render and force an error
    const { rerender } = render(<WrappedComponent />);
    rerender(<WrappedComponent shouldThrow={true} />);

    // Custom error component should be used
    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
  });
});