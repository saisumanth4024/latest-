import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toaster } from './toaster';
import * as hooks from '@/hooks/use-toast';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toasts: []
  }))
}));

describe('Toaster Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<Toaster />);
    // Basic existence check - the component itself doesn't render any visible content when no toasts
    expect(document.querySelector('[role="region"]')).toBeInTheDocument();
  });

  it('should render toast with title and description', () => {
    // Setup mock toasts
    const mockToasts = [
      {
        id: '1',
        title: 'Test Toast Title',
        description: 'Test toast description',
        variant: 'default',
      }
    ];

    // Mock the hook to return toasts
    vi.mocked(hooks.useToast).mockImplementation(() => ({
      toasts: mockToasts
    }));

    render(<Toaster />);
    
    // Check that toast content is rendered
    expect(screen.getByText('Test Toast Title')).toBeInTheDocument();
    expect(screen.getByText('Test toast description')).toBeInTheDocument();
  });

  it('should render multiple toasts', () => {
    // Setup mock multiple toasts
    const mockToasts = [
      {
        id: '1',
        title: 'First Toast',
        description: 'First description',
        variant: 'default',
      },
      {
        id: '2',
        title: 'Second Toast',
        description: 'Second description',
        variant: 'destructive',
      }
    ];

    // Mock the hook to return multiple toasts
    vi.mocked(hooks.useToast).mockImplementation(() => ({
      toasts: mockToasts
    }));

    render(<Toaster />);
    
    // Check that all toast content is rendered
    expect(screen.getByText('First Toast')).toBeInTheDocument();
    expect(screen.getByText('First description')).toBeInTheDocument();
    expect(screen.getByText('Second Toast')).toBeInTheDocument();
    expect(screen.getByText('Second description')).toBeInTheDocument();
  });

  it('should render toast with custom variant', () => {
    // Setup mock toast with different variant
    const mockToasts = [
      {
        id: '1',
        title: 'Warning Toast',
        description: 'This is a warning',
        variant: 'destructive',
      }
    ];

    // Mock the hook to return toast with variant
    vi.mocked(hooks.useToast).mockImplementation(() => ({
      toasts: mockToasts
    }));

    render(<Toaster />);
    
    // Check that toast with correct variant class is rendered
    const toastElement = screen.getByText('Warning Toast').closest('[data-state]');
    expect(toastElement).toHaveClass('destructive');
  });

  it('should render toast without description', () => {
    // Setup mock toast without description
    const mockToasts = [
      {
        id: '1',
        title: 'Title Only Toast',
        variant: 'default',
      }
    ];

    // Mock the hook to return toast without description
    vi.mocked(hooks.useToast).mockImplementation(() => ({
      toasts: mockToasts
    }));

    render(<Toaster />);
    
    // Check that toast title is rendered
    expect(screen.getByText('Title Only Toast')).toBeInTheDocument();
  });

  it('should render toast with action', () => {
    // Create a mock action component
    const ActionComponent = () => <button>Action Button</button>;
    
    // Setup mock toast with action
    const mockToasts = [
      {
        id: '1',
        title: 'Action Toast',
        description: 'Toast with action',
        action: <ActionComponent />,
        variant: 'default',
      }
    ];

    // Mock the hook to return toast with action
    vi.mocked(hooks.useToast).mockImplementation(() => ({
      toasts: mockToasts
    }));

    render(<Toaster />);
    
    // Check that toast with action is rendered
    expect(screen.getByText('Action Toast')).toBeInTheDocument();
    expect(screen.getByText('Toast with action')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });
});