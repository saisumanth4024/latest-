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

describe('Toast Components', () => {
  it('should render Toast with default variant', () => {
    render(
      <Toast>
        <div>Toast Content</div>
      </Toast>
    );
    
    const toast = screen.getByText('Toast Content').closest('[role="status"]');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('bg-background');
  });

  it('should render Toast with destructive variant', () => {
    render(
      <Toast variant="destructive">
        <div>Destructive Toast</div>
      </Toast>
    );
    
    const toast = screen.getByText('Destructive Toast').closest('[role="status"]');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('destructive');
  });

  it('should render Toast with custom className', () => {
    render(
      <Toast className="custom-class">
        <div>Custom Toast</div>
      </Toast>
    );
    
    const toast = screen.getByText('Custom Toast').closest('[role="status"]');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('custom-class');
  });

  it('should render ToastTitle correctly', () => {
    render(
      <Toast>
        <ToastTitle>Toast Title</ToastTitle>
      </Toast>
    );
    
    expect(screen.getByText('Toast Title')).toBeInTheDocument();
    expect(screen.getByText('Toast Title')).toHaveClass('text-sm');
  });

  it('should render ToastDescription correctly', () => {
    render(
      <Toast>
        <ToastDescription>Toast Description</ToastDescription>
      </Toast>
    );
    
    expect(screen.getByText('Toast Description')).toBeInTheDocument();
    expect(screen.getByText('Toast Description')).toHaveClass('opacity-90');
  });

  it('should render ToastClose and trigger close handler', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Toast>
        <div>Close Test</div>
        <ToastClose onClick={onClose} />
      </Toast>
    );
    
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
    
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render ToastAction and trigger action handler', async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Toast>
        <div>Action Test</div>
        <ToastAction altText="Test Action" onClick={onAction}>
          Action Button
        </ToastAction>
      </Toast>
    );
    
    const actionButton = screen.getByText('Action Button');
    expect(actionButton).toBeInTheDocument();
    
    await user.click(actionButton);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('should render ToastProvider with ToastViewport', () => {
    render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );
    
    const viewport = document.querySelector('[role="region"]');
    expect(viewport).toBeInTheDocument();
    expect(viewport).toHaveClass('fixed');
  });

  it('should render a complete toast with all components', () => {
    render(
      <ToastProvider>
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
        <ToastViewport />
      </ToastProvider>
    );
    
    expect(screen.getByText('Complete Toast')).toBeInTheDocument();
    expect(screen.getByText('This is a full toast example')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });
});