import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import OfflineIndicator, { withOfflineDetection } from './OfflineIndicator';

// Mock the useNetworkStatus hook
vi.mock('../hooks/useNetworkStatus', () => ({
  useNetworkStatus: vi.fn()
}));

// Mock component for HOC testing
const TestComponent = () => (
  <div data-testid="test-component">Test Component Content</div>
);

describe('OfflineIndicator Component', () => {
  const mockUseNetworkStatus = vi.mocked(require('../hooks/useNetworkStatus').useNetworkStatus);
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render anything when online', () => {
    // Mock online status
    mockUseNetworkStatus.mockReturnValue({
      isOnline: true,
      wasOffline: false,
      since: null
    });
    
    const { container } = render(<OfflineIndicator />);
    
    // Component should not render anything when online
    expect(container).toBeEmptyDOMElement();
  });

  it('should render offline notification when offline', () => {
    // Mock offline status
    const offlineSince = new Date();
    mockUseNetworkStatus.mockReturnValue({
      isOnline: false,
      wasOffline: true,
      since: offlineSince
    });
    
    render(<OfflineIndicator />);
    
    // Should display offline message
    expect(screen.getByText(/you are offline/i)).toBeInTheDocument();
  });

  it('should include the offline duration when provided', () => {
    // Mock offline status with a timestamp from 5 minutes ago
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    mockUseNetworkStatus.mockReturnValue({
      isOnline: false,
      wasOffline: true,
      since: fiveMinutesAgo
    });
    
    render(<OfflineIndicator />);
    
    // Should display offline duration
    expect(screen.getByText(/5 minutes/i)).toBeInTheDocument();
  });
});

describe('withOfflineDetection HOC', () => {
  const mockUseNetworkStatus = vi.mocked(require('../hooks/useNetworkStatus').useNetworkStatus);
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render wrapped component normally when online', () => {
    // Mock online status
    mockUseNetworkStatus.mockReturnValue({
      isOnline: true,
      wasOffline: false,
      since: null
    });
    
    const WrappedComponent = withOfflineDetection(TestComponent);
    render(<WrappedComponent />);
    
    // Wrapped component should be rendered
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    // No offline notification should be visible
    expect(screen.queryByText(/you are offline/i)).not.toBeInTheDocument();
  });

  it('should render wrapped component with offline notification when offline', () => {
    // Mock offline status
    mockUseNetworkStatus.mockReturnValue({
      isOnline: false,
      wasOffline: true,
      since: new Date()
    });
    
    const WrappedComponent = withOfflineDetection(TestComponent);
    render(<WrappedComponent />);
    
    // Both wrapped component and offline notification should be rendered
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    expect(screen.getByText(/you are offline/i)).toBeInTheDocument();
  });

  it('should pass props through to the wrapped component', () => {
    // Mock online status
    mockUseNetworkStatus.mockReturnValue({
      isOnline: true,
      wasOffline: false,
      since: null
    });
    
    // Create a component that displays props
    const PropsComponent = ({ testProp }: { testProp: string }) => (
      <div data-testid="props-component">Prop value: {testProp}</div>
    );
    
    // Wrap the component
    const WrappedPropsComponent = withOfflineDetection(PropsComponent);
    
    // Render with props
    render(<WrappedPropsComponent testProp="test value" />);
    
    // Props should be passed through
    expect(screen.getByText('Prop value: test value')).toBeInTheDocument();
  });
});