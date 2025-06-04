import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastAction,
  ToastProvider,
  ToastViewport
} from './toast';

// Helper function to wrap components in a ToastProvider
const renderWithToastProvider = (ui: React.ReactNode) => {
  return render(
    <ToastProvider>
      {ui}
      <ToastViewport />
    </ToastProvider>
  );
};

describe('Toast Components', () => {
  it('should render Toast with default variant', () => {
    renderWithToastProvider(
      <Toast>
        <div>Toast Content</div>
      </Toast>
    );
    
    const toast = screen.getByText('Toast Content').closest('[role="status"]');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('bg-background');
  });

  it('should render Toast with destructive variant', () => {
    renderWithToastProvider(
      <Toast variant="destructive">
        <div>Destructive Toast</div>
      </Toast>
    );
    
    const toast = screen.getByText('Destructive Toast').closest('[role="status"]');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('destructive');
  });

  it('should render Toast with custom className', () => {
    renderWithToastProvider(
      <Toast className="custom-class">
        <div>Custom Toast</div>
      </Toast>
    );
    
    const toast = screen.getByText('Custom Toast').closest('[role="status"]');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('custom-class');
  });

  it('should render ToastTitle correctly', () => {
    renderWithToastProvider(
      <Toast>
        <ToastTitle>Toast Title</ToastTitle>
      </Toast>
    );
    
    expect(screen.getByText('Toast Title')).toBeInTheDocument();
    expect(screen.getByText('Toast Title')).toHaveClass('text-sm');
  });

  it('should render ToastDescription correctly', () => {
    renderWithToastProvider(
      <Toast>
        <ToastDescription>Toast Description</ToastDescription>
      </Toast>
    );
    
    expect(screen.getByText('Toast Description')).toBeInTheDocument();
    expect(screen.getByText('Toast Description')).toHaveClass('opacity-90');
  });

  it('should render ToastClose button correctly', () => {
    const onClose = vi.fn();
    
    renderWithToastProvider(
      <Toast>
        <div>Close Test</div>
        <ToastClose onClick={onClose} />
      </Toast>
    );
    
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
    
    // We're just testing that the button renders correctly
    // JSDOM has issues with Radix UI's pointer events
  });

  it('should render ToastAction button correctly', () => {
    const onAction = vi.fn();
    
    renderWithToastProvider(
      <Toast>
        <div>Action Test</div>
        <ToastAction altText="Test Action" onClick={onAction}>
          Action Button
        </ToastAction>
      </Toast>
    );
    
    const actionButton = screen.getByText('Action Button');
    expect(actionButton).toBeInTheDocument();
    
    // We're just testing that the button renders correctly
    // JSDOM has issues with Radix UI's pointer events
  });

  it('should render ToastProvider with ToastViewport', () => {
    render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );

    const viewport = document.querySelector('[role="region"]');
    expect(viewport).toBeInTheDocument();
    const ol = viewport?.querySelector('ol');
    expect(ol).toBeInTheDocument();
    expect(ol).toHaveClass('fixed');
  });

  it('should render a complete toast with all components', () => {
    renderWithToastProvider(
      <Toast>
        <div className="grid gap-1">
          <ToastTitle>Complete Toast</ToastTitle>
          <ToastDescription>This is a full toast example</ToastDescription>
        </div>
        <ToastAction altText="Try again" asChild>
          <button className="action-button">Try again</button>
        </ToastAction>
        <ToastClose />
      </Toast>
    );
    
    expect(screen.getByText('Complete Toast')).toBeInTheDocument();
    expect(screen.getByText('This is a full toast example')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });
});